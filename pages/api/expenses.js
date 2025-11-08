// Importamos o SDK do Vercel Postgres.
// A função 'sql' é  uma "template literal tag" que nos ajuda a escrever o SQL
// de forma segura, prevenindo SQL Injection.
import { sql } from '@vercel/postgres';

// Este é o 'handler' principal da nossa API.
// Ele recebe 'req' (request - a requisição) e 'res' (response - a resposta).
export default async function handler(req, res) {
    // ------------------------------------------
    // MÉTODO POST (CREATE)
    // ------------------------------------------
    if (req.method === 'POST') {
        try {
            // Pegamos 'description' e 'amount' do corpo (body) da requisição.
            // O 'req-body' é o JSON que nosso Frontend enviará.
            const { description, amount } = req.body;

            // Validação simples de entrada
            if (!description || !amount) {
                return res.status(400).json({ error: 'Descrição e valor são obrigatórios.' });
            }

            // Convertemos o valor para centavos (inteiro)
            // Ex: 10.50 (enviado ao front) que se torna 1050 (armazenado no DB)
            // Math.round garante que seja um inteiro.
            const amountInCents = Math.round(parseFloat(amount) * 100);

            // Executamos a query SQL para inserir os dados.
            // Os valores ($1, $2) são substituidos de forma segura
            // pelos valores no array [description, amountInCents].
            await sql`
                INSERT INTO expenses (description, amount)
                VALUES (${description}, ${amountInCents});
            `;

            // Respondemos com status 201 (Created) e um JSON de sucesso.
            return res.status(201).json({ message: 'Despesa criada com sucesso!' });
        } catch (error) {
            // Se algo der errado (ex: falha no banco de dados), capturamos o erro.
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar despesa.' })
        }
    }

    // ------------------------------------------
    // MÉTODO GET (READ)
    // ------------------------------------------
    else if (req.method === 'GET'){
        try{
            // Executamos a query SQL para selecionar todas as despesas
            // 'SELECT *' significa "selecione todas as colunas".
            // 'ORDER BY created_at DESC' lista as mais recentes primeiro.
            const { rows } = await sql`
                SELECT * FROM expenses
                ORDER BY creste_at DESC;
            `;

            // Respondemos com status 200 (OK) e a lista de despesa (rows).
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar despesas.' });
        }
    }

    // ------------------------------------------
    // Se não for POST nem GET, retornamos um erro 405 (Method Not Allowed)
    else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Método ${req.method} não permitido.`});
    }
}