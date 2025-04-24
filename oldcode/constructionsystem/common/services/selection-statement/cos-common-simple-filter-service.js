(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonSimpleFilterService', [
		'$http', '$q', '$translate', 'cloudDesktopEnhancedFilterService', 'basicsCommonConfigLocationListService',
		'permissions', 'PlatformMessenger', 'constructionsystemCommonFilterDataService',
		function ($http, $q, $translate, cloudDesktopEnhancedFilterService, basicsCommonConfigLocationListService,
			permissions, PlatformMessenger, filterDataService) {

			return {
				createService: createService
			};

			function createService(parentServiceName) {

				var service = {
					availableFilterDefs: []
				};

				service.parentServiceName = parentServiceName;

				// eslint-disable-next-line no-unused-vars
				var filterDtoIdCounter = 1;
				var initDone = false;

				service.onResetFilter = new PlatformMessenger();


				/**
				 * get filter.
				 */
				service.getSelectedFilter = function () {
					return service.selectedFilterDefDto;
				};

				/**
				 * clear filter.
				 */
				service.clearSelectedFilter = function () {
					service.selectedFilterDefDto = null;
					filterDataService.clearSelectedFilter(service.parentServiceName);
				};

				/**
				 * get filter text by the filter dto.
				 */
				service.getCurrentFilterDef = function (filterDto) {
					filterDataService.setSelectedFilter(service.parentServiceName, filterDto);
					service.selectedFilterDefDto = filterDto;
					var filterDefinition = JSON.parse(filterDto.filterDef);

					return filterDefinition;
				};

				/**
				 * This method reads the filter meta data
				 * @method loadFilterBaseData
				 * @param {}   none
				 **/
				service.loadFilterBaseData = function loadFilterBaseData() {
					if (initDone === false) {
						return service.refresh();
					} else {
						var deferred = $q.defer();
						deferred.resolve();
						return deferred.promise;
					}
				};

				service.refresh = function () {
					var filterDefinitionPromise = service.loadAllFilters();

					return $q.all([filterDefinitionPromise]).then(function () {
						initDone = true;
						var dto = {
							filterName: $translate.instant('cloud.desktop.filterdefDefaultFilterName'), // newFilterDef.name,
							accessLevel: 'New',
							filterDef: '' // theFilterDefAsJSON
						};
						var filterDefDto = new cloudDesktopEnhancedFilterService.FilterDefDto(dto);
						service.availableFilterDefs.unshift(filterDefDto);
						service.selectedFilterDefDto = filterDefDto;
					});
				};

				/**
				 * This method reads all filter definition from backend
				 * @method loadFilterDefinitions
				 * @param {}   none
				 **/
				service.loadAllFilters = function loadFilterDefinitions() {
					return $http.get(globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/getfilterdefinitions?type=simple').then(function (response) {
						var filterDtos = [];
						filterDtoIdCounter = 1;

						_.forEach(response.data, function (dto) {
							filterDtos.push(new cloudDesktopEnhancedFilterService.FilterDefDto(dto));
						});
						sortFilterDef(filterDtos);

						return true;
					});
				};

				/**
				 * delete the filter dto in database
				 **/
				service.deleteFilterDefinition = function deleteFilterDefinition(filterDto) {
					return $http.post(
						globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/deletefilterdefinition',
						filterDto
					).then(function () {
						return removeFilterDef(filterDto.filterName);
					});
				};

				/**
				 * This method saves ....
				 * @method saveFilterDefinition
				 * @param filterDto {FilterDefinition}   none
				 **/
				service.saveFilterDefinition = function saveFilterDefinition(filterDto) {
					var filterDefParams = {
						filterName: filterDto.name,
						accessLevel: filterDto.accessLevel,
						filterDef: JSON.stringify(filterDto.filterDef)
					};

					return $http.post(globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/savefilterdefinition', filterDefParams).then(function () {
						return addUpdateFilterDef(filterDefParams);
					}, function (error) {
						console.log('saveFilterDefinition failed ', error);
					});
				};

				var filterPermissions = basicsCommonConfigLocationListService.checkAccessRights({
					u: '424e5a0eb0654106aadb84664025f068',
					r: '47d039ed2b60443289234b9f7f739d5c',
					g: 'b1f30753abed442c8d2015a7aeeebcec',
					permission: permissions.execute
				}).then(function (rights) {
					filterPermissions = $q.when(rights);
					return rights;
				});

				service.retrieveFilterPermissions = function () {
					return filterPermissions;
				};

				/**
				 * remove the seleted filter dto in client.
				 * */
				function removeFilterDef(filterName) {
					var foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
						return item.filterName === filterName;
					});

					var next;
					if (foundIdx >= 0) {
						// rmeove the selected filter dto
						service.availableFilterDefs.splice(foundIdx, 1);

						// select the next filter dto
						if (service.availableFilterDefs.length > 0) {
							// if (foundIdx === 0) { // found
							// next = service.availableFilterDefs[0];
							// } else {
							// next = service.availableFilterDefs[foundIdx - 1];
							// }
							// always take the new filter.
							next = service.availableFilterDefs[0];
						}
					}

					return next;
				}

				/**
				 *  @function sortFilterDef
				 *  @param filterDef {[] of FilterDefDto} or undefined
				 * we first sort the new array and then clear origin array and add each item individual.
				 * We need to keep origin array attached to the angular watch mechanism
				 *
				 * if !filterDef    >> we take service.availableFilterDefs
				 */
				function sortFilterDef(filterDef) {
					var sortedFilterDef = _.sortBy(filterDef || service.availableFilterDefs, function (a) {
						return [a.accessLevel, a.filterName];
					});
					service.availableFilterDefs.length = 0;

					_.forEach(sortedFilterDef, function (item) {
						service.availableFilterDefs.push(item);
					});
				}

				function addUpdateFilterDef(filterDefParams) {
					var newFilterDefDto = new cloudDesktopEnhancedFilterService.FilterDefDto(filterDefParams);

					var foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
						return item.filterName === filterDefParams.filterName;
					});

					if (foundIdx >= 0) { // found
						// if found, we have to override actual filter definition
						_.extend(service.availableFilterDefs[foundIdx], newFilterDefDto);
						// service.availableFilterDefs[foundIdx] = newFilterDefDto;
					} else {
						service.availableFilterDefs.push(newFilterDefDto);
						sortFilterDef();
					}
					return newFilterDefDto;
				}

				return service;
			}
		}
	]);
})(angular);