/**
 * Created by zwz on 2019/12/11.
 */

(function () {
	'use strict';
	/*global angular*/

	var currentModule = 'productionplanning.product';
	var cloudCommonModule = 'cloud.common';
    var ppsCommonModule = 'productionplanning.common';
	var ppsProductTemplateModule = 'productionplanning.producttemplate';
	var siteModule = 'basics.site';
	var resourceMasterModule = 'resource.master';
	var drawingModule = 'productionplanning.drawing';
	var modelViewerModule = 'model.viewer';
	var procCommonModule = 'procurement.common';
	var basicsUserformModule = 'basics.userform';

	// for translation of "billing data product and material selection" wizard
	const ppsHeaderModule = 'productionplanning.header';
	const jobModule = 'logistic.job';
	const transportModule = 'transportplanning.transport';

	/**
	 * @ngdoc service
	 * @name productionplanningProductTranslationService
	 * @description provides translation for product module
	 */
	angular.module(currentModule).factory('productionplanningProductTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, cloudCommonModule, ppsCommonModule, ppsProductTemplateModule, siteModule,
				resourceMasterModule, drawingModule, modelViewerModule, procCommonModule, basicsUserformModule, ppsHeaderModule, jobModule, transportModule]
		};

		data.words = {
			baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: '*Basic Data'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: '*Code'},
			PpsProdPlaceTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: '*Type'},
			BasSiteFk: {location: siteModule, identifier: 'SiteFk', initial: '*Site'},
			PositionX: {location: currentModule, identifier: 'productionPlace.positionX', initial: '*PositionX'},
			PositionY: {location: currentModule, identifier: 'productionPlace.positionY', initial: '*PositionY'},
			PositionZ: {location: currentModule, identifier: 'productionPlace.positionZ', initial: '*PositionZ'},
			Length: { location: ppsCommonModule, identifier: 'product.length', initial: '*Length' },
			Width: { location: ppsCommonModule, identifier: 'product.width', initial: '*Width' },
			Height: { location: ppsCommonModule, identifier: 'product.height', initial: '*Height' },
			BasUomLengthFk: { location: ppsCommonModule, identifier: 'product.lengthUoM', initial: '*Length UoM' },
			BasUomWidthFk: { location: ppsCommonModule, identifier: 'product.widthUoM', initial: '*Width UoM' },
			BasUomHeightFk: { location: ppsCommonModule, identifier: 'product.heightUoM', initial: '*Height UoM' },
			dimensions: { location: ppsCommonModule, identifier: 'product.dimensions', initial: 'Dimensions' },
			ResResourceFk: {location: resourceMasterModule, identifier: 'entityResource', initial: '*Resource'},
			PpsProdPlaceChildFk: {location: currentModule, identifier: 'productionPlace.productionPlace', initial: '*Production Place'},
			PpsProductFk: {location: ppsCommonModule, identifier: 'product.entity', initial: '*Product'},
			Timestamp: {location: currentModule, identifier: 'productionPlace.timestamp', initial: '*Timestamp'},
			PpsProductionPlaceFk: {location: currentModule, identifier: 'productionPlace.productionPlace', initial: '*Production Place'},
			SlabNumber: { location: currentModule, identifier: 'product2ProdcutionPlace.slabNumber', initial: '*Slab Number' },
			BillingQuantity: { location: ppsCommonModule, identifier: 'product.billQuantity', initial: '*Bill Quantity' },
			BasUomBillFk: { location: ppsCommonModule, identifier: 'product.billUoM', initial: '*Bill Uom' },

			Description: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive', initial: '*IsLive' },
			Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: '*Sorting' },
			Quantity: { location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
			BasUomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM' },
			EngDrawingFk: { location: ppsCommonModule, identifier: 'product.drawing', initial: '*Drawing' },
			EngDrwCompTypeFk: { location: drawingModule, identifier: 'drawingComponent.engDrwCompTypeFk', initial: '*Component Type'},
			qtyGroup: { location: drawingModule, identifier: 'drawingComponent.quantities', initial: '*Quantities' },
			Quantity2: { location: drawingModule, identifier: 'drawingComponent.quantity2', initial: '*Quantity2' },
			Quantity3: { location: drawingModule, identifier: 'drawingComponent.quantity3', initial: '*Quantity3' },
			BasUomQty2Fk: { location: drawingModule, identifier: 'drawingComponent.uom2', initial: '*Uom2' },
			BasUomQty3Fk: { location: drawingModule, identifier: 'drawingComponent.uom3', initial: '*Uom3' },
			actQtyGroup: { location: drawingModule, identifier: 'drawingComponent.actualQuantities', initial: '*Actual Quantities' },
			ActualQuantity: {location: ppsCommonModule, identifier: 'actualQuantity', initial: '*Actual Quantity'},
			ActualQuantity2: {location: ppsCommonModule, identifier: 'actualQuantity2', initial: '*Actual Quantity2'},
			ActualQuantity3: {location: ppsCommonModule, identifier: 'actualQuantity3', initial: '*Actual Quantity3'},
			BasUomActQtyFk: {location: ppsCommonModule, identifier: 'entityActUoM', initial: '*Actual UoM'},
			BasUomActQty2Fk: {location: ppsCommonModule, identifier: 'entityActUoM2', initial: '*Actual UoM2'},
			BasUomActQty3Fk: {location: ppsCommonModule, identifier: 'entityActUoM3', initial: '*Actual UoM3'},
			userFlagGroup: {location: ppsCommonModule, identifier: 'event.userFlagGroup', initial: '*Userdefined Flags'},
			UserFlag1: {location: ppsCommonModule, identifier: 'event.userflag1', initial: '*Userflag1'},
			UserFlag2: {location: ppsCommonModule, identifier: 'event.userflag2', initial: '*Userflag2'},
			reservedGroup: {location: ppsCommonModule, identifier: 'reservedGroup', initial: '*Reserved'},
			Reserved1: {location: ppsCommonModule, identifier: 'reserved1', initial: '*Reserved1'},
			Reserved2: {location: ppsCommonModule, identifier: 'reserved2', initial: '*Reserved2'},
			EngDrawingComponentFk: { location: currentModule, identifier: 'engProdComponent.engDrawingComponentFk', initial: '*Drawing Component' },
			MdcMaterialCostCodeProductFk: {location: currentModule, identifier: 'engProdComponent.engMdcMaterialCostCodeProductFk', initial: '*Result'},
			PrcStockTransactionFk: { location: procCommonModule, identifier: 'entityPrcStockTransaction', initial: '*Stock Transaction' },
			RackCode: { location: currentModule, identifier: 'rack.rackCode', initial: '*Rack Code' },
			ResResourceRackFk: {location: currentModule, identifier: 'rack.rack', initial: '*Rack'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},

			ProductCode: { location: currentModule, identifier: 'cuttingProduct.productCode', initial: '*Product' },
			ProductDescription: { location: currentModule, identifier: 'cuttingProduct.productDesc', initial: '*Product Description' },
			ProductLengthInfo: { location: currentModule, identifier: 'cuttingProduct.productLength', initial: '*Product Length' },
			ProductWidthInfo: { location: currentModule, identifier: 'cuttingProduct.productWidth', initial: '*Product Width' },
			ProductHeightInfo: { location: currentModule, identifier: 'cuttingProduct.productHeight', initial: '*Product Height' },
			ScrpProductCode: { location: currentModule, identifier: 'cuttingProduct.scrpProductCode', initial: '*Replacing-Scrap Product' },
			ScrpProductDescription: { location: currentModule, identifier: 'cuttingProduct.scrpProductDesc', initial: '*Replacing-Scrap Product Description' },
			ScrpProductLengthInfo: { location: currentModule, identifier: 'cuttingProduct.scrpProductLength', initial: '*Replacing-Scrap Product Length' },
			ScrpProductWidthInfo: { location: currentModule, identifier: 'cuttingProduct.scrpProductWidth', initial: '*Replacing-Scrap Product Width' },
			ScrpProductHeightInfo: { location: currentModule, identifier: 'cuttingProduct.scrpProductHeight', initial: '*Replacing-Scrap Product Height' },
			KeepRemainingLength: { location: currentModule, identifier: 'cuttingProduct.keepRemainingLength', initial: '*Keep Remaining Length' },
			KeepRemainingWidth: { location: currentModule, identifier: 'cuttingProduct.keepRemainingLength', initial: '*Keep Remaining Width' },
			ProductProductionDate: { location: currentModule, identifier: 'cuttingProduct.productProductionDate', initial: '*Production Date' },
			Order: { location: currentModule, identifier: 'cuttingProduct.order', initial: '*Cutting Order' },
			Guid: {location: ppsProductTemplateModule, identifier: 'GUID', initial: '*GUID'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		service.data = data;
		return service;
	}
})();
