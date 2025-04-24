/**
 * Created by nitsche on 21.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsDropPointHeaderValidationService
	 * @description provides validation methods for project droppoints DropPointHeader entities
	 */
	module.service('projectDropPointsAreaValidationService', ProjectDropPointsAreaValidationService);

	ProjectDropPointsAreaValidationService.$inject = ['platformValidationServiceFactory', 'projectDropPointsConstantValues', 'projectDropPointsAreaDataService'];

	function ProjectDropPointsAreaValidationService(platformValidationServiceFactory, projectDropPointsConstantValues, projectDropPointsAreaDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			projectDropPointsConstantValues.schemes.project,
			{
				mandatory: [platformValidationServiceFactory.determineMandatoryProperties(projectDropPointsConstantValues.schemes.project)]
			},
			self,
			projectDropPointsAreaDataService);
	}
})(angular);