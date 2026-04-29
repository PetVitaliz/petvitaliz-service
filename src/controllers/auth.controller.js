import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

// CADASTRO USER
export async function cadastro(req, res) {
    const {email, CPF, nome, sobrenome, data_nascimento, genero, senha, telefone} = req.body

    if(!nome || typeof nome !== "string" || nome.length < 2){
        return res.status(400).send("nome é obrigatorio e deve ter pelo menos 2 caracteres")
    }

    if(!sobrenome || typeof sobrenome !== "string" || sobrenome.length < 5){
        return res.status(400).send("sobrenome é obrigatorio e deve ter pelo menos 3 caracteres")
    }

    if (!email || typeof email !== "string"){
        return res.status(400).send("email é obrigatorio")
    }

    if(!senha || typeof senha !== "string" || senha < 6){
        return res.status(400).send("password é obrigatorio e deve ter pelo menos 6 caracteres")
    }

    if(!CPF || typeof CPF !== "string" || CPF.length < 11){
        return res.status(400).send("CPF é obrigatorio e deve ter 11 digitos")
    }

    if(!telefone || typeof telefone !== "string" || telefone.length < 11){
        return res.status(400).send("telefone é obrigatorio e deve ter 11 digitos")
    }


    if(!genero || typeof genero !== "string" || (genero !== "m" && genero !== "f" && genero !== "o")){
        return res.status(400).send("genero é obrigatorio e deve ser 'f', 'm' ou 'o' ")
    }

        if(!data_nascimento || typeof data_nascimento != "string"){
            return res.status(400).send("data de nascimento é obrigatorio e precisa ser ano-mes-dia")
        }    

    const existing = await prisma.usuario.findUnique({
        where: { email: email.trim().toLowerCase() }
    })

    const existing2 = await prisma.usuario.findUnique({
        where: { CPF: CPF.trim().toLowerCase() }
    })

    if(existing){
        return res.status(400).send("Email ja cadastrado")
    }

    if(existing2){
        return res.status(400).send("CPF ja cadastrado")
    }

    const hashedPassword = await bcrypt.hash(senha, 10)
    
    const usuario = await prisma.usuario.create({
        data: {
            nome: nome.trim(),
            sobrenome: sobrenome.trim(),
            CPF: CPF.trim(),
            data_nascimento: new Date(data_nascimento.trim()),
            genero: genero.trim().toUpperCase(),
            telefone: telefone.trim(),
            email: email.trim().toLowerCase(),
            senha: hashedPassword
        }
    })

    return res.status(201).send("Usuario cadastrado com sucesso")
}

// LOGIN USER
export async function login_usuario(req, res) {
    const {email, senha} = req.body

    if (!email || typeof email !== "string"){
        return res.status(400).send("email é obrigatorio")
    }

    if(!senha || typeof senha !== "string" || senha < 6){
        return res.status(400).send("senha é obrigatorio e deve ter pelo menos 6 caracteres")
    }

    const usuario = await prisma.usuario.findUnique({
        where: { email: email.trim().toLowerCase() }
    })

    if (!usuario) {
        return res.status(401).send({
            message: "email invalido"
        })
    }

    const igual = await bcrypt.compare(senha, usuario.senha)

    if (!igual) {
        return res.status(401).send({
            message: "senha invalido"
        })
    }

    const token_user = jwt.sign(
        { id: usuario.id_usuario,
         email: usuario.email, 
         nome: usuario.nome,
         sobrenome: usuario.sobrenome,
         role: "USUARIO" },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    return res.status(200).cookie('token', token_user, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
     }).json({
        message: "Login realizado com sucesso", 
        token: token_user
    })
}


// LOGOUT USER

export async function logout_user(req, res) {
    return res
        .clearCookie('token') 
        .status(200)
        .json({ message: "Logout realizado com sucesso!" });
}