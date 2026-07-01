from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
from db.base import Base, TimestampMixin
import enum

class TipoUsuario(str, enum.Enum):
    pessoal = "pessoal"
    empresa = "empresa"

class Usuario(Base, TimestampMixin):
    __tablename__ = "usuarios"

    id        = Column(Integer, primary_key=True, index=True)
    nome      = Column(String(120), nullable=False)
    email     = Column(String(200), unique=True, nullable=False, index=True)
    senha_hash = Column(String(256), nullable=False)
    tipo      = Column(Enum(TipoUsuario), default=TipoUsuario.pessoal, nullable=False)
    ativo     = Column(Boolean, default=True, nullable=False)

    contas    = relationship("Conta",   back_populates="usuario")
    pessoas   = relationship("Pessoa",  back_populates="usuario")
    titulos   = relationship("TituloFinanceiro", back_populates="usuario")
