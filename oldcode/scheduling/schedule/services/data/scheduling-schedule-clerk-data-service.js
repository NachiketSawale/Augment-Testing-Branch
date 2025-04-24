/**
 * Created by baf on 21.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('scheduling.schedule');

	/**
	 * @ngdoc service
	 * @name schedulingScheduleClerkDataService
	 * @description pprovides methods to access, create and update scheduling schedule clerk entities
	 */
	myModule.service('schedulingScheduleClerkDataService', SchedulingScheduleClerkDataService);

	SchedulingScheduleClerkDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'schedulingScheduleEditService'];

	function SchedulingScheduleClerkDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, schedulingScheduleEditService) {
		var self = this;
		var schedulingScheduleClerkServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'schedulingScheduleClerkDataService',
				entityNameTranslationID: 'cloud.common.entityClerk',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'scheduling/schedule/clerk/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = schedulingScheduleEditService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = schedulingScheduleEditService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Schedule2Clerks', parentService: schedulingScheduleEditService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(schedulingScheduleClerkServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'schedulingScheduleClerkValidationService'
		}, {typeName: 'Schedule2ClerkDto', moduleSubModule: 'Scheduling.Schedule'}));
	}
})(angular);
