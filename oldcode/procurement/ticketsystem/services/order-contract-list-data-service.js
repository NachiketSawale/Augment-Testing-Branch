(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var module='procurement.ticketsystem';
	/**
	 * @ngdoc service
	 * @name procurementTicketsystemOrderContractListDataService
	 * @require $scope
	 * @description service for ticket system
	 */
	angular.module(module).factory('procurementTicketsystemOrderContractListDataService',
		['$q', '$http', '$translate','platformContextService','platformLanguageService','accounting',
			function ($q, $http, $translate,platformContextService,platformLanguageService,accounting) {
				var service = {
						deleteList: [],
						getDeleteList: function () {
							return service.deleteList;
						}
					},
					queryTicketSystemHttp = globals.webApiBaseUrl + 'procurement/ticketsystem/',
					queryContractHttp = globals.webApiBaseUrl + 'procurement/contract/header/',
					queryCommodityHttp = globals.webApiBaseUrl + 'basics/material/commoditysearch/';

				function getImage(prcItem) {
					if (!prcItem.MdcMaterialFk) {
						return;
					}
					$http.get(queryCommodityHttp + 'getImageByMaterialId?materialId=' + prcItem.MdcMaterialFk)
						.then(function (response) {
							if (response.data) {
								prcItem.Image = 'data:image/png;base64,' + response.data.Content;
							}
						});
				}

				service.loadData = function (option) {
					var defer = $q.defer();
					$http({
						method: 'POST',
						url: queryTicketSystemHttp + 'orders/list',
						data: option
					}).then(function (response) {
						defer.resolve(service.fillFieldToEntity(response.data));
					}, function (error) {
						defer.reject(error);
					});
					return defer.promise;
				};

				service.orderListOperation = function (entity) {
					var index = service.deleteList.indexOf(entity);
					if (index === -1) {
						service.deleteList.push(entity);
						var defer = $q.defer();
						$http.get(queryContractHttp + 'changeheaderstatustocancelbyid?Id=' + entity.Id)
							.then(function (response) {
								defer.resolve(response);
							}, function () {
								defer.resolve('fail');
							});
						return defer.promise;
					}
				};

				service.fillFieldToEntity = function (result) {
					if (!result.Result) {
						return;
					}
					var dataSource = result.Result,
						total,
						prcItemEntity;
					for (var i = 0; i < dataSource.length; i++) {
						total = 0;
						prcItemEntity = dataSource[i].PrcItems;
						dataSource[i].showDeleteBtn = false;
						dataSource[i].ReqStatus=dataSource[i].ConStatus;
						if (dataSource[i].ReqStatus && !dataSource[i].ReqStatus.Iscanceled && !dataSource[i].ReqStatus.Isordered) {
							dataSource[i].showDeleteBtn = true;
						}

						dataSource[i].Total = 0;
						dataSource[i].DateReceived = new Date(dataSource[i].DateOrdered);// DateReceived=>DateOrdered
						dataSource[i].IsRemarkShow = !!dataSource[i].Remark;
						dataSource[i].IsClerkShow = !!dataSource[i].ClerkPrcDescription;
						dataSource[i].IsShowDetails = false;
						dataSource[i].ShowDetails = $translate.instant('procurement.ticketsystem.orderRequest.ShowDetails');
						if (!prcItemEntity) {
							continue;
						}
						var culture = platformContextService.culture();
						var cultureInfo = platformLanguageService.getLanguageInfo(culture);
						for (var j = 0; j < prcItemEntity.length; j++) {
						// todo: need to check the requirement todo !!!!
							total += prcItemEntity[j].Total;
							var basMaterialPrice=prcItemEntity[j].BasMaterialPrice.toFixed(2);
							prcItemEntity[j].BasMaterialPrice =accounting.formatNumber(basMaterialPrice, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
							prcItemEntity[j].Image = null;
							getImage(prcItemEntity[j]);
						}
						dataSource[i].Total =accounting.formatNumber(total.toFixed(2), 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
					}
					return result;
				};

				return service;
			}]);
})(angular);