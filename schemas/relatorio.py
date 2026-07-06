from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from typing import Optional


class SaldoDiaResposta(BaseModel):
    total_contas: Decimal
    contas: list[dict]


class TituloVencidoResposta(BaseModel):
    id: int
    codigo: str
    descricao: str
    valor_total: Decimal
    valor_pago: Decimal
    saldo_restante: Decimal
    vencimento: date
    dias_atraso: int
    tipo: str

    model_config = {"from_attributes": False}


class FluxoMensalResposta(BaseModel):
    mes: int
    ano: int
    total_entradas: Decimal
    total_saidas: Decimal
    resultado: Decimal


class ProjecaoResposta(BaseModel):
    saldo_atual: Decimal
    total_a_receber: Decimal
    total_a_pagar: Decimal
    saldo_projetado: Decimal
    data_referencia: date
