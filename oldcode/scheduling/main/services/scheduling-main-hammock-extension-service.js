/**
 * Created by nitsche on 15.11.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainHammockExtensionService
	 * @description provides service methods for scheduling main service threading hammock activities
	 */
	myModule.service('schedulingMainHammockExtensionService', SchedulingMainHammockExtensionService);

	SchedulingMainHammockExtensionService.$inject = ['_', '$http','$injector'];

	function SchedulingMainHammockExtensionService(_, $http, $injector) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf scheduling.main.schedulingMainHammockExtensionService
		 * @description adds method for calculating activity of type hammock its datefields at serverside
		 * @param container {object} contains entire service and its data to be created
		 * @param options {object} describes how to create the service and all its data
		 * @returns state
		 */
		this.addHammockRefreshDateFieldServersideLogic = function addHammockRefreshDateFieldServersideLogic(container) {
			container.data.refreshHammockDateFields = function refreshHammockDateFields(hammockActivity, newHammocks, deletedHammocks){
				var remoteCommannd = globals.webApiBaseUrl + 'scheduling/main/activity/refreshHammockDateFields';
				var request = {
					hammockActivity: hammockActivity,
					newHammocks: newHammocks,
					deletedHammocks: deletedHammocks
				};
				return $http.post(remoteCommannd, request).then(function (response) {
					container.service.takeOverActivities([response.data], false);
				});
			};
			container.service.refreshHammockDateFields = function refreshHammockDateFields(hammockActivity, changedHammocks){
				var schedulingMainHammockDataService = $injector.get('schedulingMainHammockDataService');
				var currentToSave = schedulingMainHammockDataService.getCurrentToSave();
				var currentToDelete = schedulingMainHammockDataService.getCurrentToDelete();
				if(_.isArray(changedHammocks)){
					currentToSave = _.unionBy(changedHammocks, currentToSave,function(item){return item.Id;});
				}
				return container.data.refreshHammockDateFields(hammockActivity,currentToSave,currentToDelete);
			};
		};
	}
})(angular);
