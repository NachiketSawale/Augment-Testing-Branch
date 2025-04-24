/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, Injector, ProviderToken } from '@angular/core';
import { FeatureKey, FeatureRegistry } from '@libs/platform/common';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService {
	private items = new Map<string, FeatureKey<IBasicChangeProjectDocumentRubricCategoryService>>;

	public setFeature(moduleName: string) {
		if (!this.items.has(moduleName)) {
			const featureKey = new FeatureKey<IBasicChangeProjectDocumentRubricCategoryService>(moduleName);
			this.items.set(moduleName, featureKey);
		}
	}

	public getFeature(moduleName: string): FeatureKey<IBasicChangeProjectDocumentRubricCategoryService> {
		if (this.items.has(moduleName)) {
			return this.items.get(moduleName)!;
		} else {
			this.setFeature(moduleName);
			return this.items.get(moduleName)!;
		}
	}

	public registerFeature(injector: Injector, moduleName: string, featureRegistry: FeatureRegistry, dataService: ProviderToken<IBasicChangeProjectDocumentRubricCategoryService>) {
		const featureKey = this.getFeature(moduleName);
		if (!featureRegistry.hasFeature(featureKey)) {
			featureRegistry.registerFeature(featureKey, () => {
				return injector.get(dataService);
			});
		}
	}
}
