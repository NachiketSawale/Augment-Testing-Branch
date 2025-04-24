/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).component('basicsMaterialFilterSearchBar', {
		templateUrl: 'basics.material/templates/material-lookup/material-filter-search-bar-component.html',
		bindings: {
			searchViewOptions: '<'
		},
		controller: [
			'$scope',
			'$http',
			'$translate',
			'basicsLookupdataPopupService',
			'materialFilterAccessLevel',
			'basicsMaterialFilterId',
			'basicsMaterialFilterOperator',
			'basicsMaterialType',
			'basicsMaterialSearchProfileService',
			'basicsMaterialSearchTextKindOptions',
			'basicsMaterialFilterSource',
			'basicsMaterialFilterType',
			'materialSearchMode',
			'basicsMaterialLookUpItems',
			'materialFilterEvent',
			function (
				$scope,
				$http,
				$translate,
				basicsLookupdataPopupService,
				materialFilterAccessLevel,
				basicsMaterialFilterId,
				basicsMaterialFilterOperator,
				basicsMaterialType,
				basicsMaterialSearchProfileService,
				basicsMaterialSearchTextKindOptions,
				basicsMaterialFilterSource,
				basicsMaterialFilterType,
				materialSearchMode,
				basicsMaterialLookUpItems,
				materialFilterEvent) {
				const searchViewOptions = this.searchViewOptions;
				const searchService = this.searchViewOptions.searchService;
				const searchOptions = this.searchViewOptions.searchOptions;
				const addFilterPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				const saveFilterPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				const savedFiltersPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				const saveOptionsPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				const searchInfoPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				const addAttributeFilterPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				const searchSettingPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				let newFilterDef = null;

				$scope.showSearchInfoPopup = showSearchInfoPopup;

				$scope.userInput = '';

				$scope.hasSavedFilters = false;

				$scope.currentProfile = {
					IsNew: true,
					FilterName: '',
					AccessLevel: materialFilterAccessLevel.user,
				};

				$scope.search = function () {
					searchViewOptions.executeFilter(getCurrentFilterOption());
				};

				$scope.addFilter = function (e) {
					const popup = addFilterPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						templateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-selection-component.html',
						controller: 'basicsMaterialFilterSelectionController',
						plainMode: true,
						hasDefaultWidth: false,
						resolve: {
							list: function () {
								return $scope.filterDefs;
							}
						}
					});

					if (popup) {
						popup.result.then(function (result) {
							if (result?.isOk) {
								if ($scope.currentFilterDefs.find(e => e.Id === result.item.Id)) {
									$scope.$broadcast(materialFilterEvent.filterOpen, result.item.Id);
								} else {
									$scope.currentFilterDefs.push(result.item);
									newFilterDef = _.last($scope.currentFilterDefs);
								}
							}
						});
					}
				};

				$scope.addAttributeFilter = function (e) {
					const popup = addAttributeFilterPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						templateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-attribute-component.html',
						controller: 'basicsMaterialFilterAttributeController',
						plainMode: true,
						hasDefaultWidth: false,
						resolve: {
							existedAttributeFilters: function () {
								return [];
							}
						}
					});

					if (popup) {
						popup.result.then(function (result) {
							if (result?.isOk) {
								if ($scope.currentFilterDefs.find(e => e.Id === result.attribute)) {
									$scope.$broadcast(materialFilterEvent.filterOpen, result.attribute);
								} else {
									$scope.currentFilterDefs.push(createAttributeFilterDef(result.attribute));
									newFilterDef = _.last($scope.currentFilterDefs);
								}
							}
						});
					}
				};

				$scope.removeFilter = function (filter) {
					$scope.currentFilterDefs = _.differenceBy($scope.currentFilterDefs, [filter], 'Id');
					$scope.search();
				};

				$scope.remove = function () {
					$scope.currentFilterDefs = $scope.currentFilterDefs.filter(e => e.Readonly || e.HasReadonlyFactor);
				};

				$scope.save = function (e) {
					if ($scope.currentProfile.IsNew) {
						saveNewProfile(e);
						return;
					}

					const popup = saveOptionsPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						templateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-save-options-component.html',
						controller: 'basicsMaterialFilterSaveOptionsController',
						plainMode: true,
						hasDefaultWidth: false
					});

					if (popup) {
						popup.result.then(function (result) {
							if (result?.asCopy) {
								saveNewProfile(e);
							} else if (result?.asChange) {
								postProfile(getProfileToSave());
							}
						});
					}
				};

				$scope.showSavedFilters = function (e) {
					const popup = savedFiltersPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						templateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-saved-filters-component.html',
						controller: 'basicsMaterialFilterSavedFiltersController',
						plainMode: true,
						hasDefaultWidth: false
					});

					if (popup) {
						popup.result.then(function (result) {
							if (result) {
								applyProfile(result);
								$scope.search();
							}
						});
					}
				};

				$scope.filterDefs = [];
				$scope.currentFilterDefs = [];

				$scope.showSearchSetting = false;
				$scope.searchFields = [
					{id: basicsMaterialSearchTextKindOptions.all, caption: 'basics.material.searchFields.all', selected: false},
					{id: basicsMaterialSearchTextKindOptions.basics, caption: 'basics.material.searchFields.basics', selected: false},
					{id: basicsMaterialSearchTextKindOptions.specification, caption: 'basics.material.searchFields.spec', selected: false},
				];
				$scope.searchModel = {
					searchMode: materialSearchMode.like,
					searchIn: []
				};

				$scope.openSearchSetting = function (e) {
					const popup = searchSettingPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						templateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-fulltext-list-component.html',
						controller: 'basicsMaterialFilterFulltextListController',
						plainMode: true,
						hasDefaultWidth: false,
						resolve: {
							list: function () {
								return $scope.searchFields;
							}
						}
					});

					if (popup) {
						popup.result.then(function (searchFields) {
							if (!searchFields) {
								return;
							}

							$scope.searchFields = searchFields;
							$scope.searchModel.searchIn = $scope.searchFields.filter(e => e.selected && e.id !== basicsMaterialSearchTextKindOptions.all).map(e => e.id);

							basicsMaterialSearchProfileService.save({
								SearchMode: $scope.searchModel.searchMode,
								SearchIn: $scope.searchModel.searchIn
							});
						});
					}
				};

				$scope.getSearchDescription = function () {
					if (!$scope.searchModel.searchIn?.length) {
						return $translate.instant('basics.material.searchFields.all');
					}

					return $scope.searchFields.filter(e => $scope.searchModel.searchIn.includes(e.id)).map(e => $translate.instant(e.caption)).join(', ');
				};

				$scope.isOpenOptions = function (def) {
					if (newFilterDef && def && def.Id === newFilterDef.Id) {
						newFilterDef = null;
						return true;
					}
				}

				this.$onInit = function () {
					searchService.getFilterDefs().then(function (filterDefs) {
						$scope.filterDefs = filterDefs.data;

						const weightType = $scope.filterDefs.find(e => e.Id === basicsMaterialFilterId.weightType);

						if (weightType) {
							weightType.List = basicsMaterialLookUpItems.weightType;
						}

						const weightNumber = $scope.filterDefs.find(e => e.Id === basicsMaterialFilterId.weightNumber);

						if (weightNumber) {
							weightNumber.List = basicsMaterialLookUpItems.weightNumber;
						}

						searchViewOptions.initContextFilter().then(function () {
							applyContextFilter();
							searchViewOptions.updateCurrentFilterOption(getCurrentFilterOption());
						});
					});

					basicsMaterialSearchProfileService.getSearchSettings().then(function (data) {
						$scope.showSearchSetting = data.ShowSearchIn;
					});

					basicsMaterialSearchProfileService.load().then(function (data) {
						if (data) {
							$scope.searchModel.searchIn = data.SearchIn;

							if (data.SearchMode) {
								$scope.searchModel.searchMode = data.SearchMode;
							}

							$scope.searchFields.forEach(e => {
								e.selected = $scope.searchModel.searchIn.includes(e.id);
							});
						}
					});

					loadSavedFilters().then(function (data) {
						$scope.hasSavedFilters = !!(data && data.length);
					});
				};

				// $onDestroy hook
				this.$onDestroy = function () {
					addFilterPopupHelper.hide();
					saveFilterPopupHelper.hide();
					savedFiltersPopupHelper.hide();
					saveOptionsPopupHelper.hide();
					addAttributeFilterPopupHelper.hide();
					searchSettingPopupHelper.hide();
				};

				function applyProfile(profile) {
					$scope.currentProfile = profile;

					if (!profile.FilterValue) {
						$scope.currentFilterDefs = [];
						return;
					}

					updateCurrentDefs(profile.FilterValue.Filters);
				}

				function updateCurrentDefs(filters) {
					$scope.remove();

					filters = _.differenceBy(filters, $scope.currentFilterDefs, 'Id');

					const filterDefs = _.uniqBy(filters, 'Id').map(e => {
						let filterDef = $scope.filterDefs.find(f => f.Id === e.Id);

						if (e.Source === basicsMaterialFilterSource.attribute) {
							filterDef = createAttributeFilterDef(e.Id);
						}

						if (!filterDef) {
							throw new Error('Filter definition not found');
						}

						filterDef.Operator = e.Operator;
						filterDef.Factors = e.Factors;
						filterDef.PredefinedFactors = e.PredefinedFactors;
						filterDef.Descriptions = e.Descriptions;
						filterDef.Readonly = e.Readonly;
						filterDef.ReadonlyFactors = e.ReadonlyFactors;
						filterDef.HasReadonlyFactor = e.HasReadonlyFactor;

						return filterDef;
					});

					$scope.currentFilterDefs = $scope.currentFilterDefs.concat(filterDefs);
				}

				function saveNewProfile(e) {
					const popup = saveFilterPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						templateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-save-component.html',
						controller: 'basicsMaterialFilterSaveController',
						plainMode: true,
						hasDefaultWidth: false,
						resolve: {
							profile: getProfileToSave,
							postProfile: function () {
								return postProfile;
							}
						}
					});

					if (popup) {
						popup.result.then(function (result) {
							if (result) {
								$scope.currentProfile = result;
								$scope.hasSavedFilters = true;
							}
						});
					}
				}

				function getProfileToSave() {
					const profile = {...$scope.currentProfile};

					profile.FilterValue = {
						Filters: _.uniqBy($scope.currentFilterDefs, 'Id').map(e => {
							return {
								Id: e.Id,
								Source: e.Source,
								Type: e.Type,
								Operator: e.Operator,
								Factors: e.Factors,
								PredefinedFactors: e.PredefinedFactors,
								Descriptions: e.Descriptions
							};
						})
					};

					return profile;
				}

				function postProfile(profile) {
					return $http.post(globals.webApiBaseUrl + 'basics/material/filter/save', profile);
				}

				function applyContextFilter() {
					const filters = [];

					if (searchOptions.Filter) {
						if (searchOptions.Filter.MaterialCatalogId) {
							filters.push({
								Id: basicsMaterialFilterId.catalogAndGroup,
								Operator: basicsMaterialFilterOperator.equals,
								Factors: [searchOptions.Filter.MaterialCatalogId.toString()],
								Readonly: true
							});
						}

						if (searchOptions.Filter.PrcStructureId) {
							filters.push({
								Id: basicsMaterialFilterId.prcStructure,
								Operator: basicsMaterialFilterOperator.equals,
								Factors: [searchOptions.Filter.PrcStructureId]
							});
							searchOptions.Filter.PrcStructureId = null;
						}
					}

					if (searchOptions.MaterialTypeFilter) {
						const materialTypeFilter = {
							Id: basicsMaterialFilterId.materialType,
							Operator: basicsMaterialFilterOperator.equals,
							Factors: []
						}

						Object.keys(searchOptions.MaterialTypeFilter).forEach(key => {
							if (!searchOptions.MaterialTypeFilter[key]) {
								return;
							}

							switch (key) {
								case 'IsForProcurement':
									materialTypeFilter.Factors.push(basicsMaterialType.procurement);
									break;
								case 'IsForEstimate':
									materialTypeFilter.Factors.push(basicsMaterialType.estimate);
									break;
								case 'IsForRM':
									materialTypeFilter.Factors.push(basicsMaterialType.resourceManagement);
									break;
								case 'IsForLogistics':
									materialTypeFilter.Factors.push(basicsMaterialType.logistics);
									break;
								case 'IsForModel':
									materialTypeFilter.Factors.push(basicsMaterialType.model);
									break;
								case 'IsForSales':
									materialTypeFilter.Factors.push(basicsMaterialType.sales);
									break;
							}
						});

						if (searchOptions.MaterialTypeFilter.IsReadonly && materialTypeFilter.Factors?.length > 0) {
							materialTypeFilter.HasReadonlyFactor = true;
							materialTypeFilter.ReadonlyFactors = [...materialTypeFilter.Factors];
						}

						filters.push(materialTypeFilter);
					}

					if (filters.length > 0) {
						updateCurrentDefs(filters);
					}
				}

				function createAttributeFilterDef(attribute) {
					return {
						Id: attribute,
						Source: basicsMaterialFilterSource.attribute,
						Type: basicsMaterialFilterType.list,
						ListEndpoint: {
							UsePost: true,
							Url: 'basics/material/filter/propertyValues',
							Payload: {
								Property: attribute
							},
							mapper: e => {
								return {
									Id: e,
									Description: e
								};
							}
						}
					};
				}

				function getCurrentFilterOption() {
					return {
						contractName: searchOptions.ContractName,
						context: searchOptions.Filter,
						userInput: $scope.userInput,
						filters: $scope.currentFilterDefs.map(e => {
							return {
								Id: e.Id,
								Source: e.Source,
								Type: e.Type,
								Operator: e.Operator,
								Factors: e.Factors
							};
						}),
						countAll: true,
					};
				}

				function showSearchInfoPopup(e) {
					const title = $translate.instant('basics.material.lookup.searchInfo.title');
					const content = $translate.instant('basics.material.lookup.searchInfo.content');
					const ending = $translate.instant('basics.material.lookup.searchInfo.ending');
					searchInfoPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						template: '<div style="padding:8px"><h3><b>' + title + '</b></h3><br/><p>' + content + '</p><span>' + ending + '</span></div>',
						width: '280',
						plainMode: true,
						hasDefaultWidth: true
					});
				}

				function loadSavedFilters() {
					return $http.get(globals.webApiBaseUrl + 'basics/material/filter/load').then(function (response) {
						return response.data
					});
				}

			}],
		controllerAs: 'basicsMaterialFilterSearchBar'
	});

})(angular);