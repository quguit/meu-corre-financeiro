from pydantic import BaseModel, field_validator
from decimal import Decimal
from datetime import date, datetime
from typing import Optional
from models.titulo import TipoTitulo, SubtipoTitulo, StatusTitulo

class TituloCriar(BaseModel):
    conta_id: int
    tipo: TipoTitulo
    subtipo: SubtipoTitulo = SubtipoTitulo.simples
    descricao: str
    valor_total: Decimal
    vencimento: date
    competencia: Optional[date] = None
    categoria: Optional[str] = None
    observacao: Optional[str] = None

    @field_validator("valor_total")
    @classmethod
    def valor_positivo(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Valor deve ser maior que zero.")
        return v

    @field_validator("descricao")
    @classmethod
    def descricao_nao_vazia(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Descrição não pode ser vazia.")
        return v.strip()

class TituloAtualizar(BaseModel):
    descricao: Optional[str] = None
    vencimento: Optional[date] = None
    categoria: Optional[str] = None
    observacao: Optional[str] = None

class PagamentoInput(BaseModel):
    valor: Decimal
    data_pagamento: date
    descricao: Optional[str] = None

    @field_validator("valor")
    @classmethod
    def valor_positivo(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Valor do pagamento deve ser maior que zero.")
        return v

class TituloResposta(BaseModel):
    id: int
    codigo: str
    tipo: TipoTitulo
    subtipo: SubtipoTitulo
    descricao: str
    valor_total: Decimal
    valor_pago: Decimal
    status: StatusTitulo
    vencimento: date
    categoria: Optional[str]
    observacao: Optional[str]
    criado_em: datetime

    model_config = {"from_attributes": True}