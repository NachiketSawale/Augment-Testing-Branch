/**
 * Created by hzh on 2017/10/13.
 */
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businesspartnerMainContact2ExchangeContainerController', ['$scope', '$http', '$translate', 'businesspartnerMainContactDataService',
		function ($scope, $http, $translate, businesspartnerMainContactDataService) {

			$scope.config = {};
			$scope.config.selectConfig = {readonly: true};

			$scope.config.colIsToExchangeUser = $translate.instant('businesspartner.main.contact2exchange.IsToExchange');

			// var selectContact = businesspartnerMainContactDataService.getSelected();

			$scope.IsToExchangeUser = false;

			$scope.checkIsToExchangeUser = checkIsToExchangeUser;

			$scope.isDisabled = function () {
				var parentService = businesspartnerMainContactDataService.parentService();
				if (parentService) {
					var parentSelectItem = parentService.getSelected();
					if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined) {
						return parentSelectItem.IsReadonlyStatus;
					} else if (parentService.getItemStatus !== undefined) {
						var status = parentService.getItemStatus();
						return status.IsReadonly;
					}
				}
				return false;
			};

			function checkIsToExchangeUser() {
				var selectContact = businesspartnerMainContactDataService.getSelected();

				if (selectContact) {
					selectContact.IsToExchangeUser = $scope.IsToExchangeUser;
					$http.post(globals.webApiBaseUrl + 'businesspartner/main/exchange/update', selectContact).then(function () {

					});
				} else {
					$scope.IsToExchangeUser = false;
				}
			}

			function selectedContactChange() {
				var selectContact = businesspartnerMainContactDataService.getSelected();
				if (selectContact) {
					$http.post(globals.webApiBaseUrl + 'businesspartner/main/exchange/contact2exchangeById', {filter: '', Value: selectContact.Id}).then(function (response) {
						if (!response.data) {
							$scope.IsToExchangeUser = selectContact.IsToExchangeUser;
						} else if (response.data.Main) {
							$scope.IsToExchangeUser = response.data.Main[0].IsToExchangeUser;
						}
					});
				} else {
					$scope.IsToExchangeUser = false;
				}
			}

			businesspartnerMainContactDataService.getSelectChangeMsg().register(selectedContactChange);

			$scope.$on('$destroy', function () {
				businesspartnerMainContactDataService.getSelectChangeMsg().unregister(selectedContactChange);
			});
		}
	]);
})(angular);