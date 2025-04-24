/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions,} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { BasicsProcurementStructureDataService } from '../procurement-structure/basics-procurement-structure-data.service';

import { IPrcStructure2clerkEntity } from '../model/entities/prc-structure-2-clerk-entity.interface';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
/**
 * Procurement structure clerk entity data service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureClerkDataService extends DataServiceFlatLeaf<IPrcStructure2clerkEntity,IPrcStructureEntity,PrcStructureComplete> {

    public constructor(parentService: BasicsProcurementStructureDataService) {
        const options: IDataServiceOptions<IPrcStructure2clerkEntity> = {
            apiUrl: 'basics/procurementstructure/clerk',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list'
            },
            roleInfo: <IDataServiceChildRoleOptions<IPrcStructure2clerkEntity, IPrcStructureEntity, PrcStructureComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcStructure2clerk',
                parent: parentService
            }
        };
        super(options);
    }

    protected override provideLoadPayload(): object {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                mainItemId: parentSelection.Id
            };
        } else {
            throw new Error('There should be a selected parent catalog to load the role data');
        }
    }

    protected override onLoadSucceeded(loaded: object): IPrcStructure2clerkEntity[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }

    public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcStructure2clerkEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
