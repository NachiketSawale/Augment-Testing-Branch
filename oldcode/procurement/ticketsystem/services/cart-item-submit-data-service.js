/**
 * Created by lvi on 8/25/2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name commoditySearchHttpController
	 * @require $scope
	 * @description service for ticket system
	 */
	angular.module('procurement.ticketsystem').factory('procurementTicketsystemSubmitCartDataService',
		['$http', '$q','procurementTicketsystemCartDataService',
			function ($http, $q, cartDataService) {

				var service = {};

				function createHttpService() {
					var service = {};

					service.loadSubmitCart = function (projectId,structureId) {
						return $http.get(globals.webApiBaseUrl + 'procurement/ticketsystem/submitcart/list?projectFK='+projectId+'&structureId='+structureId);
					};

					service.saveStoreqHeader = function (submititem) {
						return $http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'procurement/ticketsystem/submitcart/save',
							data: submititem
						});
					};

					service.placeOrderHttp = function (submititem) {
						return $http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'procurement/ticketsystem/submitcart/place',
							data: submititem
						});
					};

					service.getAddressByProjectId = function (id) {
						return $http.get(globals.webApiBaseUrl + 'project/main/byid?id=' + id);
					};

					service.checkIfEachCartItemHasSupplierInfo = function () {
						return $http.get(globals.webApiBaseUrl + 'procurement/ticketsystem/submitcart/checkifallcartitemshavebp');
					};

					return service;
				}

				var httpService = createHttpService();

				service.loadSubmitCart = function (projectId) {
					var selectCatalogs=cartDataService.getSelectedCatalogs();
					var structureId=-1;
					var arrHasStrMaterials=[];
					_.forEach(selectCatalogs,function(group){
						_.forEach(group.items,function(item){
                       if(item.Material.PrcStructureFk){
	                     arrHasStrMaterials.push(item.Material);
                       }
						});
					});
					if(arrHasStrMaterials.length>0){
						structureId=arrHasStrMaterials[0].PrcStructureFk;
					}
					var defer = $q.defer();
					httpService.loadSubmitCart(projectId,structureId).then(function (response) {
						defer.resolve(response);
					}, function (error) {
						defer.reject(error);
					});
					return defer.promise;

				};

				service.saveSubmitCart = function (submitcart) {
					var defer = $q.defer();
					httpService.saveStoreqHeader(submitcart).then(function (response) {
						defer.resolve(response);
					}, function (error) {
						defer.reject(error);
					});
					return defer.promise;
				};

				service.placeOrder = function (submitcart) {
					var defer = $q.defer();
					httpService.placeOrderHttp(submitcart).then(function (response) {
						defer.resolve(response);
					}, function (error) {
						defer.reject(error);
					});
					return defer.promise;
				};

				service.getAddress = function (projectId) {
					// if (projectId > 0) {
					var defer = $q.defer();
					httpService.getAddressByProjectId(projectId).then(function (response) {
						defer.resolve(response);
					});
					return defer.promise;
					// }
				};

				service.checkIfEachCartItemHasSupplierInfo = httpService.checkIfEachCartItemHasSupplierInfo;

				return service;
			}]);
})(angular);