/**
 * Created by wui on 6/14/2017.
 */
/* global globals,_ */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */// has many parameters
	angular.module(moduleName).factory('constructionsystemMasterDefDataService', [
		'$q',
		'$http',
		'$translate',
		'permissions',
		'cloudDesktopEnhancedFilterService',
		'basicsCommonConfigLocationListService',
		function (
			$q,
			$http,
			$translate,
			permissions,
			cloudDesktopEnhancedFilterService,
			basicsCommonConfigLocationListService) {

			var service = {
				dataItems: [],
				formerItem: null,
				selectedItem: null,
				url: {
					load: globals.webApiBaseUrl + 'constructionsystem/master/script/gettemplatedefinitions',
					save: globals.webApiBaseUrl + 'constructionsystem/master/script/savetemplatedefinition',
					delete: globals.webApiBaseUrl + 'constructionsystem/master/script/deletetemplatedefinition'
				}
			};

			service.getItems = function () {
				return service.dataItems;
			};

			service.getSelected = function () {
				return service.selectedItem;
			};

			service.setSelected = function (value) {
				service.formerItem = service.selectedItem;
				service.selectedItem = value;
			};

			service.getFormer = function () {
				return service.formerItem;
			};

			service.setFormer = function (value) {
				service.formerItem = value;
			};

			service.retrievePermissions = function () {
				return basicsCommonConfigLocationListService.checkAccessRights({
					u: '424e5a0eb0654106aadb84664025f068',
					r: '47d039ed2b60443289234b9f7f739d5c',
					g: 'b1f30753abed442c8d2015a7aeeebcec',
					permission: permissions.execute
				});
			};

			service.loadAllFilters = function () {
				return $http.get(service.url.load).then(function (response) {
					var filterDtos = [];

					_.forEach(response.data, function (dto) {
						filterDtos.push(new cloudDesktopEnhancedFilterService.FilterDefDto(dto));
					});

					service.clear();
					sortDef(filterDtos);

					return true;
				});
			};

			service.clear = function () {
				service.formerItem = null;
				service.selectedItem = null;
				service.dataItems = [];
				service.isLoading = false;
			};

			service.load = function () {
				var filterDefinitionPromise = service.loadAllFilters();

				return $q.all([filterDefinitionPromise]).then(function () {
					var dto = {
						filterName: $translate.instant('constructionsystem.master.templateDefDefaultTemplateName'), // newFilterDef.name,
						accessLevel: 'New',
						filterDef: '' // theFilterDefAsJSON
					};
					var filterDefDto = new cloudDesktopEnhancedFilterService.FilterDefDto(dto);
					service.dataItems.unshift(filterDefDto);
					service.selectedItem = filterDefDto;
				});
			};

			service.save = function (filterDto) {
				var filterDefParams = {
					filterName: filterDto.name,
					accessLevel: filterDto.accessLevel,
					filterDef: filterDto.filterDef
				};

				return $http.post(service.url.save, filterDefParams).then(function () {
					return addUpdateDef(filterDefParams);
				}, function (error) {
					console.log('save script template failed ', error);
				});
			};

			service.delete = function (filterDto) {
				return $http.post(service.url.delete, filterDto).then(function () {
					return removeDef(filterDto.filterName);
				});
			};

			function removeDef(filterName) {
				var foundIdx = _.findIndex(service.dataItems, function (item) {
					return item.filterName === filterName;
				});

				var next;
				if (foundIdx >= 0) {
					// rmeove the selected filter dto
					service.dataItems.splice(foundIdx, 1);

					// select the next filter dto
					if (service.dataItems.length > 0) {
						if (foundIdx === 0) { // found
							next = service.dataItems[0];
						} else {
							next = service.dataItems[foundIdx - 1];
						}
					}
				}

				return next;
			}

			function sortDef(filterDef) {
				var sortedFilterDef = _.sortBy(filterDef || service.dataItems, function (a) {
					return [a.accessLevel, a.filterName];
				});

				service.dataItems.length = 0;

				_.forEach(sortedFilterDef, function (item) {
					service.dataItems.push(item);
				});
			}

			function addUpdateDef(filterDefParams) {
				var newFilterDefDto = new cloudDesktopEnhancedFilterService.FilterDefDto(filterDefParams);

				var foundIdx = _.findIndex(service.dataItems, function (item) {
					return item.filterName === filterDefParams.filterName;
				});

				if (foundIdx >= 0) { // found
					// if found, we have to override actual filter definition
					_.extend(service.dataItems[foundIdx], newFilterDefDto);
					// service.dataItems[foundIdx] = newFilterDefDto;
				} else {
					service.dataItems.push(newFilterDefDto);
					sortDef();
				}
				return newFilterDefDto;
			}

			return service;
		}
	]);

})(angular);