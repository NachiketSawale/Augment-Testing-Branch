(function (angular) {
	'use strict';
	let moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeBidTypeValidationService', BasicsCustomizeBidTypeValidationService);
	BasicsCustomizeBidTypeValidationService.$inject = ['platformDataValidationService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeBidTypeValidationService(platformDataValidationService, basicsCustomizeInstanceDataService) {

		this.validateIsMain = function validateIsMain(entity, value) {
			if(value === true) {
				entity.IsChange = false;
				entity.IsSide = false;
				basicsCustomizeInstanceDataService.markItemAsModified(entity);
				basicsCustomizeInstanceDataService.gridRefresh();
			}else{
				entity.IsMain = false;
			}
			return { apply: value, valid: true };
		};

		this.validateIsChange = function validateIsChange(entity, value) {
			if(value === true) {
				entity.IsMain = false;
				entity.IsSide = false;
				basicsCustomizeInstanceDataService.markItemAsModified(entity);
				basicsCustomizeInstanceDataService.gridRefresh();
			}else{
				entity.IsChange = false;
			}
			return { apply: value, valid: true };
		};

		this.validateIsSide = function validateIsSide(entity, value) {
			if(value === true) {
				entity.IsMain = false;
				entity.IsChange = false;
				basicsCustomizeInstanceDataService.markItemAsModified(entity);
				basicsCustomizeInstanceDataService.gridRefresh();
			}else{
				entity.IsSide = false;
			}
			return { apply: value, valid: true };
		};

	}
})(angular);
