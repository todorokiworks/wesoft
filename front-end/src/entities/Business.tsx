export interface Content {
    title: string;
    description: string;
    list: string[];
}

export interface Business {
    id: number;
    title: string;
    subTitle: string;
    coverUrl: string;
    description: string;
    contents: Content[];
}