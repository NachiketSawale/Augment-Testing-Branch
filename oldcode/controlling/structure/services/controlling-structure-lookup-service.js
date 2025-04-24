/**
 * Created by janas on 21.11.2014.
 */

/* jslint nomen:true */

(function () {
	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * The constant contains lookup types which can be used in lookup directive.
	 */
	angular.module(moduleName).value('controllingStructureLookupTypes', {
		'controllingunitstatus': 'controlling/structure/lookup/controllingunitstatus',
		'controllinggroup': 'controlling/structure/lookup/controllinggroup',
		'controllinggroupdetail': 'controlling/structure/lookup/controllinggroupdetail'
	});

	/**
	 * @ngdoc service
	 * @name controllingStructureLookupService
	 * @function
	 *
	 * @description
	 * controllingStructureLookupService provides all lookup data for controlling structure module
	 */
	angular.module(moduleName).factory('controllingStructureLookupService', ['globals', '_', '$http', 'basicsLookupdataLookupDescriptorService', function (globals, _, $http, basicsLookupdataLookupDescriptorService) {

		var service = {},                   // Object presenting the service
			controllingUnitStatuses = [],   // holds status values
			controllingUnitGroups = [],     // holds group values
			controllingUnitDetails = [],    // holds detail values
			controllingUnitAssignments = [];    // holds assignment values

		// look up data service call
		// TODO: fix async http request problem
		service.getControllingUnitStatuses = function () {
			return controllingUnitStatuses;
		};

		service.getControllingUnitGroups = function () {
			return controllingUnitGroups;
		};

		service.getControllingUnitAssignments = function () {
			return controllingUnitAssignments;
		};

		service.getControllingUnitDetails = function (groupId) {
			return (groupId > 0) ? _.filter(controllingUnitDetails, {ControllinggroupFk: groupId}) : [];
		};

		// get controlling unit status lookup data from server
		service.loadStatusData = function () {
			$http.get(globals.webApiBaseUrl + 'controlling/structure/lookup/controllingunitstatus')
				.then(function (response) {
					controllingUnitStatuses = response.data;
					basicsLookupdataLookupDescriptorService.updateData('controllingunitstatus', controllingUnitStatuses);
				});
		};
		// get controlling group lookup data from server
		service.loadGroupData = function () {
			$http.get(globals.webApiBaseUrl + 'controlling/structure/lookup/controllinggroup')
				.then(function (response) {
					controllingUnitGroups = response.data;
					basicsLookupdataLookupDescriptorService.updateData('controllinggroup', controllingUnitGroups);
				});
		};

		// get controlling detail status lookup data from server
		service.loadDetailData = function () {
			$http.get(globals.webApiBaseUrl + 'controlling/structure/lookup/controllinggroupdetail')
				.then(function (response) {
					controllingUnitDetails = response.data;
					basicsLookupdataLookupDescriptorService.updateData('controllinggroupdetail', controllingUnitDetails);
				});
		};

		// get controlling assignment data from server
		service.loadAssignmentData = function () {
			// controlling unit assignments
			return $http.post(globals.webApiBaseUrl + 'basics/customize/ControllingUnitAssignment/list').then(function (response) {
				controllingUnitAssignments = response.data;
			});
		};

		// gets lookup data from server
		service.loadLookupData = function () {
			service.loadStatusData();
			service.loadGroupData();
			service.loadDetailData();
			service.loadAssignmentData();
		};

		// reloads lookup data from server
		service.reload = function () {
			service.loadLookupData();
		};

		// Load the lookup data
		service.loadLookupData();

		return service;
	}]);
})();
