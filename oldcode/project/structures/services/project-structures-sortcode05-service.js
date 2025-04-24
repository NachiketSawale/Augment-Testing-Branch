/**
 * Created by joshi on 27.10.2016.
 */

(function (angular) {
	'use strict';
	/*global angular*/

	angular.module('project.structures').factory('projectStructuresSortcode05Service', ['projectStructuresMainService',
		function (projectStructuresMainService) {
			var sortcodeService = projectStructuresMainService.createSortCodeDataService('sortcode05');
			return sortcodeService;
		}]);
})(angular);
