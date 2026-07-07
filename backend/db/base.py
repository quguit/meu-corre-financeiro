# Importa todos os models para que o Alembic os detecte nas migrations
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, DateTime, func

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    """Adiciona criado_em e atualizado_em em qualquer model."""
    criado_em = Column(DateTime, server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime, server_default=func.now(),
                           onupdate=func.now(), nullable=False)
