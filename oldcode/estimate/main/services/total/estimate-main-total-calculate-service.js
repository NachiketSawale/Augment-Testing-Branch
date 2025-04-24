/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	// / C - 1, cost code
	// / M - 2, material
	// / P - 3, plant
	// / A - 4, assembly reference
	// / S - 5, subset
	estimateMainModule.factory('estimateTotalCalculateService', [
		'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService',
		'$http',
		'$q',
		'$translate',
		'basicsCurrencyMainService',
		'estimateMainService',
		function (basicsLookupdataLookupDescriptorService,
			cloudCommonGridService,
			$http,
			$q,
			$translate,
			basicsCurrencyMainService,
			estimateMainService) {

			let service = {
					getTotalLines: getTotalLines,
					displayAllTotalLines: displayAllTotalLines
				},
				prjId2CurrencyCode = {},// pid => currency_code
				estCostCodesList = [];

			let trDirectJobCost =  $translate.instant('estimate.main.totalOfDirectJobCost'),
				trLaborHours =  $translate.instant('estimate.main.totalOfLaborHours'),
				trCostRisk =  $translate.instant('estimate.main.totalOfCostRisk');

			function resetTotalData() {
				let total = {
					'totalCost': 0,
					'totalCostRisk': 0,
					'totalHours': 0,
					'majorCostCode': [],
					'majorCostTotal': 0,
					'isValid': false
				};
				return total;
			}

			// return a promise resolved to [dataList]
			function getTotalLines(responseLineItemList) {
				let qDefer = $q.defer();
				promiseTotalCurrency().then(function(currencyItem){
					qDefer.resolve(calculateTotal(responseLineItemList, currencyItem.Currency));
				});
				return qDefer.promise;
			}

			// total is calculated from back end, do some process here and output
			function displayAllTotalLines(totalLines) {
				return totalLines.map(function(item){
					if(item.Code === 'summary_line_djc1') {
						item.TotalOf = trDirectJobCost;
					}else if(item.Code === 'summary_line_labourHours1') {
						item.TotalOf = trLaborHours;
						item.CurUoM = 'Hours';
					}else if(item.Code === 'summary_line_costRisk1') {
						item.TotalOf = trCostRisk;
					}
					return item;
				});
			}



			function calculateTotal(responseLineItemList, inCurrencyCode) {

				// [[resourcesList], [resourcesList], [resourcesList]]
				let resources = _.map(responseLineItemList, 'EstResources') || [],
					resourcesList = [].concat.apply([], resources);

				let currency = inCurrencyCode || 'EUR',
					hours = 'Hours',
					// trDirectJobCost =  $translate.instant('estimate.main.totalOfDirectJobCost'),
					// trLaborHours =  $translate.instant('estimate.main.totalOfLaborHours'),
					// trCostRisk =  $translate.instant('estimate.main.totalOfCostRisk'),
					dynamicCols = [],
					id = 1;
				let total = angular.extend(
					resetTotalData(), // empty total data
					updateTotalCostNHours(responseLineItemList), // cost risk and hours
					getTotalMajorCC(resourcesList) // total root cost code result
				);
				if (total.isValid) {
					if(total.majorCostCode.length > 0){
						angular.forEach(total.majorCostCode, function(cc){
							let col = {'Id': id++, 'TotalOf': cc.code, 'Description': cc.desc, 'Total': cc.costTotal, 'CurUoM': currency};
							dynamicCols.push(col);
						});
						let totalCostCol = {'Id': id++, 'TotalOf': trDirectJobCost, 'Description': '', 'Total': total.majorCostTotal, 'CurUoM': currency, 'cssClass':'font-bold'};

						dynamicCols.push(totalCostCol);
					}

					let cols = [
						{'Id': id++, 'TotalOf': trLaborHours, 'Description': '', 'Total': total.totalHours, 'CurUoM': hours},
						{'Id': id++, 'TotalOf': trCostRisk, 'Description': '', 'Total': total.totalCostRisk, 'CurUoM': currency}
					];

					angular.forEach(cols, function (col){
						dynamicCols.push(col);
					});
				}

				return dynamicCols;
			}

			function getTotalMajorCC(resourcesList) {
				let majorCC = [],
					cc = {'code': '', 'costTotal': 0},
					total = {};

				resourcesList = resourcesList || [];
				if (resourcesList.length > 0) {
					majorCC = [];
					angular.forEach(resourcesList, function (res) {
						if (res.EstResourceTypeFk !== 5) {  // S
							let costCode = getMajorCC(res);
							if (costCode.code !== '') {
								cc.code = costCode.code;
								cc.desc = costCode.descInfo.Description;
								cc.costTotal = res.CostTotal;
								majorCC.push(angular.copy(cc));
							}
						}
					});
				}
				// updateTotalCostNHours(assemblyItem);

				if (majorCC.length > 0) {
					let result = _.chain(majorCC)
						.groupBy('code')
						.pairs()
						.map(function (item) {
							// TODO CHECK UPGRADE TO LODASH 4.17
							// return _.object(_.zip(['code', 'costCodeDetail'], item));
							return _.zipObject(['code', 'costCodeDetail'], item);
						})
						.value();

					if (result && result.length > 0) {
						total.majorCostTotal = 0;

						angular.forEach(result, function (ccDetail) {
							if (ccDetail.costCodeDetail) {
								let costTotal = 0;

								angular.forEach(ccDetail.costCodeDetail, function (costCodeDetail) {

									costTotal += costCodeDetail.costTotal;
								});

								ccDetail.costTotal = costTotal;
								ccDetail.desc = ccDetail.costCodeDetail[0].desc;
								total.majorCostTotal += costTotal;
							}
						});
					}

					total.majorCostCode = result;
				}
				total.isValid = true;

				return total;
			}

			function updateTotalCostNHours(lineItemList) {
				let total = {};
				if(lineItemList && lineItemList.length > 0){
					total.totalCost = 0;
					total.totalCostRisk = 0;
					total.totalHours = 0;
					angular.forEach(lineItemList, function(lineItem){
						if(lineItem.EstCostRiskFk !== null && lineItem.EstCostRiskFk > 0 ){
							total.totalCostRisk += lineItem.CostTotal;
						}
						else{
							total.totalCost += lineItem.CostTotal;
						}
						total.totalHours += lineItem.HoursTotal;
					});
				}
				return total;
			}

			function getMajorCC(resItem) {
				let item = {},
					cc = {'code': '', 'descInfo': ''};
				estCostCodesList = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');

				if(resItem.MdcCostCodeFk){
					item = _.find(estCostCodesList, { Id : resItem.MdcCostCodeFk});
				}

				if(item){
					if(angular.isDefined(item.CostCodeParentFk)){
						if(item.CostCodeParentFk !== null){
							let parentItem = cloudCommonGridService.getRootParentItem(item, estCostCodesList, 'CostCodeParentFk');
							if(parentItem){
								cc.code  = parentItem.Code;
								cc.descInfo = parentItem.DescriptionInfo;
							}
						}
						else{
							cc.code  = item.Code;
							cc.descInfo = item.DescriptionInfo;
						}
					}
				}
				return cc;
			}


			/**
			 3: {Id: 51, Currency: "CAD",…}
			 4: {Id: 3, Currency: "CNY",…}
			 6: {Id: 1, Currency: "EUR",…}
			 7: {Id: 4, Currency: "HKD",…}
			 11: {Id: 27, Currency: "USD",…}
			 * */
			// return promise
			function promiseTotalCurrency() {
				let qDefer = $q.defer();
				let prjInfo = estimateMainService.getSelectedProjectInfo();
				let getCode = function(currencyItems) {
					let projectCurrencyCode =  '';
					try {
						projectCurrencyCode = _.find(currencyItems, function (i) {
							return i.Id === parseInt(prjInfo.ProjectCurrency);
						});
						prjId2CurrencyCode[prjInfo.ProjectId] = projectCurrencyCode;
					} catch (e) {
						// eslint-disable-next-line no-console
						console.error(e);
					}
					return projectCurrencyCode;
				};
				if(prjInfo.ProjectId && prjId2CurrencyCode[prjInfo.ProjectId]) {
					// the currency code already loaded
					qDefer.resolve(prjId2CurrencyCode[prjInfo.ProjectId]);

				}else { // load data from server
					// when calculate the total, it needs the currency code for the project
					// ensure the currencies are loaded
					// if not load, try to load them
					let loadedData = basicsCurrencyMainService.getList() || [];
					if(loadedData.length === 0) {
						basicsCurrencyMainService.load();
						// after loaded
						basicsCurrencyMainService.registerListLoaded(function () {
							qDefer.resolve(getCode(basicsCurrencyMainService.getList()));
						});
					}else{
						qDefer.resolve(getCode(basicsCurrencyMainService.getList()));
					}

				}
				return qDefer.promise;
			}




			return service;
		}]);



})();
