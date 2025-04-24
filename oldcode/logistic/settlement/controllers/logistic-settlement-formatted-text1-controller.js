/**
 * Created by henkel
 */

/*global angular */
(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name logisticSettlementFormattedText1Controller
	 * @function
	 * @description
	 * Controller for the formatted text view.
	 */
	angular.module('logistic.settlement').controller('logisticSettlementFormattedText1Controller', ['$scope', 'logisticSettlementFormattedText1DataService', 'logisticSettlementDataService',
			function ($scope, logisticSettlementFormattedText1DataService, logisticSettlementDataService) {

				var transferFormattedText = function transferFormattedText() {
					logisticSettlementFormattedText1DataService.setFormattedTextAsModified($scope.currentFormattedText1);
				};

				// React on changes of the formatted text only in case of a change
				$scope.onChange = function () {
					transferFormattedText();
				};

				//get Current formatted text
				$scope.currentFormattedText1 = logisticSettlementFormattedText1DataService.getCurrentFormattedText();

				//Current
				function updateFormattedText(currentFormattedText) {
					if (currentFormattedText) {
						$scope.currentFormattedText1 = currentFormattedText;
					}else {
						$scope.currentFormattedText1 = null;
					}
				}

				// register formatted text service messenger
				logisticSettlementFormattedText1DataService.currentFormattedText1Changed.register(updateFormattedText);

				// register Clerk main service messenger
				logisticSettlementDataService.registerSelectionChanged(logisticSettlementFormattedText1DataService.loadFormattedTextById);// load current ID
				logisticSettlementFormattedText1DataService.registerGetModificationCallback(function () {
					return $scope.currentFormattedText1;
				});//need for create & save
				logisticSettlementDataService.SetFormattedText1TransferCallback(transferFormattedText);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					logisticSettlementDataService.SetFormattedText1TransferCallback(null);
					logisticSettlementFormattedText1DataService.currentFormattedText1Changed.unregister(updateFormattedText);
					logisticSettlementFormattedText1DataService.unregisterGetModificationCallback();
				});

			}
		]);
})(angular);