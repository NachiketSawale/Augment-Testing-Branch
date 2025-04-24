(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name changeMainMainService
	 * @function
	 *
	 * @description
	 * changeMainMainService is the data service for all change main related functionality.
	 */
	var moduleName = 'change.main';
	var changeMainModule = angular.module(moduleName);
	changeMainModule.factory('changeMainService', ['_', '$injector', '$http', '$translate', 'platformObjectHelper', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceFieldReadonlyProcessorFactory',
		'platformDataServiceActionExtension', 'platformModalFormConfigService', 'basicsLookupdataConfigGenerator',
		'cloudDesktopSidebarService', 'cloudDesktopPinningContextService', 'basicsCommonMandatoryProcessor',
		'changeMainConstantValues', 'basicsCompanyNumberGenerationInfoService','basicsLookupdataLookupFilterService','changeMainHeaderProcessorService',

		function (_, $injector, $http, $translate, platformObjectHelper, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			// eslint-disable-next-line no-mixed-spaces-and-tabs
		          platformDataServiceFieldReadonlyProcessorFactory, platformDataServiceActionExtension, platformModalFormConfigService,
			// eslint-disable-next-line no-mixed-spaces-and-tabs
		          basicsLookupdataConfigGenerator, cloudDesktopSidebarService, cloudDesktopPinningContextService,
			// eslint-disable-next-line no-mixed-spaces-and-tabs
		          basicsCommonMandatoryProcessor, changeMainConstantValues, basicsCompanyNumberGenerationInfoService,basicsLookupdataLookupFilterService, changeMainHeaderProcessorService) {


			let creationParameter = {};
			function getChangeOrderCreateFormConfig() {
				return {
					fid: 'change.main.createChangeOrder',
					version: '1.0.0',
					showGrouping: false,
					groups: [ {
						gid: 'baseGroup',
						attributes: ['projectfk']
					}],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'projectfk',
							model: 'ProjectFk',
							sortOrder: 1,
							// label$tr$: 'cloud.common.entityProjectName',
							label: $translate.instant('cloud.common.entityProjectName'),
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: false
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.changetype',
							'Description',
							{
								gid: 'baseGroup',
								rid: 'changeTypeFk',
								model: 'ChangeTypeFk',
								required: true,
								sortOrder: 2,
								// label$tr$: 'basics.customize.changetype',
								label: $translate.instant('basics.customize.changetype'),
								validator: function(entity, value) {
									var service = $injector.get('basicsLookupdataSimpleLookupService');
									let selected = service.getItemByIdSync(value, {
										lookupModuleQualifier: 'basics.customize.changetype',
										displayMember: 'Description',
										valueMember: 'Id',
										field: 'RubricCategoryFk',
										filterKey: '',
										customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
									});
									if(selected) {
										entity.RubricCategoryFk = selected.RubricCategoryFk;
									}
								}
							},
							false,
							{
								required: true,
								field: 'RubricCategoryFk',
								filterKey: '',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.rubriccategory',
							'Description',
							{
								gid: 'baseGroup',
								rid: 'rubricCategoryFk',
								model: 'RubricCategoryFk',
								required: true,
								sortOrder: 3,
								// label$tr$: 'basics.customize.rubriccategory',
								label: $translate.instant('basics.customize.rubriccategory'),
								readonly: true
							},
							true,
							{
								required: true,
								field: 'RubricFk',
								filterKey: 'change-main-rubric-category-by-rubric-and-islive-filter',
								customIntegerProperty: 'BAS_RUBRIC_FK',
							}),
					]
				};
			}

			function initCreationDataWithCreateResult(creationData) {
				creationData.PKey1 = creationParameter.ProjectFk;
				creationData.PKey2 = creationParameter.ChangeTypeFk;
				creationData.PKey3 = creationParameter.RubricCategoryFk;
				creationParameter = {};
			}

			function hasContext() {
				var context = cloudDesktopPinningContextService.getContext();
				var findPinning =_.find(context, {'token': 'project.main'});
				return (context && findPinning !== undefined && findPinning !== null);
			}

			function getProjectForChangeOrderCreation(options, initData, data) {
				var modalCreateProjectConfig = {
					title: $translate.instant('change.main.createChangeTitle'),
					resizeable: true,
					dataItem: {
						ProjectFk: null,
						RubricCategoryFk: data.resItem.Id
					},
					formConfiguration: getChangeOrderCreateFormConfig(),
					handleOK: function handleOK(result) {// result not used
						initData.ProjectFk = result.data.ProjectFk;
						initData.ChangeTypeFk = result.data.ChangeTypeFk;
						initData.RubricCategoryFk = result.data.RubricCategoryFk;

						return platformDataServiceActionExtension.createItem(options, data);
					},
					dialogOptions: {
						disableOkButton: function () {
							return !modalCreateProjectConfig.dataItem.ProjectFk;
						}
					}
				};

				return platformModalFormConfigService.showDialog(modalCreateProjectConfig);
			}


			function getContext(creationData) {
				var context = cloudDesktopPinningContextService.getContext();
				var findPinning =_.find(context, {'token': 'project.main'});
				if (context && findPinning !== undefined && findPinning !== null) {// Project Item pinning
					if(findPinning.id.Id !== undefined){
						creationData.PKey1 = findPinning.id.Id;
					}else{
						creationData.PKey1 = findPinning.id;
					}

					return true;
				}
				return false;
			}

			var factoryOptions = {
				flatRootItem: {
					module: changeMainModule,
					serviceName: 'changeMainService',
					entityNameTranslationID: 'change.main.entityChange',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'change/main/', endRead: 'filtered', endDelete: 'multidelete', usePostForRead: true
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ChangeDto',
						moduleSubModule: 'Change.Main'
					}),
					platformDataServiceFieldReadonlyProcessorFactory.createProcessor([
						{ field: 'RubricCategoryFk', evaluate: function(item) { return item.Version >= 1; }},
						{ field: 'Code', evaluate: function(item) {
							if (item.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService').hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
								item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService').provideNumberDefaultText(item.RubricCategoryFk, item.Code);
								return true;
							} else {
								return false;
							}}
						}
					]),
					changeMainHeaderProcessorService],
					actions: {
						delete: true, create: 'flat'
					},
					entitySelection: { supportsMultiSelection: true },
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								if (!getContext(creationData)) {
									initCreationDataWithCreateResult(creationData);
								}
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'Change',
							moduleName: 'cloud.desktop.moduleDescriptionChangeMain',
							mainItemName: 'Change',
							useIdentification: true,
							showProjectHeader: {
								getProject: function (entity) {
									return (entity ) ? entity.Project : null;
								}
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{
									token: 'project.main',
									show: true
								}],
								setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
							},
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			var service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'changeMainValidationService'
			}, changeMainConstantValues.schemes.change ));

			service.createItem = function createChangeOrder(creationOptions) {
				if(hasContext()) {
					return platformDataServiceActionExtension.createItem(creationOptions, serviceContainer.data);
				}
				return $http.post(globals.webApiBaseUrl + 'basics/customize/rubriccategory/list').then(function (response) {
					let res = _.find(response.data, { RubricFk: 14, IsDefault: true });
					_.assign(serviceContainer.data, {resItem: res});
					return getProjectForChangeOrderCreation(creationOptions, creationParameter, serviceContainer.data);
				});
			};

			service.createItemFromLookup = function (creationData, customOptions) {

				function addValidation(row, validationService) {
					var syncName = 'validate' + row.model;
					var asyncName = 'asyncValidate' + row.model;

					if (validationService[syncName]) {
						row.validator = validationService[syncName];
					}

					if (validationService[asyncName]) {
						row.asyncValidator = validationService[asyncName];
					}
				}

				customOptions = _.extend({
					displayFields: []
				}, customOptions);

				var $q = $injector.get('$q');
				var platformDataValidationService = $injector.get('platformDataValidationService');
				var basicsCompanyNumberGenerationInfoService = $injector.get('basicsCompanyNumberGenerationInfoService');
				var changeMainConstantValues = $injector.get('changeMainConstantValues');
				var standardService = $injector.get('changeMainConfigurationService');
				var generationService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService', changeMainConstantValues.rubricId);
				var generationList = generationService.getList();

				var defer = $q.defer();

				var loadGenerationInfo = generationList.length > 0 ? function () {
					return $q.when(generationList);
				} : function () {
					return generationService.load();
				};

				var layoutDataService = $injector.get('platformLayoutByDataService');
				var layoutService = $injector.get('changeMainConfigurationService');
				layoutDataService.registerLayout(layoutService, service);

				var validationDataService = $injector.get('platformValidationByDataService');
				var validationService = $injector.get('changeMainValidationService');
				validationDataService.registerValidationService(validationService, service);

				loadGenerationInfo().then(function () {
					return $http.post(globals.webApiBaseUrl +'basics/customize/rubriccategory/list');
				}).then(function (response) {
					window.console.log(response);
					if (response && response.data && response.data.length > 0) {
						let defaultRubricCategories = response.data.filter(function (rc) {
							// TODO:
							// Replace the constant with a variable
							return rc.IsDefault && rc.RubricFk === 14;
						});

						if (defaultRubricCategories.length > 0) {
							return defaultRubricCategories[0].Id;
						} else {
							return null;
						}
					}
				}).then(function (defaultRubricCategory) {
					var dataItem = {
						RubricCategoryFk: defaultRubricCategory
					};
					var context = cloudDesktopPinningContextService.getContext();
					var findPinning = context ? _.find(context, {'token': 'project.main'}) : null;

					dataItem.ProjectFk = findPinning ? findPinning.value : null;

					if (creationData && creationData.PKey1) {
						dataItem.ProjectFk = creationData.PKey1;
					}

					var configuration = getChangeOrderCreateFormConfig();
					if (customOptions.displayFields) {

						var detailRows = standardService.getStandardConfigForDetailView().rows;
						var sortOrder = _.last(configuration.rows).sortOrder;
						_.each(customOptions.displayFields, function (field) {
							var row = _.find(detailRows, {rid: field.name.toLowerCase()});
							if (row && !_.some(configuration.rows, {rid: field.name.toLowerCase()})) {
								var cloneRow = _.cloneDeep(row);
								cloneRow.sortOrder = ++sortOrder;
								addValidation(cloneRow, validationService);
								configuration.rows.push(cloneRow);
							}
						});
					}

					_.each(customOptions.displayFields, function (field) {
						dataItem[field.name] = field.initValue;
					});

					var rubric = _.first(generationService.getList());

					if (rubric && generationService.hasToGenerateForRubricCategory(rubric.RubricCatID)) {
						dataItem.Code = generationService.provideNumberDefaultText(rubric.RubricCatID, dataItem.Code);
						$injector.get('platformRuntimeDataService').readonly(dataItem, [{
							field: 'Code',
							readonly: true
						}]);
					}

					var modalCreateProjectConfig = {
						title: $translate.instant('change.main.createChangeTitle'),
						resizeable: true,
						dataItem: dataItem,
						formConfiguration: configuration,
						handleOK: function handleOK(result) {// result not used
							creationParameter.ProjectFk = result.data.ProjectFk;
							creationParameter.RubricCategoryFk = result.data.RubricCategoryFk;
							platformDataServiceActionExtension.createItem(creationData, serviceContainer.data).then(function () {
								var selectedItem = service.getSelected();
								platformDataValidationService.removeDeletedEntitiesFromErrorList([selectedItem], service);
								_.each(customOptions.displayFields, function (field) {
									selectedItem[field.name] = result.data[field.name];
								});
								defer.resolve({data: selectedItem, form: result.data});
							});
						},
						dialogOptions: {
							disableOkButton: function () {
								return !modalCreateProjectConfig.dataItem.ProjectFk || !modalCreateProjectConfig.dataItem.Code || platformDataValidationService.hasErrors(service);
							}
						}
					};

					return platformModalFormConfigService.showDialog(modalCreateProjectConfig);

				});

				return defer.promise;
			};


			serviceContainer.service.navigateToChange = function navigateToChange(item, triggerField) {
				if (!item || !triggerField) return;

				let changeId = platformObjectHelper.getValue(item, triggerField) || item.ChangeFk;

				if (changeId && triggerField !== 'Ids') {
					cloudDesktopSidebarService.filterSearchFromPKeys([changeId]);
				}
				else if (triggerField === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
					const ids = item.Ids.split(',').map(id => id.trim()).filter(id => id);
					if (ids.length > 0) {
						cloudDesktopSidebarService.filterSearchFromPKeys(ids);
					}
				}
			};

			return service;

		}]);
})(angular);
