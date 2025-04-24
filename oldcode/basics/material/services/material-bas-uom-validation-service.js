/**
 * Created by yew on 9/25/2019.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterial2basUomValidationService', basicsMaterial2basUomValidationService);

	basicsMaterial2basUomValidationService.$inject = ['platformDataValidationService', 'platformRuntimeDataService',
		'basicsMaterial2basUomDataService', '$translate'];
	function basicsMaterial2basUomValidationService(platformDataValidationService,platformRuntimeDataService,dataService,$translate){

		var service = {};
		service.validateBasUomFk = function (entity, value, model) {
			var result = platformDataValidationService.isMandatory(value, model);
			if (result.apply) {
				result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, true);
				if (!result.apply) {
					result.error = result.error$tr$ = $translate.instant('basics.material.uomUniqueError');
				}
			}
			entity.BasUomFk = value;
			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			return result;
		};


		// Dev-17787 change allow no default
		service.validateIsDefaultForInternalDelivery = function validateIsDefaultForInternalDelivery(entity, value) {
			dataService.getList().forEach(uom => uom.IsDefaultForInternalDelivery = false);
			entity.IsDefaultForInternalDelivery = value;
			dataService.markItemAsModified(entity);
			dataService.gridRefresh();
			return {apply: value, valid: true};
		};


		return service;

	}
})(angular);