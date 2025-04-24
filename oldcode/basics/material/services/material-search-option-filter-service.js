(function (angular) {
	'use strict';
	/* global globals,_,$ */

	var moduleName = 'basics.material';
	angular.module(moduleName).factory('materialSearchOptionFilterService', materialSearchOptionFilterService);

	materialSearchOptionFilterService.$inject = ['$q','$http', '$injector', 'basicsLookupdataLookupDescriptorService'];

	function materialSearchOptionFilterService($q, $http, $injector, lookupDescriptor) {
		var service = {};

		service.getMaterialDefinitions = function GetMaterialDefinitions() {
			return $http.get(globals.webApiBaseUrl + 'basics/material/getmaterialdefinitions?filterName=searchOptions')
				.then(function (result) {
					if (result.data) {
						return result.data;
					}
					return result;
				});
		};

		service.getMaterialSearchOptionLookupData = function getMaterialSearchOptionLookupData() {
			var materialDefinitions;
			if (lookupDescriptor) {
				var data = lookupDescriptor.getData('basicsMaterialDefinitions');
				if (data) {
					var result = [];
					_.forEach(data, function (a) {
						result.push(a);
					});
					return result;
				}
				return null;
			}
			return materialDefinitions;
		};
		service.getMaterialSearchOption = function getMaterialSearchOption() {
			var materialDefinitions = service.getMaterialSearchOptionLookupData();
			if (materialDefinitions) {
				return service.materialSearchOptionData(materialDefinitions);
			}
			return materialDefinitions;
		};

		service.materialSearchOptionData = function materialSearchOptionData(data) {
			if (Array.isArray(data)) {
				data = _.filter(data, function (item) {
					return !angular.isUndefined(item.loginCompany);
				});
			}
			var loginCompany = $injector.get('platformContextService').clientId;
			var profileItem = _.find(data, {loginCompany: loginCompany});
			if (profileItem && profileItem.config) {
				return {
					sortOption: profileItem.config.sortOption,
					mainCategoryId: profileItem.config.mainCategoryId,
					category: profileItem.config.category,
					filterOption: profileItem.config.filterOption,
					itemsPerPage: profileItem.config.itemsPerPage
				};
			} else if (data.category && data.category.entity && data.category.entity.Id) {
				return {
					sortOption: data.sortOption,
					mainCategoryId: data.mainCategoryId,
					category: data.category,
					filterOption: data.filterOption,
					itemsPerPage: data.itemsPerPage
				};
			}
			return null;
		};

		service.saveFilterOption = function saveFilterOption(searchOptions) {
			var item = service.getMaterialSearchOption();
			service.postMaterialSearchOption(item.category, item.sortOption, item.mainCategoryId, item.itemsPerPage, searchOptions);
		};

		service.postMaterialSearchOption = function postMaterialSearchOption(categoryItem, sortOption, mainCategoryId, itemsPerPage, filterOption) {
			var loginCompany = $injector.get('platformContextService').clientId;
			var option = {};
			if(filterOption) {
				option.CategoryIdsFilter = filterOption.CategoryIdsFilter;
				option.PreDefine = filterOption.PreDefine;
				option.StructureId = filterOption.StructureId;
				option.UomsFilter = filterOption.UomsFilter;
				option.UomIdsFilter = filterOption.UomIdsFilter;
				option.SortOption = filterOption.SortOption;
				option.AttributeFilters = filterOption.AttributeFilters;
				option.MaterialTypeFilter = filterOption.MaterialTypeFilter;
				option.FilterByFramework = filterOption.FilterByFramework;
				option.ItemsPerPage = filterOption.ItemsPerPage;
			}
			var materialSerachOptions = service.getMaterialSearchOptionLookupData();
			var findSerachOption = _.find(materialSerachOptions, {loginCompany: loginCompany});
			if (findSerachOption) {
				findSerachOption.config.sortOption = sortOption;
				findSerachOption.config.mainCategoryId = mainCategoryId;
				findSerachOption.config.category = categoryItem;
				findSerachOption.config.itemsPerPage = itemsPerPage;
				findSerachOption.config.filterOption = option;
			} else {
				findSerachOption = {
					loginCompany: loginCompany,
					config: {
						sortOption: sortOption,
						mainCategoryId: mainCategoryId,
						category: categoryItem,
						itemsPerPage: itemsPerPage,
						filterOption: option
					}
				};
				if (angular.isUndefined(materialSerachOptions) || materialSerachOptions === null) {
					materialSerachOptions = [];
				}
				materialSerachOptions.push(findSerachOption);
			}
			// if (findCompany) {
			// companyItem.config.filterOption = angular.copy(findCompany.config.filterOption);
			// materialSerachOptions.splice($.inArray(findCompany, materialSerachOptions), 1);
			// }
			// materialSerachOptions.push(companyItem);

			var materialSearchItem = {
				FilterName: 'searchOptions',
				AccessLevel: 'User',
				FilterDef: JSON.stringify(materialSerachOptions)
			};
			lookupDescriptor.updateData('basicsMaterialDefinitions', materialSerachOptions);
			$http.post(globals.webApiBaseUrl + 'basics/material/savematerialdefinition', materialSearchItem);
		};
		return service;
	}
})(angular);
