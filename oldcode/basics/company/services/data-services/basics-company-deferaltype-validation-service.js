/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyDeferaltypeValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyDeferaltypeValidationService', BasicsCompanyDeferaltypeValidationService);

	BasicsCompanyDeferaltypeValidationService.$inject = ['basicsCompanyDeferaltypeService', 'platformDataValidationService'];

	function BasicsCompanyDeferaltypeValidationService(basicsCompanyDeferaltypeService, platformDataValidationService) {
		var self = this;

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(basicsCompanyDeferaltypeService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						if(item.Id !== entity.Id) {
							item.IsDefault = false;
							basicsCompanyDeferaltypeService.markItemAsModified(item);
						}
					});
			}
			return { apply: true, valid: true };
		};

		self.validateCodeFinance = function (entity, value, model) {
			var items = basicsCompanyDeferaltypeService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, items, self, basicsCompanyDeferaltypeService);
		};

	}
})(angular);
