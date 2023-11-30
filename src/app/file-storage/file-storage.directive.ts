import { Directive } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
    selector: '[appFileStorage]'
})
export class FileStorageDirective {
    private _file1Subject = new Subject();
    private _file2Subject = new Subject();

    file1$ = this._file1Subject.asObservable();
    file2$ = this._file1Subject.asObservable();

    constructor() { }

    loadFile(file: File, type: 1 | 2): void {
        let reader = new FileReader();
        reader.onload = () => {
            console.log(reader.result);
        }
        reader.readAsText(file);
    }
}
