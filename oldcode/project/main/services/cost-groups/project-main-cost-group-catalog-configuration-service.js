/**
 * Created by baf on 26.10.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeStatusTransitionService
	 * @function
	 *
	 * @description
	 * The basicsCustomizeStatusTransitionService shows the transition dialog for a state entity type
	 */

	angular.module(moduleName).service('projectMainCostGroupCatalogConfigurationService', ProjectMainCostGroupCatalogConfigurationService);

	ProjectMainCostGroupCatalogConfigurationService.$inject = ['_','$http', '$translate', 'platformGridAPI', 'platformModalFormConfigService',
		'platformTranslateService', 'platformRuntimeDataService', 'basicsLookupdataConfigGenerator', 'basicsCostGroupCatalogConfigDataService',
		'basicsLookupdataSimpleLookupService', 'projectMainCostGroupCatalogAssignmentDataService', 'projectMainCostGroupCatalogAssignmentValidationService'];

	function ProjectMainCostGroupCatalogConfigurationService(_, $http, $translate, platformGridAPI, platformModalFormConfigService,
		platformTranslateService, platformRuntimeDataService, basicsLookupdataConfigGenerator, basicsCostGroupCatalogConfigDataService,
		basicsLookupdataSimpleLookupService, projectMainCostGroupCatalogAssignmentDataService, projectMainCostGroupCatalogAssignmentValidationService) {

		var self = this;
		var data = {
			config: null,
			values: {}
		};

		var getModifications = function getModifications(project, catConfig, onlyConfig) {
			return {
				NeedsCopy: !onlyConfig && catConfig.NeedsCopy,
				Project: onlyConfig ? null : project,
				ProjectCatalogConfiguration: {
					Configuration: catConfig.Configuration,
					Type: catConfig.Type,
					Assignments: projectMainCostGroupCatalogAssignmentDataService.getAssignments()
				}
			};
		};

		function isConfigValid() {
			return projectMainCostGroupCatalogAssignmentValidationService.hasNoUniquenessIssues() &&
				projectMainCostGroupCatalogAssignmentValidationService.hasNoDuplicatedCatalogCodes();
		}

		function validateIsEditable(entity, value) {
			if (value) {
				if (!_.isNil(data.config.Project) && !_.isNil(data.config.Project.CatalogConfigTypeFk)) {
					data.config.NeedsCopy = true;
				}

				if (!_.isNil(data.config.Project)) {
					data.config.Project.CatalogConfigTypeFk = null;
				}
			}
			else {
				if (!_.isNil(data.config.Project)) {
					data.config.Project.CatalogConfigTypeFk = data.values.formerCatalogConfigTypeValue;
				}
				data.config.NeedsCopy = false;
			}
			projectMainCostGroupCatalogAssignmentDataService.setEditable(value);
			projectMainCostGroupCatalogAssignmentDataService.setCanCreate(value);
			return true;
		}

		function validateIsProjectCatalog(entity, value) {
			projectMainCostGroupCatalogAssignmentDataService.enableProjectCatalog(value);

			return true;
		}

		this.readonlyRuntimeProcessor = function readonlyRuntimeProcessor(entity, value) {
			var entityToProcess = entity === null || undefined ? data.config : entity;
			var fields = [
				{field: 'IsEditable', readonly: value}
			];
			platformRuntimeDataService.readonly(entityToProcess, fields);
		};

		this.getCustomizeCostGroupConfiguration = function getCustomizeCostGroupConfiguration(catConfiguration) {
			var confService = basicsCostGroupCatalogConfigDataService.getCustomizeCostGroupCatalogService();

			return confService.initialize(catConfiguration.Id,'',catConfiguration.LineitemcontextFk);
		};

		this.editCustomizeCostGroupConfiguration = function editCustomizeCostGroupConfiguration(catConfiguration, customInstanceService) {
			return self.getCustomizeCostGroupConfiguration(catConfiguration).then(function (response) {
				data.config = {};
				data.config.NeedsCopy = false;
				data.config.Configuration = response.configuration;
				data.config.Type = response.configurationType;
				data.config.Assignments = response.configurationAssign;
				data.config.IsEditable = true;
				data.config.CanCreate = true;
				data.values.isMaster = true;

				projectMainCostGroupCatalogAssignmentDataService.setIsMaster(true);
				projectMainCostGroupCatalogAssignmentDataService.setEditable(true);
				projectMainCostGroupCatalogAssignmentDataService.setCanCreate(true);
				projectMainCostGroupCatalogAssignmentDataService.takeAssignments(data.config);

				let isProject = false;
				if (!_.isNil(data.config.Type)) {
					isProject = data.config.Type.IsProject;
					data.config.Configuration.CostGroupConfigurationTypeFk = data.config.Type.Id;
				}
				projectMainCostGroupCatalogAssignmentDataService.enableProjectCatalog(isProject);

				return self.showCostGroupConfiguration(catConfiguration, data.config, true, customInstanceService);
			});
		};

		this.getProjectCostGroupConfiguration = function getProjectCostGroupConfiguration(project) {
			var confService = basicsCostGroupCatalogConfigDataService.getProjectCostGroupCatalogService();

			return confService.initialize(project.Id);
		};

		this.editProjectCostGroupConfiguration = function editProjectCostGroupConfiguration(project, projectDataService) {
			return self.getProjectCostGroupConfiguration(project).then(function (response) {
				data.config = {};
				data.config.Project = project;
				data.config.NeedsCopy = false;
				data.config.Configuration = response.configuration;
				data.config.Type = response.configurationType;
				data.config.Assignments = response.configurationAssign;
				data.config.IsEditable = !project.CatalogConfigTypeFk;
				data.config.CanCreate = !project.CatalogConfigTypeFk;
				data.values.isMaster = false;
				data.values.formerCatalogConfigTypeValue = data.config.Project.CatalogConfigTypeFk;

				projectMainCostGroupCatalogAssignmentDataService.setIsMaster(false);
				projectMainCostGroupCatalogAssignmentDataService.setCanCreate(!project.CatalogConfigTypeFk);
				projectMainCostGroupCatalogAssignmentDataService.takeAssignments(data.config);
				if (!_.isNil(data.config.Type)) {
					data.config.Configuration.CostGroupConfigurationTypeFk = data.config.Type.Id;
				}
				projectMainCostGroupCatalogAssignmentDataService.setEditable(!project.CatalogConfigTypeFk);
				self.readonlyRuntimeProcessor(data.config, !project.CatalogConfigTypeFk);
				return self.showCostGroupConfiguration(project, data.config, false, projectDataService);
			});
		};

		this.showCostGroupConfiguration = function showCostGroupConfiguration(entity, costGroupConfiguration, isMaster, entityDataService) {
			var formConfig = self.prepareConfig(isMaster);
			return platformModalFormConfigService.showDialog({
				title: $translate.instant('basics.customize.projectcatalogconfiguration'),
				dataItem: costGroupConfiguration,
				dialogOptions: {
					width: '50%',
					disableOkButton: function disableOkButton() {
						return !isConfigValid(entity, costGroupConfiguration);
					}
				},
				formConfiguration: formConfig,
				resizeable: true,
				handleOK: function handleOK() {
					platformGridAPI.grids.commitAllEdits();
					var resData = getModifications(entity, costGroupConfiguration, isMaster);
					$http.post(globals.webApiBaseUrl + 'project/main/costgroupcatalogconfiguration', resData).then(function (res) {
						const conf = {
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.projectcatalogconfiguration'
						};
						basicsLookupdataSimpleLookupService.refreshCachedData(conf).then(function() {
							if(isMaster  && !_.isNil(entityDataService)) {
								entityDataService.doNotifyModified(entity);
							}
						});
						if (!isMaster && !_.isNil(entityDataService)) {
							entityDataService.mergeAfterEditCostGroupConfig(entity, res.data.Project);
						}
					});
					self.modified = 0;
				},
				handleCancel: function handleCancel() {
					self.modified = 0;
					if(!data.values.isMaster) {
						data.config.Project.CatalogConfigTypeFk = data.values.formerCatalogConfigTypeValue;
					}
				}
			});
		};

		function getBooleanTypeRow(prop, propTr, order, validateFunc) {
			var res = {
				gid: 'type',
				rid: propTr,
				label$tr$: 'basics.customize.' + propTr,
				type: 'boolean',
				model: 'Type.' + prop,
				sortOrder: order
			};

			if (!!validateFunc && _.isFunction(validateFunc)) {
				res.validator = validateFunc;
			}

			return res;
		}

		function getGroups(isMaster) {
			var groups = [{
				gid: 'configuration',
				header: 'Configuration',
				header$tr$: 'basics.customize.configurationfk',
				isOpen: true,
				visible: true,
				sortOrder: 1
			}];
			var order = 2;

			if (isMaster) {
				groups.push({
					gid: 'type',
					header: 'Enterprise Catalog Configuration',
					header$tr$: 'basics.customize.projectcatalogconfigurationtype',
					isOpen: true,
					visible: true,
					sortOrder: order
				});

				order = 3;
			}

			groups.push({
				gid: 'assignment',
				header: 'Catalog Assignment',
				header$tr$: 'basics.customize.catalogassignment',
				isOpen: true,
				visible: true,
				sortOrder: order
			});

			return groups;
		}

		function getRows(isMaster) {
			var rows;

			if (isMaster) {
				rows = [{
					gid: 'configuration',
					rid: 'configdescription',
					label$tr$: 'cloud.common.entityDescription',
					type: 'translation',
					model: 'Configuration.DescriptionInfo',
					sortOrder: 1
				}];
			}
			else {
				rows = [basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
					'basics.customize.projectcatalogconfigurationtype',
					'',
					{
						gid: 'configuration',
						rid: 'costGroupConfigurationType',
						model: 'Project.CatalogConfigTypeFk',
						sortOrder: 1,
						label$tr$: 'basics.customize.projectcatalogconfigurationtype',
						readonly: true,
					}
				), {
					gid: 'configuration',
					rid: 'iseditable',
					label$tr$: 'basics.customize.editable',
					type: 'boolean',
					model: 'IsEditable',
					readonly: false,
					sortOrder: 2,
					validator: validateIsEditable
				}, {
					gid: 'configuration',
					rid: 'configdescription',
					label$tr$: 'cloud.common.entityDescription',
					type: 'translation',
					model: 'Configuration.DescriptionInfo',
					sortOrder: 3,
					readonly: true
				}];
			}

			if (isMaster) {
				rows.push({
					gid: 'type',
					rid: 'typedescription',
					label$tr$: 'cloud.common.entityDescription',
					type: 'translation',
					model: 'Type.DescriptionInfo',
					sortOrder: 1
				});
				rows.push(getBooleanTypeRow('IsProject', 'isproject', 2, validateIsProjectCatalog));
				rows.push(getBooleanTypeRow('IsConstructionSystem', 'isliccos', 3));
				rows.push(getBooleanTypeRow('IsMaterial', 'islicmaterial', 4));
				rows.push(getBooleanTypeRow('IsActivityCriteria', 'islicactivitycrit', 5));
				rows.push(getBooleanTypeRow('IsEmployee', 'islicemployee', 6));
				rows.push(getBooleanTypeRow('IsAssembly', 'isAssembly', 7));
				rows.push(getBooleanTypeRow('IsWorkItemCatalog', 'isWorkItemCatalog', 8));
			}
			rows.push({
				gid: 'assignment',
				rid: 'assignments',
				type: 'directive',
				directive: 'project-main-cost-group-catalog-assignment-grid-directive',
				readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 1
			});

			return rows;
		}

		this.prepareConfig = function prepareConfig(isMaster) {
			var formConfig = {
				fid: 'project.main.costgroupcatconfig',
				version: '1.0.0',
				showGrouping: true,
				change: 'change',
				groups: getGroups(isMaster),
				rows: getRows(isMaster)
			};
			platformTranslateService.translateFormConfig(formConfig);

			return formConfig;
		};
	}
})(angular);
