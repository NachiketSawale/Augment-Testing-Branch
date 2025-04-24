/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsDropPointArticlesDataService
	 * @description provides methods to access, create and update Project DropPoints DropPointArticles entities
	 */
	module.service('projectDropPointsDropPointArticlesDataService', ProjectDropPointsDropPointArticlesDataService);

	ProjectDropPointsDropPointArticlesDataService.$inject = [
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'projectDropPointsConstantValues', 'projectDropPointsAreaDataService',
		'projectDropPointsDropPointDataService', 'projectDropPointsDropPointArticlesReadOnlyProcessor'
	];

	function ProjectDropPointsDropPointArticlesDataService(
		platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		projectDropPointsConstantValues, projectDropPointsAreaDataService,
		projectDropPointsDropPointDataService, projectDropPointsDropPointArticlesReadOnlyProcessor
	) {
		let self = this;
		let projectDropPointsServiceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'projectDropPointsDropPointArticlesDataService',
				entityNameTranslationID: 'project.droppoints.projectDropPointsEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/droppoints/droppointarticles/',
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
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectDropPointsConstantValues.schemes.dropPointArticles),
					projectDropPointsDropPointArticlesReadOnlyProcessor
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData)
						{
							let selectedArea = projectDropPointsAreaDataService.getSelected()
							let selectedDropPoint = projectDropPointsDropPointDataService.getSelected();
							creationData.PKey1 = selectedArea.Id;
							creationData.PKey2 = selectedDropPoint.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'DropPointArticless', parentService: projectDropPointsAreaDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(projectDropPointsServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectDropPointsDropPointArticlesValidationService'
		}, projectDropPointsConstantValues.schemes.dropPointArticles));
		serviceContainer.service.canCreate = function () {
			return !_.isNil(projectDropPointsDropPointDataService.getSelected());
		}
	}
})(angular);