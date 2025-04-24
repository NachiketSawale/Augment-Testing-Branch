/*
 * Copyright(c) RIB Software GmbH
 */

import { CHART_CONTAINER_COMMON_TOKEN, ControllingProjectControlsChartContainerComponent } from '../components/chart-container/chart-container.component';
import { runInInjectionContext } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { EntityContainerInjectionTokens } from "@libs/ui/business-base";
import { IControllingCommonProjectEntity } from "@libs/controlling/common";
import { ControllingProjectControlsProjectDataService } from "../services/controlling-projectcontrols-project-main-data.service";

export class ControllingProjectControlsChartContainerClass {
	private readonly config1 = {
		uuid: 'ea28ff1df3e04a40a8f75ac60c94d54b',
		id: 'controlling.projectcontrols.Chart1',
		title: {
			text: 'Chart 1',
			key: 'controlling.projectcontrols.chart1ContainerTitle',
		},
		containerType: ControllingProjectControlsChartContainerComponent,
		permission: 'ea28ff1df3e04a40a8f75ac60c94d54b',
		providers: [
			{
				// TODO: change to dashboard dataService and entity
				provide: new EntityContainerInjectionTokens<IControllingCommonProjectEntity>().dataServiceToken,
				useExisting: ControllingProjectControlsProjectDataService
			},
			{
				provide: CHART_CONTAINER_COMMON_TOKEN,
				useValue: {
					chartKey: 'chart1',
					containerGuid: 'ea28ff1df3e04a40a8f75ac60c94d54b'
				}
			}
		],
	}

	private readonly config2 = {
		uuid: 'f59596eafa894af29a7de6c633c07965',
		id: 'controlling.projectcontrols.Chart2',
		title: {
			text: 'Chart 2',
			key: 'controlling.projectcontrols.chart2ContainerTitle',
		},
		containerType: ControllingProjectControlsChartContainerComponent,
		permission: 'f59596eafa894af29a7de6c633c07965',
		providers: [
			{
				// TODO: change to dashboard dataService and entity
				provide: new EntityContainerInjectionTokens<IControllingCommonProjectEntity>().dataServiceToken,
				useExisting: ControllingProjectControlsProjectDataService
			},
			{
				provide: CHART_CONTAINER_COMMON_TOKEN,
				useValue: {
					chartKey: 'chart2',
					containerGuid: 'f59596eafa894af29a7de6c633c07965'
				}
			}
		],
	}

	public getChart1Config(){
		return this.config1;
	}

	public getChart2Config(){
		return this.config2;
	}

}

export const CONTROLLING_PROJECT_CONTROLS_CHART1_CONTAINER  = runInInjectionContext(ServiceLocator.injector, () =>
	new ControllingProjectControlsChartContainerClass().getChart1Config()
);

export const CONTROLLING_PROJECT_CONTROLS_CHART2_CONTAINER  = runInInjectionContext(ServiceLocator.injector, () =>
	new ControllingProjectControlsChartContainerClass().getChart2Config()
);