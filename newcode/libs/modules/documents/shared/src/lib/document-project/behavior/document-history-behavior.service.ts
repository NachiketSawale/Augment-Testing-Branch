/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {DataServiceFlatLeaf} from '@libs/platform/data-access';
import {DocumentComplete} from '../../model/document-complete.class';
import {IDocumentProjectEntity} from '../../model/entities/document-project-entity.interface';

export class DocumentHistoryBehaviorService<IDocumentProjectHistoryEntity extends object> implements IEntityContainerBehavior<IGridContainerLink<IDocumentProjectHistoryEntity>, IDocumentProjectHistoryEntity>{
    private dataService: DataServiceFlatLeaf<IDocumentProjectHistoryEntity,IDocumentProjectEntity,DocumentComplete>;

    public constructor(documentDataService: DataServiceFlatLeaf<IDocumentProjectHistoryEntity,IDocumentProjectEntity,DocumentComplete>) {
        this.dataService = documentDataService;
    }

    public onCreate(containerLink: IGridContainerLink<IDocumentProjectHistoryEntity>): void {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }

}