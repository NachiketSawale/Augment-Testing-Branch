/**
 * Created by leo on 15.02.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.timesymbols';

	/**
	 * @ngdoc controller
	 * @name TimekeepingTimeSymbolsAccountDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping time symbol account entities.
	 **/
	angular.module(moduleName).controller('timekeepingTimeSymbolsAccountDetailController', TimekeepingTimeSymbolsAccountDetailController);

	TimekeepingTimeSymbolsAccountDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeSymbolsAccountDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '24979528559e40cf9cfcd22d9e7cc393', 'timekeepingTimeSymbolsTranslationService');
	}

})(angular);
