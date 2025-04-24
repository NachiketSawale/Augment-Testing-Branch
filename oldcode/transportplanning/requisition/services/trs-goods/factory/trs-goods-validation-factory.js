/**
 * Created by anl on 4/29/2020.
 */

(function (angular) {
	'use strict';
    /* global globals, angular, _ */
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionTrsGoodValidationFactory', TrsGoodValidationFactory);

	TrsGoodValidationFactory.$inject = ['$http', '$q', 'platformDataValidationService', 'trsGoodsTypes',
		'platformValidationServiceFactory'];

	function TrsGoodValidationFactory($http, $q, platformDataValidationService, trsGoodsTypes,
									  platformValidationServiceFactory) {

		var serviceCache = {};

		function createService(dataService) {

			var service = {};
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'TrsGoodsDto',
					moduleSubModule: 'TransportPlanning.Requisition'
				}, {
					mandatory: ['TrsGoodsTypeFk']
				},
				service,
				dataService);

			service.validateGood = function (entity, value, model) {
				if (entity.TrsGoodsTypeFk === trsGoodsTypes.Generic) {
					platformDataValidationService.removeFromErrorList(entity, model, service, dataService);
					return true;
				} else {
					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				}
			};

			service.asyncValidateGood = function asyncValidateGood(entity, value, field){
				var defer = $q.defer();
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, value, dataService);
				asyncMarker.myPromise = defer.promise;
				var result = null;
				if(entity.TrsGoodsTypeFk !== trsGoodsTypes.Material)
				{
					result = {
						apply: true,
						valid: true
					};
					defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, dataService));
					return defer.promise;
				}

				$http.get(globals.webApiBaseUrl + 'basics/material/material?id=' + value).then(function (response) {
					if(response && response.data)
					{
						var material = response.data;
						entity.BasDangerclassFk = material.DangerClassFk;
						entity.DangerQuantity = material.Volume;
						entity.BasUomDGFk = material.UomVolumeFk;
						dataService.markItemAsModified(entity);
					}
					result = {
						apply: true,
						valid: true
					};
					defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, dataService));
				});

				return defer.promise;
			};

			return service;
		}

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (_.isNil(serviceCache[key])) {
				serviceCache[key] = createService(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}

})(angular);