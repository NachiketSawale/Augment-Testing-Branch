(function (angular) {

	'use strict';
	var module = angular.module('productionplanning.item');
	module.service('productionPlanningItemPlanningBoardStatusService', ProductionPlanningItemPlanningBoardStatusService);

	ProductionPlanningItemPlanningBoardStatusService.$inject = ['_', 'basicsLookupdataSimpleLookupService'];

	function ProductionPlanningItemPlanningBoardStatusService(_, simpleLookupService) {
		this.getAssignmentStatus = function getAssignmentStatus() {
			return simpleLookupService.getList({
				lookupModuleQualifier: 'basics.customize.ppsproductionsetstatus',
				displayMember: 'Description',
				valueMember: 'Id',
				filter: {field: 'BackgroundColor', customIntegerProperty: 'BackgroundColor'}
			});
		};

		this.getAssignmentStatusIcons = function getAssignmentStatusIcons(states) {
			var statusIcons = [];

			_.forEach(states, function(state) {
				statusIcons.push('ico-status' + _.padStart(state.icon, 2, '0'));
			});

			return statusIcons;
		};
	}
})(angular);
