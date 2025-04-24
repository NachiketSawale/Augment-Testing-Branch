
(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.configuration');

	module.factory('controllingConfigurationColumnDefinitionDataService', ['_','$injector','platformDataServiceFactory','platformRuntimeDataService',
		function (_,$injector,platformDataServiceFactory, platformRuntimeDataService) {
			let serviceOptions = {
				flatRootItem: {
					module: module,
					serviceName: 'controllingConfigurationColumnDefinitionDataService',
					entityNameTranslationID: 'controlling.configuration.ConfColumnDefinitionTitle',
					httpRead: {
						route: globals.webApiBaseUrl + 'Controlling/Configuration/ContrColumnPropDefController/',
						endRead: 'getColumnDefinitionList',
						usePostForRead: true
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'Controlling/Configuration/ContrColumnPropDefController/', endUpdate: 'update'
					},
					presenter: {
						list: {
							incorporateDataRead:function (readData, data) {
								return data.handleReadSucceeded(readData ? readData : [], data);
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'ContrColumnPropDefToSave',
							moduleName: 'controlling.configuration.title',
							mainItemName: 'controllingConfigurationColumnDefinition',
							codeField: 'Code',
							descField: 'Description.Translated',
							handleUpdateDone: function (updateData, response, data) {
								service.handleOnUpdate(updateData, response, data, true);
								$injector.get('controllingConfigurationFormulaDefinitionDataService').handleOnUpdate(updateData, response);
								$injector.get('controllingConfigChartConfigDataService').handleOnUpdate(updateData, response);
								$injector.get('controllingConfigVersionCompareDataService').handleOnUpdate(updateData, response);
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {},
					dataProcessor: [{processItem: function processItem(item) {
							platformRuntimeDataService.readonly(item, [{field: 'Aggregates', readonly: true}]);
						}}],
					translation: {
						uid: 'controllingConfigurationColumnDefinitionDataService',
						title: 'controlling.configuration.ConfColumnDefinitionTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'Description'}],
						dtoScheme: {
							typeName: 'MdcContrColumnPropDefDto',
							moduleSubModule: 'Controlling.Configuration'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'controlling.configuration',
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;

			service.isReadonly = function isReadonly(){
				return true;
			};

			service.handleOnUpdate = function (updateData, response, data) {
				serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
			};
			return service;
		}]);
})();
