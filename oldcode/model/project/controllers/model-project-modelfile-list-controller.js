/**
 * Created by leo on 19.11.2015.
 */
(function () {

	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectModelFileListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the model files
	 **/
	angular.module(moduleName).controller('modelProjectModelFileListController', ModelProjectModelFileListController);

	ModelProjectModelFileListController.$inject = ['$scope','platformContainerControllerService', 'modelProjectModelFileDataService'];
	function ModelProjectModelFileListController($scope, platformContainerControllerService, modelProjectModelFileDataService) {
		platformContainerControllerService.initController($scope, moduleName, '903fffcab05b40c3b0025f510e17bcba');

		$scope.$on('$destroy', function () {
			modelProjectModelFileDataService.unregisterAll();
		});
	}
})();
