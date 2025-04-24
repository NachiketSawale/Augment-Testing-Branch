/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'basics.costcodes';
	angular.module(moduleName).directive('basicsCostCodesPriceListSelection',
		['_','$q','$http', 'BasicsLookupdataLookupDirectiveDefinition',
			function (_,$q,$http, BasicsLookupdataLookupDirectiveDefinition) {
				let defaults = {
					lookupType: 'MdcCostCodePriceList',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					dialogUuid: '7c38ab1a5df547bc8feb9d64ec115e68',
					uuid: '9559CE85EE5B4D67A899F0C38A6D9D05',
					columns: [
						{
							id: 'priceverdesc',
							field: 'DescriptionInfo.Translated',
							name: 'Price Version Description',
							name$tr$: 'basics.costcodes.priceList.priceVersionDescription',
							width: 100
						},
						{
							id: 'pricelistfk',
							field: 'mdcPriceListFK',
							name: 'Price List Description',
							name$tr$: 'basics.costcodes.priceList.priceListDescription',
							formatter: 'lookup',
							formatterOptions: {
								'lookupSimpleLookup': true,
								'lookupModuleQualifier': 'basics.customize.pricelist',
								'displayMember': 'Description',
								'valueMember': 'Id'
							}
						}
					],
					title: {
						name: 'Price Versions',
						name$tr$: 'basics.costcodes.priceVerion.grid.title'
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if(args && args.entity){
									if(args.selectedItem){
										// basicsCostcodesPriceVersionCacheService.set(args.entity.Id, args.selectedItem);
										args.entity.DayWorkRate = args.selectedItem.SalesPrice;
									}else{
										args.entity.DayWorkRate = args.entity.RawDayWorkRate;
										args.entity.CostCodePriceListFk = null;
										// basicsCostcodesPriceVersionCacheService.delete(args.entity.Id);
									}

								}
							}
						}
					],
					onDataRefresh : function ($scope) {
						$scope.settings.dataView.invalidateData();
						$scope.isLoading = true;
						let requestArgs = null;
						$scope.settings.dataView.loadData(requestArgs).then(function (data) {
							$scope.isLoading = false;
							$scope.refreshData(data);
							$scope.updateDisplayData();
							if($scope.entity && $scope.entity.Id){
								// let priceList = basicsCostcodesPriceVersionCacheService.get($scope.entity.Id);
								// if(priceList){
								//     let newPriceList = _.find(data, {Id : priceList.Id});
								//     if(newPriceList){
								//         $scope.entity.DayWorkRate = newPriceList.SalesPrice;
								//         basicsCostcodesPriceVersionCacheService.set($scope.entity.Id, newPriceList);
								//     }
								// }

								if($scope.entity.CostCodePriceListFk){
									let newPriceList = _.find(data, {Id : $scope.entity.CostCodePriceListFk});
									if(newPriceList){
										$scope.entity.DayWorkRate = newPriceList.SalesPrice;
									}
								}
							}
						});
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
					dataProvider: {
						getList: function (config, scope) {
							if(scope && scope.entity){
								return $http.get(globals.webApiBaseUrl + 'basics/costcodes/version/list/getpricelistbymdccostcodeid?mdcCostCodeId='+scope.entity.Id).then(function(response){
									return response.data;
								});
							}else{
								return  $q.when([]);
							}
						},
					}
				});
			}
		]);
})(angular);