/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsAreaDataService
	 * @description provides methods to access, create and update Project DropPoints DropPointHeader entities
	 */
	module.service('projectDropPointsAreaDataService', ProjectDropPointsAreaDataService);

	ProjectDropPointsAreaDataService.$inject = [
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'projectDropPointsConstantValues', 'cloudDesktopSidebarService'
	];

	function ProjectDropPointsAreaDataService(
		platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		projectDropPointsConstantValues, cloudDesktopSidebarService
	) {
		let self = this;
		let projectDropPointsServiceOption = {
			flatRootItem: {
				module: module,
				serviceName: 'projectDropPointsAreaDataService',
				entityNameTranslationID: 'project.droppoints.projectEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/droppoints/',
					endRead: 'filtered',
					usePostForRead: true
				},
				actions: {delete: false, create: false},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectDropPointsConstantValues.schemes.project)
				],
				entityRole: {
					root: {itemName: 'Project', moduleName: 'cloud.desktop.moduleDisplayNameProjectDropPoints'}
				},
				sidebarSearch: {
					options: {
						moduleName: 'project.droppoints',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: true,
						withExecutionHints: true,
						pinningOptions: {
							isActive: true, showPinningContext: [{token: 'project.main', show: true}],
							setContextCallback: function (prjService) {
								cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'Id');
							}
						}
					}
				},
				translation: {
					uid: 'projectDropPointsAreaDataService',
					title: 'DropPointHeader',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: 'projectDropPointsConstantValues.schemes.group'
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(projectDropPointsServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectDropPointsAreaValidationService'
		}, projectDropPointsConstantValues.schemes.project));
	}
})(angular);