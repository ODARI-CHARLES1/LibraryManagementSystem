import { BorrowRecord, NewBorrowRecord, UpdateBorrowRecord, ClearBorrowRecord } from "../types/borrowrecords.Interface"
import { getPool } from "../config/database";
import dotenv from 'dotenv'
dotenv.config()


//getall Borrowrecords
export const getAllBorrowRecords = async (): Promise<BorrowRecord[]> => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM BorrowRecords");
  return result.recordset;
};

//get borrow records by id
export const getBorrowRecordById = async (borrow_id: number): Promise<BorrowRecord | null> => {
  const pool = await getPool();
  const result = await pool.request()
    .input("borrow_id", borrow_id)
    .query("SELECT * FROM BorrowRecords WHERE borrow_id = @borrow_id");
  return result.recordset[0] || null;
};


//inserting a new record
export const insertBorrowRecord = async (record: NewBorrowRecord): Promise<void> => {
  const pool = await getPool();
  await pool.request()
    .input("user_id", record.user_id)
    .input("book_id", record.book_id)
    .input("borrow_date", record.borrow_date)
    .input("due_date", record.due_date)
    .input("status", record.status ?? "Borrowed")
    .query(`
      INSERT INTO BorrowRecords (user_id, book_id, borrow_date, due_date, status)
      VALUES (@user_id, @book_id, @borrow_date, @due_date, @status)
    `);
};


//updating existing record
export const updateBorrowRecord = async (record: UpdateBorrowRecord): Promise<void> => {
  const pool = await getPool();
  await pool.request()
    .input("borrow_id", record.borrow_id)
    .input("return_date", record.return_date ?? null)
    .input("status", record.status ?? "Borrowed")
    .input("updated_at", record.updated_at ?? new Date())
    .query(`
      UPDATE BorrowRecords
      SET return_date = @return_date,
          status = @status,
          updated_at = @updated_at
      WHERE borrow_id = @borrow_id
    `);
};

//clear borrow record
export const clearBorrowRecord = async (record: ClearBorrowRecord): Promise<void> => {
  const pool = await getPool();
  await pool.request()
    .input("borrow_id", record.borrow_id)
    .input("status", record.status)
    .input("return_date", record.return_date)
    .input("updated_at", new Date())
    .query(`
      UPDATE BorrowRecords
      SET status = @status,
          return_date = @return_date,
          updated_at = @updated_at
      WHERE borrow_id = @borrow_id
    `);
};

//delete Borrow record
export const deleteBorrowRecord = async (borrow_id: number): Promise<void> => {
  const pool = await getPool();
  await pool.request()
    .input("borrow_id", borrow_id)
    .query("DELETE FROM BorrowRecords WHERE borrow_id = @borrow_id");
};

