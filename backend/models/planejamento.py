from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base
import enum

class TipoPlanejamento(str, enum.Enum):
    reforma  = "reforma"
    compra   = "compra"
    reserva  = "reserva"
    meta     = "meta"

class RecorrenciaPlanejamento(str, enum.Enum):
    unica         = "unica"
    mensal        = "mensal"
    personalizada = "personalizada"

class Planejamento(Base):
    __tablename__ = "planejamentos"

    id               = Column(Integer, primary_key=True)
    titulo_id        = Column(Integer, ForeignKey("titulos_financeiros.id"), nullable=False, unique=True)
    tipo             = Column(Enum(TipoPlanejamento), nullable=False)
    data_alvo        = Column(Date)
    valor_alvo       = Column(Numeric(15, 2), nullable=False)
    valor_acumulado  = Column(Numeric(15, 2), default=0)
    recorrencia      = Column(Enum(RecorrenciaPlanejamento), default=RecorrenciaPlanejamento.unica)

    titulo = relationship("TituloFinanceiro", back_populates="planejamento")
