/*
 * Created by alm on 09.07.2021.
 */
(function (angular) {
	'use strict';
	angular.module('controlling.revrecognition').factory('controllingRevenueRecognitionWizardService', ['$http','globals', 'platformModalService','basicsCommonChangeStatusService','controllingRevenueRecognitionHeaderDataService',
		function ($http, globals, platformModalService,changeStatusService,headerDataService) {
			var service = {};
			service.createTransactions = function createTransactions() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'controlling.revrecognition/templates/create-transaction-dialog.html',
					controller: 'controllingRevenuerecognitionCreateTransactionController'
				});
			};

			service.createRevenueRecognition= function createTransactions() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'controlling.revrecognition/templates/create-revrecognition-dialog.html',
					createFromWiard:true
				});
			};

			function changeStatus() {
				return changeStatusService.provideStatusChangeInstance(
					{
						mainService: headerDataService,
						statusField: 'PrrStatusFk',
						projectField: 'PrjProjectFk',
						title: 'controlling.revrecognition.wizard.changeStatus.title',
						statusName: 'revenuerecognition',
						updateUrl: 'controlling/RevenueRecognition/wizard/changestatus',
						id: 30
					}
				);
			}

			service.changeStatus = changeStatus().fn;
			return service;
		}]);
})(angular);
