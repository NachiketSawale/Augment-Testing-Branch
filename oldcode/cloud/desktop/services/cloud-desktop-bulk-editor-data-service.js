/*
 * $Id: cloud-desktop-bulk-editor-data-service.js 592373 2020-06-24 09:28:20Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var cloudDesktopModule = angular.module('cloud.desktop');

	/**
	 * @ngdoc service
	 * @name cloudDesktopBulkSearchDataService
	 * @function
	 * @requires $http, $q, _, basicsCommonRuleEditorService, basicsCommonDataDictionaryOperatorService
	 *
	 * @description
	 * Defines the enhanced bulk search editor.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	cloudDesktopModule.factory('cloudDesktopBulkSearchDataService', [
		'$http', '$q', '_', '$translate', 'moment',
		'bascisCommonBulkExpressionProfileService',
		'basicsCommonRuleEditorService',
		'basicsCommonDataDictionaryOperatorService',
		'platformPermissionService',
		'permissions',
		'platformContextService',
		function ($http, $q, _, $translate, moment,
			bascisCommonBulkExpressionProfileService,
			basicsCommonRuleEditorService,
			basicsCommonDataDictionaryOperatorService,
			platformPermissionService,
			permissions,
			platformContextService) {
			var service = {
				setCurrentFilter: setCurrentFilter,
				getCurrentFilter: getCurrentFilter,
				getFilterByID: getFilterByID,
				saveFilterDefinition: saveFilterDefinition,
				deleteFilterDefinition: deleteFilterDefinition,
				validateFilterDefinition: validateFilterDefinition,
				changeModule: changeModule,
				resetFilter: resetFilter,
				fetchFilters: fetchFilters,
				accessLevelAreaItems: accessLevelAreaItems,
				getAutoFilter: getAutoFilter,
				getProcessedFilter: getProcessedFilter,
				onFiltersChanged: new Platform.Messenger(),
				onResetFilter: new Platform.Messenger(),
				filterRequested: filterRequested,
				accessEditorSettings: accessEditorSettings
			};

			// local vars
			var bulkFilters = [];
			var currentFilter;
			var filterReq = false;

			var loadingFilters = true;
			service.currentEditor = {};

			var permissionLoading;

			service.filterPermissions = {
				hasSysFtrWrAccess: null,
				hasRoleFtrWrAccess: null,
				hasUserFtrWrAccess: null
			};

			var bulkFilterDefinitionDefault = {
				accessLevel: 'n',
				id: $translate.instant('cloud.desktop.filterdefDefaultFilterName'),
				filterDef: []
			};

			var profilePrefix = 'Filter';
			var legacyProfilePrefix = 'AutoFilter';

			var enhancedSearchProfileApplicationGuid = '63703EF25B6C43A68041283EDA7DDDAA';

			const enhancedSearchStorageKey = 'sb.EnhancedSearchEnumFilter';
			const editorSettings = {
				onlyShowActiveEntities: platformContextService.getApplicationValue(enhancedSearchStorageKey) || false
			};

			// main entity

			function BulkFilter(dto) {
				/* @type {string} 'New', 'System', 'User' */
				this.accessLevelId = dto.accessLevel || 'User';
				this.accessLevel = convertAccessLevel(this.accessLevelId);
				this.filterDef = dto.filterDef;
				this.currentDefinition = _.cloneDeep(dto.filterDef);
				/* @type {string} 'New', 'System', 'User' */
				this.id = dto.id;
				this.filterName = dto.name || dto.id;
				this.moduleName = dto.moduleName;
				this.displayName = this.filterName;
				this.setModified = function (val) {
					if (this.modified !== val) {
						this.modified = val;
						this.displayName = this.filterName + (this.modified ? ' (*)' : '');
						service.onFiltersChanged.fire(bulkFilters);
					}
				};
				this.reset = function () {
					this.currentDefinition = _.cloneDeep(this.filterDef);
					this.setModified(false);
				};
				this.updated = dto.updated;
			}

			/**
			 * @param checkModified
			 * @returns {boolean}
			 */
			BulkFilter.prototype.canSaveDeleteModified = function (checkModified) {
				if (this.accessLevel === 'New') { // default should not be save/delete...
					return false;
				}
				if (this.accessLevel === 'System' && service.filterPermissions.hasSysFtrWrAccess) {
					return checkModified ? this.modified : true;
				}
				if (this.accessLevel === 'Role' && service.filterPermissions.hasRoleFtrWrAccess) {
					return checkModified ? this.modified : true;
				}
				if (this.accessLevel === 'User' && service.filterPermissions.hasUserFtrWrAccess) {
					return checkModified ? this.modified : true;
				}
				return false;
			};

			// public routines

			/**
			 * This method sets the bulk filter with the given id as current filter.
			 * If a definition is included, the current filter will get this definition.
			 * @method setCurrentFilter
			 * @param id {string}   none
			 * @param definition {ConditionDto}   none
			 **/
			function setCurrentFilter(id, definition) {
				if (currentFilter && currentFilter.id !== id) {
					currentFilter.reset();
				}
				currentFilter = _.find(bulkFilters, function (item) {
					return item.id === id;
				});
				// if not loaded yet, set promise and try selecting it once loaded
				if (!currentFilter) {
					return false;
				} else if (definition) {
					processFilterDefinition(definition);
					currentFilter.currentDefinition = definition;
					currentFilter.setModified(true);
				}
				return true;
			}

			/**
			 * This method returns the current bulkFilter.
			 * @method getCurrentFilter
			 * @returns {BulkFilter}
			 **/
			function getCurrentFilter() {
				return currentFilter;
			}

			/**
			 * This method returns the bulkFilter with the given id (filterName).
			 * @method getCurrentFilter
			 * @param moduleName {string}   none
			 * @returns {BulkFilter}
			 **/
			function getFilterByID(id) {
				return _.find(bulkFilters, function (item) {
					return item.id === id;
				});
			}

			/**
			 * This method saves a bulk filter in profiles.
			 * It then returns the id of the new filter if one was created.
			 * @method saveFilterDefinition
			 * @param moduleName {string}   none
			 * @param filter {BulkFilter}   none
			 * @returns promise -> id{string}   none
			 **/
			function saveFilterDefinition(moduleName, filter) {
				var additionalProperties = {
					name: filter ? filter.filterName : currentFilter.filterName,
					updated: moment().format()
				};

				return bascisCommonBulkExpressionProfileService.saveBulkExpressionProfile(
					moduleName || currentFilter.module,
					filter ? filter.accessLevelId : currentFilter.accessLevelId,
					currentFilter.currentDefinition,
					additionalProperties,
					profilePrefix,
					enhancedSearchProfileApplicationGuid,
					filter ? null : currentFilter.id
				).then(function (savedProfile) {
					if (filter) {
						addFilterFromProfile(savedProfile);
						service.onFiltersChanged.fire(bulkFilters);
						return savedProfile.id;
					} else {
						currentFilter.filterDef = _.cloneDeep(currentFilter.currentDefinition);
						currentFilter.setModified(false);
					}
				}, function (error) {
					console.log('saveFilterDefinition failed ', error);
				});
			}

			/**
			 * This method deletes a bulk filter in profiles.
			 * It then returns the id of the new set filter (the one before that).
			 * @method deleteFilterDefinition
			 * @param moduleName {string}   none
			 * @param filter {BulkFilter}   none
			 * @returns promise -> id{string}   none
			 **/
			function deleteFilterDefinition(moduleName, filter) {
				return bascisCommonBulkExpressionProfileService.deleteBulkExpressionProfile(
					moduleName,
					filter ? filter.accessLevelId : currentFilter.accessLevelId,
					profilePrefix,
					enhancedSearchProfileApplicationGuid,
					filter ? filter.id : currentFilter.id
				).then(function () {
					var newFilterId = removeFilter(filter.id);
					service.onFiltersChanged.fire(bulkFilters);
					return newFilterId;
				});
			}

			/**
			 * This method validate a bulk filter.
			 * It then returns the id of the new set filter (the one before that).
			 * @method deleteFilterDefinition
			 * @param filter {ConditionDto}   none
			 * @returns {bool}   none
			 **/
			function validateFilterDefinition(definition, validationReport) {
				// set validationReport, if none is set
				if (!validationReport) {
					validationReport = {
						errors: [],
						isValid: true
					};
				}
				// iterate if definition is array
				if (_.isArray(definition)) {
					_.forEach(definition, function (condition) {
						validateFilterDefinition(condition, validationReport);
					});
				}
				// if condition is group
				else if (definition.ConditiontypeFk === 1) {
					if (_.isEmpty(definition.Children)) {
						// if a group has no conditions
						addError(validationReport, 'condition', 'Not all condition groups are set!');
					} else {
						// iterate all children conditions
						_.forEach(definition.Children, function (child) {
							validateFilterDefinition(child, validationReport);
						});
					}
				}
				// if condition is field filter
				else if (definition.ConditiontypeFk === 2) {
					validationReport.isValid = true;
					if (!service.currentEditor.mgr.isFirstOperandReady(definition)) {
						// if the field is not set
						addError(validationReport, 'field', 'Not all fields are set!');
					} else {
						var operator = service.currentEditor.mgr.getOperatorItemOfCondition(definition);
						const operands = definition.Operands;
						if (!operator) {
							// if the operator is not set
							addError(validationReport, 'operator', 'Not all operators are set!');
						}else if(operands){
							// if date field having wrong data or string
							operands.map(function(operand) {
								if('Literal' in operand && 'Date' in operand.Literal && operand.Literal.Date === null) {
									addError(validationReport, 'field', 'Date format is not valid');
								}
							});
						} else {
							var notAllParametersError = {
								id: 'parameter',
								message: 'Not all parameters are set!'
							};
							if (operator.Parameters.length === definition.Operands.length) {
								_.forEach(definition.Operands, function (op) {
									if (!_.isObject(op) || _.isEmpty(op)) {
										// if the parameter is not set
										addError(validationReport, notAllParametersError.id, notAllParametersError.message);
									}
								});
							} else {
								// if the parameter is not set
								addError(validationReport, notAllParametersError.id, notAllParametersError.message);
							}
						}
					}
				}
				return validationReport;
			}

			function addError(validationReport, id, message) {
				if (!_.find(validationReport.errors, {id: id})) {
					var error = {
						id: id,
						message: message
					};
					validationReport.errors.push(error);
					validationReport.isValid = false;
				}
			}

			/**
			 * This method changes module.
			 * This includes fetching the table name for the current module,
			 * fetching the filter profiles for that module and user,
			 * and creating a new bulk editor.
			 * @method changeModule
			 * @param moduleName {string}   none
			 * @returns {bool}   none
			 **/
			function changeModule(moduleName) {
				var loadNewEditor = loadingFilters || !service.currentEditor || service.currentEditor.moduleName !== moduleName;

				if (moduleName !== service.currentEditor.moduleName) {
					bulkFilters = [];
					currentFilter = null;
					loadingFilters = true;
				}
				if (loadNewEditor && moduleName) {
					// reset filters
					bulkFilters = [];
					// reset filter requested
					filterReq = false;
					var info = {
						entityPath: 'searchOptions.selectedItem',
						moduleName: moduleName
					};
					var editorPromise = createEditor(info);
					var filterPromise = fetchFilters(moduleName);
					return $q.all([
						editorPromise,
						filterPromise
					]).then(function () {
						loadingFilters = false;
						return bulkFilters;
					});
				} else {
					return $q.when(bulkFilters);
				}
			}

			/**
			 * This method resets all filters by clearing the list of filters.
			 * It also fires the onResetFilter messenger.
			 * @method resetFilter
			 **/
			function resetFilter() {
				bulkFilters = [];
				currentFilter = null;
				loadingFilters = true;
				service.onResetFilter.fire();
			}

			/**
			 * This method deletes a bulk filter in profiles.
			 * It then returns the id of the new set filter (the one before that).
			 * @method accessLevelAreaItems
			 * @returns areaItemList[{id{string}, description{string}}]   none
			 **/
			function accessLevelAreaItems() {
				var areaItemList = [];
				if (service.filterPermissions.hasUserFtrWrAccess) {
					areaItemList.push({id: 'u', description: $translate.instant('cloud.desktop.filterdefSaveAreaUser')});
				}
				if (service.filterPermissions.hasRoleFtrWrAccess) {
					areaItemList.push({id: 'r', description: $translate.instant('cloud.desktop.filterdefSaveAreaRole')});
				}
				if (service.filterPermissions.hasSysFtrWrAccess) {
					areaItemList.push({id: 'g', description: $translate.instant('cloud.desktop.filterdefSaveAreaSystem')});
				}
				return areaItemList;
			}

			/**
			 * This method returns only the minimal required information to recover the filter.
			 * @method getAutoFilter
			 * @returns autoFilter {id{string}, currentDefinition{string}}   none
			 **/
			function getAutoFilter() {
				if (currentFilter) {
					var autoFilter = {
						id: currentFilter.id,
						currentDefinition: currentFilter.modified ? currentFilter.currentDefinition : null,
						updated: moment().format()
					};
					return autoFilter;
				} else {
					return null;
				}
			}

			function getProcessedFilter(processedFilterDefinition = null, ignoreValidation = false) {
				processedFilterDefinition = processedFilterDefinition || _.cloneDeep(currentFilter.currentDefinition);
				var validation = ignoreValidation ? {isValid: true} : validateFilterDefinition(processedFilterDefinition);
				operandProcessing(processedFilterDefinition);
				if (validation.isValid) {
					var filterDef = {
						conditions: processedFilterDefinition,
						version: 1,
						tablename: service.tableName
					};
					return JSON.stringify(filterDef);
				} else {
					return null;
				}
			}

			function filterRequested(newValue) {
				if (!_.isNil(newValue)) {
					filterReq = newValue;
				}
				return filterReq;
			}

			function operandProcessing(definition) {
				// iterate if definition is array
				if (_.isArray(definition)) {
					_.forEach(definition, function (condition) {
						operandProcessing(condition);
					});
				}
				// if condition is group
				else if (definition.ConditiontypeFk === 1) {
					if (!_.isEmpty(definition.Children)) {
						// iterate all children conditions
						_.forEach(definition.Children, function (child) {
							operandProcessing(child);
						});
					}
				}
				// if condition is field filter
				else if (definition.ConditiontypeFk === 2) {
					updateVariableRangeTransformation(definition.Operands);
					if(definition.Operands.length > 1){
						// if there were extra operands added, delete them before executing the request
						definition.Operands.splice(definition.Operands.length - definition.countOfAddedParams || 0, definition.countOfAddedParams || 0);
					}
				}
			}

			function updateVariableRangeTransformation(operands) {
				if(operands.length > 1 && operands[1].DynamicValue){
					const transformation = operands[3].DynamicValue.Transformation;
					operands.forEach((op) => {
						if(op.DynamicValue) {
							op.DynamicValue.Transformation = transformation;
						}
					});
				}
			}

			function accessEditorSettings(key, value) {
				if (!_.isNil(value)) {
					editorSettings[key] = value;
					// depending on the key, special post processing steps need to be taken
					switch (key) {
						case 'onlyShowActiveEntities':
							service.currentEditor.mgr.setShowActiveEntities(value);
							platformContextService.setApplicationValue(enhancedSearchStorageKey, value, true);
							platformContextService.saveContextToLocalStorage();
							break;
					}
				}
				return editorSettings[key];
			}

			// private routines

			function loadAllSearchFormFilter(moduleName) {
				return bascisCommonBulkExpressionProfileService
					.loadBulkExpressionProfiles(moduleName, profilePrefix, legacyProfilePrefix, enhancedSearchProfileApplicationGuid).then(function (profiles) {
						if (!_.isNil(profiles)) {
							_.forEach(profiles, function (profile) {
								addFilterFromProfile(profile);
							});
							return true;
						} else {
							return false;
						}
					});
			}

			/**
			 * @description loads all filter permission from backend and check for system/user save filter rights
			 */
			function loadFilterPermissions() {
				if (permissionLoading) {
					return;
				}
				var saveSysFilterPermission = '9fdc8f6f619748bea214ebce20b819d7';
				var saveRoleFilterPermission = '77e6b79bfab44adc9d9ae30b8c494a7f';
				var saveUserFilterPermission = '253c472c903f4ffcab2ae7d401833398';
				var filterPermissionDescriptors = [saveSysFilterPermission, saveRoleFilterPermission, saveUserFilterPermission];
				permissionLoading = true; // set loading here - to prevent double calling of loadPermission
				platformPermissionService.loadPermissions(filterPermissionDescriptors).then(function () {
					service.filterPermissions.hasSysFtrWrAccess = platformPermissionService.has(saveSysFilterPermission, permissions.execute);
					service.filterPermissions.hasRoleFtrWrAccess = platformPermissionService.has(saveRoleFilterPermission, permissions.execute);
					service.filterPermissions.hasUserFtrWrAccess = platformPermissionService.has(saveUserFilterPermission, permissions.execute);

					permissionLoading = false;
				});
			}

			// one time!
			function createRuleEditorConfig() {
				var ruleEditorConfig = {
					AvailableProperties: [],
					AvailableOperators: [],
					RuleOperatorType: 2
				};

				var filterDataPromises = {//
					operatorInfos: basicsCommonDataDictionaryOperatorService.getOperators()
				};

				return $q.all(filterDataPromises).then(function (data) {
					ruleEditorConfig.AvailableOperators = data.operatorInfos;
					return ruleEditorConfig;
				});
			}

			function fetchFilters(moduleName) {
				if (_.isEmpty(bulkFilters)) {
					var promise = loadAllSearchFormFilter(moduleName).then(function (loaded) {
						if (loaded) {
							return bulkFilters;
						} else {
							return null;
						}
					});
					return promise;
				} else {
					return $q.when(bulkFilters);
				}
			}

			function addFilter(filter, first) {
				if (!filter) {
					return;
				}

				if (_.isString(filter.filterDef)) {
					filter.filterDef = JSON.parse(filter.filterDef);
				}

				processFilterDefinition(filter.filterDef);

				if (first) {
					bulkFilters.unshift(new BulkFilter(filter));
				} else {
					bulkFilters.push(new BulkFilter(filter));
				}
			}

			function addFilterFromProfile(profile) {
				if (!_.isNil(profile.profileDef) || !_.isNil(profile.legacyProfileDef)) {
					if (!bulkFilters.find(item => item.id === profile.id)) {
						var dto = {};
						// add filterDef
						dto.filterDef = !_.isNil(profile.profileDef) ? profile.profileDef : JSON.parse(profile.legacyProfileDef);
						if (_.isArray(dto.filterDef)) {
							processFilterDefinition(dto.filterDef);
							delete profile.profileDef;
							delete profile.legacyProfileDef;
							_.assign(dto, profile.additionalProperties);
							delete profile.additionalProperties;
							_.assign(dto, profile);
							profile = {};
							bulkFilters.push(new BulkFilter(dto));
						}
					}
				}
			}

			function removeFilter(id) {
				var filterIndex = _.findIndex(bulkFilters, function (item) {
					return item.id === id;
				});
				_.remove(bulkFilters, {id: id});
				var nextFilterId = bulkFilters[filterIndex - 1 > 0 ? filterIndex - 1 : 0].id;
				return nextFilterId;
			}

			function createDefaultFilter() {
				var newFilter = _.cloneDeep(bulkFilterDefinitionDefault);
				if (service.currentEditor.mgr) {
					var groupEntity = {
						Children: newFilter.filterDef,
						ConditionFktop: null,
						ConditionFk: null
					};
					return service.currentEditor.mgr.creationCondition(groupEntity, 1).then(function (groupData) {
						return service.currentEditor.mgr.creationCondition(groupData, 2).then(function () {
							addFilter(newFilter, true);
						});
					});
				}
			}

			function processFilterDefinition(definition) {
				if (_.isArray(definition)) {
					_.forEach(definition, processFilterDefinition);
				} else {
					_.forEach(definition.Operands, function (op) {
						// irrelevant for now! How to handle utc?
						if (_.has(op, 'Literal.DateTime')) {
							op.Literal.DateTime = _.isString(op.Literal.DateTime) ? moment.utc(op.Literal.DateTime) : op.Literal.DateTime;
						}
						// always parse a utc!
						if (_.has(op, 'Literal.Date')) {
							op.Literal.Date = _.isString(op.Literal.Date) ? moment.utc(op.Literal.Date) : op.Literal.Date;
						}
					});
					_.forEach(definition.Children, processFilterDefinition);
				}
			}

			function convertAccessLevel(id) {
				switch (id) {
					case 'g':
						return 'System';
					case 'r':
						return 'Role';
					case 'u':
						return 'User';
					case 'n':
						return 'New';
				}
			}

			/**
			 * This method returns creates the editor for the currently opened module.
			 * Additionally, it creates a default filter
			 * @method createEditor
			 * @returns autoFilter {id{string}, currentDefinition{string}}   none
			 **/
			function createEditor(info) {
				var editor = {};

				editor.mgr = basicsCommonRuleEditorService.createManager({
					useDataDictionary: true,
					serverSideEvaluation: true,
					moduleName: info.moduleName,
					onlyShowActiveEntities: editorSettings.onlyShowActiveEntities
				});
				editor.htmlCode = '<div data-basics-common-rule-editor data-hierarchy="true" ' +
					'data-rule-editor-manager="ruleEditorManager" ' +
					'data-rule-definition="' + info.entityPath + '.currentDefinition" ' +
					'data-editable="!isRuleEditorReadOnly"></div>';
				editor.moduleName = info.moduleName;

				return $q.all({
					ruleEditorConfig: createRuleEditorConfig(),
					managerPreparation: editor.mgr.prepare()
				}).then(function (cfg) {
					editor.mgr.setConfig(cfg.ruleEditorConfig);
					service.currentEditor = editor;
					service.tableName = info.tableName;
					return createDefaultFilter();
				});
			}

			if (_.some(service.filterPermissions, _.isNull)) {
				loadFilterPermissions();
			}

			/**
			 * as soon as we have a valid context we load the permissions
			 */
			platformContextService.contextChanged.register(function (type) {
				if (type === 'companyConfiguration') {
					loadFilterPermissions(); // load permission
				}
			});

			return service;

		}]);
})();