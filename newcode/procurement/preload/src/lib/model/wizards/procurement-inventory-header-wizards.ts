/*
 * Copyright(c) RIB Software GmbH
 */
import { IWizard } from '@libs/platform/common';
export const PROCUREMENT_INVENTORY_HEADER_WIZARDS: IWizard[] = [
	{
		uuid: '4f82ac23a7cc4b7b9bee5b7be1474def',
		name: 'enableRecord',
		execute: async (context) => {
			const module = await import('@libs/procurement/inventory');
			return new module.ProcurementInventoryHeaderWizard().procurementInventoryHeaderEnableWizard(context);
		},
	},
	{
		uuid: 'eb771473ecc845ae9cc8d7771edd1aba',
		name: 'disableRecord',
		execute: async (context) => {
			const module = await import('@libs/procurement/inventory');
			return new module.ProcurementInventoryHeaderWizard().procurementInventoryHeaderDisableWizard(context);
		},
	},
	{
		uuid: 'ae919a627ebb405ca7bbab405ded23ca',
		name: 'processInventory',
		execute: async (context) => {
			const module = await import('@libs/procurement/inventory');
			return new module.ProcurementInventoryHeaderWizard().procurementProcessInventory(context);
		},
	},
	{
		uuid: '200e9a5b3dc84d2fb93a4b7dc62bbda0',
		name: 'generateInventory',
		execute: async (context) => {
			const module = await import('@libs/procurement/inventory');
			return new module.ProcurementInventoryHeaderWizard().procurementGenerateInventory(context);
		},
	},
];
