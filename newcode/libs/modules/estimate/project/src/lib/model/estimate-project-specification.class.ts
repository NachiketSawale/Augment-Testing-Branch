/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { EstSpecificationComponent } from '../components/estimate-project-specification.component';
import { IEstimateSpecification } from './entities/estimate-project-specification.interface';
import { EstimateProjectSpecificationDataService } from '../services/estimate-project-specification.service';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { runInInjectionContext } from '@angular/core';

/**
 * @brief Definition for the Estimate Project Specification container.
 *
 * This constant defines the container for the Estimate Project Specification, including its unique identifier,
 * title, type, permissions, and service providers.
 */
export class EstimateProjectSpecificationContainerDefinition {

	private readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);

	private readonly definition = {
		uuid: 'e7bde34dea234e43ae69eb36612bedf3',
		id: 'project.main.estimate.specification',
		title: {
			text: 'Estimate Header Text',
			key: 'project.main.estimateSpecificationTitle'
		},
		containerType: EstSpecificationComponent,
		permission: 'ce87d35899f34e809cad2930093d86b5',
		providers: [
			{
				provide: new EntityContainerInjectionTokens<IEstimateSpecification>().dataServiceToken,
				useExisting: EstimateProjectSpecificationDataService,
			}
		]
	};
	public getDefinition() {
		return this.definition;
	}
}

export const ESTIMATE_PROJECT_SPECIFICATION = runInInjectionContext(ServiceLocator.injector, () => new EstimateProjectSpecificationContainerDefinition().getDefinition());
