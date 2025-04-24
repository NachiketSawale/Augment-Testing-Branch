
import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';

import {IQtoDetailCommentsEntity} from '../model/entities/qto-detail-comments-entity.interface';
import {QtoMainDetailCommentsDataService} from './qto-main-detail-comments-data.service';

@Injectable({
    providedIn: 'root'
})

export class qtoMainDetailCommentsBehavior implements IEntityContainerBehavior<IGridContainerLink<IQtoDetailCommentsEntity>, IQtoDetailCommentsEntity> {

    private dataService: QtoMainDetailCommentsDataService;
    
    public constructor() {
        this.dataService = inject(QtoMainDetailCommentsDataService);
    }

    public onCreate(containerLink: IGridContainerLink<IQtoDetailCommentsEntity>): void {

    }

}