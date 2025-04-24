/* globals angular , _ */
(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).controller('productionplanningEngineeringProductDescriptionListController', ListController);

	ListController.$inject = ['$scope', 'platformGridAPI', 'platformGridControllerService', 'productionplanningEngineeringProductDescriptionDataService',
		'productionplanningProducttemplateProductDescriptionUIStandardService', 'basicsCommonReferenceControllerService'];

	function ListController($scope, platformGridAPI, gridControllerService, dataService, uiStandardService, referenceControllerService) {
		var gridConfig = {};
		gridControllerService.initListController($scope, uiStandardService, dataService, null, gridConfig);

		//remove create delete button
		var removeItems = ['create', 'delete'];
		$scope.tools.items = _.filter($scope.tools.items, function (item) {
			return item && removeItems.indexOf(item.id) === -1;
		});

		referenceControllerService.extendReferenceButtons($scope, dataService);

		dataService.parentService().registerItemModified(updateButtons);
		function updateButtons() {
			if ($scope.tools) {
				$scope.tools.update();
			}
		}

		dataService.registerEntityCreated(onEntityCreatedOrDeleted);
		dataService.registerEntityDeleted(onEntityCreatedOrDeleted);
		function onEntityCreatedOrDeleted() {
			dataService.parentService().ProcessEntityEngDrawingFk(dataService.getList());
		}

		dataService.registerReferenceDeleted(function (e, deletingItems) {
			var ids = _.map(deletingItems, 'Id');
			var itemList = _.filter(dataService.getList(),function (p) {
				return !_.includes(ids, p.Id);
			});
			dataService.parentService().ProcessEntityEngDrawingFk(itemList);
		});

		//set readonly
		var setCellEditable = function () {
			return false;
		};
		platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
			dataService.parentService().unregisterItemModified(updateButtons);
			dataService.unregisterEntityCreated(onEntityCreatedOrDeleted);
			dataService.unregisterEntityDeleted(onEntityCreatedOrDeleted);
		});
	}

})(angular);