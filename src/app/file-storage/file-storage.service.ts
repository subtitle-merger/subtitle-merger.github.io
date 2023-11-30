import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {
    private _file1 = signal<string>("");
    private _file2 = signal<string>("");

    public file1 = this._file1();
    public file2 = this._file2();

    constructor() { }

    loadFile(file: File, type: 1 | 2): void {
        let reader = new FileReader();
        reader.onload = () => {
            if (type == 1) {
                this._file1.set(reader.result as string ?? '');
            } else {
                this._file2.set(reader.result as string ?? '');
            }
            console.log(reader.result);
        }
        reader.readAsText(file);
    }
}
