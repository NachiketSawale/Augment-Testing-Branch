(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstance2ObjectParamDetailController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance2ObjectParam form.
	 */
	angular.module(moduleName).controller('constructionSystemMainInstance2ObjectParamDetailController', [
		'$scope', 'platformDetailControllerService', 'constructionSystemMainInstance2ObjectParamUIConfigService',
		'constructionSystemMainInstance2ObjectParamService', 'platformTranslateService',
		function ($scope, platformDetailControllerService, uiConfigService, dataService, translateService) {

			// special case: the 'addition' columns in form config will not be translated when use 'constructionsystemMainTranslationService'.
			// see: detail-controller-service.js line 35
			platformDetailControllerService.initDetailController($scope, dataService, {}, uiConfigService, translateService);
		}
	]);
})(angular);
