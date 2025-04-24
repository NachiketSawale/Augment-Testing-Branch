(function () {

	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonBizPartnerContactDetailController', BizPartnerContactDetailController);

	BizPartnerContactDetailController.$inject = ['$scope', 'platformContainerControllerService'];
	function BizPartnerContactDetailController($scope, platformContainerControllerService) {

		var guid = $scope.getContentValue('uuid');
		var cModuleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, cModuleName, guid);

	}

})();