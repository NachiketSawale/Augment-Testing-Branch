/*
 * $Id: module-info-service.js 629616 2021-03-25 02:09:37Z wui $
 * Copyright (c) RIB Software GmbH
 */

/**
 * Created by balkanci on 17.03.2015.
 *
 * @name platform.platformModuleInfoService
 * @function
 * @description Service for getting infos for a specific app-module
 */
angular.module('platform').service('platformModuleInfoService', ['$translate', 'cloudDesktopTilesConfig', '_',
	function ($translate, cloudDesktopTilesConfig, _) {

		'use strict';

		let module2ModuleInfo = {
			modules: {
				'cloud.uom': {ico: 'uom', name: 'CloudUoM'},
				'basics.characteristic': {ico: 'characteristics', name: 'Characteristics'},
				'basics.clerk': {ico: 'clerk', name: 'Clerk'},
				'basics.company': {ico: 'company-structure', name: 'Company'},
				'basics.costcodes': {ico: 'cost-code', name: 'CostCodes'},
				'basics.unit': {ico: 'uom', name: 'Unit'},
				'basics.material': {ico: 'materials', name: 'Material'},
				'basics.materialcatalog': {ico: 'materials', name: 'MaterialCatalog'},
				'basics.procurementstructure': {ico: 'procurement-structure', name: 'ProcurementStructure'},
				'basics.procurementconfiguration': {ico: 'procurement-config', name: 'ProcurementConfiguration'},
				'basics.priceCondition': {ico: 'price-condition', name: 'PriceCondition'},
				'basics.assetmaster': {ico: 'asset-master', name: 'AssetMaster'},
				'basics.billingschema': {ico: 'billing-schema', name: 'BillingSchema'},
				'basics.site': {ico: 'site', name: 'Site'},
				'basics.meeting': {ico: 'meeting-management', name: 'Meeting'},
				'boq.main': {ico: 'boq', name: 'BoqMain'},
				'businesspartner.main': {ico: 'business-partner', name: 'BusinessPartner'},
				'businesspartner.certificate': {ico: 'certificate', name: 'Certificate'},
				'businesspartner.evaluationschema': {ico: 'bp-evaluation', name: 'EvaluationSchema'},
				'constructionsystem.main': {ico: 'construction-system', name: 'ConstructionSystemInstance'},
				'constructionsystem.master': {ico: 'construction-system-master', name: 'ConstructionSystemMaster'},
				'change.main': {ico: 'change', name: 'ChangeMain'},
				'defect.main': {ico: 'defect-main', name: 'Defect'},
				'hsqe.checklist': {ico: 'checklist', name: 'CheckList'},
				'hsqe.checklisttemplate': {ico: 'checklist-template', name: 'CheckListTemplate'},
				'estimate.main': {ico: 'estimate', name: 'Estimate'},
				'logistic.dispatching': {ico: 'dispatching', name: 'LogisticDispatching'},
				'logistic.job': {ico: 'logistic-job', name: 'LogisticJob'},
				'model.main': {ico: 'model', name: 'Model'},
				'model.changeset': {ico: 'model', name: 'ModelChangeSet'},
				'model.change': {ico: 'model', name: 'ModelChange'},
				'resource.certificate': {ico: 'plant', name: 'PlantCertificate'},
				'procurement.package': {ico: 'package', name: 'Package'},
				'procurement.requisition': {ico: 'requisition', name: 'Requisition'},
				'procurement.contract': {ico: 'contracts', name: 'Contract'},
				'procurement.quote': {ico: 'quote', name: 'Quote'},
				'procurement.rfq': {ico: 'rfq', name: 'RfQ'},
				'procurement.pes': {ico: 'pes', name: 'PerformanceEntrySheet'},
				'procurement.invoice': {ico: 'invoice', name: 'Invoice'},
				'procurement.pricecomparison': {ico: 'price-comparison', name: 'PriceComparison'},
				'project.main': {ico: 'project', name: 'ProjectMain'},
				'sales.bid': {ico: 'sales-bid', name: 'Bid'},
				'sales.contract': {ico: 'sales-contract', name: 'SalesContract'},
				'sales.wip': {ico: 'sales-wip', name: 'Wip'},
				'sales.billing': {ico: 'sales-billing', name: 'Billing'},
				'scheduling.main': {ico: 'scheduling', name: 'SchedulingMain'},
				'scheduling.calendar': {ico: 'scheduling', name: 'Calendar'},
				'qto.main': {ico: 'qto', name: 'QTO'},
				'productionplanning.activity': {ico: 'mounting-activity', name: 'PpsActivity'},
				'productionplanning.engineering': {ico: 'engineering-planning', name: 'Engineering'},
				'productionplanning.drawing': {ico: 'engineering-tasks', name: 'EngineeringDrawing'},
				'productionplanning.item': {ico: 'production-planning', name: 'PPSItem'},
				'productionplanning.mounting': {ico: 'mounting', name: 'PpsMounting'},
				'productionplanning.productionset': {ico: 'production-sets', name: 'ProductionSet'},
				'productionplanning.product': {ico: 'product', name: 'PPSProduct'},
				'productionplanning.report': {ico: 'mounting-report', name: 'PpsReport'},
				'productionplanning.producttemplate': {ico: 'engineering-product-template', name: 'ProductTemplate'},
				'procurement.stock': {ico: 'stock', name: 'Stock'},
				'resource.master': {ico: 'resource-master', name: 'ResourceMaster'},
				'resource.equipment': {ico: 'resource-master', name: 'Equipment'},
				'resource.equipmentgroup': {ico: 'resource-master', name: 'EquipmentGroup'},
				'resource.requisition': {ico: 'resource-requisition', name: 'ResourceRequisition'},
				'resource.reservation': {ico: 'resource-reservation', name: 'ResourceReservation'},
				'transportplanning.bundle': {ico: 'product-bundles', name: 'Bundle'},
				'transportplanning.package': {ico: 'transport-package', name: 'TrsPackage'},
				'transportplanning.requisition': {ico: 'transport-requisition', name: 'TransportRequisition'},
				'transportplanning.transport': {ico: 'transport', name: 'Transport'},
				'resource.type': {ico: 'resource-type', name: 'ResourcesTypes'}
			},

			/*
			 returns the svg icon class (string} for the module
			 */
			getImageClass: function (modulename) {
				let icoAffix = module2ModuleInfo.modules[modulename];
				return (!_.isUndefined(icoAffix)) ? 'ico-' + icoAffix.ico : 'ico-rib-logo';
			},

			/*
			 returns the localized modulename (string}
			 */
			getI18NName: function (modulename) {
				let icoAffix = module2ModuleInfo.modules[modulename];
				let localeString = (!_.isUndefined(icoAffix)) ? 'cloud.desktop.moduleDisplayName' + icoAffix.name : modulename;
				return $translate.instant(localeString);
			}
		};

		let allTiles = _.cloneDeep(cloudDesktopTilesConfig);

		function getModuleDisplayNameById(moduleId) {
			let moduleName = moduleId.split('-')[0];
			let tileObject;
			_.each(allTiles, function (tileGroup) {
				_.each(tileGroup.tiles, function (tile) {
					if (tile.id === moduleName) {
						tileObject = tile;
					}
				});
			});

			return tileObject ? $translate.instant(tileObject.displayName$tr$) : moduleId;
		}

		function getNavigatorTitle(moduleName) {
			return $translate.instant('cloud.common.Navigator.goTo') + ' ' + module2ModuleInfo.getI18NName(moduleName);
		}

		return {
			getI18NName: module2ModuleInfo.getI18NName,
			getImageClass: module2ModuleInfo.getImageClass,
			getModuleDisplayNameById: getModuleDisplayNameById,
			getNavigatorTitle: getNavigatorTitle
		};

	}]);
