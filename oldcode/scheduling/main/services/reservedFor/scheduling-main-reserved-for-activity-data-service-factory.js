/**
 * Created by baf on 29.12.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainReservedForActivityDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('schedulingMainReservedForActivityDataServiceFactory', SchedulingMainReservedForActivityDataServiceFactory);

	SchedulingMainReservedForActivityDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'schedulingMainService'];

	function SchedulingMainReservedForActivityDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, schedulingMainService) {
		var instances = {};

		var self = this;
		this.createDataService = function createDataService(templInfo) {
			var dsName = self.getDataServiceName();

			var srv = instances[dsName];
			if(_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName() {
			return 'resourceReservationReservedForActivityDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo) {
			var schedulingMainRequiredByActivityDataServiceOption = {
				flatLeafItem: {
					module: angular.module('resource.reservation'),
					serviceName: dsName,
					entityNameTranslationID: 'resource.reservation.entityReservation',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'reservedfor', usePostForRead: true,
						initReadData: function (readData) {
							readData.Id = 1;
							readData.PKey1 = schedulingMainService.getSelected().Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					})],
					presenter: { list: {} },
					actions: {delete: false, create: false },
					entityRole: {
						leaf: {
							itemName: 'ReservedFor' + self.getNameInfix(templInfo),
							parentService: schedulingMainService } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainRequiredByActivityDataServiceOption);

			return serviceContainer.service;
		};
	}
})(angular);
