from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from datetime import datetime

from models.titulo import TituloFinanceiro, StatusTitulo, TipoTitulo
from models.movimentacao import Movimentacao, TipoMovimentacao
from models.conta import Conta
from schemas.titulo import TituloCriar, TituloAtualizar, PagamentoInput
from core.exceptions import NaoEncontrado, RegraDeNegocio


class TituloService:
    def __init__(self, db: Session, usuario_id: int):
        self.db = db
        self.usuario_id = usuario_id

    def _buscar_ou_404(self, titulo_id: int) -> TituloFinanceiro:
        titulo = (
            self.db.query(TituloFinanceiro)
            .filter(
                TituloFinanceiro.id == titulo_id,
                TituloFinanceiro.usuario_id == self.usuario_id,
            )
            .first()
        )
        if not titulo:
            raise NaoEncontrado("Título")
        return titulo

    def _buscar_conta_ou_404(self, conta_id: int) -> Conta:
        conta = (
            self.db.query(Conta)
            .filter(
                Conta.id == conta_id,
                Conta.usuario_id == self.usuario_id,
                Conta.ativa == True,
            )
            .first()
        )
        if not conta:
            raise NaoEncontrado("Conta")
        return conta

    def _gerar_codigo(self, tipo: TipoTitulo) -> str:
        """
        Gera código sequencial por tipo e ano.
        Exemplo: REC-2025-00001, PAG-2025-00002
        """
        prefixo = "REC" if tipo == TipoTitulo.receber else "PAG"
        ano = datetime.now().year
        prefixo_like = f"{prefixo}-{ano}-%"

        ultimo = (
            self.db.query(TituloFinanceiro)
            .filter(
                TituloFinanceiro.codigo.like(prefixo_like),
                TituloFinanceiro.usuario_id == self.usuario_id,
            )
            .order_by(TituloFinanceiro.id.desc())
            .first()
        )

        if ultimo:
            numero = int(ultimo.codigo.split("-")[-1]) + 1
        else:
            numero = 1

        return f"{prefixo}-{ano}-{numero:05d}"

    def criar(self, dados: TituloCriar) -> TituloFinanceiro:
        # Garante que a conta pertence ao usuário
        self._buscar_conta_ou_404(dados.conta_id)

        titulo = TituloFinanceiro(
            usuario_id=self.usuario_id,
            conta_id=dados.conta_id,
            codigo=self._gerar_codigo(dados.tipo),
            tipo=dados.tipo,
            subtipo=dados.subtipo,
            descricao=dados.descricao,
            valor_total=dados.valor_total,
            valor_pago=Decimal("0.00"),
            vencimento=dados.vencimento,
            competencia=dados.competencia,
            categoria=dados.categoria,
            observacao=dados.observacao,
        )
        self.db.add(titulo)
        self.db.commit()
        self.db.refresh(titulo)
        return titulo

    def listar(self) -> list[TituloFinanceiro]:
        return (
            self.db.query(TituloFinanceiro)
            .filter(
                TituloFinanceiro.usuario_id == self.usuario_id,
                TituloFinanceiro.status != StatusTitulo.cancelado,
            )
            .order_by(TituloFinanceiro.vencimento)
            .all()
        )

    def buscar(self, titulo_id: int) -> TituloFinanceiro:
        return self._buscar_ou_404(titulo_id)

    def atualizar(self, titulo_id: int, dados: TituloAtualizar) -> TituloFinanceiro:
        titulo = self._buscar_ou_404(titulo_id)
        if titulo.status == StatusTitulo.quitado:
            raise RegraDeNegocio("Título quitado não pode ser alterado.")
        if titulo.status == StatusTitulo.cancelado:
            raise RegraDeNegocio("Título cancelado não pode ser alterado.")
        if dados.descricao is not None:
            titulo.descricao = dados.descricao
        if dados.vencimento is not None:
            titulo.vencimento = dados.vencimento
        if dados.categoria is not None:
            titulo.categoria = dados.categoria
        if dados.observacao is not None:
            titulo.observacao = dados.observacao
        self.db.commit()
        self.db.refresh(titulo)
        return titulo

    def pagar(self, titulo_id: int, dados: PagamentoInput) -> TituloFinanceiro:
        """
        Registra um pagamento — a operação mais importante do sistema.
        Tudo acontece em uma transação: movimentação + saldo da conta + status do título.
        """
        titulo = self._buscar_ou_404(titulo_id)
        conta = self._buscar_conta_ou_404(titulo.conta_id)

        if titulo.status == StatusTitulo.quitado:
            raise RegraDeNegocio("Título já está quitado.")
        if titulo.status == StatusTitulo.cancelado:
            raise RegraDeNegocio("Título cancelado não pode ser pago.")

        saldo_restante = titulo.valor_total - titulo.valor_pago
        if dados.valor > saldo_restante:
            raise RegraDeNegocio(
                f"Valor do pagamento ({dados.valor}) maior que o saldo restante ({saldo_restante})."
            )

        # 1. Atualiza o título
        titulo.valor_pago += dados.valor
        if titulo.valor_pago >= titulo.valor_total:
            titulo.status = StatusTitulo.quitado
            titulo.quitado_em = datetime.now()
        else:
            titulo.status = StatusTitulo.parcial

        # 2. Cria a movimentação (ledger imutável)
        tipo_mov = (
            TipoMovimentacao.entrada
            if titulo.tipo == TipoTitulo.receber
            else TipoMovimentacao.saida
        )

        movimentacao = Movimentacao(
            titulo_id=titulo.id,
            conta_id=conta.id,
            valor=dados.valor,
            tipo=tipo_mov,
            data_mov=dados.data_pagamento,
            descricao=dados.descricao or f"Pagamento: {titulo.descricao}",
        )
        self.db.add(movimentacao)

        # 3. Atualiza saldo da conta
        if tipo_mov == TipoMovimentacao.entrada:
            conta.saldo_atual += dados.valor
        else:
            conta.saldo_atual -= dados.valor

        # Tudo ou nada — uma transação só
        self.db.commit()
        self.db.refresh(titulo)
        return titulo

    def cancelar(self, titulo_id: int) -> None:
        titulo = self._buscar_ou_404(titulo_id)
        if titulo.status == StatusTitulo.quitado:
            raise RegraDeNegocio("Título quitado não pode ser cancelado.")
        if titulo.status == StatusTitulo.cancelado:
            raise RegraDeNegocio("Título já está cancelado.")
        titulo.status = StatusTitulo.cancelado
        self.db.commit()
