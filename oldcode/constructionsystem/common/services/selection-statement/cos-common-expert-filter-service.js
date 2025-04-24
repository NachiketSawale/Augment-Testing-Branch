(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonExpertFilterService', [
		'$http', '$q', '$translate', 'cloudDesktopEnhancedFilterService', 'basicsCommonConfigLocationListService',
		'permissions', 'PlatformMessenger', 'constructionsystemCommonFilterDataService', 'constructionsystemCommonPropertyValueTypeService',
		function ($http, $q, $translate, cloudDesktopEnhancedFilterService, basicsCommonConfigLocationListService,
			permissions, PlatformMessenger, filterDataService, valueTypeService) {

			return {
				createService: createService
			};

			function createService(parentServiceName) {

				var service = {
					availableFilterDefs: [],
					selectionParameter: {
						version: 1,
						headerId: -1,
						parameters: []
					}
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

				service.refresh = function (headerId) {
					var filterDefinitionPromise = service.loadAllFilters();

					var loadSelectionParameterPromise = service.loadSelectionParameter(headerId, true);

					return $q.all([filterDefinitionPromise, loadSelectionParameterPromise]).then(function () {
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
					return $http.get(globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/getfilterdefinitions?type=expert').then(function (response) {
						var filterDtos = [];
						filterDtoIdCounter = 1;

						_.forEach(response.data, function (dto) {
							filterDtos.push(new cloudDesktopEnhancedFilterService.FilterDefDto(dto));
						});
						sortFilterDef(filterDtos);

						return true;
					});
				};

				service.loadSelectionParameter = function loadSelectionParameter(headerId, load) {
					if (!headerId) {
						return $q.when(service.selectionParameter);
					}
					if (service.selectionParameter.headerId === headerId && load !== true) {
						return $q.when(service.selectionParameter);
					} else {
						var getVariableDefUrl = globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/getvariablelist';
						return $http.get(getVariableDefUrl + '?headerId=' + headerId).then(function (response) {
							service.selectionParameter.headerId = headerId;
							service.selectionParameter.version++;
							service.selectionParameter.parameters = processParameters(response.data);
							return service.selectionParameter;
						});
					}
				};


				function processParameters(tempData) {
					var variableDef = [];
					if (tempData) {
						for (var j = 0, l = tempData.length; j < l; j++) {
							var prop = {type: '', name: '', text: '', description: ''};
							var v = tempData[j];
							prop.type = convertTypeFromCosTypeToSelectionType(v.type);
							prop.name = v.variableName;
							prop.text = '@[' + v.variableName + ']';
							prop.description = (v.description ? v.description + ' ' : '') +
								'(' + valueTypeService.getValueTypeDescription(prop.type) + ')';
							variableDef.push(prop);
						}
					}
					return variableDef;
				}

				function convertTypeFromCosTypeToSelectionType(cosType) {
					switch (cosType) {
						case 0: // Integer
							return 3; // integer
						case 1: // Decimal1
						case 2: // Decimal2
						case 3: // Decimal3
						case 4: // Decimal4
						case 5: // Decimal5
						case 6: // Decimal6
							return 2; // decimal
						case 10: // Boolean
							return 4; // boolean
						case 11: // Date
							return 5; // dateTime
						case 12: // Text
							return 1; // string
					}
				}


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