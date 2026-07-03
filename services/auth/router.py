from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from core.dependencies import usuario_atual
from schemas.usuario import UsuarioCriar, UsuarioResposta, LoginInput, TokenResposta
from services.auth.service import AuthService
from models.usuario import Usuario

router = APIRouter()


@router.post("/cadastro", response_model=UsuarioResposta, status_code=201)
def cadastro(dados: UsuarioCriar, db: Session = Depends(get_db)):
    return AuthService(db).cadastrar(dados)


@router.post("/login", response_model=TokenResposta)
def login(dados: LoginInput, db: Session = Depends(get_db)):
    return AuthService(db).login(dados)


@router.get("/me", response_model=UsuarioResposta)
def me(usuario: Usuario = Depends(usuario_atual)):
    return usuario
