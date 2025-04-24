(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformPlanningBoardStatusService', PlatformPlanningBoardStatusService);

	PlatformPlanningBoardStatusService.$inject = ['_'];

	function PlatformPlanningBoardStatusService(_) {
		var service = this;
		var changedStatusAssignments = [];

		service.setAssignmentStatusChanged = function (assignment, toStatusId, assignmentMappingService) {
			//useStatusProperties - when changing the status on, for example, phase (assignment) we want actually change the status of product of this phase - different mapping
			const useStatusProperties = _.isFunction(assignmentMappingService.useStatusProperties) && assignmentMappingService.useStatusProperties();
			const entityId = useStatusProperties ? assignmentMappingService.statusEntityId(assignment) : assignmentMappingService.id(assignment);
			const statusFieldKey = useStatusProperties ? assignmentMappingService.statusEntityKey() : assignmentMappingService.statusKey(assignment);

			const statusChangedIndex = _.findIndex(changedStatusAssignments, ['EntityId', entityId]);

			if (statusChangedIndex < 0 && toStatusId !== assignment.StatusFrom) {
				var changedAssignment = {};
				changedAssignment.EntityId = entityId;
				changedAssignment.EntityTypeName = assignmentMappingService.entityTypeName();// 'resreservationstatus';
				changedAssignment.ToStatusId = toStatusId;
				changedAssignment.FromStatusId = assignment.StatusFrom;
				changedAssignment.StatusField = statusFieldKey;// 'ReservationStatusFk';
				changedAssignment.Remark = '';

				changedStatusAssignments.push(changedAssignment);
			} else {
				changedStatusAssignments = _.remove(changedStatusAssignments, function (a) {
					return a.EntityId !== entityId;
				});
			}
		};

		service.getAssignmentStatusChanged = function () {
			return changedStatusAssignments;
		};

		service.clearAssignmentStatusChanged = function () {
			changedStatusAssignments = [];
		};
	}
})(angular);