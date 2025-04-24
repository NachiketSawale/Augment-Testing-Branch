/**
 * Created by nitsche on 21.10.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('basics.company');

	/**
	 * @ngdoc service
	 * @name basicsProjectGroupDataService
	 * @description provides methods to access, create and update basics company ProjectGroup entities
	 */
	myModule.service('basicsProjectGroupDataService', BasicsProjectGroupDataService);

	BasicsProjectGroupDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformPermissionService', 'basicsCommonMandatoryProcessor', 'projectGroupConstantValues', 'projectGroupReadonlyProcessor', 'basicsCompanyMainService', 'platformRuntimeDataService'];

	function BasicsProjectGroupDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformPermissionService, basicsCommonMandatoryProcessor, projectGroupConstantValues, projectGroupReadonlyProcessor, basicsCompanyMainService, platformRuntimeDataService) {
		let self = this;
		let basicsProjectGroupServiceOption = {
			hierarchicalLeafItem: {
				module: myModule,
				serviceName: 'basicsProjectGroupDataService',
				entityNameTranslationID: 'project.group.projectGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/group/',
					endRead: 'listbycompany',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = basicsCompanyMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false, bulk: false},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectGroupConstantValues.schemes.projectGroup),
					projectGroupReadonlyProcessor,
					{processItem: setContainerToReadOnly}
				],
				presenter: {
					tree: {
						parentProp: 'ProjectGroupFk',
						childProp: 'ProjectGroupChildren'
					}

				},
				entityRole: {
					leaf: {itemName: 'ProjectGroup', parentService: basicsCompanyMainService}
				},
				translation: {
					uid: 'basicsProjectGroupDataService',
					title: 'entityProjectGroupList',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: projectGroupConstantValues.schemes.projectGroup
				}
			}
		};
		function setContainerToReadOnly(item) {
			platformRuntimeDataService.readonly(item, true);
		}

		let serviceContainer = platformDataServiceFactory.createService(basicsProjectGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: ''
		}, projectGroupConstantValues.schemes.projectGroup));

	}
})(angular);