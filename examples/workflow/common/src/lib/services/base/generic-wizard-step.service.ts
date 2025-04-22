/*
 * Copyright(c) RIB Software GmbH
 */

import { IGenericWizardInstanceConfiguration } from '@libs/basics/config';
import { GenericWizardContainerInformation } from './generic-wizard-entity-info.service';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { GenericWizardUseCaseConfig } from '../../models/types/generic-wizard-use-case-config.type';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { ContainerConfiguration, GenericWizardStepConfig } from '../../models/injection-token/generic-wizard-injection-tokens';
import { inject, Injectable, Injector } from '@angular/core';
import { GenericWizardConfigService } from './generic-wizard-config.service';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { Translatable } from '@libs/platform/common';
import { ContainerDefinition } from '@libs/ui/container-system';

/**
 * Helper class to prepare containers for each step in generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardStepService {

	private readonly injector = inject(Injector);
	private readonly wizardConfigService = inject(GenericWizardConfigService);

	/**
	 * Prepares containers for each step in the instance configuration.
	 * @param entityInfo entity information to load in each container.
	 * @param genericWizardInstanceConfig wizard configuration from modules module used to load each step.
	 * @param useCaseConfiguration use case configuration to add validation details.
	 * @returns Step configuration for the generic wizard.
	 */
	public prepareSteps(entityInfo: GenericWizardContainerInformation[], genericWizardInstanceConfig: IGenericWizardInstanceConfiguration, useCaseConfiguration: GenericWizardUseCaseConfig<GenericWizardRootEntities, GenericWizardUseCaseUuid>): GenericWizardStepConfig[] {
		const genericWizardStepsConfig: GenericWizardStepConfig[] = [];

		//Looping through steps in current wizard instance
		genericWizardInstanceConfig.Steps.forEach((step) => {

			const containerConfig: ContainerConfiguration[] = [];
			step.Container.forEach((container) => {
				const containerUuid = container.Instance.ContainerUuid as GenericWizardContainers;
				const containerInfo = entityInfo.find(entity => entity.containerUuid === containerUuid);
				if(!containerInfo) {
					console.log('container configuration is not available for this container');
					return;
				}

				let containers: ContainerDefinition[] = [];
				if(containerInfo.entityInfo !== undefined) {
					containers = containerInfo.entityInfo.containers.filter(container => container.uuid === containerUuid);
				} else if(containerInfo.containerDefinition !== undefined) {
					containers = [containerInfo.containerDefinition];
				}
				
				if (containers.length === 0) {
					return;
				}

				const containerUseCaseConfiguration = useCaseConfiguration.Containers[containerUuid];
				let containerTitle: Translatable = '';
				
				if(containerUseCaseConfiguration) {
					const isVisible = containerUseCaseConfiguration.isVisible;
					if(isVisible) {
						const isVisibleResult = isVisible(this.injector, this.wizardConfigService.getWizardConfig());
						if(!isVisibleResult) {
							return;
						}
					}

					containerTitle = containerUseCaseConfiguration.name;
					if (containerUseCaseConfiguration?.orderedInfoBarDisplayMembers) {
						this.wizardConfigService.addContainerForInfoBar(containerUuid);
					}
				}				
				
				containerConfig.push({ container: containers, containerTitle: containerTitle, containerUuid: containerUuid, isIncludedInInfoBar: useCaseConfiguration.Containers[containerUuid]?.orderedInfoBarDisplayMembers !== undefined });
			});

			//Don't add empty steps
			if (containerConfig.length === 0) {
				return;
			}

			genericWizardStepsConfig.push({
				containerConfig: containerConfig,
				tabName: step.Instance.TitleInfo.Translated
			});

		});
		return genericWizardStepsConfig;
	}
}
