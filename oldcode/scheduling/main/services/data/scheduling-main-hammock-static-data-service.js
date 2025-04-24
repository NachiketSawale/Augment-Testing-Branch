/* global globals, _ */
/**
 * Created by nitsche on 15.11.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainHammockStaticDataService
	 * @description provides service methods for scheduling main hammock
	 */
	myModule.service('schedulingMainHammockStaticDataService', SchedulingMainHammockStaticDataService);

	SchedulingMainHammockStaticDataService.$inject = ['$http', '$q'];

	function SchedulingMainHammockStaticDataService($http, $q) {
		var service = {};

		service.CreateHammocks = function CreateHammocks (creationData, activityIds) {
			if (activityIds.length > 0){
				var httpReadRoute = globals.webApiBaseUrl + 'scheduling/main/hammock/createHammocks';
				var parameter = {
					activityIdsToHammock: activityIds,
					creationData: creationData
				};
				return $http.post(httpReadRoute, parameter);
			}
			else{
				return $q(function (resolve) {
					var response = {
						data: []
					};
					resolve(response);
				});
			}

		};

		service.missingActivities = function missingActivities (activitiesIds, hammockActivityMemberFks){
			return _.differenceWith(activitiesIds,hammockActivityMemberFks,function(activityIds,hammockActivityMemberFk){
				return activityIds === hammockActivityMemberFk;
			});
		};

		service.hasAllActivitiesALinkeToHammock = function hasAllActivitiesALinkeToHammock(activities, fullHammockList) {
			return _.isEmpty(_.xorBy(_.xorWith(activities,fullHammockList,function(activity,hammock){
				return activity.Id === hammock.ActivityMemberFk;
			}),fullHammockList, function (ham) {
				return ham.Id;
			}));
		};

		service.setCreationData = function setCreationData(hammockActivity, creationData){
			creationData.PKey1 = hammockActivity.Id;
			creationData.PKey2 = hammockActivity.ScheduleFk;
			creationData.PKey3 = hammockActivity.ProjectFk;
		};

		service.getCreationData = function getCreationData(hammockActivity){
			var creationData = {};
			service.setCreationData(hammockActivity, creationData);
			return creationData;
		};

		return service;
	}
})(angular);