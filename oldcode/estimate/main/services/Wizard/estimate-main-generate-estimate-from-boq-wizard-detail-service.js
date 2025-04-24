/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainGenerateEstimateFromBoqWizardDetailService
	 * @function
	 *
	 * @description
	 * estimateMainGenerateEstimateFromBoqWizardDetailService is the data service for GenerateEstimate from Boq wizard Grid
	 */
	estimateMainModule.factory('estimateMainGenerateEstimateFromBoqWizardDetailService', ['$q','_','$http','$translate', '$injector','estimateMainService','platformTranslateService',
		'PlatformMessenger', 'platformDataServiceFactory','basicsLookupdataLookupFilterService','platformGridAPI','estimateMainGenerateEstimateFromBoqWizardProcessService',
		'platformRuntimeDataService',
		function ($q,_,$http,$translate,$injector, estimateMainService,platformTranslateService, PlatformMessenger, platformDataServiceFactory,basicsLookupdataLookupFilterService,platformGridAPI,
			estimateMainGenerateEstimateFromBoqWizardProcessService,platformRuntimeDataService) {

			let estMainTypesBoqProjectLookupInfo= {
				1: { // Project Lookup 18dfd7591a2f4f0abc0daaa21265128c
					column: 'projectWicCode',
					lookup: {
						navigator: {
							moduleName: $translate.instant('project.main'),
							navFunc: function (item, triggerField) {
								let naviService = $injector.get('platformModuleNavigationService');
								let navigator = naviService.getNavigator('project.main');
								naviService.navigate(navigator, triggerField, item.field);
							}
						},
						directive: 'boq-Main-Project-Lookup-Dialog',
						options: {
							lookupDirective: 'boq-Main-Project-Lookup-Dialog',
							descriptionMember: 'ProjectName',
							usageContext: 'estimateMainService',
						},
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}
					}
				},
				2 : { // WIC Group Dropdown a9fb4e9d22324c8f88804c7de818fc3d
					column: 'projectWicCode',
					lookup: {
						directive: 'estimate-main-est-wic-group-lookup',
						options: {
							lookupDirective: 'estimate-main-est-wic-group-lookup',
							descriptionMember: 'DescriptionInfo.Description',
							usageContext: 'estimateMainService',
							gridOptions: {
								multiSelect: true
							}
						},
						formatterOptions: {
							lookupType: 'WicGroup',
							displayMember: 'Code'
						}
					}
				}};

			let service = {};
			let dataList = [];

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				onSelectionChanged: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				getList: getList,
				addItems: addItems,
				createItem: createItem,
				parentService:parentService,
				deleteItem: deleteItem,
			});

			service.getColumns = function getColumns() {
				let columns = [
					{
						id: 'type',
						field: 'Type',
						name: 'type',
						width: 70,
						toolTip: 'type',
						name$tr$: 'estimate.main.type',
						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-generate-estimate-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'typeprojectorwic',
							displayMember: 'Code',
							dataServiceName: 'estimateMainTypeBoqProjectLookupDataService'
						},
						mandatory: true,
						required: true,
					},
					{
						id: 'projectWicCode',
						field: 'ProjectWicId',
						name: 'projectWicCode',
						width: 150,
						toolTip: 'Project/Wic Code',
						name$tr$: 'estimate.main.projectWicCode',
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							let prop = estMainTypesBoqProjectLookupInfo[item.Type];
							if (prop && prop.column) {
								column.editorOptions = {
									directive: prop.lookup.options.lookupDirective,
									lookupOptions: {
										showClearButton: true,
										descriptionMember: prop.lookup.options.descriptionMember,
										gridOptions: prop.lookup.options.gridOptions,
										usageContext: prop.lookup.options.usageContext,
										lookupOptions:{
											filterAssemblyKey: prop.lookup.options.filterAssemblyKey
										}
									}
								};
								if(item.Type === 1 ){
									column.formatterOptions = {
										lookupType: 'project',
										displayMember: 'ProjectNo'
									};
								} else {
									column.formatterOptions = {
										lookupType: 'WicGroup',
										displayMember: 'Code'
									};
								}
								column.navigator = prop.lookup.navigator;
							} else {
								column.editorOptions = {readonly: true};
								column.formatterOptions = null;
							}
							return 'lookup';
						},
						mandatory: true,
						required: true,
					},
					{
						id: 'projectWicCodeDescription',
						field: 'ProjectWicId',
						name: 'Project/WIC Code Description',
						name$tr$: 'estimate.main.projectWicCodeDescription',
						toolTip: 'Project/WIC Code Description',
						formatter: 'dynamic',
						domain: function (item, column) {
							let prop = estMainTypesBoqProjectLookupInfo[item.Type];
							if (prop && prop.column) {
								column.formatterOptions = prop.lookup.formatterOptions;
								column.formatterOptions.displayMember = prop.lookup.options.descriptionMember;
								column.navigator = prop.lookup.navigator;
							} else {
								column.formatterOptions = null;
							}
							column.editorOptions = {readonly: true};
							return 'lookup';
						},
						readonly: true,
						width: 170
					},
					{ // boqMainCopySourceBoqLookupController
						id: 'boqHeaderFk',
						field: 'RootItemId',
						name: 'BoQ Code',
						width: 75,
						toolTip: 'Boq Code',
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'basics-lookup-data-by-custom-data-service',
							descriptionMember: 'Description',
							lookupOptions: {
								dataServiceName: 'boqHeaderLookupDataService',
								valueMember: 'BoqNumber',
								displayMember: 'BoqNumber',
								filter: function (entity) {
									// using master data filter for the wic group lookup
									let filterIds = $injector.get('estimateProjectRateBookConfigDataService').getFilterIds(3);
									let boqMainBoqTypes = $injector.get('boqMainBoqTypes');
									return {
										boqType: entity.Type === 1  ? boqMainBoqTypes.project : boqMainBoqTypes.wic,
										boqGroupId:  entity.Type === 2  ? entity.ProjectWicId ? entity.ProjectWicId : 0 : 0,
										projectId: entity.Type === 1  ? entity.ProjectWicId ? entity.ProjectWicId : 0  : 0, // 1003572,
										prcStructureId: 0,
										boqFilterWicGroupIds: filterIds
									};
								},
								disableDataCaching: true,
								filterOnSearchIsFixed: true,
								isClientSearch: true,
								columns: [
									{
										id: 'BoqNumber',
										field: 'BoqNumber',
										name: 'BoqNumber',
										formatter: 'code',
										name$tr$: 'boq.main.boqNumber'
									},
									{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}
								],
								events: [
									{
										name: 'onSelectedItemChanged', // register event and event handler here.
										handler: function (e, args) {
											let selectedItem = args.selectedItem;
											let currentItem = args.entity;
											currentItem.SourceBoqHeaderFk = selectedItem ? selectedItem.BoqHeaderFk : null;
											currentItem.StructureName = selectedItem ? 'Boq' : '';
											currentItem.StructureId = selectedItem ? $injector.get('estimateMainParamStructureConstant').BoQs : null;
											currentItem.BoqRootItemDescription = selectedItem ? selectedItem.Description : '';
										}

									}
								],
								popupOptions: {
									width: 250
								},
								showClearButton: true
							}
						},
						mandatory: true,
						required: true,
					},
					{
						id: 'boqHeaderFkDescription',
						field: 'BoqRootItemDescription',
						name: 'BoqDescription',
						width: 90,
						toolTip: 'BoqDescription',
						name$tr$: 'estimate.main.boqDescription',
						formatter:'description'
					},
					{ // 434bdad9cbdc4909a68f501cb672c575
						id: 'estheaderid',
						field: 'EstHeaderId',
						name: 'GenerateEstimateCode',
						width: 95,
						toolTip: 'Estimate Code',
						type:'directive',
						editor: 'lookup',
						filterKey: 'estimate-main-copy-source-header-filter-generate-estimate',
						editorOptions: {
							directive: 'estimate-main-document-project-lookup',
							filterKey: 'estimate-main-copy-source-header-filter-generate-estimate',
							lookupOptions: {
								'filterKey': 'estimate-main-copy-source-header-filter-generate-estimate',
								'additionalColumns': true,
								'displayMember': 'Code'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'estimate-main-document-project-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'estimate-main-copy-source-header-filter'
								}
							}
						},
						formatter:'lookup',
						formatterOptions: {
							lookupType: 'EstimateMainHeader',
							displayMember: 'Code',
							directive:'estimate-main-document-project-lookup',
						},
						name$tr$: 'estimate.main.generateEstimateCode',
					},
					{
						id: 'estheaderdescription',
						field: 'EstHeaderId',
						name: 'GenerateEstimateDescription',
						width: 110,
						toolTip: 'Estimate Description',
						formatter:'lookup',
						formatterOptions:{
							lookupType: 'EstimateMainHeader',
							displayMember: 'DescriptionInfo.Translated'
						},
						name$tr$: 'estimate.main.generateEstimateDescription'
					}
				];
				return columns;
			};

			let filters = [
				{
					key: 'estimate-main-copy-source-header-filter-generate-estimate',
					serverSide: true,
					serverKey: 'estimate-main-copy-source-header-filter-generate-estimate',
					fn: function(item) {
						return {
							projectId: item && angular.isDefined(item) && item.Type === 1 ? item.ProjectWicId : 0,
							boqHeaderId: item && angular.isDefined(item) ? item.SourceBoqHeaderFk : 0
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			platformTranslateService.translateGridConfig(service.getColumns());

			let serviceOption;
			serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {}
			};

			let container;
			container = platformDataServiceFactory.createNewComplete(serviceOption);

			service.setDataList= function(data) {
				addItems(data);
				container.data.itemList = dataList;
			};

			angular.extend(service, container.service);

			service.getStandardConfigForListView = function () {
				return {
					columns: service.getColumns(),
					addValidationAutomatically:true
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

			function createItem() {
				let id = container.data.itemList ? ((container.data.itemList.length)+1) : 1;

				let item = [{ Id:id, Type: 1 ,Sorting: id,Version :0}];

				addItems(item);
				service.setSelected(item);

				estimateMainGenerateEstimateFromBoqWizardProcessService.processItem(item);

				platformRuntimeDataService.applyValidationResult({
					valid: false,
					error: '...',
					error$tr$: 'estimate.main.projectWicCodeEmptyErrMsg'
				}, item[0], 'ProjectWicId');

				platformRuntimeDataService.applyValidationResult({
					valid: false,
					error: '...',
					error$tr$: 'estimate.main.boqCodeEmptyErrMsg'
				}, item[0], 'RootItemId');

				platformRuntimeDataService.applyValidationResult({
					valid: false,
					error: '...',
					error$tr$: 'estimate.main.estimateCodeEmptyErrMsg'
				}, item[0], 'EstHeaderId');

				return $q.when(item);
			}

			function addItems(items) {
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = dataList ? dataList : [];
				angular.forEach(items, function (item) {
					let matchItem = _.find(dataList, {Id: item.Id});
					if (!matchItem) {
						dataList.push(item);}
				});
				container.data.itemList = dataList;
				service.refreshGrid();
			}

			function deleteItem(selectedItem) {
				const index = dataList.indexOf(selectedItem);
				if (index !== -1) {
					dataList.splice(index, 1);
				}
				service.refreshGrid();
			}

			service.moveUp = function moveUp(type,grid) {
				service.moveSelectedItemTo(type,grid);
			};

			service.moveDown = function moveDown(type,grid) {
				service.moveSelectedItemTo(type,grid);
			};

			service.moveSelectedItemTo = function moveSelectedItemTo(type, gridId) {

				let items = platformGridAPI.items.data(gridId);
				let selectedData = getGridSelectedInfos(gridId);
				let i;

				selectedData.selectedRows = sortNumber(selectedData.selectedRows);

				switch (type) {
					case 1:
						// moveUp
						for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] - 1 >= 0); i++) {
							items.splice(selectedData.selectedRows[i] - 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
						}
						break;
					case 3:
						// moveDown
						selectedData.selectedRows = selectedData.selectedRows.reverse();
						for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] + 1 < items.length); i++) {
							items.splice(selectedData.selectedRows[i] + 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
						}
						break;
				}

				platformGridAPI.items.data(gridId, items);
				platformGridAPI.rows.selection({gridId: gridId, rows: selectedData.selectedItems});

				// update the sorting
				let index = 0;
				angular.forEach(items, function (item) {
					item.Sorting = index;
					index++;
				});
			};

			function getGridSelectedInfos(gridId) {
				let selectedInfo = {};
				let gridinstance = platformGridAPI.grids.element('id', gridId).instance;
				selectedInfo.selectedRows = angular.isDefined(gridinstance) ? gridinstance.getSelectedRows() : [];
				selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
					return gridinstance.getDataItem(row);
				});
				return selectedInfo;
			}

			function sortNumber(toSort) {
				return toSort.sort(function (a, b) {
					return a - b;
				});
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			function parentService() {
				return estimateMainService;
			}

			return service;
		}]
	);
})();
