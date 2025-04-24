/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcConfiguration2StrategyEntity } from '../model/entities/prc-configuration-2-strategy-entity.interface';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';

export const BASICS_PROCUREMENT_CONFIGURATION_2STRATEGY_DATA_TOKEN = new InjectionToken<BasicsProcurementConfiguration2StrategyDataService>('basicsProcurementConfiguration2StrategyDataToken');

/**
 * ProcurementConfiguration 2Strategy entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfiguration2StrategyDataService extends DataServiceFlatLeaf<IPrcConfiguration2StrategyEntity, IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {
	public constructor(parentService: BasicsProcurementConfigurationHeaderDataService) {
		const options: IDataServiceOptions<IPrcConfiguration2StrategyEntity> = {
			apiUrl: 'basics/procurementconfiguration/configuration2strategy',
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
			roleInfo: <IDataServiceRoleOptions<IPrcConfiguration2StrategyEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcConfiguration2Strategy',
				parent: parentService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IPrcConfigHeaderEntity, entity: IPrcConfiguration2StrategyEntity): boolean {
		return entity.PrcConfigHeaderFk === parentKey.Id;
	}
}
