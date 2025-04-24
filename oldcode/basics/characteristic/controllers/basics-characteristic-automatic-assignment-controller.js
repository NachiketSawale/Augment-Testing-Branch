(function (angular) {

	'use strict';

	const moduleName = 'basics.characteristic';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicAutomaticAssignmentController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Automatic Assignment.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCharacteristicAutomaticAssignmentController',
		['$scope', 'platformGridAPI', 'basicsCharacteristicAutomaticAssignmentService', 'platformGridControllerService', 'basicsCharacteristicAutomaticAssignmentUIStandardService', '_',
			function ($scope, platformGridAPI, dataService, platformGridControllerService, basicsCharacteristicAutomaticAssignmentUIStandardService, _) {

				const myGridConfig = {
					initCalled: false,
					columns: [],
					addValidationAutomatically: false
				};

				platformGridControllerService.initListController($scope, basicsCharacteristicAutomaticAssignmentUIStandardService, dataService, '', myGridConfig);

				const removeItems = ['create', 'delete', 'createChild'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});
			}
		]);
})(angular);
