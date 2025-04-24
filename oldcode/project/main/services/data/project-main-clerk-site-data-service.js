/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainClerkSiteDataService
	 * @description pprovides methods to access, create and update project main clerkSite entities
	 */
	myModule.service('projectMainClerkSiteDataService', ProjectMainClerkSiteDataService);

	ProjectMainClerkSiteDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainClerkRoleDataService'];

	function ProjectMainClerkSiteDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainClerkRoleDataService) {
		var self = this;
		var projectMainClerkSiteServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectMainClerkSiteDataService',
				entityNameTranslationID: 'project.main.clerkSiteEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/clerksite/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainClerkRoleDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.clerkSite)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainClerkRoleDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ProjectFk;
							creationData.PKey3 = selected.ClerkFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ClerkSites', parentService: projectMainClerkRoleDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainClerkSiteServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainClerkSiteValidationService'
		}, projectMainConstantValues.schemes.clerkSite));
	}
})(angular);
