(function (angular) {

	'use strict';


	angular.module('basics.dependentdata').controller('basicsDependentDataChartDetailController', ['$scope', 'basicsDependentDataChartService', 'platformDetailControllerService','basicsDependentDataChartValidationService', 'basicsDependentDataChartUIService', 'basicsDependentDataTranslationService',

		function ($scope, basicsDependentDataChartService, platformDetailControllerService,basicsDependentDataChartValidationService, basicsDependentDataChartUIService, basicsDependentDataTranslationService) {

			platformDetailControllerService.initDetailController($scope, basicsDependentDataChartService,  basicsDependentDataChartValidationService(basicsDependentDataChartService), basicsDependentDataChartUIService, basicsDependentDataTranslationService);

		}
	]);
})(angular);