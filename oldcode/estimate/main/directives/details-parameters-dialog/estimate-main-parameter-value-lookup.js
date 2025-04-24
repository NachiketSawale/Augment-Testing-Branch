/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainParameterValueLookup',
		['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition','estimateMainParameterValueLookupService', 'estimateMainDetailsParamListDataService','estimateRuleParameterConstant',
			function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition,estimateMainParameterValueLookupService, estimateMainDetailsParamListDataService,estimateRuleParameterConstant) {
				let defaults = {
					lookupType: 'EstMainParameterValues',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								let selectedDataItem = args.entity;

								if (selectedDataItem.ValueType === estimateRuleParameterConstant.Text) {
									selectedDataItem.ParameterText = args.selectedItem.ValueText;
									selectedDataItem.ValueDetail = args.selectedItem.ValueText;
								} else {

									if (args.selectedItem !== null) {
										selectedDataItem.ParameterValue = args.selectedItem.Value;
										selectedDataItem.ValueDetail = args.selectedItem.ValueDetail;
									}
								}
							}
						}
					],
					onDataRefresh: function ($scope) {
						estimateMainParameterValueLookupService.forceReload().then(function (respone) {
							let selectItem = null;
							let isParam = $injector.get('estimateParamDataService').getIsParam();
							let isEstimate = $injector.get('estimateMainService').getIsEstimate();
							if (isParam) {
								selectItem = $injector.get('estimateParamDataService').getSelectParam();
							} else if ($injector.get('estimateAssembliesService').getIsAssembly()) {
								selectItem = $injector.get('estimateAssembliesDetailsParamListDataService').getSelected();
							} else if (isEstimate) {
								selectItem = estimateMainDetailsParamListDataService.getSelected();
							}

							if (!selectItem) {
								selectItem = $scope.entity;
							}

							// if current container is LineItem Parameter Container then take the $scope.entity
							selectItem === $scope.entity.isLineItemParamContainerParam ? $scope.entity : selectItem;

							let data = _.filter(respone.data, function (item) {
								if (selectItem && selectItem.Code.toLowerCase() === item.Code.toLowerCase() && selectItem.ValueType === item.ValueType) {
									return true;
								}
							});
							estimateMainParameterValueLookupService.setLookupData(respone.data);
							data = _.sortBy(data, 'Sorting');
							$injector.get('estimateParamComplexLookupCommonService').mergeCusParamValue(selectItem, data);
							$scope.refreshData(data);
						});
					}
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {

						getList: function (config, scope) {
							return estimateMainParameterValueLookupService.getListAsync(scope.entity);
						},

						getItemByKey: function (value) {
							return estimateMainParameterValueLookupService.getItemByIdAsync(value);
						},

						getDisplayItem: function (value) {
							return estimateMainParameterValueLookupService.getItemByIdAsync(value);
						},

						getSearchList: function (value) {
							return estimateMainParameterValueLookupService.getSearchList(value);
						}
					},
					controller: ['$scope', '$translate', '$', '$http', 'platformModalService', 'qtoMainHeaderCreateDialogDataService', 'estimateRuleCreateParameterValueDialogService',
						function ($scope, $translate, $, $http, platformModalService, qtoMainHeaderCreateDialogDataService, estimateRuleCreateParameterValueDialogService) { // do external logic to specific lookup directive controller here.

							let lookupButtonStyle = {'background-size': '15px 15px'}; // IE had problems. Therefore this solution

							let execute = function (/* event, editValue */) {
								estimateRuleCreateParameterValueDialogService.showDialog($scope.entity).then(function(result){
									if(result.ok){
										let data = result.data;
										$http.post(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/tosaveparametervalues', data).then(function (response) {
											return response;
										}
										);
									}
								});
							};

							$.extend($scope.lookupOptions, {
								extButtons: [
									{
										class: ' tlb-icons ico-new',
										style: lookupButtonStyle,
										execute: execute,
										canExecute: function(){
											return true;
										}
									}
								]
							});
						}]
				});
			}]);

})(angular);
