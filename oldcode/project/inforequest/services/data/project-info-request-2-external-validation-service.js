(function (angular) {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequest2ExternalValidationService
	 * @description provides validation methods for external to information request
	 */
	module.service('projectInfoRequest2ExternalValidationService', ProjectInfoRequest2ExternalValidationService);
	function ProjectInfoRequest2ExternalValidationService() {
	}

})(angular);
