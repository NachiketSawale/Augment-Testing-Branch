(function () {

	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonBizPartnerController', BizPartnerController);

	BizPartnerController.$inject = ['$scope', 'platformContainerControllerService'];
	function BizPartnerController($scope, platformContainerControllerService) {

		var guid = $scope.getContentValue('uuid');
		var cModuleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, cModuleName, guid);

	}

})();