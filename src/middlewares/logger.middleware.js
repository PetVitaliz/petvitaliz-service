import jwt from 'jsonwebtoken'

export function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`)
    next()
}

export async function verificarToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Acesso negado: Faça login" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioLogado = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Sessão expirada, faça login novamente" });
    }
}

export async function verificarTokenReset(req, res, next) {
    const token = req.cookies.token_reset;

    if (!token) {
        return res.status(401).json({ message: "Acesso negado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioPermitido = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Sessão expirada, peça um codigo novamente" });
    }
}

export async function verificarTokenAdmin(req, res, next) {
    
}