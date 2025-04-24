(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('basicsWorkflowGroupSettingEfilterService',
		['_', '$http', '$translate', 'platformPermissionService', 'permissions',
			function (_, $http, $translate, platformPermissionService, permissions) { //jshint ignore:line
				var service = {};

				// acl handling here
				service.hasSysFtrWrAccess = false;
				service.hasRoleFtrWrAccess = false;
				service.hasUserFtrWrAccess = true;

				// service properties
				service.filterRootPropertyList = {};
				service.availableFilterDefs = [];
				service.selectedFilterDefDto = undefined;
				service.currentFilterDefItem = undefined;
				service.autoFilterDefDto = {};

				// local vars
				var filterDefDtoIdCounter = 1;
				var filterDefinitionIdCounter = 1;
				var filterOperatorInfo = {};
				var permissionLoaded = false;

				function loadFilterPermissions() {
					var saveSysFilterPermission = '914e34cc603d417fbe2c4c52a7a3281b';
					var saveRoleFilterPermission = 'dd8290f4f7584b89a542d605f99d89ef';
					var saveUserFilterPermission = '57921aa3677c4cd3aa23871993356311';

					var filterPermissions = [saveSysFilterPermission, saveRoleFilterPermission, saveUserFilterPermission];
					permissionLoaded = true;
					platformPermissionService.loadPermissions(filterPermissions).then(function () {
						service.hasSysFtrWrAccess = platformPermissionService.has(saveSysFilterPermission, permissions.execute);
						service.hasRoleFtrWrAccess = platformPermissionService.has(saveRoleFilterPermission, permissions.execute);
						service.hasUserFtrWrAccess = platformPermissionService.has(saveUserFilterPermission, permissions.execute);
					});
				}

				service.onTodoSettingsChange = new Platform.Messenger();

				service.registerTodoSettingsChange = function (fn) {
					return service.onTodoSettingsChange.register(fn);
				};

				service.unRegisterTodoSettingsChange = function (fn) {
					return service.onTodoSettingsChange.unregister(fn);
				};

				service.loadAutoFilter = function (autoFilterDefinition) {
					var matchingFilter = _.find(service.availableFilterDefs, {
						accessLevel: autoFilterDefinition.accessLevel,
						filterName: autoFilterDefinition.filterName
					});
					if (matchingFilter) {
						service.selectedFilterDefDto = matchingFilter;
						matchingFilter.setModified(!_.isEqual(matchingFilter.filterDef, autoFilterDefinition.filterDef));
						service.autoFilterDefDto = {};
						var parsedFilterDef = JSON.parse(autoFilterDefinition.filterDef);
						return service.processFilterDefinition(parsedFilterDef);
					} else {
						service.autoFilterDefDto = autoFilterDefinition;
					}
				};

				service.FilterDefDto = function FilterDefDto(dto) {
					this.accessLevel = dto.accessLevel;
					this.filterDef = dto.filterDef;
					this.filterName = dto.filterName;
					this.id = filterDefDtoIdCounter++;
					this.moduleName = dto.moduleName;
					this.displayName = this.filterName;
					this.setModified = function (val) {
						this.modified = val;
						this.displayName = this.filterName + (this.modified ? ' (*)' : '');
					};
				};

				var filterDefinitionDefault = {
					id: undefined,
					name: undefined,
					information: 'default Filter',
					filterversion: '1',
					filtertype: '2',
					accesslevel: 'New',
					criteria: {}
				};

				service.createDefaultFilterDefinition = function createDefaultFilterDefinition(includeCrio) {
					var newFilter = new service.FilterDefinition();

					newFilter.criteria = new service.Criteria(service, undefined, null, newFilter);
					if (includeCrio) {
						newFilter.criteria.createNewCriterion();
					}
					return newFilter;
				};

				service.FilterDefinition = function FilterDefinition(options) {
					this.id = filterDefinitionIdCounter++;

					if (options) {
						this.dto = _.cloneDeep(options.dto);
						this.dto.criteria = {};
					}
					if (this.dto === undefined) {
						this.dto = {};
						angular.extend(this.dto, filterDefinitionDefault);
						this.dto.name = $translate.instant('basics.workflow.task.list.newSetting');
					}
				};

				service.FilterDefinition.prototype.canSaveDeleteModified = function (checkModified) {
					if (this.accesslevel === 'New') {
						return false;
					}
					var modified = false;
					if (!!service.selectedFilterDefDto && !!service.selectedFilterDefDto.modified) {
						modified = service.selectedFilterDefDto.modified;
					}

					if (this.accesslevel === 'System' && service.hasSysFtrWrAccess) {
						return checkModified ? modified : true;
					}
					if (this.accesslevel === 'Role' && service.hasRoleFtrWrAccess) {
						return checkModified ? modified : true;
					}
					if (this.accesslevel === 'User' && service.hasUserFtrWrAccess) {
						return checkModified ? modified : true;
					}
					return false;
				};

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
					}
				});

				service.FilterDefinition.prototype.isEqual = function (fd) {
					if (!fd) {
						return false;
					}
					if (this.id === fd.id && this.name === fd.name) {
						return true;
					}
					return false;
				};

				service.FilterDefinition.prototype.getAsJson = function getAsJson() {
					var myFilterDef = {
						id: this.id,
						name: this.name,
						information: this.information,
						filterversion: this.filterversion,
						filtertype: this.filtertype,
						accesslevel: this.accesslevel,
						criteria: {},
						todoSettings: this.todoSettings
					};
					return myFilterDef;
				};

				service.Criteria = function Criteria(ownerSvc, options, parent, filterdefinition) {
					this.ownerSvc = ownerSvc;
					this.parent = parent;
					this.filterDef = filterdefinition ? filterdefinition : parent.filterDef;

					if (options) {
						this.information = options.dto.information;
						this.criteria = [];
						this.criterion = [];
					} else { // init with default
						this.information = 'new';
						this.criteria = [];
						this.criterion = [];
					}
				};

				service.Criteria.prototype.createNewCriterion = function () {
					var newC = new service.Criterion(this.ownerSvc, undefined, this);
					var fp = this.ownerSvc.filterRootPropertyList;
					newC.selectedProperty = fp[0];
					this.criterion.push(newC);
					return newC;
				};

				service.processFilterDefinition = function processFilterDefinition(currentFilterDefinition) {
					var theFilterDefinition = new service.FilterDefinition({dto: currentFilterDefinition});

					theFilterDefinition.criteria = new service.Criteria(service, {dto: currentFilterDefinition.criteria}, null, theFilterDefinition);
					return theFilterDefinition;
				};

				service.FilterProperty = function FilterProperty(ownerSvc, dto) {
					this.ownerSvc = ownerSvc;
					this.childProperties = [];
					this.dto = dto;
				};

				service.Criterion = function Criterion(ownerSvc, options, parent) {
					this.ownerSvc = ownerSvc;
					this.visible = true;
					this.parent = parent;
					this.filterDef = parent.filterDef;

					if (options) {
						this.operator = options.dto.operator;
						this.datatype = options.dto.datatype;
						this.path = options.dto.path || '';
						this.information = options.dto.information;
						this.specialType = options.dto.specialType;
						this.specialFieldInfo = _.isString(options.dto.specialFieldInfo) ? JSON.parse(options.dto.specialFieldInfo) : options.dto.specialFieldInfo;
					} else {
						this.operator = null;
						this.datatype = null;
						this.path = '';
						this.information = 'new created';
					}
				};

				service.getCriteriaOperator = function getCriteriaOperator(id) {
					if (id && filterOperatorInfo && filterOperatorInfo.criteriaOperators) {
						var op = _.find(filterOperatorInfo.criteriaOperators, function (item) {
							return item.id === id;
						});
						return op;
					}
					return undefined;
				};

				function removeFilterDef(filterName) {
					var foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
						return item.filterName === filterName;
					});
					var next;
					if (foundIdx >= 0) {
						service.availableFilterDefs.splice(foundIdx, 1);
						// no select the new one
						if (service.availableFilterDefs.length > 0) {
							if (foundIdx === 0) {
								next = service.availableFilterDefs[0];
							} else {
								next = service.availableFilterDefs[foundIdx - 1];
							}
						}
					}
					return next;
				}

				function sortFilterDef(filterDef) {
					var sortedFilterDef = _.sortBy(filterDef || service.availableFilterDefs, function (a) {
						return [a.accessLevel, a.filterName];
					});

					service.availableFilterDefs.length = 0;
					_.forEach(sortedFilterDef, function (item) {
						service.availableFilterDefs.push(item);
					});
				}

				service.getAvailableFilterDefsByID = function getAvailableFilterDefsByName(filterId) {
					var found = _.find(service.availableFilterDefs, function (item) {
						return item.id === filterId;
					});

					return found;
				};

				function addUpdateFilterDef(filterDefParams) {
					var newFilterDefDto = new service.FilterDefDto(filterDefParams);

					var foundIdx = _.findIndex(service.availableFilterDefs, function (item) {
						return item.filterName === filterDefParams.filterName;
					});

					if (foundIdx >= 0) {
						_.extend(service.availableFilterDefs[foundIdx], newFilterDefDto);
					} else {
						service.availableFilterDefs.push(newFilterDefDto);
						sortFilterDef();
					}
					return newFilterDefDto;
				}

				service.getCurrentFilterDef = function (filterDefDto) {
					service.selectedFilterDefDto = filterDefDto;
					var filterDefinition = JSON.parse(filterDefDto.filterDef);
					service.currentFilterDefItem = service.processFilterDefinition(filterDefinition);
					return service.currentFilterDefItem;
				};

				service.loadFilterBaseData = function loadFilterBaseData(moduleName) {
					var filterDefinitionPromise = service.loadAllFilters(moduleName);

					return filterDefinitionPromise.then(function () {
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
				};

				service.loadAllFilters = function loadFilterDefinitions(moduleName) {
					var params = {
						params: {moduleName: moduleName}
					};
					var requestPromise = $http.get(
						globals.webApiBaseUrl + 'basics/workflow/filter/getfilterdefinitions',
						params
					).then(function (response) {
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

				service.deleteFilterDefinition = function deleteFilterDefinition(moduleName, filterDef) {
					var params = {
						moduleName: moduleName,
						filterName: filterDef.name,
						accessLevel: filterDef.accesslevel,
						filterDef: undefined
					};
					var requestPromise = $http.post(
						globals.webApiBaseUrl + 'basics/workflow/filter/deletefilterdefinition',
						params
					).then(function (/*response*/) {
						var nextFilterDef = removeFilterDef(filterDef.name);
						return nextFilterDef;
					});
					return requestPromise;
				};

				service.filterDefAsJSONString = function (filterDef) {
					var theFilterDef = filterDef.getAsJson();
					var theFilterDefAsJSON = JSON.stringify(theFilterDef);
					return theFilterDefAsJSON;
				};

				service.saveFilterDefinition = function saveFilterDefinition(moduleName, filterDef) {
					var filterDefParams = {
						moduleName: moduleName,
						filterName: filterDef.name,
						accessLevel: filterDef.accesslevel,
						filterDef: service.filterDefAsJSONString(filterDef)
					};
					var requestPromise = $http.post(
						globals.webApiBaseUrl + 'basics/workflow/filter/savefilterdefinition',
						filterDefParams
					).then(function () {
						var listFilterDefEntry = addUpdateFilterDef(filterDefParams);
						return listFilterDefEntry;
					}, function (error) {
						console.log('saveFilterDefinition failed ', error);
					});
					return requestPromise;
				};

				loadFilterPermissions();

				return service;
			}
		]);
})(angular);
