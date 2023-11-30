

export interface FileData {
    number: number;
    timestamp: string;
    start: number;
    end: number;
    originalContent: string;
    content: string;
}

export const timestampRegExp = /^(?<h>\d\d):(?<m>\d\d):(?<s>\d\d),(?<ms>\d\d\d)$/;