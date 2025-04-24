(function (angular) {

	'use strict';

	let moduleName = 'estimate.main';
	/**
 * @ngdoc controller
 * @name estimateMainCopyTenderPriceDialogController
 * @requires $scope
 * @description
 * #
 * estimateMainCopyTenderPriceDialogController
 */
	/* jshint -W072 */
	angular.module(moduleName).controller('estimateMainCopyTenderPriceDialogController', [
		'$scope', '$translate',
		function ($scope, $translate) {

			$scope.currentItem = {
				copyTenderPriceToBoqItem : true,
				copyAQQuantityToBoqItem : true,
				copyTenderPriceToLineItem : true,
				notCheckFixedPriceFlag : true
			};

			$scope.copyTenderPriceToBoqItemChange = function(){
				if(!$scope.currentItem.copyTenderPriceToBoqItem){
					$scope.currentItem.copyAQQuantityToBoqItem = false;
				}
			};
			$scope.copyTenderPriceToLineItemChange = function(){
				if(!$scope.currentItem.copyTenderPriceToLineItem){
					$scope.currentItem.notCheckFixedPriceFlag = false;
				}
			};

			$scope.modalOptions = {
				headerText: $translate.instant('estimate.main.copyTenderPrice'),
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.$close({isOk: true, data : $scope.currentItem});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close({isOk: false});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})(angular);