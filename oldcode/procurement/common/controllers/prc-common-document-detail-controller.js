/**
 * Created by lvy on 11/6/2017.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonDocumentDetailController', [
		'$scope',
		'$translate',
		'$window',
		'procurementCommonDocumentUIStandardService',
		'procurementCommonDocumentCoreDataService',
		'platformDetailControllerService',
		'platformTranslateService',
		'procurementCommonDocumentValidationService',
		'procurementContextService',
		'basicsCommonUploadDownloadControllerService', '$injector',
		function (
			$scope,
			$translate,
			$window,
			formConfiguration,
			dataServiceFactory,
			detailControllerService,
			translateService,
			validationService,
			moduleContext,
			basicsCommonUploadDownloadControllerService, $injector) {

			// when container Document does not belong to current module, it uses parentService to get dataService.
			var mainServiceName = $scope.getContentValue('parentService');
			var mainService =  mainServiceName ? $injector.get(mainServiceName): null;
			var dataService = dataServiceFactory.getService( mainService || moduleContext.getMainService());
			// var dataService = dataServiceFactory.getService(moduleContext.getMainService());
			validationService = validationService(dataService);

			detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

			basicsCommonUploadDownloadControllerService.initDetail($scope, dataService);
		}]);
})(angular);
