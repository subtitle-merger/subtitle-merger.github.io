import { Component } from '@angular/core';
import { FileStorageService } from './file-storage/file-storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private fileStorage: FileStorageService) {}

    onFileChange(file: any, type: 1 | 2): void {
        console.log(file, type);
    }
}
