/**
 * Created by Shankar on 30.11.2022.
 */

(function (angular) {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestReferenceToValidationService
	 * @description provides validation methods for contributions to information request
	 */
	module.service('projectInfoRequestReferenceToValidationService', ProjectInfoRequestReferenceToValidationService);
	function ProjectInfoRequestReferenceToValidationService() {

	}

})(angular);
