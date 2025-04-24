/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const PPS_PRODUCT_TEMPLATE_WIZARDS: IWizard[] =
	[
		{
			uuid: '6666c67650yt465e7753aa205267877a',
			name: 'enableProductTemplate',
			execute: (context) => {
				return import('@libs/productionplanning/product-template').then((module) => new module.PpsProductTemlateWizardClass().PpsProductTemplateEnableWizard(context));
			},
		},
		{
			uuid: '6666c67650yt465e7753aa205267877b',
			name: 'disableProductTemplate',
			execute: (context) => {
				return import('@libs/productionplanning/product-template').then((module) => new module.PpsProductTemlateWizardClass().PpsProductTemplateDisableWizard(context));
			},
		}
	];