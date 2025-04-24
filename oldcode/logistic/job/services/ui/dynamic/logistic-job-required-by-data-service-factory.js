/**
 * Created by nit on 21.12.2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'logistic.job';
	var jobModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name logisticJobRequiredByDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	jobModule.service('logisticJobRequiredByDataServiceFactory', LogisticJobRequiredByDataServiceFactory);

	LogisticJobRequiredByDataServiceFactory.$inject = ['platformDynamicDataServiceFactory', 'logisticJobDataService'];

	function LogisticJobRequiredByDataServiceFactory(platformDynamicDataServiceFactory, logisticJobDataService) {
		var instances = {};

		this.createDataService = function createDataService(templInfo) {
			var moduleInfo = {
				instance: jobModule,
				name: 'Logistic.Job',
				postFix: 'RequiredByDataService',
				translationKey: 'logistic.job.requiredBy',
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
