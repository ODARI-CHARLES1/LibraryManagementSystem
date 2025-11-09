

export interface getBorrowById{
    borrow_id: number;
};

export interface borrowrecords{
    borrow_id: number,
    user_id: number,
    book_id: number,
    borrow_date: string,
    due_date: string,
    return_date: string,
    status?: string,
    created_at: string,
    updated_at: string;
};

export interface newBorrowRecord{
    user_id: number,
    book_id: number,
    borrow_date: string,
    due_date: string,
    status?: string;
};

export interface updateBorrow{
    borrow_id: number,
    return_date?: string,
    status?: string,
    updated_at?: string;
};

export interface clearBorrow{
    borrow_id: number,
    status?: string,
    return_date?: string,
    updated_at?: string;
};

export interface deleteBorrow{
    borrow_id: number;
};
