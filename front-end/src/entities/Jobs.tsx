export interface Content {
    title: string;
    description: string;
    list: string[];
}

export interface Job {
    title: string;
    description: string;
    contents: Content[];
}