(function () {

	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonBizPartnerContactController', BizPartnerContactController);

	BizPartnerContactController.$inject = ['$scope', 'platformContainerControllerService'];
	function BizPartnerContactController($scope, platformContainerControllerService) {

		var guid = $scope.getContentValue('uuid');
		var cModuleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, cModuleName, guid);
	}
})();