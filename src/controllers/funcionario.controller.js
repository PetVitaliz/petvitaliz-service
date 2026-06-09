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

// Bater Ponto

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
        const fusoLocal = new Date();
        const ano = fusoLocal.getFullYear();
        const mes = String(fusoLocal.getMonth() + 1).padStart(2, '0');
        const dia = String(fusoLocal.getDate()).padStart(2, '0');
        const hojeString = `${ano}-${mes}-${dia}`;
        const horaAtualMinutos = fusoLocal.getHours() * 60 + fusoLocal.getMinutes();

        const todasConsultasHoje = await prisma.consulta.findMany({
            where: {
                id_funcionario: id_funcionario,
                data_consulta: new Date(`${hojeString}T00:00:00.000Z`),
                status: 'em_espera'
            }
        });

        for (const c of todasConsultasHoje) {
            const [hInicio, mInicio] = c.hora_inicio.split(':').map(Number);
            const minutosInicio = hInicio * 60 + mInicio;

            if (horaAtualMinutos >= minutosInicio) {
                await prisma.consulta.update({
                    where: { id_consulta: c.id_consulta },
                    data: { status: 'em_endamento' }
                });
            }
        }

        const consultas = await prisma.consulta.findMany({
            where: { id_funcionario: id_funcionario },
            include: {
                pet: {
                    select: { 
                        nome: true,
                        idade: true,
                        especie: true,
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

        return res.status(200).send({ consultas });
    } catch (error) {
        console.log("Erro ao listar consultas do funcionário:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" });
    }
}

// Detalhes consulta

export async function detalhes_consulta(req, res) {
    const id_consulta = Number(req.params.id);

    try {
        if (!id_consulta) {
            return res.status(400).send({ mensagem: "Id inválido" });
        }

        const consulta = await prisma.consulta.findUnique({
            where: { id_consulta: id_consulta },
            include: {
                pet: {
                    include: {
                        usuario: {
                            select: { nome: true, sobrenome: true, email: true, telefone: true }
                        }
                    }
                }
            }
        });

        if (!consulta) {
            return res.status(404).send({ mensagem: "Consulta não encontrada" });
        }

        return res.status(200).send({ consulta });
    } catch (error) {
        console.log("Erro ao detalhar uma consulta:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" });
    }
}

// Atualizar consulta

export async function atualizar_consulta(req, res) {
    const id_consulta = Number(req.params.id);
    const { novoStatus } = req.body; 

    try {
        if (!id_consulta) return res.status(400).send({ mensagem: "Id inválido" });

        const existeConsulta = await prisma.consulta.findUnique({
            where: { id_consulta: id_consulta }
        });

        if (!existeConsulta) return res.status(404).send({ mensagem: "Consulta não encontrada" });

        const agora = new Date();
        const dataStr = existeConsulta.data_consulta.toISOString().split('T')[0];
        
        const [hInicio, mInicio] = existeConsulta.hora_inicio.split(':').map(Number);
        const [hFim, mFim] = existeConsulta.hora_fim.split(':').map(Number);
        
        const dataInicioReal = new Date(`${dataStr}T${String(hInicio).padStart(2, '0')}:${String(mInicio).padStart(2, '0')}:00`);
        const dataFimReal = new Date(`${dataStr}T${String(hFim).padStart(2, '0')}:${String(mFim).padStart(2, '0')}:00`);
        const limiteFim = new Date(dataFimReal.getTime() + 10 * 60 * 1000);

        if (novoStatus === 'em_endamento') {
            if (agora < dataInicioReal) {
                return res.status(400).send({
                    mensagem: `Não é possível iniciar este atendimento antes do horário agendado (${existeConsulta.hora_inicio}).`
                });
            }
        }

        if (novoStatus === 'finalizado') {
            if (agora < dataFimReal) {
                return res.status(400).send({ 
                    mensagem: `Você só pode encerrar este atendimento a partir de ${existeConsulta.hora_fim}.` 
                });
            }
            if (agora > limiteFim) {
                return res.status(400).send({ 
                    mensagem: "Janela de finalização expirada. Reporte ao Administrador do sistema." 
                });
            }
        }

        const consultaAtualizada = await prisma.consulta.update({
            where: { id_consulta: id_consulta },
            data: { status: novoStatus }
        });

        return res.status(200).send({ mensagem: "Status atualizado com sucesso" });
    } catch (error) {
        console.log("Erro ao atualizar status da consulta:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" });
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
                email: true,
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

// Listar clientes

export async function listar_clientes_funcionario(req, res) {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nome: true,
                sobrenome: true,
                CPF: true,
                email: true,
                telefone: true,
                pet: {
                    select: {
                        nome: true,
                        especie: true,
                        sexo: true,
                        peso: true,
                        data_nascimento: true
                    }
                }
            },
            orderBy: { nome: 'asc' }
        });

        const clientesFormatados = usuarios.map(u => {
            const listaDePetsNomes = u.pet.map(p => p.nome);
            
            return {
                id_usuario: u.id_usuario,
                nome: `${u.nome} ${u.sobrenome}`.trim(),
                cpf: u.CPF ? u.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "Não informado",
                telefone: u.telefone,
                email: u.email,
                pets: String(listaDePetsNomes.length).padStart(2, '0'),
                petsLista: listaDePetsNomes,
                petsDetalhesLista: u.pet || [],
                status: 'ATIVO',
                ultimaVisita: 'Consultar histórico'
            };
        });

        return res.status(200).json({ clientes: clientesFormatados });
    } catch (error) {
        console.error("Erro ao listar clientes para o funcionário:", error);
        return res.status(500).json({ mensagem: "Erro interno ao buscar tutores." });
    }
}

// Listar pets

export async function listar_todos_pets_funcionario(req, res) {
    try {
        const todosPets = await prisma.pet.findMany({
            include: {
                usuario: {
                    select: {
                        nome: true,
                        sobrenome: true
                    }
                }
            },
            orderBy: { nome: 'asc' }
        });

        const petsFormatados = todosPets.map(p => {
            let especieExibicao = 'Outro';
            if (p.especie === 'cachorro') especieExibicao = 'Cão';
            if (p.especie === 'gato') especieExibicao = 'Gato';
            if (p.especie === 'ave') especieExibicao = 'Ave';
            if (p.especie === 'coelho') especieExibicao = 'Coelho';

            let idadeExibicao = `${p.idade} anos`;
            if (p.data_nascimento) {
                const hoje = new Date();
                const nascimento = new Date(p.data_nascimento);
                
                let anos = hoje.getFullYear() - nascimento.getFullYear();
                let meses = hoje.getMonth() - nascimento.getMonth();
                
                if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
                    anos--;
                    meses += 12;
                }
                
                if (anos === 0) {
                    idadeExibicao = `${meses} meses`;
                } else if (meses > 0) {
                    idadeExibicao = `${anos} anos e ${meses} m`;
                }
            }

            return {
                id_pet: p.id_pet,
                id_usuario: p.id_usuario,
                nome: p.nome,
                especie: especieExibicao,
                detalheEspecie: p.outra_especie ? p.outra_especie.trim() : null,
                idade: p.idade,
                idadeTexto: p.idade === 0 ? 'Menos de 1 ano' : idadeExibicao,
                sexo: p.sexo === 'M' ? 'Macho' : 'Fêmea',
                peso: p.peso ? `${p.peso} kg` : 'Não pesado',
                status: p.peso && p.peso > 0 ? 'Ativo' : 'Em Tratamento',
                tutor: p.usuario ? `${p.usuario.nome} ${p.usuario.sobrenome}`.trim() : 'Não vinculado',
                prontuario: p.observacoes || 'Nenhuma observação clínica registrada para o paciente até o momento.'
            };
        });

        return res.status(200).json({ pets: petsFormatados });
    } catch (error) {
        console.error("Erro ao listar diretório de pacientes:", error);
        return res.status(500).json({ mensagem: "Erro interno ao buscar diretório de pacientes." });
    }
}