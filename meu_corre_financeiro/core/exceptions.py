from fastapi import HTTPException, status

class NaoEncontrado(HTTPException):
    def __init__(self, recurso: str):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND,
                         detail=f"{recurso} não encontrado.")

class NaoAutorizado(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED,
                         detail="Credenciais inválidas.",
                         headers={"WWW-Authenticate": "Bearer"})

class AcessoNegado(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN,
                         detail="Acesso negado.")

class RegraDeNegocio(HTTPException):
    def __init__(self, detalhe: str):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                         detail=detalhe)
