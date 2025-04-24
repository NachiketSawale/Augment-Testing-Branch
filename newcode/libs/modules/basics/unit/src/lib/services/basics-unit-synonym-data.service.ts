/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceChildRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';

import { BasicsUnitSynonymEntity } from '../model/basics-unit-synonym-entity.class';
import { IIdentificationData } from "@libs/platform/common";
import { BasicsUnitEntity } from "../model/basics-unit-entity.class";
import { BasicsUnitComplete } from "../model/basics-unit-complete.class";
import { BasicsUnitDataService } from "./basics-unit-data.service";

@Injectable({
	providedIn: 'root',
})
export class BasicsUnitSynonymDataService extends DataServiceFlatLeaf<BasicsUnitSynonymEntity, BasicsUnitEntity,BasicsUnitComplete> {
	public constructor(basicsUnitDataService:BasicsUnitDataService) {
		const options: IDataServiceOptions<BasicsUnitSynonymEntity> = {
			apiUrl: 'basics/unit/synonym',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsUnitSynonymEntity,BasicsUnitEntity,BasicsUnitComplete>>{
				role: ServiceRole.Leaf,
				parent: basicsUnitDataService,
				itemName: 'Synonym',
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: BasicsUnitEntity, entity: BasicsUnitSynonymEntity): boolean {
		return entity.UnitFk === parentKey.Id;
	}
}
