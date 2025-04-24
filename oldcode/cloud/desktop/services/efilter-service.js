/*
 * $Id: efilter-service.js 622621 2021-02-04 11:05:10Z kh $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopEnhancedFilterService',
		['_', '$log', '$q', '$rootScope', '$http', 'accounting', 'moment', '$translate', 'cloudDesktopSidebarService', 'platformPermissionService', 'permissions', 'platformModalService', 'platformContextService',
			function (_, $log, $q, $rootScope, $http, accounting, moment, $translate, cloudDesktopSidebarService, platformPermissionService, permissions, platformModalService, platformContextService) { // jshint ignore:line
				var service = {};

				// service properties
				service.filterPropertyList = {};
				service.filterRootPropertyList = {};
				service.availableFilterDefs = [];
				service.selectedFilterDefDto = undefined;
				service.currentFilterDefItem = undefined;
				service.rootTableId = 0;
				service.cacheReloadedOn = undefined;
				service.autoFilterDefDto = {};

				// local vars
				var filterDefDtoIdCounter = 1;
				var filterDefinitionIdCounter = 1;
				var filterPropertyMap;
				var filterOperatorInfo = {};
				var filterPropertyMapFromPathIdMap;
				var initDone = false;
				var metaDataModuleName;
				var saveSysFilterPermission = '9fdc8f6f619748bea214ebce20b819d7';
				var saveRoleFilterPermission = '77e6b79bfab44adc9d9ae30b8c494a7f';
				var saveUserFilterPermission = '253c472c903f4ffcab2ae7d401833398';

				Object.defineProperties(service, {
					'hasSysFtrWrAccess': {
						get: () => {
							return platformPermissionService.has(saveSysFilterPermission, permissions.execute);
						},
						enumerable: true
					},
					'hasRoleFtrWrAccess': {
						get: () => {
							return platformPermissionService.has(saveRoleFilterPermission, permissions.execute);
						},
						enumerable: true
					},
					'hasUserFtrWrAccess': {
						get: () => {
							return platformPermissionService.has(saveUserFilterPermission, permissions.execute);
						},
						enumerable: true
					}
				});

				// enhancedfilter  messengers
				service.onResetFilter = new Platform.Messenger();

				service.getWatchCount = function getWatchCount(option) { // jshint ignore:line
					var total = 0;
					var scopes = 0;
					var iscopes = 0;
					var ids = {};

					// AngularJS denotes new scopes in the HTML markup by appending the
					// class "ng-scope" to appropriate elements. As such, rather than
					// attempting to navigate the hierarchical Scope tree, we can simply
					// query the DOM for the individual scopes. Then, we can pluck the
					// watcher-count from each scope.
					// --
					// NOTE: Ordinarily, it would be a HUGE SIN for an AngularJS service
					// to access the DOM (Document Object Model). But, in this case,
					// we're not really building a true AngularJS service, so we can
					// break the rules a bit.

					angular.element('.ng-scope').each(
						function ngScopeIterator() {
							// Get the scope associated with this element node.
							var scope = $(this).scope();

							if (!ids[scope.$id]) {
								ids[scope.$id] = 1;
								scopes++;
								// The $$watchers value starts out as NULL.
								var scopeWatchers = scope.$$watchers ? scope.$$watchers.length : 0;
								total += scopeWatchers;
							}
						}
					);

					angular.element('.ng-isolate-scope').each(
						function ngScopeIterator() {
							// Get the scope associated with this element node.
							var scope = $(this).isolateScope();
							if (scope && scope.$id) {
								if (!ids[scope.$id]) {
									ids[scope.$id] = 1;
									iscopes++;
									// The $$watchers value starts out as NULL.
									var scopeWatchers = scope.$$watchers ? scope.$$watchers.length : 0;
									total += scopeWatchers;
								}
							}
						}
					);

					return {watchers: total, scopes: scopes, iscopes: iscopes};
				};

				/**
				 * ListMap class,
				 * helper class holding a map to the list supplied by the constructor, key is the pkey supplied by constrcutor
				 * function
				 * @param list
				 * @param pkey
				 * @constructor
				 */
				var ListMap = function ListMap(list, pkey) { // jshint ignore:line
					var self = this;

					self.list = list; // the origin list most as array, sorting remain unchanged
					self.pkey = pkey; // for later usage
					self.map = new Map();

					// all list items in map
					_.forEach(list, function (item) {
						self.map.set(item[pkey], item);
					});
				};

				/**
				 * return itemby key from internal map
				 * @param key
				 * @returns {*}
				 */
				ListMap.prototype.getByKey = function (key) {
					return this.map.get(key);
				};

				ListMap.prototype.getList = function () {
					return this.list;
				};

				/*
				 build a list for the multi selection input control
				 */
				ListMap.prototype.getMultiSelectItemList = function (selectedItems) { // jshint ignore:line
					return null; // not implemented yet
				};

				/**
				 *
				 */
				function resetServiceCachedData() {
					service.filterPropertyList = {};
					service.filterRootPropertyList = {};
					service.availableFilterDefs = [];
					service.rootTableId = 0;
					filterPropertyMap = undefined;
					filterOperatorInfo = {};
					filterPropertyMapFromPathIdMap = undefined;
					initDone = false;
					service.autoFilterDefDto = {};
					service.onResetFilter.fire();
				}

				/**
				 * @function accessLevelAreaItems
				 *
				 * @returns {{id: string, description: *}[]}
				 */
				service.accessLevelAreaItems = function () {
					var areaItemList = [];
					if (service.hasUserFtrWrAccess) {
						areaItemList.push({id: 'User', description: $translate.instant('cloud.desktop.filterdefSaveAreaUser')});
					}
					if (service.hasRoleFtrWrAccess) {
						areaItemList.push({id: 'Role', description: $translate.instant('cloud.desktop.filterdefSaveAreaRole')});
					}
					if (service.hasSysFtrWrAccess) {
						areaItemList.push({id: 'System', description: $translate.instant('cloud.desktop.filterdefSaveAreaSystem')});
					}
					return areaItemList;
				};

				/**
				 * @function loadAutoFilter
				 *
				 * @param autoFilterDefinition
				 *
				 * @returns process filter definition
				 */
				service.loadAutoFilter = function (autoFilterDefinition) {
					var matchingFilter = _.find(service.availableFilterDefs, {accessLevel: autoFilterDefinition.accessLevel, filterName: autoFilterDefinition.filterName});
					if (matchingFilter) {
						service.selectedFilterDefDto = matchingFilter;
						matchingFilter.setModified(!_.isEqual(matchingFilter.filterDef, autoFilterDefinition.filterDef));
						service.autoFilterDefDto = {};
						var parsedFilterDef = JSON.parse(autoFilterDefinition.filterDef);

						service.currentFilterDefItem = service.processFilterDefinition(parsedFilterDef);
						return service.currentFilterDefItem;
					} else {
						service.autoFilterDefDto = autoFilterDefinition;
					}
				};

				/**
				 *
				 * @param path
				 * @param id
				 * @param isCharacteristic
				 */
				function createMapKeyFromPathId(path, id, isCharacteristic) {
					if (isCharacteristic) {
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
				function getFilterPropertyFromPathIdMap(path, id, isCharacteristic) {
					var key = createMapKeyFromPathId(path, id, isCharacteristic);
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

				// /////////////////////////////////////////////////////////////////
				// F i l t e r  D e f i n i t i o n   D t o
				// /////////////////////////////////////////////////////////////////

				/**
				 * @param dto
				 * @constructor
				 */
				service.FilterDefDto = function FilterDefDto(dto) {
					/* @type {string} 'New', 'System', 'User' */
					this.accessLevel = dto.accessLevel;
					this.filterDef = dto.filterDef;
					/* @type {string} 'New', 'System', 'User' */
					this.filterName = dto.filterName;
					this.id = filterDefDtoIdCounter++;
					this.moduleName = dto.moduleName;
					this.displayName = this.filterName;
					this.setModified = function (val) {
						this.modified = val;
						this.displayName = this.filterName + (this.modified ? ' (*)' : '');
					};
				};

				// /////////////////////////////////////////////////////////////////
				// F i l t e r  D e f i n i t i o n
				// /////////////////////////////////////////////////////////////////
				var filterDefinitionDefault = {
					id: undefined,
					name: undefined,
					roottableid: undefined,
					information: 'default Filter',
					filterversion: '1',
					filtertype: '2',
					accesslevel: 'New',
					criteria: {}
				};

				var updateMethods = {
					onFilterOperatorChanged: onFilterOperatorChanged,
					onFilterPropertyChanged: onFilterPropertyChanged
				};

				/**
				 *
				 * @returns {service.FilterDefinition}
				 */
				service.createDefaultFilterDefinition = function createDefaultFilterDefinition(includeCrio) {
					var newFilter = new service.FilterDefinition();
					// newFilter.roottableid = service.rootTableId;

					newFilter.criteria = new service.Criteria(service, updateMethods, undefined, null, newFilter);
					if (includeCrio) {
						newFilter.criteria.createNewCriterion();
					}
					return newFilter;
				};

				/**
				 * @param dto
				 * @constructor
				 */
				service.FilterDefinition = function FilterDefinition(options) {
					this._modified = false;
					this.id = filterDefinitionIdCounter++;

					// this.protected = false;

					if (options) {
						this.dto = _.cloneDeep(options.dto);
						this.dto.criteria = {};
					}
					if (this.dto === undefined) {
						this.dto = {};
						angular.extend(this.dto, filterDefinitionDefault);
						this.dto.roottableid = service.rootTableId; // use latest rootTableId
						this.dto.name = $translate.instant('cloud.desktop.filterdefDefaultFilterName');
					}
				};
				Object.defineProperties(service.FilterDefinition.prototype, {
					'modified': {
						get: function () {
							return this._modified;
						},
						set: function (p) {
							this._modified = p;
							if (service.selectedFilterDefDto) {
								service.selectedFilterDefDto.setModified(p);
							}
						},
						enumerable: true
					}
				});

				/**
				 * @param checkModified
				 * @returns {boolean}
				 */
				service.FilterDefinition.prototype.canSaveDeleteModified = function (checkModified) {
					if (this.accesslevel === 'New') { // default should not be save/delete...
						return false;
					}
					if (this.accesslevel === 'System' && service.hasSysFtrWrAccess) {
						return checkModified ? this.modified : true;
					}
					if (this.accesslevel === 'Role' && service.hasRoleFtrWrAccess) {
						return checkModified ? this.modified : true;
					}
					if (this.accesslevel === 'User' && service.hasUserFtrWrAccess) {
						return checkModified ? this.modified : true;
					}
					return false;
				};

				/* define further properties */
				Object.defineProperties(service.FilterDefinition.prototype, {
					'hasSysFtrWrAccess': {
						get: function () {
							return service.hasSysFtrWrAccess;
						}, enumerable: true
					},
					'hasRoleFtrWrAccess': {
						get: function () {
							return service.hasRoleFtrWrAccess;
						}, enumerable: true
					},
					'hasUserFtrWrAccess': {
						get: function () {
							return service.hasUserFtrWrAccess;
						}, enumerable: true
					},
					'name': {
						get: function () {
							return this.dto.name;
						}, enumerable: true,
						set: function (p) {
							this.dto.name = p;
						}
					},
					'roottableid': {
						get: function () {
							return this.dto.roottableid;
						}, enumerable: true,
						set: function (p) {
							this.dto.roottableid = p;
						}
					},
					'accesslevel': {
						get: function () {
							return this.dto.accesslevel;
						}, enumerable: true,
						set: function (p) {
							this.dto.accesslevel = p;
						}
					},
					'criteria': {
						get: function () {
							return this.dto.criteria;
						}, enumerable: true,
						set: function (p) {
							this.dto.criteria = p;
						}
					},
					'getInfo': {
						get: function () {
							return '>Name: ' + this.name + '(' + this.id + ')/' + this.roottableid + '<';
						},
						enumerable: true
					}
				});

				/**
				 * @param fd
				 * @returns {boolean}
				 */
				service.FilterDefinition.prototype.isEqual = function (fd) {
					if (!fd) {
						return false;
					}
					if (this.id === fd.id && this.name === fd.name) {
						return true;
					}
					return false;
				};

				/*
				 */
				service.FilterDefinition.prototype.getAsJson = function getAsJson() {
					var myFilterDef = {
						id: this.id,
						name: this.name,
						roottableid: this.roottableid,
						information: this.information,
						filterversion: this.filterversion,
						filtertype: this.filtertype,
						accesslevel: this.accesslevel,
						criteria: {}
					};
					myFilterDef.criteria = this.criteria.getAllSerializables();
					return myFilterDef;
				};

				/**
				 * @description checks the filter definition for valid value(s).....
				 * @param filterDefinition
				 * @returns {boolean}
				 */
				service.FilterDefinition.prototype.isValidFilterDefinition = function (showError) {
					var valid = !this.criteria ? false : true;
					if (valid) {
						valid = this.criteria.isCriteriaValid();
					}
					/*
						is criteria and criterion from the beginning empty, then set valid to true.
						for example you delete criteria filter -> if you click search -> error message
						--> solution for this case: search like google-search
					 */
					if (isSearchFieldsEmpty(this.criteria)) {
						valid = true;
					}
					if (showError === true && !valid) {
						platformModalService.showErrorBox('cloud.desktop.filterdefInvalidFilterMsg', 'cloud.desktop.filterdefInvalidFilter');
					}
					return valid;
				};

				// /////////////////////////////////////////////////////////////////
				// E N D    FilterDefinition
				// /////////////////////////////////////////////////////////////////

				// /////////////////////////////////////////////////////////////////
				// C r i t e r i a    C r i t e r i a    C r i t e r i a
				// /////////////////////////////////////////////////////////////////

				/**
				 *
				 * @param options
				 * @constructor
				 */
				service.Criteria = function Criteria(ownerSvc, updateMethods, options, parent, filterdefinition) {
					this.ownerSvc = ownerSvc;
					this.updateMethods = updateMethods;
					this.selectedOperator = {};
					this.parent = parent;
					this.filterDef = filterdefinition ? filterdefinition : parent.filterDef;

					if (options) {
						this.information = options.dto.information;
						this.selectedOperator = ownerSvc.getCriteriaOperator(options.dto.operator);
						this.criteria = [];
						this.criterion = [];
					} else { // init with default
						this.information = 'new';
						this.selectedOperator = ownerSvc.getCriteriaOperators()[0];
						this.criteria = [];
						this.criterion = [];
					}
					service.Criteria.prototype.operatorsListSimple = ownerSvc.getCriteriaOperators();
				};

				/**         *
				 * @returns {service.Criteria}
				 */
				service.Criteria.prototype.createNewCriteria = function () {
					var newC = new service.Criteria(this.ownerSvc, this.updateMethods, undefined, this);
					newC.selectedOperator = this.ownerSvc.getCriteriaOperators()[0];
					this.criteria.push(newC);

					var newCrio = newC.createNewCriterion(); // jshint ignore:line
					// console.table(this.criteria.criteria);
					// console.table(this.criteria.criterion);
					return newC;
				};

				/**         *
				 * @returns {service.Criteria}
				 */
				service.Criteria.prototype.createNewCriterion = function () {
					var newC = new service.Criterion(this.ownerSvc, this.updateMethods, undefined, this);
					var fp = this.ownerSvc.filterRootPropertyList;
					newC.selectedProperty = fp[0];
					this.criterion.push(newC);
					return newC;
				};

				service.Criteria.prototype.deleteAllSubCriteriaCriterion = function () {
					var parentCriteria = this;
					// walk thru array in reverse order, because actual itermator might be deleted
					_.forEachRight(parentCriteria.criteria, function (cria) {
						parentCriteria.deleteCriteria(cria);
					});
					// walk thru array in reverse order, because actual itermator might be deleted
					_.forEachRight(parentCriteria.criterion, function (crio) {
						parentCriteria.deleteCriterion(crio);
					});
					// console.table(parentCriteria.criteria,parentCriteria.criterion);
				};

				/**         *
				 * @returns {service.Criteria}
				 */
				service.Criteria.prototype.deleteCriteria = function (criteria) {
					var removed = _.remove(this.criteria, function (n) {
						return n === criteria;
					});

					// clean removed criteria
					if (removed) {
						var deletedCria = removed[0];
						deletedCria.deleteAllSubCriteriaCriterion();
					}
					return removed;
				};

				/**         *
				 * @returns {service.Criteria}
				 */
				service.Criteria.prototype.deleteCriterion = function (criterion) {
					var removed = _.remove(this.criterion, function (n) {
						return n === criterion;
					});
					return removed;
				};

				/**
				 * @ngdoc function
				 * @name getAllSerializables
				 * @function
				 * @methodOf efilterService
				 * @description
				 * @returns {}
				 */
				service.Criteria.prototype.getAllSerializables = function () {
					var myCria = {
						information: this.information,
						operator: this.selectedOperatorId,
						criteria: [],
						criterion: []
					};

					_.forEach(this.criteria, function (cria) {
						var theCria = cria.getAllSerializables();
						if (theCria) {
							myCria.criteria.push(theCria);
						}
					});

					_.forEach(this.criterion, function (crio) {
						var theCrio = crio.getAllSerializables();
						if (theCrio) {
							myCria.criterion.push(theCrio);
						}
					});

					return myCria;
				};

				/**
				 *
				 * @param cria
				 */
				service.Criteria.prototype.isCriteriaValid = function () { // jshint ignore:line

					if (isSearchFieldsEmpty(this)) {
						return false;
					}

					var i;
					for (i = 0; i < (this.criterion || {}).length; i++) {
						if (!this.criterion[i].isCriterionValid()) {
							return false; // break;
						}
					}

					for (i = 0; i < (this.criteria || {}).length; i++) {
						if (!this.criteria[i].isCriteriaValid()) {
							return false; // break;
						}
					}
					//     _.forEach(this.criterion || {}, function (crio) {
					//	if (!crio.isCriterionValid()) {
					//		return false;
					//	}
					// });
					// _.forEach(this.criteria || {}, function (cria) {
					//	if (!cria.isCriteriaValid()) {
					//		return false;
					//	}
					// });
					return true;
				};

				/*
					check for empty filter content.
				 */
				function isSearchFieldsEmpty(criteriaObject) {
					return criteriaObject.criteria.length === 0 && criteriaObject.criterion.length === 0;
				}

				/* define further properties */
				Object.defineProperties(service.Criteria.prototype, {
					'selectedOperatorId': { // TODO:REI not used might be removed later
						get: function () {
							if (!this.selectedOperator) {
								return undefined;
							}
							return this.selectedOperator.id;
						},
						set: function (p) {
							this.selectedOperator = this.ownerSvc.getCriteriaOperator(p);
						}
					}
				});

				// /////////////////////////////////////////////////////////////////
				// E N D    Criteria
				// /////////////////////////////////////////////////////////////////

				// /////////////////////////////////////////////////////////////////
				// C r i t e r i o n  C r i t e r i o n
				// /////////////////////////////////////////////////////////////////

				/**
				 * @param options
				 * @param parent
				 * @constructor
				 */
				service.Criterion = function Criterion(ownerSvc, updateMethods, options, parent) {
					this.ownerSvc = ownerSvc;
					this.updateMethods = updateMethods;
					this.visible = true;  // added 21.4.15@rei , change datatype by filterproperty -i.e decription to inserted: leaves the old value visible (ng-if does not trigger)
					//                     // we trigger visible, watch in directive triggers visible which is binded via ng-if, criterion value are shortly triggered and everything is ok.
					this.parent = parent;
					this.filterDef = parent.filterDef;
					this.operatorsListSimple = undefined;
					this.operatorDisabled = true;
					this.value1Hidden = true;
					this.value2Hidden = true;
					this.valuelistHidden = true;
					this.expandedProperties = undefined;
					this.valueUiControlType = undefined;

					if (options) {
						this.operator = options.dto.operator;
						this.attribute = options.dto.attribute || 0;
						this.characteristic = options.dto.characteristic || 0;
						this.datatype = options.dto.datatype;
						this.path = options.dto.path || '';
						this.information = options.dto.information;
						this.value1 = this.convertToValue(options.dto.value1);
						this.value2 = this.convertToValue(options.dto.value2);
						this.valuelist = options.dto.valuelist;
						this.specialType = options.dto.specialType;
						this.specialFieldInfo = _.isString(options.dto.specialFieldInfo) ? JSON.parse(options.dto.specialFieldInfo) : options.dto.specialFieldInfo;
					} else { // init with default values
						this.operator = null;
						this.attribute = 0;
						this.characteristic = 0;
						this.datatype = null;
						this.path = '';
						this.information = 'new created';
						this.value1 = null;
						this.value2 = null;
						this.valuelist = null;
					}
					this._valuelist = {
						property: null, // valuelist belong to this property
						datasource: []
					};
				};

				// /////////////////////////////////////////////////////////////////
				// Helper Functions placed here

				/**
				 *
				 * @param filterproperty
				 * @returns {{}}
				 */
				service.getCriterionInfo = function getCriterionInfo(theCriterion) {
					var fp = theCriterion.selectedProperty;
					var info = '';
					if (!fp) {
						info += ' no selectedProperty';
						return info;
					}
					info += ' fp:' + fp.name + ' type:' + fp.dto.filterItem.uiType + ' column:' + fp.dto.filterItem.columnName;
					// console.log(theCriterion.information, 'Set Criterion Values Hidden', theCriterion.value1Hidden, theCriterion.value2Hidden, theCriterion.valuelistHidden);
					return info;
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
				 * @function dataType2UiControlType
				 * @param datatype
				 * @returns {*}
				 */
				service.Criterion.prototype.getValueConvertType = function getValueConvertType() {
					var fo = filterOperatorInfo;
					var convertType = -1; // -1 - not determinable, 0 - string, 1 - float, 2 - date, 3- datetime, 4- time
					switch (this.datatype) {
						case fo.criterionDataTypeString:
						case fo.criterionDataTypeRemarkString:
							convertType = 0;
							break;
						case fo.criterionDataTypeInteger:
							convertType = 5;
							break;
						case fo.criterionDataTypePercent:
						case fo.criterionDataTypeNumber:
						case fo.criterionDataTypeMoney:
						case fo.criterionDataTypeQuantity:
							convertType = 1;
							break;
						case fo.criterionDataTypeDate:
							convertType = 2;
							break;
						case fo.criterionDataTypeDateTime:
							convertType = 3;
							break;
						case fo.criterionDataTypeTime:
							convertType = 4;
							break;
					}
					return convertType;
				};

				var momentDateFormat = 'YYYY-MM-DD';
				var momentTimeFormat = 'HH:mm:ss';

				/**
				 * @function dataType2UiControlType
				 * @param datatype
				 * @returns {*}
				 */
				service.Criterion.prototype.convertFromValue = function (value) {
					var stringValue;

					if (value === null || value === undefined) {
						return undefined;
					}

					switch (this.getValueConvertType()) {
						case -1: // not determined
						case 0: // string
							stringValue = value;
							break;
						case 1: // float
							stringValue = accounting.formatNumber(value, 3, '', '.');
							break;
						case 5: // float
							stringValue = accounting.formatNumber(value, 0, '', '');
							break;
						case 2: // date
							stringValue = value.format(momentDateFormat);
							break;
						case 3: // datetime
							stringValue = value.toISOString();
							break;
						case 4: // time
							stringValue = value.format(momentTimeFormat);
							break;
					}
					return stringValue;
				};

				/**
				 * @function dataType2UiControlType
				 * @param datatype
				 * @returns {*}
				 */
				service.Criterion.prototype.convertToValue = function (valuestring) {
					var value = null;
					if (!valuestring) {
						return undefined;
					}

					switch (this.getValueConvertType()) {
						case -1: // not determined
						case 0: // string
							value = valuestring;
							break;
						case 1: // float
							value = accounting.unformat(valuestring, '.');
							break;
						case 5: // integer
							value = accounting.unformat(valuestring, '');
							break;
						case 2: // date
							value = moment(valuestring);
							break;
						case 3: // datetime
							value = moment(valuestring);
							break;
						case 4: // time
							value = moment(valuestring);
							break;
					}
					return value;
				};

				/**
				 * @function dataType2UiControlType
				 * @param datatype
				 * @returns {*}
				 */
				service.Criterion.prototype.getDefaultValue = function () {

					var value = null;
					switch (this.getValueConvertType()) {
						case -1: // not determined
						case 0: // string
							value = '';
							break;
						case 1: // float
							value = 0;
							break;
						case 2: // date
							value = moment(moment().format(momentDateFormat));
							break;
						case 3: // datetime
							value = moment();
							break;
						case 4: // time
							value = moment(moment().format(momentTimeFormat));
							break;
					}
					return value;
				};

				/**
				 * @function updateDataSource
				 * @param criterion
				 * @param newValueList
				 */
				service.updateDataSource = function updateDataSource(criterion) {

					if (criterion.selectedProperty === criterion._valuelist.property) {
						var p = $q.defer();
						p.resolve(criterion._valuelist.datasource);
						// console.log('efilterserver: lookup data updateDataSource loaded from cache');
						return p.promise; // nothing to do
					}
					criterion._valuelist.property = criterion.selectedProperty;

					var valueListBackup = _.clone(criterion.valuelist);
					// read values and add to list....
					return getValueListDataSource(criterion).then(function (datalist) {
						criterion._valuelist.datasource.length = 0;
						if (datalist) {
							_.forEach(datalist.getList(), function (i) {
								i.selected = false;
								criterion._valuelist.datasource.push(i);
							});
							// console.log('efilterserver: lookup data updateDataSource loaded');
							criterion.valuelist = valueListBackup;
						}
						return criterion._valuelist.datasource;
					});
				};

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
					var uiTypeCtrl = dataType2UiControlType(theCriterion.datatype);
					// console.log ('getUiControlTypeFromDataType: ', getCriterionInfo(this), ' datatype: ', this.datatype,' uiTypeCtrl: ', uiTypeCtrl);
					return uiTypeCtrl;
				}

				/**
				 *
				 * @param filterproperty
				 * @returns {{}}
				 */
				function onFilterPropertyChanged(theCriterion, initialize) { // jshint ignore:line
					// console.log('!!onFilterPropertyChanged started');
					if (!theCriterion.selectedProperty) {
						return;
					}
					initialize = initialize || false; // optional initialize: default is false

					// theCriterion.visible = false; // trigger refresh: see remark Criterion-visible , set temporary values invisible
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
					} else {
						theCriterion.attribute = colInfo.id;
					}
					if (colInfo.isLookup || colInfo.isLookUpForeignKey) { // in case of lookup - update lookup dataSource
						service.updateDataSource(theCriterion).then(function (/* data */) {

						});
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

				/**
				 *
				 * @returns {*}
				 */
				service.Criterion.prototype.getAllSerializables = function () { // jshint ignore:line

					var myCrio = {};

					myCrio.operator = this.operator;
					if (this.attribute !== 0) {
						myCrio.attribute = this.attribute;
					}
					if (this.characteristic !== 0) {
						myCrio.characteristic = this.characteristic;
					}
					if (this.specialType) {
						myCrio.specialType = this.specialType;
						myCrio.specialFieldInfo = JSON.stringify(this.specialFieldInfo);
					}
					myCrio.datatype = this.datatype;

					if (this.path && this.path.length > 0) {
						myCrio.path = this.path;
					}
					if (this.information && this.information.length > 0) {
						myCrio.information = this.information;
					}

					// handle value1/value2/valueList as f(operand)
					myCrio.value1 = undefined;
					myCrio.value2 = undefined;
					myCrio.valuelist = undefined;
					if (this.selectedOperator) {
						var operands = this.selectedOperator.operands;
						if (operands === 1) {
							myCrio.value1 = this.convertFromValue(this.value1);
						} else if (operands === 2) {
							myCrio.value1 = this.convertFromValue(this.value1);
							myCrio.value2 = this.convertFromValue(this.value2);
						}
						if (this.selectedOperator.isLookupOp) {
							myCrio.valuelist = this.valuelist;
						}
						if (!myCrio.datatype && (myCrio.value1 || myCrio.value2 || myCrio.valuelist)) {
							throw  new Error('datatype not defined, aborted');
						}
						if (this.search_form_items) {
							myCrio.search_form_items = this.search_form_items;
						}
					}
					return myCrio;
				};

				/**
				 *
				 * @param crio
				 * @returns {boolean}
				 */
				service.Criterion.prototype.isCriterionValid = function () { // jshint ignore:line
					if (this.operatorDisabled) {
						return false;
					}

					if (this.selectedOperator) {
						var operands = this.selectedOperator.operands;
						if (operands === 1) {
							if (this.value1 === undefined || this.value1 === null) {
								return false;
							}
						} else if (operands === 2) {
							if ((this.value1 === undefined || this.value1 === null) &&
								(this.value2 === undefined || this.value2 === null)) {
								return false;
							}
						}
						if (this.selectedOperator.isLookupOp) {
							if (!this.valuelist) {
								return false;
							}
						}
					}
					return true;
				};

				/* define further properties */
				Object.defineProperties(service.Criterion.prototype, {
					'selectedOperator': {
						get: function () {
							return this._selectedOperator;
						},
						set: function (p) {
							if (p === this._selectedOperator) {
								return;
							}
							this._selectedOperator = p;
							this.operator = p ? p.id : null;
							this.updateMethods.onFilterOperatorChanged(this);
						}
					},
					'selectedOperatorId': {
						get: function () {
							if (!this.selectedOperator) {
								return undefined;
							}
							return this.selectedOperator.id;
						},
						set: function (p) {
							if (p) {
								this.selectedOperator = this.ownerSvc.getCriterionOperator(p);

								if (this.filterDef) {
									this.filterDef.modified = true;
								}
							}
						}
					},
					'selectedProperty': {
						get: function () {
							return this._selectedProperty;
						},
						set: function (p) {
							if (p === this._selectedProperty) {
								return;
							}
							this._selectedProperty = p;
							this.updateMethods.onFilterPropertyChanged(this);
						}
					},
					'selectedPropertyId': {
						get: function () {
							if (!this.selectedProperty) {
								return undefined;
							}
							return this.selectedProperty.id;
						},
						set: function (p) {
							this.selectedProperty = this.ownerSvc.getPropertybyId(p);
							if (this.filterDef) {
								this.filterDef.modified = true;
							}
						}
					},
					'valueListDataSource': {
						get: function () {
							// make data are up-to date
							service.updateDataSource(this);
							return this._valuelist.datasource;
						}
					},
					'valueListDataSourceDeferred': {
						//	this._valuelist = {
						//	property: null, // valuelist belong to this property
						//	datasource: []
						// };
						get: function () {
							return service.updateDataSource(this); // force loading of data if required
							// return this._valuelist.datasource;
						}
					},
					'getvalueByKeyFromValueList': {
						get: function (key) {
							var found;
							if (this._valuelist && this._valuelist.datasource && key) {
								found = _.find(this._valuelist.datasource, {id: key});
								return found;
							} else {
								return found;
							}
							// return service.updateDataSource(this); // force loading of data if required
							// return this._valuelist.datasource;
						}
					}
				});

				// /////////////////////////////////////////////////////////////////
				// E N D    Criterion
				// /////////////////////////////////////////////////////////////////

				// /////////////////////////////////////////////////////////////
				// / Filter Definition Logic is here
				// /////////////////////////////////////////////////////////////

				/**
				 *
				 * @param criteria
				 */
				service.processFilterDefinition = function processFilterDefinition(currentFilterDefinition) {
					// console.log('processFilterDefinition', currentFilterDefinition);
					var theFilterDefinition = new service.FilterDefinition({dto: currentFilterDefinition});

					// var self = theFilterDefinition;
					// var theCriteria = new service.Criteria({dto: currentFilterDefinition.criteria});
					// theCriteria.selectedOperator = service.getCriteriaOperator(theCriteria.operator);
					// theFilterDefinition.criteria = theCriteria;

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
					// console.log('processCriteria', criteria);

					var theCriteria = new service.Criteria(service, updateMethods, {dto: criteriaDto}, parent, theFilterDefinition);

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

					var theCriterion = new service.Criterion(service, updateMethods, {dto: criterion}, parent);

					var id = theCriterion.attribute > 0 ? theCriterion.attribute : theCriterion.characteristic;
					theCriterion._selectedProperty = getFilterPropertyFromPathIdMap(theCriterion.path, id, theCriterion.characteristic > 0);
					theCriterion._selectedOperator = service.getCriterionOperator(theCriterion.operator);
					onFilterPropertyChanged(theCriterion, true);
					return theCriterion;
				}

				// /////////////////////////////////////////////////////////////////
				// F i l t e r  P r o p e r t y   F i l t e r  P r o p e r t y
				// /////////////////////////////////////////////////////////////////
				/**
				 * @param dto
				 * @constructor
				 */
				service.FilterProperty = function FilterProperty(ownerSvc, dto) {
					this.ownerSvc = ownerSvc;
					this.childProperties = [];
					this.dto = dto;
				};

				/**
				 * @function theImage
				 * the function return the icon class depending on the filterproperty type
				 * @param fp
				 * @returns {string}
				 */
				function theImage(fp) { // jshint ignore:line
					// Kind: 1= FilterEntity, 2= FilterColumn, 3=Characteristic
					// isCharacteristicRoot
					// isLookup
					var kind = fp.dto.filterItem.kind;
					var fi = fp.dto.filterItem;

					if (kind === 1) {
						var myCol = fi.myColumn;
						if (myCol.isForeignKey && !myCol.isLookUpForeignKey) {
							return 'ico-criterion-1n';
						}
						if (myCol.isLookUpForeignKey) {
							return 'ico-criterion-lookup';
						}
						if (myCol.isRelationSet) {
							return 'ico-criterion-n1';
						}
					} else if (kind === 2) {
						return 'ico-criterion';
					} else if (kind === 3) {
						if (fi.isCharacteristicRoot) {
							return 'ico-criterion-at-fo';
						} else {
							if (fi.isLookUpForeignKey) {
								return 'ico-criterion-at-lookup';
							} else {
								return 'ico-criterion-at';
							}
						}
					} else if (kind === 10) {
						if (fi.iconClass) {
							return fi.iconClass;
						}
					}
					return 'ico-emo-10';
				}

				/* define further properties */
				Object.defineProperties(service.FilterProperty.prototype,
					{
						'id': {
							get: function () {
								// console.log('...', service.FilterProperty.prototype.idCtr++);
								return this.dto.id;
							}, enumerable: true
						},
						'parentId': {
							get: function () {
								return this.dto.parentId;
							}, enumerable: true
						},
						'parent': {
							get: function () {
								if (this.dto.parentId) {
									return service.getPropertybyId(this.dto.parentId);
								}
								return null;
							}, enumerable: true
						},
						'name': {
							get: function () {
								return this.dto.name;
							}, enumerable: true
						},
						'nameWithPath': {
							get: function () {
								return this.dto.nameWithPath;
							}, enumerable: true
						},
						'image': {
							get: function () {
								return theImage(this);
							}, enumerable: true
						},
						'HasChildren': {
							get: function () {
								return (this.childProperties && this.childProperties.length > 0);
							}, enumerable: true
						},
						'isSelectable': {
							get: function () {
								if (this.dto.filterItem.isCharacteristicRoot) {
									return false;
								}
								if ((this.dto.filterItem.kind === 10) && _.isNil(this.dto.filterItem.fieldInfo)) {
									return false;
								}
								return true;
							}, enumerable: true
						},
						'uiSortId': {
							get: function () { // When updating these priorities, _always_ update the documentation in SpecialColumn.cs!
								var sortval = 10;
								var fi = this.dto.filterItem;
								if (fi.kind === 1) {
									fi = fi.myColumn;
								}
								if (fi.kind === 10) {
									if (fi.sortingPriority) {
										sortval = fi.sortingPriority;
									}
								} else if (fi.isCharacteristicRoot) {
									sortval = 40;
								} else if (fi.isCharacteristicItem) {
									if (!fi.isLookUpForeignKey) {
										sortval = 20;
									} else {
										sortval = 30;
									}
								} else if (fi.isLookUpForeignKey && fi.isForeignKey) {
									// sortval = 30;
									sortval = 50; // rei@7.3.17 new sorting
								} else if (fi.isForeignKey) {
									// sortval = 60;
									sortval = 50; // rei@7.3.17 new sorting
								} else if (fi.isRelationSet) {
									// sortval = 70;
									sortval = 50; // rei@7.3.17 new sorting
								}
								return sortval;
							}, enumerable: true
						}
					}
				);

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
				 * @function resolveChildProperties()
				 * resoves all children to a property and its parent with object references
				 */
				service.FilterProperty.prototype.resolveChildProperties = function () {
					this.childProperties = undefined;
					if (this.dto.childPropertyIds) {
						if (this.dto.childPropertyIds.length > 0) {
							var that = this;
							var isCharItemParentRoot = this.dto.filterItem.isCharacteristicRoot;
							var props = this.childProperties = [];
							_.forEach(this.dto.childPropertyIds, function (id) {
								var childProp = that.ownerSvc.getPropertybyId(id);
								var isCharItem = childProp.dto.filterItem.isCharacteristicItem || false;
								var isCharItemRoot = childProp.dto.filterItem.isCharacteristicRoot;
								if (childProp && (!isCharItem || (isCharItemParentRoot && isCharItem) || isCharItemRoot)) {
									props.push(childProp);
								}
							});
							props = _.sortBy(props, function (n) {
								return n.uiSortId;
							});
						}

					}
				};
				// /////////////////////////////////////////////////////////////////
				// E N D    FilterProperty
				// /////////////////////////////////////////////////////////////////

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
						var fp = new service.FilterProperty(service, filterColumn);

						// map for direct mapping of id to property
						filterPropertyMap.set(fp.id, fp);

						// build path with Id map for attributes and characteristic
						var isCharItem = fp.dto.filterItem.isCharacteristicItem || false;
						var key = createMapKeyFromPathId(fp.dto.myPath,
							isCharItem ? fp.dto.filterItem.characteristicId : fp.dto.filterItemId,
							isCharItem);
						filterPropertyMapFromPathIdMap.set(key, fp);

						service.filterPropertyList.push(fp);
						if ((fp.dto.myPath === '') && !fp.dto.filterItem.isNested) {
							// console.log('filterMetaDataToPropertyMap add Root', fp.nameWithPath);
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
						var resultOps = _.sortBy(filterOperatorInfo.criteriaOperators, 'uiDisplayName');
						return resultOps;
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
					var colInfo;
					var uiType;

					/** @function checkOperatorType
					 * @param op
					 * @returns {*}
					 */
					function checkOperatorType(op) { // jshint ignore:line
						var fo = filterOperatorInfo;

						if (op.isNullableOp && colInfo.isNullable) {
							return true;
						}

						// if (colInfo.isForeignKey) {
						//	return op.isNullableOp;
						// }

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
						// console.log('getCriterionOperators called with undefined');
						return []; // filterOperatorInfo.criterionOperators;
					}
					// console.log('getCriterionOperators for ', currentProperty.name, currentProperty.nameWithPath);

					if (filterOperatorInfo && filterOperatorInfo.criterionOperators) {
						var ops = filterOperatorInfo.criterionOperators;
						colInfo = currentProperty.dto.filterItem;
						if (colInfo.kind === 1) { // is entity
							colInfo = currentProperty.dto.filterItem.myColumn;
						}
						uiType = colInfo.uiType;

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

				// var FilterDefItem = function FilterDefItem() {
				//	this.$modified = false;
				// };
				// Object.defineProperties(FilterDefItem.prototype, {
				//	'$displayName': {
				//		get: function () {
				//			return this.filterName + '(p)';
				//		}
				//	}
				// });

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
				 * @param filterId
				 * @returns {*}
				 */
				service.getAvailableFilterDefsByID = function getAvailableFilterDefsByName(filterId) {
					var found = _.find(service.availableFilterDefs, function (item) {
						return item.id === filterId;
					});

					return found;
				};

				/**
				 *
				 * @param filterDefParams {
				 *				moduleName: ,
				 *				filterName: ,
				 *  			accessLevel: f,
				 *				filterDef:
				 *	};
				 */
				function addUpdateFilterDef(filterDefParams) {
					var newFilterDefDto = new service.FilterDefDto(filterDefParams);

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

				/**
				 * This method reads the companies assiged to the current user.
				 * @method loadAssigedCompaniesToUser
				 * @param {}   none
				 **/
				service.loadFilterMetaData = function loadFilterMetaData(moduleName) {
					var params = {
						params: {
							moduleName: moduleName,
							navigationDepth: 3
						}
					};
					metaDataModuleName = moduleName;

					return $http.get(globals.webApiBaseUrl + 'cloud/common/filter/getfiltermetadata', params)
						.then(function (response) {
							if (response.data) {
								filterOperatorInfo = response.data.operatorInfo;
								service.cacheReloadedOn = response.data.cacheReloadedOn;
								filterMetaDataToPropertyMap(response.data);
							} else {
								$log.warn('Retrieved empty filter metadata for module ' + moduleName + '!');
							}

							return true;
						})
						.catch(_.noop);
				};

				/**
				 * This method reads the filter meta data
				 * @method loadFilterBaseData
				 * @param {}   none
				 **/
				service.loadFilterBaseData = function loadFilterBaseData(moduleName) {

					if (initDone === false) {
						var metaDataPromise = service.loadFilterMetaData(moduleName);
						var filterDefinitionPromise = service.loadAllFilters(moduleName);

						return $q.all([metaDataPromise, filterDefinitionPromise])
							.then(function () {
								initDone = true;

								// now add the default item
								var newFilterDef = service.createDefaultFilterDefinition(true);
								var theFilterDefAsJSON = service.filterDefAsJSONString(newFilterDef);

								var dto = {
									moduleName: moduleName,
									filterName: newFilterDef.name,
									accessLevel: newFilterDef.accesslevel,
									filterDef: theFilterDefAsJSON
								};
								var filterDefDto = new service.FilterDefDto(dto);
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
				service.loadAllFilters = function loadFilterDefinitions(moduleName) {

					var params = {
						params: {moduleName: moduleName}
					};
					var requestPromise = $http.get(
						globals.webApiBaseUrl + 'cloud/common/filter/getfilterdefinitions',
						params
					).then(function (response) {
						// create array of FilterDefDto from dtos....
						var filterDefinitions = [];
						filterDefDtoIdCounter = 1;
						_.forEach(response.data, function (dto) {
							filterDefinitions.push(new service.FilterDefDto(dto));
						});
						sortFilterDef(filterDefinitions);
						return true;
					});
					return requestPromise;
				};

				/**
				 * This method deletes  ....
				 * @method deleteFilterDefinition
				 * @param moduleName {string}   none
				 * @param filterDef {FilterDefinition}   none
				 **/
				service.deleteFilterDefinition = function deleteFilterDefinition(moduleName, filterDef) {

					var params = {
						moduleName: moduleName,
						filterName: filterDef.name,
						accessLevel: filterDef.accesslevel,
						filterDef: undefined
					};
					var requestPromise = $http.post(
						globals.webApiBaseUrl + 'cloud/common/filter/deletefilterdefinition',
						params
					).then(function (/* response */) {
						var nextFilterDef = removeFilterDef(filterDef.name);
						return nextFilterDef;
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
					var theFilterDefAsJSON = JSON.stringify(theFilterDef);
					return theFilterDefAsJSON;
				};

				/**
				 * This method saves ....
				 * @method saveFilterDefinition
				 * @param moduleName {string}   none
				 * @param filterDef {FilterDefinition}   none
				 **/
				service.saveFilterDefinition = function saveFilterDefinition(moduleName, filterDef) {

					var filterDefParams = {
						moduleName: moduleName,
						filterName: filterDef.name,
						accessLevel: filterDef.accesslevel,
						filterDef: service.filterDefAsJSONString(filterDef) // prepare stringyfied json object
					};
					var requestPromise = $http.post(
						globals.webApiBaseUrl + 'cloud/common/filter/savefilterdefinition',
						filterDefParams
					).then(function (/* response */) {
						// var filterDef = response.data;
						var listFilterDefEntry = addUpdateFilterDef(filterDefParams);
						return listFilterDefEntry;
					}, function (error) {
						console.log('saveFilterDefinition failed ', error);
					});
					return requestPromise;
				};

				/**
				 *
				 * @param criterion
				 * @returns {*}
				 */
				function getValueListDataSource(criterion) {
					if (!criterion) {
						var p = $q.defer();
						p.resolve();
						return p.promise;
					}

					var promise;
					if (criterion.attribute !== 0) {
						var tid = criterion.selectedProperty.dto.filterItem.myColumn.referenceTableFk;
						promise = getStandardLookup(tid);
					}
					if (criterion.characteristic !== 0) {
						var cid = criterion.selectedProperty.dto.filterItem.characteristicId;
						promise = getCharacteristicsLookup(cid);
					}
					return promise;
				}

				/**
				 * @method
				 * @param
				 *
				 * @sample
				 *
				 * {  "characteristicId": 186,
				 *		  "theData": [
				 *		    { "id": 194,
				 *		      "description": "Football"
				 *		    }]
				 * }
				 **/
				service.getCharacteristicsLookup = getCharacteristicsLookup;

				function getCharacteristicsLookup(characteristicsId) {
					var params = {
						params: {characteristicId: characteristicsId}
					};
					var requestPromise = $http.get(
						globals.webApiBaseUrl + 'cloud/common/filter/getcharacteristicsvaluelist', params
					).then(function (response) {
						if (response.data && response.data.theData) {
							var lookupListMap = new ListMap(response.data.theData, 'id');
							return lookupListMap;
						}
						return null;
					});
					return requestPromise;
				}

				/**
				 * @sample
				 *
				 * {  "tablename": 'dfffds',
				 *		  "theData": [
				 *		    { "id": 194,
				 *		      "description": "Football"
				 *		    }]
				 * }
				 **/
				service.getStandardLookup = getStandardLookup;

				function getStandardLookup(lookupTableId) {
					var params = {
						params: {lookupTableId: lookupTableId}
					};
					var requestPromise = $http.get(
						globals.webApiBaseUrl + 'cloud/common/filter/getlookuptablevaluelist', params
					).then(function (response) {
						if (response.data && response.data.theData) {
							var lookupListMap = new ListMap(response.data.theData, 'id');
							return lookupListMap;
						}
						return null;
					});
					return requestPromise;
				}

				/**
				 *
				 * @param moduleName
				 */
				service.Initialize = function Initialize(options, moduleChanged) { // jshint ignore:line

					if (options && options.enhancedSearchEnabled && options.enhancedSearchVersion !== '2.0' && moduleChanged) {
						resetServiceCachedData();
					}
				};

				// rei@6.12.18 enable cleaning of DataDictionary Meta data... and force relaod
				$rootScope.$on('dd:clearReloadCache', function (event, clear) {
					if (arguments.length < 2) {
						clear = true;
					}
					if (clear) {
						resetServiceCachedData();
					}
				});

				return service;
			}
		]);
})(angular);
