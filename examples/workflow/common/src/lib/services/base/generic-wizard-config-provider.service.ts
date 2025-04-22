/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformHttpService, RequestType } from '@libs/platform/common';
import { ConfigProvider } from '../../models/types/generic-wizard-config-provider.type';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { get } from 'lodash';
import { inject, Injectable, Injector } from '@angular/core';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { IWorkflowActionTask } from '@libs/workflow/interfaces';
import { IGenericWizardInstanceEntity } from '@libs/basics/config';

/**
 * Loads config providers for the generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardConfigProviderService {

	private readonly httpService = inject(PlatformHttpService);
	private readonly injector = inject(Injector);


	/**
	 * Loads config providers for the wizard.
	 * @param wizardConfig
	 * @returns
	 */
	public async loadConfigProviders(wizardConfig: GenericWizardBaseConfig, useCaseConfig: GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>): Promise<GenericWizardBaseConfig> {

		//Sorting config providers based on call order,
		//config providers without a call order are called first based on the order they are defined in the array.
		const configProviders = useCaseConfig.ConfigProviders.sort((a, b) => {
			if (a.CallOrder === undefined) {
				return -1;
			}
			if (b.CallOrder === undefined) {
				return 1;
			}
			return a.CallOrder - b.CallOrder;
		});

		for (const configProvider of configProviders) {
			const config = await this.loadData(wizardConfig, configProvider);
			if (config) {
				wizardConfig[configProvider.ConfigName as keyof GenericWizardBaseConfig] = configProvider.DtoAccessor ? (config as Record<string, number & IWorkflowActionTask & IGenericWizardInstanceEntity>)[configProvider.DtoAccessor] : config as (number & IWorkflowActionTask & IGenericWizardInstanceEntity);
				if (configProvider.ValidationFn) {
					configProvider.ValidationFn(config, this.injector);
				}
			}
		}
		return wizardConfig;
	}

	private loadData(wizardConfig: GenericWizardBaseConfig, configProvider: ConfigProvider<GenericWizardUseCaseUuid>): Promise<object> {
		const params = this.prepareParams(wizardConfig, configProvider);
		switch (configProvider.RequestType) {
			case RequestType.GET:
				return this.httpService.get(configProvider.Url, { params: params });
			case RequestType.POST:
				return this.httpService.post(configProvider.Url, params);
			case RequestType.DELETE:
				return this.httpService.delete(configProvider.Url, { params: params });
			case RequestType.PATCH:
				return this.httpService.patch(configProvider.Url, { params: params });
			case RequestType.PUT:
				return this.httpService.post(configProvider.Url, { params: params });
		}
	}

	private prepareParams(wizardConfig: GenericWizardBaseConfig, configProvider: ConfigProvider<GenericWizardUseCaseUuid>): Record<string, string | number | boolean | readonly (string | number | boolean)[]> {
		const params: Record<string, string | number | boolean | readonly (string | number | boolean)[]> = {};
		const configProviderParams = configProvider.Params;
		if (configProviderParams) {
			if (typeof configProviderParams === 'function') {
				return configProviderParams(wizardConfig);
			}
			Object.keys(configProviderParams).forEach((key: string) => {
				const item = get(wizardConfig, configProviderParams[key]);
				if (item !== undefined && typeof item !== 'object') {
					params[key] = item;
				}
			});
		}
		return params;
	}
}