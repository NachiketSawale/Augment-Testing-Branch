/**
 * Created by baf on 23.10.2021
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainActionEmployeeDataService
	 * @description pprovides methods to access, create and update project main actionEmployee entities
	 */
	myModule.service('projectMainActionEmployeeDataService', ProjectMainActionEmployeeDataService);

	ProjectMainActionEmployeeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainActionDataService'];

	function ProjectMainActionEmployeeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainActionDataService) {
		var self = this;
		var projectMainActionEmployeeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectMainActionEmployeeDataService',
				entityNameTranslationID: 'project.main.actionEmployeeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/actionemployee/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainActionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.actionEmployee)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainActionDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ProjectFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ActionEmployees', parentService: projectMainActionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainActionEmployeeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainActionEmployeeValidationService'
		}, projectMainConstantValues.schemes.actionEmployee));
	}
})(angular);
