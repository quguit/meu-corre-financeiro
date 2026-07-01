# Importa todos os models para garantir que o Alembic os detecte
from models.usuario import Usuario
from models.conta import Conta
from models.pessoa import Pessoa
from models.titulo import TituloFinanceiro, TituloPessoa
from models.movimentacao import Movimentacao
from models.parcelamento import Parcelamento
from models.cheque import Cheque
from models.cartao import Cartao, FaturaCartao
from models.planejamento import Planejamento
