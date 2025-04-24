/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, GenericWizardEntityConfig } from '@libs/ui/business-base';
import { GenericWizardContainers, GenericWizardContainerTypeUnion, GenericWizardUuidServiceMap } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { GenericWizardEntityInfoContainerService } from './generic-wizard-entity-info-container.service';
import { ContainerUnion, CustomContainerUnion, isCustomContainer, isEntityInfoContainer } from '../../models/types/generic-wizard-container.type';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { DataServiceBase } from '@libs/platform/data-access';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { IIdentificationDataMutable, PlatformLazyInjectorService } from '@libs/platform/common';
import { GenericWizardCustomContainerService } from './generic-wizard-custom-container.service';
import { CustomContainerConfiguration } from '../../models/types/generic-wizard-container-config.type';
import { get } from 'lodash';
import { EntityInfoContainerSettings, RootDataService } from '../../models/types/generic-wizard-entity-info-container-settings.type';
import { CustomContainerSettings } from '../../models/types/generic-wizard-custom-container-settings.type';
import { inject, Injectable } from '@angular/core';
import { IGenericWizardInstanceConfiguration } from '@libs/basics/config';

/**
 * Helper class to load generic wizard entity info for a container.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardContainerService {

	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly genericWizardEntityInfoContainerService = inject(GenericWizardEntityInfoContainerService);
	private readonly genericWizardCustomcontainerService = inject(GenericWizardCustomContainerService);

	/**
	 * Prepares entity info for container
	 * @returns A promise of entity info.
	 */
	public async prepareEntityInfoForContainer(container: ContainerUnion, rootDataService: RootDataService, containerUuid: GenericWizardContainers, wizardConfig: GenericWizardBaseConfig, dataServiceCache: GenericWizardUuidServiceMap, wizardInstanceConfig: IGenericWizardInstanceConfiguration): Promise<EntityInfo> {
		let entityInfo = <EntityInfo>{};
		if (isEntityInfoContainer(container)) {
			const entitySettings: EntityInfoContainerSettings<GenericWizardContainerTypeUnion> = {
				container: container,
				rootDataService: rootDataService,
				dataServiceCache: dataServiceCache,
				containerUuid: containerUuid
			};
			entityInfo = await this.loadEntityInfoForEntityInfoContainer(entitySettings, wizardInstanceConfig, wizardConfig);
		} else if (isCustomContainer(container)) {
			entityInfo = await this.loadEntityInfoForCustomContainer(container, wizardConfig, rootDataService, containerUuid, dataServiceCache, wizardInstanceConfig);
		} else {
			throw new Error('No configuration found for container!');
		}
		return entityInfo;
	}

	private async loadEntityInfoForEntityInfoContainer(settings: EntityInfoContainerSettings<GenericWizardContainerTypeUnion>, wizardInstanceConfig: IGenericWizardInstanceConfiguration, wizardConfig: GenericWizardBaseConfig): Promise<EntityInfo> {
		const entityInfoConfig = await this.lazyInjector.inject<GenericWizardEntityConfig<GenericWizardContainerTypeUnion>>(settings.container.configuration.entityInfo);
		if (!entityInfoConfig) {
			throw new Error('no configuration found!');
		}

		settings.entityInfo = entityInfoConfig;
		return this.genericWizardEntityInfoContainerService.prepareEntityInfo((settings as EntityInfoContainerSettings<object>), wizardInstanceConfig, wizardConfig);
	}

	private async loadEntityInfoForCustomContainer(customContainer: CustomContainerUnion, wizardConfig: GenericWizardBaseConfig, rootDataService: DataServiceBase<GenericWizardRootEntities>, containerUuid: GenericWizardContainers, dataServiceCache: GenericWizardUuidServiceMap, wizardInstanceConfig: IGenericWizardInstanceConfiguration): Promise<EntityInfo> {
		if (customContainer.configuration.dataServiceConfig) {
			//Prepare parameters for dataservice from wizard config and use case config
			const params = customContainer.configuration.dataServiceConfig.readInfo.params;
			if (params !== undefined) {
				customContainer.configuration.dataServiceConfig.readInfo = {
					...customContainer.configuration.dataServiceConfig.readInfo,
					prepareParam: (ident: Readonly<IIdentificationDataMutable>): Record<string, string | number | boolean | readonly (string | number | boolean)[]> => {
						const paramObj: Record<string, string | number | boolean | readonly (string | number | boolean)[]> = {};
						Object.keys(params).forEach((key: string) => {
							const val = get(wizardConfig, params[key]);
							if (val !== undefined && typeof val !== 'object') {
								paramObj[key] = val;
							} else {
								paramObj[key] = params[key];
							}
						});
						return paramObj;
					}
				};
			}
		}
		const customContainerSettings: CustomContainerSettings<GenericWizardContainerTypeUnion> = {
			container: customContainer,
			rootDataService: rootDataService,
			dataServiceCache: dataServiceCache,
			containerUuid: containerUuid,
			customContainerConfiguration: customContainer.configuration as CustomContainerConfiguration<GenericWizardContainerTypeUnion>,
			includeAll: customContainer.configuration.includeAll ?? false
		};
		return await this.genericWizardCustomcontainerService.prepareEntityInfo(customContainerSettings as CustomContainerSettings<GenericWizardRootEntities>, wizardInstanceConfig);
	}
}