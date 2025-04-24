import { ISubModuleRouteInfo, ITile, IWizard, LazyInjectableInfo, ModulePreloadInfoBase, TileGroup, TileSize } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { PPS_FABRICATIONUNIT_WIZARDS } from './wizards/pps-fabricationunit-wizards';
import { PPS_HEADER_WIZARDS } from './wizards/pps-header-wizards';
import { PPS_ITEM_WIZARDS } from './wizards/pps-item-wizards';
import { PPS_PRODUCT_WIZARDS } from './wizards/pps-product-wizards';
import { PPS_PRODUCT_TEMPLATE_WIZARDS } from './wizards/pps-product-template-wizards';
import { PPS_PRODUCTION_PLACE_WIZARDS } from './wizards/pps-production-place-wizards';
import { DRAWING_WIZARDS } from './wizards/drawing-wizards';
import { ENG_TASK_WIZARDS } from './wizards/eng-task-wizards';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';

export class ProductionPlanningPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new ProductionPlanningPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'productionplanning';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'productionplanning.eventconfiguration',
				displayName: {
					text: 'PPS Event Configuration',
					key: 'cloud.desktop.moduleDisplayNamePpsEventConfig',
				},
				description: {
					text: 'PPS Event Configuration',
					key: 'cloud.desktop.moduleDescriptionPpsEventConfig',
				},
				iconClass: 'ico-production-steps',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				defaultSorting: 12,
				defaultGroupId: TileGroup.Configuration,
				permissionGuid: '219e787b14ef4bc98aead019f0e5d2ba',
				targetRoute: 'productionplanning/eventconfiguration',
			},
			{
				id: 'productionplanning.formworktype',
				tileSize: TileSize.Small,
				color: 4428614,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Configuration,
				iconClass: 'ico-engineering-drawing',
				iconColor: 16777215,
				defaultSorting: 15,
				displayName: {
					text: 'Formwork Type',
					key: 'cloud.desktop.moduleDisplayNamePpsFormworkType',
				},
				description: {
					text: 'Management of Formwork Type',
					key: 'cloud.desktop.moduleDescriptionPpsFormworkType',
				},
				permissionGuid: '0349c7c4a5084dbba6c9e15abc3e8cd1',
				targetRoute: 'productionplanning/formworktype',
			},
			{
				id: 'productionPlanning.productionset',
				tileSize: TileSize.Small,
				color: 14049280,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.ProductionPlanning,
				iconClass: 'ico-production-sets',
				iconColor: 16777215,
				defaultSorting: 5,
				displayName: {
					text: 'Production Set',
					key: 'cloud.desktop.moduleDisplayNameProductionSet',
				},
				description: {
					text: 'Management of Production Set',
					key: 'cloud.desktop.moduleDescriptionProductionSet',
				},
				permissionGuid: 'dace42f5ce294acaaa8b1482985cfc52',
				targetRoute: 'productionplanning/productionset',
			},
			{
				id: 'productionplanning.strandpattern',
				displayName: {
					text: 'PPSStrandPattern',
					key: 'cloud.desktop.moduleDisplayNamePpsStrandPattern',
				},
				description: {
					text: 'PPS Strand Pattern',
					key: 'cloud.desktop.moduleDescriptionNamePpsStrandPattern',
				},
				iconClass: 'ico-stand-pattern',
				color: 11648547,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'productionplanning/strandpattern',
				defaultGroupId: TileGroup.Administration,
				defaultSorting: 0, //TODO
				permissionGuid: '439d0cd252c44d1a98366de9bcd114ef',
			},
			{
				id: 'productionplanning.processconfiguration',
				displayName: {
					text: 'PPS Process Configuration',
					key: 'cloud.desktop.moduleDisplayNamePpsProcessConfig',
				},
				description: {
					text: 'PPS Process Configuration',
					key: 'cloud.desktop.moduleDescriptionNamePpsProcessConfig',
				},
				iconClass: 'ico-process-config',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				defaultSorting: 13,
				defaultGroupId: TileGroup.Configuration,
				permissionGuid: '85505161886641bf87e7ea0dadd7cfe6',
				targetRoute: 'productionplanning/processconfiguration',
			},
			{
				id: 'productionplanning.formulaconfiguration',
				displayName: {
					text: 'Formula Configuration',
					key: 'cloud.desktop.moduleDisplayNamePpsFormulaConfig',
				},
				description: {
					text: 'Management of Formula Configuration',
					key: 'cloud.desktop.moduleDescriptionPpsFormulaConfig',
				},
				iconClass: 'ico-engineering-drawing',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/formulaconfiguration',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '6ebb6cce1f2b4f8c982188e9203b84ea',
			},
			{
				id: 'productionplanning.fabricationunit',
				displayName: {
					text: 'productionplanning fabricationunit',
					key: 'cloud.desktop.moduleDisplayNameProductionplanningFabricationunit',
				},
				description: {
					text: 'Management of Fabrication Unit',
					key: 'cloud.desktop.moduleDescriptionProductionplanningFabricationunit',
				},
				iconClass: 'ico-product',
				color: 16412672,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/fabricationunit',
				defaultGroupId: TileGroup.ProductionPlanning,
				defaultSorting: 0,
				permissionGuid: '35f3ed362113463aad72bb2c6e219908',
			},

			{
				color: 16412672,
				defaultGroupId: TileGroup.ProductionPlanning,
				defaultSorting: 8,
				description: {
					text: 'Production Place',
					key: 'cloud.desktop.moduleDescriptionProductionPlace',
				},
				displayName: {
					text: 'Production Place',
					key: 'cloud.desktop.moduleDisplayNameProductionPlace',
				},
				iconClass: 'ico-product',
				iconColor: 16777215,
				id: 'productionplanning.productionplace',
				opacity: 0.9,
				permissionGuid: 'e2fa850bda23410cb08c3d7a1627a703',
				targetRoute: 'productionplanning/productionplace',
				textColor: 16777215,
				tileSize: TileSize.Small,
			},
			{
				id: 'productionplanning.drawingtype',
				displayName: {
					text: 'Engineering Drawing Type',
					key: 'cloud.desktop.moduleDisplayNameEngineeringDrawingType',
				},
				description: {
					text: 'Management of Engineering Drawing Type',
					key: 'cloud.desktop.moduleDescriptionEngineeringDrawingType',
				},
				iconClass: 'ico-engineering-drawing',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/drawingtype',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 12, //TODO
				permissionGuid: '021aca2d00a7495b865bf89b7d0cfbbb',
			},
			{
				defaultSorting: 10,
				defaultGroupId: TileGroup.ProductionPlanning,
				description: {
					text: 'Management of Engineering Drawing',
					key: 'cloud.desktop.moduleDescriptionEngineeringDrawing',
				},
				displayName: {
					text: 'Engineering Drawing',
					key: 'cloud.desktop.moduleDisplayNameEngineeringDrawing',
				},
				iconClass: 'ico-engineering-drawing',
				iconColor: 16777215,
				id: 'productionPlanning.drawing',
				permissionGuid: 'bb72ef8baa224197970a46e788da1e9d',
				targetRoute: 'productionplanning/drawing',
				textColor: 16777215,
				color: 16412672,
				opacity: 0.9,
				tileSize: TileSize.Small,
			},
			{
				id: 'productionplanning.product',
				displayName: {
					text: 'Product',
					key: 'cloud.desktop.moduleDisplayNamePPSProduct',
				},
				description: {
					text: 'Management of Product',
					key: 'cloud.desktop.moduleDescriptionPPSProduct',
				},
				iconClass: 'ico-product',
				color: 16412672,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/product',
				defaultGroupId: TileGroup.ProductionPlanning,
				defaultSorting: 0,
				permissionGuid: '6a285c97bbeb4ea0a41be8af74509cf4',
			},
			{
				id: 'productionplanning.accounting',
				displayName: {
					text: 'Engineering Accounting',
					key: 'cloud.desktop.moduleDisplayNamePpsAccounting',
				},
				description: {
					text: 'undefined',
					key: 'undefined',
				},
				iconClass: 'ico-engineering-accounting',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/accounting',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0,
				permissionGuid: 'f89486c94d424770b23aef0870cbc8af',
			},
			{
				id: 'productionplanning.item',
				displayName: {
					text: 'Production Unit',
					key: 'cloud.desktop.moduleDisplayNamePPSItem',
				},
				description: {
					text: 'Production Planning Item',
					key: 'cloud.desktop.moduleDescriptionPPSItem',
				},
				iconClass: 'ico-production-planning',
				color: 14049280,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/item',
				defaultGroupId: TileGroup.ProductionPlanning,
				defaultSorting: 0,
				permissionGuid: 'f061895dd33a4b499913d169e8171d36',
			},
			{
				id: 'productionplanning.configuration',
				displayName: {
					text: 'PPS Configuration',
					key: 'cloud.desktop.moduleDisplayNamePpsConfiguration',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionPpsConfiguration',
				},
				iconClass: 'ico-pps-configuration',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/configuration',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '775f02d0eeea4d5d8d72a5daf43c73ee',
			},
			{
				id: 'productionplanning.producttemplate',
				displayName: {
					text: 'Product Template',
					key: 'cloud.desktop.moduleDisplayNameProductTemplate',
				},
				description: {
					text: '*Management of Product Template',
					key: 'cloud.desktop.moduleDescriptionProductTemplate',
				},
				iconClass: 'ico-engineering-product-templates',
				color: 16412672,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/producttemplate',
				defaultGroupId: TileGroup.ProductionPlanning,
				defaultSorting: 0,
				permissionGuid: '0a700de0fbe248f8adeec13cb9229ee7',
			},
			{
				defaultSorting: 0,
				defaultGroupId: TileGroup.ProductionPlanning,
				description: {
					text: 'PPS Header',
					key: 'cloud.desktop.moduleDescriptionPPSHeader',
				},
				displayName: {
					text: 'PPS Header',
					key: 'cloud.desktop.moduleDisplayNamePPSHeader',
				},
				iconClass: 'ico-production-planning',
				iconColor: 16777215,
				id: 'productionPlanning.header',
				permissionGuid: '0ef62313a03b435ba0e190d0d4406b1d',
				targetRoute: 'productionplanning/header',
				textColor: 16777215,
				color: 16412672,
				opacity: 0.9,
				tileSize: TileSize.Small,
			},
			{
				id: 'productionplanning.cadimportconfig',
				displayName: {
					text: 'Engineering CAD Import Configuration',
					key: 'cloud.desktop.moduleDisplayNameEngineeringCADImportConfig',
				},
				description: {
					text: 'Management of Engineering CAD Import Configuration',
					key: 'cloud.desktop.moduleDescriptionEngineeringCADImportConfig',
				},
				iconClass: 'ico-engineering-drawing',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/cadimportconfig',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '567a4c2fg6594tft95e7e6c5brgf1f99',
			},
			{
				id: 'productionplanning.ppscostcodes',
				displayName: {
					text: 'PPS Cost Codes Configuration',
					key: 'cloud.desktop.moduleDisplayNamePpsCostCodes',
				},
				description: {
					text: 'PPS Cost Codes',
					key: 'cloud.desktop.moduleDescriptionPpsCostCodes',
				},
				iconClass: 'ico-cost-code',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/ppscostcodes',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '349861891fbb468bbfa0ecd30d4d19e7',
			},
			{
				id: 'productionplanning.engineering',
				displayName: {
					text: 'Engineering Planning',
					key: 'cloud.desktop.moduleDisplayNameEngineering',
				},
				description: {
					text: 'Management of Engineering',
					key: 'cloud.desktop.moduleDescriptionEngineering',
				},
				iconClass: 'ico-engineering-planning',
				color: 16412672,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				targetRoute: 'productionplanning/engineering',
				defaultGroupId: TileGroup.ProductionPlanning,
				permissionGuid: '0ac82031f03841e592a09c1d7ca864e6',
				defaultSorting: 0, //TODO
			},
			{
				id: 'productionplanning.ppsmaterial',
				displayName: {
					text: 'PPS Material Configuration',
					key: 'cloud.desktop.moduleDisplayNamePpsMaterial',
				},
				description: {
					text: 'PPS Material',
					key: 'cloud.desktop.moduleDescriptionPpsMaterial',
				},
				iconClass: 'ico-materials',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/ppsmaterial',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '18765b0bf5f149aaa0d456a1d772044c',
			},
			{
				id: 'productionplanning.cadimport',
				displayName: {
					text: 'Engineering CAD Import',
					key: 'cloud.desktop.moduleDisplayNameEngineeringCADImport',
				},
				description: {
					text: 'Management of Engineering CAD Import',
					key: 'cloud.desktop.moduleDescriptionEngineeringCADImport',
				},
				iconClass: 'ico-engineering-drawing',
				color: 16412672,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'productionplanning/cadimport',
				defaultGroupId: TileGroup.ProductionPlanning,
				defaultSorting: 0, //TODO
				permissionGuid: '887a4c2fg6594tft95e7e6c5brgf1f88',
			},
		];
	}

	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('eventconfiguration', () => import('@libs/productionplanning/eventconfiguration').then((module) => module.ProductionplanningEventconfigurationModule)),
			ContainerModuleRouteInfo.create('formworktype', () => import('@libs/productionplanning/formworktype').then((module) => module.FormworkTypeModule)),
			ContainerModuleRouteInfo.create('strandpattern', () => import('@libs/productionplanning/strandpattern').then((module) => module.ProductionplanningStrandpatternModule)),
			ContainerModuleRouteInfo.create('processconfiguration', () => import('@libs/productionplanning/processconfiguration').then((module) => module.ProductionplanningProcessconfigurationModule)),
			ContainerModuleRouteInfo.create('formulaconfiguration', () => import('@libs/productionplanning/formulaconfiguration').then((module) => module.ProductionplanningFormulaconfigurationModule)),
			ContainerModuleRouteInfo.create('fabricationunit', () => import('@libs/productionplanning/fabricationunit').then((module) => module.ProductionplanningFabricationunitModule)),
			ContainerModuleRouteInfo.create('productionplace', () => import('@libs/productionplanning/productionplace').then((module) => module.ProductionplanningProductionPlaceModule)),
			ContainerModuleRouteInfo.create('drawingtype', () => import('@libs/productionplanning/drawingtype').then((module) => module.ProductionplanningDrawingtypeModule)),
			ContainerModuleRouteInfo.create('drawing', () => import('@libs/productionplanning/drawing').then((module) => module.ProductionplanningDrawingModule)),
			ContainerModuleRouteInfo.create('header', () => import('@libs/productionplanning/header').then((module) => module.ProductionplanningHeaderModule)),
			ContainerModuleRouteInfo.create('product', () => import('@libs/productionplanning/product').then((module) => module.ProductionplanningProductModule)),
			ContainerModuleRouteInfo.create('accounting', () => import('@libs/productionplanning/accounting').then((module) => module.ProductionplanningAccountingModule)),
			ContainerModuleRouteInfo.create('configuration', () => import('@libs/productionplanning/configuration').then((module) => module.ProductionplanningConfigurationModule)),
			ContainerModuleRouteInfo.create('producttemplate', () => import('@libs/productionplanning/product-template').then((module) => module.ProductionplanningProductTemplateModule)),
			ContainerModuleRouteInfo.create('productionset', () => import('@libs/productionplanning/productionset').then((module) => module.ProductionplanningProductionsetModule)),
			ContainerModuleRouteInfo.create('cadimportconfig', () => import('@libs/productionplanning/cadimportconfig').then((module) => module.ProductionplanningCadimportconfigModule)),
			ContainerModuleRouteInfo.create('item', () => import('@libs/productionplanning/item').then((module) => module.PpsItemModule)),
			ContainerModuleRouteInfo.create('ppscostcodes', () => import('@libs/productionplanning/ppscostcodes').then((module) => module.ProductionplanningPpscostcodesModule)),
			ContainerModuleRouteInfo.create('engineering', () => import('@libs/productionplanning/engineering').then((module) => module.ProductionplanningEngineeringModule)),
			ContainerModuleRouteInfo.create('ppsmaterial', () => import('@libs/productionplanning/ppsmaterial').then((module) => module.ProductionplanningPpsmaterialModule)),
			ContainerModuleRouteInfo.create('cadimport', () => import('@libs/productionplanning/cadimport').then((module) => module.ProductionplanningCadimportModule)),
		];
	}

	public override get wizards(): IWizard[] | null {
		return [...PPS_FABRICATIONUNIT_WIZARDS, ...PPS_HEADER_WIZARDS, ...PPS_ITEM_WIZARDS, ...PPS_PRODUCT_WIZARDS, ...PPS_PRODUCT_TEMPLATE_WIZARDS, ...PPS_PRODUCTION_PLACE_WIZARDS, ...DRAWING_WIZARDS, ...ENG_TASK_WIZARDS];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
