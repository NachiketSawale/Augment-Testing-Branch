/**
 * Created by baf on 02.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainEventTypeService
	 * @function
	 *
	 * @description
	 * schedulingSchedulePresentService is a data service for presentation of schedules.
	 */
	schedulingMainModule.service('schedulingMainEventTypeService', SchedulingMainEventTypeService);

	SchedulingMainEventTypeService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension'];

	function SchedulingMainEventTypeService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

		var schedulingMainEventTypeOption = {
			module: schedulingMainModule,
			httpRead: {
				route: globals.webApiBaseUrl + 'basics/customize/EventType/',
				endRead: 'list',
				usePostForRead: true
			},
			dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'ScheduleDto',
				moduleSubModule: 'Scheduling.Schedule'
			})],
			presenter: {list: {}},
			entitySelection: {}
		};

		var serviceContainer = platformDataServiceFactory.createService(schedulingMainEventTypeOption, this);

		this.assertEventTypes = function assertEventTypes() {
			if (serviceContainer.data.itemList.length === 0) {
				serviceContainer.data.doReadData(serviceContainer.data);
			}
		};

		this.getDescriptionById = function getEventTypeDescriptionById(id) {
			var type = _.find(serviceContainer.data.itemList, {Id: id});

			return (type) ? type.DescriptionInfo.Translated : '';
		};
	}
})(angular);
