/**
 * Created by henkel
 */

/*global angular */
(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name logisticSettlementFormattedText2Controller
	 * @function
	 * @description
	 * Controller for the formatted text view.
	 */
	angular.module('logistic.settlement').controller('logisticSettlementFormattedText2Controller', ['$scope', 'logisticSettlementFormattedText2DataService', 'logisticSettlementDataService',
			function ($scope, logisticSettlementFormattedText2DataService, logisticSettlementDataService) {

				var transferFormattedText = function transferFormattedText() {
					logisticSettlementFormattedText2DataService.setFormattedTextAsModified($scope.currentFormattedText2);
				};

				// React on changes of the formatted text only in case of a change
				$scope.onChange = function () {
					transferFormattedText();
				};

				//get Current formatted text
				$scope.currentFormattedText2 = logisticSettlementFormattedText2DataService.getCurrentFormattedText();

				//Current
				function updateFormattedText(currentFormattedText) {
					if (currentFormattedText) {
						$scope.currentFormattedText2 = currentFormattedText;
					}else {
						$scope.currentFormattedText2 = null;
					}
				}

				// register formatted text service messenger
				logisticSettlementFormattedText2DataService.currentFormattedText2Changed.register(updateFormattedText);

				// register Clerk main service messenger
				logisticSettlementDataService.registerSelectionChanged(logisticSettlementFormattedText2DataService.loadFormattedTextById);// load current ID
				logisticSettlementFormattedText2DataService.registerGetModificationCallback(function () {
					return $scope.currentFormattedText2;
				});//need for create & save
				logisticSettlementDataService.SetFormattedText2TransferCallback(transferFormattedText);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					logisticSettlementDataService.SetFormattedText2TransferCallback(null);
					logisticSettlementFormattedText2DataService.currentFormattedText2Changed.unregister(updateFormattedText);
					logisticSettlementFormattedText2DataService.unregisterGetModificationCallback();
				});

			}
		]);
})(angular);