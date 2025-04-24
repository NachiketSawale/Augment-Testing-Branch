/**
 * Created by yew on 3/04/2020.
 */

// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('ProcurementStockCreateContractRequisitionController', [
		'$scope', '$rootScope', '$timeout', 'params', '$translate', '$http', 'platformModalService',
		function ($scope, $rootScope, $timeout, params, $translate, $http, platformModalService) {
			$scope.createFailDetailShow = false;
			$scope.createSuccessDetailShow = false;
			$scope.modalOptions = params.Option;
			$scope.modalOptions.createMessage = '';
			$scope.modalOptions.createByBasicData = $translate.instant('procurement.stock.wizard.createByOrderProposal.basicData',{
				createType: params.Option.headerText
			});
			$scope.modalOptions.createByBusinessPartner = $translate.instant('procurement.stock.wizard.createByOrderProposal.businessPartner',{
				createType: params.Option.headerText
			});
			$scope.modalOptions.createMehtod = '1';

			getCreateNumber();
			$scope.modalOptions.clickMehtod = getCreateNumber;

			function getCreateNumber() {
				var tempIds = [];
				var ids = [];
				_.map(params.OrderProposalList, function (item) {
					if (ids.indexOf(item.Id) < 0) {
						var list = _.filter(params.OrderProposalList, function (orderProposal) {
							if ($scope.modalOptions.createMehtod === '1') {
								return orderProposal.PrcConfigurationFk === item.PrcConfigurationFk && orderProposal.PrcPackageFk === item.PrcPackageFk;
							} else if ($scope.modalOptions.createMehtod === '2') {
								return orderProposal.BpdBusinessPartnerFk === item.BpdBusinessPartnerFk && orderProposal.BpdSupplierFk === item.BpdSupplierFk;
							} else {
								return true;
							}
						});
						tempIds.push(item.Id);
						_.map(list, function (o) {
							ids.push(o.Id);
						});
					}
				});
				$scope.modalOptions.createMessage = $translate.instant('procurement.stock.wizard.createByOrderProposal.createMessage', {
					number: tempIds.length,
					item: params.Option.item
				});
			}

			$scope.modalOptions.ok = function onOK() {
				$scope.isLoading = true;

				$http.post(params.Option.url, {Ids: params.OrderProposalIds, CreateType: $scope.modalOptions.createMehtod}).then(function(res){
					$scope.isLoading = false;
					$scope.modalOptions.resizeable = true;
					$scope.modalOptions.itemList =  _.isArray(res.data) ? res.data : [res.data];
					platformModalService.showDialog($scope.modalOptions);
					$scope.$close(false);

				}, function (error) {
					$scope.isLoading = false;
					window.console.log(error);
				});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};
			$scope.modalOptions.cancel = $scope.modalOptions.close;

		}]);
})(angular);