import jwt from 'jsonwebtoken'

export function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`)
    next()
}

export async function verificarToken(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).send({
            mensagem: "Acesso negado, faça login"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.usuarioLogado = decoded
        next()
    } catch (error) {
        return res.status(403).send({
            mensagem: "Sessão expirada, faça login novamente"
        })
    }
}

export async function verificarTokenReset(req, res, next) {
    const token = req.cookies.token_reset

    if (!token) {
        return res.status(401).send({
            mensagem: "Acesso negado"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.usuarioPermitido = decoded
        next()
    } catch (error) {
        return res.status(403).send({
            mensagem: "Sessão expirada, peça um codigo novamente"
        })
    }
}

export async function verificarTokenAdmin(req, res, next) {
    const token = req.cookies.token_adm

    if (!token) {
        return res.status(401).send({
            mensagem: "Acesso negado, faça login como administrador"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.admLogado = decoded
        next()
    } catch (error) {
        return res.status(403).send({
            mensagem: "Sessão expirada, faça login novamente"
        })
    }
}

export async function verificarTokenFuncionario(req, res, next) {
    const token = req.cookies.token_funcionario

    if (!token) {
        return res.status(401).send({
            mensagem: "Acesso negado, faça login como funcionario"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.funcionarioLogado = decoded
        next()
    } catch (error) {
        return res.status(403).send({
            mensagem: "Sessão expirada, faça login novamente"
        })
    }
}