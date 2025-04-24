/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { EngCadImportConfigComplete } from '../model/cad-import-config-complete.class';
import { IEngCadValidationEntity, IEngCadImportConfigEntity } from '../model/models';
import { PpsEngineeringCadImportConfigDataService } from './cad-import-config-data.service';

@Injectable({
	providedIn: 'root'
})

export class PpsEngineeringCadValidationDataService extends DataServiceFlatLeaf<IEngCadValidationEntity, IEngCadImportConfigEntity, EngCadImportConfigComplete> {

	public constructor(parentService: PpsEngineeringCadImportConfigDataService) {
		const options: IDataServiceOptions<IEngCadValidationEntity> = {
			apiUrl: 'productionplanning/engineering/cadvalidation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getby',
				usePost: true
			},
			// deleteInfo: <IDataServiceEndPointOptions>{
			// 	endPoint: '//TODO: Add deleteInfo endpoint here'
			// },
			roleInfo: <IDataServiceChildRoleOptions<IEngCadValidationEntity, IEngCadImportConfigEntity, EngCadImportConfigComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PpsEngineeringCadValidations',
				parent: parentService,
			},


		};

		super(options);
	}

}



