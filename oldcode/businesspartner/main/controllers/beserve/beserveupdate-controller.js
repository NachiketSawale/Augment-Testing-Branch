/**
 *
 *
 @ngdoc controller
 * @name cloudSettingsDialogController
 * @function
 *
 * @description
 * Controller for the Document Properties Structure Details view.
 */
/* jshint -W072 */ // many parameters because of dependency injection
angular.module('businesspartner.main').controller('businesspartnerMainBeserveUpdateController', businesspartnerMainBeserveUpdateController);

businesspartnerMainBeserveUpdateController.$inject =
	['_', '$scope', '$modalInstance', 'platformGridAPI', 'platformTranslateService', '$translate',
		'businesspartnerMainBeserveService', 'businesspartnerMainBeserveUpdateGridCfg', 'selectedItemsParam'];

function businesspartnerMainBeserveUpdateController(_, $scope, $modalInstance, platformGridAPI, platformTranslateService, $translate,
	crefoService, businesspartnerMainBeserveUpdateGridCfg, selectedItemsParam) {// jshint ignore:line
	'use strict';

	function setLoadingCallback(flag) {
		$scope.crefoOption.loading = flag;
	}

	/**
	 *
	 */
	function onOk() {

		const selectedItems = getSelectedItems();
		crefoService.bedirectUpdateSelectedItems(selectedItems, setLoadingCallback).then(function (result) {
			if (result === false) {
				$modalInstance.close({ok: false});
			}
			$modalInstance.close({ok: true, updatedItems: result});
		});

	}

	function onCancel() {
		crefoService.resetService();
		$modalInstance.dismiss({ok: false});
	}

	function onCanApply() {
		return hasSelectedItems();
	}

	$scope.crefoOption = {
		loading: false,
		noresult: true,
		syncrunning: $translate.instant('businesspartner.main.crefoupdatedlg.syncrunning'),
		idle: $translate.instant('businesspartner.main.crefoupdatedlg.idle'),

		onOk: onOk,
		onCancel: onCancel,
		canApply: onCanApply
	};

	$scope.modalOptions = {
		headerText: $translate.instant('businesspartner.main.crefoupdatedlg.title'),
		cancel: onCancel
	};

	function hasSelectedItems() {
		if (!_.isArray($scope.data) || $scope.data.length === 0) {
			return false;
		}
		const found = _.find($scope.data, function (item) {
			if (item.update) {
				return true;
			}
		});
		return !!found;
	}

	function getSelectedItems() {
		if (!_.isArray($scope.data) || $scope.data.length === 0) {
			return null;
		}

		let selectedItems = _.filter($scope.data, function (item) {
			return item.update;
		});
		return (selectedItems.length > 0) ? selectedItems : null;
	}

	/**
	 *
	 */
	function setupResultGrid() {

		$scope.data = [];
		if (selectedItemsParam) {
			$scope.crefoOption.noresult = false;
			_.forEach(selectedItemsParam, function (item) {
				// console.log('selected Item ', item);
				$scope.data.push(
					{
						id: item.Id, update: false, name: item.BusinessPartnerName1, bedirectno: item.BedirektNo,
						crefono: item.CrefoNo,
						address: item.SubsidiaryDescriptor?.AddressDto?.AddressLine
					});
			});
		}

		$scope.gridId = 'BF8D287F-4774-4A53-88A7-BAB0B449A8B7';
		$scope.gridData = {
			state: $scope.gridId
		};

		let columns = businesspartnerMainBeserveUpdateGridCfg; // UIStandardService.getStandardConfigForListView().columns;
		if (!columns.isTranslated) {
			platformTranslateService.translateGridConfig(columns);
			columns.isTranslated = true;
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			let grid = {
				columns: angular.copy(columns),
				data: $scope.data,
				id: $scope.gridId,
				lazyInit: true,
				options: {
					tree: false, indicator: false, idProperty: 'id'
				}
			};
			platformGridAPI.grids.config(grid);
		} else {
			platformGridAPI.columns.configuration($scope.gridId, angular.copy(columns));
		}

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
		});
	}

	setupResultGrid();
	// un-register on destroy
	$scope.$on('$destroy', function () {
	});
}
