from sqlalchemy.orm import Session
from models.conta import Conta
from schemas.conta import ContaCriar, ContaAtualizar
from core.exceptions import NaoEncontrado, RegraDeNegocio


class ContaService:
    def __init__(self, db: Session, usuario_id: int):
        self.db = db
        self.usuario_id = usuario_id

    def _buscar_ou_404(self, conta_id: int) -> Conta:
        conta = (
            self.db.query(Conta)
            .filter(
                Conta.id == conta_id,
                Conta.usuario_id == self.usuario_id,  # isolamento garantido aqui
            )
            .first()
        )
        if not conta:
            raise NaoEncontrado("Conta")
        return conta

    def criar(self, dados: ContaCriar) -> Conta:
        conta = Conta(
            usuario_id=self.usuario_id,
            nome=dados.nome,
            tipo=dados.tipo,
            saldo_inicial=dados.saldo_inicial,
            saldo_atual=dados.saldo_inicial,  # começa igual ao inicial
        )
        self.db.add(conta)
        self.db.commit()
        self.db.refresh(conta)
        return conta

    def listar(self) -> list[Conta]:
        return (
            self.db.query(Conta)
            .filter(Conta.usuario_id == self.usuario_id, Conta.ativa == True)
            .all()
        )

    def buscar(self, conta_id: int) -> Conta:
        return self._buscar_ou_404(conta_id)

    def atualizar(self, conta_id: int, dados: ContaAtualizar) -> Conta:
        conta = self._buscar_ou_404(conta_id)
        if dados.nome is not None:
            conta.nome = dados.nome
        if dados.tipo is not None:
            conta.tipo = dados.tipo
        self.db.commit()
        self.db.refresh(conta)
        return conta

    def desativar(self, conta_id: int) -> None:
        conta = self._buscar_ou_404(conta_id)
        if not conta.ativa:
            raise RegraDeNegocio("Conta já está desativada.")
        conta.ativa = False
        self.db.commit()
