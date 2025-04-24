/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IEngCadImportConfigEntity } from '../model/entities/cad-import-config-entity.interface';
import { EngCadImportConfigComplete } from '../model/cad-import-config-complete.class';

@Injectable({
	providedIn: 'root'
})

export class PpsEngineeringCadImportConfigDataService extends DataServiceFlatRoot<IEngCadImportConfigEntity, EngCadImportConfigComplete> {

	public constructor() {
		const options: IDataServiceOptions<IEngCadImportConfigEntity> = {
			apiUrl: 'productionplanning/engineering/cadimportconf',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multideletex'
			},
			roleInfo: <IDataServiceRoleOptions<IEngCadImportConfigEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsEngineeringCadImports',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IEngCadImportConfigEntity | null): EngCadImportConfigComplete {
		const complete = new EngCadImportConfigComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PpsEngineeringCadImports = [modified];
		}

		return complete;
	}

}












