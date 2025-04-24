(function (angular) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopSidebarBulkSearchFormService', cloudDesktopSidebarBulkSearchFormService);

	cloudDesktopSidebarBulkSearchFormService.$inject = [
		'$http', '$q', 'moment', '_',
		'bascisCommonBulkExpressionProfileService',
		'platformWizardDialogService',
		'basicsCommonConfigLocationListService',
		'cloudDesktopEnhancedFilterService',
		'mainViewService', 'permissions',
		'platformPermissionService', '$translate',
		'platformCustomTranslateService',
		'platformTranslateService',
		'basicsCommonRuleEditorService',
		'basicsCommonDataDictionaryOperatorService',
		'cloudDesktopSidebarService'];

	function cloudDesktopSidebarBulkSearchFormService($http, $q, moment, _,
		bascisCommonBulkExpressionProfileService,
		platformWizardDialogService,
		basicsCommonConfigLocationListService,
		cloudDesktopEnhancedFilterService,
		mainViewService, permissions,
		platformPermissionService, $translate,
		customTranslateService,
		platformTranslateService,
		basicsCommonRuleEditorService,
		basicsCommonDataDictionaryOperatorService,
		cloudDesktopSidebarService) {
		var sectionName = 'searchForms'; // for the translation controller

		var service = {
			getWizardConfig: getWizardConfig,
			saveSearchFormDefinition: saveSearchFormDefinition,
			deleteSearchformItem: deleteSearchformItem,
			loadModule: loadModule,
			loadManager: loadManager,
			loadAllSearchFormFilter: loadAllSearchFormFilter,
			createItemsForSelectBox: createItemsForSelectBox,
			openSearchForm: openSearchForm,
			setSelectedItem: setSelectedItem,
			getSelectedItem: getSelectedItem,
			modifyFilter: modifyFilter,
			getProcessedFilter: getProcessedFilter,
			getSectionName: getSectionName,
			deleteTranslationById: deleteTranslationsById,
			createManagerConfig: createManagerConfig,
			onSearchFormsChanged: new Platform.Messenger(),
			filterRequested: filterRequested
		};

		function getSectionName() {
			return sectionName;
		}

		service.allSearchFormItems = [];
		var bulkManager;
		var currentModule;
		var filterReq = false;

		loadAccessRights();

		var searchFormProfileApplicationGuid = '62ABBCA4526147EA87D5E97546576D6E';
		var profilePrefix = 'SearchForm';
		var legacyProfilePrefix = 'SearchForm.bulk';

		// main entity

		function SearchForm(dto) {
			this.id = dto.id;
			this.baseId = dto.baseId;
			this.accessLevel = dto.accessLevel;
			this.name = dto.name;
			this.name$tr$ = dto.name$tr$;
			this.shortname = dto.shortname;
			this.description = dto.description;
			this.isParamSearch = dto.isParamSearch;
			this.moduleName = dto.moduleName;
			this.allSelected = dto.allSelected;

			// form specifics
			this.filterDef = {
				enhancedFilter: getFilterDefinitionObject(dto.filterDef.enhancedFilter),
				parameters: _.map(dto.filterDef.parameters, function (p) {
					return new FormParameter(p);
				})
			};
			this.defaultFilterDef = _.cloneDeep(this.filterDef);

			this.reset = function () {
				if (selectedItem) {
					this.filterDef = _.cloneDeep(this.defaultFilterDef);
				}
			};
			this.selectAll = function (setAll) {
				if (selectedItem) {
					_.forEach(this.filterDef.parameters, function (params) {
						params.active = setAll;
					});
				}
			};
			this.updated = dto.updated;
		}

		function FormParameter(param) {
			this.label = param.label;
			this.label$tr$ = param.label$tr$;
			this.showLabel = param.showLabel;
			this.valueDescription = param.valueDescription;
			this.values = getSearchFormValueObject(param.values);
			this.showSearchTerm = param.showSearchTerm;
			this.active = param.active;
			this.target = param.target || {};
			this.domain = param.domain;
			this.uiOptions = param.uiOptions;
			this.bulkPaths = param.bulkPaths;
			this.getPropertyPaths = function () {
				return _.map(this.bulkPaths, function (shortcut) {
					var propertyPath = '[0].';
					var segments = shortcut.split('.');
					// all but last is child
					_.forEach(_.initial(segments), function (seg) {
						propertyPath += 'Children[' + seg + '].';
					});
					propertyPath = propertyPath.concat('Children[' + _.last(segments) + ']');
					return propertyPath;
				});
			};
			this.mapModel = function (enhancedFilter) {
				var values = this.values;

				var invalidModel = _.some(values, function (v) {
					return !v.valid && !v.hidden;
				});
				if (invalidModel) {
					return false;
				}
				_.forEach(this.getPropertyPaths(), function (propPath) {
					_.forEach(values, function (v, i) {
						// last is Operand
						var valuePath = propPath + 'Operands[' + (i + 1) + ']';
						_.set(enhancedFilter, valuePath, v.model);
					});
				});
				return true;
			};
			this.removeModel = function (enhancedFilter) {
				_.forEach(this.getPropertyPaths(), function (propPath) {
					_.unset(enhancedFilter, propPath);
				});
			};
		}

		var selectedItem;

		function createItemsForSelectBox(resultFromHttp) {
			var items = [];

			var accessLevels = [
				{
					id: 'g',
					caption: $translate.instant('basics.common.configLocation.system'),
					cssClass: 'title control-icons ico-search-system'
				},
				{
					id: 'u',
					caption: $translate.instant('basics.common.configLocation.user'),
					cssClass: 'title control-icons ico-search-user'
				},
				{
					id: 'r',
					caption: $translate.instant('basics.common.configLocation.role'),
					cssClass: 'title control-icons ico-search-role'
				}
			];

			angular.forEach(accessLevels, function (level) {
				var itemsFromList = _.filter(resultFromHttp, {accessLevel: level.id});

				// fill header
				if (itemsFromList.length > 0) {
					items.push({
						id: level.id,
						name: level.caption, // for new select
						type: 'title',
						childId: level.id,
						cssClassButton: level.cssClass,
						disabled: true
					});

					// fill items for access level
					angular.forEach(itemsFromList, function (item) {
						items.push(item);
					});
				}
			});

			return items;
		}

		function saveSearchFormDefinition(searchFormDefinitionInfo) {
			var convertedProfile = convertFormToProfile(searchFormDefinitionInfo);
			return bascisCommonBulkExpressionProfileService.saveBulkExpressionProfile(
				convertedProfile.moduleName,
				convertedProfile.accessLevel,
				convertedProfile.conditionDto,
				convertedProfile.additionalProperties,
				profilePrefix,
				searchFormProfileApplicationGuid,
				convertedProfile.id
			);
		}

		function deleteSearchformItem(searchFormDefinitionInfo) {
			return bascisCommonBulkExpressionProfileService.deleteBulkExpressionProfile(
				searchFormDefinitionInfo.moduleName,
				searchFormDefinitionInfo.accessLevel,
				profilePrefix,
				searchFormProfileApplicationGuid,
				searchFormDefinitionInfo.id
			).then(function () {
				return loadAllSearchFormFilter(searchFormDefinitionInfo.moduleName, true).then(function (response) {
					service.allSearchFormItems = response;
					service.onSearchFormsChanged.fire();
				});
			});
		}

		function loadModule(moduleName) {
			// initialise bulkManager
			var managerPromise = bulkManager ? bulkManager.manager.prepare() : null;
			// load search forms
			var searchFormsPromise = loadAllSearchFormFilter(moduleName);
			return $q.all([managerPromise, searchFormsPromise]).then(function () {
				let searchItems = _.cloneDeep(service.allSearchFormItems);
				//get translated contents
				platformTranslateService.translateObject(searchItems, undefined, {recursive: true});

				return searchItems;
			});
		}

		// one time!
		function createManagerConfig(manager) {
			var ruleEditorConfig = {
				AvailableProperties: [],
				AvailableOperators: [],
				RuleOperatorType: 2
			};

			var filterDataPromises = {
				operatorInfos: basicsCommonDataDictionaryOperatorService.getOperators()
			};

			return $q.all(filterDataPromises).then(function (data) {
				ruleEditorConfig.AvailableOperators = data.operatorInfos;
				manager.setConfig(ruleEditorConfig);
				return manager;
			});
		}

		function loadManager(moduleName) {
			if (!bulkManager || bulkManager.moduleName !== moduleName) {
				bulkManager = {
					moduleName: moduleName,
					manager: basicsCommonRuleEditorService.createManager({
						useDataDictionary: true,
						serverSideEvaluation: true,
						moduleName: moduleName
					})
				};
			}
			return bulkManager.manager;

		}

		function loadAllSearchFormFilter(modulename, forceServerReload) {
			filterRequested(false);
			if (currentModule === modulename && service.allSearchFormItems.length > 0 && !forceServerReload) {
				return $q.when(_.cloneDeep(service.allSearchFormItems));
			}
			service.allSearchFormItems = [];
			currentModule = modulename;
			return callHTTPForAvailableItems(modulename).then(function (response) {
				_.forEach(response, addFormFromProfile);
				service.allSearchFormItems = _.sortBy(service.allSearchFormItems, function (item) {
					return item.name.toLowerCase();
				});
				return _.cloneDeep(service.allSearchFormItems);
			});
		}

		function addForm(form, first) {
			if (!form) {
				return;
			}

			if (first) {
				service.allSearchFormItems.unshift(new SearchForm(form));
			} else {
				service.allSearchFormItems.push(new SearchForm(form));
			}
		}

		function addFormFromProfile(profile) {
			if (!_.isNil(profile.profileDef)) {
				var dto = {};
				// add filterDef
				dto.filterDef = {
					enhancedFilter: profile.profileDef,
					parameters: profile.additionalProperties.parameters
				};
				dto.allSelected = true;
				delete profile.profileDef;
				_.assign(dto, profile.additionalProperties);
				delete profile.additionalProperties;
				_.assign(dto, profile);
				profile = {};
				addForm(dto);
			} else if (!_.isNil(profile.legacyProfileDef)) {
				var legacyDto = {};
				_.assign(legacyDto, JSON.parse(profile.legacyProfileDef));
				legacyDto.allSelected = true;
				if (_.isObject(legacyDto.filterDef)) {
					delete profile.legacyProfileDef;
					_.assign(legacyDto, profile);
					profile = {};
					addForm(legacyDto);
				}
			}
		}

		function convertFormToProfile(formDefintion) {
			var profileDto = {
				id: formDefintion.id,
				additionalProperties: {
					baseId: formDefintion.baseId,
					name: formDefintion.name,
					parameters: formDefintion.filterDef.parameters,
					name$tr$: formDefintion.name$tr$,
					shortname: formDefintion.shortname,
					description: formDefintion.description,
					isParamSearch: formDefintion.isParamSearch,
					updated: formDefintion.updated
				},
				conditionDto: formDefintion.filterDef.enhancedFilter,
				accessLevel: formDefintion.accessLevel,
				moduleName: formDefintion.moduleName
			};
			return profileDto;
		}

		function getFilterDefinitionObject(definition) {
			var defObject = _.isString(definition) ? JSON.parse(definition) : definition;
			if (_.isArray(defObject)) {
				_.forEach(defObject, processFilterCondition);
			} else {
				processFilterCondition(defObject);
			}
			return defObject;
		}

		function getSearchFormValueObject(definition) {
			var defObject = _.isString(definition) ? JSON.parse(definition) : definition;
			if (_.isArray(defObject)) {
				_.forEach(defObject, function (val) {
					processFilterValues(val.model);
				});
			} else {
				processFilterValues(defObject.model);
			}
			return defObject;
		}

		function processFilterCondition(condition) {
			_.forEach(condition.Operands, function (op) {
				processFilterValues(op);
			});
			_.forEach(condition.Children, processFilterCondition);
		}

		function processFilterValues(value) {
			// process the date and date time values for now...
			if (_.has(value, 'Literal.DateTime')) {
				value.Literal.DateTime = _.isString(value.Literal.DateTime) ? moment.utc(value.Literal.DateTime) : value.Literal.DateTime;
			}
			if (_.has(value, 'Literal.Date')) {
				value.Literal.Date = _.isString(value.Literal.Date) ? moment.utc(value.Literal.Date) : value.Literal.Date;
			}
		}

		function cleanConditionDto(conditionArray) {
			_.forEach(conditionArray, function (conditionDto) {
				if (conditionDto && !_.isEmpty(conditionDto.Children)) {
					cleanConditionDto(conditionDto.Children);
				}
			});
			_.remove(conditionArray, function (conditionDto) {
				return _.isEmpty(conditionDto) || (_.isEmpty(conditionDto.Children) && _.isEmpty(conditionDto.Operands));
			});
		}

		function callHTTPForAvailableItems(moduleName) {
			return bascisCommonBulkExpressionProfileService.loadBulkExpressionProfiles(
				moduleName, profilePrefix, legacyProfilePrefix, searchFormProfileApplicationGuid
			);
		}

		function getWizardConfig() {
			return {
				title$tr$: 'cloud.desktop.searchFormWizard.headerTitle',
				height: globals.isIE11 ? '500px' : 'auto',
				steps: [
					{
						id: 'selectCriterionItem',
						title$tr$: 'cloud.desktop.searchFormWizard.step1.subHeaderTitle',
						topDescription$tr$: 'cloud.desktop.searchFormWizard.step3.topDescription',
						cssClass: 'flex-in-form',
						form: {
							fid: 'selectCriterionItem',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'step1'
							}],
							rows: [{
								gid: 'step1',
								rid: 'criterions',
								type: 'directive',
								directive: 'cloud-desktop-bulk-search-form-save-information'
							}]
						},
						disallowNext: true  // show button if search name not ''
					},
					{
						id: 'selectCriterionItem',
						title$tr$: 'cloud.desktop.searchFormWizard.step2.subHeaderTitle',
						topDescription$tr$: 'cloud.desktop.searchFormWizard.step1.topDescription',
						form: {
							fid: 'showDisplayOptions',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'step2'
							}],
							rows: [{
								gid: 'step2',
								rid: 'criterions',
								type: 'directive',
								directive: 'cloud-desktop-search-form-conditions'
							}]
						}
					},
					{
						id: 'createSearchForm',
						title$tr$: 'cloud.desktop.searchFormWizard.step3.subHeaderTitle',
						topDescription$tr$: 'cloud.desktop.searchFormWizard.step2.topDescription',
						form: {
							fid: 'showInformation',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'step3'
							}],
							rows: [{
								gid: 'step3',
								rid: 'criterions',
								type: 'directive',
								directive: 'cloud-desktop-bulk-search-form-parameter-display-options'
							}]
						},
						canFinish: false
					},
					{
						id: 'paramereterSequenceSearchForm',
						title$tr$: 'cloud.desktop.searchFormWizard.step4.subHeaderTitle',
						topDescription$tr$: 'cloud.desktop.searchFormWizard.step4.topDescription',
						form: {
							fid: 'showInformation',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'step4'
							}],
							rows: [{
								gid: 'step4',
								rid: 'criterions',
								type: 'directive',
								directive: 'cloud-desktop-bulk-search-form-parameter-display-sequence-options'
							}]
						},
						canFinish: true
					}
				],
				onStepChanging: function (info) {
					if (info.model.searchFormDefinitionInfo.accessLevel !== 'u' && (info.stepIndex === 0 || info.stepIndex === 2)) {
						// var key = customTranslateService.createTranslationKey(scope.descCtrlOptions);
						customTranslateService.writeCachedData();
					}
				}
			};
		}

		function openSearchForm(currentFilterDefItem, edit, manager) {

			var wzConfig = getWizardConfig();

			platformWizardDialogService.translateWizardConfig(wzConfig);

			var wizardModel = {
				edit: edit,
				formDef: currentFilterDefItem,
				bulkManager: manager, // or bulk service?
				conditionGroups: [],
				step3: {
					locationSelectOption: {
						displayMember: 'name',
						valueMember: 'id'
					}
				}
			};

			function showDialog() {
				platformWizardDialogService.showDialog(wzConfig, wizardModel).then(function (result) {
					var defInfo = result.data.searchFormDefinitionInfo;

					if (result.success) {
						var module = result.data.searchFormDefinitionInfo.moduleName;
						customTranslateService.reloadTranslations(sectionName);
						let processedFilterDefinition = _.cloneDeep(result.data.formDef.filterDef.enhancedFilter);
						operandProcessing(processedFilterDefinition);
						defInfo.filterDef = {
							enhancedFilter: processedFilterDefinition,
							parameters: result.data.formParameters
						};
						defInfo.updated = moment().format();
						var filterInfo = new SearchForm(defInfo);

						saveSearchFormDefinition(filterInfo).then(function () {
							// after save -> exist a new item -> update service-variable
							loadAllSearchFormFilter(module, true).then(function (response) {
								service.allSearchFormItems = response;
								service.onSearchFormsChanged.fire();
							});
						});
					}
				});
			}

			var accessPromise;

			if (service.accessRights) {
				accessPromise = $q.when(service.accessRights);
			} else {
				accessPromise = loadAccessRights();
			}

			accessPromise.then(function (rights) {
				wizardModel.step3.locationSelectOption.items = rights;
				showDialog();
			});
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
				// updateVariableRangeTransformation(definition.Operands);
				if(definition.Operands.length > 1){
					// if there were extra operands added, delete them before executing the request
					definition.Operands.splice(definition.Operands.length - definition.countOfAddedParams || 0, definition.countOfAddedParams || 0);
				}
			}
		}

		function deleteTranslationsById(searchformId) {
			customTranslateService.deleteTranslationsById(sectionName, searchformId);
		}

		function setSelectedItem(newValue) {
			selectedItem = newValue;
			if (!_.isUndefined(selectedItem)) {
				cloudDesktopSidebarService.updateNavbarRefreshTooltip(selectedItem.name);
			}else{
				cloudDesktopSidebarService.updateNavbarRefreshTooltip('');
			}
		}

		function getSelectedItem() {
			return selectedItem;
		}

		function modifyFilter(id, parameters) {
			var modifiedFilter = _.find(service.allSearchFormItems, {id: id});
			if (modifiedFilter) {
				modifiedFilter.filterDef.parameters = _.map(parameters, function (p) {
					return new FormParameter(p);
				});
				return modifiedFilter;
			} else {
				return null;
			}
		}

		function getProcessedFilter() {
			if (selectedItem) {
				// clone before removing unused parameters
				var filterDef = _.cloneDeep(selectedItem.filterDef);

				_.forEach(filterDef.parameters, function (param) {
					// set modified properties
					var valid = param.active ? param.mapModel(filterDef.enhancedFilter) : false;
					if (!valid) {
						// remove children that are inactive
						param.removeModel(filterDef.enhancedFilter);
					}
				});
				cleanConditionDto(filterDef.enhancedFilter);

				var result = {
					conditions: filterDef.enhancedFilter
				};
				return JSON.stringify(result);
			}
			return null;
		}

		function loadAccessRights() {
			var rights = basicsCommonConfigLocationListService.createItems();

			return basicsCommonConfigLocationListService.checkAccessRights({
				u: 'd8fa3a03e8314952b41ab659217e6cb2',
				r: 'da63204cc70643c1bebe4c7a9bd3b272',
				g: '35866bede7d3481284fef40332c547a0',
				permission: permissions.execute
			}).then(function (result) {
				service.accessRights = _.filter(rights, function (o) {
					return result[o.id];
				});
				return service.accessRights;
			});
		}

		function filterRequested(newValue) {
			if (!_.isNil(newValue)) {
				filterReq = newValue;
			}
			return filterReq;
		}

		return service;
	}
})(angular);
