/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestContributionValidationService
	 * @description provides validation methods for contributions to information request
	 */
	module.service('projectInfoRequestContributionValidationService', ProjectInfoRequestContributionValidationService);
	function ProjectInfoRequestContributionValidationService() {
	}

})(angular);
