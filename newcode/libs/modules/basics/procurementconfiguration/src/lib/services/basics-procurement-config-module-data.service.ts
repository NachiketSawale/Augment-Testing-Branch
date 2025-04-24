/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';
import { IModuleEntity } from '../model/entities/module-entity.interface';

/**
 * The data service of module grid
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigModuleDataService extends DataServiceFlatLeaf<IModuleEntity, IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {
	public constructor(parentService: BasicsProcurementConfigurationHeaderDataService) {
		const options: IDataServiceOptions<IModuleEntity> = {
			apiUrl: 'basics/procurementconfiguration/module',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					const parent = parentService.getSelection()[0];
					if (!parent) {
						throw new Error('Parent entity in not selected');
					}

					return { configurationTypeId: parent.BasConfigurationTypeFk };
				},
			},
			roleInfo: <IDataServiceRoleOptions<IModuleEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Module',
				parent: parentService,
			},
			entityActions: {
				deleteSupported: false,
				createSupported: false,
			},
		};

		super(options);
	}
}
