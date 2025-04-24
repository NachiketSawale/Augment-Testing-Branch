/**
 * Created by joshi on 27.10.2016.
 */

(function (angular) {
	'use strict';

	angular.module('project.structures').factory('projectStructuresSortcode10Service', ['projectStructuresMainService',
		function (projectStructuresMainService) {
			var sortcodeService = projectStructuresMainService.createSortCodeDataService('sortcode10');
			return sortcodeService;
		}]);
})(angular);
