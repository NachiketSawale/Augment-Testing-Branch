/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalNode, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsBillingSchemaDataService } from './basics-billing-schema-data.service';
import { BillingSchemaComplete, IBillingSchemaEntity, IRubricCategoryTreeItemEntity, RubricCategoryTreeComplete } from '@libs/basics/interfaces';

/**
 * The data service of billing schema rubric category grid
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsBillingSchemaRubricCategoryDataService extends DataServiceHierarchicalNode<IRubricCategoryTreeItemEntity, RubricCategoryTreeComplete, IBillingSchemaEntity, BillingSchemaComplete> {

    public constructor(parentService: BasicsBillingSchemaDataService) {
        const options: IDataServiceOptions<IRubricCategoryTreeItemEntity> = {
            apiUrl: 'basics/billingschema/rubriccategory',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'tree',
                usePost: false,
                prepareParam: ident => {
                    const parent = this.getSelectedParent();

                    if (!parent) {
                        throw new Error('Parent entity in not selected');
                    }

                    return {mainItemId: parent.Id};
                }
            },
            roleInfo: <IDataServiceRoleOptions<IRubricCategoryTreeItemEntity>>{
                role: ServiceRole.Node,
                itemName: 'RubricCategoryTreeItem',
                parent: parentService
            },
            entityActions: {
                deleteSupported: false,
                createSupported: false
            }
        };

        super(options);
    }

    /**
     * Get selected rubric category ids for procurement configuration entity grid
     */
    public getRubricCategoryIds() {
        const entities = this.getSelection();

        if (!entities.length) {
            return [];
        }

        const entity = entities[0];

        if (entity.HasChildren && entity.RubricCategories) {
            return entity.RubricCategories.map(e => e.Id);
        }

        return [entity.Id];
    }

    public getRubricId() {
        const entities = this.getSelection();
        if (!entities.length) {
            return -1;
        }
        const entity = entities[0];
        if (entity.HasChildren && entity.RubricCategories) {
            return entity.RubricCategories[0].ParentFk;
        }
        return entity.ParentFk;
    }

    public override childrenOf(element: IRubricCategoryTreeItemEntity): IRubricCategoryTreeItemEntity[] {
        return element.RubricCategories ?? [];
    }

    public override parentOf(element: IRubricCategoryTreeItemEntity): IRubricCategoryTreeItemEntity | null {
        if (element.ParentFk == null) {
            return null;
        }

        const parentId = element.ParentFk;
        const parent = this.flatList().find(candidate => candidate.Id === parentId);
        return parent === undefined ? null : parent;
    }
}