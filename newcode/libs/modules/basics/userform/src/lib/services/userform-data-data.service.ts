/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { BasicsUserformMainDataService } from './userform-main-data.service';
import { IFormEntity } from '../model/entities/form-entity.interface';
import { IFormDataEntity } from '../model/entities/form-data-entity.interface';
import { FormDataComplete } from '../model/entities/form-data-complete.class';

/*
 * Represents the data service to handle user form field.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsUserformDataDataService extends DataServiceFlatLeaf<IFormDataEntity, IFormEntity, FormDataComplete> {

	public constructor(basicsUserformMainDataService: BasicsUserformMainDataService) {
		const options: IDataServiceOptions<IFormDataEntity> = {
			apiUrl: 'basics/userform/data',
			readInfo: {
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1 ?? -1
					};
				}
			},
			deleteInfo: {
				endPoint: 'delete'
			},
			updateInfo: {
				endPoint: 'save'
			},
			createInfo: {
				endPoint: 'create'
			},
			roleInfo: <IDataServiceChildRoleOptions<IFormDataEntity, IFormEntity, FormDataComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'FormData',
				parent: basicsUserformMainDataService
			}
		};
		super(options);
	}

	protected override onLoadSucceeded(loaded: IFormDataEntity[]): IFormDataEntity[] {
		return loaded;
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}

		return {
			mainItemId: -1
		};
	}
}
