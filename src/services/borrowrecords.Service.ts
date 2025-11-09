
import * as borrowRecordsRepository from '../repositories/borrowrecords.Repository';
import { borrowrecords, newBorrowRecord, updateBorrow, getBorrowById, clearBorrow } from '../types/borrowrecords.Interface';

export const getAllBorrowRecords = async () : Promise<borrowrecords[]> => {
    return await borrowRecordsRepository.getAllBorrowRecords();
};

export const getBorrowRecordById = async (borrow_id: number) : Promise<getBorrowById | null> => {
    const record = await borrowRecordsRepository.getBorrowRecordById(borrow_id);
    if (!record) throw new Error (`Borrow record with ID ${borrow_id} not found`);
    return record;
};

export const createBorrowRecord = async (record: newBorrowRecord) =>{
    if(!record.user_id || !record.book_id){
        throw new Error("Borrow ID is required for update");
    }
   return await borrowRecordsRepository.insertBorrowRecord(record)
};

export const updateBorrowRecordService = async (record: updateBorrow): Promise<void> => {
  if (!record.borrow_id) {
    throw new Error("Borrow ID is required for update");
  }
  await borrowRecordsRepository.updateBorrowRecord(record);
};

export const clearBorrowRecord = async (record: clearBorrow): Promise<void> => {
  if (!record.borrow_id) {
    throw new Error("Borrow ID is required to clear record");
  }
  await borrowRecordsRepository.clearBorrowRecord(record);
};

export const deleteBorrowRecord = async (borrow_id: number): Promise<void> =>{
  const existing = await borrowRecordsRepository.getBorrowRecordById(borrow_id);
  if (!existing) {
    throw new Error(`Borrow record with ID ${borrow_id} does not exist`);
  }
  await borrowRecordsRepository.deleteBorrowRecord(borrow_id);
};
