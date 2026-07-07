from sqlalchemy.orm import Session
from models.usuario import Usuario
from schemas.usuario import UsuarioCriar, LoginInput
from core.security import hash_senha, verificar_senha, criar_token
from core.exceptions import RegraDeNegocio, NaoAutorizado


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def cadastrar(self, dados: UsuarioCriar) -> Usuario:
        ja_existe = self.db.query(Usuario).filter(Usuario.email == dados.email).first()
        if ja_existe:
            raise RegraDeNegocio("E-mail já cadastrado no sistema.")

        usuario = Usuario(
            nome=dados.nome,
            email=dados.email,
            senha_hash=hash_senha(dados.senha),
            tipo=dados.tipo,
        )
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def login(self, dados: LoginInput) -> dict:
        usuario = (
            self.db.query(Usuario)
            .filter(Usuario.email == dados.email, Usuario.ativo == True)
            .first()
        )

        if not usuario or not verificar_senha(dados.senha, usuario.senha_hash):
            raise NaoAutorizado()

        token = criar_token({"sub": str(usuario.id)})
        return {"access_token": token, "token_type": "bearer", "usuario": usuario}
