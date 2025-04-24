(function (angular) {
	'use strict';

	var moduleName = 'logistic.job';
	var jobModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name logisticJobCardDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	jobModule.service('logisticJobCardDataServiceFactory', LogisticJobCardDataServiceFactory);

	LogisticJobCardDataServiceFactory.$inject = ['platformDynamicDataServiceFactory', 'logisticJobDataService'];

	function LogisticJobCardDataServiceFactory(platformDynamicDataServiceFactory, logisticJobDataService) {
		var instances = {};

		this.createDataService = function createDataService(templInfo) {
			var moduleInfo = {
				instance: jobModule,
				name: 'Logistic.Job',
				postFix: 'CardDataService',
				translationKey: 'logistic.job.card',
				readEndPoint: 'getbyjob',
				parentService: logisticJobDataService,
				filterName: 'job',
				itemName: 'JobCardOfJob'
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
