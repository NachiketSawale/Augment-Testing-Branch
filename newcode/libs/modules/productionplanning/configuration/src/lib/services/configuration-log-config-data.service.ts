/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPpsLogConfigEntity } from '../model/entities/pps-log-config-entity.interface';
import { PpsLogConfigComplete } from '../model/pps-log-config-complete.class';

@Injectable({
	providedIn: 'root'
})

export class ConfigurationLogConfigDataService extends DataServiceFlatRoot<IPpsLogConfigEntity, PpsLogConfigComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsLogConfigEntity> = {
			apiUrl: 'productionplanning/configuration/logconfig',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPpsLogConfigEntity>>{
				role: ServiceRole.Root,
				itemName: 'LogConfig',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsLogConfigEntity | null): PpsLogConfigComplete {
		const complete = new PpsLogConfigComplete();
		if (modified !== null) {
			complete.LogConfig = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsLogConfigComplete): IPpsLogConfigEntity[] {
		if (complete.LogConfig) {
			return [complete.LogConfig];
		}
		return [];
	}
}












