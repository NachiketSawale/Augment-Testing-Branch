(function (angular) {

	'use strict';
	var module = angular.module('resource.reservation');
	module.service('resourceReservationTypeAndStatusService', ResourceReservationTypeAndStatusService);

	ResourceReservationTypeAndStatusService.$inject = ['_', 'basicsLookupdataSimpleLookupService'];

	function ResourceReservationTypeAndStatusService(_, simpleLookupService) {
		this.getAssignmentStatus = function getAssignmentStatus() {
			return simpleLookupService.getList({
				lookupModuleQualifier: 'basics.customize.resreservationstatus',
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

		this.getAssignmentType = function getAssignmentType() {
			return simpleLookupService.getList({
				lookupModuleQualifier: 'basics.customize.resourcereservationtype',
				displayMember: 'Description',
				valueMember: 'Id'
			});
		};

		this.getAssignmentTypeIcons = function getAssignmentTypeIcons(types) {
			var typeIcons = [];

			_.forEach(types, function(type) {
				typeIcons.push('ico-reservation-type' + _.padStart(type.icon, 2, '0'));
			});

			return typeIcons;
		};
	}
})(angular);
