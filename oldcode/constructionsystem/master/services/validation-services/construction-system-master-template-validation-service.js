/**
 * Created by chi on 6/3/2016.
 */
(function(angular) {
	'use strict';

	angular.module('constructionsystem.master').factory('constructionSystemMasterTemplateValidationService', constructionSystemMasterTemplateValidationService);
	constructionSystemMasterTemplateValidationService.$inject = ['basicsLookupdataLookupDescriptorService'];
	function constructionSystemMasterTemplateValidationService(basicsLookupdataLookupDescriptorService) {
		return function (dataService) {
			var service = {};
			service.validateIsDefault = validateIsDefault;
			service.validateDescriptionInfo = updateLookupValue;
			service.validateSorting = updateLookupValue;
			return service;

			// /////////////////////////////////
			function validateIsDefault(entity, value, model) {
				updateIsDefault(entity, value, model);
				return {apply: true, valid: true};
			}

			function updateIsDefault(entity, value, model) {
				dataService.getList().forEach(function (item) {
					if (item !== entity && value && item[model]) {
						item[model] = false;
						dataService.markItemAsModified(item);
						basicsLookupdataLookupDescriptorService.updateData('CosTemplate', [entity]);
						dataService.gridRefresh();
					}
				});
			}

			function updateLookupValue(entity) {
				basicsLookupdataLookupDescriptorService.updateData('CosTemplate', [entity]);
				return {apply: true, valid: true};
			}
		};
	}
})(angular);