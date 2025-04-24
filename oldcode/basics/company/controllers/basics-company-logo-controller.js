/**
 * Created by balkanci on 19.05.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyLogoController', ['$scope', 'basicsCompanyLogoService', 'basicsCompanyMainService', 'platformFileUtilControllerFactory',
		function ($scope, basicsCompanyLogoService, basicsCompanyMainService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, basicsCompanyMainService, basicsCompanyLogoService);
		}
	]);
})();