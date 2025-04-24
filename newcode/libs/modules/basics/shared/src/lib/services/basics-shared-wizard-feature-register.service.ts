/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, Injector, ProviderToken } from '@angular/core';
import { FeatureKey, FeatureRegistry } from '@libs/platform/common';
import { IBasicsWizardService } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedWizardFeatureRegisterService<WizardServiceT extends IBasicsWizardService> {
	private items = new Map<string, FeatureKey<WizardServiceT>>;

	public registerFeature(injector: Injector, moduleName: string, featureRegistry: FeatureRegistry, dataService: ProviderToken<WizardServiceT>) {
		const featureKey = this.ensureFeature(moduleName);
		if (!featureRegistry.hasFeature(featureKey)) {
			featureRegistry.registerFeature(featureKey, () => {
				return injector.get(dataService);
			});
		}
	}

	public ensureFeature(moduleName: string): FeatureKey<WizardServiceT> {
		if (!this.items.has(moduleName)) {
			this.setFeature(moduleName);
		}
		return this.items.get(moduleName)!;
	}

	private setFeature(moduleName: string) {
		if (!this.items.has(moduleName)) {
			const featureKey = new FeatureKey<WizardServiceT>(moduleName);
			this.items.set(moduleName, featureKey);
		}
	}
}
