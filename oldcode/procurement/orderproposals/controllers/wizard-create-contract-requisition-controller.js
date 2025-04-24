
(function (angular) {
	'use strict';
	var moduleName = 'procurement.orderproposals';
	angular.module(moduleName).controller('OrderProposalsCreateContractRequisitionController', ['$scope', '_', 'params', '$translate', '$http', 'platformModalService',
		function orderProposalsCreateContractRequisitionController($scope, _, params, $translate, $http, platformModalService) {
			$scope.createFailDetailShow = false;
			$scope.createSuccessDetailShow = false;
			$scope.modalOptions = params.Option;
			$scope.modalOptions.createMessage = '';
			$scope.modalOptions.deleteMessage = '';
			$scope.modalOptions.createByBasicData = $translate.instant('procurement.stock.wizard.createByOrderProposal.basicData', {
				createType: params.Option.headerText
			});
			$scope.modalOptions.createByBusinessPartner = $translate.instant('procurement.stock.wizard.createByOrderProposal.businessPartner', {
				createType: params.Option.headerText
			});
			$scope.modalOptions.createMehtod = '1';
			$scope.modalOptions.isDeleteItem = true;
			$scope.modalOptions.isMultiItem = params.OrderProposalList.length > 1;

			getCreateNumber();
			$scope.modalOptions.clickMehtod = getCreateNumber;

			function getCreateNumber() {
				var tempIds = [], ids = [];
				_.map(params.OrderProposalList, function mapList(item) {
					if (ids.indexOf(item.Id) < 0) {
						var list = _.filter(params.OrderProposalList, function filterList(orderProposal) {
							if ($scope.modalOptions.createMehtod === '1') {
								return orderProposal.PrcConfigurationFk === item.PrcConfigurationFk && orderProposal.PrcPackageFk === item.PrcPackageFk;
							} else if ($scope.modalOptions.createMehtod === '2') {
								return orderProposal.BpdBusinessPartnerFk === item.BpdBusinessPartnerFk && orderProposal.BpdSupplierFk === item.BpdSupplierFk;
							} else {
								return true;
							}
						});
						tempIds.push(item.Id);
						_.map(list, function mapList(o) {
							ids.push(o.Id);
						});
					}
				});
				$scope.modalOptions.createMessage = $translate.instant('procurement.stock.wizard.createByOrderProposal.createMessage', {
					number: tempIds.length,
					item: params.Option.item
				});
				$scope.modalOptions.deleteMessage = $translate.instant('procurement.stock.wizard.createByOrderProposal.deleteOrderProposal', {
					item: params.Option.item
				});
			}

			$scope.modalOptions.ok = function onOK() {
				$scope.isLoading = true;

				$http.post(params.Option.url, {
					Ids: params.OrderProposalIds,
					IsDeleteItem: $scope.modalOptions.isDeleteItem,
					CreateType: params.OrderProposalList.length > 1 ? $scope.modalOptions.createMehtod : 0
				}).then(function successCallback(res) {
					$scope.isLoading = false;
					$scope.modalOptions.resizeable = true;
					$scope.modalOptions.itemList = res.data;
					platformModalService.showDialog($scope.modalOptions);
					$scope.$close(false);

				}, function errorCallback(error) {
					$scope.isLoading = false;
					window.console.log(error);
				});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close();
			};
			$scope.modalOptions.cancel = $scope.modalOptions.close;

		}]);
})(angular);