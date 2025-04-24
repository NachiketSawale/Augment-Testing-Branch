(function (angular) {

	'use strict';
	var moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonDynamicStructureServiceFactory
	 * @function
	 *
	 * @description
	 * service factory for all module dynamic structure service
	 */
	angular.module(moduleName).factory('basicsCommonDynamicStructureServiceFactory', [
		'$injector', 'PlatformMessenger', 'mainViewService', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCostGroupAssignmentService', 'basicsCommonChangeColumnConfigService',
		function ($injector, PlatformMessenger, mainViewService, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCostGroupAssignmentService, basicsCommonChangeColumnConfigService) {

			function createNewComplete(standardConfigurationService, options) {
				var data = {
					parentScope: {},
					isInitialized: false,

					// Unique identifier for current container
					uuid: null,

					groupName: 'assignments',

					onConfigLayoutChange: new PlatformMessenger(),

					allColumns: [],

					// dynamic columns dictionary for list
					dynamicColDictionaryForList: {},

					dynamicColDictionaryForDetail: {}
				};

				angular.extend(data, options);

				var baseCongigurationService = angular.isString(standardConfigurationService) ? $injector.get(standardConfigurationService) : standardConfigurationService;

				var service = { isExtendService : true };

				angular.extend(service, {
					registerSetConfigLayout: registerSetConfigLayout,
					unregisterSetConfigLayout: unregisterSetConfigLayout,
					fireRefreshConfigLayout: fireRefreshConfigLayout,

					applyToScope: applyToGridId,

					// Do not attach all dynamic columns in a single object, better separate by types
					// for list view
					attachData: attachDataForList,
					detachData: detachDataForList,
					detachDataItemByKey: detachDataItemByKey,

					// for detail form
					attachDataForDetail: attachDataForDetail,
					detachDataForDetail: detachDataForDetail,

					appendData: appendDataForList,

					getDtoScheme: getDtoScheme,
					getStandardConfigForStructure: getStandardConfigForStructure,
					showLoadingOverlay: showLoadingOverlay,
					hideLoadingOverlay: hideLoadingOverlay,
					resolveColumns: resolveColumns
				});

				return service;

				// Attach column as object
				function attachData(dataDictionary, dataObject) {
					if (!angular.isObject(dataObject)) {
						return;
					}

					for (var prop in dataObject) {
						if (dataObject.hasOwnProperty(prop)) {
							dataDictionary[prop] = dataObject[prop];
						}
					}
				}

				function attachDataForList(dataObject) {
					attachData(data.dynamicColDictionaryForList, dataObject);
				}

				function attachDataForDetail(dataObject) {
					attachData(data.dynamicColDictionaryForDetail, dataObject);
				}

				function appendData(dataDictionary, dataObject){
					if (!angular.isObject(dataObject)) {
						return;
					}

					for (var prop in dataObject) {
						if (dataObject.hasOwnProperty(prop)) {
							if (dataDictionary.hasOwnProperty(prop)===false){
								dataDictionary[prop]=[];
							}
							_.forEach(dataObject[prop], function (propDataObject) {
								if (_.findIndex(dataDictionary[prop], {id: propDataObject.id}) === -1){
									dataDictionary[prop].push(propDataObject);
								}
							});
						}
					}
				}

				function appendDataForList(dataObject){
					appendData(data.dynamicColDictionaryForList, dataObject);
				}

				// detach columns
				function detachData(dataDictionary, dataObjectKey) {
					if (dataDictionary.hasOwnProperty(dataObjectKey)) {
						delete dataDictionary[dataObjectKey];
					}
				}

				// detach column by key
				function detachDataByKey(dataDictionary, dataObjectKey, dataItemKey) {
					if (dataDictionary.hasOwnProperty(dataObjectKey)) {
						if (_.findIndex(dataDictionary[dataObjectKey], {id: dataItemKey}) > -1){
							_.remove(dataDictionary[dataObjectKey], {id: dataItemKey});
						}
					}
				}

				function showLoadingOverlay() {
					data.parentScope.isLoading = true;
				}

				function hideLoadingOverlay() {
					data.parentScope.isLoading = false;
				}

				function detachDataForList(dataObjectKey) {
					detachData(data.dynamicColDictionaryForList, dataObjectKey);
				}

				function detachDataForDetail(dataObjectKey) {
					detachData(data.dynamicColDictionaryForDetail, dataObjectKey);
				}

				function detachDataItemByKey(dataObjectKey, dataItemKey){
					detachDataByKey(data.dynamicColDictionaryForList, dataObjectKey, dataItemKey);
				}

				function getStandardConfigForStructure(){
					return baseCongigurationService.getStandardConfigForListView();
				}

				function getDtoScheme() {
					return baseCongigurationService.getDtoScheme();
				}

				function registerSetConfigLayout(callBackFn) {
					data.onConfigLayoutChange.register(callBackFn);
				}

				function unregisterSetConfigLayout(callBackFn) {
					data.onConfigLayoutChange.unregister(callBackFn);
				}

				function fireRefreshConfigLayout() {
					data.onConfigLayoutChange.fire(arguments);

					refreshGridLayout();
				}

				function applyToGridId(scope) {
					data.parentScope = scope;
					data.uuid = scope.gridId;
				}

				function refreshGridLayout() {
					if (data) {
						if (data.uuid) {
							var gridId = data.uuid;
							var grid = platformGridAPI.grids.element('id', gridId);
							if (grid) {
								data.allColumns = resolveColumns(gridId);

								platformGridAPI.columns.configuration(gridId, angular.copy(data.allColumns));
								platformGridAPI.grids.resize(gridId); // persist scroll bars
							}
						}
					}
				}

				// Resolve column order, visible, hidden status
				function resolveColumns(gridId, dynamicColumns) {
					// Take all columns again and map it with the cached grid's column configuration for sorting and hide/show status
					var columns = dynamicColumns ? dynamicColumns : service.getStandardConfigForListView().columns; // grid.columns.current;

					return basicsCommonChangeColumnConfigService.mergeWithViewConfig(gridId, columns);
				}
			}
			return {

				getService: function (standardConfigurationService, options) {
					return createNewComplete(standardConfigurationService, options);
				},
				createService: function (standardConfigurationService, options) {
					return createNewComplete(standardConfigurationService, options);
				}
			};

		}]);
})(angular);