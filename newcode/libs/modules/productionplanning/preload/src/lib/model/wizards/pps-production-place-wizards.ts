/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';
export const PPS_PRODUCTION_PLACE_WIZARDS: IWizard[] = [
	{
		uuid: '30c25c43ce0b4450806763d21bbc43cc',
		name: 'enableProductionPlace',
		execute: (context) => {
			return import('@libs/productionplanning/productionplace').then((module) => {
				const service = context.injector.get(module.PpsProductionPlaceEnableWizardService);
				service.onStartEnableWizard();
			});
		},
	},
	{
		uuid: '57b38025007a48e7bc7a7ce912bb6ee0',
		name: 'disableProductionPlace',
		execute: (context) => {
			return import('@libs/productionplanning/productionplace').then((module) => {
				const service = context.injector.get(module.PpsProductionPlaceDisableWizardService);
				service.onStartDisableWizard();
			});
		},
	},
];
