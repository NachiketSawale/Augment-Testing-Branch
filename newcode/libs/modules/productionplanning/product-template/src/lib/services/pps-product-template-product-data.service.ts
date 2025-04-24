
import { get, isNull } from 'lodash';
import { Injectable } from '@angular/core';

import { IPpsProductTemplateEntity } from '../model/models';
import {
	IPpsProductEntityGenerated,
	PpsSharedProductDataService,
	PpsProductCompleteEntity,
	PpsProductTemplateComplete,
} from '@libs/productionplanning/shared';
import { PpsProductTemplateDataService } from './pps-product-template-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsProductTemplateProductDataService extends PpsSharedProductDataService<IPpsProductEntityGenerated, PpsProductCompleteEntity, IPpsProductTemplateEntity, PpsProductTemplateComplete>{

	private static cacheMap: Map<string, PpsProductTemplateProductDataService> = new Map();

	public static getInstance(moduleName: string, parentService: PpsProductTemplateDataService) : PpsProductTemplateProductDataService{
		let instance = this.cacheMap.get(moduleName);
		if(!instance){
			instance = new PpsProductTemplateProductDataService(parentService);
			this.cacheMap.set(moduleName, instance);
		}
		return instance;
	}

	public constructor(parentService: PpsProductTemplateDataService){
		super(parentService,
			{
				apiUrl: '',
				itemName: '',
				filter: 'ProductDescriptionFk',
				PKey1: 'PpsStrandPatternFk'
			});
	}

	public override createUpdateEntity(modified: IPpsProductEntityGenerated | null): PpsProductCompleteEntity {
		const productComplete = new PpsProductCompleteEntity();
		if (modified !== null) {
			productComplete.MainItemId = modified.Id;
			productComplete.Products = [modified];
		}
		return productComplete;
	}

	public override registerNodeModificationsToParentUpdate(complete: PpsProductTemplateComplete, modified: PpsProductCompleteEntity[], deleted: IPpsProductEntityGenerated[]): void {
		if (modified && modified.some(() => true)) {
			complete.ProductToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.ProductToDelete = deleted;
		}
	}

	protected override onLoadSucceeded(loaded: object): IPpsProductEntityGenerated[] {
		if (loaded) {
			return get(loaded, 'Main')! as IPpsProductEntityGenerated[];
		}
		return [];
	}

	public override getSavedEntitiesFromUpdate(complete: PpsProductTemplateComplete): IPpsProductEntityGenerated[] {
		if (complete && !isNull(complete.ProductToSave)) {
			return complete.ProductToSave[0].Products ?? [];
		}
		return [];
	}

	public override isParentFn(parentKey: IPpsProductTemplateEntity, entity: IPpsProductEntityGenerated): boolean {
		return entity.ProductDescriptionFk === parentKey.Id;
	}

}
