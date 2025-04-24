(function (angular) {

	'use strict';


	angular.module('basics.dependentdata').controller('basicsDependentDataChartSeriesDetailController', ['$scope', 'basicsDependentDataChartSeriesService', 'platformDetailControllerService', 'basicsDependentDataChartSeriesUIService', 'basicsDependentDataTranslationService',

		function ($scope, basicsDependentDataChartSeriesService, platformDetailControllerService, basicsDependentDataChartSeriesUIService, basicsDependentDataTranslationService) {

			platformDetailControllerService.initDetailController($scope, basicsDependentDataChartSeriesService, null, basicsDependentDataChartSeriesUIService, basicsDependentDataTranslationService);

		}
	]);
})(angular);