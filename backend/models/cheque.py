from sqlalchemy import Column, Integer, String, Numeric, Date, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base
import enum

class StatusCheque(str, enum.Enum):
    em_carteira = "em_carteira"
    compensado  = "compensado"
    devolvido   = "devolvido"
    trocado     = "trocado"
    cancelado   = "cancelado"

class Cheque(Base):
    __tablename__ = "cheques"

    id                    = Column(Integer, primary_key=True)
    titulo_id             = Column(Integer, ForeignKey("titulos_financeiros.id"), nullable=False, unique=True)
    numero_cheque         = Column(String(20), nullable=False)
    banco                 = Column(String(80))
    agencia               = Column(String(10))
    conta_bancaria        = Column(String(20))
    data_emissao          = Column(Date)
    data_bom_para         = Column(Date)
    foi_trocado           = Column(Boolean, default=False)
    percentual_abatimento = Column(Numeric(5, 2), default=0)
    valor_abatimento      = Column(Numeric(15, 2), default=0)
    status                = Column(Enum(StatusCheque), default=StatusCheque.em_carteira)

    titulo = relationship("TituloFinanceiro", back_populates="cheque")
