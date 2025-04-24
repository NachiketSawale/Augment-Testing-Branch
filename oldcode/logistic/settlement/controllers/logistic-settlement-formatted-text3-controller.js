/**
 * Created by henkel
 */

/*global angular */
(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name logisticSettlementFormattedText3Controller
	 * @function
	 * @description
	 * Controller for the formatted text view.
	 */
	angular.module('logistic.settlement').controller('logisticSettlementFormattedText3Controller', ['$scope', 'logisticSettlementFormattedText3DataService', 'logisticSettlementDataService',
			function ($scope, logisticSettlementFormattedText3DataService, logisticSettlementDataService) {

				var transferFormattedText = function transferFormattedText() {
					logisticSettlementFormattedText3DataService.setFormattedTextAsModified($scope.currentFormattedText3);
				};

				// React on changes of the formatted text only in case of a change
				$scope.onChange = function () {
					transferFormattedText();
				};

				//get Current formatted text
				$scope.currentFormattedText3 = logisticSettlementFormattedText3DataService.getCurrentFormattedText();

				//Current
				function updateFormattedText(currentFormattedText) {
					if (currentFormattedText) {
						$scope.currentFormattedText3 = currentFormattedText;
					}else {
						$scope.currentFormattedText3 = null;
					}
				}

				// register formatted text service messenger
				logisticSettlementFormattedText3DataService.currentFormattedText3Changed.register(updateFormattedText);

				// register Clerk main service messenger
				logisticSettlementDataService.registerSelectionChanged(logisticSettlementFormattedText3DataService.loadFormattedTextById);// load current ID
				logisticSettlementFormattedText3DataService.registerGetModificationCallback(function () {
					return $scope.currentFormattedText3;
				});//need for create & save
				logisticSettlementDataService.SetFormattedText3TransferCallback(transferFormattedText);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					logisticSettlementDataService.SetFormattedText3TransferCallback(null);
					logisticSettlementFormattedText3DataService.currentFormattedText3Changed.unregister(updateFormattedText);
					logisticSettlementFormattedText3DataService.unregisterGetModificationCallback();
				});

			}
		]);
})(angular);