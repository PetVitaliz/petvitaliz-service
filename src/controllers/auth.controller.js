import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'


export async function register(req, res) {
    const {email, cpf, nome, sobrenome, data_nascimento, genero, senha, telefone} = req.body

    if(!nome || typeof nome !== "string" || nome < 2){
        return res.status(400).send("nome é obrigatorio e deve ter pelo menos 10 caracteres")
    }

    if(!sobrenome || typeof sobrenome !== "string" || sobrenome < 10){
        return res.status(400).send("sobrenome é obrigatorio e deve ter pelo menos 10 caracteres")
    }

    if (!email || typeof email !== "string"){
        return res.status(400).send("email é obrigatorio")
    }

    if(!senha || typeof senha !== "string" || senha < 6){
        return res.status(400).send("password é obrigatorio e deve ter pelo menos 6 caracteres")
    }

    if(!cpf || typeof cpf !== "string" || cpf < 11){
        return res.status(400).send("CPF é obrigatorio e deve ter 11 digitos")
    }

    if(!telefone || typeof telefone !== "string" || telefone < 11){
        return res.status(400).send("telefone é obrigatorio e deve ter 11 digitos")
    }

    genero.toLowerCase()
    if(!genero || typeof genero !== "string" || (genero !== "m" && genero !== "f" && genero !== "o")){
        return res.status(400).send("genero é obrigatorio e deve ser 'f', 'm' ou 'o' ")
    }

    if(!data_nascimento || typeof data_nascimento != "number"){
        return res.status(400).send("data de nascimento é obrigatorio e precisa ser ano-mes-dia")
    }    

    const existing = await prisma.usuario.findUnique({
        where: { email: email.trim().toLowerCase() }
    })

    const existing2 = await prisma.usuario.findUnique({
        where: { cpf: cpf.trim().toLowerCase() }
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
            sobrenome: nome.trim(),
            cpf: cpf.trim(),
            data_nascimento: data_nascimento.trim(),
            genero: genero.trim(),
            telefone: telefone.trim(),
            email: email.trim().toLowerCase(),
            senha: hashedPassword
        }
    })

    return res.status(201).send("Usuario cadastrado com sucesso")
}

export async function login(req, res) {
    const {email, senha} = req.body

    if (!email || typeof email !== "string"){
        return res.status(400).send("email é obrigatorio")
    }

    if(!password || typeof password !== "string" || password < 6){
        return res.status(400).send("password é obrigatorio e deve ter pelo menos 6 caracteres")
    }

    const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() }
    })

    if (!user) {
        return res.status(401).json("email invalido")
    }

    const igual = await bcrypt.compare(password, user.password)

    if (!igual) {
        return res.status(401).json("senha invalida")
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    return res.status(200).send("Login realizado com sucesso", token)
}
