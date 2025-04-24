/**
 * Created by anl on 4/13/2017.
 * Drastically improved by baf on 2018-02-14
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeResourceTypeValidationService', BasicsCustomizeResourceGroupValidationService);
	BasicsCustomizeResourceGroupValidationService.$inject = ['platformDataValidationService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeResourceGroupValidationService(platformDataValidationService, basicsCustomizeInstanceDataService) {
		var self = this;
		this.validateCode = function validateCode(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsCustomizeInstanceDataService.getList(), self, basicsCustomizeInstanceDataService);
		};
	}
})(angular);
