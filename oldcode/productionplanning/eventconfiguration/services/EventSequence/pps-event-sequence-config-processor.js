/**
 * Created by anl on 6/12/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionplanningEventconfigurationSequenceProcessor', processor);

	processor.$inject = ['platformRuntimeDataService',
		'$injector'];

	function processor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			service.setColumnsReadOnly(item, ['EventSeqConfigFk'], item.IsTemplate);

			var hasParent = item.EventSeqConfigFk !== null;
			service.setColumnsReadOnly(item, ['IsTemplate'], hasParent);
			//service.setColumnsReadOnly(item, ['SeqEventSplitFromFk'], hasParent);
			//service.setColumnsReadOnly(item, ['SeqEventSplitToFk'], hasParent);
		};
		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);
