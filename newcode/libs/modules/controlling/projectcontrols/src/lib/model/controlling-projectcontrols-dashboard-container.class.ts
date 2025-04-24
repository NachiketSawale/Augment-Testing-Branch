/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { ControllingProjectControlsDashobardContainerComponent } from '../components/dashboard/dashboard-container.component';

export const CONTROLLING_PROJECT_CONTROLS_DASHABOARD_CONTAINER: ContainerDefinition | IContainerDefinition = {
	uuid: '773618e488874716a5ed278aa3663865',
	id: 'controlling.projectcontrols.groupingContainer',
	title: {
		text: 'Dashboard',
		key: 'controlling.projectcontrols.groupingContainer',
	},
	containerType: ControllingProjectControlsDashobardContainerComponent,
	permission: '773618e488874716a5ed278aa3663865',
};
