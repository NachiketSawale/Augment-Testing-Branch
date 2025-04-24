/**
 * Created by wuj on 9/9/2014.
 */
(function (angular) {
	'use strict';
	/* jshint -W072*/ //many parameters because of dependency injection

	angular.module('basics.material').controller('basicsMaterialRecordFormController',
		['$scope', 'basicsMaterialRecordUIConfigurationService', 'basicsMaterialRecordService',
			'platformDetailControllerService', 'basicsMaterialTranslationService', 'basicsMaterialRecordValidationService',

			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);