/**
 * Created by leo on 27.12.2019.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'project.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarForProjectDataServiceFactory
	 * @description provides methods for all kind of entities
	 */
	angular.module(moduleName).service('projectCalendarForProjectDataServiceFactory', ProjectCalendarForProjectDataServiceFactory);

	ProjectCalendarForProjectDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'projectCalendarCalendarDataService', 'basicsLookupDataRichLineItemProcessor'];

	function ProjectCalendarForProjectDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, projectCalendarCalendarDataService, basicsLookupDataRichLineItemProcessor) {
		var instances = {};

		var self = this;
		this.createDataService = function createDataService(templInfo, allowCreateDelete) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo, allowCreateDelete);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto.replace('Dto','');
		};

		this.getDataServiceName = function getDataServiceName(templInfo) {
			return 'projectCalendar' + self.getNameInfix(templInfo) + 'CalendarForProjectDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo, allowCreateDelete) {
			var projectCalendarProjectServiceOption = {
				flatNodeItem: {
					module: angular.module('project.calendar'),
					serviceName: dsName,
					entityNameTranslationID: 'project.calendar.calendarForProject',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'list', usePostForRead: true,
						initReadData: function (readData) {
							var selelctedChange = projectCalendarCalendarDataService.getSelected();
							readData.Id = selelctedChange.CalendarFk;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					}), basicsLookupDataRichLineItemProcessor],
					presenter: {list: {}},
					actions: {delete: allowCreateDelete, create: allowCreateDelete ? 'flat' : allowCreateDelete},
					entityRole: {
						node: {
							itemName: self.getNameInfix(templInfo),
							parentService: projectCalendarCalendarDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(projectCalendarProjectServiceOption);

			return serviceContainer.service;
		};
	}

})(angular);
