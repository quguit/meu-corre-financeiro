from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.base import Base
from db.session import engine
import models  # noqa

from services.auth.router import router as auth_router
from services.conta.router import router as conta_router
from services.titulo.router import router as titulo_router
from services.parcelamento.router import router as parcelamento_router
from services.cheque.router import router as cheque_router
from services.cartao.router import router as cartao_router
from services.relatorio.router import router as relatorio_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meu Corre Financeiro API",
    description="Sistema de controle financeiro pessoal e empresarial.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Autenticação"])
app.include_router(conta_router, prefix="/contas", tags=["Contas"])
app.include_router(titulo_router, prefix="/titulos", tags=["Títulos"])
app.include_router(parcelamento_router, prefix="/parcelamentos", tags=["Parcelamentos"])
app.include_router(cheque_router, prefix="/cheques", tags=["Cheques"])
app.include_router(cartao_router, prefix="/cartoes", tags=["Cartões"])
app.include_router(relatorio_router, prefix="/relatorios", tags=["Relatórios"])


@app.get("/", tags=["Status"])
def health_check():
    return {"status": "ok", "app": "Meu Corre Financeiro", "versao": "1.0.0"}
