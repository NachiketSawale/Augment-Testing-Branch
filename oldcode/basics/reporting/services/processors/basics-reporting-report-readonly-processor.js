/**
 * Created by sandu on 14.09.2022.
 */
(function (angular) {
	'use strict';
	angular.module('basics.reporting').factory('basicsReportingReportReadonlyProcessor', basicsReportingReportReadonlyProcessor);
	basicsReportingReportReadonlyProcessor.$inject = ['platformRuntimeDataService'];

	function basicsReportingReportReadonlyProcessor(platformRuntimeDataService) {
		var service = {};
		service.processItem = function processItem(item) {
			if (item.StoreInDocuments === false) {
				platformRuntimeDataService.readonly(item, [
					{
						field: 'DocumentCategoryFk',
						readonly: true
					},
					{
						field: 'DocumentTypeFk',
						readonly: true
					},
					{
						field: 'RubricCategoryFk',
						readonly: true
					},
				]);
			}
			if (item.StoreInDocuments === true) {
				platformRuntimeDataService.readonly(item, [
					{
						field: 'DocumentCategoryFk',
						readonly: false
					},
					{
						field: 'DocumentTypeFk',
						readonly: false
					},
					{
						field: 'RubricCategoryFk',
						readonly: false
					},
				]);
			}
		};
		return service;
	}
})(angular);