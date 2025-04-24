/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainSelStatementExpertFilterService', [
		'$http', '$q', '$translate', 'cloudDesktopEnhancedFilterService', 'basicsCommonConfigLocationListService',
		'permissions', 'PlatformMessenger', 'constructionsystemCommonFilterDataService', 'constructionsystemCommonPropertyValueTypeService',
		function ($http, $q, $translate, cloudDesktopEnhancedFilterService, basicsCommonConfigLocationListService,
			permissions, PlatformMessenger, filterDataService, valueTypeService) {

			return {
				createService: createService
			};

			function createService(parentServiceName) {

				let service = {
					availableFilterDefs: [],
					selectionParameter: {
						version: 1,
						headerId: -1,
						parameters: []
					}
				};

				service.parentServiceName = parentServiceName;

				let initDone = false;

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
					let filterDefinition = JSON.parse(filterDto.filterDef);

					return filterDefinition.filterText;
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
						let deferred = $q.defer();
						deferred.resolve();
						return deferred.promise;
					}
				};

				service.refresh = function (headerId) {
					let filterDefinitionPromise = service.loadAllFilters();

					let loadSelectionParameterPromise = service.loadSelectionParameter(headerId, true);

					return $q.all([filterDefinitionPromise, loadSelectionParameterPromise]).then(function () {
						initDone = true;
						let dto = {
							filterName: $translate.instant('cloud.desktop.filterdefDefaultFilterName'), // newFilterDef.name,
							accessLevel: 'New',
							filterDef: '' // theFilterDefAsJSON
						};
						let filterDefDto = new cloudDesktopEnhancedFilterService.FilterDefDto(dto);
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
					return $http.get(globals.webApiBaseUrl + 'estimate/main/selstatement/getfilterdefinitions?type=expert').then(function (response) {
						let filterDtos = [];

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
						let getVariableDefUrl = globals.webApiBaseUrl + 'estimate/main/selstatement/getvariablelist';
						return $http.get(getVariableDefUrl + '?headerId=' + headerId).then(function (response) {
							service.selectionParameter.headerId = headerId;
							service.selectionParameter.version++;
							service.selectionParameter.parameters = processParameters(response.data);
							return service.selectionParameter;
						});
					}
				};


				function processParameters(tempData) {
					let variableDef = [];
					if (tempData) {
						for (let j = 0, l = tempData.length; j < l; j++) {
							let prop = {type: '', name: '', text: '', description: ''};
							let v = tempData[j];
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
						globals.webApiBaseUrl + 'estimate/main/selstatement/deletefilterdefinition',
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
					let filterDefParams = {
						filterName: filterDto.name,
						accessLevel: filterDto.accessLevel,
						filterDef: JSON.stringify(filterDto.filterDef)
					};

					return $http.post(globals.webApiBaseUrl + 'estimate/main/selstatement/savefilterdefinition', filterDefParams).then(function () {
						return addUpdateFilterDef(filterDefParams);
					}, function (error) {
						// eslint-disable-next-line no-console
						console.log('saveFilterDefinition failed ', error);
					});
				};

				let filterPermissions = basicsCommonConfigLocationListService.checkAccessRights({
					// u: 'c3310dd63f434bad9f4ca3270cd35a21',
					// r: 'ab05a54195ab4c4e8fa2b71c320332d1',
					// g: '599c60cdfd74451dab696366d351bc6a',
					//
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
					let foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
						return item.filterName === filterName;
					});

					let next;
					if (foundIdx >= 0) {
						// rmeove the selected filter dto
						service.availableFilterDefs.splice(foundIdx, 1);

						// select the next filter dto
						if (service.availableFilterDefs.length > 0) {
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
					let sortedFilterDef = _.sortBy(filterDef || service.availableFilterDefs, function (a) {
						return [a.accessLevel, a.filterName];
					});
					service.availableFilterDefs.length = 0;

					_.forEach(sortedFilterDef, function (item) {
						service.availableFilterDefs.push(item);
					});
				}

				function addUpdateFilterDef(filterDefParams) {
					let newFilterDefDto = new cloudDesktopEnhancedFilterService.FilterDefDto(filterDefParams);

					let foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
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
