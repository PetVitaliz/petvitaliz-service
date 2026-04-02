Home
-”/”
get dos planos
-------------------------------------------------
Serviços
-”/servicos”
------------------------------------------------
Sobre Nos
-”/sobre-nos”
-------------------------------------------------------
Contato
-“/contato”
post
 body {
nome:
email:
mensagem:
}
---------------------------------------------------------
Serviços de Emergencia
-”/servicos-de-emergencia”
----------------------------------------------------------
Cadastro
-”/user/cadastro”
post
 body {
email:
cpf:
primeiro nome:
sobrenome:
data nascimento:
genero:
senha:
telefone
}
--------------------------------------------------------------
Login
-”/user/login”
post
 body {
email:
senha:
}
--------------------------------------------------------------
Agendamento
-”/user/Agendamento”
post e get
get dos id do pet daquele usuário
get dos horários
 body {
serviço:
observacoes:
}
-------------------------------------------
Home Logada
-”/user/home”
get dos planos e nome do usuario
-------------------------------------------
cadastrar pet
-”/user/cadastrar/pet”
post
body {
nome:
especie:
sexo:
data nascimento:
}
-------------------------------
listar pet
-”/user/listar/pet”
get dos id
------------------------------
editar pet
depois de apertar o botao de editar na pagina de listar pega o id
-”/user/editar/pet/:id”
put
body {
nome:
especie:
sexo:
data nascimento:
}
----------------------------
deletar pet
depois de apertar o botao de deletar na pagina de listar, deleta pelo id
-”/user/delete/pet/:id”
delete por id
------------------------------------
esqueci a senha
-”/user/login/esqueci-a-senha”
post
body {
email:
}
verifica se o email existe no db e depois manda um token para resetar a senha
-----------------------------------------------
esqueci a senha (depois do token)
-”/user/login/esqueci-a-senha/:token”
put
body {
senha:
}
depois de receber o token e entrar nele o usuario redefine a senha e atualiza no db
--------------------------------------------------------------------------
consultas
-”/user/consultas”
get dos id da consulta daquele usuário
---------------------------------------------
pagamento
-”/user/planos/pagamento”
put vai pegar o id do plano e aplicar no usuário
-----------------------------------------------------------
planos
-”/user/planos”
get do plano que ta aplicado ao usuario (caso ele tenha)
-----------------------------------------------------------
Login (funcionario)
-”/user/login/funcionario”
post
 body {
registro:
senha:
}
-------------------------------------------------------------
home (funcionario)
-”/funcionario”
get da carga horaria
------------------------------------------
Listar consulta
-”/funcionario/consultas”
get das consultas
--------------------------------------
detalhes consulta
-”/funcionario/consultas/:id”
get de uma consulta especifica
--------------------------------
Atualizar consulta
-”/funcionario/consultas/:id”
put marca a consulta como finalizada
 body {
status:
}
--------------------------------------
Login (adm)
-”/user/login/adm”
post
 body {
user:
senha:
}
-----------------------------
home (adm)
-”/adm”
get
---------------------------------
listar adm
-”/adm/listar/adm”
get dos ids dos adms
------------------------------------
cadastrar adm
-”/adm/listar/adm/cadastrar”
post
 body {
nome:
email:
senha:
ativo:
}
-----------------------------------
editar adm
-”/adm/listar/adm/editar/:id”
put
 body {
nome:
email:
senha:
ativo:
}
-----------------------------------
excluir adm
-”/adm/listar/adm/excluir/:id”
delete
----------------------------------
listar produtos
-”/adm/listar/produtos”
get dos ids dos produtos
---------------------------------------
cadastrar produto
-”/adm/listar/produto/cadastrar”
post
 body {
nome:
descricao:
preco:
beneficios:
}
--------------------------------------
editar produto
-”/adm/listar/produto/editar/:id”
put
 body {
nome:
descricao:
preco:
beneficios:
}
----------------------------------------
excluir adm
-”/adm/listar/produtos/excluir/:id”
delete
-------------------------------------------
listar funcionários
-”/adm/listar/funcionario”
get dos ids dos produtos
---------------------------------------------
cadastrar funcionário
-”/adm/listar/funcionario/cadastrar”
post
 body {
nome:
sobrenome:
especialidade:
registro:
senha:
}
----------------------------------------------
editar funcionário
-”/adm/listar/funcionario/editar/:id”
put
 body {
nome:
sobrenome:
especialidade:
registro:
senha:
}
---------------------------------------------
excluir funcionário
-”/adm/listar/funcionario/excluir/:id”
delete
-----------------------------------------------
visualizar consulta
-”/adm/listar/consultas”
get das consultas por medico
-----------------------------------------------