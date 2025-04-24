/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import {
    ServiceRole,
    IDataServiceOptions,
    IDataServiceEndPointOptions,
    IDataServiceRoleOptions, DataServiceFlatLeaf
} from '@libs/platform/data-access';
import { QtoFormulaRubricCategoryGridDataService } from './qto-formula-rubric-category-grid-data.service';
import {IRubricCategoryEntity} from '../model/entities/rubric-category-entity.interface';
import {IQtoCommentEntity} from '../model/entities/qto-comment-entity.interface';
import { QtoFormulaRubricCategoryGridComplete } from '../model/qto-formula-rubric-category-grid-complete.class';


@Injectable({
    providedIn: 'root'
})

export class QtoFormulaCommentDataService extends DataServiceFlatLeaf<IQtoCommentEntity, IRubricCategoryEntity, QtoFormulaRubricCategoryGridComplete> {

    public constructor(parentDataService: QtoFormulaRubricCategoryGridDataService) {
        const options: IDataServiceOptions<IQtoCommentEntity> = {
            apiUrl: 'qto/formula/comment',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false
            },
            createInfo: {
                prepareParam: () => {
                    const parent = parentDataService.getSelection()[0];

                    const parentId = parent && parent.Id ? parent.Id : -1;

                    return {
                        mainItemId: parentId
                    };
                }
            },
            roleInfo: <IDataServiceRoleOptions<IQtoCommentEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'QtoComment',
                parent: parentDataService,
            }
        };

        super(options);
    }

    protected override onLoadSucceeded(loaded: object): IQtoCommentEntity[] {
        if (loaded) {
            return loaded as IQtoCommentEntity[];
        }
        return [];
    }

    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                mainItemId: parent.Id
            };
        } else {
            throw new Error('should be a selected parent.');
        }
    }
}












