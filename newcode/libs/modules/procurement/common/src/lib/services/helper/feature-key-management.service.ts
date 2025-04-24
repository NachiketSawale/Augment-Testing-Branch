import {Injectable} from '@angular/core';
import {FeatureKey} from '@libs/platform/common';
import {ICommonWizard} from '../../model/interfaces/wizard/common-wizard.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonFeatureKeyManagement {
	private mappings = new Map<string, FeatureKey<ICommonWizard>>();

	public getOrAddFeatureKey(moduleName: string, wizardName: string ): FeatureKey<ICommonWizard> {
		const key = this.buildKey(moduleName, wizardName);
		let featureKey = this.mappings.get(key);
		if (!featureKey) {
			featureKey = new FeatureKey<ICommonWizard>(key);
			this.mappings.set(key, featureKey);
		}
		return featureKey;
	}

	public getFeatureKey(moduleName: string, wizardName: string) {
		const key = this.buildKey(moduleName, wizardName);
		return this.mappings.get(key);
	}

	private buildKey(moduleName: string, wizardName: string) {
		return moduleName + '.' + wizardName;
	}
}