/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsDropPointValidationService
	 * @description provides validation methods for project droppoints DropPoint entities
	 */
	module.service('projectDropPointsDropPointValidationService', ProjectDropPointsDropPointValidationService);

	ProjectDropPointsDropPointValidationService.$inject = [
		'platformValidationServiceFactory', 'projectDropPointsConstantValues', 'projectDropPointsDropPointDataService',
		'projectDropPointsReadOnlyProcessor'
	];

	function ProjectDropPointsDropPointValidationService(
		platformValidationServiceFactory, projectDropPointsConstantValues, projectDropPointsDropPointDataService,
		projectDropPointsReadOnlyProcessor
	) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			projectDropPointsConstantValues.schemes.dropPoint,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectDropPointsConstantValues.schemes.dropPoint)
			},
			self,
			projectDropPointsDropPointDataService);
		self.validateIsManual = function validateIsManual(entity, value, model) {
			entity[model] = value;
			projectDropPointsReadOnlyProcessor.processItem(entity);
			return true;
		}
	}
})(angular);