/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';
import { IPrcTotalTypeEntity } from '../model/entities/prc-total-type-entity.interface';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';

export const BASICS_PROCUREMENT_CONFIGURATION_PRCTOTALTYPE_DATA_TOKEN = new InjectionToken<BasicsProcurementConfigurationPrcTotalTypeDataService>('basicsProcurementConfigurationPrcTotalTypeDataToken');

/**
 * ProcurementConfiguration PrcTotalType entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigurationPrcTotalTypeDataService extends DataServiceFlatLeaf<IPrcTotalTypeEntity, IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {
	public constructor(parentService: BasicsProcurementConfigurationHeaderDataService) {
		const options: IDataServiceOptions<IPrcTotalTypeEntity> = {
			apiUrl: 'basics/procurementconfiguration/prctotaltype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			createInfo: {
				prepareParam: () => {
					const selection = parentService.getSelection()[0];
					return { mainItemId: selection.Id };
				},
			},
			roleInfo: <IDataServiceRoleOptions<IPrcTotalTypeEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcTotalType',
				parent: parentService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IPrcConfigHeaderEntity, entity: IPrcTotalTypeEntity): boolean {
		return entity.PrcConfigHeaderFk === parentKey.Id;
	}
}
