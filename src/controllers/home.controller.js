import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

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
        versão: "não logada"
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

    return res.status(200).send({
        mensagem: "Pagina de contato",
        versão: "não logada"
    })
}


// Serviços de Emergencia (logado)

export async function servicos_emergencia(req, res) {
    const { nome, sobrenome } = req.usuarioLogado;

    return res.status(200).send({
        mensagem: "Pagina de serviços de emergencia",
        versão: "não logada"
    })
}


// Cadastrar pet (logado)

export async function cadastrar_pet() {
    const { nome, sobrenome } = req.usuarioLogado;

}

