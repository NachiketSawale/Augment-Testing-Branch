/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_EFB_SHEETS_WIZARDS: IWizard[] = [
	{
		//uuid: 'D365E2E9609F4075B2C58A585C301747',
		uuid: 'd365e2e9609f4075b2c58a585c301747',
		name: 'updateWages',
		execute: context => {
			return import('@libs/basics/efbsheets').then((module) => new module.EfbSheetsWizard().updateWages(context) );
			//return import('@libs/basics/efbsheets').then((module) => context.injector.get(module.EfbSheetsWizard).updateWages(context));
	  }
	}
];