/**
 * Created by csalopek on 14.08.2017.
 */
(function () {
	/* global globals */
	'use strict';
	var extSysModule = angular.module('scheduling.extsys');

	/**
	 * @ngdoc service
	 *
	 * @name schedulingExtSysCalendarService
	 * @function
	 *
	 * @description
	 * schedulingExtSysCalendarService is the data service for all calendar related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	extSysModule.factory('schedulingExtSysCalendarService',
		['$injector', 'moment', '_', '$q', 'basicsLookupdataConfigGenerator', '$http', '$translate', 'platformDataServiceFactory',
			function ($injector, moment, _, $q, basicsLookupdataConfigGenerator, $http, $translate, platformDataServiceFactory) {

				// The instance of the main service - to be filled with functionality below
				function canDelete(item) {
					var result = false;
					if (item.Version === 0) {
						result = true;
					}
					return result;
				}

				var exceptServiceOption = {
					flatRootItem: {
						module: extSysModule,
						serviceName: 'schedulingExtSysCalendarService',
						entityNameTranslationID: 'scheduling.extsys.calendar2external',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'scheduling/extsys/calendar/',
							endRead: 'filtered',
							usePostForRead: true
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									// creationData.mainItemId = creationData.parentId;
									creationData.PKey1 = -1;
								}
							}
						},
						entityRole: {
							root: {
								itemName: 'Calendars',
								moduleName: 'ExtSys',
								mainItemName: 'Calendar2External'
							}
						},
						actions: {
							create: 'flat',
							delete: {},
							canDeleteCallBackFunc: function (item) {
								return canDelete(item);
							}
						},
						entitySelection: {supportsMultiSelection: true}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

				return serviceContainer.service;

			}]);
})();
