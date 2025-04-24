/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

/**
 * Represents wizards of Estimate Main.
 */
export const ESTIMATE_MAIN_WIZARDS: IWizard[] = [
	{
		uuid: '9c282d014cd243679fdb8d67a24972ec',
		name: 'estimate.main.splitBudget',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().splitBudget(context));
		}
	},
	{
		uuid: 'b30b50f0e1e14090af5f5f52e885d431',
		name: 'estimate.main.convertLineItemToAssembly',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().convertLineItemIntoAssembly(context));
		}
	},
	{
		uuid: 'd30595bb1fdb49549836fe84e95858db',
		name: 'estimate.main.generateBudget',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().generateBudget(context));
		}
	},
	{
		uuid: '47b13c6b62cc4d098e3d9ff9e0f3b453',
		name: 'stimate.main.generateScheduleWizard',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().generateSchedule(context));
		}
	},
	{
		uuid: '6e47e8abb9e74e1988f3db2129159c6a',
		name: 'estimate.main.updateQuantity',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateActivitiesQuantity(context));
		}
	},
	{
		uuid: 'b58fa6433a394d8eb4bd0fea311aeb9e',
		name: 'estimate.main.updateControllingBudgetHeader',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateControllingBudget(context));
		}
	},
	{
		uuid: 'c950da1a3c504033b835dc19121d3d9d',
		name: 'estimate.main.updateBaseCost',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateBaseCost(context));
		}
	},
	{
		uuid: 'fa88384e41874af58f335579051b75b5',
		name: 'estimate.main.wizardDialog.updateLineItemQuantityWizardTitle',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateLineItemQuantity(context));
		}
	},
	{
		uuid: '5f88640dd81e47fb8b8e39ab85f91007',
		name: 'estimate.main.updateEstimate',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateEstimate(context));
		}
	},

	{
		uuid: '82e6694bd52d46b794fc85687c63fc88',
		name: 'quantityMaintenance',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().quantityMaintenance(context));
		}
	},
	{
		uuid: 'c6644fd983b745cba1a38c7708877548',
		name: 'estimate.main.updateProjectBoqBudgetWizard.',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateProjectBoqBudget(context));
		}
	},
	{
		uuid: '58b2368111ea4f02a905c00a424e7ca9',
		name: 'estimate.main.bidCreationWizardCreateBid',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().createBid(context));
		}
	},
	{
		uuid: '991fbe11918a45619223d8218f38e61d',
		name: 'estimate.main.updateRevenue',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateRevenue(context));
		}
	},
	{
		uuid: '47b311cd62ae496095acdddaa0af2554',
		name: 'estimate.main.splitLineItemWizard.title',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().splitLineItem(context));
		}
	},
	{
		uuid: 'ec55444cd68b4ae4abdee830c75e39af',
		name: 'estimate.main.generateItemFromLeadingStructure',
		execute: (context) => {

			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().generateLineItem(context));
		},
	},
	{
		uuid: '423b424a0a034fe781bb9dc550216f4e',
		name: 'estimate.main.generateEstimateFromBoq',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().generateEstimateFromBoq(context));
		},
	},
	{
		uuid: 'afc51d1798fa42f8bd20d28e2c50ddb5',
		name: 'estimate.main.createResRequisitionFromLineItemsWizard.title',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().createResRequisitionFromLineItems(context));
		}
	},
	{
		uuid: 'acc390c370c34fbbbfe02e393aea45fc',
		name: 'estimate.main.dissolveAssemblyWizard.dissolveAssembly',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().dissolveAssembly(context));
		}
	},
	{
		uuid: 'dd6de86e4193472987a98513b112fd32',
		name: 'estimate.main.removeEstimateRuleAssignments',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().removeEstimateRuleAssignments(context));
		}
	},
	{
		uuid: 'a8dcd6350a4d4fbe98d6c7c424dbd17c',
		name: 'estimate.main.updateMaterialPackage',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateMaterialPackage(context));
		},
	},
	{
		uuid: '62d464354bf24d9dbb60a77c3d140f10',
		name: 'estimate.main.backwardCalculation.title',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().backWordCalculate(context));
		}
	},
	{
		uuid: '56b028c6a72d4a43b454f0266e34529b',
		name: 'estimate.main.wizardDialog.copyAssemblies',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().searchAssemblies(context));
		}
	},
	{
		uuid: 'c393bd3cedd84cbba9426adef4f52331',
		name: 'estimate.main.copyLineItem.',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().searchLineItems(context));
		}
	},
	{
		uuid: '15bfd1dccd0047d192974ee898608b63',
		name: 'estimate.main.updateCompositeAssemblyFromMasterData',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().updateCompositeAssemblyFromMasterData(context));
		}
	},
	{
		uuid: 'db5726f33a0b45e080e3c09f135865b7',
		name: 'estimate.main.replaceResourceWizard.configTitle',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().replaceResource(context));
		}
	},
	{
		uuid: 'ca387bd0f04649998784eb8735e388d5',
		name: 'estimate.main.modifyResourceWizard.configTitle',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().modifyResource(context));
		}
	},
	{
		uuid: '693d1cf60af842da89f512f5da7385f6',
		name: 'estimate.main.createMaterialPackage',
		execute: (context) => {
			return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().createMaterialPackage(context));
		}
	},
	{
		uuid: 'b6e18be8dc2d42959af05054e13a9a6d',
		name: 'estimate.main.removePackage',
		execute: (context) => {
				return import('@libs/estimate/main').then((module) => new module.EstimateMainWizard().removePackage(context));
			}
	}
];

/**
 * Represents wizards of Estimate Assemblies.
 */
export const ESTIMATE_ASSEMBLIES_WIZARDS: IWizard[] = [
	{
		uuid: 'ea99e8240a414fafb5db8797364b5f43',
		name: 'estimate.assemblies.updateAssembliesWizard.title',
		execute: (context) => {
			return import('@libs/estimate/assemblies').then((module) => new module.EstimateAssembliesWizard().updateAssemblies(context));
		}
	},
	{
		uuid: 'fbe06852d2954c82ba4bd996ef117c8d',
		name: 'estimate.main.replaceResourceWizard.configTitle',
		execute: (context) => {
			return import('@libs/estimate/assemblies').then((module) => new module.EstimateAssembliesWizard().replaceResource(context));
		}
	},
	{
		uuid: '283e5125288d40538c37b93a1194eb1e',
		name: 'estimate.main.modifyResourceWizard.configTitle',
		execute: (context) => {
			return import('@libs/estimate/assemblies').then((module) => new module.EstimateAssembliesWizard().modifyResource(context));
		}
	}
];
