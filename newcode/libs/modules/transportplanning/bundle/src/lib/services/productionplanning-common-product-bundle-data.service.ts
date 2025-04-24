/*
 * Copyright(c) RIB Software GmbH
 */
import { get, isNull } from 'lodash';
import { Injectable, InjectionToken } from '@angular/core';
import { IBundleEntity } from '../model/entities/bundle-entity.interface';
import { TransportplanningBundleGridComplete } from '../model/transportplanning-bundle-grid-complete.class';
import { TransportplanningBundleGridDataService } from './transportplanning-bundle-grid-data.service';
import { IPpsEventParentService, IPpsProductEntityGenerated, PpsProductCompleteEntity, PpsSharedProductDataService } from '@libs/productionplanning/shared';

export const PRODUCTIONPLANNING_COMMON_PRODUCT_BUNDLE_DATA_TOKEN = new InjectionToken<ProductionplanningCommonProductBundleDataService>('productionplanningCommonProductBundleDataToken');

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningCommonProductBundleDataService extends PpsSharedProductDataService<IPpsProductEntityGenerated, PpsProductCompleteEntity, IBundleEntity, TransportplanningBundleGridComplete> implements IPpsEventParentService {
	private static cacheMap: Map<string, ProductionplanningCommonProductBundleDataService> = new Map();

	public static getInstance(moduleName: string, parentService: TransportplanningBundleGridDataService): ProductionplanningCommonProductBundleDataService {
		let instance = this.cacheMap.get(moduleName);
		if (!instance) {
			instance = new ProductionplanningCommonProductBundleDataService(parentService);
			this.cacheMap.set(moduleName, instance);
		}
		return instance;
	}

	public constructor(parentService: TransportplanningBundleGridDataService) {
		super(parentService, {
			apiUrl: '',
			itemName: '',
			filter: 'TrsProductBundleFk',
			PKey1: 'TrsBundleTypeFk',
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

	public override registerNodeModificationsToParentUpdate(complete: TransportplanningBundleGridComplete, modified: PpsProductCompleteEntity[], deleted: IPpsProductEntityGenerated[]): void {
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

	public override getSavedEntitiesFromUpdate(complete: TransportplanningBundleGridComplete): IPpsProductEntityGenerated[] {
		if (complete && !isNull(complete.ProductToSave)) {
			return complete.ProductToSave[0].Products ?? [];
		}
		return [];
	}

	public override isParentFn(parentKey: IBundleEntity, entity: IPpsProductEntityGenerated): boolean {
		return entity.TrsProductBundleFk === parentKey.Id;
	}

	public readonly ForeignKeyForEvent: string = 'ProductFk';
}
