/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainDissolveAssemblyWizardDetailService
	 * @function
	 *
	 * @description
	 * estimateMainRuleRemoveDetailService is the data service for  Remove package wizard Grid
	 */
	estimateMainModule.factory('estimateMainDissolveAssemblyWizardDetailService', ['$http', '$injector', 'estimateMainService', 'platformTranslateService', 'PlatformMessenger', 'platformDataServiceFactory','estimateMainDissolvePlantAssemblyService',
		function ($http, $injector, estimateMainService, platformTranslateService, PlatformMessenger, platformDataServiceFactory,estimateMainDissolvePlantAssemblyService) {

			let service = {};
			let dataList = [];

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				onSelectionChanged: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				getList: getList,
				addItems: addItems,
				getDissolveAssemblies: getDissolveAssemblies
			});

			service.getColumnsReadOnly = function getColumnsReadOnly() {
				let columns = [
					{
						id: 'Selected',
						field: 'IsChecked',
						headerChkbox: true,
						toolTip: 'Select',
						name$tr$: 'estimate.main.dissolveAssemblyWizard.select',
						formatter: 'boolean',
						editor: 'boolean',
						width: 65,
						validator: 'isCheckedValueChange',
						isTransient: true
					},
					{
						id: 'EstAssemblyCatFk',
						field: 'EstAssemblyCatFk',
						name: 'Assembly Category',
						name$tr$: 'estimate.assemblies.estAssemblyCat',
						readonly: true,
						formatter: 'lookup',
						width: 125,
						formatterOptions: {
							lookupType: 'estassemblycat',
							displayMember: 'Code'
						}
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 100,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						grouping: {
							title: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Description',
						name: 'Description',
						width: 200,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'uom',
						field: 'BasUomFk',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Uom',
							displayMember: 'Unit'
						}
					},
					{
						id: 'costUnit',
						field: 'CostUnit',
						name$tr$: 'estimate.main.costUnit'
					}
				];
				return columns;
			};

			platformTranslateService.translateGridConfig(service.getColumnsReadOnly());

			let serviceOption;
			serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainDissolveAssemblyWizardDetailService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'Description'
						}]
				}
			};

			let container;
			container = platformDataServiceFactory.createNewComplete(serviceOption);

			service.setDataList = function (isWizardOpen,selectedScope) {

				if (isWizardOpen) {
					let projectId = estimateMainService.getSelectedProjectId();
					let estHeaderItem = estimateMainService.getSelectedEstHeaderItem();

					let isShowPlantAsOneRecord = estimateMainService.getShowPlantAsOneRecordOption();
					isShowPlantAsOneRecord = _.toLower(isShowPlantAsOneRecord) === 'true' || isShowPlantAsOneRecord === '1';

					let postData= {
						ProjectFk : projectId,
						EstHeaderFk : estHeaderItem ? estHeaderItem.Id : null,
						SelectedLevel : getEstimateScope(selectedScope),
						IsShowPlantAsOneRecord : isShowPlantAsOneRecord
					};

					if (selectedScope === 2) {
						postData.EstLineItems = estimateMainService.getSelectedEntities();
					} else if (selectedScope === 1) {
						postData.EstLineItems = estimateMainService.getList();
					}

					return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/getdissolveassemblies', postData).then(function (response) {
						if (response && response.data) {
							dataList = null;
							estimateMainDissolvePlantAssemblyService.setDataList(isWizardOpen,true);
							addItems(response.data.Item1);
							estimateMainDissolvePlantAssemblyService.addItems(response.data.Item2);
						} else {
							return '';
						}
					});
				} else {
					dataList = null;
					estimateMainDissolvePlantAssemblyService.setDataList(isWizardOpen,false);
				}
			};

			function getEstimateScope(estimateScope) {
				if (estimateScope === 1 || estimateScope === 2) {
					return 'SelectedLineItems';
				} else if (estimateScope === 0) {
					return 'AllItems';
				}
			}

			angular.extend(service, container.service);

			service.getStandardConfigForListView = function () {
				return {
					columns: service.getColumnsReadOnly()
				};
			};

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function getList() {
				return dataList;
			}

			function addItems(items) {
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = dataList ? dataList : [];
				angular.forEach(items, function (item) {
					let matchItem = _.find(dataList, {Code: item.Code});
					if (!matchItem) {
						dataList.push(item);
					}
				});
				container.data.itemList = dataList;
				service.refreshGrid();
			}

			function getDissolveAssemblies() {
				let filteredList = [];

				if (dataList && dataList.length) {
					filteredList = _.filter(dataList, function (item) {
						return item.IsChecked;
					});
				}
				container.data.itemList = dataList;
				return filteredList;
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			service.getSelectedPackages = function getSelectedItems() {
				let resultSet = service.getSelectedEntities();
				return resultSet;
			};

			service.parentService = function parentService() {
				return estimateMainService;
			};
			return service;
		}]
	);
})();
