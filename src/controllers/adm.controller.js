import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

// Home

export async function home_adm(req, res) {
    return res.status(200).send({
        pagina: "Home Administrador"
    })
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
    
        if(!ativo || typeof ativo !== 'boolean' || (ativo !== true && ativo !== false)){
            return res.status(400).send("ativo é obrigatorio e deve ser 'true' ou 'false' ")
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

// LOGOUT

export async function logout_adm(req, res) {
    return res.clearCookie('token') .status(200).send({
        message: "Logout realizado com sucesso"
    });
}