/**
 * Created by leo on 07.11.2017
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainEventOverviewService
	 * @description pprovides methods to access, create and update scheduling main event entities
	 */
	myModule.service('schedulingMainEventOverviewService', SchedulingMainEventOverviewService);

	SchedulingMainEventOverviewService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'schedulingMainService', 'ServiceDataProcessDatesExtension', 'schedulingMainEventAllService'];

	function SchedulingMainEventOverviewService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, schedulingMainService, ServiceDataProcessDatesExtension, schedulingMainEventAllService) {
		var self = this;
		let isLoaded = false;
		var schedulingMainEventServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'schedulingMainEventOverviewService',
				entityNameTranslationID: 'scheduling.main.entityEvent',
				actions: {delete: false, create: false},
				presenter: {
					list: {}
				},
				httpRead: { useLocalResource: true, resourceFunction: function(){
					return schedulingMainEventAllService.getList();
				} },
				dataProcessor: [new ServiceDataProcessDatesExtension(['Date', 'EndDate'])],
				entityRole: {
					leaf: {itemName: 'Events', parentService: schedulingMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(schedulingMainEventServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		serviceContainer.data.clearContent = function clearListContent() {
		};

		function loadAllEvents(){
			serviceContainer.service.load();
		}
		schedulingMainService.registerListLoaded(function(){
			schedulingMainEventAllService.loadAllEvents();
		});
		schedulingMainEventAllService.registerListLoaded(loadAllEvents);
		schedulingMainEventAllService.loadAllEvents();
	}
})(angular);
