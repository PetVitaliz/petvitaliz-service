import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import cloudnary from '../lib/cloudnary.js'

// Home

export async function home_adm(req, res) {
    return res.status(200).json({
        pagina: "Home Administrador"
    })
}

// LOGOUT

export async function logout_adm(req, res) {
    return res.clearCookie('token_adm') .status(200).json({
        message: "Logout realizado com sucesso"
    });
}

// CADASTRAR ADM

export async function cadastro_adm(req, res) {
    const { username, email, senha, ativo } = req.body

    try {
        if (!username || typeof username !== "string" || username.length < 2) {
            return res.status(400).json("username é obrigatorio e deve ter pelo menos 2 caracteres")
        }
        if (!email || typeof email !== "string") {
            return res.status(400).json("email é obrigatorio")
        }
        if (!senha || typeof senha !== "string" || senha.length < 6) {
            return res.status(400).json("senha é obrigatorio e deve ter pelo menos 6 caracteres")
        }

        const isAtivo = ativo === 'true' || ativo === true;

        const existing = await prisma.administrador.findFirst({
            where: { ADM_EMAIL: email.trim().toLowerCase() }
        })
        const existing2 = await prisma.administrador.findFirst({
            where: { ADM_NOME: username.trim().toLowerCase() }
        })

        if (existing) return res.status(400).json("Email ja cadastrado")
        if (existing2) return res.status(400).json("Username ja cadastrado")

        let urlFoto = null
        if (req.file) {
            const fName = req.file.originalname.split('.')[0]
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
            const resultado = await cloudnary.uploader.upload(fileBase64, {
                folder: 'petvitaliz',
                public_id: `${Date.now()}-${fName}`,
                resource_type: 'image'
            })
            urlFoto = resultado.secure_url
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)

        await prisma.administrador.create({
            data: {
                ADM_NOME: username.trim(),
                ADM_ATIVO: isAtivo,
                ADM_EMAIL: email.trim().toLowerCase(),
                ADM_SENHA: hashedPassword,
                ADM_FOTO_URL: urlFoto
            }
        })

        return res.status(201).json("Administrador cadastrado com sucesso")
    } catch (error) {
        console.error("erro ao cadastrar adm", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

// Listar ADM

export async function listar_adm(req, res) {
    try {
        const adms = await prisma.administrador.findMany({
            select: {
                ADM_ID: true,
                ADM_NOME: true,
                ADM_EMAIL: true,
                ADM_ATIVO: true,
                ADM_FOTO_URL: true
            }
        })
        return res.status(200).json({ ADMs: adms })
    } catch (error) {
        console.error("erro ao listar adms", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

// Listar adm especifico

export async function listar_adm_esp(req, res) {
    const id_adm = Number(req.params.id)

    try {

        if (!id_adm) {
        return res.status(404).json("Id invalido")
        }
        
        const existeADM = await prisma.administrador.findUnique({
            where: { ADM_ID: id_adm }
        })

        if (!existeADM) {
            return res.status(404).json({
                mensagem: "Id não encontrado"
            })
        }

        const adm = await prisma.administrador.findMany({
            where: { ADM_ID: id_adm },
            select: {
                ADM_ID: true,
                ADM_NOME: true,
                ADM_EMAIL: true,
                ADM_ATIVO: true,
                ADM_FOTO_URL: true
            }
        })

        return res.status(200).json({
            ADMs: adm
        })
    } catch (error) {
        console.error("erro ao listar adm especifico", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Editar ADM

export async function editar_adm(req, res) {
    const id_adm = Number(req.params.id)
    const { username, email, senha, ativo } = req.body

    try {
        if (!id_adm) return res.status(404).json({ mensagem: "Id invalido" })

        const existeADM = await prisma.administrador.findUnique({ where: { ADM_ID: id_adm } })
        if (!existeADM) return res.status(404).json({ mensagem: "Id não encontrado" })

        if (!username || typeof username !== "string" || username.length < 2) {
            return res.status(400).json("Username é obrigatorio")
        }
        if (!email || typeof email !== "string") {
            return res.status(400).json("Email é obrigatorio")
        }

        const isAtivo = ativo === 'true' || ativo === true;

        const existing = await prisma.administrador.findFirst({
            where: { ADM_EMAIL: email.trim().toLowerCase(), NOT: { ADM_ID: id_adm } }
        })
        const existing2 = await prisma.administrador.findFirst({
            where: { ADM_NOME: username.trim().toLowerCase(), NOT: { ADM_ID: id_adm } }
        })

        if (existing) return res.status(400).json("Email ja cadastrado")
        if (existing2) return res.status(400).json("Username ja cadastrado")

        let urlFoto = existeADM.ADM_FOTO_URL
        if (req.file) {
            const fName = req.file.originalname.split('.')[0]
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
            const resultado = await cloudnary.uploader.upload(fileBase64, {
                folder: 'petvitaliz',
                public_id: `${Date.now()}-${fName}`,
                resource_type: 'image'
            })
            urlFoto = resultado.secure_url
        }

        const dataUpdate = {
            ADM_NOME: username.trim(),
            ADM_EMAIL: email.trim().toLowerCase(),
            ADM_ATIVO: isAtivo,
            ADM_FOTO_URL: urlFoto
        }

        if (senha && senha.trim().length >= 6) {
            const salt = await bcrypt.genSalt(10)
            dataUpdate.ADM_SENHA = await bcrypt.hash(senha.trim(), salt)
        }

        const novo_ADM = await prisma.administrador.update({
            where: { ADM_ID: id_adm },
            data: dataUpdate
        })

        return res.status(200).json({ mensagem: "Administrador editado com sucesso", ADM: novo_ADM })
    } catch (error) {
        console.error("erro ao editar adm", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}


// Excluir ADM

export async function excluir_adm(req, res) {
    const id_adm = Number(req.params.id)

   try {

    if (!id_adm) {
        return res.status(404).json("Id invalido")
    }
    
    const existeADM = await prisma.administrador.findUnique({
        where: { ADM_ID: id_adm }
    })

    if (!existeADM) {
        return res.status(404).json({
            mensagem: "Id não encontrado"
        })
    }
    
    const deletarADM = await prisma.administrador.delete({
        where: { ADM_ID: id_adm }
    })

    const adms = await prisma.administrador.findMany({
        select: {
            ADM_ID: true,
            ADM_NOME: true,
            ADM_EMAIL: true,
            ADM_ATIVO: true
        }
    })

    return res.status(200).json({
        mensagem: "Administrador deletado com sucesso",
        ADMs: adms
    })
    
   } catch (error) {
        console.error("erro ao excluir adm", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
   }
}


// Cadastrar Funcionario

export async function cadastar_funcionario(req, res) {
    const { nome, sobrenome, email, especialidade, ativo, senha } = req.body

    try {
        if (!nome || typeof nome !== "string" || nome.length < 2) {
            return res.status(400).json("Nome é obrigatório e deve ter pelo menos 2 caracteres")
        }

        if (!sobrenome || typeof sobrenome !== "string" || sobrenome.length < 2) {
            return res.status(400).json("Sobrenome é obrigatório e deve ter pelo menos 2 caracteres")
        }

        if (!email || typeof email !== "string" || !email.trim().toLowerCase().endsWith('@petvitalizfuncionario.com')) {
            return res.status(400).json("O e-mail é obrigatório e deve ser corporativo (@petvitalizfuncionario.com)")
        }
    
        const espLower = especialidade ? especialidade.toLowerCase().trim() : '';
        if (espLower !== "veterinario" && espLower !== "tosador" && espLower !== "recepcionista" && espLower !== "financeiro") {
            return res.status(400).json("Especialidade inválida. Escolha 'veterinario', 'tosador', 'recepcionista' ou 'financeiro' ")
        }

        if (!senha || typeof senha !== "string" || senha.length < 6) {
            return res.status(400).json("Senha é obrigatória e deve ter pelo menos 6 caracteres")
        }
        
        const isAtivo = ativo === 'true' || ativo === true;

        const emailTratado = email.trim().toLowerCase();
        const existing = await prisma.funcionario.findFirst({
            where: { email: emailTratado }
        })
    
        if (existing) {
            return res.status(400).json("E-mail já cadastrado para outro funcionário")
        }

        let urlFoto = null
        if (req.file) {
            const fName = req.file.originalname.split('.')[0]
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
            const resultado = await cloudnary.uploader.upload(fileBase64, {
                folder: 'petvitaliz_funcionarios',
                public_id: `${Date.now()}-${fName}`,
                resource_type: 'image'
            })
            urlFoto = resultado.secure_url
        }
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
        
        await prisma.funcionario.create({
            data: {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                email: emailTratado,
                especialidade: espLower,
                ativo: isAtivo,
                carga: 8,
                senha: hashedPassword,
                foto_url: urlFoto
            }
        })
    
        return res.status(201).json("Funcionário cadastrado com sucesso")
    } catch (error) {
        console.error("Erro ao cadastrar funcionário:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

// Listar Funcionario

export async function listar_funcionario(req, res) {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            select: {
                id_funcionario: true,
                nome: true,
                sobrenome: true,
                email: true,
                especialidade: true,
                ativo: true,
                foto_url: true,
                carga: true
            },
            orderBy: {
                id_funcionario: 'desc'
            }
        })
        return res.status(200).json({ funcionarios })
    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}



// Listar funcionario especifico

export async function listar_funcionario_esp(req, res) {
    const id_funcionario = Number(req.params.id)

    try {
        if (!id_funcionario) {
            return res.status(404).json("Id invalido")
        }

        const existeFuncionario = await prisma.funcionario.findUnique({
            where: { id_funcionario: id_funcionario }
        })

        if (!existeFuncionario) {
            return res.status(404).json({
                mensagem: "Id não encontrado"
            })
        }

        const funcionario = await prisma.funcionario.findUnique({
            where: { id_funcionario: id_funcionario },
            select: {
                id_funcionario: true,
                nome: true,
                sobrenome: true,
                email: true,
                especialidade: true,
                ativo: true,
                foto_url: true,
                carga: true
            }
        })

        return res.status(200).json({
            funcionario: funcionario
        })
    } catch (error) {
        console.error("erro ao listar funcionario especifico", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Editar Funcionario

export async function editar_funcionario(req, res) {
    const id_funcionario = Number(req.params.id)
    const { nome, sobrenome, email, especialidade, ativo, senha } = req.body

    try {
        if (!id_funcionario) return res.status(404).json({ mensagem: "ID inválido" })

        const existeFuncionario = await prisma.funcionario.findUnique({ where: { id_funcionario } })
        if (!existeFuncionario) {
            return res.status(404).json({ mensagem: "Funcionário não encontrado" })
        }

        if (!nome || typeof nome !== "string" || nome.length < 2) {
            return res.status(400).json("Nome é obrigatório e deve ter pelo menos 2 caracteres")
        }

        if (!sobrenome || typeof sobrenome !== "string" || sobrenome.length < 2) {
            return res.status(400).json("Sobrenome é obrigatório e deve ter pelo menos 2 caracteres")
        }
        
            
        if (!email || !email.trim().toLowerCase().endsWith('@petvitalizfuncionario.com')) {
            return res.status(400).json("O e-mail deve ser corporativo (@petvitalizfuncionario.com)")
        }

        const espLower = especialidade ? especialidade.toLowerCase().trim() : '';
        if (espLower !== "veterinario" && espLower !== "tosador" && espLower !== "recepcionista" && espLower !== "financeiro") {
            return res.status(400).json("Especialidade inválida. Escolha 'veterinario', 'tosador', 'recepcionista' ou 'financeiro' ")
        }

        const emailTratado = email.trim().toLowerCase();
        const existing = await prisma.funcionario.findFirst({
            where: { email: emailTratado, NOT: { id_funcionario } }
        })
        if (existing) return res.status(400).json("E-mail já está em uso por outro colaborador")

        let urlFoto = existeFuncionario.foto_url
        if (req.file) {
            const fName = req.file.originalname.split('.')[0]
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
            const resultado = await cloudnary.uploader.upload(fileBase64, {
                folder: 'petvitaliz_funcionarios',
                public_id: `${Date.now()}-${fName}`,
                resource_type: 'image'
            })
            urlFoto = resultado.secure_url
        }

        const isAtivo = ativo === 'true' || ativo === true;
        const dataUpdate = {
            nome: nome.trim(),
            email: emailTratado,
            sobrenome: sobrenome,
            especialidade: espLower,
            ativo: isAtivo,
            foto_url: urlFoto
        }

        if (senha && senha.trim().length >= 6) {
            const salt = await bcrypt.genSalt(10)
            dataUpdate.senha = await bcrypt.hash(senha.trim(), salt)
        }

        const atualizado = await prisma.funcionario.update({
            where: { id_funcionario },
            data: dataUpdate
        })

        return res.status(200).json({ mensagem: "Funcionário editado com sucesso", funcionario: atualizado })
    } catch (error) {
        console.error("Erro ao editar funcionário:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}


// Excluir funcionario

export async function excluir_funcionario(req, res) {
    const id_funcionario = Number(req.params.id)

   try {

    if (!id_funcionario) {
        return res.status(404).json("Id invalido")
    }

    const existeFuncionario = await prisma.funcionario.findUnique({
        where: { id_funcionario: id_funcionario }
    })

    if (!existeFuncionario) {
        return res.status(404).json({
            mensagem: "Id não encontrado"
        })
    }

    const deletarFuncionario = await prisma.funcionario.delete({
        where: { id_funcionario: id_funcionario }
    })

    const funcionario = await prisma.funcionario.findMany({
        select: {
            id_funcionario: true,
            nome: true,
            sobrenome: true,
            especialidade: true,
            registro: true,
            ativo: true,
            senha: true
        }, orderBy: {
            id_funcionario: 'desc',
          } 
    })

    return res.status(200).json({
        mensagem: "Funcionario deletado com sucesso",
        funcionarios: funcionario
    })
    
   } catch (error) {
        console.error("erro ao excluir funcionario", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
   }
}

// Cadastrar Produto

export async function cadastro_produto(req, res) {
    const {nome, descricao, beneficios, preco} = req.body

    try {
        if(!nome || typeof nome !== "string" || nome.length < 5){
            return res.status(400).json("Nome é obrigatorio e deve ter pelo menos 5 caracteres")
        }
    
        if (!descricao || typeof descricao !== "string"){
            return res.status(400).json("Descrição é obrigatoria")
        }
    
        if(!beneficios || typeof beneficios !== "string" || beneficios.length < 6){
            return res.status(400).json("Beneficios é obrigatorio e deve ter pelo menos 6 caracteres")
        }
        
        if (preco === undefined) {
            return res.status(400).json("Preço é obrigatorio")
        }

        if(typeof preco !== 'number'){
            return res.status(400).json("Preço deve ser um numero")
        }
        
        const produto = await prisma.produtos.create({
            data: {
                nome: nome.trim(),
                descricao: descricao.trim(),
                beneficios: beneficios,
                preco: preco
            }
        })
    
        return res.status(201).json("Produto cadastrado com sucesso")
    } catch (error) {
        console.error("erro ao cadastrar produto", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Listar Produto

export async function listar_produtos(req, res) {
    try {
        const produtos = await prisma.produtos.findMany({
            select: {
                id_produto: true,
                nome: true,
                descricao: true,
                beneficios: true,
                preco: true
            }
        })
        return res.status(200).json({
            produtos: produtos
        })
    } catch (error) {
        console.error("erro ao listar produtos", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

// Listar produto especifico

export async function listar_produto_especifico(req, res) {
    const id_produto = Number(req.params.id)

    try {
        if (!id_produto) {
            return res.status(404).json({
                mensagem: "ID invalido"
            })
        }

        const existeProduto = await prisma.produtos.findUnique({
            where: { id_produto: id_produto }
        })

        if (!existeProduto) {
            return res.status(404).json({
                mensagem: "Id não encontrado"
            })
        }
        const produto = await prisma.produtos.findUnique({
            where: { id_produto: id_produto },
            select: {
                id_produto: true,
                nome: true,
                descricao: true,
                beneficios: true,
                preco: true
            }
        })

        return res.status(200).json({
            produto: produto
        })
    } catch (error) {
        console.error("erro ao listar produto especifico", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}



// Editar Produto

export async function editar_produto(req, res) {
    const id_produto = Number(req.params.id)
    const {nome, descricao, beneficios, preco} = req.body

    try {

        if (!id_produto) {
            return res.status(404).json({
                mensagem: "ID invalido"
            })
        }

        const existeProduto = await prisma.produtos.findUnique({
            where: { id_produto: id_produto }
        })

        if (!existeProduto) {
            return res.status(404).json({
                mensagem: "Id não encontrado"
            })
        }

        if(!nome || typeof nome !== "string" || nome.length < 5){
            return res.status(400).json("nome é obrigatorio e deve ter pelo menos 5 caracteres")
        }
    
        if (!descricao || typeof descricao !== "string"){
            return res.status(400).json("descricao é obrigatorio")
        }
    
        if(!beneficios || typeof beneficios !== "string" || beneficios.length < 6){
            return res.status(400).json("beneficios é obrigatorio e deve ter pelo menos 6 caracteres")
        }
        
        if (preco === undefined) {
            return res.status(400).json("preco é obrigatorio")
        }

        if(typeof preco !== 'number'){
            return res.status(400).json("preco deve ser um numero")
        }
        
        const novo_Produto = await prisma.produtos.update({
            where: { id_produto: id_produto },
            data: {
                nome: nome.trim(),
                descricao: descricao.trim(),
                beneficios: beneficios,
                preco: preco
            }
        })
    
        return res.status(201).json({
            mensagem: "Produto atualizado com sucesso",
            novo_Produto: novo_Produto
        })
    } catch (error) {
        console.error("erro ao editar produto", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }   
}

// Excluir Produto

export async function excluir_produto(req, res) {
    const id_produto = Number(req.params.id)

   try {

    if (!id_produto) {
        return res.status(404).json("Id invalido")
    }

    const existeProduto = await prisma.produtos.findUnique({
        where: { id_produto: id_produto }
    })

    if (!existeProduto) {
        return res.status(404).json({
            mensagem: "Id não encontrado"
        })
    }

    const deletarProduto = await prisma.produtos.delete({
        where: { id_produto: id_produto }
    })

    const produtos = await prisma.produtos.findMany({
        select: {
            id_produto: true,
            nome: true,
            descricao: true,
            beneficios: true,
            preco: true
        }, orderBy: {
            id_produto: 'desc',
          } 
    })

    return res.status(200).json({
        mensagem: "Produto deletado com sucesso",
        Produtos: produtos
    })
    
   } catch (error) {
        console.error("erro ao excluir produto", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
   }
}

// Upload de imagem

export async function uploadImagem(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                mensagem: "Nenhum arquivo enviado"
            })
        }

        const fName = req.file.originalname.split('.')[0]
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        
        const resultadoCloudnary = await cloudnary.uploader.upload(fileBase64, {
            folder: 'petvitaliz',
            public_id: `${Date.now()}-${fName}`,
            resource_type: 'image'
        })

        return res.status(200).json({
            mensagem: "Upload realizado com sucesso",
            url: resultadoCloudnary.secure_url
        })
    } catch (error) {
        console.log("Erro no upload para o Cloudinary:", error)
        return res.status(500).json({
            mensagem: "Erro interno do servidor" 
        })
    }
}