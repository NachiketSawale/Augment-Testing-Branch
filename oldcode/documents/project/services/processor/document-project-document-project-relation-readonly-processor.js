(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('documents.project').factory('documentsProjectDocumentRelationReadonlyProcessorFactory',
		['_','platformRuntimeDataService', 'documentsProjectDocumentModuleContext',
			function (_,platformRuntimeDataService,
				ModuleContext) {

				function GetRelationReadonlyProcessor(options) {
					options.readOnlyFields = options.readOnlyFields || [];
					options.dependField = options.dependField || '';

					var service = {};

					service.updateReadOnlyFiled = function setFieldsReadOnly(item) {
						if (!options.readOnlyFields) {
							return;
						}
						var fields = [];
						angular.forEach(options.readOnlyFields, function (filed) {
							fields.push({
								field: filed,
								readonly: !service.getCellEditable(item, filed)
							});
						});

						platformRuntimeDataService.readonly(item, fields);
					};
					service.getCellEditable = function getCellEditable(item, filed) {
						var columnConfig = ModuleContext.getConfig().columnConfig;
						var filedInColumnConfig = _.find(columnConfig, function (item) {
							return item.documentField === filed;
						});
						var filedInReadOnlyFields = _.find(options.readOnlyFields, function (item) {
							return item === filed;
						});
						if (filedInColumnConfig && filedInReadOnlyFields) {
							return !filedInColumnConfig.readOnly && !!item[options.dependField];
						}
						if (!filedInColumnConfig) {
							return false;
						}
					};
					service.handlerItemReadOnlyStatus = function handlerItemReadOnlyStatus(item) {
						service.updateReadOnlyFiled(item);
					};
					service.processItem = function processItem(item) {
						if (item) {
							return service.handlerItemReadOnlyStatus(item);
						}
					};

					return service;
				}

				return {
					GetRelationReadonlyProcessor: GetRelationReadonlyProcessor
				};

			}]);
})(angular);