/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateProjectUIConfigurationService
	 * @function
	 *
	 * @description
	 * estimateProjectUIConfigurationService is the config service for all estimate header views.
	 */
	angular.module(moduleName).factory('estimateProjectUIConfigurationService', ['$injector', '$translate', '$http', 'basicsLookupdataConfigGenerator','$q',

		function ($injector, $translate, $http, basicsLookupdataConfigGenerator,$q) {

			return {
				getEstimateProjectEstHeaderDetailLayout: function () {
					return {
						'fid': 'estimate.project.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['estheader.eststatusfk', 'estheader.code', 'estheader.descriptioninfo', 'estheader.esttypefk',
									'estheader.rubriccategoryfk', 'estheader.lgmjobfk', 'estheader.isactive', 'estheader.iscontrolling',
									'estheader.currency1fk','estheader.currency2fk','estheader.hint','estheader.levelfk','estheader.psdactivityfk','estheader.duration',
									'estheader.versionno', 'estheader.versiondescription', 'estheader.versioncomment']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'estheader.code': {
								navigator: {
									moduleName:'estimate.main',
									navFunc: function (triggerField, item) {
										let naviService = $injector.get('platformModuleNavigationService');
										let navigator = naviService.getNavigator('estimate.main-line-item-from-estimate');
										if(item) {
											let prjId = item.PrjEstimate.PrjProjectFk;
											let estHeaderId = item.EstHeader.Id;
											let estHeaderCode = item.EstHeader.Code;
											let projectMainService = $injector.get('projectMainService');
											if (projectMainService) {
												projectMainService.updateAndExecute(function () {
													// TODO: while the estimate has beed deleted by external, synchronize the new project estimate
													$http.get(globals.webApiBaseUrl + 'estimate/project/getestimate?prjId=' + prjId + '&estHeaderId=' + estHeaderId + '&estHeaderCode=' + estHeaderCode).then(function (response) {
														item = response.data;
														let estimateMainService = $injector.get('estimateMainService');
														estimateMainService.requiresRefresh = undefined;
														naviService.navigate(navigator, item, triggerField);
													});

												});
											}
										}
									}
								}
							},
							'estheader.esttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.esttype'),
							'estheader.levelfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName:'basicsIndexLevelLookupDataService' ,enableCache: true}),

							'estheader.eststatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.eststatus', null, {
								showIcon: true
							}),
							'estheader.rubriccategoryfk': {
								'grid': {
									readonly: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'RubricCategoryByRubricAndCompany',
										displayMember: 'Description'
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										lookupOptions: {
											filterKey: 'estimate-main-lookup-filter'
										}
									}
								}
							},
							'estheader.psdactivityfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName:'estimateMainActivityLookupDataService',
								enableCache: true,
								showClearButton : false,
								additionalColumns: false,
								filter: function () {
									return  $injector.get('projectMainService').getIfSelectedIdElse(null);
								}
							}),
							'estheader.lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estimateMainJobLookupByProjectDataService',
								cacheEnable: true,
								showClearButton : false,
								additionalColumns: false,
								filter: function () {
									return  $injector.get('projectMainService').getIfSelectedIdElse(null);
								}
							},{required : true}),
							'estheader.currency1fk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true,
								readonly: false,
								events: [
									{
										name: 'onSelectedItemChanged', // register event and event handler here.
										handler: function (e, args) {
											let basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

											let currentProject = $injector.get('projectMainService').getIfSelectedIdElse(null);

											let currentProjectObj = $injector.get('projectMainService').getSelected();

											let latestBudgetRate,
												latestProjRate,
												latestExchRate;

											if(args.selectedItem !== null) {
												if (currentProject) {
													// Get List of Project Exchange Rates
													basMultiCurrCommService.getPrjCurrenciesAndRates(currentProject).then(function (response) {
														// Some are set in Project Exchange Rate
														if (response.data.length > 0) {

															// Rate Type Heirarchy 2-Budget => 3-Project => 1-Exchange

															let budget = basMultiCurrCommService.filterBudgetRate(response.data,args);

															let project = basMultiCurrCommService.filterProjectRate(response.data,args);

															let exchange = basMultiCurrCommService.filterExchangeRate(response.data,args);

															let foundCurrency = null;

															if(budget){
																foundCurrency = budget;
															}else if(project){
																foundCurrency = project;
															}else if(exchange){
																foundCurrency = exchange;
															}

															if (foundCurrency) {

																args.entity.EstHeader.ExchangeRate1 = foundCurrency.Rate;

															} else {
																// No currency match in Project so get from Master
																latestBudgetRate = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,2).then(function (success) {
																	return success.data;
																},function () {
																	return null;
																});

																latestProjRate    = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,1).then(function (success) {
																	return success.data;
																},function () {
																	return null;
																});

																latestExchRate   = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,3).then(function (success) {
																	return success.data;
																},function () {
																	return null;
																});
																$q.all([latestBudgetRate,latestProjRate,latestExchRate]).then(function (data) {
																	let foundCurrency = null;
																	if(data[0]){
																		foundCurrency = data[0];
																	}else if(data[1]){
																		foundCurrency = data[1];
																	}else if(data[2]){
																		foundCurrency = data[2];
																	}
																	if(foundCurrency){
																		args.entity.EstHeader.ExchangeRate1 = foundCurrency.Rate;
																	}
																});
															}
														} else {
															// No currency defined at all in Project so get from Master
															// No currency match in Project so get from Master
															latestBudgetRate = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,2).then(function (success) {
																return success.data;
															},function () {
																return null;
															});

															latestProjRate    = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,1).then(function (success) {
																return success.data;
															},function () {
																return null;
															});

															latestExchRate   = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,3).then(function (success) {
																return success.data;
															},function () {
																return null;
															});
															$q.all([latestBudgetRate,latestProjRate,latestExchRate]).then(function (data) {
																let foundCurrency = null;
																if(data[0]){
																	foundCurrency = data[0];
																}else if(data[1]){
																	foundCurrency = data[1];
																}else if(data[2]){
																	foundCurrency = data[2];
																}
																if(foundCurrency){
																	args.entity.EstHeader.ExchangeRate1 = foundCurrency.Rate;
																}
															});
														}
													});
												}
											}else{
												// no rates defined anywhere
												args.entity.EstHeader.BasCurrency1Fk = null;
												args.entity.EstHeader.ExchangeRate1 = null;
											}
										}
									}
								]
							}),
							'estheader.currency2fk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true,
								readonly: false,
								events: [
									{
										name: 'onSelectedItemChanged', // register event and event handler here.
										handler: function (e, args) {

											let basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

											let currentProject = $injector.get('projectMainService').getIfSelectedIdElse(null);

											let currentProjectObj = $injector.get('projectMainService').getSelected();

											let latestBudgetRate,
												latestProjRate,
												latestExchRate;

											if(args.selectedItem !== null) {
												if (currentProject) {
													// Get List of Project Exchange Rates
													basMultiCurrCommService.getPrjCurrenciesAndRates(currentProject).then(function (response) {
														if (response.data.length > 0) {
															// Rate Type Heirarchy 2-Budget => 3-Project => 1-Exchange
															let budget = basMultiCurrCommService.filterBudgetRate(response.data,args);

															let project = basMultiCurrCommService.filterProjectRate(response.data,args);

															let exchange = basMultiCurrCommService.filterExchangeRate(response.data,args);

															let foundCurrency = null;

															if(budget){
																foundCurrency = budget;
															}else if(project){
																foundCurrency = project;
															}else if(exchange){
																foundCurrency = exchange;
															}
															if (foundCurrency) {

																args.entity.EstHeader.ExchangeRate2 = foundCurrency.Rate;

															} else {
																// Currencies defined in Project but not the currency we need so get from Master
																// No currency match in Project so get from Master
																latestBudgetRate = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,2).then(function (success) {
																	return success.data;
																},function () {
																	return null;
																});

																latestProjRate    = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,1).then(function (success) {
																	return success.data;
																},function () {
																	return null;
																});

																latestExchRate   = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,3).then(function (success) {
																	return success.data;
																},function () {
																	return null;
																});
																$q.all([latestBudgetRate,latestProjRate,latestExchRate]).then(function (data) {
																	let foundCurrency = null;
																	if(data[0]){
																		foundCurrency = data[0];
																	}else if(data[1]){
																		foundCurrency = data[1];
																	}else if(data[2]){
																		foundCurrency = data[2];
																	}
																	if(foundCurrency){
																		args.entity.EstHeader.ExchangeRate2 = foundCurrency.Rate;
																	}
																});
															}
														} else {
															// No currency defined at all in Project so get from Master
															// No currency match in Project so get from Master
															latestBudgetRate = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,2).then(function (success) {
																return success.data;
															},function () {
																return null;
															});

															latestProjRate    = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,1).then(function (success) {
																return success.data;
															},function () {
																return null;
															});

															latestExchRate   = basMultiCurrCommService.getLatestRate(currentProjectObj.CurrencyFk,args.selectedItem.Id,3).then(function (success) {
																return success.data;
															},function () {
																return null;
															});
															$q.all([latestBudgetRate,latestProjRate,latestExchRate]).then(function (data) {
																let foundCurrency = null;
																if(data[0]){
																	foundCurrency = data[0];
																}else if(data[1]){
																	foundCurrency = data[1];
																}else if(data[2]){
																	foundCurrency = data[2];
																}
																if(foundCurrency){
																	args.entity.EstHeader.ExchangeRate2 = foundCurrency.Rate;
																}
															});
														}
													});
												}
											}else{
												args.entity.EstHeader.BasCurrency2Fk = null;
												args.entity.EstHeader.ExchangeRate2 = null;
											}
										}
									}
								]

							}),
							'estheader.versionno': {
								'readonly': true
							}
						}
					};
				}
			};
		}
	]);
})(angular);

