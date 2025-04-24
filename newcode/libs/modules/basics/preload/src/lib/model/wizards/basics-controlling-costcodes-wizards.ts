/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

// TODO: remove array (only one wizard?)
export const BASICS_CONTROLLING_COSTCODES_WIZARDS: IWizard[] =
	[
		{
			uuid: '7C97E97A817E4A0CB7DA2C654D138439',
			name: 'controllingCostCodesValidation',
			execute: async context => {
				const module = await import('@libs/basics/controllingcostcodes');
				await context.moduleManager.initializeModule(module);
				return new module.BasicsControllingCostcodesWizards().controllingCostCodesValidation(context); // TODO: check return value (promise?)
			}
		}
	];
