

/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { isNull } from 'lodash';

import {
	IEngDrawingComponentEntityGenerated,
	IPpsProductTemplateEntityGenerated,
	PpsProductTemplateComplete,
	PpsSharedDrawingComponentDataService
} from '@libs/productionplanning/shared';

import { DrawingProductTemplateDataService } from './drawing-product-template-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsProductTemplateDrawingComponentDataService extends PpsSharedDrawingComponentDataService<IEngDrawingComponentEntityGenerated, IPpsProductTemplateEntityGenerated, PpsProductTemplateComplete>{

	private static cacheMap: Map<string, PpsProductTemplateDrawingComponentDataService> = new Map();

	public static getInstance(uuid: string, parentService: DrawingProductTemplateDataService): PpsProductTemplateDrawingComponentDataService{
		let instance = this.cacheMap.get(uuid);
		if(!instance){
			instance = new PpsProductTemplateDrawingComponentDataService(parentService);
			this.cacheMap.set(uuid, instance);
		}
		return instance;
	}

	public constructor(parentService: DrawingProductTemplateDataService) {
		super(
			{
				parentService: parentService,
				endPoint: 'getbyproductdesc',
				useLocalResource: false,
				productTemplateKey: 'Id',
				drawingKey: ''
			});
	}


	public override registerModificationsToParentUpdate(complete: PpsProductTemplateComplete, modified: IEngDrawingComponentEntityGenerated[], deleted: IEngDrawingComponentEntityGenerated[]): void {
		if (modified && modified.some(() => true)) {
			complete.DrawingComponentsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.DrawingComponentsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PpsProductTemplateComplete): IEngDrawingComponentEntityGenerated[] {
		if (complete && !isNull(complete.DrawingComponentsToSave)) {
			return complete.DrawingComponentsToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: IPpsProductTemplateEntityGenerated, entity: IEngDrawingComponentEntityGenerated): boolean {
		return entity.PpsProductdescriptionFk === parentKey.Id;
	}

}








