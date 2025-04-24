/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IPpsMaterial2MdlProductTypeEntity, PpsMaterial2MdlProductTypeComplete } from '../../model/models';
import { get } from 'lodash';

export const PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_DATA_TOKEN = new InjectionToken<PpsMaterialToMdlProductTypeDataService>('ppsMaterialToMdlProductTypeDataToken');

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialToMdlProductTypeDataService extends DataServiceFlatRoot<IPpsMaterial2MdlProductTypeEntity, PpsMaterial2MdlProductTypeComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsMaterial2MdlProductTypeEntity> = {
			apiUrl: 'productionplanning/ppsmaterial/ppsmaterial2mdlproducttype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPpsMaterial2MdlProductTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsMaterial2MdlProductTypes',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IPpsMaterial2MdlProductTypeEntity | null): PpsMaterial2MdlProductTypeComplete {
		const complete = new PpsMaterial2MdlProductTypeComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PpsMaterial2MdlProductTypes = [modified];
		}

		return complete;
	}

	protected override onLoadSucceeded(loaded: object): IPpsMaterial2MdlProductTypeEntity[] {
		if (loaded) {
			return get(loaded, 'dtos', []);
		}
		return [];
	}

}












