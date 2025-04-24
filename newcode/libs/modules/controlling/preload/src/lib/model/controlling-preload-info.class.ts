/*
 * Copyright(c) RIB Software GmbH
 */
import {
	ITile,
	ModulePreloadInfoBase,
	LazyInjectableInfo,
	ISubModuleRouteInfo,
	TileSize,
	TileGroup,
	IWizard,
	IInitializationContext } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { ControllingActualExcelImportService } from '@libs/controlling/actuals';

/**
 * The module info object for the `controlling` preload module.
 */
export class ControllingPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: ControllingPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingPreloadInfo {
		if (!this._instance) {
			this._instance = new ControllingPreloadInfo();
		}

		return this._instance;
	}

	/**
	 * Initializes a new instance.
	 * The purpose of this declaration is to make the constructor private and ensure the class is a singleton.
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'controlling';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'controlling.projectcontrols',
				displayName: {
					text: 'Project Controls',
					key: 'cloud.desktop.moduleDisplayNameControllingProjectControls',
				},
				description: {
					text: 'Project Controls',
					key: 'cloud.desktop.moduleDisplayNameControllingProjectControls',
				},
				iconClass: 'ico-controlling-dashboard',
				color: 690687,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/projectcontrols',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '4cf21f6679864485b08e96630414fd2f',
			},
			{
				id: 'controlling.actuals',
				displayName: {
					text: 'Controlling Actuals',
					key: 'cloud.desktop.moduleDisplayNameControllingActuals',
				},
				description: {
					text: 'Record and maintain actual cost evaluated in accounting.',
					key: 'cloud.desktop.moduleDescriptionControllingActuals',
				},
				iconClass: 'ico-controlling-actuals',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/actuals',
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 0, //TODO
				permissionGuid: '68d5d7a2c71b4d349f7cbbec9b483e03',
			},
			{
				id: 'controlling.configuration',
				displayName: {
					text: 'Controlling Configuration',
					key: 'cloud.desktop.moduleDisplayNameControllingConfiguration',
				},
				description: {
					text: 'Controlling Configuration',
					key: 'cloud.desktop.moduleDisplayNameControllingConfiguration',
				},
				iconClass: 'ico-controlling-configuration',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/configuration',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '6c9906e05bc94b89938503be06be3216',
			},
			{
				id: 'controlling.generalcontractor',
				displayName: {
					text: 'General Contractor Controlling',
					key: 'cloud.desktop.moduleDisplayNameControllingGeneralContractor',
				},
				description: {
					text: 'General Contractor Controlling',
					key: 'cloud.desktop.moduleDisplayNameControllingGeneralContractor',
				},
				iconClass: 'ico-general-contractor',
				color: 690687,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/generalcontractor',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '877b609cb7b9403496c8f72b95faf21c',
			},
			{
				id: 'controlling.controllingunittemplate',
				displayName: {
					text: 'Controlling Unit Template',
					key: 'cloud.desktop.moduleDisplayNameControllingUnitTemplate',
				},
				description: {
					text: 'Controlling Unit Template',
					key: 'cloud.desktop.moduleDescriptionControllingUnitTemplate',
				},
				iconClass: 'ico-controllingunit-templates',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/controllingunittemplate',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '7af74d9881b0423785983bcb2a86e857',
			},
			{
				id: 'controlling.structure',
				displayName: {
					text: 'Controlling Units',
					key: 'cloud.desktop.moduleDisplayNameControllingUnits',
				},
				description: {
					text: 'Controlling Units',
					key: 'cloud.desktop.moduleDescriptionControllingUnits',
				},
				iconClass: 'ico-controlling-units',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/structure',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '83c8e676e0aa455e9073853e2c3c5f32',
			},
			{
				id: 'controlling.revrecognition',
				displayName: {
					text: 'Revenue Recoginition',
					key: 'cloud.desktop.moduleDisplayNameControllingRevenueRecognition',
				},
				description: {
					text: 'Revenue Recoginition.',
					key: 'cloud.desktop.moduleDisplayNameControllingRevenueRecognition',
				},
				iconClass: 'ico-revenue-recognition',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/revrecognition',
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 0, //TODO
				permissionGuid: '2125201ca0ca4e53886cb8ad87cbfd8d',
			},
			{
				id: 'controlling.enterprise',
				displayName: {
					text: 'Enterprise Controlling',
					key: 'cloud.desktop.moduleDisplayNameControllingEnterprise',
				},
				description: {
					text: 'Cross-project Controlling',
					key: 'cloud.desktop.moduleDescriptionControllingEnterprise',
				},
				iconClass: 'ico-controlling-enterprise',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'controlling/enterprise',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '2c0f4e30481a4e63b845b3ed0a206500',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('projectcontrols', () => import('@libs/controlling/projectcontrols').then((module) => module.ControllingProjectcontrolsModule)),
			ContainerModuleRouteInfo.create('actuals', () => import('@libs/controlling/actuals').then((module) => module.ControllingActualsModule)),
			ContainerModuleRouteInfo.create('configuration', () => import('@libs/controlling/configuration').then((module) => module.ControllingConfigurationModule)),
			ContainerModuleRouteInfo.create('generalcontractor', () => import('@libs/controlling/generalcontractor').then((module) => module.ControllingGeneralcontractorModule)),
			ContainerModuleRouteInfo.create('controllingunittemplate', () => import('@libs/controlling/controllingunittemplate').then((module) => module.ControllingControllingunittemplateModule)),
			ContainerModuleRouteInfo.create('structure', () => import('@libs/controlling/structure').then((module) => module.ControllingStructureModule)),
			ContainerModuleRouteInfo.create('revrecognition', () => import('@libs/controlling/revrecognition').then((module) => module.ControllingRevrecognitionModule)),
			ContainerModuleRouteInfo.create('enterprise', () => import('@libs/controlling/enterprise').then((module) => module.ControllingEnterpriseModule)),
		];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
	public override get wizards(): IWizard[] {
		return [
			{
				uuid: '415fc2f301a6412082c00a9510642237',
				name: 'Update Controlling Cost Codes',
				description: 'Update Controlling Cost Codes',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/actuals').then((m) => {
						new m.ControllingActualsUpdateControllingCostCode(context).execute();
					});
				},
			},
			{
				uuid: '0285331bb206416d817d71e5ecbce549',
				name: 'controlling.actuals.updateCostHeaderAmount',
				description: 'controlling.actuals.updateCostHeaderAmount',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/actuals').then((m) => {
						new m.ControllingActualsUpdateCostHeaderAmount(context).execute();
					});
				},
			},
			{
				uuid: '4c9ef74c4709451fb16728d77092c51f',
				name: 'controlling.actuals.wizard.actuals.title',
				description: 'controlling.actuals.wizard.actuals.title',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/actuals').then((m) => {
						new m.ControllingActualsGeneratePreliminaryActuals(context).execute();
					});
				},
			},
			{
				uuid: '2820512A0985469CBF764D7797018BF7',
				name: 'controlling.actuals.synchronizeActualsFromFinance',
				description: 'controlling.actuals.synchronizeActualsFromFinance',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/actuals').then((m) => {
						new m.ControllingActualsImportItwofinance(context).execute();
					});
				},
			},
			{
				uuid: '23C8C9E88945448F9FC660683C34019A',
				name: 'Change controlling unit status',
				description: 'Change controlling unit status',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/structure').then((m) => {
						m.ControllingStructureChangStatusWizardService.execute(context);
					});
				},
			},
			{
				uuid: '306056b758bf47f18bfb38005651ca4b',
				name: 'Change controlling unit template',
				description: 'Change controlling unit template',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/structure').then((m) => {
						m.ControllingStructureWizardService.onStartCreateContollingUnitTemplateWizard(context);
					});
				},
			},
			{
				uuid: 'A9309EC4424E492D84745D89D14C1579',
				name: 'Excel Import',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/actuals').then(() => {
						context.injector.get(ControllingActualExcelImportService).execute();
					});
				},
			},
			{
				uuid: 'ebc786c7f90e4ff582be8a18feea2177',
				name: 'Change company',
				description: 'Change company',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/structure').then((m) => {
						m.ControllingStructureWizardService.onChangeCompanyWizard(context);
					});
				},
			},
			{
				uuid: 'bff8ce97887a467eae1e5a3e01e0c62e',
				name: 'Update Estimate',
				description: 'Update Estimate',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/structure').then((m) => {
						m.ControllingStructureWizardService.onStartUpdateEstimateWizard(context);
					});
				},
			},
			{
				uuid: '172EF89E4FC145089310140BF7DB09FD',
				description: 'Create Update Cost Controls Structure from Contract Sales',
				name: 'controlling.generalcontractor.CreateUpdateCostControlStructureWizard',
				execute: (context) => {
					return import('@libs/controlling/generalcontractor').then((m) => {
						m.ControllingGeneralContractorContractorWizardService.onStartCreateUpdateCostControlStructureWizard(context);
					});
				}
			},
			{
				uuid: '5f0ee5bce5314ac88355b5db3403a6fa',
				description: 'Transfer Scheduler Task Management',
				name: 'controlling.structure.controllingStructureTransferSchedulerTask',
				execute: (context) => {
					return import('@libs/controlling/structure').then((m) => {
						m.ControllingStructureWizardService.onStartUpdateTransferSchedulerToProjectWizard(context);
					});
				}
			},
			{
				uuid: '4A8387F04E754963B2ED7BE80D336EEB',
				description: 'Create / Update Procurement Package',
				name: 'controlling.generalcontractor.CreatePackagesStructureWizard',
				execute: (context) => {
					return import('@libs/controlling/generalcontractor').then((m) => {
						m.ControllingGeneralCreatePackagesWizardService.onStartCreatePackagesWizard(context);
					});
				},
			},
			{
				uuid: 'e59e565c87c04d7b85f8639308afc702', //controlling projectcontrols
				name: 'Transfer to Enterprise Controlling',
				description: 'Transfer Project Data (Cost, Revenue, Budget, Performance,…)',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/projectcontrols').then((m) => {
						m.ControllingProjectcontrolsWizardService.transferDataToBisDataWizard(context);
					});
				},
			},
			{
				uuid: '19722dd73f3d45398a1a46ca1f4da8c8',
				description: 'Create Additional Expenses',
				name: 'controlling.generalcontractor.CreateAdditionalExpensesStructureWizard',
				execute: (context) => {
					return import('@libs/controlling/generalcontractor').then((m) => {
						m.ControllingGeneralCreateAdditionalExpenseWizardService.onStartCreateAdditionalExpenseWizard(context);
					});
				},
			},
			{
				uuid: 'E0BABE2697284B78AF106FFCCE10FC5F',
				description: 'Create Budget Shift',
				name: 'controlling.generalcontractor.CreateAdditionalExpensesStructureWizard',
				execute: (context) => {
					return import('@libs/controlling/generalcontractor').then((m) => {
						m.ControllingGeneralCreateBudgetShiftWizardService.onStartCreateBudgetShiftWizard(context);
					});
				},
			},
			{
				uuid: 'd0461eacb4f74deab59c0273ab979c91',
				description: 'Create Transactions',
				name: 'controlling.revenueRecognition.CreateTransactionWizard',
				execute: (context) => {
					return import('@libs/controlling/revrecognition').then((m) => {
						m.ControllingRevenueRecognitionWizard.createTransactionWizard(context);
					});
				},
			},
			{
				uuid: '983609bbfe524f37b015995ecf0273de',
				description: 'Change Status',
				name: 'controlling.revrecognition.wizard.changeStatus.title',
				execute: (context) => {
					return import('@libs/controlling/revrecognition').then((m) => {
						m.ControllingRevenueRecognitionWizard.changeStatusWizard(context);
					});
				},
			},
			{
				uuid: '891c076e2fa447a99fd3ae856300632b',
				name: 'Create Activities',
				description: 'Create Activities',
				execute(context: IInitializationContext) {
					return import('@libs/controlling/structure').then((m) => {
						 m.ControllingStructureWizardService.onStartCreateActivitiesWizard(context);
					});
				},
			}
		];
	}
}
