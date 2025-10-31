// src/repositories/categories.Repository.ts
import sql from 'mssql';
import { getPool } from '../config/database.js';
import { Category } from '../types/categories.Interface.js';

export const findAll = async (): Promise<Category[]> => {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT category_id, name, description, created_at, updated_at
    FROM Categories
    ORDER BY name
  `);
  return result.recordset;
};

export const findById = async (id: number): Promise<Category | null> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`
      SELECT category_id, name, description, created_at, updated_at
      FROM Categories WHERE category_id = @id
    `);
  return result.recordset[0] ?? null;
};

export const create = async (name: string, description?: string): Promise<Category> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('name', sql.NVarChar(50), name)
    .input('description', sql.NVarChar(200), description ?? null)
    .query(`
      INSERT INTO Categories (name, description)
      OUTPUT INSERTED.*
      VALUES (@name, @description)
    `);
  return result.recordset[0];
};

export const update = async (
  id: number,
  name?: string,
  description?: string
): Promise<Category | null> => {
  const pool = await getPool();
  const request = pool.request().input('id', sql.Int, id);
  let setClause = 'updated_at = GETDATE()';
  if (name !== undefined) {
    setClause += ', name = @name';
    request.input('name', sql.NVarChar(50), name);
  }
  if (description !== undefined) {
    setClause += ', description = @description';
    request.input('description', sql.NVarChar(200), description);
  }

  const result = await request.query(`
    UPDATE Categories
    SET ${setClause}
    OUTPUT INSERTED.*
    WHERE category_id = @id
  `);
  return result.recordset[0] ?? null;
};

export const remove = async (id: number): Promise<boolean> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`DELETE FROM Categories WHERE category_id = @id`);
  return result.rowsAffected[0] > 0;
};

export const countBooksInCategory = async (categoryId: number): Promise<number> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('categoryId', sql.Int, categoryId)
    .query(`SELECT COUNT(*) AS cnt FROM Books WHERE category_id = @categoryId`);
  return result.recordset[0].cnt;
};