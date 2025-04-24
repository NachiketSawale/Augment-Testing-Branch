/**
 * Created by nit on 21.12.2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'logistic.job';
	var jobModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name logisticJobReservedForDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	jobModule.service('logisticJobReservedForDataServiceFactory', LogisticJobReservedForDataServiceFactory);

	LogisticJobReservedForDataServiceFactory.$inject = ['platformDynamicDataServiceFactory', 'logisticJobDataService'];

	function LogisticJobReservedForDataServiceFactory(platformDynamicDataServiceFactory, logisticJobDataService) {
		var instances = {};

		this.createDataService = function createDataService(templInfo) {
			var moduleInfo = {
				instance: jobModule,
				name: 'Logistic.Job',
				postFix: 'ReservedForDataService',
				translationKey: 'logistic.job.reservedFor',
				readEndPoint: 'byJob',
				parentService: logisticJobDataService,
				filterName: 'job',
				itemName: 'RequisitionOfJob'
			};

			var dsName = platformDynamicDataServiceFactory.getDataServiceName(templInfo, moduleInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = platformDynamicDataServiceFactory.createDataService(templInfo, moduleInfo);
				instances[dsName] = srv;
			}

			return srv;
		};
	}
})(angular);
