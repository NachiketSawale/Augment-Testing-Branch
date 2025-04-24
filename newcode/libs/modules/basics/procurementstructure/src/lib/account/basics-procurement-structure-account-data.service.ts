/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { BasicsProcurementStructureDataService } from '../procurement-structure/basics-procurement-structure-data.service';

import { IPrcStructureAccountEntity } from '../model/entities/prc-structure-account-entity.interface';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
import { MainDataDto } from '@libs/basics/shared';


/**
 * Procurement structure account entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureAccountDataService extends DataServiceFlatLeaf<IPrcStructureAccountEntity, IPrcStructureEntity, PrcStructureComplete> {

	public constructor(parentService: BasicsProcurementStructureDataService) {
		const options: IDataServiceOptions<IPrcStructureAccountEntity> = {
			apiUrl: 'basics/procurementstructure/account',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcStructureAccountEntity, IPrcStructureEntity, PrcStructureComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcStructureaccount',
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
			throw new Error('There should be a selected parent catalog to load the account data');
		}
	}


	protected override onLoadSucceeded(loaded: object): IPrcStructureAccountEntity[] {
		const dto = new MainDataDto<IPrcStructureAccountEntity>(loaded);
		return dto.Main;
	}

	public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcStructureAccountEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
