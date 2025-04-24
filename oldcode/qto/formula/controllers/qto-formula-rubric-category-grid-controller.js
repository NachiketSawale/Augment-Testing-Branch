(function (angular) {
	'use strict';
	angular.module('qto.formula').value('qtoFormulaRubricCategoryGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name$tr$: 'qto.formula.rubric.description',
						formatter:'code',
						width: 180
					}
				]
			};
		}
	});
	angular.module('qto.formula').controller('qtoFormulaRubricCategoryGridController',
		['_', '$scope', 'platformGridControllerService', 'qtoFormulaRubricCategoryGridColumns', 'qtoFormulaRubricCategoryDataService', 'platformToolbarService',
			function (_, $scope, gridControllerService, gridColumns, dataService,platformToolbarService) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};
				dataService.deleteItem = false;
				dataService.createItem = false;

				gridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

				var containeruuid = $scope.getContainerUUID();

				var toolItems = _.filter(platformToolbarService.getTools(containeruuid), function (item) {
					return item && item.id !== 'create' && item.id !== 'delete' && item.id !== 'createChild';
				});
				platformToolbarService.removeTools(containeruuid);
				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolItems
				});

			}]);
})(angular);