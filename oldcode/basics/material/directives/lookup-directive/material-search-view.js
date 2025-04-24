/**
 * Created by lja on 04/14/2015.
 */
(function (angular) {
	/* global globals,_,$ */
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).run(['$templateCache', function ($templateCache) {
		$templateCache.loadTemplateFile('basics.material/templates/lookup/material-search-templates.html');
	}]);

	/**
	 * @ngdoc directive
	 * @name basicsMaterialSearchView
	 * @element div
	 * @restrict A
	 * @priority
	 * @scope
	 * @description
	 * Search view for the ticket system and material lookup.
	 * It will show the search text box, search button, category filter, procurement structure navigation, attribute filter and the search result paging list
	 * The buttons in ticket system show the cart count and also the cart button in each material result is configurable here.
	 */
	angular.module(moduleName).directive('basicsMaterialSearchView',
		['$compile', '$translate', '$templateCache', 'keyCodes', 'basicsMaterialSearchSortOptions', '$rootScope', 'platformDialogService', '$injector', 'basicsMaterialSearchTextKindOptions', 'basicsMaterialSearchProfileService',
			function ($compile, $translate, $templateCache, keyCodes, sortOptions, $rootScope, platformDialogService, $injector, basicsMaterialSearchTextKindOptions, basicsMaterialSearchProfileService) {
				var searchService;
				return {
					restrict: 'A',
					replace: true,
					scope: {
						options: '='
					},
					link: function ($scope, element) {
						var getTemplate = function (key) {
							var template = $templateCache.get(key + '.html');
							if (!template) {
								throw new Error('Template ' + key + ' not found');
							}
							return template;
						};


						var content = getTemplate('searchView').replace(/\$searchBarExtend\$/, $scope.options.searchBarExtend || '')
							.replace(/\$searchTitleExtend\$/, $scope.options.searchTitleExtend || '');

						element.append($compile(content)($scope));

					},
					controller:['$scope', '$window', '$q','materialDocumentPreviewConfigService','platformToolbarService', '$http', 'basicsLookupdataLookupDescriptorService',
						function ($scope, $window, $q,materialDocumentPreviewConfigService, platformToolbarService, $http, lookupDescriptor) {

							if (!$scope.options) {
								throw new Error('Please provide options attribute');
							}

							if (!$scope.options.searchService) {
								throw new Error('search Service should be configured in options');
							}

							searchService = $scope.options.searchService;
							angular.extend(searchService.searchOptions, $scope.options.searchOptions);
							if ($scope.options.defaultPageSize) {
								searchService.searchOptions.ItemsPerPage = $scope.options.defaultPageSize;
							}

							// Get search data, read only.
							Object.defineProperty($scope, 'data', {
								get: function () {
									return searchService.data;
								},
								set: angular.noop
							});

							$scope.searchOptions = searchService.searchOptions;
							$scope.externalScope = $scope.$parent;
							$scope.searchFilter = searchService.searchOptions.Filter;

							var commodityTranslate = 'basics.material.materialSearchLookup',
								pageTranslate = commodityTranslate + '.page',
								htmlTranslate = commodityTranslate + '.htmlTranslate';

							$scope.showSearchSetting = false;
							$scope.searchCtrlOptions = {
								fields: [
									{id: basicsMaterialSearchTextKindOptions.basics, caption$tr$: 'basics.material.searchFields.basics'},
									{id: basicsMaterialSearchTextKindOptions.specification, caption$tr$: 'basics.material.searchFields.spec'}
								],
								displayMember: 'caption',
								valueMember: 'id',
								showOptions: true,
								showSearchModes: false,
								operators: ['contains', 'starts'],
								config: {
									autofocus: 500, readonly: false,
								},
								fnc: function () {
									$scope.refresh();
								},
								onOk: function () {
									basicsMaterialSearchProfileService.save({
										SearchMode: $scope.searchCtrlModel.mode,
										SearchIn: $scope.searchCtrlModel.selected
									});
								},
								multipleSelect: true,
								openPopUpAfterItemClick: true

							};
							$scope.searchCtrlModel = {
								mode: 0, searchstring: '', selected: []
							};

							let pophelper = $injector.get('basicsLookupdataPopupService').getToggleHelper();

							$scope.onMaterialOption = function(event){
								let popup = pophelper.toggle({
									multiPopup: false,
									resizeable: true,
									width: 400,
									focusedElement: $(event.currentTarget),
									relatedTarget: $(event.currentTarget),
									controller: 'basicsCommonMaterialSearchDialogController',
									templateUrl: globals.appBaseUrl + 'basics.common/partials/basics-common-material-search-dialog.html',
									footerTemplate: $templateCache.get('material-popup-footer.html'),
									showLastSize: true,
									resolve: {
										searchFilter: [
											function () {
												return $scope.searchFilter;
											}
										]
									}
								});
								if (popup) { // open
									popup.result.then(function (result) {
										if (result.isOk) {
											$scope.CategoryName = result.categoryName;
											$scope.categorySelect = result.categorySelect;
											$scope.mainCategoryId = result.mainCategoryId;
											setCategoryName();
											$scope.refresh($scope.categorySelect);
										}
										popup.close();
									});
									popup.closed.then(function (result) {
										window.console.log(result);
									});
								}
							};
							basicsMaterialSearchProfileService.load().then(function (data) {

								if(data) {
									$scope.searchCtrlModel.mode = data.SearchMode;
									$scope.searchCtrlModel.selected = data.SearchIn;
								}

							});

							basicsMaterialSearchProfileService.getSearchSettings().then(function (data) {
								$scope.showSearchSetting = data.ShowSearchIn;
								$scope.searchCtrlOptions.showSearchModes = data.ShowSearchMode;
							});

							//for Category-Search-DropDown
							$scope.categorySelect = {
								entity: {},
								type: ''
							};

							//html translate
							$scope.htmlTranslate = {
								attributes: $translate.instant(htmlTranslate + '.attributes'),
								documents: $translate.instant(htmlTranslate + '.documents'),
								searchResults: $translate.instant(htmlTranslate + '.searchResults'),
								category: $translate.instant(htmlTranslate + '.category'),
								structure: $translate.instant(htmlTranslate + '.structure'),
								bp: $translate.instant(htmlTranslate + '.BP'),
								information: $translate.instant(htmlTranslate + '.information'),
								keyWord: $translate.instant(htmlTranslate + '.keyWord'),
								firstText: $translate.instant(pageTranslate + '.firstText'),
								previousText: $translate.instant(pageTranslate + '.previousText'),
								nextText: $translate.instant(pageTranslate + '.nextText'),
								lastText: $translate.instant(pageTranslate + '.lastText'),
								back: $translate.instant(htmlTranslate + '.back'),
								uom: $translate.instant(htmlTranslate + '.uom'),
								price: $translate.instant(htmlTranslate + '.price'),
								alternativeSource: $translate.instant(htmlTranslate + '.alternativeSource'),
								filter: $translate.instant(htmlTranslate + '.filter'),
								catError: $translate.instant(htmlTranslate + '.catError'),
								showCatError: $translate.instant(htmlTranslate + '.showCatError'),
								materialType: $translate.instant(htmlTranslate + '.materialType'),
								co2Project: $translate.instant('basics.material.record.entityCo2Project'),
								co2Source: $translate.instant('basics.material.record.entityCo2Source'),
								co2SourceName: $translate.instant('basics.material.record.entityBasCo2SourceFk')
							};


							$scope.isPreview = false;
							$scope.navigateCategory = [];
							$scope.searchText = '';

							$scope.sortOptions = [
								{
									value: sortOptions.SupplierAscending,
									description: $translate.instant('basics.material.lookup.SupplierAscending')
								},
								{
									value: sortOptions.SupplierDescending,
									description: $translate.instant('basics.material.lookup.SupplierDescending')
								},
								{
									value: sortOptions.CodeAscending,
									description: $translate.instant('basics.material.lookup.CodeAscending')
								},
								{
									value: sortOptions.CodeDescending,
									description: $translate.instant('basics.material.lookup.CodeDescending')
								},
								{
									value: sortOptions.PriceAscending,
									description: $translate.instant('basics.material.lookup.PriceAscending')
								},
								{
									value: sortOptions.PriceDescending,
									description: $translate.instant('basics.material.lookup.PriceDescending')
								}
							];

							$scope.mainCategoryId = 1;
							var tempCategoryId = 0;
							var searchOptionFilterService = $injector.get('materialSearchOptionFilterService');
							setCategoryName();

							// DEV-21071: Ignore the search profile if framework catalog is existed
							if(!$scope.searchFilter?.MaterialCatalogId) {
								GetMaterialDefinitions();
							}

							function GetMaterialDefinitions() {
								var deffered = $q.defer();
								var materialDefinitions = searchOptionFilterService.getMaterialSearchOption();
								if (materialDefinitions) {
									setMaterialSearchOption(materialDefinitions);
									deffered.resolve(materialDefinitions);
								} else {
									searchOptionFilterService.getMaterialDefinitions().then(function (result) {
										var filterDef = JSON.parse(result.FilterDef);
										lookupDescriptor.updateData('basicsMaterialDefinitions', filterDef);
										filterDef = searchOptionFilterService.materialSearchOptionData(filterDef);
										setMaterialSearchOption(filterDef);
										deffered.resolve(filterDef);
									});
								}
								return deffered.promise;
							}
							function setCategoryName(){
								if ($scope.categorySelect && $scope.categorySelect.entity && $scope.categorySelect.entity.Code) {
									let description = $scope.categorySelect.entity.DescriptionInfo ? $scope.categorySelect.entity.DescriptionInfo.Translated : '';
									$scope.CategoryName = $scope.categorySelect.entity.Code + (description && description.length > 0 ? (' ' + description) : '');
								} else {
									$scope.CategoryName = $translate.instant($scope.mainCategoryId === 1 ? 'basics.material.materialCatalog' : 'basics.common.entityPrcStructureFk');
								}

							}
							function setMaterialSearchOption(filterDef) {
								if (!filterDef) return;
								if (searchService.searchOptions) {
									searchService.searchOptions.SortOption = filterDef.sortOption;
									searchService.searchOptions.ItemsPerPage = filterDef.itemsPerPage ?? $scope.options.defaultPageSize;
								}
								$scope.mainCategoryId = filterDef.mainCategoryId;
								$scope.categorySelect = filterDef.category;
								setCategoryName();
								let options = {};
								if (filterDef.filterOption) {
									angular.merge(options, filterDef.filterOption, $scope.options.searchOptions);
								}
								angular.extend(searchService.searchOptions, options);
								setSearchOptionsPreDefine(filterDef.category);
							}
							function isMaterialDefinitionModify(category) {
								var profileItem = searchOptionFilterService.getMaterialSearchOption();
								if (profileItem && (!category.entity || angular.isUndefined(category.entity.Id) || profileItem.category.entity.Id !== tempCategoryId || category.entity.Id !== tempCategoryId || profileItem.category.entity.Id !== category.entity.Id)) {
									if(category.entity && angular.isUndefined(category.entity.Id)){
										searchService.searchOptions.PreDefine = null;
									}
									SaveMaterialDefinition(category);
								} else if (!profileItem) {
									SaveMaterialDefinition(category);
								}
							}
							function SaveMaterialDefinition(category) {
								if (!category || !category.entity) { return; }
								var categoryItem = {};
								if (angular.isUndefined(category.entity.Id)){
									categoryItem = category;
								}
								else if(angular.isUndefined($scope.categorySelect.entity.Id)){
									categoryItem = $scope.categorySelect;
								}
								else{
									categoryItem = {
										type: $scope.categorySelect.type,
										entity: {
											Id: $scope.categorySelect.entity.Id,
											MaterialCatalogFk: $scope.categorySelect.entity.MaterialCatalogFk,
											Code: $scope.categorySelect.entity.Code
										}
									};
									if(!angular.isUndefined($scope.categorySelect.entity.DescriptionInfo)){
										categoryItem.entity.DescriptionInfo = { Translated: $scope.categorySelect.entity.DescriptionInfo.Translated };
									}
								}
								searchOptionFilterService.postMaterialSearchOption(categoryItem, searchService.searchOptions.SortOption, $scope.mainCategoryId, searchService.searchOptions.ItemsPerPage, searchService.searchOptions);
							}
							$scope.sortOptionChange = function(){
								var thisCompanySerachOption = searchOptionFilterService.getMaterialSearchOption();
								if(thisCompanySerachOption && thisCompanySerachOption.sortOption !== $scope.searchOptions.SortOption){
									searchOptionFilterService.postMaterialSearchOption(thisCompanySerachOption.category, $scope.searchOptions.SortOption, $scope.mainCategoryId, searchService.searchOptions.ItemsPerPage, $scope.searchOptions);
								}
								$scope.refresh();
							};

							$scope.revert = function() {
								var category = {
									entity: {},
									type: ''
								};
								$scope.searchText = '';
								$scope.searchCtrlModel.searchstring = '';
								searchService.searchOptions.SearchText = '';
								searchService.searchOptions.FilterByFramework = false;
								searchService.searchOptions.SortOption = sortOptions.PriceAscending;
								searchService.searchOptions.AttributeFilters = null;
								searchService.searchOptions.StructureId = null;
								searchService.searchOptions.PriceRange = null;
								searchService.searchOptions.Co2ProjectRange = null;
								searchService.searchOptions.Co2SourceRange = null;
								searchService.searchOptions.Co2SourceIdsFilter = null;
								searchService.searchOptions.UomsFilter = null;
								searchService.searchOptions.UomIdsFilter = null;
								searchService.searchOptions.CategoryIdsFilter = null;
								searchService.searchOptions.CurrentPage = 1;
								$scope.categorySelect = category;
								searchService.searchOptions.PreDefine = null;
								isMaterialDefinitionModify(category);
								setSearchOptionsPreDefine(category);
								setCategoryName();
								searchService.search();
							};

							//Refresh the search view
							$scope.refresh = function (categorySelect) {
								if($scope.showSearchSetting) {
									$scope.searchText = $scope.searchCtrlModel.searchstring;
								}

								searchService.searchOptions.EnableOnlyMainContract = $scope.$parent.enableOnlyMainContract;
								searchService.searchOptions.SearchText = $scope.searchText;
								var category = categorySelect || $scope.categorySelect;
								isMaterialDefinitionModify(category);
								if(categorySelect){
									searchService.searchOptions.PreDefine = null;
								}

								setCategoryName();
								setSearchOptionsPreDefine(category);
								let ignorePricePermission = false;
								if($scope.$parent.options){
									ignorePricePermission = !!$scope.$parent.options.ignorePricePermission;
								}
								searchService.search(ignorePricePermission);
							};

							function setSearchOptionsPreDefine(category){
								if (category && category.entity) {
									tempCategoryId = category.entity.Id;
									switch (category.type) {
										case 'prc_structure':
											searchService.searchOptions.PreDefine = {
												StructureId: category.entity.Id
											};
											break;
										case 'material_group':
											searchService.searchOptions.PreDefine = {
												GroupId: category.entity.Id,
												CategoryId: category.entity.MaterialCatalogFk
											};
											category.entity.IsMaterialGroup = true;
											break;
										case 'material_cat':
											searchService.searchOptions.PreDefine = {
												CategoryId: category.entity.Id
											};
											category.entity.IsMaterialCatalog = true;
									}
									$scope.searchOptions.PreDefine = searchService.searchOptions.PreDefine;
								}
							}

							function saveSearchOption(){
								searchOptionFilterService.saveFilterOption(searchService.searchOptions);
							}
							$scope.filterByCategory = function () {
								searchService.filterByCategory();
								saveSearchOption();
							};

							$scope.filterByUom = function () {
								searchService.filterByUom();
							};

							$scope.filterByAttribute = function () {
								searchService.filterByAttribute();
								saveSearchOption();
							};

							// #144045 - Adjustment of the pre-allocation in the material lookup
							$scope.getStructureId = function () {
								const searchOptions = $scope.searchOptions;

								if (searchOptions.Filter && searchOptions.Filter.PrcStructureOptional && searchOptions.Filter.PrcStructureId) {
									return searchOptions.Filter.PrcStructureId;
								}

								return searchOptions.StructureId;
							};

							$scope.onNavigate = function (structureId) {
								const searchOptions = $scope.searchOptions;

								if (searchOptions.Filter && searchOptions.Filter.PrcStructureOptional) {
									searchOptions.Filter.PrcStructureId = null;
								}

								$scope.searchOptions.StructureId = structureId;
								return searchService.navigateStructure();
							};

							$scope.onCategoryFilter = function (filters) {
								$scope.searchOptions.CategoryIdsFilter = filters;
								if(searchService.searchOptions){
									searchService.searchOptions.CategoryIdsFilter = filters;
								}
								$scope.filterByCategory();
							};

							$scope.onUomFilter = function (filters) {
								$scope.searchOptions.UomsFilter = filters;
								$scope.filterByAttribute();
							};

							$scope.onCo2SourceNameFilter = function (filters) {
								$scope.searchOptions.Co2SourceNameFilter = filters;
								$scope.filterByAttribute();
							};

							$scope.onPriceFilter = function () {
								$scope.searchOptions.PriceRange = {
									MinValue: $scope.data.price.value[0],
									MaxValue: $scope.data.price.value[1]
								};
								$scope.filterByAttribute();
							};

							$scope.onCo2ProjectFilter=()=>{
								$scope.searchOptions.Co2ProjectRange = {
									MinValue: $scope.data.co2project.value[0],
									MaxValue: $scope.data.co2project.value[1]
								};
								$scope.filterByAttribute();
							};

							$scope.onCo2SourceFilter = ()=>{
								$scope.searchOptions.Co2SourceRange = {
									MinValue: $scope.data.co2source.value[0],
									MaxValue: $scope.data.co2source.value[1]
								};
								$scope.filterByAttribute();
							};

							$scope.onPropertyFilter = function (filters) {
								$scope.searchOptions.AttributeFilters = filters;
								$scope.filterByAttribute();
							};

							$scope.onFrameworkFilter = function () {
								$scope.searchOptions.FilterByFramework = !$scope.searchOptions.FilterByFramework;
								$scope.refresh();
								saveSearchOption();
							};

							$scope.onMaterialTypeFilter = function(type) {
								$scope.searchOptions.MaterialTypeFilter[type] = !$scope.searchOptions.MaterialTypeFilter[type];
								$scope.refresh();
								saveSearchOption();
							};

							//if pdf  show current page,other brower type show tab ,other file down
							$scope.onPreview = function (item) {
								$scope.options.isPreview=true;
								$scope.isPreview = true;
								$scope.previewItem = item;
								$scope.mdc3dShow=(!_.isNil(item.Uuid))?true:false;
								$scope.onDocumentPreview=function(documentId,index){
									materialDocumentPreviewConfigService.onDocumentPreview($scope,documentId,index);
								};
								$q.all([searchService.getAttributes(item),searchService.getDocumentsById(item)]) .then(
									function (reses) {

										var attributs =reses[0];
										var documents=reses[1];
										var previewDocuments=documents.Main;
										var previewDocumentTypes=documents.DocumentType;

										$scope.previewAttributes = attributs;

										$scope.previewDocuments = previewDocuments;

										$scope.previewDocumentTypes = previewDocumentTypes;

										if(item.InternetCatalogFk){
											$scope.internetCatalog =item.InternetCatalogFk;
										}
										if (_.isNil(item.Uuid )) {
											return;
										}
										// todo-wui, test 3d model
										if (!_.isNil(item.InternetCatalogFk)) {
											searchService.getInternetCatalogUrl(item.InternetCatalogFk).then(function (response) {
												$rootScope.$emit('selectedScsFileChanged', {
													url: response.data.BaseUrl + '/model/main/scs/getscsfile?docID=' + item.Uuid
												});
											});
										}
										else {
											$rootScope.$emit('selectedScsFileChanged', {
												uuid: item.Uuid
											});
										}
									}
								);
							};

							$scope.onPaging = function () {
								let ignorePricePermission = false;
								if($scope.$parent.options){
									ignorePricePermission = !!$scope.$parent.options.ignorePricePermission;
								}
								return searchService.paging(null,ignorePricePermission);
							};

							$scope.onGotoMaterial = function(item){
								alert(item);// jshint ignore:line
							};

							$scope.previewBackClick = function () {
								$scope.isPreview = false;
								$scope.options.isPreview=false;
							};

							$scope.keyDown = function (event) {
								if (event.keyCode === keyCodes.ENTER) {
									$scope.refresh();
								}
							};

							// todo-wui, test 3d model
							$scope.getContainerUUID = function () {
								return 'EC9083FF0722463AB72E77573751308D';
							};

							$scope.getContentValue = function (key) {
								var value = 'EC9083FF0722463AB72E77573751308D';
								switch (key) {
									case 'uuid':
										value = 'EC9083FF0722463AB72E77573751308D';
										break;
									case 'mode':
										value = 'scs';
										break;
									case 'title':
										value = 'SCS Viewer';
										break;
									case 'defaultView':
										value = 'EC9083FF0722463AB72E77573751308D';
										break;
								}
								return value;
							};

							$scope.onContentResized = function () {

							};

							$scope.setTools = function (tools) {
							// refactoring of tool items to get the correct order.
							// Should be moved into the controllers, when all cotainers use a base controller.
								tools.items = platformToolbarService.getTools($scope.getContainerUUID(), tools.items);
								tools.version = 0;
								tools.update = function () {
									tools.version += 1;
								};
								$scope.tools = tools;
							};

							$scope.tools = {
								showImages: true,
								showTitles: true,
								cssClass: 'tools',
								items: [],
								update: function () {
								}
							};

							$scope.loadMoreAttribute = function (context) {
								return searchService.loadMoreAttribute(context ? context.property: null);
							};

							$scope.showError = function (error) {
								platformDialogService.showErrorDialog(error.Exception);
							};

							$scope.options.executePaging = executePaging;
							$scope.options.executePageSize = executePageSize;
							$scope.options.handlePageSizeChanged = handlePageSizeChanged;
							$scope.options.getInitPageSize = getInitPageSize;

							function executePaging() {
								return $scope.onPaging();
							}

							function executePageSize() {
								searchService.resetPage();
								return $scope.onPaging();
							}

							function handlePageSizeChanged(numberPerPage) {
								const thisCompanySearchOption = searchOptionFilterService.getMaterialSearchOption();
								if(thisCompanySearchOption && thisCompanySearchOption.itemsPerPage !== numberPerPage){
									$scope.searchOptions.ItemsPerPage = numberPerPage;
									searchOptionFilterService.postMaterialSearchOption(thisCompanySearchOption.category, $scope.searchOptions.SortOption, $scope.mainCategoryId, numberPerPage, $scope.searchOptions);
								}
							}

							function getInitPageSize() {
								return searchOptionFilterService.getMaterialSearchOption()?.itemsPerPage ?? $scope.options.defaultPageSize;
							}

						}]
				};

			}]);
})(angular);
