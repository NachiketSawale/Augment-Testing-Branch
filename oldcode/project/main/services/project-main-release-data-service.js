/**
 * Created by baf on 20.12.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainReleaseDataService
	 * @description pprovides methods to access, create and update project main release entities
	 */
	myModule.service('projectMainReleaseDataService', ProjectMainReleaseDataService);

	ProjectMainReleaseDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainService'];

	function ProjectMainReleaseDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainService) {

		var self = this;
		var projectMainReleaseServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectMainReleaseDataService',
				entityNameTranslationID: 'project.main.releaseListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/release/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.release)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Releases', parentService: projectMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainReleaseServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainReleaseValidationService'
		}, projectMainConstantValues.schemes.release));
	}
})(angular);
