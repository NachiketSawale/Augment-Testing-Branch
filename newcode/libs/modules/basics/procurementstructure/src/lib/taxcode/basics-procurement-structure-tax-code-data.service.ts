/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { get } from 'lodash';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import {  PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';


import {BasicsProcurementStructureDataService} from '../procurement-structure/basics-procurement-structure-data.service';
import { IPrcStructureEntity, IPrcStructureTaxEntity } from '@libs/basics/interfaces';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';

/**
 * Procurement structure tax code data service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureTaxCodeDataService extends DataServiceFlatLeaf<IPrcStructureTaxEntity,IPrcStructureEntity,PrcStructureComplete> {

    private http = inject(HttpClient);
    private config = inject(PlatformConfigurationService);

    public constructor(parentService: BasicsProcurementStructureDataService) {
        const options: IDataServiceOptions<IPrcStructureTaxEntity> = {
            apiUrl: 'basics/procurementstructure/taxcode',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list'
            },
            roleInfo: <IDataServiceChildRoleOptions<IPrcStructureTaxEntity, IPrcStructureEntity, PrcStructureComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcStructureTax',
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
            throw new Error('There should be a selected parent catalog to load the tax code data');
        }
    }

    protected override onLoadSucceeded(loaded: object): IPrcStructureTaxEntity[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }

    public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcStructureTaxEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
