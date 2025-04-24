/**
 * Created by baf on 30.05.2016.
 */
(function () {

	'use strict';
	const moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationTranslationListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of translation entities
	 **/
	angular.module(moduleName).controller('cloudTranslationTranslationListController', CloudTranslationTranslationListController);

	CloudTranslationTranslationListController.$inject = ['$scope', '$rootScope', 'platformContainerControllerService', 'cloudTranslationTranslationDataService'];

	function CloudTranslationTranslationListController($scope, $rootScope, platformContainerControllerService, cloudTranslationTranslationDataService) {
		platformContainerControllerService.initController($scope, moduleName, '13ff9d4cc7e149ca8965c702870639c2');

		$rootScope.$on('resourceUpdateDone', function () {
			cloudTranslationTranslationDataService.read(function () {
				cloudTranslationTranslationDataService.gridRefresh();
			});
		});
	}
})();