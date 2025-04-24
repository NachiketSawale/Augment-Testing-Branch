/**
 * Created by balkanci on 17.11.2017
 */

(function (angular) {
	'use strict';
	var projectModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainAddressDataService
	 * @description provides methods to access, create and update project main address entities
	 */
	projectModule.service('projectMainAddressDataService', ProjectMainAddressDataService);

	ProjectMainAddressDataService.$inject = ['$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService', 'projectMainService', 'projectMainAddressReadonlyProcessor'];

	function ProjectMainAddressDataService($injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformRuntimeDataService, projectMainService, projectMainAddressReadonlyProcessor) {
		var self = this;
		var projectMainAddressServiceOption = {
			flatLeafItem: {
				module: projectModule,
				serviceName: 'projectMainAddressDataService',
				entityNameTranslationID: 'project.main.entityProjectMainAddress',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/address/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainService.getSelected();
						readData.PKey1 = selected.Id;
						readData.PKey3 = selected.AddressFk;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [projectMainAddressReadonlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ProjectAddress', parentService: projectMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainAddressServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = newEntityValidator();

		function newEntityValidator() {
			return {
				validate: function validate(newItem) {
					var validationService = $injector.get('projectMainAddressValidationService');
					var result = validationService.validateAddressFk(newItem);
					platformRuntimeDataService.applyValidationResult(result, newItem, 'AddressEntity');
				}
			};
		}
	}
})(angular);
