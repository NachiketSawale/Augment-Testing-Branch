/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerDefinition, ContainerInjectionProviders } from '@libs/ui/container-system';
import { RelationChartContainerComponent } from '../components/relation-chart-container/relation-chart-container.component';



/**
 * This class has a factory function to create a container definition for the relation chart.
 */
export class BusinessPartnerRelationChartFactoryService {
	public static create(providers: ContainerInjectionProviders): ContainerDefinition {
		return new ContainerDefinition({
			uuid: '11dd248f6db045029ba634baa501faad',
			id: 'businesspartner.main.relationChart',
			title: 'businesspartner.main.bpRelationChart',
			containerType: RelationChartContainerComponent,
			permission: '12394ae7fb944ba1b1006bd13864149a',
			providers: providers
		});
	}
}
