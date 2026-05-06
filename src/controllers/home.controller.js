import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { emailContatoEnviado } from '../lib/email.js'

// PARTE NAO LOGADA

// Home

export async function home_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Home",
        versão: "não logada", 
        aviso: "faça login para utilizar outros recursos"
    })
}


// Serviços

export async function servicos_n_logado(req, res) {
    return res.status(200).send({
        pagina: "Pagina de serviços",
        versão: "não logada"
    })
}


// Contato

export async function contato_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Pagina de contato",
        versão: "não logada",
        aviso: "faça login para utilizar esse recurso"
    })
}


// Serviços de Emergencia

export async function servicos_emergencia_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Pagina de serviços de emergencia",
        versão: "não logada"
    })
}


// Listar pet

export async function listar_pet_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Pagina de listar pet",
        versão: "não logada", 
        aviso: "faça login para utilizar esse recurso"
    })
}


// Cadastrar pet

export async function cadastrar_pet_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Pagina de cadastrar pet",
        versão: "não logada", 
        aviso: "faça login para utilizar esse recurso"
    })
}

// Editar Pet

export async function editar_pet_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Pagina de editar pet",
        versão: "não logada", 
        aviso: "faça login para utilizar esse recurso"
    })
}

// Excluir Pet

export async function excluir_pet_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Pagina de excluir pet",
        versão: "não logada", 
        aviso: "faça login para utilizar esse recurso"
    })
}

// Agendamento

export async function agendamento_n_logada(req, res) {
    return res.status(200).send({
        pagina: "Pagina de agendamento",
        versão: "não logada", 
        aviso: "faça login para utilizar esse recurso"
    })
}



// PARTE LOGADA



// Home (logada)

export async function home(req, res) {
    const { nome, sobrenome } = req.usuarioLogado;

    return res.status(200).send({
        pagina: "Home Logada",
        usuario: `${nome} ${sobrenome}`
    })
}


// Serviços (logado)

export async function servicos(req, res) {
    const { nome, sobrenome } = req.usuarioLogado;

    return res.status(200).send({
        pagina: "Serviços Logado",
        usuario: `${nome} ${sobrenome}`
    })
}


// Contato (logado)

export async function contato(req, res) {
    const { nome, sobrenome } = req.usuarioLogado;
    const { email, mensagem } = req.body
    
    if (!email || typeof email !== "string"){
        return res.status(400).send("email é obrigatorio")
    }

    if(!mensagem || typeof mensagem !== "string" || mensagem.length < 6){
        return res.status(400).send("mensagem é obrigatorio e precisa ter pelo menos 6 caracteres")
    }

    try {
        await emailContatoEnviado(nome, sobrenome, email, mensagem)

        return res.status(200).send({
            mensagem: "Email enviado com sucesso"
        })

    } catch (error) {
        return res.status(500).send({
            mensagem: "Erro ao processar o email"
        })
    }
    
    
}


// Serviços de Emergencia (logado)

export async function servicos_emergencia(req, res) {
    const { nome, sobrenome } = req.usuarioLogado;

    return res.status(200).send({
        mensagem: "Pagina de serviços de emergencia",
        usuario: `${nome} ${sobrenome}`
    })
}

// Lista dos pets (logado)

export async function listar_pet(req, res) {
    const { nome, sobrenome } = req.usuarioLogado;
    const id_usuario = Number(req.usuarioLogado.id)
    

    const pets = await prisma.pet.findMany({
        where: { id_usuario: id_usuario },
        select: {
            nome: true,
            especie: true,
            sexo: true,
            data_nascimento: true
        }
    })

    return res.status(200).send({
        mensagem: "Pagina de listar pet",
        usuario: `${nome} ${sobrenome}`,
        Pets: pets
    })
}

// Cadastrar pet (logado)

export async function cadastrar_pet(req, res) {
    const { nome, especie, sexo, data_nascimento } = req.body
    const id_usuario = req.usuarioLogado.id
    

    if (!nome || typeof nome !== "string"){
        return res.status(400).send("nome do pet é obrigatorio")
    }

    if (!especie || typeof especie !== "string" || (especie !== "cachorro" && especie !== "gato" && especie !== "CACHORRO" && especie !== "GATO")) {
        return res.status(400).send("especie é obrigatorio, só atendemos 'cachorro' ou 'gato' no momento")
    }

    const sexo_lower = sexo.toLowerCase()
    if(!sexo_lower || typeof sexo_lower !== "string" || (sexo_lower !== "m" && sexo_lower !== "f")){
        return res.status(400).send("genero é obrigatorio e deve ser 'm' ou 'f' ")
    }

    if(!data_nascimento || typeof data_nascimento != "string"){
        return res.status(400).send("data de nascimento é obrigatorio e precisa ser ano-mes-dia")
    }

    const pet = await prisma.pet.create({
        data: {
            nome: nome.trim(),
            especie: especie.trim().toLowerCase(),
            sexo: sexo_lower.trim().toUpperCase(),
            data_nascimento: new Date(data_nascimento.trim()),
            usuario: {
                connect: {id_usuario: Number(id_usuario)}
            }
        }
    })

    return res.status(201).send({
        mensagem: "Pet cadastrado com sucesso"
    })
}

// Editar pet (logado)

export async function editar_pet(req, res) {
    const id_pet = Number(req.params.id)
    const { nome, especie, sexo, data_nascimento } = req.body
    
    if (!nome || typeof nome !== "string"){
        return res.status(400).send("nome do pet é obrigatorio")
    }

    const especieFormatada = especie.toLowerCase();
    if (!especieFormatada || typeof especieFormatada !== "string" || (especieFormatada !== "cachorro" && especieFormatada !== "gato")) {
        return res.status(400).send("especie é obrigatorio, só atendemos 'cachorro' ou 'gato' no momento")
    }

    const sexo_lower = sexo.toLowerCase();
    if(!sexo_lower || typeof sexo_lower !== "string" || (sexo_lower !== "m" && sexo_lower !== "f")){
        return res.status(400).send("genero é obrigatorio e deve ser 'm' ou 'f' ")
    }

    if(!data_nascimento || typeof data_nascimento != "string"){
        return res.status(400).send("data de nascimento é obrigatorio e precisa ser ano-mes-dia")
    }

    const novoPet = await prisma.pet.update({
        where: { id_pet: id_pet },
        data: {
            nome: nome.trim(),
            especie: especieFormatada.trim(),
            sexo: sexo_lower.trim().toUpperCase(),
            data_nascimento: new Date(data_nascimento.trim()),
        }
    })

    const rows = novoPet
    return res.status(200).send({
        pet: rows
    })
}

// Excluir pet (logado)

export async function excluir_pet(req, res) {
    const id_pet = Number(req.params.id)

    const deletarPet = await prisma.pet.delete({
        where: { id_pet: id_pet }
    })

    return res.status(200).send({
        mensagem: "Pet deletado com sucesso"
    })
}