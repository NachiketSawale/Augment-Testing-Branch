/*
 * Copyright(c) RIB Software GmbH
 */

import { ModulePreloadInfoBase, TileSize, ITile, LazyInjectableInfo, ISubModuleRouteInfo, TileGroup, IWizard } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { BASICS_MATERIAL_RECORD_WIZARDS } from './wizards/basics-material-wizards';
import { BASICS_COSTCODE_RECORD_WIZARDS } from './wizards/basics-cost-codes-wizards';
import { BASICS_MATERIAL_CATALOG_WIZARDS } from './wizards/basics-material-catalog-wizards';
import { BASICS_CLERK_WIZARDS } from './wizards/basics-clerk-wizards';
import { BASICS_COSTGROUPS_WIZARDS } from './wizards/basics-costgroups-wizards';
import { BASICS_PAYMENT_WIZARDS } from './wizards/basics-payment-wizard';
import { BASICS_PROCUREMENT_STRUCTURE_WIZARDS } from './wizards/basics-procurement-struture-wizards';
import { BASICS_ACCOUNTINGJOURNALS_WIZARDS } from './wizards/basics-accountingjournals-wizard';
import { BASICS_MEETING_WIZARDS } from './wizards/basics-meeting-wizard';
import { BASICS_CONTROLLING_COSTCODES_WIZARDS } from './wizards/basics-controlling-costcodes-wizards';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { BASICS_SHARED_WIZARDS } from './wizards/basics-shared-wizards';
import { BASICS_USER_FORM_WIZARD } from './wizards/basics-user-form-wizard';
import { BASICS_ASSET_MASTER_WIZARDS } from './wizards/basics-asset-master-wizards';
import { BASICS_EFB_SHEETS_WIZARDS } from './wizards/basics-efb-sheets-wizards';
import { BASICS_SITE_WIZARDS } from './wizards/basics-site-wizards';

export class BasicsPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new BasicsPreloadInfo();

	private constructor() {
		super();
	}
	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'basics';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'basics.bank',
				displayName: {
					text: 'Bank',
					key: 'cloud.desktop.moduleDisplayNameBank',
				},
				description: {
					text: 'Bank Description',
					key: 'cloud.desktop.moduleDescriptionBank',
				},
				iconClass: 'ico-bank',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/bank',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 3,
				permissionGuid: 'e4a7184d67b841a1ac2f93fcc3488639',
			},
			{
				id: 'basics.characteristic',
				displayName: {
					text: 'Characteristics',
					key: 'cloud.desktop.moduleDisplayNameCharacteristics',
				},
				description: {
					text: 'Characteristics',
					key: 'cloud.desktop.moduleDescriptionCharacteristics',
				},
				iconClass: 'ico-characteristics',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/characteristic',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 3,
				permissionGuid: 'd27483e8750c47d1aa5884781ee8fa3d',
			},
			{
				id: 'basics.country',
				displayName: {
					text: 'Country',
					key: 'cloud.desktop.moduleDisplayNameCountry',
				},
				description: {
					text: 'undefined',
					key: 'cloud.desktop.moduleDescriptionCountry',
				},
				iconClass: 'ico-country',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/country',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 8,
				permissionGuid: '52f70e3fdf1841ea9879320cf234c44f',
			},
			{
				id: 'basics.currency',
				displayName: {
					text: 'Currency',
					key: 'cloud.desktop.moduleDisplayNameCurrency',
				},
				description: {
					text: 'Currency',
					key: 'cloud.desktop.moduleDescriptionCurrency',
				},
				iconClass: 'ico-currency',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/currency',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '7c6f4744c1ee4ea3ae6d08c5727f5bdc',
			},
			{
				id: 'basics.customize',
				displayName: {
					text: 'Customize',
					key: 'cloud.desktop.moduleDisplayNameCustomize',
				},
				description: {
					text: 'Customize',
					key: 'cloud.desktop.moduleDescriptionCustomize',
				},
				iconClass: 'ico-settings',
				color: 13293612,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 1,
				targetRoute: 'basics/customize',
				defaultGroupId: TileGroup.Administration,
				defaultSorting: 1, //TODO
				permissionGuid: '2db0979705f644d094ef583c6692b90d',
			},
			{
				id: 'basics.regioncatalog',
				displayName: {
					text: 'Region Catalog',
					key: 'cloud.desktop.moduleDisplayNameRegionCatalog',
				},
				description: {
					text: 'Sample description',
					key: 'cloud.desktop.moduleDescriptionRegionCatalog',
				},
				iconClass: 'ico-intrastat',
				color: 0x1d6395,
				opacity: 0.9,
				textColor: 0xffffff,
				iconColor: 0xffffff,
				tileSize: TileSize.Small,
				targetRoute: 'basics/regioncatalog',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '501d37a0f2ee41fd8c296c2182c6ad34',
			},
			{
				id: 'basics.unit',
				displayName: {
					text: 'Unit',
					key: 'cloud.desktop.moduleDisplayNameBasicsUnit',
				},
				description: {
					text: 'undefined',
					key: 'cloud.desktop.moduleDescriptionBasicsUnit',
				},
				iconClass: 'ico-uom',
				color: 2974255,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/unit',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 1,
				permissionGuid: '681758b1a94e44609a3ca62509dc0491',
			},
			{
				id: 'basics.materialcatalog',
				displayName: {
					text: 'Material Catalog',
					key: 'cloud.desktop.moduleDisplayNameMaterialCatalog',
				},
				description: {
					text: 'Material Catalog',
					key: 'cloud.desktop.moduleDescriptionMaterialCatalog',
				},
				iconClass: 'ico-material-catalog',
				color: 2722769,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				defaultSorting: 13,
				defaultGroupId: TileGroup.MasterData,
				permissionGuid: 'e854b975da4b438e8212516f353f64e4',
				targetRoute: 'basics/materialcatalog',
			},
			{
				id: 'basics.efbsheets',
				displayName: {
					text: 'Crew Mixes',
					key: 'cloud.desktop.moduleDisplayNameCrewMixes',
				},
				description: {
					text: 'Crew Mixes',
					key: 'cloud.desktop.moduleDescriptionCrewMixes',
				},
				iconClass: 'ico-crew-mix',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				defaultSorting: 13,
				defaultGroupId: TileGroup.MasterData,
				permissionGuid: '056a4c28865949ee95e7e6c5bf4f1f79',
				targetRoute: 'basics/efbsheets',
			},
			{
				id: 'basics.userform',
				displayName: {
					text: 'User Forms',
					key: 'cloud.desktop.moduleDisplayNameUserForm',
				},
				description: {
					text: 'Userform management',
					key: 'cloud.desktop.moduleDescriptionUserForm',
				},
				iconClass: 'ico-user-form',
				color: 7897368,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/userform',
				defaultGroupId: TileGroup.Administration,
				defaultSorting: 4,
				permissionGuid: '64611368db794ed1a0047d9c6c0eca88',
			},
			{
				id: 'basics.clerk',
				displayName: {
					text: 'Clerk',
					key: 'cloud.desktop.moduleDisplayNameClerk',
				},
				description: {
					text: 'Clerk',
					key: 'cloud.desktop.moduleDescriptionClerk',
				},
				iconClass: 'ico-clerk',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/clerk',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 13, //TODO
				permissionGuid: 'aba34b20bb054800b72587b7a9102e4e',
			},
			{
				id: 'basics.taxcode',
				displayName: {
					text: 'Tax Code',
					key: 'cloud.desktop.moduleDisplayNameBasicsTaxCode',
				},
				description: {
					text: 'Tax Code',
					key: 'cloud.desktop.moduleDisplayNameBasicsTaxCode',
				},
				iconClass: 'ico-exchange-rates',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/taxcode',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '3fe7cda183db41fb941075e2c5ad0a0a',
			},
			{
				id: 'basics.textmodules',
				displayName: {
					text: 'Text Modules',
					key: 'cloud.desktop.moduleDisplayNameTextModules',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionTextModules',
				},
				iconClass: 'ico-text-module',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/textmodules',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 11, //TODO
				permissionGuid: '38ee427ff11743f6b99fb68e5fee5c08',
			},
			{
				id: 'basics.pricecondition',
				displayName: {
					text: 'Price Condition',
					key: 'cloud.desktop.moduleDisplayNamePriceCondition',
				},
				description: {
					text: 'Price Condition',
					key: 'cloud.desktop.moduleDisplayNamePriceCondition',
				},
				iconClass: 'ico-price-condition',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/pricecondition',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '23b9cf402de548b98b4dde5a91baec6e',
			},
			{
				id: 'basics.salestaxcode',
				displayName: {
					text: 'US Sales Tax Code',
					key: 'cloud.desktop.moduleDisplayNameBasicsSalesTaxCode',
				},
				description: {
					text: 'US Sales Tax Code',
					key: 'cloud.desktop.moduleDisplayNameBasicsSalesTaxCode',
				},
				iconClass: 'ico-exchange-rates',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/salestaxcode',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '54e7eabc824e4992b4306e2c82fc1e60',
			},
			{
				id: 'basics.payment',
				displayName: {
					text: 'Payment Term',
					key: 'cloud.desktop.moduleDisplayNamePayment',
				},
				description: {
					text: 'Payment Term',
					key: 'cloud.desktop.moduleDescriptionPayment',
				},
				iconClass: 'ico-payment',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/payment',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 13, //TODO
				permissionGuid: '11bd9012f92d4ec481f34f4bbf210b09',
			},
			{
				id: 'basics.procurementstructure',
				displayName: {
					text: 'Procurement Structure',
					key: 'cloud.desktop.moduleDisplayNameProcurementStructure',
				},
				description: {
					text: 'Procurement Structure',
					key: 'cloud.desktop.moduleDescriptionProcurementStructure',
				},
				iconClass: 'ico-procurement-structure',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/procurementstructure',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '07088579414b404d808e6444c3bf68ae',
			},
			{
				id: 'basics.site',
				displayName: {
					text: 'Site',
					key: 'cloud.desktop.moduleDisplayNameSite',
				},
				description: {
					text: 'Site',
					key: 'cloud.desktop.moduleDescriptionSite',
				},
				iconClass: 'ico-site',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/site',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 13, //TODO
				permissionGuid: '4e83b1918fbe406b849f5416640b85f0',
			},
			{
				id: 'basics.procurementconfiguration',
				displayName: {
					text: 'Procurement Configuration',
					key: 'cloud.desktop.moduleDisplayNameProcurementConfiguration',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionProcurementConfiguration',
				},
				iconClass: 'ico-procurement-config',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'basics/procurementconfiguration',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '0f25a37d3fbd4de5a3231b03745c5568',
			},
			{
				id: 'basics.material',
				displayName: {
					text: 'Material',
					key: 'cloud.desktop.moduleDisplayNameMaterial',
				},
				description: {
					text: 'Material Catalogues',
					key: 'cloud.desktop.moduleDescriptionMaterial',
				},
				iconClass: 'ico-materials',
				color: 5223853,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/material',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'aaf74523d08849eb9752a842bec64827',
			},
			{
				id: 'basics.costgroups',
				displayName: {
					text: 'Cost Groups',
					key: 'cloud.desktop.moduleDisplayNameCostGroup',
				},
				description: {
					text: 'Management of Cost Groups',
					key: 'cloud.desktop.moduleDescriptionCostGroup',
				},
				iconClass: 'ico-cost-groups',
				color: 2722769,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/costgroups',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '010407874c604f93a56fd5a74c1301b7',
			},
			{
				id: 'basics.accountingjournals',
				displayName: {
					text: 'Accounting Journals',
					key: 'cloud.desktop.moduleDisplayNameAccountingJournals',
				},
				description: {
					text: 'Accounting Journals',
					key: 'cloud.desktop.moduleDisplayNameAccountingJournals',
				},
				iconClass: 'ico-accounting-journals',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/accountingjournals',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 13, //TODO
				permissionGuid: '80bf361a76424e52914f69f6f361a235',
			},
			{
				id: 'basics.costcodes',
				displayName: {
					text: 'Cost Codes',
					key: 'cloud.desktop.moduleDisplayNameCostCodes',
				},
				description: {
					text: 'Cost Codes',
					key: 'cloud.desktop.moduleDescriptionCostCodes',
				},
				iconClass: 'ico-cost-code',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/costcodes',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'bc718ba652174a7a91b4938b68adaf13',
			},
			{
				id: 'basics.indextable',
				displayName: {
					text: 'Index Table',
					key: 'cloud.desktop.moduleDisplayNameIndexTable',
				},
				description: {
					text: 'Index Table',
					key: 'cloud.desktop.moduleDescriptionIndexTable',
				},
				iconClass: 'ico-index-tables',
				color: 2974255,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/indextable',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '531eb2aoca9a4f62b23e009972ce42dd',
			},
			{
				id: 'basics.controllingcostcodes',
				displayName: {
					text: 'Controlling Cost Codes',
					key: 'cloud.desktop.moduleDisplayNameControllingCostCodes',
				},
				description: {
					text: 'Controlling Cost Codes',
					key: 'cloud.desktop.moduleDescriptionControllingCostCodes',
				},
				iconClass: 'ico-controlling-cost-codes',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/controllingcostcodes',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'ddb4bd318aa54578ad76d6fb3d158052',
			},
			{
				id: 'basics.config',
				displayName: {
					text: 'Modules',
					key: 'cloud.desktop.moduleDisplayNameBasicsConfig',
				},
				description: {
					text: 'Config.',
					key: 'cloud.desktop.moduleDescriptionBasicsConfig',
				},
				iconClass: 'ico-module-config',
				color: 2974255,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/config',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'f279ae369f424a88917fb4684f3cbf74',
			},
			{
				id: 'basics.meeting',
				displayName: {
					text: 'Meeting Management',
					key: 'cloud.desktop.moduleDisplayNameMeeting',
				},
				description: {
					text: 'Meeting Management',
					key: 'cloud.desktop.moduleDescriptionMeeting',
				},
				iconClass: 'ico-meeting-management',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/meeting',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'ffeaf204a62c47da832beeeb270de9c5',
			},
			{
				id: 'basics.company',
				displayName: {
					text: 'Company',
					key: 'cloud.desktop.moduleDisplayNameCompany',
				},
				description: {
					text: 'Company Structure',
					key: 'cloud.desktop.moduleDescriptionCompany',
				},
				iconClass: 'ico-company-structure',
				color: 2722769,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'basics/company',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 13, //TODO
				permissionGuid: 'c64625fa8ae3452a9c6fea373b835d67',
			},
			{
				id: 'basics.biplusdesigner',
				displayName: {
					text: 'BI+ Designer',
					key: 'cloud.desktop.moduleDisplayNameBIPlusDesigner',
				},
				description: {
					text: 'BI+ Dashboard Designer',
					key: 'cloud.desktop.moduleDescriptionNameBIPlusDesigner',
				},
				iconClass: 'ico-power-bi-data-explorer',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/biplusdesigner',
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 0, //TODO
				permissionGuid: 'ff2e490705544d2384a4d7b0f27f8bed',
			},
			{
				id: 'basics.assetmaster',
				displayName: {
					text: 'Asset Master',
					key: 'cloud.desktop.moduleDisplayNameAssetMaster',
				},
				description: {
					text: 'Asset Master',
					key: 'cloud.desktop.moduleDescriptionAssetMaster',
				},
				iconClass: 'ico-asset-master',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/assetmaster',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '812a5a9ee1834fb6930f2a70a4475e8e',
			},
			{
				id: 'basics.billingschema',
				displayName: {
					text: 'Billing Schema',
					key: 'cloud.desktop.moduleDisplayNameBillingSchema',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionBillingSchema',
				},
				iconClass: 'ico-billing-schema',
				color: 5221202,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/billingschema',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: 'd4d4f2ae2a09429589309fa03484b066',
			},
			{
				id: 'basics.reporting',
				displayName: {
					text: 'Reporting',
					key: 'cloud.desktop.moduleDisplayNameBasicsReporting',
				},
				description: {
					text: 'Config.',
					key: 'cloud.desktop.moduleDescriptionBasicsReporting',
				},
				iconClass: 'ico-report-config',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/reporting',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '55bfcf00f12f4b8c975903da1fb9ea86',
			},
			{
				id: 'basics.dependentdata',
				displayName: {
					text: 'User Container',
					key: 'cloud.desktop.moduleDisplayNameDependentData',
				},
				description: {
					text: 'Usercontainer management',
					key: 'cloud.desktop.moduleDescriptionDependentData',
				},
				iconClass: 'ico-user-container',
				color: 11648547,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'basics/dependentdata',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '1d04ea97c00e47c3b9610cb03e40f3b5',
			},
		];
	}

	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 * @protected
	 *
	 * @return {Array<ISubModuleRouteInfo>} An array of objects that provides some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('bank', () => import('@libs/basics/bank').then((module) => module.BasicsBankModule)),
			ContainerModuleRouteInfo.create('characteristic', () => import('@libs/basics/characteristic').then((module) => module.BasicsCharacteristicModule)),
			ContainerModuleRouteInfo.create('clerk', () => import('@libs/basics/clerk').then((module) => module.BasicsClerkModule)),
			ContainerModuleRouteInfo.create('country', () => import('@libs/basics/country').then((module) => module.BasicsCountryModule)),
			ContainerModuleRouteInfo.create('currency', () => import('@libs/basics/currency').then((module) => module.BasicsCurrencyModule)),
			ContainerModuleRouteInfo.create('customize', () => import('@libs/basics/customize').then((module) => module.BasicsCustomizeModule)),
			ContainerModuleRouteInfo.create('efbsheets', () => import('@libs/basics/efbsheets').then((module) => module.ModulesBasicsEfbsheetsModule)),
			ContainerModuleRouteInfo.create('materialcatalog', () => import('@libs/basics/materialcatalog').then((module) => module.BasicsMaterialcatalogModule)),
			ContainerModuleRouteInfo.create('regioncatalog', () => import('@libs/basics/regioncatalog').then((module) => module.BasicsRegionCatalogModule)),
			ContainerModuleRouteInfo.create('taxcode', () => import('@libs/basics/taxcode').then((module) => module.BasicsTaxCodeModule)),
			ContainerModuleRouteInfo.create('unit', () => import('@libs/basics/unit').then((module) => module.BasicsUnitModule)),
			ContainerModuleRouteInfo.create('userform', () => import('@libs/basics/userform').then((module) => module.BasicsUserformModule)),
			ContainerModuleRouteInfo.create('payment', () => import('@libs/basics/payment').then((module) => module.ModulesBasicsPaymentModule)),
			ContainerModuleRouteInfo.create('site', () => import('@libs/basics/site').then((module) => module.BasicsSiteModule)),
			ContainerModuleRouteInfo.create('procurementstructure', () => import('@libs/basics/procurementstructure').then((module) => module.BasicsProcurementstructureModule)),
			ContainerModuleRouteInfo.create('procurementconfiguration', () => import('@libs/basics/procurementconfiguration').then((module) => module.BasicsProcurementconfigurationModule)),
			ContainerModuleRouteInfo.create('material', () => import('@libs/basics/material').then((module) => module.BasicsMaterialModule)),
			ContainerModuleRouteInfo.create('pricecondition', () => import('@libs/basics/pricecondition').then((module) => module.BasicsPriceConditionModule)),
			ContainerModuleRouteInfo.create('salestaxcode', () => import('@libs/basics/salestaxcode').then((module) => module.BasicsSalestaxcodeModule)),
			ContainerModuleRouteInfo.create('costgroups', () => import('@libs/basics/costgroups').then((module) => module.BasicsCostgroupsModule)),
			ContainerModuleRouteInfo.create('textmodules', () => import('@libs/basics/textmodules').then((module) => module.BasicsTextModulesModule)),
			ContainerModuleRouteInfo.create('accountingjournals', () => import('@libs/basics/accountingjournals').then((module) => module.ModulesAccountingJournalsModule)),
			ContainerModuleRouteInfo.create('costcodes', () => import('@libs/basics/costcodes').then((module) => module.BasicsCostcodesModule)),
			ContainerModuleRouteInfo.create('controllingcostcodes', () => import('@libs/basics/controllingcostcodes').then((module) => module.BasicsControllingcostcodesModule)),
			ContainerModuleRouteInfo.create('indextable', () => import('@libs/basics/indextable').then((module) => module.BasicsIndextableModule)),
			ContainerModuleRouteInfo.create('config', () => import('@libs/basics/config').then((module) => module.BasicsConfigModule)),
			ContainerModuleRouteInfo.create('meeting', () => import('@libs/basics/meeting').then((module) => module.BasicsMeetingModule)),
			ContainerModuleRouteInfo.create('company', () => import('@libs/basics/company').then((module) => module.BasicsCompanyModule)),
			ContainerModuleRouteInfo.create('biplusdesigner', () => import('@libs/basics/biplusdesigner').then((module) => module.BasicsBiplusdesignerModule)),
			ContainerModuleRouteInfo.create('billingschema', () => import('@libs/basics/billingschema').then((module) => module.BasicsBillingschemaModule)),
			ContainerModuleRouteInfo.create('assetmaster', () => import('@libs/basics/assetmaster').then((module) => module.BasicsAssetmasterModule)),
			ContainerModuleRouteInfo.create('reporting', () => import('@libs/basics/reporting').then((module) => module.BasicsReportingModule)),
			ContainerModuleRouteInfo.create('dependentdata', () => import('@libs/basics/dependentdata').then((module) => module.BasicsDependentdataModule)),
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			...BASICS_SHARED_WIZARDS,
			...BASICS_SITE_WIZARDS,
			...BASICS_MATERIAL_RECORD_WIZARDS,
			...BASICS_CONTROLLING_COSTCODES_WIZARDS,
			...BASICS_COSTGROUPS_WIZARDS,
			...BASICS_COSTCODE_RECORD_WIZARDS,
			...BASICS_MATERIAL_CATALOG_WIZARDS,
			...BASICS_CLERK_WIZARDS,
			...BASICS_PAYMENT_WIZARDS,
			...BASICS_PROCUREMENT_STRUCTURE_WIZARDS,
			...BASICS_ACCOUNTINGJOURNALS_WIZARDS,
			...BASICS_MEETING_WIZARDS,
			...BASICS_USER_FORM_WIZARD,
			...BASICS_ASSET_MASTER_WIZARDS,
			...BASICS_EFB_SHEETS_WIZARDS,
		];
	}
}
