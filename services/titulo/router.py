from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from core.dependencies import usuario_atual
from models.usuario import Usuario
from schemas.titulo import TituloCriar, TituloAtualizar, PagamentoInput, TituloResposta
from services.titulo.service import TituloService

router = APIRouter()


def get_service(
    db: Session = Depends(get_db), usuario: Usuario = Depends(usuario_atual)
) -> TituloService:
    return TituloService(db, usuario.id)


@router.post("/", response_model=TituloResposta, status_code=201)
def criar(dados: TituloCriar, service: TituloService = Depends(get_service)):
    return service.criar(dados)


@router.get("/", response_model=list[TituloResposta])
def listar(service: TituloService = Depends(get_service)):
    return service.listar()


@router.get("/{titulo_id}", response_model=TituloResposta)
def buscar(titulo_id: int, service: TituloService = Depends(get_service)):
    return service.buscar(titulo_id)


@router.patch("/{titulo_id}", response_model=TituloResposta)
def atualizar(
    titulo_id: int,
    dados: TituloAtualizar,
    service: TituloService = Depends(get_service),
):
    return service.atualizar(titulo_id, dados)


@router.post("/{titulo_id}/pagar", response_model=TituloResposta)
def pagar(
    titulo_id: int, dados: PagamentoInput, service: TituloService = Depends(get_service)
):
    return service.pagar(titulo_id, dados)


@router.delete("/{titulo_id}", status_code=204)
def cancelar(titulo_id: int, service: TituloService = Depends(get_service)):
    service.cancelar(titulo_id)
