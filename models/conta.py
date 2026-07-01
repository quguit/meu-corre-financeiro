from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base, TimestampMixin
import enum

class TipoConta(str, enum.Enum):
    corrente  = "corrente"
    poupanca  = "poupanca"
    caixa     = "caixa"
    carteira  = "carteira"

class Conta(Base, TimestampMixin):
    __tablename__ = "contas"

    id             = Column(Integer, primary_key=True, index=True)
    usuario_id     = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    nome           = Column(String(100), nullable=False)
    tipo           = Column(Enum(TipoConta), nullable=False)
    saldo_inicial  = Column(Numeric(15, 2), default=0, nullable=False)
    saldo_atual    = Column(Numeric(15, 2), default=0, nullable=False)
    ativa          = Column(Boolean, default=True, nullable=False)

    usuario        = relationship("Usuario", back_populates="contas")
    titulos        = relationship("TituloFinanceiro", back_populates="conta")
    movimentacoes  = relationship("Movimentacao", back_populates="conta")
