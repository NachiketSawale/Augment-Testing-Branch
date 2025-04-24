/**
 * Created by cakiral on 06/10/2021.
 */
(function (angular) {

	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterDynamicConfigurationServiceFactory
	 * @function
	 *
	 * @description
	 * service factory for all module specific dynamic column layout service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('resourceMasterDynamicConfigurationServiceFactory', [
		'$injector', 'PlatformMessenger', 'mainViewService', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCostGroupAssignmentService', 'basicsCommonChangeColumnConfigService',
		function ($injector, PlatformMessenger, mainViewService, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCostGroupAssignmentService, basicsCommonChangeColumnConfigService) {

			function createNewComplete(standardConfigurationService, validationService, options) {
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

				var baseValidationService = angular.isString(validationService) ? $injector.get(validationService) : validationService;

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
					getStandardConfigForListView: getStandardConfigForListView,
					getStandardConfigForDetailView: getStandardConfigForDetailView,
					getStandardConfigForResourceMasterStructure: getStandardConfigForResourceMasterStructure,
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

				function getExtendColumns(dataDictionary) {
					var columnsToAttachForList = [];

					for (var prop in dataDictionary) {
						if (dataDictionary.hasOwnProperty(prop)) {
							columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
						}
					}
					return columnsToAttachForList;
				}

				function getDtoScheme() {
					var baseDtoScheme = baseCongigurationService.getDtoScheme();
					return baseDtoScheme;
				}

				function getStandardConfigForListView() {
					// add the extend columns to config for list
					var columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForList);

					var configForListCopy = angular.copy(baseCongigurationService.getStandardConfigForListView());

					configForListCopy.columns = configForListCopy.columns.concat(columnsToAttachForList);

					if (configForListCopy.addValidationAutomatically && baseValidationService) {
						platformGridControllerService.addValidationAutomatically(configForListCopy.columns, baseValidationService);
					}

					if (!configForListCopy.isTranslated) {
						platformTranslateService.translateGridConfig(configForListCopy.columns);
						configForListCopy.isTranslated = true;
					}

					return configForListCopy;
				}

				function getStandardConfigForResourceMasterStructure(){
					var costGroupColumns = null;

					if(!costGroupColumns){
						return baseCongigurationService.getStandardConfigForListView();
					}

					var configForListCopy = angular.copy(baseCongigurationService.getStandardConfigForListView());

					configForListCopy.columns = configForListCopy.columns.concat(costGroupColumns);

					if (configForListCopy.addValidationAutomatically && baseValidationService) {
						platformGridControllerService.addValidationAutomatically(configForListCopy.columns, baseValidationService);
					}

					if (!configForListCopy.isTranslated) {
						platformTranslateService.translateGridConfig(configForListCopy.columns);
						configForListCopy.isTranslated = true;
					}

					return configForListCopy;
				}

				function getStandardConfigForDetailView() {
					// add the extend columns to config for detail
					var columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForDetail);

					// initializeCostGroupForDetail(columnsToAttachForList);

					var configForDetailCopy = angular.copy(baseCongigurationService.getStandardConfigForDetailView());

					configForDetailCopy.rows = configForDetailCopy.rows.concat(columnsToAttachForList);

					return configForDetailCopy;
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

				getService: function (resourceMasterUIStandardService, validationService, options) {
					return createNewComplete(resourceMasterUIStandardService, validationService, options);
				},
				createService: function (resourceMasterUIStandardService, validationService, options) {
					return createNewComplete(resourceMasterUIStandardService, validationService, options);
				}
			};

		}]);
})(angular);