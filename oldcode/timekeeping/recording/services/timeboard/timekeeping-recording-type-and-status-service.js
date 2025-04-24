(function (angular) {

	'use strict';
	var module = angular.module('timekeeping.recording');
	module.service('timekeepingRecordingTypeAndStatusService', TimekeepingRecordingTypeAndStatusService);

	TimekeepingRecordingTypeAndStatusService.$inject = ['_', 'basicsLookupdataSimpleLookupService'];

	function TimekeepingRecordingTypeAndStatusService(_, simpleLookupService) {
		this.getAssignmentStatus = function getAssignmentStatus() {
			return simpleLookupService.getList({
				lookupModuleQualifier: 'basics.customize.timekeepingreportstatus',
				displayMember: 'Description',
				valueMember: 'Id'
			});
		};

		this.getAssignmentStatusIcons = function getAssignmentStatusIcons(states) {
			var statusIcons = [];

			_.forEach(states, function (state) {
				statusIcons.push('ico-status' + _.padStart(state.icon, 2, '0'));
			});

			return statusIcons;
		};

		this.getAssignmentType = function getAssignmentType() {
			return simpleLookupService.getList({
				lookupModuleQualifier: 'basics.customize.timekeepingprofessionalcategory',
				displayMember: 'Description',
				valueMember: 'Id',
				filter: {field: 'IsDefault', customBoolProperty: 'ISDEFAULT'}
			});
		};

		this.getAssignmentTypeIcons = function getAssignmentTypeIcons(types) {
			var typeIcons = [];

			_.forEach(types, function (type) {
				typeIcons.push('ico-status' + _.padStart(type.icon, 2, '0'));
			});

			return typeIcons;
		};
	}
})(angular);
