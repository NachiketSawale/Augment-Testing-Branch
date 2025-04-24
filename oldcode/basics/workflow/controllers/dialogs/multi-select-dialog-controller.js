/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	angular.module(moduleName).controller('basicsWorkflowMultiSelectDialogController',
		['_', '$scope', '$rootScope', '$translate', 'multiSelectAction',
			function (_, $scope, $rootScope, $translate, multiSelectAction) {

				$scope.$on('$destroy', function () {
					multiSelectAction.clearItems();
				});
			}]
	);
})(angular);



