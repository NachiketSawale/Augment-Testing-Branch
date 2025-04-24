/**
 * Created by Frank Baedeker on 25.08.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'scheduling.lookup';

	/**
	 * @ngdoc service
	 * @name schedulingLookupService
	 * @function
	 *
	 * @description
	 * schedulingLookupService provides all lookup data for scheduling modules
	 */
	angular.module(moduleName).factory('schedulingLookupService', ['$http', 'basicsLookupdataLookupDescriptorService', function ($http,basicsLookupdataLookupDescriptorService) {

		// private code
		var lookupData = {
			activityStates: [],
			constraintTypes: [],
			progressReportMethods: [],
			relationKinds: [],
			schedulingMethods: [],
			taskTypes: [],
			eventTypes: [],
			controllingGroups: [],
			controllingGroupDetails: []
		};
		var lastControllingGroupId = 0;

		// Object presenting the service
		var service = {};

		// Messengers
		// service.lookupDataLoaded = new Platform.Messenger();

		// scheduling look up data service calls
		service.getActivityStates = function () {
			basicsLookupdataLookupDescriptorService.updateData('activitystate', lookupData.activityStates);
			return lookupData.activityStates;
		};

		service.getConstraintTypes = function () {
			basicsLookupdataLookupDescriptorService.updateData('activityconstraint', lookupData.constraintTypes);
			return lookupData.constraintTypes;
		};

		service.getProgressReportMethods = function () {
			basicsLookupdataLookupDescriptorService.updateData('activityprogressreportmethod', lookupData.progressReportMethods);
			return lookupData.progressReportMethods;
		};

		service.getRelationKinds = function () {
			basicsLookupdataLookupDescriptorService.updateData('activityrelationkind', lookupData.relationKinds);
			return lookupData.relationKinds;
		};

		service.getSchedulingMethods = function () {
			basicsLookupdataLookupDescriptorService.updateData('activityschedulingmethod', lookupData.schedulingMethods);
			return lookupData.schedulingMethods;
		};

		service.getTaskTypes = function () {
			basicsLookupdataLookupDescriptorService.updateData('activitytasktype', lookupData.taskTypes);
			return lookupData.taskTypes;
		};

		service.getEventTypes = function () {
			basicsLookupdataLookupDescriptorService.updateData('eventtype', lookupData.eventTypes);
			return lookupData.eventTypes;
		};

		service.getControllingGroups = function () {
			basicsLookupdataLookupDescriptorService.updateData('controllinggroup', lookupData.controllingGroups);
			return lookupData.controllingGroups;
		};

		service.getControllingGroupDetails = function () {
			basicsLookupdataLookupDescriptorService.updateData('controllinggroupdetail', lookupData.controllingGroupDetails);
			return lookupData.controllingGroupDetails;
		};

		service.setControllingGroupDetails = function (grpId){
			if(grpId !== lastControllingGroupId) {
				lastControllingGroupId = grpId;
				$http.get(globals.webApiBaseUrl + 'scheduling/lookup/controllinggroupdetails?grpId=' + grpId
				).then(function (response) {
					lookupData.controllingGroupDetails = response.data;
					basicsLookupdataLookupDescriptorService.updateData('controllinggroupdetail', response.data);
				}
				);
			}
		};
		// activity service calls

		service.loadLookupData = function(){
			$http.get(globals.webApiBaseUrl + 'scheduling/lookup/complete'
			).then(function(response) {
				lookupData.activityStates = response.data.ActivityStates;
				basicsLookupdataLookupDescriptorService.updateData('activitystate', response.data.ActivityStates);
				lookupData.constraintTypes = response.data.ConstraintTypes;
				basicsLookupdataLookupDescriptorService.updateData('activityconstraint', response.data.ConstraintTypes);
				lookupData.progressReportMethods = response.data.ProgressReportMethods;
				basicsLookupdataLookupDescriptorService.updateData('activityprogressreportmethod', response.data.ProgressReportMethods);
				lookupData.relationKinds = response.data.RelationKinds;
				basicsLookupdataLookupDescriptorService.updateData('activityrelationkind', response.data.RelationKinds);
				lookupData.schedulingMethods = response.data.SchedulingMethods;
				basicsLookupdataLookupDescriptorService.updateData('activityschedulingmethod', response.data.SchedulingMethods);
				lookupData.taskTypes = response.data.TaskTypes;
				basicsLookupdataLookupDescriptorService.updateData('activitytasktype', response.data.TaskTypes);
				lookupData.eventTypes = response.data.EventTypes;
				basicsLookupdataLookupDescriptorService.updateData('eventtype', response.data.EventTypes);
				lookupData.controllingGroups = response.data.ControllingGroups;
				basicsLookupdataLookupDescriptorService.updateData('controllinggroup', response.data.ControllingGroups);
				service.loadLookupControllingData();
			}
			);
		};
		service.loadLookupControllingData = function(){
			angular.forEach(lookupData.controllingGroups, function(group){
				service.setControllingGroupDetails(group.Id);
			});
		};


		// General stuff
		service.reload = function(){
			service.loadLookupData();
		};

		// Load the scheduling lookup data
		service.loadLookupData();

		return service;
	}]);
})();
