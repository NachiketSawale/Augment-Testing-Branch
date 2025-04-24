(function config(angular) {

	'use strict';

	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc controller
	 * @name basicsAssetMasterDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of asset master entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsAssetMasterDetailController', ['$scope', 'platformDetailControllerService', 'basicsAssetMasterService', 'basicsAssetMasterValidationService', 'basicsAssetMasterStandardConfigurationService', 'platformTranslateService',

		function basicsAssetMasterDetailController($scope, platformDetailControllerService, dataService, validationService, formConfiguration, platformTranslateService) {

			platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, platformTranslateService);

		}
	]);
})(angular);