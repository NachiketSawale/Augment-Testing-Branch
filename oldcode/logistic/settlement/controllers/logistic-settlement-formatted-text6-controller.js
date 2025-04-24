/**
 * Created by henkel
 */

/*global angular */
(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name logisticSettlementFormattedText6Controller
	 * @function
	 * @description
	 * Controller for the formatted text view.
	 */
	angular.module('logistic.settlement').controller('logisticSettlementFormattedText6Controller', ['$scope', 'logisticSettlementFormattedText6DataService', 'logisticSettlementDataService',
			function ($scope, logisticSettlementFormattedText6DataService, logisticSettlementDataService) {

				var transferFormattedText = function transferFormattedText() {
					logisticSettlementFormattedText6DataService.setFormattedTextAsModified($scope.currentFormattedText6);
				};

				// React on changes of the formatted text only in case of a change
				$scope.onChange = function () {
					transferFormattedText();
				};

				//get Current formatted text
				$scope.currentFormattedText6 = logisticSettlementFormattedText6DataService.getCurrentFormattedText();

				//Current
				function updateFormattedText(currentFormattedText) {
					if (currentFormattedText) {
						$scope.currentFormattedText6 = currentFormattedText;
					}else {
						$scope.currentFormattedText6 = null;
					}
				}

				// register formatted text service messenger
				logisticSettlementFormattedText6DataService.currentFormattedText6Changed.register(updateFormattedText);

				// register Clerk main service messenger
				logisticSettlementDataService.registerSelectionChanged(logisticSettlementFormattedText6DataService.loadFormattedTextById);// load current ID
				logisticSettlementFormattedText6DataService.registerGetModificationCallback(function () {
					return $scope.currentFormattedText6;
				});//need for create & save
				logisticSettlementDataService.SetFormattedText6TransferCallback(transferFormattedText);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					logisticSettlementDataService.SetFormattedText6TransferCallback(null);
					logisticSettlementFormattedText6DataService.currentFormattedText6Changed.unregister(updateFormattedText);
					logisticSettlementFormattedText6DataService.unregisterGetModificationCallback();
				});

			}
		]);
})(angular);