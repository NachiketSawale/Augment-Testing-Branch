/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IOenLvHeaderEntity } from '../../model/entities/oen-lv-header-entity.interface';
import { IOenServicePartEntity } from '../../model/entities/oen-service-part-entity.interface';
import { BoqMainOenLvheaderDataService } from './boq-main-oen-lvheader-data.service';

@Injectable({providedIn: 'root'})
export class BoqMainOenServicePartDataService extends DataServiceFlatLeaf<IOenServicePartEntity, IOenLvHeaderEntity, IOenLvHeaderEntity> { //TODO-BOQ-Replace with complete entity

	public constructor(private boqMainOenLvheaderDataService: BoqMainOenLvheaderDataService) {
		const options: IDataServiceOptions<IOenServicePartEntity> = {
			apiUrl: 'boq/main/oen/lvheader',
			roleInfo: <IDataServiceChildRoleOptions<IOenServicePartEntity,IOenLvHeaderEntity,IOenLvHeaderEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'OenServicePart',
				parent: boqMainOenLvheaderDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listservicepart',
				prepareParam: () => {
					const lvHeader = boqMainOenLvheaderDataService.getSelectedEntity();
					return { lvHeaderId: lvHeader?.Id };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createservicepart',
				usePost: true,
				prepareParam: () => {
					const lvHeader = boqMainOenLvheaderDataService.getSelectedEntity();
					return { Id : lvHeader?.Id };
				}
			}
		};

		super(options);
	}
}
