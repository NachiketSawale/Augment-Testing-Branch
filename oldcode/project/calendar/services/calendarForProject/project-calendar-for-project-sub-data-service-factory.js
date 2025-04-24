/**
 * Created by leo on 27.12.2019.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'project.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarForProjectSubDataServiceFactory
	 * @description provides methods for all kind of entities
	 */
	angular.module(moduleName).service('projectCalendarForProjectSubDataServiceFactory', ProjectCalendarForProjectSubDataServiceFactory);

	ProjectCalendarForProjectSubDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupDataRichLineItemProcessor', '$injector'];

	function ProjectCalendarForProjectSubDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsLookupDataRichLineItemProcessor, $injector) {
		var instances = {};

		var self = this;
		this.createDataService = function createDataService(templInfo, parentSrv, allowCreateDelete, orgSrvName) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo, parentSrv, allowCreateDelete, orgSrvName);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto.replace('Dto','s');
		};

		this.getDataServiceName = function getDataServiceName(templInfo) {
			return 'projectCalendar' + self.getNameInfix(templInfo) + 'CalendarForProjectDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo, parentSrv, allowCreateDelete, orgSrvName) {

			var processors = [];
			if (orgSrvName) {
				var sourceDsv = $injector.get(orgSrvName);
				processors = sourceDsv.getDataProcessor();
				processors.push(basicsLookupDataRichLineItemProcessor);
			}

			var projectCalendarForProjectServiceOption = {
				flatLeafItem: {
					module: angular.module('project.calendar'),
					serviceName: dsName,
					// entityNameTranslationID: 'project.calendar.calendarForProject',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'list'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endCreate: 'create'
					},
					presenter: {list: {
						initCreationData: function initCreationData(creationData) {
							// creationData.mainItemId = creationData.parentId;
							creationData.PKey1 = parentSrv.getSelected().Id;
						}
					}},
					actions: {delete: allowCreateDelete, create: allowCreateDelete ? 'flat' : allowCreateDelete},
					entityRole: {
						leaf: {
							itemName: self.getNameInfix(templInfo),
							parentService: parentSrv
						}
					},
					dataProcessor: processors
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(projectCalendarForProjectServiceOption);

			serviceContainer.service.fireListLoaded = function fireListLoaded(){
				serviceContainer.data.listLoaded.fire();
			};
			serviceContainer.data.usesCache = false;
			serviceContainer.service.dsName = dsName;
			return serviceContainer.service;
		};
	}

})(angular);
