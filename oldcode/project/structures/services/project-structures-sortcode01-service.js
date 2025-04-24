/**
 * Created by joshi on 25.10.2016.
 */

(function (angular) {
	'use strict';

	angular.module('project.structures').factory('projectStructuresSortcode01Service', ['projectStructuresMainService',
		function (projectStructuresMainService) {
			var sortcodeService = projectStructuresMainService.createSortCodeDataService('sortcode01');
			return sortcodeService;
		}]);
})(angular);
