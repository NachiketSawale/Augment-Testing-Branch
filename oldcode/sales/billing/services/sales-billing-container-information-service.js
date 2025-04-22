/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {



	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name salesBillingContainerInformationService
	 * @function
	 * @description
	 */
	salesBillingModule.factory('salesBillingContainerInformationService',
		['$injector', 'salesCommonContainerInformationHelperService', 'documentProjectHeaderUIStandardService', 'documentsProjectDocumentRevisionUIStandardService',
			function ($injector, salesCommonContainerInformationHelperService, documentProjectHeaderUIStandardService, documentsProjectDocumentRevisionUIStandardService) {

				var service = {};
				service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
					var leadingService = $injector.get('salesBillingService');
					var createConfig = salesCommonContainerInformationHelperService.createConfig;
					var createConfigFunc = salesCommonContainerInformationHelperService.createConfigFunc;

					var guid2Config = {
						// salesBillingAccrualListController
						'cbf9b7eea34d471884ddf50512193599': createConfigFunc('Grid', 'salesBillingAccrualConfigurationService', 'salesBillingAccrualService', 'salesBillingValidationService'),
						// salesBillingBillsDetailController
						'E66E01DCB9D94AA889F0A8DE3A16A65A': createConfigFunc('Detail', 'salesBillingConfigurationService', 'salesBillingService', 'salesBillingValidationService'),
						// salesBillingBillsListController
						'39608924DC884AFEA59FE04CB1434543': function () {
							var cfg = createConfig('Grid', 'salesBillingDynamicConfigurationService', 'salesBillingService', 'salesBillingValidationService');
							cfg.listConfig.sortOptions = {initialSortColumn: {field: 'BillNo', id: 'billno'}, isAsc: true};
							cfg.listConfig.rowChangeCallBack = function rowChangeCallBack(/* arg */) {
								salesCommonContainerInformationHelperService.initMasterDataFilter('salesBillingService');
							};
							cfg.standardConfigurationService = $injector.get('salesBillingDynamicConfigurationService');
							cfg.listConfig.cellChangeCallBack = function cellChangeCallBack(arg) {
								var entity = arg.item;
								var col = arg.grid.getColumns()[arg.cell].field;
								leadingService.cellChange(entity, col);
							};
							return cfg;
						},
						// salesBillingSchemaListController
						'9715B5644BB84661985187E09AE646AC': createConfigFunc('Grid', 'salesBillingSchemaConfigurationService', 'salesBillingSchemaService', 'salesBillingSchemaValidationService'),
						// salesBillingBoqListController
						'03E13F5F6C6E44A8AE8CD897814887AC': createConfigFunc('Grid', 'salesBillingBoqConfigurationService', 'salesBillingBoqService', 'salesBillingBoqValidationService'),
						// salesBillingProjectBillsListController
						'4B0D79FFFCE24775B00D8CCD88E489DE': function () {
							var cfg = createConfig('Grid', 'salesBillingConfigurationService', 'salesBillingProjectBillsService');
							cfg.listConfig.sortOptions = {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true};
							cfg.listConfig.rowChangeCallBack = function rowChangeCallBack(/* arg */) {
								salesCommonContainerInformationHelperService.initMasterDataFilter('salesBillingProjectBillsService');
							};
							return cfg;
						},
						// salesBillingProjectBillsDetailController
						'C49BD5BAA6454B0E80D3985C93789EB4': createConfigFunc('Detail', 'salesBillingConfigurationService', 'salesBillingProjectBillsService', 'salesBillingValidationService'),
						// salesBillingPreviousBillsListController
						'F825FABE0D0949EA8EF3F6C6DBBDEA60': createConfigFunc('Grid', 'salesBillingPreviousBillsConfigurationService', 'salesBillingPreviousBillsService', 'salesBillingValidationService'),
						// salesBillingWipListController
						'35b66e9f68e04dd59337a45a2f936d25': createConfigFunc('Grid', 'salesBillingWipConfigurationService', 'salesBillingWipService', 'salesBillingValidationService'),
						// salesBillingTransactionListController
						'D45FB0E93B5A4101B875C66686887918': createConfigFunc('Grid', 'salesBillingTransactionConfigurationService', 'salesBillingTransactionService', 'salesBillingValidationService'),
						// salesBillingTransactionDetailController
						'3FE17CC5F81847E99667F903642150D8': createConfigFunc('Detail', 'salesBillingTransactionConfigurationService', 'salesBillingTransactionService', 'salesBillingValidationService'),
						// salesBillingValidationListController
						'1247EF00DFCE413793B328F685F7CA27': createConfigFunc('Grid', 'salesBillingValidationConfigurationService', 'salesBillingValidationDataService', 'salesBillingValidationService'),
						// salesBillingValidationDetailController
						'381859CB3A9E46829179BFC91D11AF89': createConfigFunc('Detail', 'salesBillingValidationConfigurationService', 'salesBillingValidationDataService', 'salesBillingValidationService'),
						// salesBillingItemListController
						'EB36FDA6B4DE4965B4E98EC012D0506B': createConfigFunc('Grid', 'salesBillingItemConfigurationService', 'salesBillingItemService', 'salesBillingItemValidationService'),
						// salesBillingItemDetailController
						'A0AC5D8AD3824C08BCC23D887CB45077': createConfigFunc('Detail', 'salesBillingItemConfigurationService', 'salesBillingItemService', 'salesBillingItemValidationService'),
						// salesBillingIndirectsBalancingDetailController
						'64014298059f4aaaa1f0892cf486aea6': createConfigFunc('Detail', 'salesBillingIndirectBalancingConfigurationService', 'salesBillingIndirectBalancingService', 'salesBillingIndirectBalancingValidationService'),
						// salesBillingPaymentListController
						'd9cb8c6e6cdb44daa4ef02f6f64fe750': createConfigFunc('Grid', 'salesBillingPaymentConfigurationService', 'salesBillingPaymentService', 'salesBillingPaymentValidationService'),
						// salesBillingPaymentDetailController
						'da31be78e5cb416db8c44e2b41afa56e': createConfigFunc('Detail', 'salesBillingPaymentConfigurationService', 'salesBillingPaymentService', 'salesBillingPaymentValidationService'),
						// Documents Project
						'4EAA47C530984B87853C6F2E4E4FC67E': function () {
							var cfg = {};
							cfg.layout = documentProjectHeaderUIStandardService.getStandardConfigForListView();
							cfg.ContainerType = 'Grid';
							cfg.standardConfigurationService = 'documentProjectHeaderUIStandardService';
							cfg.dataServiceProvider = function dataServiceProvider() {
								var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
								documentsProjectDocumentDataService.register({
									moduleName: moduleName,
									parentService: leadingService,
									columnConfig: [
										{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
										{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
										{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
										{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
										{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
										{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
										{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
									]
								});
								return documentsProjectDocumentDataService.getService({
									moduleName: moduleName
								});
							};
							cfg.validationServiceName = 'documentProjectHeaderValidationService';
							cfg.listConfig = {initCalled: false, columns: []};
							return cfg;
						},
						// Documents Project Detail
						'8BB802CB31B84625A8848D370142B95C': function () {
							var cfg = {};
							cfg = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
							cfg.ContainerType = 'Detail';
							cfg.standardConfigurationService = 'documentProjectHeaderUIStandardService';
							cfg.dataServiceProvider = function dataServiceProvider() {
								var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
								documentsProjectDocumentDataService.register({
									moduleName: moduleName,
									parentService: leadingService,
									columnConfig: [
										{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
										{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
										{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
										{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
										{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
										{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
										{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
									]
								});
								return documentsProjectDocumentDataService.getService({
									moduleName: moduleName
								});
							};
							cfg.validationServiceName = 'documentProjectHeaderValidationService';
							return cfg;
						},
						// //Documents Revision
						'684F4CDC782B495E9E4BE8E4A303D693': function () {
							var cfg = {};
							cfg.layout = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForListView();
							cfg.ContainerType = 'Grid';
							cfg.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
							cfg.dataServiceProvider = function dataServiceProvider() {
								var config = {
									moduleName: moduleName,
									parentService: leadingService,
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

								var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

								var revisionConfig = angular.copy(config);

								revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

								var documentsProjectDocumentRevisionDataService = $injector.get('documentsProjectDocumentDataService');

								return documentsProjectDocumentRevisionDataService.getService(revisionConfig);
							};
							cfg.validationServiceName = null;
							cfg.listConfig = {initCalled: false, columns: []};
							return cfg;
						},
						// Documents Revision Detail
						'D8BE3B30FED64AAB809B5DC7170E6219': function () {
							var cfg = {};
							cfg = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForDetailView();
							cfg.ContainerType = 'Detail';
							cfg.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
							cfg.dataServiceProvider = function dataServiceProvider() {
								var config = {
									moduleName: moduleName,
									parentService: leadingService,
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

								var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

								var revisionConfig = angular.copy(config);

								revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

								var documentsProjectDocumentRevisionDataService = $injector.get('documentsProjectDocumentDataService');

								return documentsProjectDocumentRevisionDataService.getService(revisionConfig);
							};
							cfg.validationServiceName = null;
							return cfg;
						},
						'47620dd38c874f97b75ee3b6ce342666': function () {
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
						'7806e7a22b2142f8865ab189efe23c5a': function () {
							var cfg = {};
							var layServ = $injector.get('centralQueryClerkConfigurationService');
							cfg = layServ.getStandardConfigForDetailView();
							cfg.ContainerType = 'Detail';
							cfg.standardConfigurationService = 'centralQueryClerkConfigurationService';
							cfg.dataServiceName = 'centralQueryClerkService';
							cfg.validationServiceName = 'centralQueryClerkValidationService';
							return cfg;
						},
						// salesBillingDocumentDetailController
						'0934ac0577174ad9b00a473235d02109': createConfigFunc('Detail', 'salesBillingDocumentConfigurationService', 'salesBillingDocumentService', 'salesBillingDocumentValidationService'),
						// salesBillingDocumentListController
						'c34718f7f1b446aba797b056a0b1dde0': createConfigFunc('Grid', 'salesBillingDocumentConfigurationService', 'salesBillingDocumentService', 'salesBillingDocumentValidationService'),
						// salesBillingWipDocumentListController
						'32240b2754254f6280bb2a9597c0d611': createConfigFunc('Grid', 'salesBillingWipDocumentConfigurationService', 'salesBillingWipDocumentService', 'salesBillingDocumentValidationService'),
						// salesBillingLineItemListController
						'1A68D99550B34B44844FC7B4E856F70C': createConfigFunc('Grid', 'salesBillingConfigurationService', 'salesBillingEstimateLineItemDataService', 'salesBillingValidationService'),
						// salesBillingLineItemGcListController
						'310C540EF65545EA8EAEE77F87080322' : createConfigFunc('Grid', 'salesBillingConfigurationService', 'salesBillingEstimateLineItemGcDataService', 'salesBillingValidationService')
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
