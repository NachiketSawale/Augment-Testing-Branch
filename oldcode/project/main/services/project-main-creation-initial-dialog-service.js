/**
 * Created by baf on 2019/09/19
 */
(function (angular) {
	'use strict';
	const moduleName = 'project.main';
	let projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * projectLocationMainService is the data service for all location related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.service('projectMainCreationInitialDialogService', ProjectMainCreationInitialDialogService);

	ProjectMainCreationInitialDialogService.$inject = ['_', '$q', '$injector', '$translate',
		'platformRuntimeDataService', 'platformTranslateService', 'platformModalFormConfigService',
		'platformContextService', 'basicsMasterDataRubricCategoryLookupDataService', 'basicsLookupdataConfigGenerator',
		'basicsCustomizeProjectCatalogConfigurationDefaultService', 'basicsClerkUtilitiesService', 'projectMainNumberGenerationSettingsService',
		'projectGroupDefaultEntityService'];

	function ProjectMainCreationInitialDialogService(_, $q, $injector, $translate,
		platformRuntimeDataService, platformTranslateService, platformModalFormConfigService,
		platformContextService, basicsMasterDataRubricCategoryLookupDataService, basicsLookupdataConfigGenerator,
		basicsCustomizeProjectCatalogConfigurationDefaultService, basicsClerkUtilitiesService, projectMainNumberGenerationSettingsService,
		projectGroupDefaultEntityService) {

		function provideCatalogConfigTypeFkRow(sorting) {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
				'basics.customize.projectcatalogconfigurationtype',
				'',
				{
					gid: 'baseGroup',
					rid: 'catalogConfigTypeFk',
					required: true,
					model: 'CatalogConfigTypeFk',
					sortOrder: sorting,
					label$tr$: 'project.main.costGroupConfiguration'
				}
			);
		}

		function provideFormConfig(validateSelectedRubricCategory) {
			return {
				fid: 'project.main.createProjectModal',
				version: '0.2.4',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['rubricCategoryFk', 'projectNo', 'projectLongNo', 'projectName', 'projectName2', 'catalogConfigTypeFk', 'projectGroupFk', 'responsibleCompanyFk', 'clerkFk', 'projectDescription', 'assetmasterFk']
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'rubricCategoryFk',
						model: 'RubricCategoryFk',
						required: true,
						sortOrder: 1,
						label$tr$: 'change.main.entityBasRubricCategoryFk',
						label: 'Rubric Category',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'project-main-rubric-category-lookup-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RubricCategoryByRubricAndCompany',
							displayMember: 'Description'
						},
						validator: validateSelectedRubricCategory,
						asyncValidator: function (entity, value, model) {
							return $injector.get('projectMainProjectValidationService').asyncValidateRubricCategoryFk(entity, value, model);
						}
					},
					{
						gid: 'baseGroup',
						rid: 'ProjectNo',
						required: true,
						label$tr$: 'project.main.projectNo',
						model: 'ProjectNo',
						type: 'code',
						sortOrder: 2,
						validator: function (entity, value, model) {
							return $injector.get('projectMainProjectValidationService').validateProjectNo(entity, value, model);
						},
						asyncValidator: function (entity, value, model) {
							return $injector.get('projectMainProjectValidationService').asyncValidateProjectNo(entity, value, model);
						}
					},
					{
						gid: 'baseGroup',
						rid: 'ProjectName',
						label$tr$: 'cloud.common.entityName',
						model: 'ProjectName',
						type: 'description',
						sortOrder: 3,
						readonly: true
					},
					{
						gid: 'baseGroup',
						rid: 'ProjectName2',
						label$tr$: 'project.main.name2',
						model: 'ProjectName2',
						type: 'description',
						sortOrder: 4,
						readonly: true
					},
					provideCatalogConfigTypeFkRow(5),
					basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('project-group-data-dialog', 'ProjectGroupTree', 'Code', false, {
						gid: 'baseGroup',
						rid: 'projectGroupFk',
						required: true,
						model: 'ProjectGroupFk',
						sortOrder: 6,
						label$tr$: 'cloud.common.entityGroup'
					},'project-group-hide-inactive-leave-filter'),
					basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('basics-company-company-lookup', 'company', 'CompanyName', false, {
						gid: 'baseGroup',
						rid: 'responsibleCompanyFk',
						model: 'CompanyResponsibleFk',
						sortOrder: 7,
						label: 'Profit Center',
						label$tr$: 'project.main.entityProfitCenter'
					}),
					{
						gid: 'baseGroup',
						rid: 'clerkFk',
						model: 'ClerkFk',
						required: true,
						sortOrder: 8,
						label: 'Clerk',
						label$tr$: 'basics.clerk.entityClerk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: false,
								filterKey: 'basics-clerk-by-company-filter'
							}
						}
					},
					basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('basics-asset-master-dialog', 'AssertMaster', 'Code', false,
						{
							gid: 'baseGroup',
							rid: 'assetmasterFk',
							label$tr$: 'estimate.main.mdcAssetMasterFk',
							model: 'AssetMasterFk',
							sortOrder: 9
						}
					)
				]
			};
		}

		function getDialogConfig(service, serviceData) {
			let modalCreateProjectConfig = {
				title: $translate.instant('project.main.createProjectTitle'),
				resizeable: true,
				dataItem: {
					RubricCategoryFk: 0,
					CatalogConfigTypeFk: 0,
					ProjectGroupFk: 0,
					CompanyResponsibleFk: platformContextService.getContext().signedInClientId,
					ClerkFk: 0,
					ProjectNo: platformTranslateService.instant('cloud.common.isGenerated'),
					ProjectName: '',
					ProjectName2: '',
					AssetmasterFk: null
				},
				formConfiguration: provideFormConfig(validateSelectedRubricCat),
				handleOK: function handleOK(result) {// result not used
					let newProject = result.data;
					serviceData.doCallHTTPCreate(newProject, serviceData, serviceData.onCreateSucceeded);
				}
			};

			modalCreateProjectConfig.dialogOptions = {
				disableOkButton: function () {
					return !modalCreateProjectConfig.dataItem.ClerkFk || !modalCreateProjectConfig.dataItem.CatalogConfigTypeFk ||
						!modalCreateProjectConfig.dataItem.ProjectNo || modalCreateProjectConfig.dataItem.ProjectGroupFk === null ||
						!_.isEmpty(_.compact(_.values(modalCreateProjectConfig.dataItem.__rt$data.errors)));
				}
			};

			return modalCreateProjectConfig;
		}

		function validateSelectedRubricCat(entity, value /* , model */) {
			platformRuntimeDataService.readonly(entity, [{
				field: 'ProjectNo',
				readonly: projectMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(value)
			}]);
			_.set(entity, 'ProjectNo', projectMainNumberGenerationSettingsService.provideNumberDefaultText(value, entity.ProjectNo));
		}

		function validateSelectedRubricCatForComplexEntity(entity, value /* , model */) {
			const readOnly = projectMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
			platformRuntimeDataService.readonly(entity, [{
				field: 'Project.ProjectNo',
				readonly: readOnly
			}]);
			_.set(entity, 'Project.ProjectNo', projectMainNumberGenerationSettingsService.provideNumberDefaultText(value, entity.Project.ProjectNo));
			entity.handleProjectNoIsReadOnly(entity, readOnly);
		}

		function showDialog(modalCreateProjectConfig) {
			platformTranslateService.translateFormConfig(modalCreateProjectConfig.formConfiguration);

			platformModalFormConfigService.showDialog(modalCreateProjectConfig);
		}

		function requestMasterDataRubricCategory(modalCreateProjectConfig) {
			basicsMasterDataRubricCategoryLookupDataService.setFilter(3);
			return basicsMasterDataRubricCategoryLookupDataService.getList({lookupType: 'basicsMasterDataRubricCategoryLookupDataService'}).then(function () {
				let defEntity = basicsMasterDataRubricCategoryLookupDataService.getDefault();
				let Id = (defEntity) ? defEntity.Id : null;
				validateSelectedRubricCat(modalCreateProjectConfig.dataItem, Id);
				modalCreateProjectConfig.dataItem.RubricCategoryFk = Id;

				return true;
			});
		}

		function requestProjectGroup(modalCreateProjectConfig) {
			return projectGroupDefaultEntityService.getDefault().then(function (defEntity) {
				modalCreateProjectConfig.dataItem.ProjectGroupFk = (defEntity) ? defEntity.Id : 0;

				return true;
			});
		}

		function requestDefaultCatalogConfig(modalCreateProjectConfig) {
			return basicsCustomizeProjectCatalogConfigurationDefaultService.getDefault().then(function(defConfig) {
				if(!_.isNil(defConfig)) {
					modalCreateProjectConfig.dataItem.CatalogConfigTypeFk = defConfig.Id;
				}
			});
		}

		function requestDefaultControlTemplate(modalCreateProjectConfig) {
			let serviceName = 'controllingControllingunittemplateLookupService';
			let controltemplateLookupService = $injector.get(serviceName);
			return controltemplateLookupService.getList({lookupType: serviceName}).then(function() {
				let defaultEntity = controltemplateLookupService.getDefault({lookupType: serviceName});
				modalCreateProjectConfig.dataItem.ControltemplateFk = _.has(defaultEntity, 'Id') ? defaultEntity.Id : null;
			});
		}

		function requestLoginUserClient(modalCreateProjectConfig) {
			return basicsClerkUtilitiesService.getClientByUser().then(function (data) {
				modalCreateProjectConfig.dataItem.ClerkFk = data.Id;
				return true;
			}, function () {
				return true;
			});
		}

		function requestResponsibleCompany(modalCreateProjectConfig) {
			modalCreateProjectConfig.dataItem.CompanyResponsibleFk = platformContextService.getContext().signedInClientId;

			return $q.when(true);
		}

		function requestProjectCreationData(modalCreateProjectConfig) {
			modalCreateProjectConfig.dataItem.RubricCategoryFk = 0;
			modalCreateProjectConfig.dataItem.CatalogConfigTypeFk = 0;
			modalCreateProjectConfig.dataItem.ProjectGroupFk = 0;
			modalCreateProjectConfig.dataItem.CompanyResponsibleFk = 0;
			modalCreateProjectConfig.dataItem.ClerkFk = 0;
			modalCreateProjectConfig.dataItem.ProjectNo = platformTranslateService.instant('cloud.common.isGenerated');
			modalCreateProjectConfig.dataItem.ProjectLongNo = '';
			modalCreateProjectConfig.dataItem.ProjectName = '';
			modalCreateProjectConfig.dataItem.ProjectName2 = '';
			modalCreateProjectConfig.dataItem.AssetmasterFk = null;
			modalCreateProjectConfig.dataItem.ControltemplateFk = null;

			return $q.all([
				requestMasterDataRubricCategory(modalCreateProjectConfig),
				requestProjectGroup(modalCreateProjectConfig),
				requestDefaultCatalogConfig(modalCreateProjectConfig),
				requestDefaultControlTemplate(modalCreateProjectConfig),
				requestLoginUserClient(modalCreateProjectConfig),
				requestResponsibleCompany(modalCreateProjectConfig)
			]);
		}

		function requestProjectCreationDataAndShowDialog(modalCreateProjectConfig) {
			requestProjectCreationData(modalCreateProjectConfig).then(function() {
				showDialog(modalCreateProjectConfig);
			});
		}

		this.getFormConfig = function getFormConfig() {
			return provideFormConfig(validateSelectedRubricCatForComplexEntity);
		};

		this.showCreateDialog = function showCreateDialog(service, serviceData) {
			let modalCreateProjectConfig = getDialogConfig(service, serviceData);

			requestProjectCreationDataAndShowDialog(modalCreateProjectConfig);
		};

		this.adjustCreateConfiguration= function adjustCreateConfiguration(dlgLayout /* , conf, data */) {
			let row = _.find(dlgLayout.formConfiguration.rows, {rid: 'rubriccategoryfk'});
			if(!_.isNil(row)) {
				row.readonly = false;
				row.validator = validateSelectedRubricCat;
			}

			dlgLayout.title = platformTranslateService.instant('project.main.createProjectTitle', undefined, true);

			row = _.find(dlgLayout.formConfiguration.rows, {rid: 'catalogconfigtypefk'});
			if(!_.isNil(row)) {
				let gid = row.gid;
				let sortOrder = row.sortOrder;
				let ovl = provideCatalogConfigTypeFkRow();
				_.extend(row, ovl);
				row.sortOrder = sortOrder;
				row.gid = gid;
			}

			return requestProjectCreationData(dlgLayout).then(function() {
				return dlgLayout;
			});
		};
	}
})(angular);
