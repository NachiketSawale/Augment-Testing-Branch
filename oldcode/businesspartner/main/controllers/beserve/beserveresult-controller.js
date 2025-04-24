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
angular.module('businesspartner.main').controller('businesspartnerMainBeserveResultController', businesspartnerMainBeserveResultController);

businesspartnerMainBeserveResultController.$inject =
	['$scope', '$translate', '$modalInstance', 'platformGridAPI', 'platformTranslateService', 'businesspartnerMainBeserveService',
		'businesspartnerMainBeserveResultGridCfg', 'updatedItemsParam','_'];

function businesspartnerMainBeserveResultController($scope, $translate, $modalInstance, platformGridAPI, platformTranslateService,
	crefoService, businesspartnerMainBeserveResultGridCfg, updatedItemsParam,_) {

	'use strict';
	$scope.crefoOption = {
		// loading: false,
		noresult: true,
		// idle: $translate.instant('businesspartner.main.crefoResultdlg.idle'),
		onOk: function onOk() {
			if (_.isArray(updatedItemsParam) && updatedItemsParam.length > 0) {
				crefoService.askNavigateToBizPartnersDialog(updatedItemsParam);
			}
			$modalInstance.close({ok: true});
		}
	};

	$scope.modalOptions = {
		headerText: $translate.instant('businesspartner.main.creforesultdlg.title'),
		cancel: function () {
			$modalInstance.close({ok: false});
		}
	};

	/**
	 *
	 */
	function setupResultGrid() {

		$scope.gridId = 'BF8D287F-4774-4A53-88A7-BAB0B449A8B8';
		$scope.gridData = {
			state: $scope.gridId
		};

		let columns = businesspartnerMainBeserveResultGridCfg; // UIStandardService.getStandardConfigForListView().columns;
		if (!columns.isTranslated) {
			platformTranslateService.translateGridConfig(columns);
			columns.isTranslated = true;
		}

		$scope.data = [];

		if (updatedItemsParam) {
			$scope.crefoOption.noresult = false;
			_.forEach(updatedItemsParam, function (item) {
				// console.log('selected Item ', item);
				/** @namespace item.newname */
				/** @namespace item.newphone */
				/** @namespace item.beserveupdatestatus */
				$scope.data.push({
					id: item.bpid,
					resulttype: item.beserveupdatestatus,
					name: item.newname,
					address: item.newaddress,
					phone: item.newphone,
					fax: item.newfax,
					updateinfo: item.updateinfo
				});
			});
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			let grid = {
				columns: angular.copy(columns), data: $scope.data, id: $scope.gridId, lazyInit: true,
				options: {tree: false, indicator: false, idProperty: 'id'}
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

}
