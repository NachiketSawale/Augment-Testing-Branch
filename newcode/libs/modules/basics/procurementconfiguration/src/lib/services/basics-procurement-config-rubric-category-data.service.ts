/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalNode, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';
import { IRubricEntity } from '../model/entities/rubric-entity.interface';

/**
 * The data service of rubric category grid
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfigRubricCategoryDataService extends DataServiceHierarchicalNode<IRubricEntity, PrcConfigurationHeaderComplete, IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {

    public constructor(parentService: BasicsProcurementConfigurationHeaderDataService) {
        const options: IDataServiceOptions<IRubricEntity> = {
            apiUrl: 'basics/procurementconfiguration/rubriccategary',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'prcconfigurationtree',
                usePost: false,
                prepareParam: ident => {
                    const parent = this.getSelectedParent();

                    if (!parent) {
                        throw new Error('Parent entity in not selected');
                    }

                    return {configurationTypeId: parent.BasConfigurationTypeFk};
                }
            },
            roleInfo: <IDataServiceRoleOptions<IRubricEntity>>{
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

        if (entity.HasChildren && entity.RubricCategoryEntities) {
            return entity.RubricCategoryEntities.map(e => e.Id);
        }

        return [entity.Id];
    }

    public getRubricId() {
        const entities = this.getSelection();
        if (!entities.length) {
            return -1;
        }
        const entity = entities[0];
        if (entity.HasChildren && entity.RubricCategoryEntities) {
            return entity.RubricCategoryEntities[0].RubricFk;
        }
        return entity.RubricFk;
    }

    public override childrenOf(element: IRubricEntity): IRubricEntity[] {
        return element.RubricCategoryEntities ?? [];
    }

    public override parentOf(element: IRubricEntity): IRubricEntity | null {
        if (element.RubricFk == null) {
            return null;
        }

        const parentId = element.RubricFk;
        const parent = this.flatList().find(candidate => candidate.Id === parentId);
        return parent === undefined ? null : parent;
    }
}