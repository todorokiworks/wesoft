export interface Content {
    title: string;
    description: string;
    list: string[];
}

export interface ScientificCareer {
    title: string;
    subTitle: string;
    description: string;
    coverUrl: string;
    contents: Content[];
}