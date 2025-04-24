/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_COSTCODE_RECORD_WIZARDS : IWizard[] =
[{
	uuid: 'e71b906a275446b7b4f47af820840a7f',
	name: 'Import Cost Codes',
	execute: context => {
		return import('@libs/basics/costcodes').then((module) => new module.CostCodeWizard().importCostCodesWizard(context));
	}
}];
