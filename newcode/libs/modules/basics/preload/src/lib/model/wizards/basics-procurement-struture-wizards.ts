/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_PROCUREMENT_STRUCTURE_WIZARDS: IWizard[] = [
	{
		uuid: '7C60D477A72D48DF8756C54561CD3A01',
		name: 'changeProjectDocumentStatus',
		execute: async (context) => {
			const module = await import('@libs/basics/procurementstructure');
			return new module.ProcurementStructureWizard().changeDocumentProjectStatus(context);
		},
	},
	{
		uuid: '2128A4962715417A803EA812A1636A87',
		name: 'disableRecord',
		execute: async (context) => {
			const module = await import('@libs/basics/procurementstructure');
			return new module.ProcurementStructureWizard().procurementStructureDisableWizard(context);
		},
	},
	{
		uuid: 'F1AC61DF49DE42709B7850A5F1E27DCF',
		name: 'enableRecord',
		execute: async (context) => {
			const module = await import('@libs/basics/procurementstructure');
			return new module.ProcurementStructureWizard().procurementStructureEnableWizard(context);
		},
	},
];
