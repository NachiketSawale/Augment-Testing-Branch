/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentPlantEurolistDataGeneratedService } from './generated/resource-equipment-plant-eurolist-data-generated.service';
import { Injectable } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { IResourceCatalogRecordEntity, IResourceEquipmentPlantEurolistEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantEurolistDataService extends ResourceEquipmentPlantEurolistDataGeneratedService {
	private creationDataExtension: IEntityIdentification | null = null;
	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			if (this.creationDataExtension?.PKey2 && this.creationDataExtension?.PKey3) {
				return {
					PKey1: parentSelection.Id,
					PKey2: this.creationDataExtension.PKey2,
					PKey3: this.creationDataExtension.PKey3,
				};
			} else {
				return {
					PKey1: parentSelection.Id
				};
			}
		}
		throw new Error('Please select a plant first');
	}

	protected override onCreateSucceeded(created:  IResourceEquipmentPlantEurolistEntity):  IResourceEquipmentPlantEurolistEntity {
		return created;
	}

	public createByCatalogRecord(catalogRecord: IResourceCatalogRecordEntity): void {
		this.creationDataExtension = {
			PKey2: catalogRecord.CatalogFk,
			PKey3: catalogRecord.Id
		} as IEntityIdentification;

		this.create().then(() => {
			this.creationDataExtension = null;
		});
	}
}