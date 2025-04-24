/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_COSTGROUPS_WIZARDS: IWizard[] =
	[
		{
			uuid: 'c8ab0141e3694ef7ac3787618bb56ca7',
			name: 'importCostGroups',
			execute: (context) => {
				return import('@libs/basics/costgroups').then((module) => new module.BasicsCostgroupsWizard().importCostGroups(context) );
			}
		},
		{
			uuid: '8ba11b8cc5a34c9ea980774d4c7ffc07',
			name: 'importCrbBkp',
			execute: (context) => {
				return import('@libs/basics/costgroups').then((module) => new module.BasicsCostgroupsWizard().importCrbBkp(context) );
			}
		},
		{
			uuid: 'e7afd22f76d44ebdbd2f21bf57043ccf',
			name: 'disableRecord',
			execute: (context) => {
				return import('@libs/basics/costgroups').then((module) => new module.BasicsCostgroupsWizard().disableRecord(context) );
			}
		},
		{
			uuid: '4ce06366ebdf4eabb3431910854f5b33',
			name: 'enableRecord',
			execute: (context) => {
				return import('@libs/basics/costgroups').then((module) => new module.BasicsCostgroupsWizard().enableRecord(context) );
			}
		}

	];