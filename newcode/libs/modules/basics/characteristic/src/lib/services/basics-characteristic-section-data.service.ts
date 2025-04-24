/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';

import { BasicsCharacteristicGroupComplete } from '../model/basics-characteristic-group-complete.class';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicGroupDataService } from './basics-characteristic-group-data.service';
import { ICharacteristicSectionEntity } from '../model/entities/characteristic-section-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicSectionDataService extends DataServiceFlatLeaf<ICharacteristicSectionEntity, ICharacteristicGroupEntity, BasicsCharacteristicGroupComplete> {
	public constructor() {
		const options: IDataServiceOptions<ICharacteristicSectionEntity> = {
			apiUrl: 'basics/characteristic/section',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'newlist',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICharacteristicSectionEntity, ICharacteristicGroupEntity, BasicsCharacteristicGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Section',
				parent: inject(BasicsCharacteristicGroupDataService),
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: BasicsCharacteristicGroupComplete, modified: ICharacteristicSectionEntity[], deleted: ICharacteristicSectionEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.SectionToSave = modified;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsCharacteristicGroupComplete): ICharacteristicSectionEntity[] {
		if (complete && complete.SectionToSave) {
			return complete.SectionToSave;
		}

		return [];
	}

	/// seems section and characteristic do not have strong relation
	public override isParentFn(parentKey: ICharacteristicGroupEntity, entity: ICharacteristicSectionEntity): boolean {
		return true;
	}

	/**
	 * handle different endpoint
	 * @protected
	 */
	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (!parentSelection) {
			throw new Error('There should be a selected parent Characteristic record to load the section');
		}
		const params: sectionRequestParam = {};
		if (parentSelection.Version !== 0) {
			params.MainItemId = parentSelection.Id;
		} else if (parentSelection.CharacteristicGroupFk) {
			params.CharacteristicGroupFk = parentSelection.CharacteristicGroupFk;
		}
		return params;
	}

	protected override onLoadSucceeded(loaded: ICharacteristicSectionEntity[]): ICharacteristicSectionEntity[] {
		return loaded;
	}

	//todo: save checked modification. Currently the change of not mapped check box has not put into modified.
}

interface sectionRequestParam {
	MainItemId?: number | null;
	CharacteristicGroupFk?: number | null;
}
