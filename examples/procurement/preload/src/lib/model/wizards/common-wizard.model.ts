import { IWizard } from '@libs/platform/common';
import { ProcurementCommonFeatureKeyManagement, WIZARD_NAME } from '@libs/procurement/common';

export const PROCUREMENT_COMMON_WIZARDS: IWizard[] = [
	{
		uuid: '31A60545113340C2A65279E6D320F79F',
		name: 'Bidder Search',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.bidderSearch);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	},
	{
		uuid: '6ba4aacb4e234d5ab5eaffca1b8141bf',
		name: 'Set Base-/Alternate Item Groups',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.selectPrcItemGroups);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	}, {
		uuid: 'fddb6c0113804137aeee684560dc2f5f',
		name: 'splitAllOverDiscount',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.splitAllOverDiscount);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	},
	{
		uuid: 'fd308c3dd8494cbabee281e8fa2d81c6',
		name: 'generateDiliverySchedule',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.generateDiliverySchedule);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	},
	{
		//Todo: Need to provide a provision for this UUID: '8ce7655b8232447386ba0dcf8bcb3568' to load the prc.quote module wizard.
		uuid: '512025851bc24e14b42148d6c518725d',
		name: 'Update item price wizard',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.updateItemPrice);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	},
	{
		uuid: '2bfcf68f2cf44ce3aca66ea7e5716a37',
		name: 'Change Document Status',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.changeProcurementDocumentStatus);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	},
	{
		uuid: 'aeffc96eb4a0440e8fd410272123bcbe',
		name: 'Replace neutral material wizard',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.replaceNeutralMaterial);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	},
	{
		uuid: 'b56a6f8b92ec4c8caa2f1969c2b31a2e',
		name: 'Enhance Bidder Search',
		execute: (context) => {
			const currentModule = context.moduleManager.activeModule!;
			const moduleName = currentModule.internalModuleName;
			const featureKey = context.injector.get(ProcurementCommonFeatureKeyManagement).getFeatureKey(moduleName, WIZARD_NAME.enhanceBidderSearch);
			if (featureKey) {
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			} else {
				return;
			}
		},
	}
];