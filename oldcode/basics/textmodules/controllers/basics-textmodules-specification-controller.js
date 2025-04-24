/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).controller('basicsTextModulesSpecificationController', basicsTextModulesSpecificationController);

	basicsTextModulesSpecificationController.$inject = ['$scope', 'basicsTextModulesTextDataService', 'basicsTextModulesTextControllerService',
		'basicsCommonTextFormatConstant'];

	function basicsTextModulesSpecificationController($scope, dataService, controllerService,
		basicsCommonTextFormatConstant) {

		// grid controller service.
		let uuid = '9956e9691f12498faee16f94cce34e86'; //
		$scope.contentField = 'TextBlob';
		$scope.isVariableVisible = true;
		$scope.textFormatType = basicsCommonTextFormatConstant.specification;
		$scope.showTableBtn = true;
		// init $scope.
		controllerService.initController($scope, dataService, uuid);
	}

})(angular);