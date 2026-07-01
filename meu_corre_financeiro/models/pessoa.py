from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base, TimestampMixin
import enum

class TipoPessoa(str, enum.Enum):
    cliente     = "cliente"
    fornecedor  = "fornecedor"
    funcionario = "funcionario"
    outro       = "outro"

class Pessoa(Base, TimestampMixin):
    __tablename__ = "pessoas"

    id         = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    nome       = Column(String(150), nullable=False)
    tipo       = Column(Enum(TipoPessoa), nullable=False)
    documento  = Column(String(30))
    contato    = Column(String(200))
    ativo      = Column(Boolean, default=True)

    usuario    = relationship("Usuario", back_populates="pessoas")
    titulos_pessoa = relationship("TituloPessoa", back_populates="pessoa")
