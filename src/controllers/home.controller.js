import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

export async function home_n_logada(req, res) {
    return res.status(200).send("Home n logada, faça login para poder ultilizar os recursos do site")
}

export async function home(req, res) {
    const { nome, sobrenome } = req.usuarioLogado;

    return res.status(200).send(`Home Logada, ${nome} ${sobrenome} - usuario`);
}