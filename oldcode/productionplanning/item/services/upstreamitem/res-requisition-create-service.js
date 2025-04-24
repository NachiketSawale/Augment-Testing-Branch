/**
 * Created by lav on 12/10/2020.
 */

(function (angular) {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('resRequisitionCreateOption', ['$injector', function ($injector) {
		var uiStandardService = $injector.get('resourceRequisitionUIStandardService');
		var details = _.cloneDeep(uiStandardService.getStandardConfigForDetailView());
		_.forEach(details.rows, function (row) {
			row.navigator = null;
		});
		var copyUIStandardService = {
			getDtoScheme: uiStandardService.getDtoScheme,
			getStandardConfigForDetailView: function () {
				return details;
			}
		};
		return {
			dataService: 'resRequisitionCreateService',
			uiStandardService: copyUIStandardService,
			validationService: 'resourceRequisitionValidationService',
			fields: ['Description', 'TypeFk', 'ResourceFk', 'JobFk', 'RequisitionTypeFk', 'MaterialFk', 'Quantity', 'UomFk', 'RequestedFrom', 'RequestedTo'],
			creationData: {}
		};
	}]);

	angular.module(moduleName).factory('resRequisitionCreateService', [
		'$q', 'resourceRequisitionDataService',
		'platformDataValidationService', '$http',
		function ($q, resourceRequisitionDataService,
				  platformDataValidationService, $http) {
			var service = {};
			service.createItem = function (creationOptions, customCreationData) {
				var creationData = _.merge(creationOptions, customCreationData);
				var defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'resource/requisition/create', creationData).then(function (response) {
					service.updateData = response.data;
					_.extend(service.updateData, customCreationData);
					defer.resolve(service.updateData);
				});
				return defer.promise;
			};

			service.update = function () {
				var defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'resource/requisition/update', {Requisitions: [service.updateData]}).then(function (response) {
					defer.resolve(response.data.Requisitions[0]);
				}).finally(function () {
					clearValidationErrors();
				});
				return defer.promise;
			};
			service.deleteItem = function () {
				clearValidationErrors();
				service.updateData = null;
				return $q.when(true);
			};

			function clearValidationErrors() {
				platformDataValidationService.removeDeletedEntityFromErrorList(service.updateData, resourceRequisitionDataService);
			}

			return service;
		}]);

})(angular);
