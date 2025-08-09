import type { Request, Response } from 'express';
import { db } from '../database/database';

// Tipagem auxiliar
interface Veiculo {
  id?: number;
  veiculo: string;
  marca: string;
  ano: number;
  descricao?: string;
  vendido: boolean | number;
}

export function listar(req: Request, res: Response) {
  const { marca, ano, vendidos } = req.query;

  let query = 'SELECT * FROM veiculos WHERE 1=1';
  const params: (string | number)[] = [];

  if (marca) {
    query += ' AND marca = ?';
    params.push(marca as string);
  }

  if (ano) {
    query += ' AND ano = ?';
    params.push(Number(ano));
  }

  if (vendidos === '0') {
    query += ' AND vendido = 0';
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
}

export function buscarPorId(req: Request, res: Response) {
  const { id } = req.params;

  db.get('SELECT * FROM veiculos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!row) return res.status(404).json({ erro: 'Veículo não encontrado' });

    res.json(row);
  });
}

export function criar(req: Request, res: Response) {
  const { veiculo, marca, ano, descricao, vendido }: Veiculo = req.body;

  const query = `
    INSERT INTO veiculos (veiculo, marca, ano, descricao, vendido)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [veiculo, marca, ano, descricao, vendido ? 1 : 0], function (err) {
    if (err) return res.status(500).json({ erro: err.message });

    res.status(201).json({ id: this.lastID });
  });
}

export function atualizar(req: Request, res: Response) {
  const { id } = req.params;
  const { veiculo, marca, ano, descricao, vendido }: Veiculo = req.body;

  const query = `
    UPDATE veiculos SET
      veiculo = ?,
      marca = ?,
      ano = ?,
      descricao = ?,
      vendido = ?,
      updated = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [veiculo, marca, ano, descricao, vendido ? 1 : 0, id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });

    res.json({ atualizado: this.changes > 0 });
  });
}

export function atualizarParcial(req: Request, res: Response) {
  const { id } = req.params;
  const campos: Partial<Veiculo> = req.body;

  const entries = Object.entries(campos).filter(([key]) => key !== 'id');

  const updates = entries.map(([key]) => `${key} = ?`);
  const values = entries.map(([key, value]) =>
    key === 'vendido' ? (value ? 1 : 0) : value
  );

  if (updates.length === 0) {
    return res.status(400).json({ erro: 'Nenhum campo para atualizar' });
  }

  const query = `
    UPDATE veiculos SET ${updates.join(', ')}, updated = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [...values, id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });

    res.json({ atualizado: this.changes > 0 });
  });
}

export function deletar(req: Request, res: Response) {
  const { id } = req.params;

  db.run('DELETE FROM veiculos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });

    res.json({ deletado: this.changes > 0 });
  });
}

export function contarNaoVendidos(_req: Request, res: Response) {
  db.get('SELECT COUNT(*) as total FROM veiculos WHERE vendido = 0', (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(row);
  });
}

export function distribuicaoPorDecada(_req: Request, res: Response) {
  db.all(
    `
    SELECT
      (CAST(ano / 10 AS INTEGER) * 10) AS decada,
      COUNT(*) as quantidade
    FROM veiculos
    GROUP BY decada
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    }
  );
}

export function distribuicaoPorMarca(_req: Request, res: Response) {
  db.all(
    `
    SELECT marca, COUNT(*) as quantidade
    FROM veiculos
    GROUP BY marca
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    }
  );
}

export function cadastradosUltimaSemana(_req: Request, res: Response) {
  db.all(
    `
    SELECT * FROM veiculos
    WHERE DATE(created) >= DATE('now', '-7 days')
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    }
  );
}
