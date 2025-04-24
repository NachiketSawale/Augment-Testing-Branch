/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyControllingGroupValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyControllingGroupValidationService', BasicsCompanyControllingGroupValidationService);

	BasicsCompanyControllingGroupValidationService.$inject = ['platformDataValidationService', 'basicsCompanyControllingGroupService'];

	function BasicsCompanyControllingGroupValidationService(platformDataValidationService, basicsCompanyControllingGroupService) {

		var service = {};
		var self = this;

		service.validateControllingGroupFk = function validateControllingGroupFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyControllingGroupService);
		};

		service.validateControllingGrpDetailFk = function validateControllingGrpDetailFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyControllingGroupService);
		};

		return service;
	}

})(angular);