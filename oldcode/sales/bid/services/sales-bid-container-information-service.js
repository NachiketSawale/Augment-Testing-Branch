/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {



	'use strict';
	var salesBidModule = angular.module('sales.bid');
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesBidContainerInformationService
	 * @function
	 * @description
	 */
	salesBidModule.factory('salesBidContainerInformationService',
		['$injector', 'salesCommonContainerInformationHelperService',  function ($injector, salesCommonContainerInformationHelperService) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				function createDocConfig() {
					var config = {
						moduleName: moduleName,
						parentService: $injector.get('salesBidService'),
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

				var leadingService = $injector.get('salesBidService');
				var guid2Config = {
					// salesBidBidsDetailController
					'1918073BF2664785B1B9223C6E443D6D': createConfigFunc('Detail', 'salesBidDynamicConfigurationService', 'salesBidService', 'salesBidValidationService'),
					// salesBidBidsListController
					'7001204D7FB04CF48D8771C8971CC1E5': function() {
						var cfg = createConfig('Grid', 'salesBidDynamicConfigurationService', 'salesBidService', 'salesBidValidationService');
						cfg.listConfig.sortOptions = {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true};
						cfg.listConfig.rowChangeCallBack = function rowChangeCallBack(/* arg */) {
							salesCommonContainerInformationHelperService.initMasterDataFilter('salesBidService');
						};

						cfg.standardConfigurationService = $injector.get('salesBidDynamicConfigurationService');

						cfg.listConfig.cellChangeCallBack = function cellChangeCallBack(arg) {
							var entity = arg.item;
							var col = arg.grid.getColumns()[arg.cell].field;
							leadingService.cellChange(entity,col);
						};
						return cfg;
					},
					// salesBidBillingSchemaListController
					'3DE6DDAA808C45D39F71803909CBB06A': createConfigFunc('Grid', 'salesBidBillingSchemaConfigurationService', 'salesBidBillingSchemaService', 'salesBidValidationService'),
					// salesBidBoqListController
					'C394FFFC7B2B49C68A175614117084D0': createConfigFunc('Grid', 'salesBidBoqConfigurationService', 'salesBidBoqService', 'salesBidBoqValidationService'),
					// salesBidProjectBidsListController
					'96E96054B48C4F82AED3F9140611B010':function () {
						var cfg = createConfig('Grid', 'salesBidConfigurationService', 'salesBidProjectBidsService', 'salesBidValidationService');
						cfg.listConfig.sortOptions = {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true};
						return cfg;
					},
					// salesBidProjectBidsDetailController
					'FDF2E64888F544EC8310359384E823C6': createConfigFunc('Detail', 'salesBidConfigurationService', 'salesBidProjectBidsService', 'salesBidValidationService'),
					// salesBidDocumentDetailController
					'096bbc843bf142038615af92894512be': createConfigFunc('Detail', 'salesBidDocumentConfigurationService', 'salesBidDocumentService', 'salesBidDocumentValidationService'),
					// salesBidDocumentListController
					'03deb09668e740c389bc3681210eaef1': createConfigFunc('Grid', 'salesBidDocumentConfigurationService', 'salesBidDocumentService', 'salesBidDocumentValidationService'),
					'ce1499b758bc45f8a61c4df00ade9e6e': createConfigFunc('Grid', 'salesBidCertificateUIStandardService', 'salesBidCertificateDataService', 'salesBidCertificateValidationService'),
					'a8bd10d7081a45099bcd6a8bd56cdd79': createConfigFunc('Detail', 'salesBidCertificateUIStandardService', 'salesBidCertificateDataService', 'salesBidCertificateValidationService'),
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
					}
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
		}]);
})();
