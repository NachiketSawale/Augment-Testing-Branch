/**
 * Created by baf on 14.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainClerkRoleDataService
	 * @description pprovides methods to access, create and update project main clerkRole entities
	 */
	myModule.service('projectMainClerkRoleDataService', ProjectMainClerkRoleDataService);

	ProjectMainClerkRoleDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainService'];

	function ProjectMainClerkRoleDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainService) {
		var self = this;
		var projectMainClerkRoleServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'projectMainClerkRoleDataService',
				entityNameTranslationID: 'basics.common.entityClerkRole',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/clerkrole/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.clerkRole)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'ClerkRoles', parentService: projectMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainClerkRoleServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainClerkRoleValidationService'
		}, projectMainConstantValues.schemes.clerkRole));
	}
})(angular);
