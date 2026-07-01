from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base, TimestampMixin
import enum

class StatusFatura(str, enum.Enum):
    aberta  = "aberta"
    fechada = "fechada"
    paga    = "paga"

class Cartao(Base, TimestampMixin):
    __tablename__ = "cartoes"

    id              = Column(Integer, primary_key=True)
    usuario_id      = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nome            = Column(String(80), nullable=False)
    bandeira        = Column(String(30))
    dia_fechamento  = Column(Integer, nullable=False)
    dia_vencimento  = Column(Integer, nullable=False)
    limite          = Column(Numeric(15, 2))

    faturas = relationship("FaturaCartao", back_populates="cartao")

class FaturaCartao(Base, TimestampMixin):
    __tablename__ = "faturas_cartao"

    id          = Column(Integer, primary_key=True)
    cartao_id   = Column(Integer, ForeignKey("cartoes.id"), nullable=False)
    titulo_id   = Column(Integer, ForeignKey("titulos_financeiros.id"))
    mes_ref     = Column(Integer, nullable=False)
    ano_ref     = Column(Integer, nullable=False)
    valor_total = Column(Numeric(15, 2), default=0)
    status      = Column(Enum(StatusFatura), default=StatusFatura.aberta)
    vencimento  = Column(Date)

    cartao = relationship("Cartao", back_populates="faturas")
