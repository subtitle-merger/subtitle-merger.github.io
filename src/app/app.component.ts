import { Component, signal, computed } from '@angular/core';
import { FileStorageService } from './file-storage/file-storage.service';
import { MergerService } from './merger/merger.service';

import 'first-last';
import { FileData } from './file-storage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    readonly scale = signal(60);

    constructor(private fileStorage: FileStorageService, private merger: MergerService) {}

    onFileChange(event: Event, type: 1 | 2): void {
        const file = (event.target as HTMLInputElement).files?.item(0) ?? null;
        this.fileStorage.loadFile(file, type);
    }
    onMergeClick(): void {
        if (!this.file1Data().length || !this.file2Data().length) alert('Both files must be uploaded.')

        const newData = this.merger.mergeData(this.file1Data(), this.file2Data());
        console.log(newData);
        this.mergedData.set(newData);
    }

    getTimelinePeriodStyle(start: number, end: number): string {
        const startToScale = start / this.scale();
        const endToScale = end / this.scale();
        return `top:${startToScale}px;height:${endToScale-startToScale}px;`;
    }

    readonly sectionHeight = computed(() => {
        const f1 = this.file1Data().last();
        const f2 = this.file2Data().last();
        
        const heightToScale = Math.max(f1?.end ?? 0, f2?.end ?? 0) / this.scale();
        return `height:${heightToScale}px;`;
    })

    readonly file1Data = this.fileStorage.file1Data;
    readonly file2Data = this.fileStorage.file2Data;
    readonly mergedData = signal<FileData[]>([]);
}
