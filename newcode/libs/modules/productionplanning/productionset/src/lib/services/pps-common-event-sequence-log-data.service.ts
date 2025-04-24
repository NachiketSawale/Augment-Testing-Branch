/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IPpsLogReportVEntity, IProductionsetEntity } from '../model/models';
import { ProductionplanningProductionsetComplete } from '../model/productionplanning-productionset-complete.class';
import { ProductionplanningProductionsetDataService } from './productionplanning-productionset-data.service';


@Injectable({
	providedIn: 'root',
})
export class PpsCommonEventSequenceLogDataService extends DataServiceFlatLeaf<IPpsLogReportVEntity, IProductionsetEntity, ProductionplanningProductionsetComplete> {
	public constructor(productionSetDataService: ProductionplanningProductionsetDataService) {
		const options: IDataServiceOptions<IPpsLogReportVEntity> = {
			apiUrl: 'productionplanning/common/logreport',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'eventSequenceLogs',
				usePost: false,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsLogReportVEntity, IProductionsetEntity, ProductionplanningProductionsetComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EventLog',
				parent: productionSetDataService,
			},
		};

		super(options);
	}
// has to be implemented!
	// protected override provideLoadPayload() {
	// 	const parentSelection = this.getSelectedParent();
	// 	if (parentSelection) {
	// 		return {
	// 			foreignKey: 'ProductionSetFk',
	// 			mainItemId: parentSelection.Id
	// 		};
	// 	}
	// 	return {
	// 		Value: -1
	// 	};
	// }

	protected override onLoadSucceeded(loaded: IPpsEventLogResponse): IPpsLogReportVEntity[] {
		if (loaded) {
			return loaded.Main;
		}
		return [];
	}
}

interface IPpsEventLogResponse {
	Main: IPpsLogReportVEntity[];
}
