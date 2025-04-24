(function (angular) {
	'use strict';

	/*global globals, angular, _*/
	/**
	 * @ngdoc service
	 * @name ProductionsetMainService
	 * @function
	 *
	 * @description
	 * ProductionsetMainService is the data service for all Production Set related functionality.
	 * */

	var moduleName = 'productionplanning.productionset';
	var ProductionsetModul = angular.module(moduleName);

	ProductionsetModul.factory('productionplanningProductionsetMainService', ProductionsetMainService);
	ProductionsetMainService.$inject = ['$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupDescriptorService',
		'ServiceDataProcessArraysExtension', 'basicsCommonMandatoryProcessor', 'cloudDesktopSidebarService',
		'platformRuntimeDataService', 'productionplanningProductionsetProcessor'];

	function ProductionsetMainService(
		$injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsLookupdataLookupDescriptorService,
		ServiceDataProcessArraysExtension, basicsCommonMandatoryProcessor, cloudDesktopSidebarService,
		platformRuntimeDataService,productionplanningProductionsetProcessor) {

		var productionsetFk;

		var serviceOption = {
			flatRootItem: {
				module: ProductionsetModul,
				serviceName: 'productionplanningProductionsetMainService',
				entityNameTranslationID: 'productionplanning.productionset.entityProductionset',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/productionset/productionset/',
					endRead: 'listbyfiltered', usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'Productionset',
						moduleName: 'cloud.desktop.moduleDisplayNameProductionSet',
						responseDataEntitiesPropertyName: 'Main',
						descField: 'DescriptionInfo.Translated',
						handleUpdateDone: function (updateData, response, data){
							service.refreshLogs();
						},
						useIdentification: true
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'ProductionsetDto',
						moduleSubModule: 'ProductionPlanning.ProductionSet'
					}), {
					processItem: function (item) {
						service.setDateshiftModeReadOnly(item);
						item.getType = function () {
							return item.EventTypeFk;
						};
					}
				}, productionplanningProductionsetProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {

							basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};
							if (productionsetFk && productionsetFk !== 0) {
								result.dtos = _.filter(readData.Main, {'Id': productionsetFk});
							}
							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				},
				translation: {
					uid: 'productionplanningProductionsetMainService',
					title: 'productionplanning.productionset.entityProductionset',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'ProductionsetDto',
						moduleSubModule: 'ProductionPlanning.ProductionSet',
					},
				},
				entitySelection: true,
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		//validate when new production set entity
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ProductionsetDto',
			moduleSubModule: 'ProductionPlanning.ProductionSet',
			validationService: 'productionplanningProductionsetValidationService'
		});
		var service = serviceContainer.service;

		service.selectItemByID = function selectItemByID(productionsetId) {
			var item = service.getItemById(productionsetId);
			if (!item) {
				cloudDesktopSidebarService.filterSearchFromPKeys([productionsetId]);
			} else {
				service.setSelected(item);
			}
		};

		service.onEntityPropertyChanged = function (entity, field) {
			$injector.get('productionplanningProductionsetMainServiceEntityPropertychangedExtension').onPropertyChanged(entity, field, service);
		};

		service.setDateshiftModeReadOnly = function setDateshiftModeReadOnly(item){
			var fields = [
				{field: 'DateshiftMode', readonly: item.Version > 0}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		service.refreshLogs = function refreshLogs() {
			var utilSrv = $injector.get('transportplanningTransportUtilService');
			// refresh log-list
			if (utilSrv.hasShowContainerInFront('productionplanning.productionset.log.list')) {
				var logListDataSrv = $injector.get('ppsCommonLogSourceDataServiceFactory').createDataService('productionplanning.productionset', { dto: 'PpsLogReportVDto' }); // before this moment, data service has created, just get it
				logListDataSrv.load();
			}
			// refresh log-pinboard
			if (utilSrv.hasShowContainerInFront('productionplanning.productionset.log.pinboard')) {
				var logPinboardSrv = $injector.get('basicsCommonCommentDataServiceFactory').get('productionplanning.productionset.manuallog', service.getServiceName());
				logPinboardSrv.load();
			}
		};

		service.getContainerData = () => serviceContainer.data;
		return service;

	}
})(angular);