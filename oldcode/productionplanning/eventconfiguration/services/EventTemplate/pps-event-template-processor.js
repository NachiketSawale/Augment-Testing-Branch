/**
 * Created by anl on 11/6/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionplanningEventconfigurationTemplateProcessor', processor);

	processor.$inject = ['platformObjectHelper', 'platformRuntimeDataService', 'productionplanningEventconfigurationSequenceDataService',
		'$injector'];

	function processor(platformObjectHelper, platformRuntimeDataService, sequenceDataService) {
		var service = {};

		service.processItem = function (item) {
			var selected = sequenceDataService.getSelected();
			var hasParent = selected.EventSeqConfigFk !== null;

			//'leadtime', 'eventtypefk', 'sequenceorder',  'relationkindfk', 'mintime'
			service.setColumnsReadOnly(item, ['LeadTime'], !_.isUndefined(item.LastInSequence) ? item.LastInSequence : false);
			service.hideLeadTime(item, ['LeadTime']);
			service.setColumnsReadOnly(item, ['EventTypeFk'], hasParent);
			service.setColumnsReadOnly(item, ['SequenceOrder'], hasParent);
			service.setColumnsReadOnly(item, ['RelationKindFk'], hasParent);
			service.setColumnsReadOnly(item, ['MinTime'], hasParent);
		};

		service.hideLeadTime = function hideLeadTime(entity, field) {
			if (!_.isUndefined(entity.LastInSequence) && entity.LastInSequence) {
				platformRuntimeDataService.hideContent(entity, field, true);
			} else {
				platformRuntimeDataService.hideContent(entity, field, false);
			}
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
