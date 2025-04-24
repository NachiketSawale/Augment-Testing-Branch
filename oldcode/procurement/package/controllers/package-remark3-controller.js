/**
 * Created by wwa on 8/19/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageRemark3Controller', ['$scope', 'platformLongtextFormControllerFactory', 'procurementPackageTranslationService',

		function ($scope, longTextControllerFactory, procurementPackageTranslationService) {
			longTextControllerFactory.initTextController($scope, procurementPackageTranslationService, moduleName);
		}
	]);
})(angular);