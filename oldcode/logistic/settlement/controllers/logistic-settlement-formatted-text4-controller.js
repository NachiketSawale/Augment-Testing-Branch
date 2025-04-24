/**
 * Created by henkel
 */

/*global angular */
(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name logisticSettlementFormattedText4Controller
	 * @function
	 * @description
	 * Controller for the formatted text view.
	 */
	angular.module('logistic.settlement').controller('logisticSettlementFormattedText4Controller', ['$scope', 'logisticSettlementFormattedText4DataService', 'logisticSettlementDataService',
			function ($scope, logisticSettlementFormattedText4DataService, logisticSettlementDataService) {

				var transferFormattedText = function transferFormattedText() {
					logisticSettlementFormattedText4DataService.setFormattedTextAsModified($scope.currentFormattedText4);
				};

				// React on changes of the formatted text only in case of a change
				$scope.onChange = function () {
					transferFormattedText();
				};

				//get Current formatted text
				$scope.currentFormattedText4 = logisticSettlementFormattedText4DataService.getCurrentFormattedText();

				//Current
				function updateFormattedText(currentFormattedText) {
					if (currentFormattedText) {
						$scope.currentFormattedText4 = currentFormattedText;
					}else {
						$scope.currentFormattedText4 = null;
					}
				}

				// register formatted text service messenger
				logisticSettlementFormattedText4DataService.currentFormattedText4Changed.register(updateFormattedText);

				// register Clerk main service messenger
				logisticSettlementDataService.registerSelectionChanged(logisticSettlementFormattedText4DataService.loadFormattedTextById);// load current ID
				logisticSettlementFormattedText4DataService.registerGetModificationCallback(function () {
					return $scope.currentFormattedText4;
				});//need for create & save
				logisticSettlementDataService.SetFormattedText4TransferCallback(transferFormattedText);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					logisticSettlementDataService.SetFormattedText4TransferCallback(null);
					logisticSettlementFormattedText4DataService.currentFormattedText4Changed.unregister(updateFormattedText);
					logisticSettlementFormattedText4DataService.unregisterGetModificationCallback();
				});

			}
		]);
})(angular);