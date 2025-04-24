/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { ICommonBusinessPartnerWizard } from '@libs/businesspartner/interfaces';
import {FeatureKey} from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerCommonFeatureKeyManagement {
	private mappings = new Map<string, FeatureKey<ICommonBusinessPartnerWizard>>();

	public getOrAddFeatureKey(moduleName: string, wizardName: string ): FeatureKey<ICommonBusinessPartnerWizard> {
		const key = this.buildKey(moduleName, wizardName);
		let featureKey = this.mappings.get(key);
		if (!featureKey) {
			featureKey = new FeatureKey<ICommonBusinessPartnerWizard>(key);
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