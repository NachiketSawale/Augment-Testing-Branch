(function (angular) {
	'use strict';
	let moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeOrdStatusValidationService', BasicsCustomizeOrdStatusValidationService);
	BasicsCustomizeOrdStatusValidationService.$inject = ['platformDataValidationService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeOrdStatusValidationService(platformDataValidationService, basicsCustomizeInstanceDataService) {

		this.validateIsOrdered = function validateIsOrdered(entity, value) {
			if (value === false) {
				entity.IsFinallyBilled = false;
				entity.IsOrdered = false;
				basicsCustomizeInstanceDataService.markItemAsModified(entity);
				basicsCustomizeInstanceDataService.gridRefresh();
			}
			return {apply: value, valid: true};
		};

		this.validateIsFinallyBilled = function validateIsFinallyBilled(entity, value) {
			if (value === true) {
				entity.IsOrdered = true; // 'is finally billed' state implicitly includes 'is ordered state'
				basicsCustomizeInstanceDataService.markItemAsModified(entity);
				basicsCustomizeInstanceDataService.gridRefresh();
			} else {
				entity.IsFinallyBilled = false;
			}
			return {apply: value, valid: true};
		};

	}
})(angular);
