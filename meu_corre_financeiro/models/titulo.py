from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from db.base import Base, TimestampMixin
import enum

class TipoTitulo(str, enum.Enum):
    receber = "receber"
    pagar   = "pagar"

class SubtipoTitulo(str, enum.Enum):
    simples      = "simples"
    parcelado    = "parcelado"
    cheque       = "cheque"
    cartao       = "cartao"
    planejamento = "planejamento"

class StatusTitulo(str, enum.Enum):
    aberto    = "aberto"
    parcial   = "parcial"
    quitado   = "quitado"
    cancelado = "cancelado"

class TituloFinanceiro(Base, TimestampMixin):
    __tablename__ = "titulos_financeiros"

    id           = Column(Integer, primary_key=True, index=True)
    usuario_id   = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    conta_id     = Column(Integer, ForeignKey("contas.id"), nullable=False)
    codigo       = Column(String(30), unique=True, nullable=False, index=True)
    tipo         = Column(Enum(TipoTitulo), nullable=False)
    subtipo      = Column(Enum(SubtipoTitulo), nullable=False)
    descricao    = Column(String(250), nullable=False)
    valor_total  = Column(Numeric(15, 2), nullable=False)
    valor_pago   = Column(Numeric(15, 2), default=0, nullable=False)
    status       = Column(Enum(StatusTitulo), default=StatusTitulo.aberto, nullable=False)
    vencimento   = Column(Date, nullable=False)
    competencia  = Column(Date)
    categoria    = Column(String(80))
    observacao   = Column(String(500))
    quitado_em   = Column(DateTime)

    usuario      = relationship("Usuario", back_populates="titulos")
    conta        = relationship("Conta", back_populates="titulos")
    pessoas      = relationship("TituloPessoa", back_populates="titulo")
    movimentacoes = relationship("Movimentacao", back_populates="titulo")
    parcelas     = relationship("Parcelamento", back_populates="titulo_pai")
    cheque       = relationship("Cheque", back_populates="titulo", uselist=False)
    planejamento = relationship("Planejamento", back_populates="titulo", uselist=False)

class TituloPessoa(Base):
    """Associação entre título e pessoa — com papel e ordem para rastrear circulação."""
    __tablename__ = "titulos_pessoas"

    id           = Column(Integer, primary_key=True)
    titulo_id    = Column(Integer, ForeignKey("titulos_financeiros.id"), nullable=False)
    pessoa_id    = Column(Integer, ForeignKey("pessoas.id"), nullable=False)
    papel        = Column(String(30), nullable=False)  # emissor, beneficiario, avalista, endossado
    ordem        = Column(Integer, default=1)
    associado_em = Column(DateTime)

    titulo  = relationship("TituloFinanceiro", back_populates="pessoas")
    pessoa  = relationship("Pessoa", back_populates="titulos_pessoa")
