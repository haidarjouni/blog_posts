export type TagRead = {
     id: number;
     name: string;
     slug: string;
}

export type TagCreate = {
     name: string;
}

export type TagUpdate = Partial<TagCreate>;
