/**
 * Created by postic on 02.08.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('project.calendar');

	/**
	 * @ngdoc service
	 * @name projectCalendarExceptionDayDataService
	 * @description provides methods to access, create and update project calendar exception day entities
	 */

	myModule.service('projectCalendarExceptionDayDataService', ProjectCalendarExceptionDayDataService);

	ProjectCalendarExceptionDayDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectCalendarConstantValues', 'projectCalendarCalendarDataService'];

	function ProjectCalendarExceptionDayDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectCalendarConstantValues, projectCalendarCalendarDataService) {

		var self = this;
		var projectCalendarExceptionDayServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectCalendarExceptionDayDataService',
				entityNameTranslationID: 'projectCalendarExceptionDayEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/calendar/exceptionday/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectCalendarCalendarDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectCalendarConstantValues.schemes.exceptionday)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectCalendarCalendarDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ProjectExceptionDays', parentService: projectCalendarCalendarDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectCalendarExceptionDayServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectCalendarExceptionDayValidationService'
		}, projectCalendarConstantValues.schemes.exceptionday));

	}
})(angular);
