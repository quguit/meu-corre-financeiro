from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from core.dependencies import usuario_atual
from models.usuario import Usuario
from schemas.conta import ContaCriar, ContaAtualizar, ContaResposta
from services.conta.service import ContaService

router = APIRouter()


def get_service(
    db: Session = Depends(get_db), usuario: Usuario = Depends(usuario_atual)
) -> ContaService:
    return ContaService(db, usuario.id)


@router.post("/", response_model=ContaResposta, status_code=201)
def criar(dados: ContaCriar, service: ContaService = Depends(get_service)):
    return service.criar(dados)


@router.get("/", response_model=list[ContaResposta])
def listar(service: ContaService = Depends(get_service)):
    return service.listar()


@router.get("/{conta_id}", response_model=ContaResposta)
def buscar(conta_id: int, service: ContaService = Depends(get_service)):
    return service.buscar(conta_id)


@router.patch("/{conta_id}", response_model=ContaResposta)
def atualizar(
    conta_id: int, dados: ContaAtualizar, service: ContaService = Depends(get_service)
):
    return service.atualizar(conta_id, dados)


@router.delete("/{conta_id}", status_code=204)
def desativar(conta_id: int, service: ContaService = Depends(get_service)):
    service.desativar(conta_id)
