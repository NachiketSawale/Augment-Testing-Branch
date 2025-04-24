/**
 * Created by nitsche on 17.05.2020.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.equipmentgroup';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupLookupService
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupLookupService provides all lookup data for controlling structure module
	 */
	angular.module(moduleName).factory('resourceEquipmentGroupLookupService', ['_','$q', '$http', 'basicsLookupdataLookupDescriptorService', function (_, $q, $http, basicsLookupdataLookupDescriptorService) {

		var service = {},                   // Object presenting the service
			controllingUnitGroups = [],     // holds group values
			nominalDimensionAssignments = [],   // holds assignment values
			controllingUnitDetails = [];

		service.getEquipmentNominalDimensionAssignments = function () {
			return nominalDimensionAssignments;
		};

		service.getControllingUnitGroups = function () {
			return controllingUnitGroups;
		};

		service.getControllingUnitDetails = function (groupId) {
			return (groupId > 0) ? _.filter(controllingUnitDetails, {ControllinggroupFk: groupId}) : [];
		};

		// get controlling assignment data from server
		service.loadAssignmentData = function () {
			// controlling unit assignments
			return $http.post(globals.webApiBaseUrl + 'basics/customize/plantnominaldimensionassignment/list').then(function (response) {
				nominalDimensionAssignments = response.data;
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

		// gets lookup data from server
		service.loadLookupData = function () {
			$q.all([
				service.loadAssignmentData(),
				service.loadGroupData(),
				service.loadDetailData()
			]);
		};

		// reloads lookup data from server
		service.reload = function () {
			return service.loadLookupData();
		};

		// Load the lookup data
		service.loadLookupData();

		return service;
	}]);
})(angular);
