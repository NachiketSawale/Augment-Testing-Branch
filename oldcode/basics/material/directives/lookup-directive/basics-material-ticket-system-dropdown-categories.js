/**
 * Created by uestuenel on 30.07.2017.
 */
(function(angular) {
	/* global globals,_,$ */
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialTicketSystemDropdownCategoriesDirective', basicsMaterialTicketSystemDropdownCategoriesDirective);

	basicsMaterialTicketSystemDropdownCategoriesDirective.$inject = ['materialCategoriesDropdownService', 'basicsLookupdataPopupService', '$q', '_', '$translate', 'estimateProjectRateBookConfigDataService','$injector'];

	function basicsMaterialTicketSystemDropdownCategoriesDirective(materialCategoriesDropdownService, basicsLookupdataPopupService, $q, _, $translate, estimateProjectRateBookConfigDataService,$injector) {
		return {
			restrict: 'EA',
			scope: {
				categorySelect: '=ngModel',
				onOk: '&'
			},
			templateUrl: globals.appBaseUrl + 'Basics.Material/templates/lookup/basics-material-ticket-system-dropdown-categories.html',
			link: function(scope, element, attrs) {
				scope.selectedCategory = {};

				scope.$watch('categorySelect', function (newValue) {
					if(_.isEmpty(newValue.entity)){
						scope.selectMainCategory(scope.mainCategoryList[0]);
						scope.CategoryName = scope.selectedCategory.name;
					}
				});

				scope.selectMainCategory = function (mainCat) {

					//first set all active folder on non-active
					angular.forEach(scope.mainCategoryList, function (cat) {
						cat.active = undefined;
					});
					mainCat.active = true;

					/*
					use case: category and ChildItems are selected. And the user click the same category again:
					end result: remove the selection from ChildItems. Main Category retain the selection.
				 */
					if(scope.selectedCategory === mainCat) {
						var childelements = mainCat.structure.ChildItems;

						while(_.size(childelements) > 0) {
							var selectedChild = _.find(childelements, ['selected', true]);

							if(selectedChild) {
								selectedChild.selected = false;
								childelements = selectedChild.ChildItems;
							}
							else {
								childelements = null;
							}
						}
					}

					//is important for the tree directive
					scope.selectedCategory = mainCat;
				};

				//Category Structure List. JSON for the directive 'platform-tree-enhancement-directive'
				scope.mainCategoryList = [
					{
						mainCategoryId: 1,
						name: $translate.instant('basics.material.materialCatalog'),
						structure: {
							ChildItems: []
						}
					},
					{
						mainCategoryId: 2,
						name: $translate.instant('basics.material.procurementStructure'),
						structure: {
							ChildItems: []
						}

					}];

				//set default Button title. And default catalog list
				scope.selectMainCategory(scope.mainCategoryList[0]);

				scope.CategoryName = scope.selectedCategory.name;

				//if the http-request has been running, then show the HTML-Markup for the Categories
				scope.promiseProcurement = false;
				scope.promiseMaterial = false;

				var isTicketSystem = false;
				var isFilterCompany = false;
				var searchOptions = null;

				if(attrs.options) {
					var options = scope.$parent.$eval(attrs.options);

					searchOptions = options;

					if (options && options.Filter) {
						isTicketSystem = options.Filter.IsTicketSystem;
						isFilterCompany = options.Filter.IsFilterCompany;
					}
				}

				var parentIds = [], isChildItemSelected = false;
				var setMaterialCatStructures = function() {
					materialCategoriesDropdownService.getMaterialStructures(isTicketSystem, isFilterCompany).then(function (response) {
					//filter by project ratebook
						var filterIds = estimateProjectRateBookConfigDataService.getFilterIds(4);
						var categories = [];

						if (filterIds && filterIds.length > 0) {
							_.each(response, function (item) {
								if (_.includes(filterIds, item.Id)) {
									categories.push(item);
								}
							});
						} else {
							categories = response;
						}

						isChildItemSelected = false;
						parentIds = [];
						if(scope.selectedCategory && scope.selectedCategory.mainCategoryId === 1 && scope.categorySelect) {
							findChildItem(categories, scope.categorySelect.entity.Id, true);
							setChildItemSelected(categories, 0);
						}
						else if(scope.selectedCategory && scope.selectedCategory.mainCategoryId === 2 && scope.selectedCategory.structure && scope.categorySelect){
							findChildItem(scope.selectedCategory.structure.ChildItems, scope.categorySelect.entity.Id, true);
							setChildItemSelected(scope.selectedCategory.structure.ChildItems, 0);
						}
						if(scope.mainCategoryList[0].structure.ChildItems && hasChildItemSelected(scope.mainCategoryList[0].structure.ChildItems, 0) === false){
							scope.mainCategoryList[0].structure.ChildItems = categories;
						}
						scope.promiseMaterial = true;
					});
				};

				function hasChildItemSelected(childItems, index){
					var item = _.find(childItems, ['Id', parentIds[index]]);
					if(item){
						if(item.selected === false){
							return false;
						}
						if(item.ChildItems && index + 1 < parentIds.length){
							return setChildItemSelected(item.ChildItems, index + 1, parentIds);
						}
					}
					return false;
				}
				function setChildItemSelected(childItems, index){
					var item = _.find(childItems, ['Id', parentIds[index]]);
					if(item){
						item.selected = true;
						if(item.ChildItems && index + 1 < parentIds.length){
							return setChildItemSelected(item.ChildItems, index + 1, parentIds);
						}
					}
				}
				function findChildItem(childItems, id, isTop){
					if(angular.isUndefined(id)) {return [];}
					var childItem = _.find(childItems, ['Id', id]);
					if(childItem){
						childItem.selected = true;
						isChildItemSelected = true;
						parentIds.push(childItem.Id);
						return parentIds;
					}
					childItems.some(function(item){
						if(isChildItemSelected){
							return true;
						}
						if(isTop){
							parentIds = [];
							isChildItemSelected = false;
						}
						if(item.ChildItems){
							parentIds.push(item.Id);
							return findChildItem(item.ChildItems, id, false);
						}
					});
				}

				var searchOptionFilterService = $injector.get('materialSearchOptionFilterService');
				InitMaterialSearchOption();
				function InitMaterialSearchOption() {
					var materialDefinitions = searchOptionFilterService.getMaterialSearchOption();
					if (materialDefinitions) {
						setMaterialSearchOption(materialDefinitions);
					} else {
						searchOptionFilterService.getMaterialDefinitions().then(function (result) {
							var filterDef = JSON.parse(result.FilterDef);
							$injector.get('basicsLookupdataLookupDescriptorService').updateData('basicsMaterialDefinitions', filterDef);
							filterDef = searchOptionFilterService.materialSearchOptionData(filterDef);
							setMaterialSearchOption(filterDef);
						});
					}
				}
				function setMaterialSearchOption(filterDef) {
					scope.categorySelect = filterDef.category;
					setMaterialCatStructures();
					var categorySelectDescription = '';
					if(scope.categorySelect) {
						var categorySelectEntity = scope.categorySelect.entity;
						if (categorySelectEntity && categorySelectEntity.DescriptionInfo && categorySelectEntity.DescriptionInfo.Translated) {
							categorySelectDescription = categorySelectEntity.DescriptionInfo.Translated;
						}
						if(scope.categorySelect.entity.Code) {
							scope.CategoryName = scope.categorySelect.entity.Code + ' ' + categorySelectDescription;
						}
					}
					if(scope.$parent.searchOptions && filterDef){
						scope.$parent.searchOptions.SortOption = filterDef.sortOption;
					}
					scope.selectMainCategory(_.find(scope.mainCategoryList, {mainCategoryId: scope.$parent.mainCategoryId}));
				}

				materialCategoriesDropdownService.getCatItems().then(function(response) {
					scope.mainCategoryList[1].structure.ChildItems = _.sortBy( response, 'Code' );
					scope.promiseProcurement = true;

					if (searchOptions && searchOptions.PreDefine && !_.isNil(searchOptions.PreDefine.StructureId)) {
						var prcStructure = findStructure(response, searchOptions.PreDefine.StructureId);
						setCategory(prcStructure);
					}
					else if(scope.categorySelect){
						setCategory(scope.categorySelect.entity);
					}
				});

				function setCategory(category){
					if(category && category.Code) {
					//set ngModal-value
						scope.categorySelect.entity = category;
						scope.categorySelect.type = getFlagForStructureType();
						//set button title
						scope.CategoryName = category.Code + ' ' + (category.DescriptionInfo.Translated ? category.DescriptionInfo.Translated : '');
						scope.selectMainCategory(_.find(scope.mainCategoryList, {mainCategoryId: scope.$parent.mainCategoryId}));
					}
				}

				function findStructure(items, id) {
					var result = null;

					if (items && items.length) {
						items.forEach(function (item) {
							if (result) {
								return;
							}

							if (item.Id === id) {
								result = item;
							}
							else if (item.ChildItems && item.ChildItems.length) {
								result = findStructure(item.ChildItems, id);
							}

							if(result){
								item.selected = true;
							}
						});
					}

					return result;
				}

				var instance, helper;

				scope.togglePopup = function(event) {
					if (!helper) {
						helper = basicsLookupdataPopupService.getToggleHelper();
					}

					//update Material Categories Structures with project ratebook
					setMaterialCatStructures();
					var popupOptions = {
						scope: scope,
						templateUrl:globals.appBaseUrl + 'Basics.Material/templates/lookup/material-categories-dropdown.html',
						multiPopup: false,
						plainMode: true,
						width: getContentWidth(),
						focusedElement: $(event.target),
						left: 0
					};

					instance = helper.toggle(popupOptions);

					function getCommonId(items) {
						let item = _.find(items, {'selected': true});
						if(item.ChildItems === null) {
							return item;
						}
						else {
							const child = getCommonId(item.ChildItems);
							if (child) {
								return child;
							}
						}
					}

					/*
						Called by the "platform-tree-enhancement-directive" directive.
						Item is fetched from the array first. Then, depending on the category, the child elements of the WebAPI are called up.
					 */
					scope.onChildClick = function() {
						let item = getCommonId(scope.selectedCategory.structure.ChildItems);

						if(scope.selectedCategory.mainCategoryId === 1) {
							let _Id =  item.IsMaterialGroup ? item.Id : null;
							return materialCategoriesDropdownService.getMaterialGroupById(item.MaterialCatalogFk, _Id).then(function (response) {
								return response;
							});
						}
						else {
							return materialCategoriesDropdownService.getPrcStructureItemsById(item.Id).then(function (response) {
								return response;
							});
						}
					};

					//button interaction
					scope.onOK = function() {
					//refactor: not jQuery solution. Solution with data-binding

						/*
						check if clicked one of the main category(All, Procurement, Material).
					  */
						var treeElement = $('.popup-content').find('[platform-tree-enhancement-directive]');
						var selectItems = findSelectMaterialCategorieList();
						if(selectItems.length > 0) {
							// if use 'treeElement.find('.selected')', it can not find the selected data of the third layer
							scope.categorySelect.entity = selectItems[selectItems.length - 1];
							scope.categorySelect.type = getFlagForStructureType();
							scope.CategoryName = scope.categorySelect.entity.Code + ' ' + (scope.categorySelect.entity.DescriptionInfo.Translated ? scope.categorySelect.entity.DescriptionInfo.Translated : '');
						}
						else if(treeElement.find('.selected').length > 0) {
							//get the scope from html-markup
							var treeElementScope = treeElement.isolateScope();

							//set ngModal-value
							scope.categorySelect.entity= treeElementScope.dataModel.entity ? treeElementScope.dataModel.entity : treeElementScope.dataModel;

							scope.categorySelect.type= getFlagForStructureType();

							//set button title
							scope.CategoryName = scope.categorySelect.entity.Code + ' ' + (scope.categorySelect.entity.DescriptionInfo.Translated ? scope.categorySelect.entity.DescriptionInfo.Translated : '');
						}
						else {
							//set start position of the clicked category
							scope.selectMainCategory(scope.selectedCategory);

							//if selected a main Category:
							scope.categorySelect = {
								entity: {},
								type: ''
							};

							//set button title
							scope.CategoryName = scope.selectedCategory.name;
						}

						scope.$parent.mainCategoryId = scope.selectedCategory.mainCategoryId;
						//close popup
						instance.close();

						if(angular.isFunction(scope.onOk)) {
							scope.onOk({
								categorySelect: scope.categorySelect
							});
						}
					};

					scope.onCancel = function() {
						instance.close();
					};

					function findSelectMaterialCategorieList(){
						var childelements = angular.copy(scope.selectedCategory.structure.ChildItems);
						var selectItem = [];
						while(_.size(childelements) > 0) {
							var selectedChild = _.find(childelements, ['selected', true]);
							if(selectedChild) {
								selectItem.push(selectedChild);
								selectedChild.selected = false;
								childelements = selectedChild.ChildItems;
							}
							else {
								childelements = null;
							}
						}
						return selectItem;
					}

					//remove overflow:auto in parent div-container
					setTimeout(function() {
					//if the selected category is not in the visible range.
						$('[platform-tree-enhancement-directive]').find('li.selected').each(function(){
							$(this)[0].scrollIntoView();
						});

						$('.popup-content').css('overflow', 'hidden');
					}, 100);

				};

				function getContentWidth() {
					return element.parents('.subview-content').width();
				}

				function getFlagForStructureType() {
					var toReturn = '';
					if (angular.isUndefined(scope.categorySelect.entity.IsMaterialCatalog) && angular.isUndefined(scope.categorySelect.entity.IsMaterialGroup) && angular.isUndefined(scope.categorySelect.entity.IsLive)) {
						toReturn = scope.categorySelect.type;
					} else if (scope.categorySelect.entity.IsMaterialCatalog) {
						toReturn = 'material_cat';
					} else if (scope.categorySelect.entity.IsMaterialGroup) {
						toReturn = 'material_group';
					} else {
						toReturn = 'prc_structure';
					}
					return toReturn;
				}
			}
		};
	}

})(angular);
