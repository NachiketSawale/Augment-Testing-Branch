/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IResourceCatalogRecordEntity } from '@libs/resource/interfaces';
import { DragDropBase } from '@libs/platform/common';
import { IDragDropData } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentCatalogRecordsDragDropService extends DragDropBase<IResourceCatalogRecordEntity> {

	public constructor() {
		super('00d61b7a655d47448292f819b321d6a1');
	}

	public override canDrag(draggedDataInfo: IDragDropData<IResourceCatalogRecordEntity> | null): boolean {
		return true;
	}
}