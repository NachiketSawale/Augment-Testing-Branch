/*
 * Copyright(c) RIB Software GmbH
 */

import { ModulePreloadInfoBase, ITile, ISubModuleRouteInfo, TileGroup, IWizard, TileSize, LazyInjectableInfo } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';

export class ResourcePreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new ResourcePreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */

	public override get internalModuleName(): string {
		return 'resource';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'resource.maintenance',
				displayName: {
					text: 'Resource Maintenance',
					key: 'cloud.desktop.moduleDisplayNameResourceMaintenance'
				},
				description: {
					text: 'Resource Maintenance',
					key: 'cloud.desktop.moduleDescritptionNameResourceMaintenance'
				},
				iconClass: 'ico-plant-maintenance',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'resource/maintenance',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 1,
				permissionGuid: 'd820ac399b2e4f58b9b4701a4d40b763'
			},
			{
				id: 'resource.equipmentgroup',
				displayName: {
					text: 'Resource Equipment Group',
					key: 'cloud.desktop.moduleDisplayNameResourceEquipmentGroup',
				},
				description: {
					text: 'Resource Equipment Group',
					key: 'cloud.desktop.moduleDescritptionNameResourceEquipmentGroup',
				},
				iconClass: 'ico-resource-groups',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'resource/equipmentgroup',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 14,
				permissionGuid: '76daddc726e748919ce8916dd276e94d',
			},
			/*{
				id: 'resource.project',
				tileSize: TileSize.Small,
				color: 30694,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: 'Programs',
				iconClass: 'ico-resource-planning-project',
				iconColor: 16777215,
				defaultSorting: 14,
				displayName: {
					text: 'Project Resources',
					key: 'cloud.desktop.moduleDisplayNameResourceProject',
				},
				description: {
					text: 'Project Resource Planning',
					key: 'cloud.desktop.moduleDescriptionResourceProject',
				},
				permissionGuid: '38553ac40e454ba187b981d4ac3cb1a6',
				targetRoute: 'resource/project',
			},
			{
				id: 'resource.requisition',
				displayName: {
					text: 'Resource Requisition',
					key: 'cloud.desktop.moduleDisplayNameResourceResquisition',
				},
				description: {
					text: 'Resource Requisition',
					key: 'cloud.desktop.moduleDescriptionNameResourceRequisition',
				},
				iconClass: 'ico-resource-requisition',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultGroupId: 'Enterprise',
				defaultSorting: 14,
				permissionGuid: '5e1a7dc05b224d8da233c03e75e544fc',
				targetRoute: 'resource/requisition',
			},
			{
				id: 'resource.reservation',
				displayName: {
					text: 'Resource Reservation',
					key: 'cloud.desktop.moduleDisplayNameResourceReservation',
				},
				description: {
					text: 'Resource Reservation',
					key: 'cloud.desktop.moduleDescriptionNameResourceReservation',
				},
				iconClass: 'ico-resource-reservation',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultGroupId: 'Enterprise',
				defaultSorting: 14,
				permissionGuid: '0ada2a549118479e81d1280411210ef5',
				targetRoute: 'modules/resource/reservation',
			},
			{
				id: 'resource.enterprise',
				displayName: {
					text: 'Enterprise Resources',
					key: 'cloud.desktop.moduleDisplayNameResourceEnterprise',
				},
				description: {
					text: 'Enterprise Resource Planning',
					key: 'cloud.desktop.moduleDescriptionResourceEnterprise',
				},
				iconClass: 'ico-resource-planning-enterprise',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultGroupId: 'Enterprise',
				defaultSorting: 14,
				permissionGuid: '123e3c226f584fdcb4605e768863a5bd',
				targetRoute: 'resource/enterprise',
			}*/
			{
				id: 'resource.master',
				displayName: {
					text: 'Resource Master',
					key: 'cloud.desktop.moduleDisplayNameResourceMaster'
				},
				description: {
					text: 'Resource Master',
					key: 'cloud.desktop.moduleDescritptionNameResourceMaster'
				},
				iconClass: 'ico-resource-master',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'resource/master',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0,
				permissionGuid: 'f8a1f03c295543cd9991b66e1015befb'
			},
			{
				id: 'resource.certificate',
				displayName: {
					text: 'Plant Certificate',
					key: 'cloud.desktop.moduleDisplayNamePlantCertificate',
				},
				description: {
					text: 'Management of Plant Certificates',
					key: 'cloud.desktop.moduleDescriptionPlantCertificate',
				},

				iconClass: 'ico-plant-certificate',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 14,
				defaultGroupId: TileGroup.MasterData,
				permissionGuid: '6d0a845d35cb4f1bb53673faf7fcd19f',
				targetRoute: 'resource/certificate',
			},
			{
				id: 'resource.equipment',
				displayName: {
					text: 'Equipment',
					key: 'cloud.desktop.moduleDisplayNameEquipment',
				},
				description: {
					text: 'Management of Equipment',
					key: 'cloud.desktop.moduleDescriptionEquipment',
				},
				iconClass: 'ico-equipment',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 14,
				defaultGroupId: TileGroup.MasterData,
				permissionGuid: '82ccb2ab0fd2440cb79c681d2cd2a836',
				targetRoute: 'resource/equipment',
			},
			{
				id: 'resource.skill',
				displayName: {
					text: 'Resource Skills',
					key: 'cloud.desktop.moduleDisplayNameResourceSkill',
				},
				description: {
					text: 'Resource Skills',
					key: 'cloud.desktop.moduleDescritptionNameResourceSkill',
				},
				iconClass: 'ico-resource-skills',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'resource/skill',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 14,
				permissionGuid: 'b72582db375e4d989608f17cfa1faba5',
			},
			{
				id: 'resource.types',
				displayName: {
					text: 'Resource Types',
					key: 'cloud.desktop.moduleDisplayNameResourcesTypes',
				},
				description: {
					text: 'Resource Types',
					key: 'cloud.desktop.moduleDescriptionResourcesTypes',
				},
				iconClass: 'ico-resource-type',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 14,
				defaultGroupId: TileGroup.MasterDataSecond,
				permissionGuid: 'ba252818f017489e8ebd74a570719937',
				targetRoute: 'resource/type',
			},
			{
				id: 'resource.catalog',
				displayName: {
					text: 'Equipment Catalogs',
					key: 'cloud.desktop.moduleDisplayNameEquipmentCatalogs',
				},
				description: {
					text: 'Equipment Catalogs',
					key: 'cloud.desktop.moduleDescriptionEquipmentCatalogs',
				},
				iconClass: 'ico-equipment-catalog',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 14,
				defaultGroupId: TileGroup.MasterData,
				permissionGuid: '02f1873d797e4979a1f0a2cbfbfc6109',
				targetRoute: 'resource/catalog',
			},
			{
				id: 'resource.plantpricing',
				displayName: {
					text: 'Resource Plant Pricing',
					key: 'cloud.desktop.moduleDisplayNameResourcePlantpricing',
				},
				description: {
					text: 'Resource Plant Pricing',
					key: 'cloud.desktop.moduleDescriptionResourcePlantpricing',
				},
				iconClass: 'ico-plant-pricing',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'resource/plantpricing',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '9c41ae3634e84e36b40c5fd3deea1ce8',
			},

			{
				id: 'resource.componenttype',
				displayName: {
					text: 'Plant Component Type',
					key: 'cloud.desktop.moduleDisplayNamePlantComponentType',
				},
				description: {
					text: 'Plant Component Type',
					key: 'cloud.desktop.moduleDescriptionPlantComponentType',
				},
				iconClass: 'ico-component-types',
				color: 13293612,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'resource/componenttype',
				defaultGroupId: TileGroup.Administration,
				defaultSorting: 0,
				permissionGuid: '02f1873d797e4979a1f0a2cbfbfc6109',
			},
			{
				id: 'resource.wot',
				displayName: {
					text: 'Work Operation Types',
					key: 'cloud.desktop.moduleDisplayNameWorkOperationTypes',
				},
				description: {
					text: 'Work Operation Types',
					key: 'cloud.desktop.moduleDescriptionWorkOperationTypes',
				},
				iconClass: 'ico-plant-operationtype',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				defaultSorting: 0,
				defaultGroupId: TileGroup.MasterData,
				permissionGuid: '5ceec8a702b94068b0db3a453fe824b9',
				targetRoute: 'resource/wot',
			},
			{
				id: 'resource.requisition',
				displayName: {
					text: 'Resource Requisition',
					key: 'cloud.desktop.moduleDisplayNameResourceResquisition',
				},
				description: {
					text: 'Resource Requisition',
					key: 'cloud.desktop.moduleDescriptionNameResourceRequisition',
				},
				iconClass: 'ico-resource-requisition',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'resource/requisition',
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 0, //TODO
				permissionGuid: '5e1a7dc05b224d8da233c03e75e544fc',
			},

			/*{
				id: 'resource.maintenance',
				displayName: {
					text: 'Plant Maintenance Schemes',
					key: 'cloud.desktop.moduleDisplayNameResourceMaintenance',
				},
				description: {
					text: 'Plant Maintenance Schemes',
					key: 'cloud.desktop.moduleDescriptionResourceMaintenance',
				},
				iconClass: 'ico-plant-maintenance',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 14,
				defaultGroupId: 'Master Data Second',
				permissionGuid: 'd820ac399b2e4f58b9b4701a4d40b763',
				targetRoute: 'resource/maintenance',
			},
			{
				id: 'resource.equipmentgroup',
				displayName: {
					text: 'Equipment Group',
					key: 'cloud.desktop.moduleDisplayNameEquipmentGroup',
				},
				description: {
					text: 'Management of Equipment',
					key: 'cloud.desktop.moduleDescriptionEquipmentGroup',
				},
				iconClass: 'ico-resource-groups',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 14,
				defaultGroupId: 'Configuration',
				permissionGuid: '76daddc726e748919ce8916dd276e94d',
				targetRoute: 'resource/equipmentgroup',
			},
			{
				id: 'resource.componenttype',
				displayName: {
					text: 'Plant Component Type',
					key: 'cloud.desktop.moduleDisplayNamePlantComponentType',
				},
				description: {
					text: 'Plant Component Type',
					key: 'cloud.desktop.moduleDescriptionPlantComponentType',
				},
				iconClass: 'ico-component-types',
				color: 13293612,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 14,
				defaultGroupId: 'Administration',
				permissionGuid: '02f1873d797e4979a1f0a2cbfbfc6109',
				targetRoute: 'resource/componenttype',
			},*/
		];
	}

	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('master', () => import('@libs/resource/master').then((module) => module.ResourceMasterModule)),
			ContainerModuleRouteInfo.create('maintenance', () => import('@libs/resource/maintenance').then((module) => module.ResourceMaintenanceModule)),
			ContainerModuleRouteInfo.create('equipmentgroup', () => import('@libs/resource/equipmentgroup').then((module) => module.ResourceEquipmentGroupModule)),
			ContainerModuleRouteInfo.create('skill', () => import('@libs/resource/skill').then((module) => module.ResourceSkillModule)),
			ContainerModuleRouteInfo.create('catalog', () => import('@libs/resource/catalog').then((module) => module.ResourceCatalogModule)),
			ContainerModuleRouteInfo.create('equipment', () => import('@libs/resource/equipment').then((module) => module.ResourceEquipmentModule)),
			ContainerModuleRouteInfo.create('type', () => import('@libs/resource/type').then((module) => module.ResourceTypeModule)),
			ContainerModuleRouteInfo.create('componenttype', () => import('@libs/resource/componenttype').then((module) => module.ResourceComponenttypeModule)),
			ContainerModuleRouteInfo.create('plantpricing', () => import('@libs/resource/plantpricing').then((module) => module.ResourcePlantpricingModule)),
			ContainerModuleRouteInfo.create('certificate', () => import('@libs/resource/certificate').then((module) => module.ResourceCertificateModule)),
			ContainerModuleRouteInfo.create('wot', () => import('@libs/resource/wot').then((module) => module.ResourceWotModule)),
			ContainerModuleRouteInfo.create('requisition', () => import('@libs/resource/requisition').then((module) => module.ResourceRequisitionModule)),
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: '35c498f4be29422d8d4276022ee6945d',
				name: 'disablePlant',
				execute: (context) => {
					return import('@libs/resource/equipment').then((module) => new module.ResourceEquipmentWizard().equipmentDisableWizard(context));
				},
			},
			{
				uuid: 'cb81b18aafbe4faeac4d1eb06040a0b4',
				name: 'enablePlant',
				execute: (context) => {
					return import('@libs/resource/equipment').then((module) => new module.ResourceEquipmentWizard().equipmentEnableWizard(context));
				},
			},
			{
				uuid: '54d4d0a726ab46899ce0c6a29698378b',
				name: 'changeCertificateStatus',
				execute: (context) => {
					return import('@libs/resource/certificate').then((module) => new module.ResourceCertificateWizard().changeCertificateStatus(context));
				},
			},
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
}
