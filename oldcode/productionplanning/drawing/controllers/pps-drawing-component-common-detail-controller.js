/**
 * Created by zwz on 5/15/2019.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingComponentCommonDetailController', DetailController);

	DetailController.$inject = ['$injector', '$scope',
		'platformDetailControllerService',
		'productionplanningDrawingTranslationService',
		'productionplanningDrawingComponentUIStandardService',
		'productionplanningDrawingComponentDataService',
		'productionplanningDrawingComponentValidationService'];

	function DetailController($injector, $scope,
							  platformDetailControllerService,
							  translationServ,
							  uiStandardServiceFactory,
							  dataServiceFactory,
							  validationServiceFactory) {

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataServ = dataServiceFactory.getService(serviceOptions);

		platformDetailControllerService.initDetailController($scope, dataServ, validationServiceFactory.getService(dataServ), uiStandardServiceFactory.getService(dataServ), translationServ);
	}

})();