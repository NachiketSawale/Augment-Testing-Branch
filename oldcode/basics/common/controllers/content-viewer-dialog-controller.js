(function () {

	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc controller
	 * @name basicsCommonContentDialogController
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('basicsCommonContentDialogController',
		['$scope',
			'basicsCommonContentViewerDialogService', 'globals',

			function ($scope, dialogService, globals) {

				$scope.path = globals.appBaseUrl;

				$scope.content = dialogService.getContent();

				const init = function () {
				};
				init();

			}
		]);
})();