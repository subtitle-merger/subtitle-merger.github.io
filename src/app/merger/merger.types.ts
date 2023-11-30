import { FileData } from "../file-storage";


export interface _MergerObject<T> {
    boundary: number;
    data: T;
    isEnd: boolean;
}