import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { consulta_status } from '@prisma/client';

// Home (funcionario)

export async function home_funcionario(req, res) {
    const id_funcionario = req.funcionarioLogado.id;

    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id_funcionario: id_funcionario },
            select: {
                nome: true,
                sobrenome: true,
                especialidade: true,
                carga: true
            }
        });

        if (!funcionario) {
            return res.status(404).send({ mensagem: "Funcionário não encontrado" });
        }

        const fusoLocal = new Date();
        const ano = fusoLocal.getFullYear();
        const mes = String(fusoLocal.getMonth() + 1).padStart(2, '0');
        const dia = String(fusoLocal.getDate()).padStart(2, '0');
        const hojeString = `${ano}-${mes}-${dia}`;

        const consultasHoje = await prisma.consulta.findMany({
            where: {
                id_funcionario: id_funcionario,
                data_consulta: {
                    gte: new Date(`${hojeString}T00:00:00.000Z`),
                    lte: new Date(`${hojeString}T23:59:59.999Z`)
                }
            },
            include: {
                pet: {
                    include: {
                        usuario: {
                            select: { nome: true, sobrenome: true }
                        }
                    }
                }
            },
            orderBy: { hora_inicio: 'asc' }
        });

        return res.status(200).send({
            funcionario,
            consultas: consultasHoje
        });

    } catch (error) {
        console.log("Erro na home do funcionário:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" });
    }
}

// Bater Ponto (funcionario)

export async function bater_ponto(req, res) {
    const id_funcionario = req.funcionarioLogado.id;

    try {
        await prisma.funcionario.update({
            where: { id_funcionario: id_funcionario },
            data: { carga: 8 }
        });

        return res.status(200).send({
            mensagem: "Ponto batido com sucesso (Carga restaurada para 8)."
        });
    } catch (error) {
        console.log("Erro ao bater ponto:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" });
    }
}

// Logout (funcionario)

export async function logout_funcionario(req, res) {
    return res.clearCookie('token_funcionario') .status(200).send({
        message: "Logout realizado com sucesso"
    });
}

// Listar consultas

export async function listar_consultas(req, res) {
    const id_funcionario = req.funcionarioLogado.id;

    try {
        const consultas = await prisma.consulta.findMany({
            where: { id_funcionario: id_funcionario },
            include: {
                pet: {
                    select: { 
                        nome: true,
                        idade: true,
                        usuario: {
                            select: { nome: true, sobrenome: true }
                        }
                    }
                }
            }, 
            orderBy: [
                { data_consulta: 'desc' },
                { hora_inicio: 'asc' }
            ]
        });

        if (consultas.length === 0) {
            return res.status(404).send({
                mensagem: "Não há consultas agendadas para você no momento",
                consultas: []
            });
        }

        return res.status(200).send({
            consultas: consultas
        });
    } catch (error) {
        console.log("Erro ao listar consultas:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        });
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

// Pefil (funcionario)

export async function obter_perfil_funcionario(req, res) {
    const id_funcionario = req.funcionarioLogado.id;

    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id_funcionario: id_funcionario },
            select: {
                nome: true,
                sobrenome: true,
                foto_url: true,
                especialidade: true
            }
        });

        if (!funcionario) {
            return res.status(404).send({ mensagem: "Funcionário não encontrado" });
        }

        return res.status(200).send(funcionario);
    } catch (error) {
        console.log("Erro ao obter perfil do funcionário:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" });
    }
}

// Atualizar Perfil

export async function atualizar_perfil_funcionario(req, res) {
    const id_funcionario = req.funcionarioLogado.id;
    const { nome, sobrenome, email, telefone } = req.body;

    try {
        if (!nome || !email) {
            return res.status(400).send({ mensagem: "Nome e Email são campos obrigatórios." });
        }

        const funcionarioAtualizado = await prisma.funcionario.update({
            where: { id_funcionario: id_funcionario },
            data: {
                nome: nome.trim(),
                sobrenome: sobrenome ? sobrenome.trim() : "",
                email: email.trim(),
                telefone: telefone ? telefone.trim() : null
            }
        });

        return res.status(200).send({
            mensagem: "Perfil atualizado com sucesso",
            funcionario: funcionarioAtualizado
        });
    } catch (error) {
        console.log("Erro ao atualizar perfil do funcionário:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" });
    }
}