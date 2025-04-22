/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {



	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module('sales.contract');

	/**
	 * @ngdoc service
	 * @name salesContractContainerInformationService
	 * @function
	 * @description
	 */
	salesContractModule.factory('salesContractContainerInformationService',
		['$injector', 'salesCommonContainerInformationHelperService', function ($injector, salesCommonContainerInformationHelperService) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				function createDocConfig() {
					var config = {
						moduleName: moduleName,
						parentService: $injector.get('salesContractService'),
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

				var createConfig = salesCommonContainerInformationHelperService.createConfig;
				var createConfigFunc = salesCommonContainerInformationHelperService.createConfigFunc;
				var leadingService = $injector.get('salesContractService');
				var guid2Config = {
					// salesContractWipListController
					'e439572b3a4b4bf68315b02e4cba3d32' : createConfigFunc('Grid', 'salesContractWipConfigurationService', 'salesContractWipService', 'salesContractValidationService'),
					// salesContractBillingListController
					'd9e8ac9295a148a0910a185c71d87661' : createConfigFunc('Grid', 'salesContractBillingConfigurationService', 'salesContractBillingService', 'salesContractValidationService'),
					// salesContractContractsDetailController
					'AC528547872E450584F6E1DD43922C64': createConfigFunc('Detail', 'salesContractConfigurationService', 'salesContractService', 'salesContractValidationService'),
					// salesContractContractsListController
					'34D0A7ECE4F34F2091F7BA6C622FF04D': function() {
						var cfg = createConfig('Grid', 'salesContractDynamicConfigurationService', 'salesContractService', 'salesContractValidationService');
						cfg.listConfig.sortOptions = {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true};
						cfg.listConfig.rowChangeCallBack = function rowChangeCallBack(/* arg */) {
							salesCommonContainerInformationHelperService.initMasterDataFilter('salesContractService');
						};
						cfg.standardConfigurationService = $injector.get('salesContractDynamicConfigurationService');
						cfg.listConfig.cellChangeCallBack = function cellChangeCallBack(arg) {
							var entity = arg.item;
							var col = arg.grid.getColumns()[arg.cell].field;
							leadingService.cellChange(entity,col);
						};
						return cfg;
					},
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
					// salesContractSchemaListController
					'E303C8AE08B246348E6686882E17DFAE': createConfigFunc('Grid', 'salesContractBillingSchemaConfigurationService', 'salesContractBillingSchemaService', 'salesContractValidationService'),
					// salesContractBoqListController
					'03E13F5F6C6E44A8AE8CD897814887AC': createConfigFunc('Grid', 'salesContractBoqConfigurationService', 'salesContractBoqService', 'salesContractBoqValidationService'),
					// salesContractProjectContractsListController
					'F28370473E8648498FC471FB88D7BAAC': createConfigFunc('Grid', 'salesContractConfigurationService', 'salesContractProjectContractsService', 'salesContractProjectContractValidationService'),
					// salesContractProjectContractsDetailController
					'00B327A345274E5A8B57B02DB5FCAAB7': createConfigFunc('Detail', 'salesContractConfigurationService', 'salesContractProjectContractsService', 'salesContractProjectContractValidationService'),
					// salesContractDocumentDetailController
					'ff6a0d7a144e441e87fe63855418619b': createConfigFunc('Detail', 'salesContractDocumentConfigurationService', 'salesContractDocumentService', 'salesContractDocumentValidationService'),
					// salesContractDocumentListController
					'ef3fc9fd941340a6bd61cda5683c2398': createConfigFunc('Grid', 'salesContractDocumentConfigurationService', 'salesContractDocumentService', 'salesContractDocumentValidationService'),
					'468925bdac6a4e47b6c6719a8686f95a': createConfigFunc('Grid', 'salesContractCertificateUIStandardService', 'salesContractCertificateDataService', 'salesOrdCertificateValidationService'),
					'80a057f19ea94187acdbbbdf17d124fb': createConfigFunc('Detail', 'salesContractCertificateUIStandardService', 'salesContractCertificateDataService', 'salesOrdCertificateValidationService'),
					// salesContractTotalsListController
					'2047403a70504a17b4d3ea23c3fae14c': createConfigFunc('Grid', 'salesContractTotalsConfigurationService', 'salesContractTotalsDataService', 'salesContractValidationService'), // TODO: validiation service

					// businesspartnerCertificateActualCertificateListController
					'3afd6de231a54c68b51ce0e3bddf0989': createConfigFunc('Grid', 'salesContractCertificateActualUIStandardService', 'salesContractCertificateActualDataService', 'salesContractCertificateActualValidationService'),

					// businesspartnerCertificateActualCertificateDetailController
					'45c2e52987304449b07611671a204c13': createConfigFunc('Detail', 'salesContractCertificateActualUIStandardService', 'salesContractCertificateActualDataService', 'salesContractCertificateActualValidationService'),
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
