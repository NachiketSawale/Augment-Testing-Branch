(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstance2ObjectParamListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance2objectparam grid.
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainInstance2ObjectParamListController', [
		'$scope', 'platformGridControllerService', 'constructionSystemMainInstance2ObjectParamUIConfigService',
		'constructionSystemMainInstance2ObjectParamService','constructionSystemCommonObjectParamValidationService',
		'constructionSystemMasterParameterValidationHelperService', '$injector',
		function ($scope, platformGridControllerService, uiConfigService, dataService,validationService, cosParameterValidationHelperService, $injector) {

			var parentService = $injector.get('constructionSystemMainInstance2ObjectService');
			platformGridControllerService.initListController($scope, uiConfigService, dataService, validationService(dataService, parentService), {useFilter: true});
			var removeItems = ['create'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});
			dataService.performScriptValidation.register(validationService(dataService, parentService).validator);
			cosParameterValidationHelperService.validationInfoChanged.register(dataService.onValidationInfoChanged);
			$scope.$on('$destroy', function () {
				dataService.performScriptValidation.unregister(validationService(dataService, parentService).validator);
				cosParameterValidationHelperService.validationInfoChanged.unregister(dataService.onValidationInfoChanged);
			});
		}
	]);
})(angular);