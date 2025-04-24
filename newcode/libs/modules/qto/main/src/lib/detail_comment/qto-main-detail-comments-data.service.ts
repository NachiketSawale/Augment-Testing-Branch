import {
    DataServiceHierarchicalLeaf,
    IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';

import {IQtoDetailCommentsEntity} from '../model/entities/qto-detail-comments-entity.interface';
import {IQtoMainDetailGridEntity} from '../model/qto-main-detail-grid-entity.class';
import {QtoMainDetailGridComplete} from '../model/qto-main-detail-grid-complete.class';
import {QtoMainDetailGridDataService} from '../services/qto-main-detail-grid-data.service';
import {Injectable} from '@angular/core';
import {qtoMainDetailCommentsValidationService} from './qto-main-detail-comments-validation.service';

@Injectable({
    providedIn: 'root'
})
export class QtoMainDetailCommentsDataService extends DataServiceHierarchicalLeaf<IQtoDetailCommentsEntity, IQtoMainDetailGridEntity, QtoMainDetailGridComplete> {
    private parentService: QtoMainDetailGridDataService;
    public readonly dataValidationService:qtoMainDetailCommentsValidationService;

    public constructor(QtoMainDetailGridDataService: QtoMainDetailGridDataService) {
        const options: IDataServiceOptions<IQtoDetailCommentsEntity> = {
            apiUrl: 'qto/detail/comments',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listByParent',
                usePost: true
            },
            roleInfo: <IDataServiceRoleOptions<IQtoDetailCommentsEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'QtoDetailComments',
                parent: QtoMainDetailGridDataService
            }
        };

        super(options);

        this.parentService = QtoMainDetailGridDataService;
        this.dataValidationService = this.createDataValidationService();
    }

    protected override provideLoadPayload(): object {
        const qtodetail = this.parentService.getSelectedEntity();
        return {
            'PKey1': qtodetail ? qtodetail.Id : -1,
            'filter': ''
        };
    }

    protected override onLoadSucceeded(loaded: object): IQtoDetailCommentsEntity[] {
        const entities = loaded as unknown as IQtoDetailCommentsEntity[];
        return entities;
    }

    protected createDataValidationService() {
        return new qtoMainDetailCommentsValidationService(this);
    }

    protected override checkDeleteIsAllowed(entities: IQtoDetailCommentsEntity[] | IQtoDetailCommentsEntity | null): boolean {
        return !this.getSelectedEntity()?.IsDelete;
    }
}