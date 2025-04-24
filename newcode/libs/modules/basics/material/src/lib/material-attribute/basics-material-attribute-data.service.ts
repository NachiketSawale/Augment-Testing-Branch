/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { MaterialComplete } from '../model/complete-class/material-complete.class';
import { IMaterialCharacteristicEntity } from '@libs/basics/shared';

/**
 * Material Attribute data service
 */

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialAttributeDataService extends DataServiceFlatLeaf<IMaterialCharacteristicEntity, IMaterialEntity, MaterialComplete> {
	public constructor(private basicsMaterialRecordDataService: BasicsMaterialRecordDataService) {
		const options: IDataServiceOptions<IMaterialCharacteristicEntity> = {
			apiUrl: 'basics/material/characteristic',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			createInfo: {
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1! };
				},
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<IMaterialCharacteristicEntity, IMaterialEntity, MaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialCharacteristic',
				parent: basicsMaterialRecordDataService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IMaterialCharacteristicEntity): boolean {
		return entity.MaterialFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id,
			};
		} else {
			throw new Error('There should be a selected parent Material record to load the data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMaterialCharacteristicEntity[] {
		return loaded as IMaterialCharacteristicEntity[];
	}
}
