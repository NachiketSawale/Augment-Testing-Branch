/**
 * Created by nitsche on 19.02.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let module = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainActivityValidationService
	 * @description provides validation methods for project main Activity entities
	 */
	module.service('projectMainActivityValidationService', ProjectMainActivityValidationService);

	ProjectMainActivityValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainActivityDataService'];

	function ProjectMainActivityValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainActivityDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			projectMainConstantValues.schemes.activity, 
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.activity)
			},
			self,
			projectMainActivityDataService);
	}
})(angular);