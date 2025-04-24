(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.ppsmaterial';
	var cloudCommonModule = 'cloud.common';
	var resourceMasterModule = 'resource.master';
	var ppsMaterialModule = 'productionplanning.ppsmaterial';
	var ppsCommonModule = 'productionplanning.common';
	var basicsMaterialModule = 'basics.material';
	var drawingModule = 'productionplanning.drawing';

	/**
	* @ngdoc service
	* @name productionplanningPpsMaterialTranslationService
	* @description provides translation for productionplanning PPS Material module
	*/
	angular.module(moduleName).factory('productionplanningPpsMaterialTranslationService', productionplanningPpsMaterialTranslationService);

	productionplanningPpsMaterialTranslationService.$inject = ['platformTranslationUtilitiesService', 'basicsMaterialRecordLayout'];

	function productionplanningPpsMaterialTranslationService(platformTranslationUtilitiesService, basicsMaterialRecordLayout) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, cloudCommonModule, resourceMasterModule, ppsCommonModule, basicsMaterialModule,drawingModule]
		};

		data.words = {

			//productdesc: { location: moduleName, identifier: 'listProductDescTitle', initial: 'Product Description' },
			basicData: { location: cloudCommonModule, identifier: 'listProductDescTitle', initial: 'Basic Data' },
			UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
			Quantity: { location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
			BillingQuantity: { location: ppsCommonModule, identifier: 'product.billQuantity', initial: '*Bill Quantity' },
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},

			dimensions: {location: ppsMaterialModule, identifier: 'productDescription.dimensions', initial: 'Dimensions'},
			Length: { location: ppsMaterialModule, identifier: 'productDescription.length', initial: 'Length' },
			BasUomLengthFk: { location: ppsCommonModule, identifier: 'product.lengthUoM', initial: 'Length UoM' },
			Width: { location: ppsMaterialModule, identifier: 'productDescription.width', initial: 'Width' },
			BasUomWidthFk: { location: ppsCommonModule, identifier: 'product.widthUoM', initial: 'Width UoM' },
			Height: { location: ppsMaterialModule, identifier: 'productDescription.height', initial: 'Height' },
			BasUomHeightFk: { location: ppsCommonModule, identifier: 'product.heightUoM', initial: 'Height UoM' },
			Weight: { location: ppsMaterialModule, identifier: 'productDescription.weight', initial: 'Weight' },
			Weight2: { location: ppsCommonModule, identifier: 'product.weight2', initial: 'Weight2' },
			Weight3: { location: ppsCommonModule, identifier: 'product.weight3', initial: 'Weight3' },
			BasUomWeightFk: { location: ppsCommonModule, identifier: 'product.weightUoM', initial: 'Weight UoM' },
			Area: { location: ppsMaterialModule, identifier: 'productDescription.area', initial: 'Area' },
			Area2: { location: ppsCommonModule, identifier: 'product.area2', initial: 'Area2' },
			Area3: { location: ppsCommonModule, identifier: 'product.area3', initial: 'Area3' },
			BasUomAreaFk: { location: ppsCommonModule, identifier: 'product.areaUoM', initial: 'Area UoM' },
			Volume: { location: ppsCommonModule, identifier: 'product.volume', initial: '*Volume' },
			Volume2: { location: ppsCommonModule, identifier: 'product.volume2', initial: '*Volume2' },
			Volume3: { location: ppsCommonModule, identifier: 'product.volume3', initial: '*Volume3' },
			BasUomVolumeFk: { location: ppsCommonModule, identifier: 'product.volumeUoM', initial: 'Volume UoM' },

			VariableName: { location: ppsMaterialModule, identifier: 'productDescParameter.variablename', initial: 'Variable Name' },

			eventDefinition: {location: ppsMaterialModule, identifier: 'eventDefinition', initial: 'Event Definition'},
			defaultCalculation: {location: ppsMaterialModule, identifier: 'defaultCalculation', initial: 'Default Calculation'},
			documentation:{location: ppsMaterialModule, identifier:'documentation',initial:'Documentation'},
			PpsEventTypeFk: { location: ppsMaterialModule, identifier: 'materialEventType.ppsEventTypeFk', initial: 'PPS Event Type' },
			VarDuration: { location: ppsMaterialModule, identifier: 'materialEventType.varduration', initial: 'Variable Duration' },
			EventFor: { location: ppsMaterialModule, identifier: 'materialEventType.eventFor', initial: 'Event For' },
			Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
			LagTime: { location: ppsMaterialModule, identifier: 'materialEventType.lagTime', initial: 'Lag Time' },
			PpsEventTypeBaseFk: { location: ppsMaterialModule, identifier: 'materialEventType.ppsEventTypeBaseFk', initial: 'PPS Event Type Base' },
			CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
			CommentTxt: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
			SiteFk: { location: resourceMasterModule, identifier: 'SiteFk', initial: 'Site' },
			ResTypeFk: {location: resourceMasterModule, identifier: 'TypeFk', initial: 'Resource Type'},
			IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'IsLive'},

			basicConfiguration: {location: ppsMaterialModule, identifier: 'ppsEventTypeRelation.basicConfiguration', initial: 'Basic Configuration'},
			PpsEventTypeParentFk: { location: ppsMaterialModule, identifier: 'ppsEventTypeRelation.ppsEventTypeParentFk', initial: 'Parent Event Type' },
			PpsEventTypeChildFk: { location: ppsMaterialModule, identifier: 'ppsEventTypeRelation.ppsEventTypeChildFk', initial: 'Child Event Type' },
			RelationKindFk: { location: ppsMaterialModule, identifier: 'ppsEventTypeRelation.relationKindFk', initial: 'Relation Kind' },
			FixLagTime: { location: ppsMaterialModule, identifier: 'ppsEventTypeRelation.fixLagTime', initial: 'Fix Lag Time' },
			FixDuration: { location: ppsMaterialModule, identifier: 'ppsEventTypeRelation.fixDuration', initial: 'Fix Duration' },
			MdcMaterialFk: {location: basicsMaterialModule, identifier: 'record.material', initial: '*Material'},
			CadProducttype : {location: ppsMaterialModule, identifier: 'ppsCadToMaterial.cadProductType', initial: '*CAD Product Type'},
			CadAddSpecifier : {location: ppsMaterialModule, identifier: 'ppsCadToMaterial.cadAddSpecifier ', initial: '*Additional Specifier'},
			ProdMatGroupFk : {location: ppsMaterialModule, identifier: 'mat2ProdMatGroup.entityProdMatGroup ', initial: '*Production Material Group'},
			EngDrawingFk : {location: ppsMaterialModule, identifier: 'productDescription.engDrawing', initial: '*Drawing'},

			ppsProperties : {location: moduleName, identifier: 'record.ppsProperties', initial: '*PPS Properties'},
			IsBundled : {location: moduleName, identifier: 'record.isbundled', initial: '*Is Bundled'},
			BasClobsPqtyContent : {location: moduleName, identifier: 'record.basclobspqtycontent', initial: '*Planning Quantity Rule'},
			BasClobsBqtyContent : {location: moduleName, identifier: 'record.basclobsbqtycontent', initial: '*Billing Quantity Rule'},
			BasUomPlanFk: { location: ppsMaterialModule, identifier: 'record.basUomPlanFk', initial: '*Planning UoM' },
			BasUomBillFk: { location: ppsMaterialModule, identifier: 'record.basUomBillFk', initial: '*Bill Uom' },

			propertiesGroup : {location: moduleName, identifier: 'productDescription.propertiesGroup', initial: '*Properties'},
			IsolationVolume : {location: moduleName, identifier: 'productDescription.isolationVolume', initial: '*Isolation Volume'},
			ConcreteVolume : {location: moduleName, identifier: 'productDescription.concreteVolume', initial: '*Concrete Volume'},
			ConcreteQuality : {location: moduleName, identifier: 'productDescription.concreteQuality', initial: '*Concrete Quality'},
			ProcessTemplateFk : {location: moduleName, identifier: 'productDescription.processTemplateFk', initial: '*Process Template'},
			PpsFormulaInstanceFk : {location: moduleName, identifier: 'productDescription.ppsFormulaInstanceFk', initial: '*Formula Instance'},

			MatSiteGrpFk :{ location: ppsMaterialModule, identifier: 'record.matSiteGrpFk', initial: '*Material Site Group' },
			pUCreationGroup: {location: ppsMaterialModule, identifier: 'record.puCreationGroup', initial:'*Planning Unit Creation'},
			QuantityFormula : { location: ppsMaterialModule, identifier: 'record.quantityFormula ', initial: '*Quantity Formula' },
			IsOverrideMaterial :{ location: ppsMaterialModule, identifier: 'record.isOverrideMaterial', initial: '*Override Material' },
			MatGroupOvrFk :{ location: ppsMaterialModule, identifier: 'record.matGroupOvrFk', initial: '*Override Material Group' },
			MaterialOvrFk :{ location: ppsMaterialModule, identifier: 'record.materialOvrFk', initial: '*New Material' },
			BasUomOvrFk :{ location: ppsMaterialModule, identifier: 'record.basUomOvrFk', initial: '*New UoM' },
			ppsUserdefinedTexts: { location: ppsMaterialModule, identifier: 'record.ppsUserdefinedTexts', initial: '*PPS Userdefined Texts' },
			UserdefinedForProddesc1: { location: ppsMaterialModule, identifier: 'record.userdefinedForProddesc1', initial: '*Text For Template 1' },
			UserdefinedForProddesc2: { location: ppsMaterialModule, identifier: 'record.userdefinedForProddesc2', initial: '*Text For Template 2' },
			UserdefinedForProddesc3: { location: ppsMaterialModule, identifier: 'record.userdefinedForProddesc3', initial: '*Text For Template 3' },
			UserdefinedForProddesc4: { location: ppsMaterialModule, identifier: 'record.userdefinedForProddesc4', initial: '*Text For Template 4' },
			UserdefinedForProddesc5: { location: ppsMaterialModule, identifier: 'record.userdefinedForProddesc5', initial: '*Text For Template 5' },
			MdcMaterialItemFk: {location: ppsMaterialModule, identifier: 'ppsMaterialComp.ppsMaterialItemFk', initial: '*Material Planningunit'},
			UserFlag1: {location: ppsMaterialModule, identifier: 'ppsMaterialComp.userFlag1', initial: '*User Flag 1'},
			UserFlag2: {location: ppsMaterialModule, identifier: 'ppsMaterialComp.userFlag2', initial: '*User Flag 2'},

			MaterialSumFk : {location: ppsMaterialModule, identifier: 'summarized.materialSumFk', initial: '*Summarized Material'},
			SummarizeMode : {location: ppsMaterialModule, identifier: 'summarized.summarizedMode', initial: '*Summarized Mode'},
			MappingCode : {location: ppsMaterialModule, identifier: 'mapping.mappingCode', initial: '*Code'},
			PpsMaterialFk : {location: ppsMaterialModule, identifier: 'mapping.ppsmaterialfk', initial: '*Pps Material'},
			BasExternalsourcetypeFk : {location: ppsMaterialModule, identifier: 'mapping.basexternalsourcetypefk', initial: '*External Source Type'},
			BasExternalsourceFk : {location: ppsMaterialModule, identifier: 'mapping.basexternalsourcefk', initial: '*External Source'},
			Quantities:{location: drawingModule, identifier: 'drawingComponent.quantities', initial: '*Quantities'},
			Uom2Fk: {location: drawingModule, identifier: 'drawingComponent.uom2', initial: '*Uom2'},
			Uom3Fk: {location: drawingModule, identifier: 'drawingComponent.uom3', initial: '*Uom3'},
			Quantity2 : {location: drawingModule, identifier: 'drawingComponent.quantity2', initial: '*Quantity2'},
			Quantity3 : {location: drawingModule, identifier: 'drawingComponent.quantity3', initial: '*Quantity3'},
			MdcMaterialCostCodeFk: {location: drawingModule, identifier: 'drawingComponent.materialCostCode', initial: '*Material/CostCode'},
			EngDrwCompTypeFk: {
				location: drawingModule,
				identifier: 'drawingComponent.engDrwCompTypeFk',
				initial: '*Component Type'
			},
			Autogenerated: {location: moduleName, identifier: 'drawingComponent.Autogenerated', initial: '*Auto Generated'},

			ObjectType: {location: ppsMaterialModule, identifier: 'ppsMaterialToMdlProductType.description', initial: '*3D Object Type'},
			ProductCategory: {location: ppsMaterialModule, identifier: 'ppsMaterialToMdlProductType.productCategory', initial: '*5D Tracking Criteria'},
			ProductType: {location: ppsMaterialModule, identifier: 'ppsMaterialToMdlProductType.productType', initial: '*Product Type'},
			ProductionMode: {location: ppsMaterialModule, identifier: 'ppsMaterialToMdlProductType.productionMode', initial: '*Auto/Manual Production'},
			IsReadonly: { location: ppsMaterialModule, identifier: 'record.isReadonly', initial: '*Readonly as Component' },
		};

		data.allUsedModules = data.allUsedModules.concat(basicsMaterialRecordLayout.translationInfos.extraModules);
		angular.extend(data.words, basicsMaterialRecordLayout.translationInfos.extraWords);

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);
