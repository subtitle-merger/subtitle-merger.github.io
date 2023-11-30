import { Injectable } from '@angular/core';
import { FileData } from '../file-storage';
import { _MergerObject } from './merger.types';

@Injectable({
    providedIn: 'root'
})
export class MergerService {

    constructor() { }

    mergeData(data1: FileData[], data2: FileData[]): FileData[] {
        const mergerData = [...this._dataToMergerData(data1), ...this._dataToMergerData(data2)];
        mergerData.sort((a, b) => {
            if (a.boundary != b.boundary) {
                return a.boundary - b.boundary;
            }
            return (a.isEnd ? 1 : 0) - (b.isEnd ? 1 : 0);
        });
        const currentItems: string[] = [];
        const result: FileData[] = [];
        for (let i = 0; i < mergerData.length - 1; i += 2) {
            const a = mergerData[i];
            const b = mergerData[i + 1];
            //handle content
            if (!a.isEnd) {
                currentItems.push(a.data.originalContent);
            }
            const originalContent = currentItems.join('\n');
            if (a.isEnd) {
                currentItems.filter(v => v != a.data.originalContent);
            }

            //determine if a period is complete
            const n = a.isEnd ? a.boundary + 1 : a.boundary;
            const m = b.isEnd ? b.boundary : b.boundary - 1;
            if (n > m) continue;

            const timestamp = `${this._intToTimestamp(n)} --> ${this._intToTimestamp(m)}`;

            //create the item
            result.push({
                number: result.length + 1,
                timestamp,
                start: n,
                end: m,
                originalContent,
                content: originalContent,
            });
        }
        return result;
    }

    private _intToTimestamp(int: number): string {
        return new Date(int).toISOString().slice(11, 23).replace('.', ',');
    }

    private _dataToMergerData(data: FileData[]): _MergerObject<FileData>[] {
        return data.map(item => [
            {
                boundary: item.start,
                data: item,
                isEnd: false,
            },
            {
                boundary: item.end,
                data: item,
                isEnd: false,
            },
        ]).flat(1);
    }
}
