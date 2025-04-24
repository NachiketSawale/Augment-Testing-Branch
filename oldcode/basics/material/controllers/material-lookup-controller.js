(function (angular, global) {
	'use strict';

	var moduleName = 'basics.material';
	/**
	 * @ngdoc controller
	 * @name basicsMaterialLookupController
	 * @requires $scope, $translate, dataService, lookupFilterService
	 * @description
	 * #
	 * Controller for the material search view
	 */
	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMaterialLookupController',
		['$scope', '$http', '$translate','_', 'moment','$templateCache', 'platformPermissionService', 'basicsMaterialLookupService', 'basicsLookupdataLookupFilterService', 'estimateProjectRateBookConfigDataService', '$injector', 'procurementContextService', 'basicsMaterialSimilarService','basicsMaterialDialogOption',
			'materialLookupDialogSearchOptionService',
			'basicCustomizeSystemoptionLookupDataService',
			'$q',
			'platformSchemaService',
			'cloudDesktopHotKeyService',
			function ($scope, $http, $translate,_,moment, $templateCache, platformPermissionService, dataService, lookupFilterService, estimateProjectRateBookConfigDataService, $injector, procurementContextService, basicsMaterialSimilarService,basicsMaterialDialogOption,
				searchOptionService,
				systemoptionLookupDataService,
				$q,
				platformSchemaService,
				cloudDesktopHotKeyService) {
				$scope.customOptions = $scope.options.dataView.scope;
				$scope.canCreateSimilarItem=false;
				$scope.canShowSimilarItem=false;
				platformPermissionService.loadPermissions(['a663969f4d1d49b8804989c62665d28f']).then(function () {
					let canReadSimilarBtn=platformPermissionService.hasRead('a663969f4d1d49b8804989c62665d28f');
					if(canReadSimilarBtn){
						$scope.canShowSimilarItem=true;
					}
					var canCreateSimilarItem = platformPermissionService.hasExecute('a663969f4d1d49b8804989c62665d28f');
					if (canCreateSimilarItem) {
						$scope.canCreateSimilarItem = true;
					}
				});
				var mainService = procurementContextService.getMainService();
				if (mainService && mainService.name === 'procurement.contract') {
					var contractParentService = $injector.get('procurementContractHeaderDataService');
					var headerSelectedItem = contractParentService.getSelected();
					if (headerSelectedItem) {
						if (!_.isNil(headerSelectedItem.ProjectChangeFk) || headerSelectedItem.ConHeaderFk === null) {
							$scope.filterOnlyMainContract = false;
						} else {
							$scope.filterOnlyMainContract = headerSelectedItem.ProjectChangeFk === null;
							$scope.enableOnlyMainContract = headerSelectedItem.ProjectChangeFk === null;
						}
					}
				}

				$scope.htmlTranslate = {
					title: $translate.instant('basics.material.materialSearchLookup.htmlTranslate.materialSearch'),
					refreshBtn: $translate.instant('basics.common.button.refresh'),
					okBtn: $translate.instant('cloud.common.ok'),
					cancelBtn: $translate.instant('cloud.common.cancel'),
					createSimilarItem: $translate.instant('basics.material.record.createSimilarItem')
				};

				// enable multi selection
				$scope.dialogLoading = false;
				$scope.loadingInfo='loading...';
				$scope.enableMultiSelection = false;
				$scope.checkAllFromCurrentPage = false;
				$scope.checkAllFromResultSet = false;
				$scope.checkAllFromResultSetDisable=false;
				$scope.selectedItems = [];

				estimateProjectRateBookConfigDataService.initData();

				// watch "enableMultiSelection" change event
				var unwatch = $scope.$watch('enableMultiSelection', function (newValue) {
					if (newValue) {
						return;
					}

					// clear selected items if uncheck multiple selection
					$scope.selectedItems.forEach(function (item) {
						item.selected = false;
					});
					$scope.selectedItems = [];

					$scope.checkAllFromCurrentPage = false;
					$scope.checkAllFromResultSet = false;
				});

				function getFilterString(options, entity, searchOptions) {
					var filterKey = options.filterKey;
					var filterOption = options.filterOptions;

					if (!filterKey && !filterOption) {
						return '';
					}

					if (!filterOption) {
						filterOption = lookupFilterService.hasFilter(filterKey) ? lookupFilterService.getFilterByKey(filterKey) : null;
					}

					if (angular.isObject(filterOption) && filterOption.fn && typeof filterOption.fn === 'function') {
						return filterOption.fn(entity, searchOptions);
					}

					return '';
				}

				var getTemplate = function (key) {
					var template = $templateCache.get(key + '.html');
					if (!template) {
						throw new Error('Template ' + key + ' not found');
					}
					return template;
				};

				function onSelectedChanged(entity) {
					if ($scope.enableMultiSelection) {
						entity.selected = !entity.selected;
						actionSelectedOrNot(entity);
						changeCheckAllCheckboxStatus(entity.selected);
					} else {
						$scope.selectedItems.forEach(function (item) {
							item.selected = false;
						});
						entity.selected = true;
						$scope.selectedItems = [entity];
					}
				}

				function onRowDoubleClick() {
					applySelection();
				}

				function applySelection() {
					var selectLen = $scope.getSeletedItemLength();
					if (!selectLen) {
						$scope.$close({
							isOk: true,
							selectedItem: null
						});
						return;
					}
					if (selectLen > 500) {
						var title = $translate.instant('basics.material.warning.warningTitle') || 'Warning';
						var message = $translate.instant('basics.material.warning.materialSelectedLimit');
						var platformDialogService = $injector.get('platformDialogService');
						var msgBoxOptions = {
							bodyText: message,
							headerText: title,
							iconClass: 'ico-info',
							windowClass: 'msgbox',
							bodyMarginLarge: true,
							buttons: [{
								id: 'cancel',
								caption$tr$: 'platform.cancelBtn'
							}]
						};
						return platformDialogService.showDialog(msgBoxOptions);
					}
					AddMaterialToItem();
				}

				function AddMaterialToItem() {
					var selectedItems = $scope.selectedItems;
					dataService.copy(selectedItems).then(function (dataItems) {
						$scope.$close({
							isOk: true,
							selectedItem: dataItems[0]
						});
						// Handle multi-selection, special case for estimate module.
						if ($scope.settings.gridOptions.multiSelect) {
							$scope.onSelectedItemsChanged.fire(global.event, {
								selectedItems: dataItems,
								lookupOptions: $scope.options
							}, $scope);
						}
					});
				}

				$scope.searchViewOptions = {
					searchOptions: {},
					searchService: dataService,
					onSelectedChanged: onSelectedChanged,
					onRowDoubleClick: onRowDoubleClick,
					rowButtonPanelHtml: getTemplate('rowButtonPanel'),
					isPreview: false
				};

				var dialogOptions = $scope.dialog ? $scope.dialog.modalOptions : $scope.modalOptions;

				// #123370 - After input the key word in material lookup and press enter button, the window will close
				dialogOptions.defaultButtonId = 'none';

				getFilterString(dialogOptions.scope.options, $scope.entity, $scope.searchViewOptions.searchOptions);

				if ($scope.options.dataProvider && $scope.options.dataProvider.lookupdataProcessor) {
					$scope.searchViewOptions.searchOptions.lookupdataProcessor = $scope.options.dataProvider.lookupdataProcessor;
				}

				var materialFk = dialogOptions.scope.ngModel;
				if (angular.isDefined($scope.options.materialFkField)) {
					materialFk = $scope.entity[$scope.options.materialFkField];
				}
				if (_.isInteger(materialFk)) {
					// if ($scope.searchViewOptions.searchOptions.hasOwnProperty('LgmJobFk') && $scope.searchViewOptions.searchOptions.LgmJobFk > 0){
					//
					// 	dataService.searchOptions.ProjectId = $scope.searchViewOptions.searchOptions.ProjectId;
					// 	dataService.searchOptions.SearchText = $scope.entity.Code;
					// 	dataService.searchOptions.LgmJobFk = $scope.searchViewOptions.searchOptions.LgmJobFk;
					//
					// 	dataService.search();
					// }else{
					// 	dataService.initialData(materialFk);
					// }
					dataService.initialDataNew(materialFk, $scope.options, $scope);
				}

				dataService.onListLoaded.register(handleListLoaded);
				dataService.onSearchConditionChange.register(handleResultSetChange);

				function handleListLoaded(option) {
					if (!dataService.data.items.length) {
						return;
					}

					if (option?.materialIdToSelect) {
						const materialToSelect = _.find(dataService.data.items, {Id: option.materialIdToSelect});
						if (materialToSelect) {
							materialToSelect.selected = true;
							actionSelectedOrNot(materialToSelect);
						}
					}
					if(dataService.data.maxGroupCount>500){
						$scope.checkAllFromResultSet = false;
						$scope.checkAllFromResultSetDisable=true;
					}
					else {
						$scope.checkAllFromResultSetDisable=false;
					}
					setCurrentPageCheckAll();
				}

				function handleResultSetChange() {
					$scope.checkAllFromCurrentPage = false;
					$scope.checkAllFromResultSet = false;
					$scope.currentSearchResult=null;
				}

				$scope.DisableSimilarButton = function () {
					var canCreateSimilarItem=$scope.canCreateSimilarItem;
					var gridOptions = $scope.settings.gridOptions;
					if (gridOptions.hasOwnProperty('disableCreateSimilarBtn') && gridOptions['disableCreateSimilarBtn'] || $scope.searchViewOptions.isPreview) {
						return true;
					}
					if (dataService.data.items.length > 0) {
						var selected = _.find(dataService.data.items, {selected: true});
						return !(!_.isNil(selected)&&canCreateSimilarItem);
					}
					return true;
				};

				var gridOptions = $scope.settings.gridOptions;
				$scope.showDayworkRate = function () {
					return ($scope.searchViewOptions.isPreview && gridOptions.hasOwnProperty('showDayworkRate')) ? gridOptions.showDayworkRate : false;
				};


				//change current page when load list
				function setCurrentPageCheckAll() {
					if ($scope.checkAllFromResultSet) {
						$scope.checkAllFromCurrentPage = true;
						$scope.onCheckAllFromCurrentPage();
					}
					else {
						for (var i = 0; i < $scope.selectedItems.length; i++) {
							var item = $scope.selectedItems[i];
							var target = _.find(dataService.data.items, {
								Id: item.Id,
								InternetCatalogFk: item.InternetCatalogFk
							});
							if (target) {
								target.selected = true;
								$scope.selectedItems[i] = target;
							}
						}
						var currentTotal=dataService.data.items.length;
						var selected=_.filter(dataService.data.items,function(item){return item.selected;});
						if(selected.length===currentTotal&&selected.length>0){
							$scope.checkAllFromCurrentPage = true;
						}
						else{
							$scope.checkAllFromCurrentPage = false;
						}
					}
				}

				//show selected length
				$scope.getSeletedItemLength = function () {
					var selectedLen = $scope.selectedItems.length;
					return selectedLen;
				};

				$scope.currentSearchResult=null;
				//checkbox select by ui checkbox
				$scope.onCheckAllFromResultSet = function () {
					var selectedLen = $scope.selectedItems.length;
					var totalLen=dataService.data.maxGroupCount+selectedLen;
					if($scope.checkAllFromResultSet){
						if(totalLen>500) {
							$scope.checkAllFromResultSet = false;
							$scope.checkAllFromResultSetDisable = true;
							return false;
						}
						else{
							$scope.enableMultiSelection = true;
							$scope.checkAllFromCurrentPage = true;
							let currentDateItems = dataService.data.items;
							currentDateItems.forEach(function (item) {
								item.selected = true;
							});
							if(_.isNull($scope.currentSearchResult)){
								$scope.dialogLoading=true;
								dataService.loadResultSet().then(function (response) {
									$scope.dialogLoading=false;
									var materials = response.data.Materials;
									if (materials.length > 0) {
										var selectedItemsMap = _.keyBy($scope.selectedItems, 'Id');
										_.forEach(materials, function (material) {
											let id = material.Id;
											if (!selectedItemsMap[id]) {
												$scope.selectedItems.push(material);
											}
										});
										$scope.currentSearchResult=materials;
									}
								});
							}
							else if(!_.isNull($scope.currentSearchResult)){
								var materials = $scope.currentSearchResult;
								var selectedItemsMap = _.keyBy($scope.selectedItems, 'Id');
								_.forEach(materials, function (material) {
									let id = material.Id;
									if (!selectedItemsMap[id]) {
										$scope.selectedItems.push(material);
									}
								});
							}
						}
					}
					else {
						$scope.checkAllFromCurrentPage = false;
						var materials = $scope.currentSearchResult;
						if(materials.length>0) {
							_.forEach(materials, function (item) {
								let id = item.Id;
								_.remove($scope.selectedItems, {
									Id:id
								});
							});
						}
						$scope.onCheckAllFromCurrentPage();
					}
				};

				//checkbox select by ui
				$scope.onCheckAllFromCurrentPage = function () {
					var currentDateItems = dataService.data.items;
					if ($scope.checkAllFromCurrentPage) {
						$scope.enableMultiSelection = true;
						currentDateItems.forEach(function (item) {
							item.selected = true;
							actionSelectedOrNot(item);
						});
					} else {
						currentDateItems.forEach(function (item) {
							item.selected = false;
							actionSelectedOrNot(item);
						});
					}
					var selected = $scope.checkAllFromCurrentPage;
					changeCheckAllCheckboxStatus(selected);
				};

				function actionSelectedOrNot(item) {
					if (item.selected) {
						var selectedItems = $scope.selectedItems;
						var hasSelected = _.find(selectedItems, function (selectedItem) {
							return item.Id === selectedItem.Id;
						});
						if (!hasSelected) {
							$scope.selectedItems.push(item);
						}
					} else {
						_.remove($scope.selectedItems, {
							Id: item.Id,
							InternetCatalogFk: item.InternetCatalogFk
						});
					}
				}

				//math checkbox when select or no selected row
				function changeCheckAllCheckboxStatus(selected) {
					if (!selected) {
						$scope.checkAllFromCurrentPage = false;
						if ($scope.checkAllFromResultSet) {
							$scope.checkAllFromResultSet = false;
						}
					} else {
						var materials=$scope.currentSearchResult;
						var selectedItems=$scope.selectedItems;
						if (materials&&selectedItems){
							var selectedItemsMap = _.keyBy(selectedItems, 'Id');
							var checkAllOrNot=true;
							for (var i = 0; i < materials.length; i++) {
								let material=materials[i];
								if(!selectedItemsMap[material.Id]){
									checkAllOrNot=false;
									break;
								}
							}
							$scope.checkAllFromResultSet = checkAllOrNot;
						}
						var dataList = dataService.data.items;
						var currentSelected = _.filter(dataList, {selected: true});
						if ((currentSelected.length === dataList.length) && (currentSelected.length > 0)) {
							$scope.checkAllFromCurrentPage = true;
						} else {
							$scope.checkAllFromCurrentPage = false;
						}
					}
				}

				// this use for directive
				$scope.onRefresh = function () {
					// exists external data refresh callback.
					if ($scope.settings.onDataRefresh) {
						$scope.settings.onDataRefresh($scope);
					} else {
						if ($scope.hasOwnProperty('searchViewOptions') && $scope.searchViewOptions.hasOwnProperty('searchService') && angular.isFunction($scope.searchViewOptions.searchService.search)) {
							$scope.searchViewOptions.searchService.search();
						}
					}
				};

				//this use for directive
				$scope.onOK = function () {
					applySelection();
				};

				//this use for directive
				$scope.onCancel = function () {
					$scope.$close({isOk: false});
				};

				$scope.onSimilarItem = function () {
					var currentSelected = _.find(dataService.data.items, {selected: true});
					if (_.isNil(currentSelected)) {
						return;
					}
					var materialId = currentSelected.Id;
					basicsMaterialSimilarService.create(materialId).then(function (response) {
						if (response.ok) {
							var material = response.data;
							material.InsertedAt = moment();
							material.InsertedBy = 0;
							material.SearchPattern = '';
							material.BasBlobsFk = null;
							material.BasBlobsSpecificationFk = null;
							var materialComplete = response.materialComplete;
							$http.post(globals.webApiBaseUrl + 'basics/material/saveSimilarMaterial', materialComplete).then(function (res) {
								var newMaterial = res.data;
								if (newMaterial) {
									currentSelected.selected = false;
									newMaterial.selected = true;
									dataService.data.items = [];
									dataService.data.items.push(currentSelected);
									dataService.data.items.push(newMaterial);
									$scope.selectedItems = [newMaterial];
								}
							});
						}
					});
				};

				redesign($scope);

				$scope.$on('$destroy', function () {
					unwatch();
					dataService.reset();
					dataService.onListLoaded.unregister(handleListLoaded);
					dataService.onSearchConditionChange.unregister(handleResultSetChange);
				});

				function redesign(scope) {
					const customDisableSimilar = (Object.prototype.hasOwnProperty.call(gridOptions, 'disableCreateSimilarBtn') && gridOptions.disableCreateSimilarBtn);
					const customMultiSelect = (Object.prototype.hasOwnProperty.call(gridOptions, 'multiSelect') && gridOptions.multiSelect);
					const similarPermissionUuid = 'a663969f4d1d49b8804989c62665d28f';
					const pageSizeOptions = [50, 100, 200];
					const defaultPageSize = 50;

					loadRequiredData();
					updateEnableOnlyMainContract();

					scope.requiredDataReady = false;
					scope.updateEnableOnlyMainContract = updateEnableOnlyMainContract;

					scope.searchViewOptions.similarPermissionUuid = similarPermissionUuid;
					scope.searchViewOptions.multipleSelection = customMultiSelect;
					scope.searchViewOptions.initContextFilter = initContextFilter;
					scope.searchViewOptions.getFilterByHeaderStructureSystemOption = getFilterByHeaderStructureSystemOption;
					scope.searchViewOptions.onClone = generateCreateSimilarFunc(false);
					scope.searchViewOptions.customDisableSimilar = customDisableSimilar;
					scope.searchViewOptions.clearSelectedItems = clearSelectedItems;
					scope.searchViewOptions.handlePageSizeChanged = handlePageSizeChanged;
					scope.searchViewOptions.getInitPageSize = getInitPageSize;
					scope.searchViewOptions.pageSizeOptions = pageSizeOptions;
					scope.searchViewOptions.showImageInPreview = true;
					scope.searchViewOptions.previewAttributes = [];
					// TODO rename it after finish redesign
					scope.searchViewOptions.onSelectedChanged_redesign = onSelectedChanged_redesign;
					scope.searchViewOptions.selectedAllOfPage = function(items, isSelected) {
						items.forEach(function (item) {
							item.selected = isSelected;
							actionSelectedOrNot(item);
						});
						scope.$root.safeApply();

					};

					// TODO rename it after finish redesign
					function onSelectedChanged_redesign(entity) {
						if (!customMultiSelect && entity.selected) {
							$scope.selectedItems.forEach(function (item) {
								if (item.Id !== entity.Id) {
									item.selected = false;
								}
							});
							clearSelectedItems();
						}
						actionSelectedOrNot(entity);
					}

					function generateCreateSimilarFunc(isClone) {
						return function(highlightSelectedItem) {
							if (!highlightSelectedItem) {
								return;
							}

							const createPromise = isClone ?
								basicsMaterialSimilarService.clone(highlightSelectedItem.Id) :
								basicsMaterialSimilarService.create(highlightSelectedItem.Id);
							return createPromise.then(function (response) {
								if (response.ok) {
									scope.dialogLoading = true;
									const material = response.data;
									material.InsertedAt = moment();
									return basicsMaterialSimilarService.save(response.materialComplete).then(function (res) {
										const newMaterial = res.data;
										if (newMaterial) {
											newMaterial.selected = true;
											onSelectedChanged_redesign(newMaterial);
											const insertIndex = _.findIndex(dataService.data.items, {Id: highlightSelectedItem.Id}) + 1;
											dataService.addData(newMaterial, insertIndex);
											return newMaterial;
										}
									}).finally(function () {
										scope.dialogLoading = false;
									});
								}
							});
						}
					}

					function initContextFilter() {
						return searchOptionService.hasMaterialDefinitions().then(function() {
							const isFilterByHeaderStructure = searchOptionService.getMaterialSearchOption('isFilterByHeaderStructure');
							$scope.searchViewOptions.searchOptions.isFilterByHeaderStructure = getFilterByHeaderStructureSystemOption() ?
								true :
								!!isFilterByHeaderStructure;
							getFilterString(dialogOptions.scope.options, $scope.entity, $scope.searchViewOptions.searchOptions);
							return true;
						});
					}

					function getFilterByHeaderStructureSystemOption() {
						const filterByHeaderPrcStructureSystemOptionId = 10107;
						const systemOption = _.find(systemoptionLookupDataService.getList(), {'Id': filterByHeaderPrcStructureSystemOptionId});
						return (systemOption?.ParameterValue === '1' || systemOption?.ParameterValue.toLowerCase() === 'true');
					}

					function loadRequiredData() {
						cloudDesktopHotKeyService.registerHotkeyjson('basics.material/content/json/hotkey.json', moduleName)
						$q.all([
							searchOptionService.initMaterialDefinitions(),
							platformSchemaService.getSchemas([{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'}])
						]).then(function() {
							scope.requiredDataReady = true;
						});
					}

					function clearSelectedItems() {
						$scope.selectedItems = [];
					}

					function updateEnableOnlyMainContract() {
						if (scope.filterOnlyMainContract) {
							scope.searchViewOptions.searchService.setEnableOnlyMainContract($scope.enableOnlyMainContract);
						}
					}


					function handlePageSizeChanged(numberPerPage) {
						const materialDefOfItemsPerPage = searchOptionService.getMaterialSearchOption('itemsPerPage');
						if (materialDefOfItemsPerPage !== numberPerPage) {
							searchOptionService.postMaterialSearchOption({itemsPerPage: numberPerPage});
						}
					}

					function getInitPageSize() {
						return searchOptionService.getMaterialSearchOption('itemsPerPage') ?? defaultPageSize;
					}

					scope.$on('$destroy', function () {
						scope.$close({});
					});
				}

			}]);

})(angular, window);
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialDialogOption',
		[	function () {
			var options = {
				width: '850',
				height: '600',
				top: '0',
				left: '60'
			};
			return options;
		}]);
})(angular);