export type CategoryRead = {
     id: number;
     name: string;
     slug: string;
     description: string;
}

export type CategoryCreate = {
     name: string;
     description?: string;
}

export type CategoryUpdate = Partial<CategoryCreate>;
