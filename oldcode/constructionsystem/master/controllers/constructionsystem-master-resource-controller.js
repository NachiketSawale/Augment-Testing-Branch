/**
 * Created by wui on 12/29/2015.
 */
/* global _ */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionsystemMasterResourceController', ['$scope', '$injector',
		'platformGridControllerService',
		'estimateMainResourceConfigurationService',
		'platformGridAPI',
		'constructionSystemMasterResourceValidationService',
		function (
			$scope,
			$injector,
			platformGridControllerService,
			estimateMainResourceConfigurationService,
			platformGridAPI,
			constructionSystemMasterResourceValidationService) {

			var gridConfig = {
				parentProp: 'EstResourceFk',
				childProp: 'EstResources',
				childSort: true,
				type: 'resources'
			};

			var dataServiceName = $scope.getContentValue('dataService');
			var dataService = $injector.get(dataServiceName);

			platformGridControllerService.initListController($scope,
				estimateMainResourceConfigurationService,
				dataService, constructionSystemMasterResourceValidationService, gridConfig);

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

			// remove create and delete buttons.
			_.remove($scope.tools.items, function(item) {
				return item.id === 'create' || item.id === 'delete' || item.id === 'createChild';
			});

			$scope.$on('$destroy', function(){
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
			});

			function onBeforeEditCell() {
				return false;
			}

		}
	]);

})(angular);