/**
 * Created by lcn on 10/25/2018.
 */

(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingStructureDialogController',
		['_', 'slick', '$scope', '$translate', 'platformTranslateService', 'platformGridAPI', 'keyCodes', 'platformContextService', 'controllingStructureImageProcessor', 'controllingStructureContextService', '$timeout', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
			function (_, slick, $scope, $translate, platformTranslateService, platformGridAPI, keyCodes, platformContextService, controllingStructureImageProcessor, controllingStructureContextService, $timeout, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService) {
				var parentScope = $scope.$parent;
				var displayText = $scope.displayText;
				var displayItem = $scope.displayItem;
				var clientId = platformContextService.getContext().clientId;
				var companyId = clientId;
				var validCompanyList = controllingStructureContextService.getCompanyWithProfitcenters(clientId);
				var setCurrentItem = [];

				$scope.gridId = '47783C48D2834CADA2B45F5D8B176701';
				$scope.grid = {
					state: $scope.gridId
				};

				var settings = {
					columns: extendGrouping([
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							width: 100,
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							width: 150,
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'companyCode',
							field: 'CompanyFk',
							name: 'CompanyCode',
							width: 120,
							name$tr$: 'cloud.common.entityCompanyCode',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'Code'
							}
						},
						{
							id: 'companyName',
							field: 'CompanyFk',
							name: 'CompanyName',
							width: 120,
							name$tr$: 'cloud.common.entityCompanyName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							}
						},
						{
							id: 'projectNo',
							field: 'PrjProjectFk',
							name: 'projectNo',
							width: 120,
							name$tr$: 'cloud.common.entityProjectNo',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						{
							id: 'projectName',
							field: 'PrjProjectFk',
							name: 'projectName',
							width: 150,
							name$tr$: 'cloud.common.entityProjectName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectName'
							}
						},
						{
							id: 'StockCode',
							field: 'PrjStockFk',
							name: 'Stock Code',
							name$tr$: 'procurement.stock.header.stockCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStock',
								displayMember: 'Code'
							}
						},
						{
							id: 'CommentText',
							field: 'CommentText',
							name: 'Comment',
							formatter: 'description',
							name$tr$: 'cloud.common.entityCommentText'
						},
						{
							id: 'Userdefined1',
							field: 'Userdefined1',
							name: 'Userdefined1',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '1'},
							width: 100
						},
						{
							id: 'Userdefined2',
							field: 'Userdefined2',
							name: 'Userdefined2',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '2'},
							width: 100
						},
						{
							id: 'Userdefined3',
							field: 'Userdefined3',
							name: 'Userdefined3',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '3'},
							width: 100
						},
						{
							id: 'Userdefined4',
							field: 'Userdefined4',
							name: 'Userdefined4',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '4'},
							width: 100
						},
						{
							id: 'Userdefined5',
							field: 'Userdefined5',
							name: 'Userdefined5',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '5'},
							width: 100
						},
						{
							id: 'IsDefault',
							field: 'IsDefault',
							name: 'Is Default',
							name$tr$: 'controlling.structure.isDefault',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsFixedBudget',
							field: 'IsFixedBudget',
							name: 'Fix Budget',
							name$tr$: 'controlling.structure.isFixedBudget',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsAccountingElement',
							field: 'Isaccountingelement',
							name: 'Is Accounting',
							name$tr$: 'controlling.structure.entityIsAccounting',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsAssetmanagement',
							field: 'Isassetmanagement',
							name: 'Fix Assetmanagement',
							name$tr$: 'controlling.structure.entityIsAssetmanagement',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsBillingElement',
							field: 'Isbillingelement',
							name: 'Is Billing',
							name$tr$: 'controlling.structure.entityIsBilling',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsIntercompany',
							field: 'Isintercompany',
							name: 'Intercompany',
							name$tr$: 'controlling.structure.isIntercompany',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsPlanningElement',
							field: 'Isplanningelement',
							name: 'Is Planning',
							name$tr$: 'controlling.structure.entityIsPlanning',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsPlantmanagement',
							field: 'Isplantmanagement',
							name: 'Is Plantmanagement',
							name$tr$: 'controlling.structure.entityIsPlantmanagement',
							formatter: 'boolean',
							width: 100
						},
						{
							id: 'IsStockmanagement',
							field: 'Isstockmanagement',
							name: 'Is Stockmanagement',
							name$tr$: 'controlling.structure.entityIsStockmanagement',
							formatter: 'boolean',
							width: 100
						}
					])
				};

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var gridConfig = {
						columns: angular.copy(settings.columns),
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							tree: true,
							childProp: 'ChildItems',
							skipPermissionCheck: true,
							parentProp: 'ControllingunitFk',
							iconClass: 'control-icons',
							idProperty: 'Id',
							collapsed: false,
							indicator: true,
							multiSelect: false,
							enableDraggableGroupBy: false,
							editorLock: new slick.EditorLock()
						}
					};

					platformGridAPI.grids.config(gridConfig);
					platformTranslateService.translateGridConfig(gridConfig.columns);
				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(settings.columns));
				}
				platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);
				platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

				function isValidCompany(companyIdOfUnit) {
					if (_.isArray(validCompanyList)) {
						return _.isObject(_.find(validCompanyList, {id: companyIdOfUnit}));
					} else {
						return companyIdOfUnit === companyId;
					}
				}

				function isValid(item) {
					var selectedItem = item || $scope.modalOptions.selectedItem;
					/** @namespace selectedItem.Isaccountingelement */
					/** @namespace selectedItem.Isintercompany */
					if (selectedItem) {
						if (!isValidCompany(selectedItem.CompanyFk) && !selectedItem.Isintercompany) {
							return false;
						}
						// Ok button only available for "is billing element" controlling units
						if ($scope.modalOptions.FilterKey === 'sales.common.controlling.unit.filter.isBillingElement') {
							return selectedItem.Isbillingelement;
						}
						if ($scope.modalOptions.FilterKey === 'etm.plant.controllingunit.project.context.filter' || $scope.modalOptions.FilterKey === 'lgm.settlement.controllingunit.project.context.filter') {
							return selectedItem.Isplantmanagement;
						}
						if ($scope.modalOptions.FilterKey === 'scheduling.main.controllingunit.project.context.filter') {
							return selectedItem.Isplanningelement;
						}
						if ($scope.modalOptions.FilterKey === 'controlling.structure.estimate.prjcontrollingunit.filterkey' && selectedItem.HasChildren) {
							return false;
						}
						if (!$scope.modalOptions.extraFilter || ($scope.modalOptions.extraFilter && selectedItem.Isaccountingelement)) {
							return true;
						}
					}
					return false;
				}

				$scope.settings.selectableCallback = function selectableCallback(selectedItem) {
					if($scope.modalOptions.FilterKey === 'controlling.structure.estimate.prjcontrollingunit.filterkey'){
						let isSelectable = isValid(selectedItem);
						if(isSelectable && selectedItem.HasChildren){
							isSelectable = false;
						}
						return isSelectable;
					}else{
						return isValid(selectedItem);
					}
				};

				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					refreshButtonText: $translate.instant('basics.common.button.refresh'),
					headerText: $translate.instant('cloud.common.controllingCodeTitle'),
					disableOkButton: true,
					selectedItem: [],
					searchValue: null,
					isValid: isValid,
					ok: function onOK() {
						var selectedItem = $scope.modalOptions.selectedItem;
						if ($scope.canSelect(selectedItem)) {
							$scope.$close({
								isOk: true,
								selectedItem: selectedItem
							});
						}
					},
					cancel: function onCancel() {
						$scope.$close({isOk: false, isCancel: true});
					},
					extraFilter: false,
					prjProjectFk: null,
				};

				var page = $scope.options.dataView.dataPage;
				var pageState = {
					PageNumber: page.number,
					PageSize: page.size
				};
				var searchRequest = {
					SearchFields: ['Code', 'DescriptionInfo.Translated'],
					SearchText: '',
					FilterKey: 'prc.con.controllingunit.by.prj.filterkey',
					AdditionalParameters: {
						ByStructure: true,
						ExtraFilter: true,
						PrjProjectFk: null,
						CompanyFk: null,
						ProjectContextFk: null
					},
					PageState: pageState
				};

				function getSearchList(displayItem) {
					if (displayItem) {
						$scope.context.projectId = displayItem.PrjProjectFk;
						$scope.context.companyId = displayItem.CompanyFk;
					}
					setCurrentItem = [];
					$scope.isLoading = true;
					$scope.searchValueModified = true;
					searchRequest.FilterKey = $scope.context.FilterKey ? $scope.context.FilterKey : searchRequest.FilterKey;
					searchRequest.SearchText = ($scope.searchValue || '');
					searchRequest.AdditionalParameters.PrjProjectFk = $scope.context.projectId;
					searchRequest.AdditionalParameters.CompanyFk = $scope.context.companyId;
					searchRequest.AdditionalParameters.ProjectContextFk = $scope.context.ProjectContextFk;
					searchRequest.AdditionalParameters.ExtraFilter = $scope.modalOptions.extraFilter;
					$scope.context.searchValue = ($scope.searchValue || '') + $scope.context.filter;
					pageState.PageNumber = page.number;
					$scope.options.dataView.dataProvider.getSearchList(searchRequest, parentScope).then(function (result) {
						controllingStructureImageProcessor.processTree(result.items, 'ChildItems');
						platformGridAPI.items.data($scope.gridId, result.items);
						if (displayItem) {
							$timeout(function () {
								initGridSetRows(displayItem, result);
							}, 350);
						} else {
							initGridSetRows(displayItem, result);
						}
						page.totalLength = result.itemsFound;
						page.currentLength = result.itemsRetrieved;
						page.count = Math.ceil(page.totalLength / page.size);
						$scope.isLoading = false;
					});
				}

				function initGridSetRows(displayItem, result) {
					var grid = platformGridAPI.grids.element('id', $scope.gridId).instance;
					if (grid && grid.getSelectedRows().length === 0) {
						var gridData = grid.getData();
						if (result.items.length > 0) {
							if (!displayItem) {
								getChildren(result.items[0]);
							}
						}
						var selectedItem = !displayItem ? setCurrentItem[0] : displayItem;
						$scope.modalOptions.selectedItem = selectedItem;
						var selectedRow = gridData.getRowById(selectedItem ? selectedItem.Id : -1);
						if (selectedRow > -1) {
							grid.setSelectedRows([selectedRow]);
						}
					}
					if($scope.modalOptions.FilterKey === 'controlling.structure.estimate.prjcontrollingunit.filterkey'){
						let disabledOption = {rowCss: 'disabled', grid:{mergedCells:{selectable: false}}};
						let treeOptions = $scope.settings.treeOptions;
						applyOptionToItems(result.items, disabledOption, treeOptions && treeOptions.childProp , $scope.settings.selectableCallback);
					}
				}

				function applyOptionToItems(items, option, childProp, callback){
					for(var i = 0; i< items.length; i++){
						if( !callback(items[i]) ){
							items[i].__rt$data = _.merge(items[i].__rt$data || {},option);
						}
						if( childProp && angular.isArray(items[i][childProp]) ){
							applyOptionToItems((items[i][childProp]), option, childProp, callback);
						}
					}
				}

				function onDblClick(e, args) {
					var selectedItem = args.grid.getDataItem(args.row);
					/** @namespace selectedItem.Isaccountingelement */
					/** @namespace selectedItem.Isintercompany */
					if (selectedItem) {
						if (!$scope.modalOptions.extraFilter || ($scope.modalOptions.extraFilter && selectedItem.Isaccountingelement)) {
							$scope.modalOptions.ok();
						}
					}
				}

				function onGridClick(e, args) {
					$scope.modalOptions.selectedItem = args.grid.getDataItem(args.row);
				}

				function getChildren(item) {
					if (item.HasChildren) {
						getChildren(item.ChildItems[0]);
					} else {
						setCurrentItem.push(item);
					}
				}

				$scope.onSearchInputKeydown = function onSearchInputKeydown(event, searchValue) {
					if (event.keyCode === keyCodes.ENTER) {
						if ((searchValue + $scope.context.filter) === $scope.context.searchValue) {
							getSearchList();
						} else {
							$scope.onSearch();
						}

					}
				};
				$scope.onSearch = function () {
					page.number = 0;
					getSearchList();
				};
				$scope.getPageText = function () {
					var startIndex = page.number * page.size,
						endIndex = ((page.count - (page.number + 1) > 0 ? startIndex + page.size : page.totalLength));
					if ($scope.searchValueModified === undefined) {
						if (page.totalLength > 0) {
							return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
						}
						return '';
					}
					if ($scope.isLoading) {
						return $translate.instant('cloud.common.searchRunning');
					}
					if (page.currentLength === 0) {
						return $translate.instant('cloud.common.noSearchResult');
					}
					return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
				};
				$scope.pageUp = function () {
					if (page.number <= 0) {
						return;
					}
					page.number--;
					getSearchList();
				};
				$scope.pageDown = function () {
					if (page.count <= page.number) {
						return;
					}
					page.number++;
					getSearchList();
				};
				$scope.canPageUp = function () {
					return page.number > 0;
				};
				$scope.canPageDown = function () {
					return page.count > (page.number + 1);
				};
				$scope.context = {
					companyId: null,
					projectId: null,
					ProjectContextFk: null,
					filter: ';projectId:null;companyId:null;ProjectContextFk:null'
				};
				$scope.lookupConfig = {
					project: {
						lookupDirective: 'procurement-project-lookup-dialog',
						descriptionMember: 'ProjectName',
						lookupOptions: {
							initValueField: 'ProjectNo',
							showClearButton: true,
							filterKey: 'prj-by-company-filter',
							readOnly: false
						}
					},
					company: {
						lookupDirective: 'basics-company-company-lookup',
						descriptionMember: 'CompanyName',
						lookupOptions: {
							initValueField: 'Code',
							showClearButton: true,
							readOnly: false,
							events: [
								{
									name: 'onSelectedItemChanged', // register event and event handler here.
									handler: function (e, args) { // jshint ignore:line
										var selectedItem = args.selectedItem;
										var previousItem = args.previousItem;
										if (!_.isEqual(selectedItem === null ? null : selectedItem.Id, previousItem === null ? null : previousItem.Id)) {
											$scope.context.projectId = null;
										}
									}

								}
							],
							filterKey: 'company-by-same-prjcontext-filter'
						}
					}
				};

				$scope.$watch(function () {
					$scope.context.filter = ';projectId:' + $scope.context.projectId + ';' + 'companyId:' + $scope.context.companyId + ';ProjectContextFk:' + $scope.context.ProjectContextFk;
				});

				var filters = [{
					key: 'prj-by-company-filter',
					serverSide: true,
					fn: function (entity) {
						return {
							CompanyFk: entity.companyId,
							ByStructure: true
						};
					}
				}, {
					key: 'company-by-same-prjcontext-filter',
					fn: function (item) {
						var projectContextItem = _.find(basicsLookupdataLookupDescriptorService.getData('company'), {Id: platformContextService.getContext().clientId});
						if (projectContextItem) {
							return item.ProjectContextFk === projectContextItem.ProjectContextFk;
						}
						return false;
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onDblClick', onDblClick);
					platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});

				function init() {
					$scope.settings.dataView.resetDataPage({count: 0, currentLength: 0, number: 0, totalLength: 0});

					var filter = basicsLookupdataLookupFilterService.getFilterByKey($scope.options.filterKey);
					if(filter){
						var filterValue;
						if(filter.key === 'estimate-prj-controlling-unit-filter' || filter.key === 'actual-controlling-by-prj-filter' || filter.key === 'qto-main-controlling-unit-filter'){
							filterValue = filter.fn();
						}
						if ($scope.entity) {
							filterValue =filter.fn($scope.entity);
						}
						if(filterValue){
							if(filter.key === 'estimate-prj-controlling-unit-filter' || filter.key === 'qto-main-controlling-unit-filter'){
								$scope.modalOptions.extraFilter = filterValue.ExtraFilter;
								$scope.modalOptions.prjProjectFk = filterValue.PrjProjectFk;
								$scope.modalOptions.ProjectContextFk = filterValue.ProjectContextFk;
								$scope.modalOptions.FilterKey = filterValue.FilterKey;
							} else {
								$scope.modalOptions.extraFilter = filterValue.ExtraFilter;
								$scope.modalOptions.prjProjectFk = filterValue.PrjProjectFk;
								$scope.modalOptions.CompanyFk = filterValue.CompanyFk;
								$scope.modalOptions.ProjectContextFk = filterValue.ProjectContextFk;
								$scope.modalOptions.FilterKey = filterValue.FilterKey;
								// TODO: currently unclear, if this is still needed if used outside. Needs more time to check, so for now we keep in parallel for compatibility reasons.
								$scope.modalOptions.PrjProjectFk = filterValue.PrjProjectFk;
							}

							if (_.isFunction(filterValue.IsProjectReadonly)) {
								if (filterValue.IsProjectReadonly()) {
									setProjectToReadOnly();
								}
							}
							if (_.isFunction(filterValue.IsCompanyReadonly)) {
								if (filterValue.IsCompanyReadonly()) {
									setCompanyToReadOnly();
								}
							}
						}
					}
					$scope.context.companyId = getCompanyRecipient() ? getCompanyRecipient() : platformContextService.getContext().clientId;
					$scope.context.projectId = $scope.modalOptions.prjProjectFk || (parentScope.entity ? (parentScope.entity.ProjectFk || parentScope.entity.ProjectFK) : null);
					$scope.context.ProjectContextFk = $scope.modalOptions.ProjectContextFk;
					$scope.context.FilterKey = $scope.modalOptions.FilterKey;
					if (displayText !== '') {
						$scope.searchValue = displayText;
						page.number = 0;
						getSearchList(displayItem);
					}
				}

				function getCompanyRecipient() {
					var result = null;
					if($scope.options.filterKey) {
						var filter = basicsLookupdataLookupFilterService.getFilterByKey($scope.options.filterKey);
						if(filter && $scope.entity) {
							var filterValue = filter.fn($scope.entity);
							if (filterValue) {
								result = filterValue.CompanyFk;
							}
						}
					}
					return result;
				}

				function setProjectToReadOnly() {
					if($scope.lookupConfig && $scope.lookupConfig.project){
						$scope.lookupConfig.project.lookupOptions.readOnly = true;
					}
				}

				function setCompanyToReadOnly() {
					if($scope.lookupConfig && $scope.lookupConfig.company){
						$scope.lookupConfig.company.lookupOptions.readOnly = true;
					}
				}

				function extendGrouping(gridColumns) {
					angular.forEach(gridColumns, function (column) {
						angular.extend(column, {
							grouping: {
								title: column.name$tr$,
								getter: column.field,
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					});
					return gridColumns;
				}


				init();
			}
		]);
})();
