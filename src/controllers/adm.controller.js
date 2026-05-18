import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

// Home

export async function home_adm(req, res) {
    return res.status(200).send({
        pagina: "Home Administrador"
    })
}

// LOGOUT

export async function logout_adm(req, res) {
    return res.clearCookie('token_adm') .status(200).send({
        message: "Logout realizado com sucesso"
    });
}

// CADASTRAR ADM

export async function cadastro_adm(req, res) {
    const {username, email, senha, ativo} = req.body

    try {
        if(!username || typeof username !== "string" || username.length < 2){
            return res.status(400).send("username é obrigatorio e deve ter pelo menos 2 caracteres")
        }
    
        if (!email || typeof email !== "string"){
            return res.status(400).send("email é obrigatorio")
        }
    
        if(!senha || typeof senha !== "string" || senha.length < 6){
            return res.status(400).send("senha é obrigatorio e deve ter pelo menos 6 caracteres")
        }
        
        if (ativo === undefined) {
            return res.status(400).send("ativo é obrigatorio ")
        }

        if(typeof ativo !== 'boolean'){
            return res.status(400).send("ativo deve ser 'true' ou 'false' ")
        }
    
        const existing = await prisma.administrador.findFirst({
            where: { ADM_EMAIL: email.trim().toLowerCase() }
        })
    
        const existing2 = await prisma.administrador.findFirst({
            where: { ADM_NOME: username.trim().toLowerCase() }
        })
    
        if(existing){
            return res.status(400).send("Email ja cadastrado")
        }
    
        if(existing2){
            return res.status(400).send("Username ja cadastrado")
        }
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
        
        const administrador = await prisma.administrador.create({
            data: {
                ADM_NOME: username.trim(),
                ADM_ATIVO: ativo,
                ADM_EMAIL: email.trim().toLowerCase(),
                ADM_SENHA: hashedPassword
            }
        })
    
        return res.status(201).send("Administrador cadastrado com sucesso")
    } catch (error) {
        console.error("erro ao atualizar a senha", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Listar ADM

export async function listar_adm(req, res) {
    try {
        const adms = await prisma.administrador.findMany({
            select: {
                ADM_ID: true,
                ADM_NOME: true,
                ADM_EMAIL: true,
                ADM_ATIVO: true
            }
        })
        return res.status(200).send({
            ADMs: adms
        })
    } catch (error) {
        console.error("erro ao listar adms", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Listar adm especifico

export async function listar_adm_esp(req, res) {
    const id_adm = Number(req.params.id)

    try {

        if (!id_adm) {
            return res.status(404).send({
                mensagem: "ID invalido"
            })
        }

        const adm = await prisma.administrador.findMany({
            where: { ADM_ID: id_adm },
            select: {
                ADM_ID: true,
                ADM_NOME: true,
                ADM_EMAIL: true,
                ADM_ATIVO: true
            }
        })

        if (!adm) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

        return res.status(200).send({
            ADMs: adm
        })
    } catch (error) {
        console.error("erro ao listar adms", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Editar ADM

export async function editar_adm(req, res) {
    const id_adm = Number(req.params.id)
    const { username, email, senha, ativo } = req.body

    try {

        if (!id_adm) {
            return res.status(404).send({
                mensagem: "Id invalido"
            })
        }

        const existeADM = await prisma.administrador.findUnique({
            where: { ADM_ID: id_adm }
        })

        if (!existeADM) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

        if(!username || typeof username !== "string" || username.length < 2){
            return res.status(400).send("username é obrigatorio e deve ter pelo menos 2 caracteres")
        }
    
        if (!email || typeof email !== "string"){
            return res.status(400).send("email é obrigatorio")
        }
    
        if(!senha || typeof senha !== "string" || senha.length < 6){
            return res.status(400).send("senha é obrigatorio e deve ter pelo menos 6 caracteres")
        }
        
        if (ativo === undefined) {
            return res.status(400).send("ativo é obrigatorio ")
        }

        if(typeof ativo !== 'boolean'){
            return res.status(400).send("ativo deve ser 'true' ou 'false' ")
        }

        const existing = await prisma.administrador.findFirst({
            where: { ADM_EMAIL: email.trim().toLowerCase(),
                NOT: { ADM_ID: id_adm }
             }
        })
    
        const existing2 = await prisma.administrador.findFirst({
            where: { ADM_NOME: username.trim().toLowerCase(),
                NOT: { ADM_ID: id_adm }
             }
        })
    
        if(existing){
            return res.status(400).send("Email ja cadastrado")
        }
    
        if(existing2){
            return res.status(400).send("Username ja cadastrado")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
    
        const novo_ADM = await prisma.administrador.update({
            where: { ADM_ID: id_adm },
            data: {
                ADM_NOME: username,
                ADM_EMAIL: email,
                ADM_SENHA: hashedPassword,
                ADM_ATIVO: ativo
            }
        })
        
        return res.status(200).send({
            mensagem: "Administrador editado com sucesso",
            ADM: novo_ADM
        })
    } catch (error) {
        console.error("erro ao editar adm", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }    
}


// Excluir ADM

export async function excluir_adm(req, res) {
    const id_adm = Number(req.params.id)

   try {

    if (!id_adm) {
        return res.status(404).send("Id invalido")
    }
    
    const existeADM = await prisma.administrador.findUnique({
        where: { ADM_ID: id_adm }
    })

    if (!existeADM) {
        return res.status(404).send({
            mensagem: "Id não encontrado"
        })
    }
    
    const deletarADM = await prisma.administrador.delete({
        where: { ADM_ID: id_adm }
    })

    const adms = await prisma.administrador.findMany({
        select: {
            ADM_ID: true,
            ADM_NOME: true,
            ADM_EMAIL: true,
            ADM_ATIVO: true
        }
    })

    return res.status(200).send({
        mensagem: "Administrador deletado com sucesso",
        ADMs: adms
    })
    
   } catch (error) {
        console.error("erro ao excluir adms", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
   }
}


// Cadastrar Funcionario

export async function cadastar_funcionario(req, res) {
    const { nome, sobrenome, especialidade, registro, ativo, senha } = req.body

    try {
        if(!nome || typeof nome !== "string" || nome.length < 2){
            return res.status(400).send("nome é obrigatorio e deve ter pelo menos 2 caracteres")
        }

        if(!sobrenome || typeof sobrenome !== "string" || sobrenome.length < 2){
            return res.status(400).send("sobrenome é obrigatorio e deve ter pelo menos 2 caracteres")
        }
    
        if (!especialidade || typeof especialidade !== "string"){
            return res.status(400).send("email é obrigatorio")
        }
        
        const especialidade_lower = especialidade.toLowerCase()
        if(!especialidade_lower || typeof especialidade_lower !== "string" || (especialidade_lower !== "veterinario" && especialidade_lower !== "tosador")){
            return res.status(400).send("especialidade é obrigatorio, no momento temos apenas 'veterinario' e 'tosador' ")
        }
        
        if (!registro || typeof registro !== "string"){
            return res.status(400).send("registro é obrigatorio")
        }

        if(!senha || typeof senha !== "string" || senha.length < 6){
            return res.status(400).send("senha é obrigatorio e deve ter pelo menos 6 caracteres")
        }
        
        if (ativo === undefined) {
            return res.status(400).send("ativo é obrigatorio ")
        }

        if(typeof ativo !== 'boolean'){
            return res.status(400).send("ativo deve ser 'true' ou 'false' ")
        }
    
        const existing = await prisma.funcionario.findFirst({
            where: { registro: registro.trim() }
        })
    
        if(existing){
            return res.status(400).send("Registro ja cadastrado")
        }
    
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
        
        const funcionario = await prisma.funcionario.create({
            data: {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                especialidade: especialidade_lower.trim(),
                registro: registro.trim(),
                ativo: ativo,
                carga: 8,
                senha: hashedPassword
            }
        })
    
        return res.status(201).send("Funcionario cadastrado com sucesso")
    } catch (error) {
        console.error("erro ao cadastrar funcionario", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Listar Funcionario

export async function listar_funcionario(req, res) {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            select: {
                id_funcionario: true,
                nome: true,
                sobrenome: true,
                especialidade: true,
                registro: true,
                ativo: true,
                senha: true
            }
        })
        return res.status(200).send({
            funcionarios: funcionarios
        })
    } catch (error) {
        console.error("erro ao listar funcionarios", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Listar funcionario especifico

export async function listar_funcionario_esp(req, res) {
    const id_funcionario = Number(req.params.id)

    try {
        if (!id_funcionario) {
            return res.status(404).send({
                mensagem: "ID invalido"
            })
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { id_funcionario: id_funcionario },
            select: {
                id_funcionario: true,
                nome: true,
                sobrenome: true,
                especialidade: true,
                registro: true,
                ativo: true
            }
        })

        if (!funcionario) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

        return res.status(200).send({
            funcionario: funcionario
        })
    } catch (error) {
        console.error("erro ao listar funcionario especifico", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Editar funcionario

export async function editar_funcionario(req, res) {
    const id_funcionario = Number(req.params.id)
    const { nome, sobrenome, especialidade, registro, ativo, senha } = req.body

    try {

        if (!id_funcionario) {
            return res.status(404).send({
                mensagem: "ID invalido"
            })
        }

        const existeFuncionario = await prisma.funcionario.findUnique({
            where: { id_funcionario: id_funcionario }
        })

        if (!existeFuncionario) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

        if(!nome || typeof nome !== "string" || nome.length < 2){
            return res.status(400).send("nome é obrigatorio e deve ter pelo menos 2 caracteres")
        }

        if(!sobrenome || typeof sobrenome !== "string" || sobrenome.length < 2){
            return res.status(400).send("sobrenome é obrigatorio e deve ter pelo menos 2 caracteres")
        }
    
        if (!especialidade || typeof especialidade !== "string"){
            return res.status(400).send("email é obrigatorio")
        }
        
        const especialidade_lower = especialidade.toLowerCase()
        if(!especialidade_lower || typeof especialidade_lower !== "string" || (especialidade_lower !== "veterinario" && especialidade_lower !== "tosador")){
            return res.status(400).send("especialidade é obrigatorio, no momento temos apenas 'veterinario' e 'tosador' ")
        }
        
        if (!registro || typeof registro !== "string"){
            return res.status(400).send("registro é obrigatorio")
        }

        if(!senha || typeof senha !== "string" || senha.length < 6){
            return res.status(400).send("senha é obrigatorio e deve ter pelo menos 6 caracteres")
        }
        
        if (ativo === undefined) {
            return res.status(400).send("ativo é obrigatorio ")
        }

        if(typeof ativo !== 'boolean'){
            return res.status(400).send("ativo deve ser 'true' ou 'false' ")
        }
    
        const existing = await prisma.funcionario.findFirst({
            where: { registro: registro.trim(),
                NOT: { id_funcionario: id_funcionario }
             }
        })
    
        if(existing){
            return res.status(400).send("Registro ja cadastrado")
        }
    
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
        
        const novo_funcionario = await prisma.funcionario.update({
            where: { id_funcionario: id_funcionario },
            data: {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                especialidade: especialidade_lower.trim(),
                registro: registro.trim(),
                ativo: ativo,
                carga: 8,
                senha: hashedPassword
            }
        })

        return res.status(200).send({
            mensagem: "Funcionario editado com sucesso",
            funcionario: novo_funcionario
        })
    } catch (error) {
        console.error("erro ao editar funcionario", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }    
}


// Excluir funcionario

export async function excluir_funcionario(req, res) {
    const id_funcionario = Number(req.params.id)

   try {

    if (!id_funcionario) {
        return res.status(404).send("Id invalido")
    }

    const existeFuncionario = await prisma.funcionario.findUnique({
        where: { id_funcionario: id_funcionario }
    })

    if (!existeFuncionario) {
        return res.status(404).send({
            mensagem: "Id não encontrado"
        })
    }

    const deletarFuncionario = await prisma.funcionario.delete({
        where: { id_funcionario: id_funcionario }
    })

    const funcionario = await prisma.funcionario.findMany({
        select: {
            id_funcionario: true,
            nome: true,
            sobrenome: true,
            especialidade: true,
            registro: true,
            ativo: true,
            senha: true
        }, orderBy: {
            id_funcionario: 'desc',
          } 
    })

    return res.status(200).send({
        mensagem: "Funcionario deletado com sucesso",
        funcionarios: funcionario
    })
    
   } catch (error) {
        console.error("erro ao excluir funcionario", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
   }
}

// Cadastrar Produto



// Listar Produtos



// Editar Produto



// Excluir Produto