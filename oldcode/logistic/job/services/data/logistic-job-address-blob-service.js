/**
 * Created by baf on 2108/09/18.
 */
(function () {
	'use strict';
	var module = 'logistic.job';

	angular.module(module).factory('logisticJobAddressBlobService', ['globals', 'platformFileUtilServiceFactory', 'logisticJobDataService',

		function (globals, platformFileUtilServiceFactory, logisticJobDataService) {
			var config = {
				deleteUrl: globals.webApiBaseUrl + 'logistic/job/addressblob/delete',
				importUrl: globals.webApiBaseUrl + 'logistic/job/addressblob/create',
				getUrl: globals.webApiBaseUrl + 'logistic/job/addressblob/export',
				fileFkName: 'DeliveryAddressBlobFk',
				dtoName: 'EntityDto'
			};
			return platformFileUtilServiceFactory.getFileService(config, logisticJobDataService);
		}]);
})(angular);
