(function () {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItemDetailerPlanningBoardStatusService', StatusService);

	StatusService.$inject = ['$q'];

	function StatusService($q) {
		this.getAssignmentStatus = function () {
			return $q.when([]);
		};

		this.getAssignmentStatusIcons = function () {
			return [];
		};
	}
})();
