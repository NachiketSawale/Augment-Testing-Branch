/**
 * Created by pel on 9/6/2019.
 */

(function (angular) {
	/* global globals _ */
	'use strict';

	function getBoolAsString(val) {
		if(val === null || val === undefined || val === 0) {
			return '';
		}

		return val ? 'true' : 'false';
	}

	function isNilOrZeroOrFalse(_, val) {
		return _.isNil(val) || val === 0 || val === false;
	}

	globals.lookups.ProjectChange = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'ProjectChange',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '0e595980078340cabf462b7ae6b002f3',
				pageOptions: {
					enabled: true,
					size: 100
				},
				columns: [
					{
						id: 'ProjectFk',
						field: 'ProjectFk',
						name: 'ProjectFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						},
						name$tr$: 'cloud.common.entityProjectName',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								initValueField: 'ProjectNo',
								showClearButton: false
							}
						}
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'changeStatusIcon',
						field: 'ChangeStatusFk',
						name: 'Change Status',
						name$tr$: 'cloud.common.entityStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'project.main.changestatus',
							displayMember: 'Description',
							valueMember: 'Id',
							imageSelector: 'platformStatusIconService'
						},
						width: 150
					},
					{
						id: 'ChangeTypeFk',
						field: 'ChangeTypeFk',
						name: 'Change Type',
						formatter: 'lookup',
						name$tr$: 'project.main.entityChangeType',
						formatterOptions: {
							lookupModuleQualifier: 'basics.customize.changetype',
							lookupSimpleLookup: true,
							valueMember: 'Id',
							displayMember: 'Description',
							filterKey: 'change-main-by-rubric-category-filter'
						}
					},
					{
						id: 'ChangeReasonFk',
						field: 'ChangeReasonFk',
						name: 'Change Reason',
						formatter: 'lookup',
						name$tr$: 'change.main.changeReason',
						formatterOptions: {
							lookupModuleQualifier: 'basics.customize.changereason',
							lookupSimpleLookup: true,
							valueMember: 'Id',
							displayMember: 'Description',
							filterKey: 'change-main-by-rubric-category-filter'
						}
					}
				],
				title: {
					name: 'Assign Project Change',
					name$tr$: 'change.main.prjChange'
				},
				showAddButton: true,
				createOptions: {
					permission: 'f86aa473785b4625adcabc18dfde57ac',
					initCreateData: function (createData, entity) {
						createData.PKey1 = entity.ProjectFk || entity.PrjProjectFk;
						if(!_.isNil(entity.PrcHeaderEntity)){
							createData.PKey2 = entity.PrcHeaderEntity.ConfigurationFk;
						}
						if(!_.isNil(entity.ContractHeaderFk)){
							createData.PKey3 = entity.ContractHeaderFk;
						}
						return createData;
					},
					handleCreateSuccess: function (createItem/*, entity*/) {
						return createItem;
					},
					handleCreateSuccessAsync: function ($injector/*, createItem, entity*/) {
						return $injector.get('$q').when(true);
					},
					extendDisplayFields: function (fields/*, entity*/) {
						return fields;
					}
				},
				openAddDialogFn: function ($injector, entity, settings) {
					var basicsLookupdataLookupFilterService = $injector.get('basicsLookupdataLookupFilterService');
					basicsLookupdataLookupFilterService.registerFilter([
						{
							key:'change-main-type-filter',
							fn:(item, entity)=>{
								let typeOptions = entity.typeOptions;
								return item.Islive && (isNilOrZeroOrFalse(_, typeOptions.isProjectChange) || item.IsProjectChange === typeOptions.isProjectChange) &&
									(isNilOrZeroOrFalse(_,typeOptions.isChangeOrder) || item.IsChangeOrder === typeOptions.isChangeOrder) &&
									(isNilOrZeroOrFalse(_,typeOptions.isProcurement) || item.IsProcurement === typeOptions.isProcurement) &&
									(isNilOrZeroOrFalse(_,typeOptions.isSales) || item.IsSales === typeOptions.isSales);
							}
						}
					]);
					var requiredSchemas = [
						{
							typeName: 'ChangeDto',
							moduleSubModule: 'Change.Main'
						},
						{
							typeName: 'ProjectDto',
							moduleSubModule: 'Project.Main'
						}];

					var creationData = settings.createOptions.initCreateData({}, entity);

					var $http = $injector.get('$http');
					var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
					var cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					var codeGenerateService = $injector.get('basicsCompanyNumberGenerationInfoService');
					var $translate = $injector.get('$translate');
					var _ = $injector.get('_');
					var $q = $injector.get('$q');
					var platformSchemaService = $injector.get('platformSchemaService');
					var changeService = $injector.get('changeMainService');
					var runtimeDataService = $injector.get('platformRuntimeDataService');
					var self = this;

					var requiredLoadSchemas = _.filter(requiredSchemas, function (schema) {
						return !platformSchemaService.getSchemaFromCache(schema);
					});

					var loadSchmeas = requiredLoadSchemas.length === 0 ? function () {
						return $q.when([]);
					} : function () {
						return platformSchemaService.getSchemas(requiredLoadSchemas);
					};

					return loadSchmeas().then(function () {
						var customOptions = {
							displayFields: settings.createOptions.extendDisplayFields([{
								name: 'RubricCategoryFk',
								initValue: null
							}, {
								name: 'Code',
								initValue: ''
							}, {
								name: 'Description',
								initValue: ''
							}, {
								name: 'ChangeStatusFk',
								initValue: 1
							}, {
								name: 'ChangeTypeFk',
								initValue: null
							}, {
								name: 'ChangeReasonFk',
								initValue: null
							},{
								name: 'IsChangeOrderFlag',
								initValue:settings.IsChangeOrder
							}], entity)
						};
						return createFromLookup(creationData, customOptions, settings).then(function (result) {
							settings.createOptions.handleCreateSuccess(result.data, entity);
							return settings.createOptions.handleCreateSuccessAsync($injector, result.data, entity).then(function () {
								if (result.data && result.data.Id) {
									if(entity){
										if(settings.IsChangeOrder){
											entity.PrjChangeOrderFk = result.data.Id;
										}else{
											entity.ProjectChangeFk = result.data.Id;
										}
										$injector.get('estimateMainPrjChangeStatusLookupService').appendNewChange(result.data);
									}
									var moduleContext = $injector.get('procurementContextService');
									var mainService = moduleContext.getMainService();
									if (_.get(mainService, 'name') === 'procurement.contract') {
										var procurementContractHeaderDataService = $injector.get('procurementContractHeaderDataService');
										procurementContractHeaderDataService.gridRefresh();
									}
								}
								return result.data;
							});
						});
					});
					function getChangeOrderCreateFormConfig(settings) {
						return {
							fid: 'change.main.createChangeOrder',
							version: '1.0.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['projectfk']
							}],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'projectfk',
									model: 'ProjectFk',
									sortOrder: 1,
									label: 'Project',
									label$tr$: 'cloud.common.entityProjectName',
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
								{
									gid: 'baseGroup',
									rid: 'changetypefk',
									label: 'Change Type',
									label$tr$: 'project.main.entityChangeType',
									type: 'directive',
									directive: 'project-change-type-combobox',
									model: 'ChangeTypeFk',
									required: true,
									sortOrder: 2,
									initValueField: 'ChangeTypeFk',
									options: {
										filterKey: 'change-main-type-filter'
									},
									validator: function (entity, value) {
										$http.post(globals.webApiBaseUrl + 'basics/customize/changetype/instance', {Id: value}).then(function(response) {
											if (response && response.data && response.data.RubricCategoryFk && entity.RubricCategoryFk !== response.data.RubricCategoryFk) {
												entity.RubricCategoryFk = response.data.RubricCategoryFk;
												var generationService = codeGenerateService.getNumberGenerationInfoService('changeMainNumberInfoService', entity.RubricCategoryFk);
												var isReadOnly = false;
												if (entity.RubricCategoryFk && generationService.hasToGenerateForRubricCategory(entity.RubricCategoryFk)) {
													entity.Code = generationService.provideNumberDefaultText(entity.RubricCategoryFk, entity.Code);
													isReadOnly = true;
												} else {
													entity.Code = '';
												}
												var platformDataValidationService = $injector.get('platformDataValidationService');
												platformDataValidationService.finishValidation(isReadOnly, entity, entity.Code, 'Code', self, changeService);
												runtimeDataService.readonly(entity, [{
													field: 'Code',
													readonly: isReadOnly
												}]);

												$http.get(globals.webApiBaseUrl + 'change/main/defaultbytype?changeTypeFk=' + value +
													'&rubricCategoryFk=' + entity.RubricCategoryFk).then(function (result) {
													if (result.data !== undefined && result.data !== null) {
														entity.ChangeReasonFk = result.data.ChangeReasonFk;
														entity.ChangeStatusFk = result.data.ChangeStatusFk;
													}
												});
											}
										});

										return true;
									}
								}
							]
						};
					}
					function createFromLookup(creationData, customOptions, settings) {
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

						customOptions = _.extend({displayFields: []}, customOptions);

						var $q = $injector.get('$q');
						var platformDataValidationService = $injector.get('platformDataValidationService');
						var platformModalFormConfigService = $injector.get('platformModalFormConfigService');
						var changeMainConstantValues = $injector.get('changeMainConstantValues');
						var standardService = $injector.get('changeMainConfigurationService');
						var generationService = codeGenerateService.getNumberGenerationInfoService('changeMainNumberInfoService', changeMainConstantValues.rubricId);
						var generationList = generationService.getList();
						var defer = $q.defer();

						var loadGenerationInfo = generationList.length > 0 ? function () {
							return $q.when(generationList);
						} : function () {
							return generationService.load();
						};

						var layoutDataService = $injector.get('platformLayoutByDataService');
						var layoutService = $injector.get('changeMainConfigurationService');
						layoutDataService.registerLayout(layoutService, changeService);

						var validationDataService = $injector.get('platformValidationByDataService');
						var validationService = $injector.get('changeMainValidationService');
						validationDataService.registerValidationService(validationService, changeService);

						return loadGenerationInfo().then(function () {
							let typeOptions = settings.createOptions.typeOptions;
							return $http.get(globals.webApiBaseUrl + 'change/main/default?isProjectChange=' + getBoolAsString(typeOptions.isProjectChange) +
								'&isChangeOrder=' + getBoolAsString(typeOptions.isChangeOrder) +
								'&isProcurement=' + getBoolAsString(typeOptions.isProcurement) +
								'&isSales=' + getBoolAsString(typeOptions.isSales)).then(function (response) {

								let dataItem = response.data || {};
								let defaultRubricCategory = dataItem.RubricCategoryFk || 0;
								dataItem.typeOptions = settings.createOptions.typeOptions;

								let context = cloudDesktopPinningContextService.getContext();
								let findPinning = context ? _.find(context, {'token': 'project.main'}) : null;

								dataItem.ProjectFk = findPinning ? findPinning.value : null;
								if (creationData && creationData.PKey1) {
									dataItem.ProjectFk = creationData.PKey1;
								}

								var configuration = getChangeOrderCreateFormConfig(settings);
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
								$injector.get('platformTranslateService').translateFormConfig(configuration);

								_.each(customOptions.displayFields, function (field) {
									if (field.initValue) {
										dataItem[field.name] = field.initValue;
									}
								});

								let isGenerateCode = false;
								if (defaultRubricCategory > 0 && generationService.hasToGenerateForRubricCategory(defaultRubricCategory)) {
									dataItem.Code = generationService.provideNumberDefaultText(defaultRubricCategory, dataItem.Code);
									runtimeDataService.readonly(dataItem, [{
										field: 'Code',
										readonly: true
									}]);
									isGenerateCode = true;
								}
								if (!dataItem.Version) {
									dataItem.Version = 0;
								}

								var modalCreateProjectConfig = {
									title: $translate.instant('change.main.createChangeTitle'),
									resizeable: true,
									dataItem: dataItem,
									formConfiguration: configuration,
									handleOK: function handleOK(result) {
										if(!creationData){ creationData = {}; }
										let isContractTerminate = false;
										if (!creationData.PKey3) {
											var parentService = $injector.get('procurementContractHeaderDataService');
											var parentItem = parentService.getSelected();
											if(!_.isNil(parentItem)){
												creationData.PKey2 = parentItem.PrcHeaderEntity.ConfigurationFk;
												creationData.PKey3 = parentItem.ContractHeaderFk !== null ? parentItem.ContractHeaderFk : parentItem.Id;
												isContractTerminate = parentItem.isContractTerminate;
											}
										}
										var param = {
											ProjectFk: result.data.ProjectFk,
											RubricCategoryFk: result.data.RubricCategoryFk,
											ChangeStatusFk: result.data.ChangeStatusFk,
											Code: result.data.Code === 'Is generated' ? null : result.data.Code,
											Description: result.data.Description,
											ChangeTypeFk: result.data.ChangeTypeFk,
											ChangeReasonFk: result.data.ChangeReasonFk,
											ConfigurationFk: creationData.PKey2,
											ContractHeaderFk: creationData.PKey3
										};
										if (isContractTerminate === true){
											param.IsTerminate = isContractTerminate;
										}
										if(result.data.hasOwnProperty('ChangeReasonFk')) {
											return $http.post(globals.webApiBaseUrl + 'change/main/createbyprccontract', param).then(function (result) {
												defer.resolve({data: result.data});
											});
										}
									},
									dialogOptions: {
										disableOkButton: function () {
											const fields = ['ProjectFk', 'ChangeStatusFk', 'Code', 'ChangeTypeFk', 'ChangeReasonFk'];
											let hasError = false;
											angular.forEach(fields, function (field) {
												if (runtimeDataService.hasError(modalCreateProjectConfig.dataItem, field)) {
													hasError = true;
												}
											});

											return !modalCreateProjectConfig.dataItem.ProjectFk || !modalCreateProjectConfig.dataItem.Code || hasError || !modalCreateProjectConfig.dataItem.ChangeTypeFk;
										}
									}
								};
								return platformModalFormConfigService.showDialog(modalCreateProjectConfig).then(function(result) {
									if (result.ok === true) {
										return defer.promise;
									}
									return { data: null };
								});
							});
						});
					}
				}
			}
		};
	};

	angular.module('change.main').directive('projectChangeDialog', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupFilterService',
		function (BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupFilterService) {
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'change-main-by-rubric-category-filter',
					fn: function (item, entity) {
						return item.RubricCategoryFk === entity.RubricCategoryFk;
					}
				}
			]);

			var providerInfo = globals.lookups.ProjectChange();

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
		}
	]);

	angular.module('change.main').directive('estimateProjectChangeDialog', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupFilterService',
		function (BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupFilterService) {
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'change-main-type-by-rubric-category-filter',
					fn: function (item, entity) {
						return item.RubricCategoryFk === entity.RubricCategoryFk;
					}
				},
				{
					key: 'change-main-by-rubric-category-filter',
					fn: function (item, entity) {
						return item.RubricCategoryFk === entity.RubricCategoryFk;
					}
				}
			]);

			let providerInfo = angular.copy(globals.lookups.ProjectChange());
			let lookupOptions = providerInfo.lookupOptions;
			let changeTypeColumn = _.find(lookupOptions.columns, {id: 'ChangeTypeFk'});
			changeTypeColumn.formatterOptions.filterKey = 'change-main-type-by-rubric-category-filter';
			lookupOptions.lookupType = 'ProjectChangeNotOrderType';

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
		}
	]);
})(angular);
