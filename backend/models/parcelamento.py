from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base
import enum

class StatusParcela(str, enum.Enum):
    aberta      = "aberta"
    paga        = "paga"
    amortizada  = "amortizada"
    cancelada   = "cancelada"

class TipoAmortizacao(str, enum.Enum):
    normal               = "normal"
    quitacao             = "quitacao"
    quitacao_com_desconto = "quitacao_com_desconto"

class Parcelamento(Base):
    __tablename__ = "parcelamentos"

    id               = Column(Integer, primary_key=True, index=True)
    titulo_pai_id    = Column(Integer, ForeignKey("titulos_financeiros.id"), nullable=False, index=True)
    numero_parcela   = Column(Integer, nullable=False)
    total_parcelas   = Column(Integer, nullable=False)
    valor_parcela    = Column(Numeric(15, 2), nullable=False)
    vencimento       = Column(Date, nullable=False)
    status           = Column(Enum(StatusParcela), default=StatusParcela.aberta, nullable=False)
    data_pagamento   = Column(Date)
    valor_pago       = Column(Numeric(15, 2), default=0)
    tipo_amortizacao = Column(Enum(TipoAmortizacao), default=TipoAmortizacao.normal)
    observacao       = Column(String(250))

    titulo_pai = relationship("TituloFinanceiro", back_populates="parcelas")
