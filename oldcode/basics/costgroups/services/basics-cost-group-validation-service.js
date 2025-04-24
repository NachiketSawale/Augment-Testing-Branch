/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/*global angular, globals*/
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc service
	 * @name basicsCostGroupValidationService
	 * @description provides validation methods for basics costGroup entities
	 */
	angular.module(moduleName).service('basicsCostGroupValidationService', BasicsCostGroupValidationService);

	BasicsCostGroupValidationService.$inject = ['$http', 'platformValidationServiceFactory', 'basicsCostGroupsConstantValues', 'basicsCostGroupDataService', 'platformDataValidationService'];

	function BasicsCostGroupValidationService($http, platformValidationServiceFactory, basicsCostGroupsConstantValues, basicsCostGroupDataService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(basicsCostGroupsConstantValues.schemes.costGroup, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(basicsCostGroupsConstantValues.schemes.costGroup),
			uniques: ['Code']
		},
		self,
		basicsCostGroupDataService);

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			var dto = angular.copy(entity);
			dto[model] = value;
			return $http.post(globals.webApiBaseUrl + 'basics/CostGroups/costgroup/isunique', dto).then(function (response) {
				var res = {};
				if (response.data) {
					entity[model] = value;
					basicsCostGroupDataService.gridRefresh();
					res = {apply: true, valid: true, error: ''};
				} else {
					res.valid = false;
					res.apply = true;
					res.error = 'The Code should be unique';
					res.error$tr$ = 'basics.costgroups.uniqCode';
				}

				return platformDataValidationService.finishAsyncValidation(res, entity, value, model, null, self, basicsCostGroupDataService);
			});
		};
	}
})(angular);