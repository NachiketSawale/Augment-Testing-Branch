/**
 * Created by henkel on 30.11.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	angular.module(moduleName).controller('basicsCustomizeRemarkController', ['$scope', 'platformLongtextFormControllerFactory', 'basicCustomizeTranslationService',

		function ($scope, longTextControllerFactory, basicCustomizeTranslationService) {

			longTextControllerFactory.initTextController($scope, basicCustomizeTranslationService, moduleName);
		}
	]);
})(angular);