(function () {

	'use strict';
	var moduleName = 'logistic.job';

	angular.module(moduleName).controller('logisticJobAddressBlobController', ['$scope', 'platformFileUtilControllerFactory', 'logisticJobDataService', 'logisticJobAddressBlobService',
		function ($scope, platformFileUtilControllerFactory, logisticJobDataService, logisticJobAddressBlobService) {
			platformFileUtilControllerFactory.initFileController($scope, logisticJobDataService, logisticJobAddressBlobService);
		}
	]);
})();