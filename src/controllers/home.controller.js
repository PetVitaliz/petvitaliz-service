import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { emailContatoEnviado } from '../lib/email.js'

// PARTE NAO LOGADA

// Home

export async function home_n_logada(req, res) {

    const produto = await prisma.produtos.findMany({
        select: {
            nome: true,
            descricao: true,
            beneficios: true,
            preco: true
        }
    })

    if (produto.length === 0) {
        return res.status(200).send({
                pagina: "Home",
                versão: "não logada", 
                aviso: "faça login para utilizar outros recursos.",
                produtos: "nenhum produto cadastrado no momento"
            });
    }

    return res.status(200).send({
        pagina: "Home",
        versão: "não logada", 
        aviso: "faça login para utilizar outros recursos",
        produtos: produto
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

// Consultas

export async function consultas_n_logado(req, res) {
    return res.status(200).send({
        pagina: "Pagina de consultas",
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
    

    try {
        if (!id_pet) {
            return res.status(404).send({
                mensagem: "Id invalido"
            })
        }

        const existePet = await prisma.pet.findUnique({
            where: { id_pet: id_pet }
        })

        if (!existePet) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

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
    } catch (error) {
        console.log("Erro ao editar pet:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Excluir pet (logado)

export async function excluir_pet(req, res) {
    const id_pet = Number(req.params.id)

    try {
        if (!id_pet) {
            return res.status(404).send({
                mensagem: "Id invalido"
            })
        }

        const existePet = await prisma.pet.findUnique({
            where: { id_pet: id_pet }
        })

        if (!existePet) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            })
        }

        const deletarPet = await prisma.pet.delete({
            where: { id_pet: id_pet }
        })

        return res.status(200).send({
            mensagem: "Pet deletado com sucesso"
        })
    } catch (error) {
        console.log("Erro ao excluir pet:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Agendamento (logado)

export async function agendamento(req, res) {
    const { servico, id_pet, data_consulta, hora_inicio, observacoes } = req.body
    const id_usuario = req.usuarioLogado.id

    try {
        if (!servico || !id_pet || !data_consulta || !hora_inicio) {
            return res.status(400).send({
                mensagem: "Todos os campos são obrigatorios"
            })
        }

        const servico_lower = servico
        if (servico_lower != 'tosador' && servico_lower != 'veterinario') {
            return res.status(400).send({
                mensagem: "no momento so temos 'tosador' e 'veterinario' "
            })
        }

        const funcionarioDisponivel = await prisma.funcionario.findMany({
            where: {
                especialidade: servico_lower.trim(),
                ativo: true,
                carga: { gt: 0 }
            }
        })

        if (funcionarioDisponivel.length === 0) {
            return res.status(404).send({
                mensagem: "Nenhum profissional disponivel no momento, desculpe a inconveniencia"
            })
        }

        const funcionarioSorteado = funcionarioDisponivel[Math.floor(Math.random () * funcionarioDisponivel.length)]
        const id_funcionario = funcionarioSorteado.id_funcionario

        const [horas, minutos] = hora_inicio.split(":").map(Number)
        const hora_fim = `${String((horas + 1) % 24).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`

        const conflitoHorario = await prisma.consulta.findFirst({
            where: {
                id_funcionario: id_funcionario,
                data_consulta: new Date(data_consulta),
                hora_inicio: hora_inicio
            }
        })

        if (conflitoHorario) {
            return res.status(409).send({
                mensagem: "Este horrario ja possui uma consulta ativa"
            })
        }

        await prisma.$transaction([
            prisma.consulta.create({
                data: {
                    id_funcionario: id_funcionario,
                    id_pet: Number(id_pet),
                    data_consulta: new Date(data_consulta),
                    hora_inicio: hora_inicio,
                    hora_fim: hora_fim,
                    observacoes: observacoes || "",
                    status: "em_espera"
                }
            }),
            prisma.funcionario.update({
                where: { id_funcionario: id_funcionario },
                data: {
                    carga: { decrement: 1 }
                }
            })
        ])

        return res.status(201).send({
            mensagem: "Consulta agendada com sucesso"
        })
    } catch (error) {
        console.log("Erro ao agendar consulta:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Consultas (logado)

export async function consultas(req, res) {
    const id_usuario = req.usuarioLogado.id

    try {
        const listaConsulta = await prisma.consulta.findMany({
            where: {
                pet: {
                    id_usuario: id_usuario
                }
            }, 
            include: {
                pet: {
                    select: { nome: true }
                },
                funcionario: {
                    select: { nome: true, especialidade: true }
                }
            },
            orderBy: [
                { data_consulta: 'desc' },
                { hora_inicio: 'asc' }
            ]
        })

        if (listaConsulta.length === 0) {
            return res.status(404).send({
                mensagem: "Você não possui nenhuma consulta"
            })
        }

        return res.status(200).send({
            consultas: listaConsulta
        })
    } catch (error) {
        console.log("Erro ao listar consultas:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
    
}