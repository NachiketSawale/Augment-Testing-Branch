/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

/**
 * construction system master wizards
 */
export const CONSTRUCTION_SYSTEM_MASTER_WIZARDS: IWizard[] = [
	{
		uuid: '2f231506de8245d2bfb06b0ee21f01ac',
		name: 'Disable Record',
		execute: (context) => {
			return import('@libs/constructionsystem/master').then((module) => new module.ConstructionSystemMasterWizard().onStartDisableWizard(context));
		},
	},
	{
		uuid: '4d7d8c9bb9c24bf8a84caf36b4f8ffc6',
		name: 'Enable Record',
		execute: (context) => {
			return import('@libs/constructionsystem/master').then((module) => new module.ConstructionSystemMasterWizard().onStartEnableWizard(context));
		},
	},
	{
		uuid: '306b25bee00944658582732cb5498bc4',
		name: 'Update Parameter Templates',
		execute: (context) => {
			return import('@libs/constructionsystem/master').then((module) => new module.ConstructionSystemMasterWizard().updateParameterTemplates(context));
		},
	},
];
