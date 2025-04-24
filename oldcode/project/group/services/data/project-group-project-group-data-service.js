/**
 * Created by nitsche on 21.10.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupProjectGroupDataService
	 * @description provides methods to access, create and update Project Group ProjectGroup entities
	 */
	myModule.service('projectGroupProjectGroupDataService', ProjectGroupProjectGroupDataService);

	ProjectGroupProjectGroupDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformPermissionService', 'basicsCommonMandatoryProcessor', 'projectGroupConstantValues', 'projectGroupReadonlyProcessor'];

	function ProjectGroupProjectGroupDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformPermissionService, basicsCommonMandatoryProcessor, projectGroupConstantValues, projectGroupReadonlyProcessor) {
		let self = this;
		let projectGroupServiceOption = {
			hierarchicalRootItem: {
				module: myModule,
				serviceName: 'projectGroupProjectGroupDataService',
				entityNameTranslationID: 'project.group.projectGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/group/',
					endRead: 'filtered',
					usePostForRead: true
				},
				actions: {
					delete: true,
					create: 'hierarchical',
					canCreateChildCallBackFunc: function (selectedItem) {
						if(_.isNil(selectedItem)) {
							return false;
						}
						if(!selectedItem.IsAutoIntegration) {
							return true;
						}

						return !_.isNil(selectedItem.ITwoBaselineServerFk) && selectedItem.Version > 0 &&
							platformPermissionService.hasCreate(projectGroupConstantValues.uuid.permissions.createWithAutoGeneration, true);
					}
				},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectGroupConstantValues.schemes.projectGroup),
					projectGroupReadonlyProcessor
				],
				presenter: {
					tree: {
						parentProp: 'ProjectGroupFk',
						childProp: 'ProjectGroupChildren',
						initCreationData: function initCreationData(creationData)
						{
							if(serviceContainer.data.CreateAutoIntegrated) {
								creationData.PKey3 = 1;
								serviceContainer.data.CreateAutoIntegrated = false;
							}
							else {
								let selected = self.getSelected();
								if(selected) {
									let parentId =  creationData.parentId;
									// delete creationData.parentId;
									if (!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
										creationData.PKey1 = parentId;
										creationData.PKey2 = selected.ITwoBaselineServerFk;
										creationData.PKey3 = selected.IsAutoIntegration ? 1 : 0;
									}
								}
							}
						}
					}
				},
				entityRole: {
					root: {itemName: 'ProjectGroup', moduleName: 'cloud.desktop.moduleDisplayNameProjectGroup'}
				},
				sidebarSearch: {
					options: {
						moduleName: 'project.group',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				},
				translation: {
					uid: 'projectGroupProjectGroupDataService',
					title: 'entityProjectGroupList',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: projectGroupConstantValues.schemes.projectGroup
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(projectGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.CreateAutoIntegrated = false;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectGroupProjectGroupValidationService'
		}, projectGroupConstantValues.schemes.projectGroup));

		serviceContainer.service.isCreateAutoGenerationDisabled = function isCreateAutoGenerationDisabled () {
			return !platformPermissionService.hasCreate(projectGroupConstantValues.uuid.permissions.createWithAutoGeneration, true);
		};

		serviceContainer.service.createAutoIntegratedRoot = function createAutoIntegratedRoot() {
			serviceContainer.data.CreateAutoIntegrated = true;

			serviceContainer.service.createItem();
		};
	}
})(angular);