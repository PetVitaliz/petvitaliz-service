import nodemailer from 'nodemailer'

const configOptions = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


export async function emailContatoEnviado(nome, sobrenome, emailDestinatario, mensagem) {
    const emailContatoE = {
        from: `"Equipe Petvitaliz" <${process.env.EMAIL_USER}>`,
        to: emailDestinatario,
        subject:"Recebemos sua mensagem - PetVitaliz",
        html: `
        Olá <strong> ${nome} ${sobrenome}, 
        <br><br> Obrigado por entrar em contato! Sua mensagem foi recebida com
        sucesso.<br> Nossa equipe responderá em breve. 🐾<br><br> 
        <strong>Atenciosamente,<br>Equipe PetVitaliz</strong>
         `
    }

    const emailContatoR = {
        from: `${emailDestinatario}`,
        to: process.env.EMAIL_USER,
        subject: `Novo Contato: ${nome} ${sobrenome}`,
        html: `
            <h2>Novo contato recebido:</h2>
            <p><strong>Nome:</strong> ${nome} ${sobrenome}</p>
            <p><strong>E-mail:</strong> ${emailDestinatario}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
        `
    };

    try {
        const info = await configOptions.sendMail(emailContatoE)
        const info2 = await configOptions.sendMail(emailContatoR)
        console.log("Mensagem enviada: %s", info.messageId, info2.messageId);
        
    } catch (error) {
        console.log("Erro ao enviar o email:", error);
    }
}


export async function emailReset_Enviado(nome, sobrenome, emailDestinatario, codigo) {
    const emailReset = {
        from: `"Suporte Petvitaliz" <${process.env.EMAIL_USER}>`,
        to: emailDestinatario,
        subject:"Reset de Senha - PetVitaliz",
        html: `
        Olá <strong> ${nome} ${sobrenome}, 
        <br><br> Você solicitou uma redefinição de senha. <br><br> 
        Copie o codigo abaixo e cole no site:
        <br><br> <h3> ${codigo} </h3> <br><br>
        Este codigo expira em 10 minutos
        <br><br> <strong> Caso essa solicitação não seja sua ignore esse email 
        <br><br> Atenciosamente,<br>Equipe de Suporte PetVitaliz </strong>
        `
    }

    try {
        await configOptions.sendMail(emailReset);
        console.log("E-mail de reset enviado para:", emailDestinatario);
    } catch (error) {
        console.error("Erro ao enviar e-mail de reset:", error);
    }
}


export async function emailPlanoAssinado(nome, sobrenome, emailDestinatario, nomePlano, precoPlano) {
    const emailConfirmacao = {
        from: `"Financeiro Petvitaliz" <${process.env.EMAIL_USER}>`,
        to: emailDestinatario,
        subject: "Sua assinatura foi confirmada!",
        html: `
        <h2>Olá, <strong>${nome} ${sobrenome}</strong>!</h2>
        <p>Estamos muito felizes em informar que a contratação do seu plano foi processada com sucesso.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Detalhes da Assinatura:</strong></p>
        <ul>
            <li><strong>Plano:</strong> ${nomePlano}</li>
            <li><strong>Valor:</strong> R$ ${precoPlano} / mês</li>
            <li><strong>Status do Pagamento:</strong> Confirmado (Cartão de Crédito)</li>
        </ul>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p>A partir de agora, os benefícios já estão vinculados à sua conta. Se precisar de qualquer ajuda ou quiser agendar procedimentos, acesse seu painel.</p>
        <br>
        <p><strong>Atenciosamente,</strong><br>Equipe Financeira PetVitaliz</p>
        `
    };

    try {
        await configOptions.sendMail(emailConfirmacao);
        console.log(`E-mail de confirmação de plano enviado para: ${emailDestinatario}`);
    } catch (error) {
        console.error("Erro ao enviar e-mail de confirmação de plano:", error);
    }
}
