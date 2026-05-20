import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { consulta_status } from '@prisma/client';

// Home (funcionario)

export async function home_funcionario(req, res) {
    return res.status(200).send({
        pagina: "Home Funcionario"
    })
}

// Logout (funcionario)

export async function logout_funcionario(req, res) {
    return res.clearCookie('token_funcionario') .status(200).send({
        message: "Logout realizado com sucesso"
    });
}

// Listar consultas

export async function listar_consultas(req, res) {
    const id_funcionario = req.funcionarioLogado.id

    try {
        const agora = new Date()

        const consultas = await prisma.consulta.findMany({
            where: { id_funcionario: id_funcionario },
            include: {
                pet: {
                    select: { nome: true }
                }
            }, orderBy: [
                { data_consulta: 'asc' },
                { hora_inicio: 'asc' }
            ]
        })

        if (consultas.length === 0) {
            return res.status(404).send({
                mensagem: "Não há consultas agendadas para você no momento"
            })
        }

        return res.status(200).send({
            consultas: consultas
        })
    } catch (error) {
        console.log("Erro ao listar consultas:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Detalhes consulta

export async function detalhes_consulta(req, res) {
    const id_consulta = Number(req.params.id)

    try {
        if (!id_consulta) {
            return res.status(404).send("Id invalido")
        }

        const existeConsulta = await prisma.consulta.findUnique({
            where: { id_consulta: id_consulta }
        })

        if (!existeConsulta) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

        const agora = new Date()

        const dataStr = existeConsulta.data_consulta.toISOString().split('T')[0]
        const dataInicio = new Date(`${dataStr}T${existeConsulta.hora_inicio}:00`)
        const dataFim = new Date(`${dataStr}T${existeConsulta.hora_fim}:00`)

        const limiteFim = new Date(dataFim.getTime() + 5 * 60 * 1000)

        return res.status(200).send("falta linkar com o front 🥀")
    } catch (error) {
        console.log("Erro ao detalhar uma consulta:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Atualizar consulta

export async function atualizar_consulta(req, res) {
    const id_consulta = Number(req.params.id)

    try {
       if (!id_consulta) {
        return res.status(404).send("Id invalido")
        }

        const existeConsulta = await prisma.consulta.findUnique({
            where: { id_consulta: id_consulta }
        })

        if (!existeConsulta) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

        const consultaAtualizada = await prisma.consulta.update({
            where: { id_consulta: id_consulta },
            data: { status: 'finalizado' }
        })

        return res.status(200).send({
            mensagem: "Consulta finalizada com sucesso"
        })
    } catch (error) {
        console.log("Erro ao finalizar consulta:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}