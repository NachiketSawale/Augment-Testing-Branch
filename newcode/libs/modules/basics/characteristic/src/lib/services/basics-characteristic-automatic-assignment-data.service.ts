/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';

import { IBasicsCharacteristicAutomaticAssignmentEntity } from '../model/entities/basics-characteristic-automatic-assignment-entity.interface';
import { BasicsCharacteristicComplete } from '../model/basics-characteristic-complete.class';
import { BasicsCharacteristicCharacteristicDataService } from './basics-characteristic-characteristic-data.service';
import { ICharacteristicEntity } from '@libs/basics/interfaces';


@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicAutomaticAssignmentDataService
	extends DataServiceFlatLeaf<IBasicsCharacteristicAutomaticAssignmentEntity, ICharacteristicEntity, BasicsCharacteristicComplete> {
	public constructor(private parentService: BasicsCharacteristicCharacteristicDataService) {
		const options: IDataServiceOptions<IBasicsCharacteristicAutomaticAssignmentEntity> = {
			apiUrl: 'basics/characteristic/automaticassignment',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsCharacteristicAutomaticAssignmentEntity, ICharacteristicEntity, BasicsCharacteristicComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'AutomaticAssignment',
				parent: parentService,
			},
			entityActions: {createSupported: false, deleteSupported: false},
		};

		super(options);
	}


	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: BasicsCharacteristicComplete,
	                                                    modified: IBasicsCharacteristicAutomaticAssignmentEntity[],
	                                                    deleted: IBasicsCharacteristicAutomaticAssignmentEntity[]) {
		if (modified && modified.length > 0){
			parentUpdate.AutomaticAssignmentToSave = modified;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsCharacteristicComplete): IBasicsCharacteristicAutomaticAssignmentEntity[] {
		if (complete && complete.AutomaticAssignmentToSave) {
			return complete.AutomaticAssignmentToSave;
		}

		return [];
	}

	//todo: save checked modification. Currently the change of not mapped check box has not put into modified.
}
