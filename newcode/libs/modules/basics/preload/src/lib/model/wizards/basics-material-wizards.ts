/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_MATERIAL_RECORD_WIZARDS: IWizard[] = [
	{
		uuid: '8e5788b865f19e5ce2c6a612e31530c8',
		name: 'updateFullTextIndex',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().updateFullTextIndexWizard(context);
		},
	},
	{
		uuid: '6980446b54d04c558a3fcdc79fba3693',
		name: 'import3DModel',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().import3DModel(context);
		},
	},
	{
		uuid: '7ee9fa8f33994c8fbf97412a1fa3bcc0',
		name: 'delete3DModel',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().delete3DModel(context);
		},
	},
	{
		uuid: '3989f9d232a04b568b1c24c3d30329a8',
		name: 'recalculateMaterialFromVariant',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().recalculateMaterialPriceFromVariantWizard(context);
		},
	},
	{
		uuid: '25221988687a44db97eb053f9ad80625',
		name: 'createMaterialFromTemplate',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().createMaterialFromTemplate(context);
		},
	},
	{
		uuid: 'a8c2353fca6b48a88c9b25901b0a7528',
		name: 'changeMaterialStatus',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().changeMaterialStatus(context);
		},
	},
	{
		uuid: '15d44284c7f241b3ac2978a400cfc238',
		name: 'importGaebMaterials',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().importGaebMaterials(context);
		},
	},
	{
		uuid: '1455ff210ae74b58ad51b76c2d30f57d',
		name: 'updateMaterialPrice',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().updateMaterialPrice(context);
		},
	},
	{
		uuid: 'ce48703dfb5f4679b0a6c44004b5eb7d',
		name: 'enableRecord',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().enableWizard(context);
		},
	},
	{
		uuid: 'f9939d2716fa4e8f94243e174d976c34',
		name: 'disableRecord',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().disableWizard(context);
		},
	},
	{
		uuid: '12f9d13b74d54c438dc7cc660743141e',
		name: 'characteristicBulkEditor',
		execute: async (context) => {
			const module = await import('@libs/basics/material');
			return new module.MaterialRecordWizard().characteristicBulkEditor(context);
		},
	},
];
