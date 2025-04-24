/**
 * Created by alm on 6/22/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	angular.module(moduleName).controller('controllingRevenueRecognitionRemarkController', ['$scope', '$timeout', 'platformLongtextFormControllerFactory', 'controllingRevenueRecognitionTranslationService',
		function ($scope, $timeout, longTextControllerFactory, controllingRevenueRecognitionTranslationService) {
			longTextControllerFactory.initTextController($scope, controllingRevenueRecognitionTranslationService, moduleName);
		}
	]);
})(angular);
