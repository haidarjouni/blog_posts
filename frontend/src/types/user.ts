export type UserRead = {
     id: number;
     username: string;
     email: string;
     is_admin: boolean;
}

export type UserCreate = {
     username: string;
     email: string;
     password: string;
}