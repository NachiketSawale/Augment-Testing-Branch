/**
 * Created by joshi on 27.10.2016.
 */

(function (angular) {
	'use strict';

	angular.module('project.structures').factory('projectStructuresSortcode09Service', ['projectStructuresMainService',
		function (projectStructuresMainService) {
			var sortcodeService = projectStructuresMainService.createSortCodeDataService('sortcode09');
			return sortcodeService;
		}]);
})(angular);
