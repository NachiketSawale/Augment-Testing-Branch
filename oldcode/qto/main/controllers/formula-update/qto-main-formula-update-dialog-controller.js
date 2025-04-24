/**
 * Created by lnt on 12/27/2018.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'qto.main';
	/**
	 * @ngdoc controller
	 * @name qtoMainFormulaUpdateDialogController
	 * @requires $scope
	 * @description
	 * #
	 * qtoMainFormulaUpdateDialogController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('qtoMainFormulaUpdateDialogController', [
		'$scope', '$translate', '$timeout', '$injector', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
		'qtoMainFormulaUpdateDialogService', 'platformModalService', 'qtoMainUIStandardService', 'qtoMainDetailGridValidationService',
		function ($scope, $translate, $timeout, $injector, platformGridAPI, dialogGridControllerService,
			qtoMainFormulaUpdateDialogService, platformModalService, qtoMainUIStandardService, qtoMainDetailGridValidationService) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.items = $scope.options.items;
			$scope.isOkDisabled = false; // the ok button

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			$scope.modalOptions.ok = function onOK() {
				var isError = isHasError();
				if(isError){ // show the warning
					platformModalService.showMsgBox('qto.main.updateFormula.warning', 'qto.main.updateFormula.warningTitle', 'info');
				}
				else {
					$scope.$close({ok: true});
				}
			};

			$scope.modalOptions.cancel = function onCancel() {
				$scope.$close({ok: false});
			};

			// to check the validation
			function isHasError(){
				var isError = false;
				var itemList = qtoMainFormulaUpdateDialogService.dataService.getList();
				for(var i=0; itemList.length>i; i++) {
					var errorItem = _.filter(itemList[i].__rt$data.errors, function (error) {
						if(error){
							return true;
						}
					});

					if(errorItem.length > 0){
						isError = true;
						break;
					}
				}
				return isError;
			}

			var gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: $scope.options.uuid
			};

			dialogGridControllerService.initListController($scope, qtoMainUIStandardService, qtoMainFormulaUpdateDialogService.dataService, qtoMainDetailGridValidationService, gridConfig);

			$timeout(function () {
				platformGridAPI.grids.resize($scope.options.uuid);
				qtoMainFormulaUpdateDialogService.dataService.setList($scope.items); // set the grid list
			});

			// Intervals created by this service must be explicitly destroyed when you are finished with them
			$scope.$on('$destroy', function () {
			});
		}
	]);
})(angular);