/**
 * Created by henkel on 11.11.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanySurchargeValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanySurchargeValidationService', BasicsCompanySurchargeValidationService);

	BasicsCompanySurchargeValidationService.$inject = ['basicsCompanySurchargeService'];

	function BasicsCompanySurchargeValidationService(basicsCompanySurchargeService) {
		var self = this;

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(basicsCompanySurchargeService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						item.IsDefault = false;
						basicsCompanySurchargeService.markItemAsModified(item);
					});
				basicsCompanySurchargeService.markItemAsModified(entity);
				basicsCompanySurchargeService.gridRefresh();
			}
			return { apply: value, valid: true };
		};

	}
})(angular);