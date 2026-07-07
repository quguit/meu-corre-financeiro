from pydantic import BaseModel, field_validator
from decimal import Decimal
from models.conta import TipoConta


class ContaCriar(BaseModel):
    nome: str
    tipo: TipoConta
    saldo_inicial: Decimal = Decimal("0.00")

    @field_validator("nome")
    @classmethod
    def nome_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nome não pode ser vazio.")
        return v.strip()

    @field_validator("saldo_inicial")
    @classmethod
    def saldo_nao_negativo(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("Saldo inicial não pode ser negativo.")
        return v


class ContaAtualizar(BaseModel):
    nome: str | None = None
    tipo: TipoConta | None = None
    # saldo_atual propositalmente ausente — nunca editável diretamente


class ContaResposta(BaseModel):
    id: int
    nome: str
    tipo: TipoConta
    saldo_inicial: Decimal
    saldo_atual: Decimal
    ativa: bool

    model_config = {"from_attributes": True}
