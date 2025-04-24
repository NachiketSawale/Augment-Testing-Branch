
/**
	 * Created by mohit on 16.06.2022
	 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.timesymbols';

	/**
		 * @ngdoc controller
		 * @name TimekeepingTimeSymbolsGroupDetailController
		 * @function
		 *
		 * @description
		 * Controller for the detail view of timekeeping time symbol account entities.
		 **/
	angular.module(moduleName).controller('timekeepingTimeSymbols2GroupDetailController', TimekeepingTimeSymbols2GroupDetailController);

	TimekeepingTimeSymbols2GroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeSymbols2GroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '609d6bbd14914574b5e8e173548a2bde', 'timekeepingTimeSymbolsTranslationService');
	}

})(angular);
