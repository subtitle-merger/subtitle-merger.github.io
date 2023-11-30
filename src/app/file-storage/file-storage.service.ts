import { Injectable, computed, signal } from '@angular/core';
import { FileData, timestampRegExp } from './file-storage.utils';

@Injectable({
    providedIn: 'root'
})
export class FileStorageService {
    private _file1 = signal<string>("");
    private _file2 = signal<string>("");

    public file1 = computed(() => this._file1());
    public file2 = computed(() => this._file2());

    file1Data = computed(() => this._contentToData(this._file1()));
    file2Data= computed(() => this._contentToData(this._file2()));

    constructor() { }

    private _contentToData(content: string): FileData[] {
        if (!content) return [];
        const parts = content.replace(/\r/g, '').split('\n\n').filter(v => v);
        return parts.map(part => {
            const lines = part.split('\n');
            const number = Number(lines.shift());
            const timestamp = lines.shift()!
            const timestampValues = timestamp.split(' --> ').map(v => this._timestampToInt(v));
            const originalContent = lines.join('\n');
            return {
                number,
                timestamp,
                start: timestampValues[0],
                end: timestampValues[1],
                originalContent,
                content: originalContent,
            }
        });
    }

    private _timestampToInt(timestamp: string): number {
        timestamp = timestamp.replace(/[^\d:,]/g, '');
        if (!timestampRegExp.test(timestamp)) {
            throw new Error(`Cannot parse timestamp "${timestamp}"`);
        }
        const groups = timestamp.match(timestampRegExp)!.groups!;

        let h = Number(groups['h']);
        let m = Number(groups['m']);
        let s = Number(groups['s']);
        let ms = Number(groups['ms']);

        m += h * 60;
        s += m * 60;
        ms += s * 1000;

        return ms;
    }

    loadFile(file: File | null, type: 1 | 2): void {
        if (!file) {
            if (type == 1) {
                this._file1.set('');
            } else {
                this._file2.set('');
            }
            return;
        }
        let reader = new FileReader();
        reader.onload = () => {
            if (type == 1) {
                this._file1.set(reader.result as string ?? '');
            } else {
                this._file2.set(reader.result as string ?? '');
            }
        }
        reader.readAsText(file);
    }
}
