/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsDropPointDataService
	 * @description provides methods to access, create and update Project DropPoints DropPoint entities
	 */
	module.service('projectDropPointsDropPointDataService', ProjectDropPointsDropPointDataService);

	ProjectDropPointsDropPointDataService.$inject = [
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'projectDropPointsConstantValues', 'projectDropPointsAreaDataService', 'projectDropPointsReadOnlyProcessor'
	];

	function ProjectDropPointsDropPointDataService(
		platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		projectDropPointsConstantValues, projectDropPointsAreaDataService, projectDropPointsReadOnlyProcessor
	) {
		let self = this;
		let projectDropPointsServiceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'projectDropPointsDropPointDataService',
				entityNameTranslationID: 'project.droppoints.projectDropPointsEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/droppoints/droppoint/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData)
					{
						let selected = projectDropPointsAreaDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectDropPointsConstantValues.schemes.dropPoint),
					projectDropPointsReadOnlyProcessor
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData)
						{
							let selected = projectDropPointsAreaDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'DropPoints', parentService: projectDropPointsAreaDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(projectDropPointsServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectDropPointsDropPointValidationService'
		}, projectDropPointsConstantValues.schemes.dropPoint));
	}
})(angular);