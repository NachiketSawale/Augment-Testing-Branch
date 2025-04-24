/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ControllingConfigurationColumnDefinitionComplete } from '../model/controlling-configuration-column-definition-complete.class';
import {IMdcContrColumnPropDefEntity} from '../model/entities/mdc-contr-column-prop-def-entity.interface';


export const CONTROLLING_CONFIGURATION_COLUMN_DEFINITION_DATA_TOKEN = new InjectionToken<ControllingConfigurationColumnDefinitionDataService>('controllingConfigurationColumnDefinitionDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingConfigurationColumnDefinitionDataService extends DataServiceFlatRoot<IMdcContrColumnPropDefEntity, ControllingConfigurationColumnDefinitionComplete> {

	public constructor() {
		const options: IDataServiceOptions<IMdcContrColumnPropDefEntity> = {
			apiUrl: 'Controlling/Configuration/ContrColumnPropDefController',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getColumnDefinitionList',
				usePost: true
			},
			// deleteInfo: <IDataServiceEndPointOptions>{
			// 	endPoint: 'delete'
			// },
			// updateInfo: <IDataServiceEndPointOptions>{
			// 	endPoint: 'update'
			// },
			roleInfo: <IDataServiceRoleOptions<IMdcContrColumnPropDefEntity>>{
				role: ServiceRole.Root,
				itemName: 'ContrColumnPropDefToSave',
			},
			entityActions:{
				createSupported: false,
				deleteSupported: false
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IMdcContrColumnPropDefEntity | null): ControllingConfigurationColumnDefinitionComplete {
		const complete = new ControllingConfigurationColumnDefinitionComplete();
		if (modified !== null) {
			// target container is readonly, do not need this
			// complete.Id = modified.Id;
			// complete.Datas = [modified];
		}

		return complete;
	}

}





		
			





