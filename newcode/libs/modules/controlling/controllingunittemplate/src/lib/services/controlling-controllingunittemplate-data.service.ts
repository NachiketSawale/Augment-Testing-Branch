/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ControllingControllingunittemplateComplete } from '../model/controlling-controllingunittemplate-complete.class';
import { IControltemplateEntity } from '../model/entities/controltemplate-entity.interface';


export const CONTROLLING_CONTROLLINGUNITTEMPLATE_DATA_TOKEN = new InjectionToken<ControllingControllingunittemplateDataService>('controllingControllingunittemplateDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingControllingunittemplateDataService extends DataServiceFlatRoot<IControltemplateEntity, ControllingControllingunittemplateComplete> {

	public constructor() {
		const options: IDataServiceOptions<IControltemplateEntity> = {
			apiUrl: 'controlling/controllingunittemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},

			// createInfo:{
			// 	prepareParam: ident => {
			// 		const selection = this.getSelection()[0];
			// 		return { id: 0, pKey1 : selection.Id};
			// 	}
			// },
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IControltemplateEntity>>{
				role: ServiceRole.Root,
				itemName: 'ControllingUnitTemplates',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IControltemplateEntity | null): ControllingControllingunittemplateComplete {
		const complete = new ControllingControllingunittemplateComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ControllingUnitTemplates = [modified];
		}
		return complete;
	}
	public override getModificationsFromUpdate(complete: ControllingControllingunittemplateComplete): IControltemplateEntity[] {
		if (complete.ControllingUnitTemplates === null) {
			complete.ControllingUnitTemplates = [];
		}
		return complete.ControllingUnitTemplates;
	}
}