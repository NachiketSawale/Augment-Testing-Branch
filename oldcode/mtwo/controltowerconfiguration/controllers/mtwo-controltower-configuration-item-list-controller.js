/**
 * Created by hae on 2018-07-02.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name mtwo.mtwoControlTowerConfigurationItemListController
	 * @require $scoep
	 * @description mtwoControlTowerConfigurationItemListController controller for mtwo ControlTowerconfiguration item list controller
	 *
	 */
	var moduleName = 'mtwo.controltowerconfiguration';

	angular.module(moduleName).controller('mtwoControlTowerConfigurationItemListController', MtwoControlTowerConfigurationItemListController);

	MtwoControlTowerConfigurationItemListController.$inject = [
		'$scope',
		'_',
		'platformGridControllerService',
		'mtwoControlTowerConfigurationItemService',
		'mtwoControlTowerConfigurationItemConfigurationService',
		'mtwoControlTowerConfigurationValidationService'];

	function MtwoControlTowerConfigurationItemListController(
		$scope,
		_,
		platformGridControllerService,
		mtwoControlTowerConfigurationItemService,
		mtwoControlTowerConfigurationItemConfigurationService,
		mtwoControlTowerConfigurationValidationService) {

		var myGridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'groupid',
			childProp: 'ChildItems',
			cellChangeCallBack: function (arg) {
				mtwoControlTowerConfigurationItemService.markItemAsModified(arg.item);
			}
		};

		var colDef = {
			id: 'IsLive',
			field: 'IsLive',
			name$tr$: 'mtwo.controltowerconfiguration.IsLive',
			formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
				var html = '';

				if (value === true) {
					html = '<input type="checkbox" checked/>';
				} else if (value === 'unknown') {
					setTimeout(function () {
						angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
					});

					html = '<input type="checkbox"/>';
				} else {
					html = '<input type="checkbox" unchecked/>';
				}

				return '<div class="text-center">' + html + '</div>';
			},
			editor: 'directive',
			editorOptions: {
				directive: 'mtwo-controltower-item-checkbox'
			},
			width: 50,
			isTransient: true,
			validator: 'isLiveChanged'
		};

		$scope.isLiveChanged = mtwoControlTowerConfigurationItemService.isLiveChanged;
		var currentColumns = angular.copy(mtwoControlTowerConfigurationItemConfigurationService.getStandardConfigForListView().columns);
		currentColumns.unshift(colDef);
		var newColumns = {
			getStandardConfigForListView: function () {
				return {columns: currentColumns};
			}
		};
		platformGridControllerService.initListController($scope, newColumns, mtwoControlTowerConfigurationItemService, mtwoControlTowerConfigurationValidationService, myGridConfig);

		var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'create';
		});

		$scope.tools.items.splice(createBtnIdx, 1);

		var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'delete';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'createChild';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't14';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

	}
})(angular);
