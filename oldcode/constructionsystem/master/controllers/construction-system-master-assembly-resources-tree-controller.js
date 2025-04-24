(function () {

	'use strict';
	var moduleName = 'constructionsystem.master';


	angular.module(moduleName).controller('constructionSystemMasterAssembliesResourceTreeController', ConstructionSystemMasterAssembliesResourceTreeController);

	ConstructionSystemMasterAssembliesResourceTreeController.$inject = ['$scope','platformContainerControllerService'];
	function ConstructionSystemMasterAssembliesResourceTreeController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '574b34f0674d450ca9c696d9bd5c4ea7');
	}
})();
