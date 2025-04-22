/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {



	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module('sales.wip');

	/**
	 * @ngdoc service
	 * @name salesWipContainerInformationService
	 * @function
	 * @description
	 */
	salesWipModule.factory('salesWipContainerInformationService',
		['$injector', 'salesCommonContainerInformationHelperService', function ($injector, salesCommonContainerInformationHelperService) {

			var service = {};

			function createDocConfig() {
				var config = {
					moduleName: moduleName,
					parentService: $injector.get('salesWipService'),
					columnConfig: [
						{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
						{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
					],
					title: moduleName
				};
				return config;
			}

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {

				var createConfig = salesCommonContainerInformationHelperService.createConfig;
				var createConfigFunc = salesCommonContainerInformationHelperService.createConfigFunc;
				var leadingService = $injector.get('salesWipService');
				var guid2Config = {
					// salesWipAccrualListController
					'6580513f3b564a5088c75b67232d8f47': createConfigFunc('Grid', 'salesWipAccrualConfigurationService', 'salesWipAccrualService', 'salesWipValidationService'),
					// salesWipWipsDetailController
					'D7BFA7174FC14AB49ACEF0C6F6B6678B': createConfigFunc('Detail', 'salesWipConfigurationService', 'salesWipService', 'salesWipValidationService'),
					// salesWipWipsListController
					'689E0886DE554AF89AADD7E7C3B46F25': function () {
						var cfg = createConfig('Grid', 'salesWipDynamicConfigurationService', 'salesWipService', 'salesWipValidationService');
						cfg.listConfig.sortOptions = {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true};
						cfg.listConfig.rowChangeCallBack = function rowChangeCallBack(/* arg */) {
							salesCommonContainerInformationHelperService.initMasterDataFilter('salesWipService');
						};
						cfg.standardConfigurationService = $injector.get('salesWipDynamicConfigurationService');
						cfg.listConfig.cellChangeCallBack = function cellChangeCallBack(arg) {
							var entity = arg.item;
							var col = arg.grid.getColumns()[arg.cell].field;
							leadingService.cellChange(entity,col);
						};
						return cfg;
					},
					// salesWipBoqListController
					'27CBDFED58E44DBD8D3B3C07B54BBC1F': createConfigFunc('Grid', 'salesWipBoqConfigurationService', 'salesWipBoqService', 'salesWipBoqValidationService'),
					// salesWipProjectWipsDetailController
					'EE83BC7FF01E47CDAAF2771245E8374C': createConfigFunc('Detail', 'salesWipConfigurationService', 'salesWipProjectWipsService', 'salesWipValidationService'),
					// salesWipProjectWipsListController
					'E462BC1E81F648039CB506B9FCF70F4E': function () {
						var cfg = createConfig('Grid', 'salesWipConfigurationService', 'salesWipProjectWipsService', 'salesWipValidationService');
						cfg.listConfig.sortOptions = {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true};
						return cfg;
					},
					// salesWipContractListController
					'7231283a45584ee0bd48b7343c42dae0' : createConfigFunc('Grid', 'salesWipContractConfigurationService', 'salesWipContractService', 'salesWipValidationService'),
					// Documents Project
					'4EAA47C530984B87853C6F2E4E4FC67E': function(){
						var cfg = {};
						var documentProjectHeaderUIStandardService = $injector.get('documentProjectHeaderUIStandardService');
						cfg.layout = documentProjectHeaderUIStandardService.getStandardConfigForListView();
						cfg.ContainerType = 'Grid';
						cfg.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						cfg.dataServiceProvider = function dataServiceProvider(){
							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
							documentsProjectDocumentDataService.register(createDocConfig());
							return documentsProjectDocumentDataService.getService({
								moduleName: moduleName
							});
						};
						cfg.validationServiceName = 'documentProjectHeaderValidationService';
						cfg.listConfig = { initCalled: false, columns: [] };
						return cfg;
					},
					// Documents Project Detail
					'8BB802CB31B84625A8848D370142B95C': function(){
						var documentProjectHeaderUIStandardService = $injector.get('documentProjectHeaderUIStandardService');
						var cfg = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
						cfg.ContainerType = 'Detail';
						cfg.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						cfg.dataServiceProvider = function dataServiceProvider(){
							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
							documentsProjectDocumentDataService.register(createDocConfig());
							return documentsProjectDocumentDataService.getService({
								moduleName: moduleName
							});
						};
						cfg.validationServiceName = 'documentProjectHeaderValidationService';
						return cfg;
					},
					// //Documents Revision
					'684F4CDC782B495E9E4BE8E4A303D693': function(){
						var cfg = {};
						var documentsProjectDocumentRevisionUIStandardService = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						cfg.layout = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForListView();
						cfg.ContainerType = 'Grid';
						cfg.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						cfg.dataServiceProvider = function dataServiceProvider(){
							var config = createDocConfig();

							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

							var revisionConfig = angular.copy(config);

							revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

							var documentsProjectDocumentRevisionDataService = $injector.get('documentsProjectDocumentDataService');

							return documentsProjectDocumentRevisionDataService.getService(revisionConfig);
						};
						cfg.validationServiceName = null;
						cfg.listConfig = { initCalled: false, columns: [] };
						return cfg;
					},
					// Documents Revision Detail
					'D8BE3B30FED64AAB809B5DC7170E6219': function(){
						var cfg = $injector.get('documentsProjectDocumentRevisionUIStandardService').getStandardConfigForDetailView();
						cfg.ContainerType = 'Detail';
						cfg.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						cfg.dataServiceProvider = function dataServiceProvider(){
							var config = createDocConfig();

							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

							var revisionConfig = angular.copy(config);
							revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

							return documentsProjectDocumentDataService.getService(revisionConfig);
						};
						cfg.validationServiceName = null;
						return cfg;
					},
					'47620dd38c874f97b75ee3b6ce342666': function(){
						var cfg = {};
						var layServ = $injector.get('centralQueryClerkConfigurationService');
						cfg.layout = layServ.getStandardConfigForListView();
						cfg.ContainerType = 'Grid';
						cfg.standardConfigurationService = 'centralQueryClerkConfigurationService';
						cfg.dataServiceName = 'centralQueryClerkService';
						cfg.validationServiceName = 'centralQueryClerkValidationService';
						cfg.listConfig = {initCalled: false, columns: []};
						return cfg;
					},
					'7806e7a22b2142f8865ab189efe23c5a': function(){
						var cfg = {};
						var layServ = $injector.get('centralQueryClerkConfigurationService');
						cfg = layServ.getStandardConfigForDetailView();
						cfg.ContainerType = 'Detail';
						cfg.standardConfigurationService = 'centralQueryClerkConfigurationService';
						cfg.dataServiceName = 'centralQueryClerkService';
						cfg.validationServiceName = 'centralQueryClerkValidationService';
						return cfg;
					},
					// salesWipDocumentDetailController
					'0988f39b5d8342f0ad6211c9fa2d434a': createConfigFunc('Detail', 'salesWipDocumentConfigurationService', 'salesWipDocumentService', 'salesWipDocumentValidationService'),
					// salesWipDocumentListController
					'e741d2316c0245e1973a305b3f1c938b': createConfigFunc('Grid', 'salesWipDocumentConfigurationService', 'salesWipDocumentService', 'salesWipDocumentValidationService'),
					// salesWipBillingSchemaListController
					'c8faaacfa60c4790845e06aafd370ec5': createConfigFunc('Grid', 'salesWipBillingSchemaConfigurationService', 'salesWipBillingSchemaService', 'salesWipValidationService'),
					// salesWipBillingListController
					'4a7b645797f34ac3ac21e4410b2635a8' : createConfigFunc('Grid', 'salesWipBillingConfigurationService', 'salesWipBillingService', 'salesWipValidationService'),
					// salesWipLineItemListController
					'D2EA490FFFC84F0090DD1D1B78E69768' : createConfigFunc('Grid', 'salesWipConfigurationService', 'salesWipEstimateLineItemDataService', 'salesWipValidationService'),
					// salesWipLineItemGcListController
					'6BA1D8BC9E184389888793CA65D82808' : createConfigFunc('Grid', 'salesWipConfigurationService', 'salesWipEstimateLineItemGcDataService', 'salesWipValidationService')
				};

				// model containers
				[
					'da5481eabd71482dbca12c4260eec5bf', // modelMainObjectInfoListController
					'086b1d0b9d4e4bc6a80ffddaa668ada7', // modelMainObjectInfoDetailController
					'3b5c28631ef44bb293ee05475a9a9513', // modelMainViewerLegendListController
					'd12461a0826a45f1ab76f53203b48ec6' // modelMainViewerLegendDetailController
				].forEach(function (guid) {
					guid2Config[guid] = function () {
						return $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
					};
				});
				[
					'3a0e7703abd140febba420db01e72c88', // modelEvaluationRuleListController (non-master)
					'5a4d078143764838ac5d8e7dcfa5ca9b', // modelEvaluationRuleDetailController (non-master)
					'63e957df0af245a19f9608ac9beced3b', // modelEvaluationRulesetListController (non-master)
					'5488706fc0b047cc94029e502ecd2bfe' // modelEvaluationRulesetDetailController (non-master)
				].forEach(function (guid) {
					guid2Config[guid] = function (guid) {
						return $injector.get('modelEvaluationContainerInformationService').getContainerInfoByGuid(guid);
					};
				});
				// end of model containers

				return salesCommonContainerInformationHelperService.getContainerInfoByGuid(guid, guid2Config);
			};

			return service;
		}
		]);
})();
