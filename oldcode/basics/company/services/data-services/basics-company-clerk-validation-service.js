/**
 * Created by henkel on 11.11.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyClerkValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyClerkValidationService', BasicsCompanyClerkValidationService);

	BasicsCompanyClerkValidationService.$inject = ['basicsCompanyClerkService', 'platformDataValidationService'];

	function BasicsCompanyClerkValidationService(basicsCompanyClerkService, platformDataValidationService) {
		var self = this;

		this.validateValidFrom = function validateStartDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, basicsCompanyClerkService, 'ValidTo');
		};

		this.validateValidTo = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, basicsCompanyClerkService, 'ValidFrom');
		};
	}
})(angular);