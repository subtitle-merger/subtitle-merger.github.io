import { Component, signal, computed } from '@angular/core';
import { FileStorageService } from './file-storage/file-storage.service';
import { MergerService } from './merger/merger.service';

import { FileData } from './file-storage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    readonly scale = signal(60);

    constructor(private fileStorage: FileStorageService, private merger: MergerService) { }

    onFileChange(event: Event, type: 1 | 2): void {
        const file = (event.target as HTMLInputElement).files?.item(0) ?? null;
        this.fileStorage.loadFile(file, type);
    }
    onMergeClick(): void {
        if (!this.file1Data().length || !this.file2Data().length) {
            alert('Both files must be uploaded.');
            return;
        }

        let file1 = [...this.file1Data()];
        let file2 = [...this.file2Data()];

        if (this.removeCC() && this.removeCCRegExpString()) {
            file1 = this._removeCCFromData(file1);
            file2 = this._removeCCFromData(file2);
        }

        const newData = this.merger.mergeData(file1, file2);
        this.mergedData.set(newData);
    }

    private _removeCCFromData(data: FileData[]): FileData[] {
        return data
            .filter(v => {
                const match = v.content.match(this.removeCCRegExp());
                console.log(match, match?.[0], match?.[0].length, v.content.length, Boolean(!match || match[0].length == v.content.length));
                return !match || match[0].length != v.content.length;
            })
            .map(v => {
                v.content = v.content.replace(this.removeCCRegExp(), '');
                return v;
            });
    }

    log(...args: any[]) { console.log(...args); }

    //cc settings
    removeCC = signal(false);
    removeCCRegExpString = signal("\\s*\\([A-Z -]+\\)\\s*");
    removeCCRegExp = computed(() => new RegExp(this.removeCCRegExpString(), 'g'));

    getTimelinePeriodStyle(start: number, end: number): string {
        const startToScale = start / this.scale();
        const endToScale = end / this.scale();
        return `top:${startToScale}px;height:${endToScale - startToScale}px;`;
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
