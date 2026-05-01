export interface SubItem {
    title: string;
    type:string;//img,text
    description: string;
}

export interface Project {
    title: string;
    description: string;
    imgUrl: string;
    subItems: SubItem[];
}