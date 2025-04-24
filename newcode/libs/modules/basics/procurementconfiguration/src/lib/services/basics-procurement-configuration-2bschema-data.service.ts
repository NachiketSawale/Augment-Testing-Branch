/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcConfiguration2BSchemaEntity } from '../model/entities/prc-configuration-2-bschema-entity.interface';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';

export const BASICS_PROCUREMENT_CONFIGURATION_2BSCHEMA_DATA_TOKEN = new InjectionToken<BasicsProcurementConfiguration2BSchemaDataService>('basicsProcurementConfiguration2BSchemaDataToken');

/**
 * ProcurementConfiguration 2BSchema entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfiguration2BSchemaDataService extends DataServiceFlatLeaf<IPrcConfiguration2BSchemaEntity, IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {
	public constructor(parentService: BasicsProcurementConfigurationHeaderDataService) {
		const options: IDataServiceOptions<IPrcConfiguration2BSchemaEntity> = {
			apiUrl: 'basics/procurementconfiguration/configuration2bschema',
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
			roleInfo: <IDataServiceRoleOptions<IPrcConfiguration2BSchemaEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcConfiguration2BSchema',
				parent: parentService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IPrcConfigHeaderEntity, entity: IPrcConfiguration2BSchemaEntity): boolean {
		return entity.PrcConfigHeaderFk === parentKey.Id;
	}
}
