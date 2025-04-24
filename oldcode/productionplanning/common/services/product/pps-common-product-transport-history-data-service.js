(function (angular) {
	'use strict';
	/* global globals, angular */
	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);
	module.factory('ppsCommonProductTransportHistoryDataService', ppsCommonProductTransportHistoryDataService);

	ppsCommonProductTransportHistoryDataService.$inject = [
		'$injector',
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension'
	];

	function ppsCommonProductTransportHistoryDataService (
		$injector,
		platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension
		) {
		var service = {};
      var serviceCache = [];

      service.getService = function (uuid, config) {
			if(!serviceCache[uuid]){
				serviceCache[uuid] = createService(config);
			}
			return  serviceCache[uuid];
		};

      function createService(config){
	      var serviceOptions = {
		      flatLeafItem: {
			      module: module,
			      serviceName: 'ppsCommonProductTransportHistoryDataService',
			      entityNameTranslationID: 'productionplanning.common.product.entityProductTransportHistory',
			      addValidationAutomatically: true,
			      httpRead: {route: globals.webApiBaseUrl + 'productionplanning/common/product/history/', endRead: config.endRead? config.endRead : 'forproduct'},
			      dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				      typeName: 'ProductHistoryDto',
				      moduleSubModule: 'ProductionPlanning.Common'
			      })],
			      entityRole: {
				      leaf: {
					      itemName: 'ProductHistory',
					      parentService: config.parentService? $injector.get(config.parentService) : $injector.get('productionplanningProductMainService'),
					      parentFilter: config.parentFilter? config.parentFilter : 'productId'
				      }
			      },
			      presenter: {
				      list: {
					      incorporateDataRead: function (readData, data) {

						      var result = {
							      FilterResult: readData.FilterResult,
							      dtos: readData || []
							      // eslint-disable-next-line no-mixed-spaces-and-tabs
						      };
						      return container.data.handleReadSucceeded(result, data);
					      }
				      }
			      },
			      actions: {}
		      }
	      };
	      var container = platformDataServiceFactory.createNewComplete(serviceOptions);
	      return  container.service;
      }

		return service;
	}
})(angular);