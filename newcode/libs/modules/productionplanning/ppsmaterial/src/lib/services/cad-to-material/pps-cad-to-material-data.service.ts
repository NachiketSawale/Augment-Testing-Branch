/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPpsCad2mdcMaterialEntity, PpsCad2mdcMaterialComplete } from '../../model/models';
// import { PpsMaterialToMdlProductTypeDataService } from '../material-to-producttype/pps-material-to-mdl-product-type-data.service';
// import { PpsMaterialRecordDataService } from '../material/material-record-data.service';

export const PPS_CAD_TO_MATERIAL_DATA_TOKEN = new InjectionToken<PpsCadToMaterialDataService>('ppsCadToMaterialDataToken');

@Injectable({
	providedIn: 'root'
})
export class PpsCadToMaterialDataService extends DataServiceFlatRoot<IPpsCad2mdcMaterialEntity, PpsCad2mdcMaterialComplete> {

	public constructor(
		// private _ppsMaterialRecordDataService: PpsMaterialRecordDataService,
		// private _ppsMaterialToMdlProductTypeDataService: PpsMaterialToMdlProductTypeDataService,
	) {
		const options: IDataServiceOptions<IPpsCad2mdcMaterialEntity> = {
			apiUrl: 'productionplanning/ppsmaterial/cad2material',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete' 
			},
			roleInfo: <IDataServiceRoleOptions<IPpsCad2mdcMaterialEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsCad2mdcMaterials',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IPpsCad2mdcMaterialEntity | null): PpsCad2mdcMaterialComplete {
		const complete = new PpsCad2mdcMaterialComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PpsCad2mdcMaterials = [modified];
		}

		return complete;
	}

}





