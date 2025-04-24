/**
 * Created by las on 7/10/2017.
 */


(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningPackageTranslationService', PackageTranslationService);
	PackageTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceTranslationExtension'];

	function PackageTranslationService(platformTranslationUtilitiesService, customColumnsServiceTranslationExtension) {

		var service = {};

		var cloudCommonModule = 'cloud.common';
		var resourceMasterModule = 'resource.master';
		var resourceModule = 'resource.reservation';
		var resRequisitionModule = 'resource.requisition';
		var basicsCustomizeModule = 'basics.customize';
		var trsRequisition = 'transportplanning.requisition';
		var prjMain = 'project.main';
		var bundleModule = 'transportplanning.bundle';
		var basicsCompanyModule = 'basics.company';
		var basicsMaterialModule = 'basics.material';
		var logisticDispatchingModule = 'logistic.dispatching';
		var logisticJobModule = 'logistic.job';
		var ppsDrawingModule = 'productionplanning.drawing';
		var resEquipmentModule = 'resource.equipment';

		//These two module strings need to be added to allUsedModules, because current module will use the relative containers of Transport module, and these relative containers need these module strings.
		var transportModule = 'transportplanning.transport';
		var ppsCommonModule = 'productionplanning.common';

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, cloudCommonModule, resourceMasterModule, resourceModule, resRequisitionModule, basicsCustomizeModule, trsRequisition, prjMain, bundleModule, transportModule, ppsCommonModule, basicsCompanyModule, basicsMaterialModule, logisticDispatchingModule,
				logisticJobModule, ppsDrawingModule, resEquipmentModule]
		};

		data.words = {
			CommentText: {location: moduleName, identifier: 'entityCommentText', initial: 'Comment'},
			ProjectFk: {location: moduleName, identifier: 'entityProjectFk', initial: 'Project'},
			TransportPackageFk: {
				location: moduleName,
				identifier: 'entityTransportPackageFk',
				initial: 'Parent Package'
			},

			deliveryGroup: {location: moduleName, identifier: 'groupDelivery', initial: 'Delivery'},
			TrsPkgStatusFk: {location: moduleName, identifier: 'entityTransPkgStatusFk', initial: 'Status'},
			LgmJobSrcFk: {location: moduleName, identifier: 'entityLgmJobSrcFk', initial: '*Source Job'},
			LgmJobDstFk: {location: moduleName, identifier: 'entityLgmJobDstFk', initial: '*Destination Job'},

			TrsWaypointSrcFk: {location: moduleName, identifier: 'entityTrsWaypointSrcFk', initial: '*Source Waypoint'},
			TrsWaypointDstFk: {
				location: moduleName,
				identifier: 'entityTrsWaypointDstFk',
				initial: '*Destination Waypoint'
			},

			TrsPkgTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: '*Type'},
			TrsRouteFk: {location: transportModule, identifier: 'entityRoute', initial: '*Transport Route'},
			CompanyFk: {location: basicsCompanyModule, identifier: 'entityCompany', initial: '*Company'},
			Good: {location: moduleName, identifier: 'entityGood', initial: '*Transport Good'},
			LengthCalculated: {
				location: moduleName,
				identifier: 'entityLengthCalculated',
				initial: '*Length Calculated'
			},
			WidthCalculated: {location: moduleName, identifier: 'entityWidthCalculated', initial: '*Width Calculated'},
			HeightCalculated: {
				location: moduleName,
				identifier: 'entityHeightCalculated',
				initial: '*Height Calculated'
			},
			WeightCalculated: {
				location: moduleName,
				identifier: 'entityWeightCalculated',
				initial: '*Weight Calculated'
			},
			LgmDispatchHeaderFk: {
				location: logisticDispatchingModule,
				identifier: 'dispatchingHeader',
				initial: '*Dispatching Header'
			},
			LgmDispatchRecordFk: {
				location: logisticDispatchingModule,
				identifier: 'dispatchingRecord',
				initial: '*Dispatching Record'
			},

			MaterialFk: {location: basicsMaterialModule, identifier: 'view.materialRecord', initial: '*Material'},
			ResourceFk: {location: resourceModule, identifier: 'entityResource', initial: 'Resource'},
			ReservationStatusFk: {
				location: moduleName,
				identifier: 'resreservationstatus',
				initial: 'Reservation Status'
			},
			RequisitionFk: {location: resRequisitionModule, identifier: 'entityRequisition', initial: 'Requisition'},
			ReservedFrom: {location: resourceModule, identifier: 'entityReservedFrom', initial: 'Reserved From'},
			ReservedTo: {location: resourceModule, identifier: 'entityReservedTo', initial: 'Reserved To'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
			UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'},
			QuantityInPkg: {location: moduleName, identifier: 'entityQuantityInPkg', initial: 'Quantity In Package'},
			Weight: {location: moduleName, identifier: 'entityWeight', initial: '*Weight'},
			UomWeightFk: {location: moduleName, identifier: 'entityUomWeightFk', initial: '*Weight Uom'},
			Length: {location: moduleName, identifier: 'entityLength', initial: '*Length'},
			UomLengthFk: {location: moduleName, identifier: 'entityUomLengthFk', initial: '*Length Uom'},
			Width: {location: moduleName, identifier: 'entityWidth', initial: '*Width'},
			UomWidthFk: {location: moduleName, identifier: 'entityUomWidthFk', initial: '*Width Uom'},
			Height: {location: moduleName, identifier: 'entityHeight', initial: '*Height'},
			UomHeightFk: {location: moduleName, identifier: 'entityUomHeightFk', initial: '*Height Uom'},
			Kind: {location: moduleName, identifier: 'kind', initial: '*Kind'},
			DrawingFk:  {location: moduleName, identifier: 'drawingFk', initial: '*Drawing'},
			BundleFk:  {location: moduleName, identifier: 'bundleFk', initial: '*Bundle'},
			MaterialInfo:  {location: moduleName, identifier: 'materialInfo', initial: '*Material'},
			InfoSummary:  {location: moduleName, identifier: 'infoSummary', initial: '*Info Summary'},
			Summary:  {location: moduleName, identifier: 'summary', initial: '*Summary'},
			TrsGoodsFk: {location: moduleName, identifier: 'trsGoodsFk', initial: '*Requsition Goods'},
			dangerousGoodsGroup: {location: moduleName, identifier: 'dangerousGoods.dangerousGoodsGroup', initial: '*Dangerous Goods'},
			DangerclassFk: {location: moduleName, identifier: 'dangerousGoods.dangerClass', initial: '*Danger Class'},
			PackageTypeFk: {location: moduleName, identifier: 'dangerousGoods.packageType', initial: '*Package Type'},
			DangerQuantity: {location: moduleName, identifier: 'dangerousGoods.dangerQuantity', initial: '*Danger Quantity'},
			UomDGFk: {location: moduleName, identifier: 'dangerousGoods.uomDGFk', initial: '*UoM (Danger Good)'},
			ProductionOrder:{ location: ppsCommonModule, identifier: 'product.productionOrder', initial: '*Production Order'},
			Reproduced: { location: moduleName, identifier: 'reproduced', initial: '*Reproduction' },
			ProductStatus: { location: moduleName, identifier: 'statusofgoods', initial: '*Status of Good' }
		};

		//get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

		//convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		customColumnsServiceTranslationExtension.addMethodsForCustomColumnsTranslation(service, data, [moduleName]);

		return service;
	}
})(angular);