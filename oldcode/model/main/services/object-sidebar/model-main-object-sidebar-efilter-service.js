/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerCameraPositionDialogService
	 * @function
	 * @requires
	 *
	 * @description Provides a dialog box that allows to input settings for a new stored camera position.
	 */
	angular.module('model.main').factory('modelMainObjectSidebarEnhancedFilterService', ['_', '$http', '$q', '$log',
		'cloudDesktopEnhancedFilterService', 'basicsCommonConfigLocationListService', 'permissions',
		'PlatformMessenger',
		function (_, $http, $q, $log, eFilterSvc, basicsCommonConfigLocationListService, permissions, PlatformMessenger) {
			var service = {};

			service.availableFilterDefs = [];

			var filterPropertyMap;
			var filterOperatorInfo = {};
			var filterPropertyMapFromPathIdMap;
			var initDone = false;

			service.onResetFilter = new PlatformMessenger();

			/**
			 *
			 * @param path
			 * @param id
			 * @param isCharacteristic
			 */
			function createMapKeyFromPathId(path, id, isCharacteristic, specialTypeId, fieldInfo) {
				if (specialTypeId) {
					switch (specialTypeId) {
						case 'MODEL_OBJECT_PROPERTY':
							return (function () {
								if (fieldInfo) {
									return 'MOP:' + path + '/' + fieldInfo.propertyId;
								} else {
									return 'MOP:' + path + '/root';
								}
							})();
						default:
							throw new Error('Unknown special type ID: ' + specialTypeId);
					}
				} else if (isCharacteristic) {
					return 'C:' + path + '/' + id;
				} else {
					return path + '/' + id;
				}
			}

			/**
			 *
			 * @param path
			 * @param id
			 * @param isCharacteristic
			 * @returns {*}
			 */
			function getFilterPropertyFromPathIdMap(path, id, isCharacteristic, specialTypeId, fieldInfo) {
				var key = createMapKeyFromPathId(path, id, isCharacteristic, specialTypeId, fieldInfo);
				return filterPropertyMapFromPathIdMap.get(key);
			}

			/**
			 *
			 * @param id
			 * @returns {*}
			 */
			service.getPropertybyId = function (id) {
				if (filterPropertyMap) {
					return filterPropertyMap.get(id);
				}
				return undefined;
			};

			var updateMethods;

			/**
			 *
			 * @returns {service.FilterDefinition}
			 */
			service.createDefaultFilterDefinition = function createDefaultFilterDefinition(includeCrio) {
				var newFilter = new eFilterSvc.FilterDefinition();

				newFilter.criteria = new eFilterSvc.Criteria(service, updateMethods, undefined, null, newFilter);
				if (includeCrio) {
					newFilter.criteria.createNewCriterion();
				}
				return newFilter;
			};

			/**
			 * @function dataType2UiControlType
			 * @param datatype
			 * @returns {*}
			 */
			function dataType2UiControlType(datatype) {
				var fo = filterOperatorInfo;
				var uiControlType;
				switch (datatype) {
					case fo.criterionDataTypeString:
						uiControlType = 'stringCtrl.description';
						break;
					case fo.criterionDataTypeRemarkString:
						uiControlType = 'stringCtrl.remark';
						break;
					case fo.criterionDataTypeNumber:
						uiControlType = 'numCtrl.factor';
						break;
					case fo.criterionDataTypeInteger:
						uiControlType = 'numCtrl.integer';
						break;
					case fo.criterionDataTypePercent:
						uiControlType = 'numCtrl.percent';
						break;
					case fo.criterionDataTypeMoney:
						uiControlType = 'numCtrl.money';
						break;
					case fo.criterionDataTypeQuantity:
						uiControlType = 'numCtrl.quantity';
						break;
					case fo.criterionDataTypeDateTime:
						uiControlType = 'dateCtrl.datetime';
						break;
					case fo.criterionDataTypeDate:
						uiControlType = 'dateCtrl.date';
						break;
					case fo.criterionDataTypeTime:
						uiControlType = 'dateCtrl.time';
						break;
				}
				return uiControlType;
			}

			/**
			 *
			 * @param theCriterion
			 */
			function criterionValueVisibility(theCriterion) {
				theCriterion.value1Hidden = (theCriterion.selectedOperator || {}).operands === 0;
				theCriterion.value2Hidden = (theCriterion.selectedOperator || {}).operands !== 2;
				theCriterion.valuelistHidden = !(theCriterion.selectedOperator || {}).isLookupOp;
			}

			function getUiControlTypeFromDataType(theCriterion) {
				return dataType2UiControlType(theCriterion.datatype);
			}

			/**
			 *
			 * @param filterproperty
			 * @returns {{}}
			 */
			function onFilterPropertyChanged(theCriterion, initialize) { // jshint ignore:line
				if (!theCriterion.selectedProperty) {
					return;
				}
				initialize = initialize || false; // optional initialize: default is false

				theCriterion.operatorsListSimple = service.getCriterionOperators(theCriterion.selectedProperty);

				var ops = theCriterion.operatorsListSimple;
				// check current operator in avaliable operator list
				var isOpThere;
				if (theCriterion.selectedOperator) {
					isOpThere = _.find(ops, function (item) {
						return item.id === theCriterion.selectedOperator.id;
					});
				}
				if (!isOpThere) {
					theCriterion.selectedOperator = ops[0];
				}

				// set new datatype
				var selProp = theCriterion.selectedProperty;
				var colInfo = selProp.dto.filterItem;
				if (colInfo.kind === 1) { // lookup, relation 1-n,n-1
					colInfo = selProp.dto.filterItem.myColumn;
				}

				if (initialize) {
					theCriterion.datatype = (colInfo.uiType === 'lookup') ? 'integer' : colInfo.uiType;
				}

				// if there is a datatype change we clean value1/value2
				// if (theCriterion.datatype !== colInfo.uiType) {
				if (!initialize) {
					// theCriterion.datatype = colInfo.uiType;
					theCriterion.datatype = (colInfo.uiType === 'lookup') ? 'integer' : colInfo.uiType;
					theCriterion.value1 = theCriterion.getDefaultValue();
					theCriterion.value2 = theCriterion.getDefaultValue();
					theCriterion.visible = false; // trigger refresh: see remark Criterion-visible , set temporary values invisible
					// valuelist we must always clean
					theCriterion.valuelist = null;
					theCriterion._valuelist.property = null;	// clean lookup list as well
					theCriterion._valuelist.datasource.length = 0;	// clean lookup list as well
				}

				theCriterion.path = selProp.dto.myPath;

				theCriterion.attribute = 0;
				theCriterion.characteristic = 0;
				if (colInfo.isCharacteristicItem) {
					theCriterion.characteristic = colInfo.characteristicId;
				} else if (colInfo.fieldInfo) {
					theCriterion.specialType = colInfo.specialTypeId;
					theCriterion.specialFieldInfo = colInfo.fieldInfo;
				} else {
					theCriterion.attribute = colInfo.id;
				}
				if (colInfo.isLookup || colInfo.isLookUpForeignKey) { // in case of lookup - update lookup dataSource
					eFilterSvc.updateDataSource(theCriterion);
				}

				theCriterion.valueUiControlType = getUiControlTypeFromDataType(theCriterion);
				criterionValueVisibility(theCriterion);

				theCriterion.operatorDisabled = (theCriterion.selectedProperty === undefined || theCriterion.selectedProperty === null);

				theCriterion.expandedProperties = undefined;
				if (theCriterion.selectedProperty) {
					theCriterion.expandedProperties = getAllFilterPropertyParentIncludeMe(theCriterion.selectedProperty);
				}
				theCriterion.information = ''; // colInfo.uiLabelText;
			}

			/**
			 *
			 * @param filterproperty
			 * @returns {{}}
			 */
			function onFilterOperatorChanged(theCriterion) {
				if (!theCriterion.selectedProperty) {
					return;
				}

				criterionValueVisibility(theCriterion);
			}

			updateMethods = {
				onFilterOperatorChanged: onFilterOperatorChanged,
				onFilterPropertyChanged: onFilterPropertyChanged
			};

			/**
			 *
			 * @param criteria
			 */
			service.processFilterDefinition = function processFilterDefinition(currentFilterDefinition) {
				// console.log('processFilterDefinition', currentFilterDefinition);
				var theFilterDefinition = new eFilterSvc.FilterDefinition({dto: currentFilterDefinition});

				theFilterDefinition.criteria = processCriteria(currentFilterDefinition.criteria, null, theFilterDefinition);
				return theFilterDefinition;
			};

			/**
			 * @method getCurrentFilterDef
			 * @param filterDefDto
			 */
			service.getCurrentFilterDef = function (filterDefDto) {
				service.selectedFilterDefDto = filterDefDto;
				var filterDefinition = JSON.parse(filterDefDto.filterDef);
				service.currentFilterDefItem = service.processFilterDefinition(filterDefinition);
				return service.currentFilterDefItem;
			};


			/**
			 *
			 * @param criteriaDto
			 * @param parentCriteria
			 */
			function processCriteria(criteriaDto, parent, theFilterDefinition) {
				//console.log('processCriteria', criteria);

				var theCriteria = new eFilterSvc.Criteria(service, updateMethods, {dto: criteriaDto}, parent, theFilterDefinition);

				// var theCriteria fehlt ????
				if (criteriaDto.criterion) {
					_.forEach(criteriaDto.criterion, function (itemCriterion) {
						var newCriterion = processCriterion(itemCriterion, theCriteria);
						theCriteria.criterion.push(newCriterion);
					});
				}

				// do we also have criteria(s)
				if (criteriaDto.criteria) {
					_.forEach(criteriaDto.criteria, function (itemCriteria) {
						var newCriteria = processCriteria(itemCriteria, theCriteria);
						theCriteria.criteria.push(newCriteria);
					});
				}
				return theCriteria;
			}


			/**
			 *
			 * @param criteria
			 */
			function processCriterion(criterion, parent) {
				// this is the FilterDefinition Object
				// console.log('processCriterion', criterion);

				var theCriterion = new eFilterSvc.Criterion(service, updateMethods, {dto: criterion}, parent);

				var id = theCriterion.attribute > 0 ? theCriterion.attribute : theCriterion.characteristic;
				theCriterion._selectedProperty = getFilterPropertyFromPathIdMap(theCriterion.path, id, theCriterion.characteristic > 0, theCriterion.specialType, theCriterion.specialFieldInfo);
				theCriterion._selectedOperator = service.getCriterionOperator(theCriterion.operator);
				onFilterPropertyChanged(theCriterion, true);
				return theCriterion;
			}

			/**
			 *
			 * @param filterProperty
			 * @param retList
			 * @returns {*}
			 */
			function getAllFilterPropertyParentIncludeMe(filterProperty, retList) {
				retList = retList || [];

				retList.push(filterProperty);
				if (filterProperty.parent) {
					return getAllFilterPropertyParentIncludeMe(filterProperty.parent, retList);
				}
				return retList;
			}

			/**
			 * @function filterMetaDataToPropertyMap
			 * this function prepares the metadata from service and build a
			 * filterproperty map with key=id
			 * creates a a list of all root properties
			 * and resolves all children of each property
			 *
			 * @param filterMetaData, that data from the backend service
			 */
			function filterMetaDataToPropertyMap(filterMetaData) {

				filterPropertyMap = new Map();
				filterPropertyMapFromPathIdMap = new Map();
				service.filterPropertyList = [];
				service.filterRootPropertyList = [];
				service.rootTableId = filterMetaData.rootTableId;
				service.rootDisplayName = filterMetaData.rootTableDisplayName;

				_.forEach(filterMetaData.filterColumns, function (filterColumn) {
					var fp = new eFilterSvc.FilterProperty(service, filterColumn);

					// map for direct mapping of id to property
					filterPropertyMap.set(fp.id, fp);

					// build path with Id map for attributes and characteristic
					var isCharItem = fp.dto.filterItem.isCharacteristicItem || false;
					var key = createMapKeyFromPathId(fp.dto.myPath,
						isCharItem ? fp.dto.filterItem.characteristicId : fp.dto.filterItemId,
						isCharItem, fp.dto.filterItem.specialTypeId, fp.dto.filterItem.fieldInfo);
					filterPropertyMapFromPathIdMap.set(key, fp);

					service.filterPropertyList.push(fp);
					if ((fp.dto.myPath === '') && !fp.dto.filterItem.isNested) {
						service.filterRootPropertyList.push(fp);
					}
				});

				service.filterRootPropertyList = _.sortBy(service.filterRootPropertyList, function (n) {
					return n.uiSortId;
				});

				// now resolve children and parent
				_.forEach(service.filterPropertyList, function (fp) {
					// resolve the list of ids to references
					fp.resolveChildProperties();
				});
			}

			/**
			 * @function  service.getCriteriaOperator
			 * @param id  id of operator, i.e. 'and'
			 * @returns criteria operator
			 */
			service.getCriteriaOperator = function getCriteriaOperator(id) {

				if (id && filterOperatorInfo && filterOperatorInfo.criteriaOperators) {
					var op = _.find(filterOperatorInfo.criteriaOperators, function (item) {
						return item.id === id;
					});
					return op;
				}
				return undefined;
			};

			/**
			 *
			 * @function  service.getCriterionOperator
			 * @param id  id of operator, i.e. 'in'
			 * @returns criterion operator
			 */
			service.getCriterionOperator = function getCriterionOperator(id) {

				if (id && filterOperatorInfo && filterOperatorInfo.criterionOperators) {
					var op = _.find(filterOperatorInfo.criterionOperators, function (item) {
						return item.id === id;
					});
					return op;
				}
				return undefined;
			};

			/**
			 * @function  service.getCriteriaOperators
			 *
			 * @returns list of criteria operators
			 */
			service.getCriteriaOperators = function getCriteriaOperators() {
				// console.log('getCriteriaOperators called'); // , $scope.criteria);

				if (filterOperatorInfo && filterOperatorInfo.criteriaOperators) {
					return _.sortBy(filterOperatorInfo.criteriaOperators, 'uiDisplayName');
				} else {
					return [];
				}
			};

			/**
			 * @function service.getCriterionOperators
			 * @param currentProperty
			 * @returns list of criterion operators
			 */
			service.getCriterionOperators = function getCriterionOperators(currentProperty) {

				/**@function checkOperatorType
				 * @param op
				 * @returns {*}
				 */
				function checkOperatorType(op) { // jshint ignore:line
					var fo = filterOperatorInfo;

					if (op.isNullableOp && colInfo.isNullable) {
						return true;
					}

					//if (colInfo.isForeignKey) {
					//	return op.isNullableOp;
					//}

					if (colInfo.specialTypeId === 'MODEL_OBJECT_PROPERTY') {
						if (op.isRelationSetOp) {
							return true;
						}
					}

					if (op.isLookupOp && colInfo.isLookUpForeignKey) {
						return true; // rei 'in' operator disabled  /// return true; //op.isLookupOp;
					} else if (colInfo.isForeignKey) { // for lookup we only suppport nullable
						return op.isNullableOp;
					} else if (uiType === fo.criterionDataTypeString || uiType === fo.criterionDataTypeRemarkString) {
						return op.isStringOp;
					} else if (uiType === fo.criterionDataTypeNumber || uiType === fo.criterionDataTypeInteger || uiType === fo.criterionDataTypePercent || uiType === fo.criterionDataTypeMoney || uiType === fo.criterionDataTypeQuantity) {
						return op.isNumberOp;
					} else if (uiType === fo.criterionDataTypeDateTime || uiType === fo.criterionDataTypeDate) {
						return op.isDateTimeOp;
					} else if (uiType === fo.criterionDataTypeBoolean) {
						return op.isBoolOp;
					} else if (uiType === fo.criterionDataTypeNoValue) {
						return op.isNoValueOp;
					} else if (uiType === fo.criterionDataTypeReference) {
						return op.isRelationSetOp;
					}
					if (colInfo.isNullable) {
						return op.isNullableOp;
					}
				}

				if (!currentProperty) {
					return []; // filterOperatorInfo.criterionOperators;
				}

				if (filterOperatorInfo && filterOperatorInfo.criterionOperators) {
					var ops = filterOperatorInfo.criterionOperators;
					var colInfo = currentProperty.dto.filterItem;
					if (colInfo.kind === 1) { // is entity
						colInfo = currentProperty.dto.filterItem.myColumn;
					}
					var uiType = colInfo.uiType;

					var resultOps = _.filter(ops, checkOperatorType);
					resultOps = _.sortBy(resultOps, 'uiDisplayName');

					return resultOps;
				} else {
					return [];
				}
			};

			/**
			 *
			 * @param filterDef
			 */
			function removeFilterDef(filterName) {

				var foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
					return item.filterName === filterName;
				});
				var next;
				if (foundIdx >= 0) { // found
					service.availableFilterDefs.splice(foundIdx, 1); // rmeove on elements
					// no select the new one
					if (service.availableFilterDefs.length > 0) {
						if (foundIdx === 0) { // found
							next = service.availableFilterDefs[0];
						} else {
							next = service.availableFilterDefs[foundIdx - 1];
						}
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

			/**
			 *
			 * @param filterName
			 * @returns {*}
			 */
			service.getAvailableFilterDefsByName = function getAvailableFilterDefsByName(filterName) {
				var found = _.find(service.availableFilterDefs, function (item) {
					return item.filterName === filterName;
				});

				return found;
			};

			/**
			 *
			 * @param filterDefParams {
			 *				filterName: ,
			 *  			accessLevel: f,
			 *				filterDef:
			 *	};
			 */
			function addUpdateFilterDef(filterDefParams) {
				var newFilterDefDto = new eFilterSvc.FilterDefDto(filterDefParams);

				var foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
					return item.filterName === filterDefParams.filterName;
				});

				if (foundIdx >= 0) { // found
					// if found, we have to override actual filter definition
					_.extend(service.availableFilterDefs[foundIdx], newFilterDefDto);
					//service.availableFilterDefs[foundIdx] = newFilterDefDto;
				} else {
					service.availableFilterDefs.push(newFilterDefDto);
					sortFilterDef();
				}
				return newFilterDefDto;
			}

			/**
			 * This method reads the companies assiged to the current user.
			 * @method loadAssigedCompaniesToUser
			 * @param {}   none
			 **/
			service.loadFilterMetaData = function loadFilterMetaData(/*modelId*/) {
				var params = {
					params: {
						navigationDepth: 3
					}
				};

				var metaDataPromise = $http.get(
					globals.webApiBaseUrl + 'model/main/objectfilter/getfiltermetadata',
					params
				).then(function (response) {
					if (response.data) {
						filterOperatorInfo = response.data.operatorInfo;
						filterMetaDataToPropertyMap(response.data);
					}
					return true;
				});

				return metaDataPromise;
			};

			/**
			 * This method reads the filter meta data
			 * @method loadFilterBaseData
			 * @param {}   none
			 **/
			service.loadFilterBaseData = function loadFilterBaseData(modelId) {

				if (initDone === false) {
					var metaDataPromise = service.loadFilterMetaData(modelId);
					var filterDefinitionPromise = service.loadAllFilters();

					return $q.all([metaDataPromise, filterDefinitionPromise]).then(function () {
						initDone = true;

						// now add the default item
						var newFilterDef = service.createDefaultFilterDefinition(true);
						var theFilterDefAsJSON = service.filterDefAsJSONString(newFilterDef);

						var dto = {
							filterName: newFilterDef.name,
							accessLevel: newFilterDef.accesslevel,
							filterDef: theFilterDefAsJSON
						};
						var filterDefDto = new eFilterSvc.FilterDefDto(dto);
						service.availableFilterDefs.unshift(filterDefDto);
						service.selectedFilterDefDto = filterDefDto;
					});
				} else {
					return $q.when();
				}
			};

			/**
			 * This method reads all filter definition from backend
			 * @method loadFilterDefinitions
			 * @param {}   none
			 **/
			service.loadAllFilters = function loadFilterDefinitions() {

				var params = {
					params: {}
				};
				var requestPromise = $http.get(
					globals.webApiBaseUrl + 'model/main/objectfilter/getfilterdefinitions',
					params
				).then(function (response) {
					// create array of FilterDefDto from dtos....
					var filterDefinitions = [];
					_.forEach(response.data, function (dto) {
						filterDefinitions.push(new eFilterSvc.FilterDefDto(dto));
					});
					sortFilterDef(filterDefinitions);
					return true;
				});
				return requestPromise;
			};

			/**
			 * This method deletes  ....
			 * @method deleteFilterDefinition
			 * @param filterDef {FilterDefinition}   none
			 **/
			service.deleteFilterDefinition = function deleteFilterDefinition(filterDef) {

				var params = {
					filterName: filterDef.name,
					accessLevel: filterDef.accesslevel,
					filterDef: undefined
				};
				var requestPromise = $http.post(
					globals.webApiBaseUrl + 'model/main/objectfilter/deletefilterdefinition',
					params
				).then(function (/*response*/) {
					return removeFilterDef(filterDef.name);
				});
				return requestPromise;
			};

			/**
			 * @method filterDefAsJSONString
			 * @param filterDef
			 * @returns {*}
			 */
			service.filterDefAsJSONString = function (filterDef) {
				var theFilterDef = filterDef.getAsJson();
				return JSON.stringify(theFilterDef);
			};

			/**
			 * This method saves ....
			 * @method saveFilterDefinition
			 * @param filterDef {FilterDefinition}   none
			 **/
			service.saveFilterDefinition = function saveFilterDefinition(filterDef) {

				var filterDefParams = {
					filterName: filterDef.name,
					accessLevel: filterDef.accesslevel,
					filterDef: service.filterDefAsJSONString(filterDef) // prepare stringyfied json object
				};
				var requestPromise = $http.post(
					globals.webApiBaseUrl + 'model/main/objectfilter/savefilterdefinition',
					filterDefParams
				).then(function (/*response*/) {
					// var filterDef = response.data;
					return addUpdateFilterDef(filterDefParams);
				}, function (error) {
					$log.error('saveFilterDefinition failed ', error);
				});
				return requestPromise;
			};

			service.filterObjectsEnhanced = function (filterOptions, modelId) {
				var params = {
					IsEnhancedFilter: true,
					EnhancedFilterDef: filterOptions.filterDefAsJSONString,
					furtherFilters: [{
						token: 'MDL_MODEL_ID',
						value: modelId
					}]
				};

				return $http.post(globals.webApiBaseUrl + 'model/main/objectfilter/filter', params).then(function (response) {
					if (response.data) {
						return response.data;
					} else {
						return null;
					}
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

			return service;
		}]);
})(angular);
