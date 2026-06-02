import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import otpGenerator from 'otp-generator';
import { emailReset_Enviado } from '../lib/email.js';

// CADASTRO USER

export async function cadastro(req, res) {
    const { email, CPF, nome, sobrenome, data_nascimento, genero, senha, telefone } = req.body

    if(!nome || typeof nome !== "string" || nome.length < 2){
        return res.status(400).json({ mensagem: "Nome é obrigatório e deve ter pelo menos 2 caracteres" })
    }

    if(!sobrenome || typeof sobrenome !== "string" || sobrenome.length < 3){
        return res.status(400).json({ mensagem: "Sobrenome é obrigatório e deve ter pelo menos 3 caracteres" })
    }

    if (!email || typeof email !== "string"){
        return res.status(400).json({ mensagem: "Email é obrigatório" })
    }

    if(!senha || typeof senha !== "string" || senha.length < 6){
        return res.status(400).json({ mensagem: "Senha é obrigatória e deve ter pelo menos 6 caracteres" })
    }

    if(!CPF || typeof CPF !== "string" || CPF.length !== 11){
        return res.status(400).json({ mensagem: "CPF é obrigatório e deve ter 11 dígitos" })
    }

    if(!telefone || typeof telefone !== "string" || telefone.length !== 11){
        return res.status(400).json({ mensagem: "Telefone é obrigatório e deve ter 11 dígitos" })
    }

    const genero_lower = genero ? genero.toLowerCase() : '';
    if(!genero_lower || typeof genero_lower !== "string" || (genero_lower !== "m" && genero_lower !== "f" && genero_lower !== "o")){
        return res.status(400).json({ mensagem: "Gênero é obrigatório e deve ser 'f', 'm' ou 'o'" })
    }

    if(!data_nascimento || typeof data_nascimento !== "string"){
        return res.status(400).json({ mensagem: "Data de nascimento é obrigatória" })
    }    

    try {
        const existing = await prisma.usuario.findUnique({
            where: { email: email.trim().toLowerCase() }
        })

        const existing2 = await prisma.usuario.findFirst({
            where: { CPF: CPF.trim() }
        })

        const existing3 = await prisma.usuario.findFirst({
            where: { telefone: telefone.trim() }
        })

        if(existing){
            return res.status(400).json({ mensagem: "Email já cadastrado" })
        }

        if(existing2){
            return res.status(400).json({ mensagem: "CPF já cadastrado" })
        }

        if(existing3){
            return res.status(400).json({ mensagem: "Número de telefone já cadastrado" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
        
        await prisma.usuario.create({
            data: {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                CPF: CPF.trim(),
                data_nascimento: new Date(data_nascimento),
                genero: genero_lower.trim().toUpperCase(),
                telefone: telefone.trim(),
                email: email.trim().toLowerCase(),
                senha: hashedPassword
            }
        })

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" })

    } catch (error) {
        console.error("ERRO CRÍTICO NO CADASTRO:", error);
        return res.status(500).json({ 
            mensagem: "Erro interno no servidor." 
        })
    }
}

// LOGIN USER

export async function login_usuario(req, res) {
    const {email, senha} = req.body

    try {
        if (!email || typeof email !== "string"){
            return res.status(400).json("Campo email é obrigatorio")
        }
    
        if(!senha || typeof senha !== "string"){
            return res.status(400).json("Campo senha é obrigatorio")
        }
    
        const usuario = await prisma.usuario.findUnique({
            where: { email: email.trim().toLowerCase() }
        })
    
        if (!usuario) {
            return res.status(401).json({
                message: "Email invalido"
            })
        }
    
        const igual = await bcrypt.compare(senha, usuario.senha)
    
        if (!igual) {
            return res.status(401).json({
                message: "Senha invalida"
            })
        }
    
        const token_user = jwt.sign(
            { id: usuario.id_usuario,
             email: usuario.email, 
             nome: usuario.nome,
             sobrenome: usuario.sobrenome,
             role: "USUARIO" },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        )
    
        return res.status(200).cookie('token', token_user, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            partitioned: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
         }).json({
            mensagem: "Login realizado com sucesso",
            usuario: {
                nome: `${usuario.nome} ${usuario.sobrenome}`,
                email: usuario.email,
                tipo: 'usuario'
            }
        })
    } catch (error) {
        console.error("erro ao logar como usuario", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor",
        })
    }
}

// LOGIN ADM

export async function login_adm(req, res) {
    const { email, senha } = req.body

    try {
        if (!email || typeof email !== "string"){
            return res.status(400).json("Email é obrigatório")
        }
    
        if(!senha || typeof senha !== "string" || senha.length < 6){
            return res.status(400).json("Senha é obrigatória e deve ter pelo menos 6 caracteres")
        }
    
        const emailFormatado = email.trim().toLowerCase();

        const administrador = await prisma.administrador.findUnique({
            where: { ADM_EMAIL: emailFormatado }
        })
    
        if (!administrador) {
            return res.status(401).json("Email invalido")
        }
    
        const igual = await bcrypt.compare(senha, administrador.ADM_SENHA)
    
        if (!igual) {
            return res.status(401).json({
                mensagem: "Senha invalida"
            })
        }

        if (!administrador.ADM_ATIVO) {
            return res.status(401).json({
                mensagem: "Usuário não está mais ativo"
            })    
        }

        const token_adm = jwt.sign(
            { 
                id: administrador.ADM_ID,
                email: administrador.ADM_EMAIL,
                nome: administrador.ADM_NOME,
                ativo: administrador.ADM_ATIVO,
                foto_url: administrador.ADM_FOTO_URL,
                role: "ADMINISTRADOR" 
            },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        )
    
        return res.status(200).cookie('token_adm', token_adm, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            partitioned: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        }).json({
            mensagem: "Login como ADM realizado com sucesso",
            usuario: {
                id: administrador.ADM_ID,
                nome: administrador.ADM_NOME,
                email: administrador.ADM_EMAIL,
                foto_url: administrador.ADM_FOTO_URL,
                tipo: 'admin'
            }
        })
    } catch (error) {
        console.error("erro ao logar como adm", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// LOGIN FUNCIONARIO

export async function login_funcionario(req, res) {
    const {email, senha} = req.body

    try {
        if (!email || typeof email !== "string"){
            return res.status(400).json("Email é obrigatorio")
        }
    
        if(!senha || typeof senha !== "string"){
            return res.status(400).json("Senha é obrigatorio")
        }
        
        const emailTratado = email.trim().toLowerCase()

        const funcionario = await prisma.funcionario.findUnique({
            where: { email: emailTratado }
        })

        if (funcionario.ativo === false) {
            return res.status(403).json("Esse usuario não esta mais ativo")
        }
    
        if (!funcionario) {
            return res.status(401).json({
                message: "Email invalido"
            })
        }
    
        const igual = await bcrypt.compare(senha, funcionario.senha)
    
        if (!igual) {
            return res.status(401).json({
                message: "Senha invalida"
            })
        }
    
        const token_funcionario = jwt.sign(
            { id: funcionario.id_funcionario,
             email: funcionario.email, 
             nome: funcionario.nome,
             sobrenome: funcionario.sobrenome,
             email: funcionario.email,
             ativo: funcionario.ativo,
             carga: funcionario.carga,
             especialidade: funcionario.especialidade,
             role: "FUNCIONARIO" },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
    
        return res.status(200).cookie('token_funcionario', token_funcionario, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            partitioned: true,
            maxAge: 60 * 60 * 1000
         }).json({
            message: "Login realizado com sucesso",
            nome: funcionario.nome
        })
    } catch (error) {
        console.error("erro ao logar como funcionario", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// LOGOUT

export async function logout(req, res) {
    return res.clearCookie('token') .status(200).json({
        message: "Logout realizado com sucesso"
    });
}

// RESET SENHA USUARIO

export async function pedir_reset_senha(req, res) {
    const { email } = req.body

    try {
        const existing = await prisma.usuario.findUnique({
            where: { email: email }
        })
    
        if (!existing) {
            return res.status(404).json({
                mensagem: "email não encontrado"
            })
        }
    
        const codigo = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        })
        const expira = new Date(Date.now() + 10 * 60 * 1000)
    
        await prisma.reset_senha.create({
            data: {
                id_usuario: existing.id_usuario,
                token: codigo,
                expira_em: expira
            }
        })
    
        await emailReset_Enviado(existing.nome, existing.sobrenome, email, codigo)
    
        return res.status(200).json({
            mensagem: "Codigo de reset de senha enviado para o email"
        })

    } catch (error) {
        console.log("Erro no reset_senha:", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// CONFIRMAR CODIGO OTP

export async function confirmar_codigo(req, res) {
    const { codigo } = req.body

    try {
        const existing = await prisma.reset_senha.findFirst({
            where: {
                token: codigo,
                expira_em: { gt: new Date() }
            },
            include: { usuario: true }
            
        })
    
        if (!existing) {
            return res.status(404).json({
                mensagem: "Codigo invalido"
            })
        }

        const usuario = existing.usuario

        const reset_senha_token = jwt.sign(
            {
                id: usuario.id_usuario,
                reset_autorizado: true  
            },
            process.env.JWT_SECRET,
            { expiresIn: '9m' }
        )

        await prisma.reset_senha.delete({
            where: { id: existing.id }
        });

        return res.status(200).cookie('token_reset', reset_senha_token,{
            httpOnly: true,
            secure: false,
            maxAge: 9 * 60 * 1000
        }).json({
            mensagem: "Acesso liberado"
        })

    } catch (error) {
        console.log("Erro no reset_senha:", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// ALTERAR SENHA

export async function reset_senha(req, res) {
    const { senha1, senha2 } = req.body
    const id_usuario = req.usuarioPermitido.id

    try {
        if (!senha1 || senha1.length < 6 || typeof senha1 !== "string") {
            return res.status(400).json("A senha deve  ter pelo menos 6 caracteres e não pode estar vazia")
        }

        if (!senha2 || senha2.length < 6 || typeof senha2 !== "string") {
            return res.status(400).json("A senha deve  ter pelo menos 6 caracteres e não pode estar vazia")
        }

        if (senha1 !== senha2) {
            return res.status(400).json("As senhas não estão iguais")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha1, salt)

        await prisma.usuario.update({
            where: { id_usuario: id_usuario },
            data: { senha: hashedPassword }
        })

        return res.clearCookie('token_reset').status(200).json({
            mensagem: "Senha alterado com sucesso"
        })
    } catch (error) {
        console.error("erro ao atualizar a senha", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}
