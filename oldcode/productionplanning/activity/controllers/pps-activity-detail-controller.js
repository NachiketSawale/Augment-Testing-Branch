/**
 * Created by anl on 2/5/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityActivityDetailController', ActivityDetailController);

	ActivityDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningActivityTranslationService',
		'productionplanningActivityActivityDataService'];

	function ActivityDetailController($scope, platformContainerControllerService,
									  translationService,
									  dataService) {
		platformContainerControllerService.initController($scope, moduleName, '3f4268ef496c4878ac95b92e9cce4220', translationService);

		dataService.registerFilter();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dataService.unregisterFilter();
		});
	}
})(angular);