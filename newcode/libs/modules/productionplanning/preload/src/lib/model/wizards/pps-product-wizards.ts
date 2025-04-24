/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const PPS_PRODUCT_WIZARDS: IWizard[] =
	[
		{
			uuid: 'c66ed7f2a484423fa9532ce33d61b324',
			name: 'enableProduct',
			execute: (context) => {
				return import('@libs/productionplanning/product').then((module) => new module.PpsProductWizard().ppsProductEnableWizard(context));
			},
		},
		{
			uuid: '6c5ae92a6ec74435857d41d2409fcdb9',
			name: 'disableProduct',
			execute: (context) => {
				return import('@libs/productionplanning/product').then((module) => new module.PpsProductWizard().ppsProductDisableWizard(context));
			},
		},
		{
			uuid: '0bd0c22574f841b4a907de00e5af3f46',
			name: 'changeProductStatus',
			execute(context): Promise<void> | undefined {
				return import('@libs/productionplanning/product').then((module) => new module.PpsProductWizard().PpsProductChangeStatus(context));
			}
		},
		{
			uuid: 'b3ebe4845d254f138d06679cbf885921',
			name: 'changePhaseRequirementStatus',
			execute(context): Promise<void> | undefined {
				return import('@libs/productionplanning/product').then((module) => new module.PpsProductWizard().PpsPhaseRequirementChangeStatus(context));
			}
		}
	];