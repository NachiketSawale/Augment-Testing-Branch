/**
 * Created by chi on 8/15/2015. Implemented by wuj.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCommonReadOnlyProcessor
	 * @function
	 *
	 * @description
	 */
	angular.module('basics.common').factory('basicsCommonReadOnlyProcessor',
		['platformSchemaService', 'platformRuntimeDataService', '$injector', '_',
			function (platformSchemaService, runtimeDataService, $injector, _) {
				function createReadOnlyProcessor(options) {

					const service = {};

					service.getCellEditable = function getCellEditable(item, model) {
						if (item && model) {
							return true;
						}
					};

					service.setFieldsReadOnly = function setFieldsReadOnly(item) {
						if (!options.readOnlyFields) {
							return;
						}

						if (item.__rt$data && item.__rt$data.readonly) {
							item.__rt$data.readonly = [];
						}

						const fields = [];
						angular.forEach(options.readOnlyFields, function (filed) {
							fields.push({
								field: filed,
								readonly: !service.getCellEditable(item, filed)
							});
						});

						runtimeDataService.readonly(item, fields);
					};

					service.setRowReadOnly = function setRowReadOnly(item, readOnly) {
						let properties = null, domains;
						if (!options.typeName || !options.moduleSubModule) {
							return;
						}
						if (!item) {
							item = service.getSelected();
						}

						if (!readOnly) {
							service.setFieldsReadOnly(item);
							return;
						}

						properties = [];
						domains = platformSchemaService.getSchemaFromCache({
							typeName: options.typeName,
							moduleSubModule: options.moduleSubModule
						}).properties;
						for (let prop in domains) {
							if (Object.prototype.hasOwnProperty.call(domains, prop)) {
								properties.push({field: prop, readonly: true});
							}
						}
						runtimeDataService.readonly(item, properties);
					};

					service.setRowReadonlyFromLayout = function (item, readOnly) {
						let properties = null, domains, uiStandardService;

						uiStandardService = $injector.get(options.uiStandardService);
						if (!uiStandardService) {
							return;
						}

						if (!item) {
							item = service.getSelected();
						}

						if (!readOnly) {
							service.setFieldsReadOnly(item);
							return;
						}

						properties = [];
						domains = _.map(uiStandardService.getStandardConfigForListView().columns, 'field');
						_.forEach(domains, function (value) {
							properties.push({field: value, readonly: true});
						}
						);
						runtimeDataService.readonly(item, properties);
					};

					service.setGridReadOnly = function setGridReadOnly(readOnly) {
						const itemList = service.getList();
						angular.forEach(itemList, function (item) {
							service.setReadOnlyRow(item, readOnly);
						});
					};

					service.handlerItemReadOnlyStatus = function () {
						return true;
					};

					service.processItem = function processItem(item) {
						if (item) {
							return service.handlerItemReadOnlyStatus(item);
						}
					};

					return service;
				}

				return {
					createReadOnlyProcessor: createReadOnlyProcessor
				};

			}]);
})(angular);