/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions,} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import {BasicsProcurementStructureDataService} from '../procurement-structure/basics-procurement-structure-data.service';
import {BasicsProcurementStructureInterCompanyHeaderDataService} from './basics-procurement-structure-intercompany-header-data.service';

import { IInterCompanyStructureEntity } from '../model/entities/inter-company-structure-entity.interface';
import { IMdcContextEntity } from '../model/entities/mdc-context-entity.interface';
import { MdcContextComplete } from '../model/complete-class/mdc-context-complete.class';

/**
 * Procurement structure inter company entity data service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureInterCompanyDataService extends DataServiceFlatLeaf<IInterCompanyStructureEntity,IMdcContextEntity, MdcContextComplete> {

    public constructor(private headerService: BasicsProcurementStructureDataService, private interCompanyHeaderService: BasicsProcurementStructureInterCompanyHeaderDataService) {
        const options: IDataServiceOptions<IInterCompanyStructureEntity> = {
            apiUrl: 'basics/procurementstructure/intercompany',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listInterCompany',
                usePost: true
            },
            roleInfo: <IDataServiceChildRoleOptions<IInterCompanyStructureEntity, IMdcContextEntity, MdcContextComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'InterCompanyStructure',
                parent: interCompanyHeaderService
            }
        };
        super(options);
    }

    protected override provideLoadPayload(): object {
        const headerSelection = this.headerService.getSelection();
        const interCompanyHeaderSelection = this.interCompanyHeaderService.getSelection();
        if (headerSelection.length > 0 && interCompanyHeaderSelection.length > 0) {
            const headerEntity = headerSelection[0];
            const interCompanyHeaderEntity = interCompanyHeaderSelection[0];
            return {SuperEntityId: interCompanyHeaderEntity.Id, EntityId: headerEntity.Id};
        } else {
            throw new Error('There should be a selected parent catalog to load the inter company data');
        }
    }


    protected override onLoadSucceeded(loaded: object): IInterCompanyStructureEntity[] {
        const entities = loaded as IInterCompanyStructureEntity[];
        return entities;
    }

    public override isParentFn(parentKey: IMdcContextEntity, entity: IInterCompanyStructureEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
