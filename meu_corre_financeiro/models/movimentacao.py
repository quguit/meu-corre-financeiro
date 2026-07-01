from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base, TimestampMixin
import enum

class TipoMovimentacao(str, enum.Enum):
    entrada = "entrada"
    saida   = "saida"
    estorno = "estorno"

class Movimentacao(Base, TimestampMixin):
    """Ledger imutável — cada pagamento gera um registro aqui."""
    __tablename__ = "movimentacoes"

    id         = Column(Integer, primary_key=True, index=True)
    titulo_id  = Column(Integer, ForeignKey("titulos_financeiros.id"), nullable=False)
    conta_id   = Column(Integer, ForeignKey("contas.id"), nullable=False)
    valor      = Column(Numeric(15, 2), nullable=False)
    tipo       = Column(Enum(TipoMovimentacao), nullable=False)
    data_mov   = Column(Date, nullable=False)
    descricao  = Column(String(250))

    titulo = relationship("TituloFinanceiro", back_populates="movimentacoes")
    conta  = relationship("Conta", back_populates="movimentacoes")
