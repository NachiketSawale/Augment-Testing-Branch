/**
 * Created by henkel
 */

/*global angular */
(function (angular) {
	'use strict';

	/**
	 @ngdoc controller
	 * @name logisticSettlementFormattedText5Controller
	 * @function
	 * @description
	 * Controller for the formatted text view.
	 */
	angular.module('logistic.settlement').controller('logisticSettlementFormattedText5Controller', ['$scope', 'logisticSettlementFormattedText5DataService', 'logisticSettlementDataService',
			function ($scope, logisticSettlementFormattedText5DataService, logisticSettlementDataService) {

				var transferFormattedText = function transferFormattedText() {
					logisticSettlementFormattedText5DataService.setFormattedTextAsModified($scope.currentFormattedText5);
				};

				// React on changes of the formatted text only in case of a change
				$scope.onChange = function () {
					transferFormattedText();
				};

				//get Current formatted text
				$scope.currentFormattedText5 = logisticSettlementFormattedText5DataService.getCurrentFormattedText();

				//Current
				function updateFormattedText(currentFormattedText) {
					if (currentFormattedText) {
						$scope.currentFormattedText5 = currentFormattedText;
					}else {
						$scope.currentFormattedText5 = null;
					}
				}

				// register formatted text service messenger
				logisticSettlementFormattedText5DataService.currentFormattedText5Changed.register(updateFormattedText);

				// register Clerk main service messenger
				logisticSettlementDataService.registerSelectionChanged(logisticSettlementFormattedText5DataService.loadFormattedTextById);// load current ID
				logisticSettlementFormattedText5DataService.registerGetModificationCallback(function () {
					return $scope.currentFormattedText5;
				});//need for create & save
				logisticSettlementDataService.SetFormattedText5TransferCallback(transferFormattedText);

				// unregister Clerk service messenger
				$scope.$on('$destroy', function () {
					logisticSettlementDataService.SetFormattedText5TransferCallback(null);
					logisticSettlementFormattedText5DataService.currentFormattedText5Changed.unregister(updateFormattedText);
					logisticSettlementFormattedText5DataService.unregisterGetModificationCallback();
				});

			}
		]);
})(angular);