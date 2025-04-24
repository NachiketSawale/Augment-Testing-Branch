/**
 * Created by Shankar on 13.02.2024.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyLetterHeadController', ['$scope', 'basicsCompanyLetterHeadService', 'basicsCompanyMainService', 'platformFileUtilControllerFactory',
		function ($scope, basicsCompanyLetterHeadService, basicsCompanyMainService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, basicsCompanyMainService, basicsCompanyLetterHeadService);
		}
	]);
})();