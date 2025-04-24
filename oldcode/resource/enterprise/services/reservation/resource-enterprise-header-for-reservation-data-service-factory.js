/**
 * Created by baf on 2021-10-08.
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.enterprise';

	/**
	 * @ngdoc service
	 * @name resourceEnterpriseHeaderForReservationDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('resourceEnterpriseHeaderForReservationDataServiceFactory', ResourceEnterpriseHeaderForReservationDataServiceFactory);

	ResourceEnterpriseHeaderForReservationDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'resourceEnterprisePlanningBoardReservationService'];

	function ResourceEnterpriseHeaderForReservationDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		resourceEnterprisePlanningBoardReservationService) {

		let instances = {};

		let self = this;

		this.createDataService = function createDataService(templInfo) {
			const dsName = self.getDataServiceName();

			var srv = instances[dsName];
			if(_.isNil(srv)) {
				srv = self.doCreateDataService(dsName, templInfo);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName() {
			return 'timekeepingRecordingReportForEmployeeAndPeriodDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo) {
			var timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: dsName,
					entityNameTranslationID: 'logistic.dispatching.dispatchingHeader',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'forreservation', usePostForRead: true,
						initReadData: function (readData) {
							readData.Id = resourceEnterprisePlanningBoardReservationService.getSelected().Id;
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
							itemName: 'DispatchHeader',
							parentService: resourceEnterprisePlanningBoardReservationService } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceOption);

			return serviceContainer.service;
		};
	}
})(angular);
