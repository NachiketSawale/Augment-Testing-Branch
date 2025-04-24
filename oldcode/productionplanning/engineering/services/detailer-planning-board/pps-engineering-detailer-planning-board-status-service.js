(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).service('ppsEngDetailerPlanningBoardStatusService', StatusService);

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
