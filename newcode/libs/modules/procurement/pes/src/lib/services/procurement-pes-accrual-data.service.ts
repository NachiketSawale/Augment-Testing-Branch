/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IPesHeaderEntity, } from '../model/entities';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';
import { IPesAccrualEntity } from '../model/entities/pes-accrual-entity.interface';
import { MainDataDto } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})

/**
 * Procurement Pes accural data service
 */
export class ProcurementPesAccrualDataService extends DataServiceFlatLeaf<IPesAccrualEntity, IPesHeaderEntity, PesCompleteNew> {

	public constructor(parentDataService: ProcurementPesHeaderDataService) {
		const options: IDataServiceOptions<IPesAccrualEntity> = {
			apiUrl: 'procurement/pes/accrual',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},

			roleInfo: <IDataServiceChildRoleOptions<IPesAccrualEntity, IPesHeaderEntity, PesCompleteNew>>{
				role: ServiceRole.Leaf,
				itemName: 'PesAccrual',
				parent: parentDataService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const selection = this.getSelectedParent();
		if (selection) {
			return { mainItemId: selection.Id };
		}
		return { mainItemId: 0 };
	}

	protected override onLoadSucceeded(loaded: object): IPesAccrualEntity[] {
		if (loaded) {
			const dto = new MainDataDto<IPesAccrualEntity>(loaded);
			return dto.Main;
		}
		return [];
	}
}





