import {inject} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';

export class PageHelper{
    protected readonly translateService = inject(PlatformTranslateService);

    public page = {
        number: 0,
        size: 10,
        totalLength: 0,
        currentLength: 0,
        count: 0
    };

    public getPageText(): string {
        const startIndex = this.page.number * this.page.size,
            endIndex = ((this.page.count - (this.page.number + 1) > 0 ? startIndex + this.page.size : this.page.totalLength));

        if (this.page.currentLength === 0) {
            return this.translateService.instant('cloud.common.noSearchResult').text;
        }

        return (startIndex + 1) + ' - ' + endIndex + ' / ' + this.page.totalLength;
    }

    public getFirstPage(): void{
        this.page.number = 0;
        this.getListPage();
    }

    public getLastPage(): void{
        this.page.number = this.page.count -1;
        this.getListPage();
    }

    public getPrevPage(): void{
        if(this.page.number <=0){
            return;
        }

        this.page.number--;
        this.getListPage();
    }

    public getNextPage() : void{
        if(this.page.count <= this.page.number){
            return;
        }
        this.page.number++;

        this.getListPage();
    }

    public canFirstOrPrevPage() : boolean{
        return this.page.number > 0;
    }

    public canLastOrNextPage(): boolean {
        return this.page.count > (this.page.number + 1);
    }

    public  getListPage(): void{}
}