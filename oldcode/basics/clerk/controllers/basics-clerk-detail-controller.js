(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of clerk entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsClerkDetailController', BasicsClerkDetailController);

	BasicsClerkDetailController.$inject = ['$scope', 'platformContainerControllerService','basicsClerkMainService'];

	function BasicsClerkDetailController($scope, platformContainerControllerService, basicsClerkMainService) {
		platformContainerControllerService.initController($scope, moduleName, '8B10861EA9564D60BA1A86BE7E7DA568', 'basicsClerkTranslationService');
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			sort: 1,
			items: [
				{
					id: 'ac',
					caption: 'basics.clerk.copyClerkGroupTitle',
					type: 'item',
					iconClass: 'tlb-icons ico-copy-group',
					fn: basicsClerkMainService.copyClerkGroup,
				}
			]
		});
	}
})(angular);