from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from db.session import get_db
from core.security import decodificar_token
from core.exceptions import NaoAutorizado
from models.usuario import Usuario

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def usuario_atual(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:
    payload = decodificar_token(token)
    usuario_id = payload.get("sub")
    if not usuario_id:
        raise NaoAutorizado()
    usuario = db.query(Usuario).filter(
        Usuario.id == int(usuario_id),
        Usuario.ativo == True
    ).first()
    if not usuario:
        raise NaoAutorizado()
    return usuario
