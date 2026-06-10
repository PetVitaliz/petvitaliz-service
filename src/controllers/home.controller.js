import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { emailContatoEnviado, emailReset_Enviado, emailPlanoAssinado } from '../lib/email.js'  
import cloudnary from '../lib/cloudnary.js'

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
    

    try {
        const pets = await prisma.pet.findMany({
            where: { id_usuario: id_usuario }
        })
        
        console.log(`Pets encontrados para o usuário ${id_usuario}:`, pets)

        return res.status(200).send({
            mensagem: "Pagina de listar pet",
            usuario: `${nome} ${sobrenome}`,
            pets: pets
        })
    } catch (error) {
        console.error("Erro ao listar pets no banco:", error)
        return res.status(500).json({
            mensagem: "Erro interno do servidor ao buscar pets"
        })
    }
}

// Cadastrar pet (logado)

export async function cadastrar_pet(req, res) {
    const { nome, especie, sexo, data_nascimento, idade, outra_especie, peso } = req.body
    const id_usuario = req.usuarioLogado.id

    if (!nome || typeof nome !== "string"){
        return res.status(400).json("Nome do pet é obrigatorio")
    }

    if(peso === undefined || peso === null || isNaN(Number(peso))){
        return res.status(400).json("Peso é obrigatorio e deve ser um numero");
    }

    const especie_lower = especie.trim().toLowerCase()
    if (especie_lower !== "cachorro" && especie_lower !== "gato" && especie_lower !== "ave" && especie_lower !== "coelho" && especie_lower !== "outro") {
        return res.status(400).json("Espécie inválida")
    }

    const sexo_lower = sexo ? sexo.toLowerCase().trim() : ''
    const sexoFinal = (sexo_lower === "macho" || sexo_lower === "m") ? "M" : "F"

    if(!data_nascimento || typeof data_nascimento != "string"){
        return res.status(400).json("Data de nascimento é obrigatorio")
    }

    try {
        let urlFotoCloudnary = null
        if (req.file) {
            const fName = req.file.originalname.split('.')[0]
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
            const resultadoCloudnary = await cloudnary.uploader.upload(fileBase64, {
                folder: 'petvitaliz',
                public_id: `${Date.now()}-${fName}`,
                resource_type: 'image'
            })
            urlFotoCloudnary = resultadoCloudnary.secure_url
        }

        const dataNascimentoTratada = new Date(`${data_nascimento}T00:00:00.000Z`);

        await prisma.pet.create({
            data: {
                nome: nome.trim(),
                especie: especie_lower,
                outra_especie: especie_lower === "outro" ? outra_especie.trim() : null,
                sexo: sexoFinal,
                data_nascimento: dataNascimentoTratada,
                idade: Number(idade) || 0,
                peso: Number(peso),
                foto_url: urlFotoCloudnary,
                usuario: {
                    connect: { id_usuario: Number(id_usuario) }
                }
            }
        })

        return res.status(201).json("Pet cadastrado com sucesso")
    } catch (error) {
        console.error("Erro ao cadastrar pet:", error)
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

// Editar pet (logado)

export async function editar_pet(req, res) {
    const id_pet = Number(req.params.id)
    const { nome, especie, sexo, data_nascimento, idade, peso, outra_especie, observacoes } = req.body
    
    try {
        if (!id_pet) return res.status(400).send({ mensagem: "Id inválido" })

        const existePet = await prisma.pet.findUnique({ where: { id_pet: id_pet } })
        if (!existePet) return res.status(404).send({ mensagem: "Pet não encontrado" })

        if (!nome || typeof nome !== "string") return res.status(400).send("Nome é obrigatório")

        const especie_lower = especie ? especie.trim().toLowerCase() : ''
        const sexo_lower = sexo ? sexo.toLowerCase().trim() : ''
        const sexoFinal = (sexo_lower === "m" || sexo_lower === "macho") ? "M" : "F";

        const dataNascimentoTratada = new Date(`${data_nascimento}T00:00:00.000Z`);

        let urlFotoCloudnary = existePet.foto_url;

        if (req.file) {
            const fName = req.file.originalname.split('.')[0]
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
            const resultadoCloudnary = await cloudnary.uploader.upload(fileBase64, {
                folder: 'petvitaliz',
                public_id: `${Date.now()}-${fName}`,
                resource_type: 'image'
            })
            urlFotoCloudnary = resultadoCloudnary.secure_url
        }

        const novoPet = await prisma.pet.update({
            where: { id_pet: id_pet },
            data: {
                nome: nome.trim(),
                especie: especie_lower,
                outra_especie: especie_lower === "outro" ? outra_especie.trim() : null,
                sexo: sexoFinal,
                data_nascimento: dataNascimentoTratada,
                idade: Number(idade),
                peso: peso ? Number(peso) : null,
                observacoes: observacoes,
                foto_url: urlFotoCloudnary
            }
        })

        return res.status(200).send({ pet: novoPet })
    } catch (error) {
        console.log("Erro ao editar pet:", error);
        return res.status(500).send({ mensagem: "Erro interno do servidor" })
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

// Cancelar consulta

export async function cancelar_agendamento(req, res) {
    const id_consulta = Number(req.params.id);
    const id_usuario = req.usuarioLogado.id;

    try {
        const consultaExiste = await prisma.consulta.findFirst({
            where: {
                id_consulta: id_consulta,
                pet: { id_usuario: id_usuario }
            }
        });

        if (!consultaExiste) {
            return res.status(404).json({ mensagem: "Agendamento não encontrado." });
        }

        await prisma.$transaction([
            prisma.consulta.delete({
                where: { id_consulta: id_consulta }
            }),
            prisma.funcionario.update({
                where: { id_funcionario: consultaExiste.id_funcionario },
                data: { carga: { increment: 1 } }
            })
        ]);

        return res.status(200).json({ mensagem: "Agendamento cancelado com sucesso." });
    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao cancelar." });
    }
}

// Pagamento

export async function pagamento(req, res) {
    const id_usuario = req.usuarioLogado.id;
    const { nome, sobrenome, email } = req.usuarioLogado;
    const { id_produto } = req.body;

    try {
        if (!id_produto) {
            return res.status(400).send({
                mensagem: "Id inválido"
            });
        }

        const planoExiste = await prisma.produtos.findUnique({
            where: { id_produto: id_produto }
        });

        if (!planoExiste) {
            return res.status(404).send({
                mensagem: "Id não encontrado"
            });
        }

        const assinaturaAtual = await prisma.assinaturas.findFirst({
            where: { id_usuario: id_usuario }
        });

        if (assinaturaAtual) {
            return res.status(400).send({
                mensagem: "Você já possui um plano, cancele o plano atual para assinar outro"
            });
        }

        await prisma.assinaturas.create({
            data: {
                id_usuario: id_usuario,
                id_produto: Number(id_produto),
                data_assinatura: new Date()
            }
        });

        emailPlanoAssinado(
            nome, 
            sobrenome, 
            email, 
            planoExiste.nome, 
            planoExiste.preco.toString()
        );

        return res.status(200).send({
            mensagem: "Plano assinado com sucesso"
        });
    } catch (error) {
        console.log("Erro ao assinar um plano:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        });
    }
}

// Plano

export async function planos(req, res) {
    const id_usuario = req.usuarioLogado.id

    try {
        const assinaturaUsuario = await prisma.assinaturas.findFirst({
            where: { id_usuario: id_usuario },
            include: {
                produtos: true
            }
        })

        if (!assinaturaUsuario) {
            return res.status(200).send({
                mensagem: "Você ainda não possui nenhum plano ativo"
            })
        }

        return res.status(200).send({
            tem_plano: true,
            include: {
                nome: assinaturaUsuario.produtos.nome,
                descricao: assinaturaUsuario.produtos.descricao,
                beneficios: assinaturaUsuario.produtos.beneficios,
                preco: assinaturaUsuario.produtos.preco
            }
        })
    } catch (error) {
        console.log("Erro ao listar plano ativo:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Cancelar plano

export async function cancelar_plano(req, res) {
    const id_usuario = req.usuarioLogado.id

    try {
        const assinaturaAtiva = await prisma.assinaturas.findFirst({
            where: { id_usuario: id_usuario }
        })

        if (!assinaturaAtiva) {
            return res.status(404).send({
                mensagem: "Você não possui nenhum plano para ser cancelado"
            })
        }

        await prisma.assinaturas.delete({
            where: { id_assinatura: assinaturaAtiva.id_assinatura }
        })

        return res.status(200).send({
            mensagem: "Plano cancelado com sucesso"
        })
    } catch (error) {
        console.log("Erro ao cancelar plano:", error);
        return res.status(500).send({
            mensagem: "Erro interno do servidor"
        })
    }
}