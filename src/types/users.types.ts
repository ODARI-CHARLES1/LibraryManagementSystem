export interface User{
    user_id:number,
    username: string,
    email: string,
    password:string,
    password_hash?:string,
    role: 'Admin' | 'Member',
    created_at?: Date,
    updated_at?: Date
}

export interface newUser{
    username:string,
    email:string,
    password:string,
    role:'Admin' | 'Member',
    created_at?:Date,
    password_hash?:string
}

export interface TupdateUser{
    email:string,
    username?:string,
    password?:string,
    role?:'Admin' |'Member',
    updated_at?:Date
}


export interface existingUser{
    email:string,
    password:string,
    password_hash?:string
}

export interface loginJwtConfig{
    payload:{
        id:number
        username:string,
        role:string,
        created:Date,
        updated:Date,
        email:string,
    },
    expires:string,
    secret:string

}