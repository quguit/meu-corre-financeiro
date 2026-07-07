from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from db.session import get_db
from core.dependencies import usuario_atual
from models.usuario import Usuario
from services.relatorio.service import RelatorioService

router = APIRouter()


def get_service(
    db: Session = Depends(get_db), usuario: Usuario = Depends(usuario_atual)
) -> RelatorioService:
    return RelatorioService(db, usuario.id)


@router.get("/saldo-dia")
def saldo_dia(service: RelatorioService = Depends(get_service)):
    return service.saldo_dia()


@router.get("/titulos-vencidos")
def titulos_vencidos(service: RelatorioService = Depends(get_service)):
    return service.titulos_vencidos()


@router.get("/fluxo-mensal")
def fluxo_mensal(
    mes: int = Query(..., ge=1, le=12),
    ano: int = Query(..., ge=2020),
    service: RelatorioService = Depends(get_service),
):
    return service.fluxo_mensal(mes, ano)


@router.get("/projecao")
def projecao(
    ate: date = Query(default=None), service: RelatorioService = Depends(get_service)
):
    if ate is None:
        from datetime import timedelta

        ate = date.today() + timedelta(days=30)
    return service.projecao(ate)
