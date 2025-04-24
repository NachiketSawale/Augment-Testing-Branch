/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const PPS_FABRICATIONUNIT_WIZARDS: IWizard[] =
	[
		{
			uuid: '595d240801504ec6ae145c8e4401bcb5',
			name: 'enableFabricationUnit',
			execute: (context) => {
				return import('@libs/productionplanning/fabricationunit').then((module) => new module.PpsFabricationunitWizard().fabricationunitEnableWizard(context));
			},
		},
		{
			uuid: 'eea38a7830e747b5a59a652b5a1363b9',
			name: 'disableFabricationUnit',
			execute: (context) => {
				return import('@libs/productionplanning/fabricationunit').then((module) => new module.PpsFabricationunitWizard().fabricationunitDisableWizard(context));
			},
		},
	];