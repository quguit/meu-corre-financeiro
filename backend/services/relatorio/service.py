from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from decimal import Decimal
from datetime import date

from models.conta import Conta
from models.titulo import TituloFinanceiro, StatusTitulo, TipoTitulo
from models.movimentacao import Movimentacao, TipoMovimentacao


class RelatorioService:
    def __init__(self, db: Session, usuario_id: int):
        self.db = db
        self.usuario_id = usuario_id

    def saldo_dia(self) -> dict:
        """
        Retorna saldo atual de cada conta ativa e o total consolidado.
        Ensina: query simples com filtro + agregação em Python.
        """
        contas = (
            self.db.query(Conta)
            .filter(Conta.usuario_id == self.usuario_id, Conta.ativa == True)
            .all()
        )

        lista = [
            {"id": c.id, "nome": c.nome, "tipo": c.tipo, "saldo_atual": c.saldo_atual}
            for c in contas
        ]
        total = sum(c.saldo_atual for c in contas) or Decimal("0.00")

        return {"total_contas": total, "contas": lista}

    def titulos_vencidos(self) -> list[dict]:
        """
        Títulos com vencimento anterior a hoje e status aberto ou parcial.
        Ensina: filtro com múltiplas condições e cálculo de dias de atraso.
        """
        hoje = date.today()

        titulos = (
            self.db.query(TituloFinanceiro)
            .filter(
                TituloFinanceiro.usuario_id == self.usuario_id,
                TituloFinanceiro.vencimento < hoje,
                TituloFinanceiro.status.in_(
                    [StatusTitulo.aberto, StatusTitulo.parcial]
                ),
            )
            .order_by(TituloFinanceiro.vencimento)
            .all()
        )

        resultado = []
        for t in titulos:
            saldo_restante = t.valor_total - t.valor_pago
            dias_atraso = (hoje - t.vencimento).days
            resultado.append(
                {
                    "id": t.id,
                    "codigo": t.codigo,
                    "descricao": t.descricao,
                    "valor_total": t.valor_total,
                    "valor_pago": t.valor_pago,
                    "saldo_restante": saldo_restante,
                    "vencimento": t.vencimento,
                    "dias_atraso": dias_atraso,
                    "tipo": t.tipo,
                }
            )
        return resultado

    def fluxo_mensal(self, mes: int, ano: int) -> dict:
        """
        Total de entradas e saídas do mês via movimentações.
        Ensina: SUM com GROUP BY via SQLAlchemy — a query mais importante de relatórios.
        """
        # Query de agregação — SUM das movimentações do período
        resultado = (
            self.db.query(
                Movimentacao.tipo, func.sum(Movimentacao.valor).label("total")
            )
            .join(TituloFinanceiro, Movimentacao.titulo_id == TituloFinanceiro.id)
            .filter(
                TituloFinanceiro.usuario_id == self.usuario_id,
                func.extract("month", Movimentacao.data_mov) == mes,
                func.extract("year", Movimentacao.data_mov) == ano,
                Movimentacao.tipo != TipoMovimentacao.estorno,
            )
            .group_by(Movimentacao.tipo)
            .all()
        )

        entradas = Decimal("0.00")
        saidas = Decimal("0.00")
        for tipo, total in resultado:
            if tipo == TipoMovimentacao.entrada:
                entradas = total or Decimal("0.00")
            elif tipo == TipoMovimentacao.saida:
                saidas = total or Decimal("0.00")

        return {
            "mes": mes,
            "ano": ano,
            "total_entradas": entradas,
            "total_saidas": saidas,
            "resultado": entradas - saidas,
        }

    def projecao(self, ate: date) -> dict:
        """
        Saldo atual + o que está previsto para entrar/sair até a data informada.
        Ensina: SUM com filtro de data futura.
        """
        # Saldo atual consolidado
        contas = (
            self.db.query(Conta)
            .filter(Conta.usuario_id == self.usuario_id, Conta.ativa == True)
            .all()
        )
        saldo_atual = sum(c.saldo_atual for c in contas) or Decimal("0.00")

        # Títulos abertos/parciais com vencimento até a data
        titulos = (
            self.db.query(TituloFinanceiro)
            .filter(
                TituloFinanceiro.usuario_id == self.usuario_id,
                TituloFinanceiro.vencimento <= ate,
                TituloFinanceiro.status.in_(
                    [StatusTitulo.aberto, StatusTitulo.parcial]
                ),
            )
            .all()
        )

        a_receber = sum(
            t.valor_total - t.valor_pago
            for t in titulos
            if t.tipo == TipoTitulo.receber
        ) or Decimal("0.00")

        a_pagar = sum(
            t.valor_total - t.valor_pago for t in titulos if t.tipo == TipoTitulo.pagar
        ) or Decimal("0.00")

        return {
            "saldo_atual": saldo_atual,
            "total_a_receber": a_receber,
            "total_a_pagar": a_pagar,
            "saldo_projetado": saldo_atual + a_receber - a_pagar,
            "data_referencia": ate,
        }
