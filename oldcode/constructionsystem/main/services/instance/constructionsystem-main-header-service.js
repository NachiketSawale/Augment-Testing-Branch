/**
 * Created by xsi on 2016-03-11.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainHeaderService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service of constructionsystem.main master grid/form controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainHeaderService', [
		'platformDataServiceFactory',
		'basicsLookupdataLookupFilterService',
		function (platformDataServiceFactory, basicsLookupdataLookupFilterService) {

			var container = null;
			var allData;
			var filterData = {
				searchValue: '',
				groupValues: []
			};
			var cosMasterTemporaryDatas = [];
			let itemCheckStatusPrevious = {};

			var serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainHeaderService',
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/master/header/',
						usePostForRead: true,
						extendSearchFilter: function (filterRequest) {
							filterRequest.Pattern = filterData.searchValue;
							if (filterData.groupValues.length > 0) {
								filterRequest.furtherFilters = _.map(filterData.groupValues, function (group) {
									return {
										Token: 'COSGROUP',
										Value: group
									};
								});
							} else {
								filterRequest.furtherFilters = [];
							}
							filterRequest.PageNumber = null;
							filterRequest.PageSize = null;
							filterRequest.IsEnhancedFilter = false;
							filterRequest.EnhancedFilterDef = null;
						}
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName + '.instance.header',
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: true,
							withExecutionHints: false
						}
					},
					entityRole: {
						root: {
							itemName: 'ConstructionSystemMaster',
							// Fix Defect #114772 - Object Authorization Lost in CoS Takeoff
							// While click cos header data item, object permission disappears
							rootForModule: moduleName,
							lastObjectModuleName: moduleName
						}
					},
					actions: { delete: false, create: false }
				}
			};

			container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service;
			var data = container.data;

			data.doUpdate = null;

			service.selectedItems = [];
			// disable display information of the selected root item to the header bar.
			service.setShowHeaderAfterSelectionChanged(null);

			service.getAllData = function () {
				return allData;
			};

			service.reloadBySelectedGroup = function reloadBySelectedGroup(values) {
				if (!angular.isArray(values)) {
					values = [values];
				}
				filterData.groupValues = values;
				service.load();
			};

			service.getSelectedGroupId = function getSelectedGroupId() {
				return filterData.groupValues && filterData.groupValues.length > 0 ? filterData.groupValues[0]
					: null;
			};

			service.setFilterData = function setFilterData(newFilterData) {
				angular.extend(filterData, newFilterData);
			};

			function incorporateDataRead(readData, data) {
				/** @namespace readData.DefaultGroupId */
				allData = readData.dtos;
				recoverTemporaryDatas(allData);
				data.handleReadSucceeded(allData, data);
				filterData.groupValues=[];
						}

			var lookupFilters = [
				{
					key: 'construction-system-main-instance-master-template-filter',
					fn: function (context) {
						var current = service.getSelected();
						if (current && angular.isDefined(current.Id)) {
							return context.CosHeaderFk === current.Id;
						}

						return false;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

			service.isCheckedValueChange = function (selectItem, newValue) {
				itemCheckStatusPrevious[selectItem.Id] = selectItem.IsChecked; // cache the value previous
				saveCosMasterCheckFlag(selectItem.Id, newValue);
				return true;
			};

			service.saveSelectedTemplate = function (cosMasterId, cosTemplateId) {
				var cosMasterTemporaryData = getCosMasterTemporaryData(cosMasterId);
				if(cosMasterTemporaryData === null)
				{
					cosMasterTemporaryData = {
						cosMasterId: cosMasterId,
						cosTemplateId: cosTemplateId
					};

					cosMasterTemporaryDatas.push(cosMasterTemporaryData);
				}
				else{
					cosMasterTemporaryData.cosTemplateId = cosTemplateId;
				}
			};

			service.clearItemCheckStatusPrevious = function () {
				itemCheckStatusPrevious = {};
			}

			// cache the is checked value before changed
			Object.defineProperty(service, 'itemCheckStatusPrevious', {
				get: function () {
					return itemCheckStatusPrevious
				}
			});

			function saveCosMasterCheckFlag(cosMasterId, cosMasterChecked) {
				var cosMasterTemporaryData = getCosMasterTemporaryData(cosMasterId);
				if(cosMasterTemporaryData === null)
				{
					cosMasterTemporaryData = {
						cosMasterId: cosMasterId,
						cosMasterChecked: cosMasterChecked
					};

					cosMasterTemporaryDatas.push(cosMasterTemporaryData);
				}
				else{
					cosMasterTemporaryData.cosMasterChecked = cosMasterChecked;
				}
			}

			function recoverTemporaryDatas(items){
				_.forEach(items, function(item){
					var cosMasterTemporaryData = getCosMasterTemporaryData(item.Id);
					if (item.IsChecked === undefined) {
						item.IsChecked = false; // set the default value
					}
					if(cosMasterTemporaryData !== null) {
						item.CosTemplateFk = cosMasterTemporaryData.cosTemplateId;
						item.IsChecked = cosMasterTemporaryData.cosMasterChecked;
					}
				});
			}

			function getCosMasterTemporaryData(cosMasterId){
				var cosMasterTemporaryData = null;
				for(var i = 0; i < cosMasterTemporaryDatas.length; ++i){
					if(cosMasterTemporaryDatas[i].cosMasterId === cosMasterId){
						cosMasterTemporaryData = cosMasterTemporaryDatas[i];
						break;
					}
				}

				return cosMasterTemporaryData;
			}

			return service;
		}
	]);
})(angular);