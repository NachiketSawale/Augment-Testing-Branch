/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonSmartCanvas',
		basicsCommonSmartCanvas);

	basicsCommonSmartCanvas.$inject = ['basicsCommonSmartCanvasService'];

	function basicsCommonSmartCanvas(basicsCommonSmartCanvasService) {

		function linkBasicsCommonSmartCanvas($scope, elem) {
			const mgr = new basicsCommonSmartCanvasService.SmartCanvasManager(elem[0]);

			$scope.setManager({
				scMgr: mgr
			});
		}

		return {
			restrict: 'A',
			scope: {
				setManager: '&'
			},
			link: linkBasicsCommonSmartCanvas
		};
	}

})(angular);
