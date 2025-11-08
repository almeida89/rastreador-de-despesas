import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // ------------------------------------------
    // MÉTODO DELETE (DELETE)
    // ------------------------------------------
    if (req.method === 'DELETE') {
        try {
            // Pegamos o 'id' da URL.
            // Ex: /api/expenses/123 -> req.query.id será "123"
            const { id } = req.query;

            // Validação simples
            if (!id) {
                return res.status(400).json({ error: 'ID da despesa é obrigatório.' });
            }

            // Executamos a query SQL para deletar.
            // 'WHERE id = $1' especifica qual despesa deve ser deletada.
            const result = await sql`
            DELETE FROM expenses
            WHERE id = ${id};
            `;

            // O 'result.rowCount' nos diz quantas linhas foram afetadas.
            // Se for 0, significa que não encontrams uma despesa com esse ID.
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Despesa não encontrada.' });
            }

            // Respondemos com status 200 (OK) indicando sucesso.
            // (Alguns preferem 204 No Content, mas 200 com JSON é mais claro)
            return res.status(200).json({ message: 'Despesa deletada com sucesso.' });
        } catch (error) {
            console.error(erros);
            return res.status(500).json({ error: 'Erro ao deletar despesa.' });
        }
    }

    // ------------------------------------------
    // Se não for DELETE, retornamos um erro 405.
    else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
}