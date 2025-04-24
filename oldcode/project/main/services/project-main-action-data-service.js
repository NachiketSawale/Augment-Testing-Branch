/**
 * Created by cakiral on 04.11.2020
 */

(function (angular) {
	'use strict';
	var projectMain = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainActionDataService
	 * @description pprovides methods to access, create and update project main action entities
	 */
	projectMain.service('projectMainActionDataService', ProjectMainActionDataService);

	ProjectMainActionDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainService', 'PlatformMessenger', 'basicsCostGroupAssignmentService'];

	function ProjectMainActionDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
										  basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainService, PlatformMessenger, basicsCostGroupAssignmentService) {
		var self = this;
		var service;
		var projectMainActionServiceOption = {
			flatNodeItem: {
				module: projectMain,
				serviceName: 'projectMainActionDataService',
				entityNameTranslationID: 'projectMainActionEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/action/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.action)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						incorporateDataRead: function(result, data) {
							data.isDataLoaded = true;

							basicsCostGroupAssignmentService.process(result, service, {
								mainDataName: 'dtos',
								attachDataName: 'ProjectAction2CostGroups',
								dataLookupType: 'ProjectAction2CostGroups',
								identityGetter: function identityGetter(entity){
									return {
										Id: entity.MainItemId
									};
								}
							});

							return serviceContainer.data.handleReadSucceeded(result.dtos, data);
						}

					}
				},
				entityRole: {
					node: {itemName: 'Action', parentService: projectMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainActionServiceOption, self);
		service = serviceContainer.service;
		serviceContainer.service.onCostGroupCatalogsLoaded = new PlatformMessenger();
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainActionValidationService'
		}, projectMainConstantValues.schemes.action));
	}
})(angular);
