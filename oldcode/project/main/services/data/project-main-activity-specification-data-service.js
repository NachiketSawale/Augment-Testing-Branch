/**
 * Created by nitsche on 19.02.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainActivitySpecificationDataService
	 * @description provides methods to access, create and update Project Main Activity entities
	 */
	module.service('projectMainActivitySpecificationDataService', ProjectMainActivitySpecificationDataService);

	ProjectMainActivitySpecificationDataService.$inject = [
		'platformSpecificationContainerDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainActivityDataService'
	];

	function ProjectMainActivitySpecificationDataService(
		platformSpecificationContainerDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainActivityDataService
	) {
		let self = this;
		let projectMainActivitySpecificationServiceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'projectMainActivitySpecificationDataService',
				actions: {delete: true, create: 'flat'},
				entityRole: {
					leaf: {itemName: 'Specification', parentService: projectMainActivityDataService, parentChildProp: "BlobsFk"}
				}
			}
		};

		let serviceContainer = platformSpecificationContainerDataServiceFactory.createDataService(projectMainActivitySpecificationServiceOption, self);
	}
})(angular);