/**
 * Created by zov on 15/11/2018.
 */
(function () {
	'use strict';
	/* global angular, globals*/
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);
	transportModule.factory('trsTransportDispatchingHeaderService', dispatchingHeaderService);
	dispatchingHeaderService.$inject = ['platformDataServiceFactory',
		'transportplanningTransportMainService',
		'trsTransportDispatchingHeaderProcessor',
		'platformDataServiceProcessDatesBySchemeExtension'];
	function dispatchingHeaderService(platformDataServiceFactory,
									  transportMainService,
									  trsTransportDispatchingHeaderProcessor,
									  platformDataServiceProcessDatesBySchemeExtension) {
		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{typeName: 'DispatchHeaderDto', moduleSubModule: 'Logistic.Dispatching'}
		);
		var serviceInfo = {
			flatNodeItem: {
				module: transportModule,
				serviceName: 'trsTransportDispatchingHeaderService',
				//entityNameTranslationID: 'transportplanning.transport.waypointListTitle',
				dataProcessor: [trsTransportDispatchingHeaderProcessor, dateProcessor],
				httpRead: {
					route: globals.webApiBaseUrl + 'transportplanning/transport/route/',
					endRead: 'getDispatchingHeaders',
					initReadData: function initReadData(readData) {
						var selected = transportMainService.getSelected();
						readData.routeId = selected.Id;
						readData.ppsEventFk = selected.PpsEventFk;
						readData.companyFk = selected.CompanyId;
					},
					usePostForRead: true
				},
				entityRole: {
					node: {
						itemName: 'TrsDispatchingHeader',
						parentService: transportMainService,
						parentFilter: 'routeId'
					}
				}
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		return container.service;
	}
})(angular);