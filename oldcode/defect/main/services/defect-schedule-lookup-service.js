/**
 * Created by wwa on 10/29/2015.
 */
/* global , globals, _ */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name defectSchedulingLookupService
	 * @function
	 *
	 * @description
	 * packageSchedulingLookupService is the data service for calendar look ups
	 */
	var modName = 'defect.main';
	angular.module(modName).factory('defectSchedulingLookupService', ['platformLookupDataServiceFactory','schedulingLookupScheduleTypeDataService','basicsLookupdataLookupDescriptorService',

		function (platformLookupDataServiceFactory,schedulingLookupScheduleTypeDataService,basicsLookupdataLookupDescriptorService) {

			var schedulingCalendarLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/schedule/', endPointRead: 'list' },
				filterParam: 'mainItemID'
			};

			// TODO: This use to get scheduletype lookup
			schedulingLookupScheduleTypeDataService.getLookupData({lookupType:'schedulingLookupScheduleTypeDataService'}).then(function(response){
				basicsLookupdataLookupDescriptorService.updateData('ScheduleType', response);
			});

			var serviceContainer = platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig);

			var handleSuccessfulLoad = serviceContainer.data.handleSuccessfulLoad;
			serviceContainer.data.handleSuccessfulLoad = function(loaded, data, key){
				// in package, filter schedule type is IsProcurement
				var ScheduleType = basicsLookupdataLookupDescriptorService.getData('ScheduleType');
				loaded = _.filter(loaded,function(item){
					if(_.find(ScheduleType,{Id:item.ScheduleTypeFk})){
						return !ScheduleType[item.ScheduleTypeFk].Isprocurement;
					}
					return true;
				});
				return handleSuccessfulLoad(loaded, data, key);
			};


			return serviceContainer.service;
		}]);
})(angular);
