/*
 * Copyright(c) RIB Software GmbH
 */


import { EntityInfo } from '@libs/ui/business-base';
import { PlatformLazyInjectorService, PlatformPermissionService } from '@libs/platform/common';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { GenericWizardRootEntities, getGenericWizardUseCaseConfig } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { IGenericWizardInstanceConfiguration } from '@libs/basics/config';
import { GenericWizardContainers, GenericWizardUuidServiceMap } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { GenericWizardContainerService } from './generic-wizard-container.service';
import { RootDataService } from '../../models/types/generic-wizard-entity-info-container-settings.type';
import { GenericWizardConfigService } from './generic-wizard-config.service';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { GenericWizardToolbarService } from './generic-wizard-toolbar.service';
import { preparePreviewDocumentBtn } from '../../configuration/rfq-bidder/preview-fn';
import { ContainerDefinition } from '@libs/ui/container-system';
import { isCustomContainer, isEntityInfoContainer } from '../../models/types/generic-wizard-container.type';


export type GenericWizardContainerInformation = { 
	containerUuid: GenericWizardContainers;
	entityInfo?: EntityInfo;
	containerDefinition?: ContainerDefinition;
 };

/**
 * Helper class to prepare entity info for generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardEntityInfoService {

	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly platformPermissionService = inject(PlatformPermissionService);
	private readonly injector = inject(Injector);
	private readonly genericWizardContainerService = inject(GenericWizardContainerService);
	private readonly wizardConfigService = inject(GenericWizardConfigService);
	private readonly genericWizardToolbarService = inject(GenericWizardToolbarService);

	/**
	 * Prepares entity info for the selected use case.
	 * @returns
	 */
	public async prepareEntityInfo(startEntity: number, wizardConfig: GenericWizardBaseConfig, dataServiceCache: GenericWizardUuidServiceMap, wizardInstanceConfig: IGenericWizardInstanceConfiguration): Promise<{rootDataService: RootDataService, containerInfo: GenericWizardContainerInformation[]}> {
		//Initial value of entity infos
		const genericWizardContainerInformation: GenericWizardContainerInformation[] = [];
		const useCaseConfig = this.getUseCaseConfig(wizardInstanceConfig);

		//Load root service and load data for root service (new instance should be created for root service)
		const rootDataService = await this.createRootDataService(startEntity, useCaseConfig);

		const permissionUuids: string[] = [];
		const containers = useCaseConfig.Containers;

		//Loop through each container and prepare entity info
		for (const containerKey in containers) {
			const typedKey = containerKey as keyof typeof containers;
			const container = useCaseConfig.Containers[typedKey];
			if(container) {
				if (isEntityInfoContainer(container) || isCustomContainer(container)) {
					//Prepare entity info for each container
					const entityInfo = await this.genericWizardContainerService.prepareEntityInfoForContainer(container, rootDataService, typedKey, wizardConfig, dataServiceCache, wizardInstanceConfig);
					genericWizardContainerInformation.push({ containerUuid: typedKey, entityInfo });
				} else if (container) {
					genericWizardContainerInformation.push({containerUuid: typedKey, containerDefinition: container.configuration});
				}

				//Load permissions for each container
				permissionUuids.push(container.permissionUuid);

				if(container.enableDocumentPreview) {
					container.toolbarItems = container.toolbarItems || [];
					container.toolbarItems?.push(preparePreviewDocumentBtn(typedKey));
				}

				//Load toolbar items for each container
				if (container.toolbarItems) {
					this.genericWizardToolbarService.setMenuItems(typedKey, container.toolbarItems);
				}
			}
		}

		await this.platformPermissionService.loadPermissions(permissionUuids);
		return {
			containerInfo: genericWizardContainerInformation,
			rootDataService: rootDataService
		};
	}

	/**
	 * Returns the use case configuration for the passed instance configuration.
	 * @returns a generic wizard use case configuration.
	 */
	public getUseCaseConfig(wizardInstanceConfig: IGenericWizardInstanceConfiguration): GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid> {
		if (wizardInstanceConfig.Instance.WizardConfiGuuid === null || wizardInstanceConfig.Instance.WizardConfiGuuid === undefined) {
			throw new Error('Wizard configuration not found!');
		}
		this.wizardConfigService.setWizardInstaceUuid(wizardInstanceConfig.Instance.WizardConfiGuuid as GenericWizardUseCaseUuid);
		return getGenericWizardUseCaseConfig(wizardInstanceConfig.Instance.WizardConfiGuuid);
	}

	private async createRootDataService(startEntity: number, useCaseConfig: GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>): Promise<RootDataService> {
		const rootDataConfig = await this.lazyInjector.inject(useCaseConfig.RootDataService);
		const rootDataServiceType = rootDataConfig.rootDataServiceType;
		if (!rootDataServiceType) {
			throw new Error('Root data service not found!');
		}
		const dataService = runInInjectionContext(this.injector, () => {
			return new rootDataServiceType();
		});

		const searchPayload = {
			filter: '',
			Pattern: '',
			PageSize: 700,
			PageNumber: 0,
			UseCurrentClient: null,
			UseCurrentProfitCenter: null,
			IncludeNonActiveItems: null,
			ProjectContextId: null,
			PinningContext: [],
			ExecutionHints: false,
			PKeys: [{ id: startEntity }],
			executionHints: false,
			includeNonActiveItems: false,
			pageNumber: 0,
			pageSize: 700,
			pattern: '',
			pinningContext: [],
			projectContextId: null,
			useCurrentClient: false,
			isReadingDueToRefresh: false
		};
		const items = (await dataService.filter(searchPayload)).dtos;
		const typedDataService = dataService as unknown as RootDataService;
		typedDataService.setList(items);
		typedDataService.select(items[0]);
		return typedDataService;
	}
}