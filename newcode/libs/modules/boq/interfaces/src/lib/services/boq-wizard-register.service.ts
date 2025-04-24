import { Injectable, Injector, ProviderToken } from '@angular/core';
import { Dictionary, FeatureKey, FeatureRegistry, IInitializationContext } from '@libs/platform/common';

export interface IBoqWizardService {
	execute(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>): Promise<void>;
	getUuid(): string;
}

@Injectable({providedIn: 'root'})
export class BoqWizardRegisterService {
	private wizardServiceMap = new Map<string, FeatureKey<IBoqWizardService>>; // Key: <modulename>.<uuid> (e.g. 'boq.main.244e3a9561b2210a4f55a10fb8a63b89')

	public getFeature(moduleName: string, uuid: string): FeatureKey<IBoqWizardService> {
		return this.wizardServiceMap.get(this.getFeatureKey(moduleName, uuid))!;
	}

	public registerFeature(injector: Injector, featureRegistry: FeatureRegistry, moduleName: string, wizardService: ProviderToken<IBoqWizardService>) {
		const uuid = injector.get(wizardService).getUuid();
		const featureKey = this.getFeatureKey(moduleName, uuid);
		if (!this.wizardServiceMap.has(featureKey)) {
			this.wizardServiceMap.set(featureKey, new FeatureKey<IBoqWizardService>(featureKey));
		}

		const feature = this.wizardServiceMap.get(featureKey)!;
		if (!featureRegistry.hasFeature(feature)) {
			featureRegistry.registerFeature(feature, () => {
				return injector.get(wizardService);
			});
		}
	}

	private getFeatureKey(moduleName: string, uuid: string): string {
		return moduleName + '.' + uuid;
	}
}

