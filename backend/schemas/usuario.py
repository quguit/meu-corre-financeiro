from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from models.usuario import TipoUsuario


class UsuarioCriar(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    tipo: TipoUsuario = TipoUsuario.pessoal

    @field_validator("senha")
    @classmethod
    def senha_minima(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Senha deve ter no mínimo 6 caracteres.")
        return v

    @field_validator("nome")
    @classmethod
    def nome_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nome não pode ser vazio.")
        return v.strip()


class UsuarioResposta(BaseModel):
    id: int
    nome: str
    email: str
    tipo: TipoUsuario
    ativo: bool
    criado_em: datetime

    model_config = {"from_attributes": True}


class LoginInput(BaseModel):
    email: EmailStr
    senha: str


class TokenResposta(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResposta
