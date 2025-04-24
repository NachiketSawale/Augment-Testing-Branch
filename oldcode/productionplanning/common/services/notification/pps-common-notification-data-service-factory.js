/**
 * Created by anl on 10/22/2020.
 */

// eslint-disable-next-line no-redeclare
/*global angular, _, globals*/
// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsCommonNotificationDataServiceFactory', DataServiceFactory);

	DataServiceFactory.$inject = [
		'platformDataServiceFactory'];

	function DataServiceFactory(platformDataServiceFactory) {

		var serviceCache = {};
		var self = this;

		//get service or create service by data-service name
		this.getService = function getService(options) {
			var dsName = options.parentService.getServiceName() + 'NotificationDataService';
			var srv = serviceCache[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				options.serviceName = dsName;
				srv = self.doCreateDataService(options);
				serviceCache[dsName] = srv;
			}
			return srv;
		};

		this.doCreateDataService = function doCreateDataService(options) {

			var serviceInfo = {
				flatLeafItem: {
					module: moduleName,
					serviceName: options.serviceName,
					//entityNameTranslationID: 'transportplanning.requisition.trsGoods.entity',
					httpCRUD: {
						route: globals.webApiBaseUrl + (options.route || 'transportplanning/transport/route/'),
						endRead: 'getNotifications'
					},
					entityRole: {
						leaf: {
							//itemName: 'TrsGoods',
							parentService: options.parentService
						}
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			return container.service;
		};
	}
})(angular);