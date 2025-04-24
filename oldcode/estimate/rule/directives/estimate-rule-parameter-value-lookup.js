(function (angular) {
	'use strict';
	let moduleName = 'estimate.rule';
	angular.module(moduleName).directive('estimateRuleParameterValueLookup',
		['$q','$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateRuleParameterValueLookupService','estimateRuleParameterConstant',
			function ($q,$injector, BasicsLookupdataLookupDirectiveDefinition, estimateRuleParameterValueLookupService,estimateRuleParameterConstant) {
				let defaults = {
					lookupType: 'RuleParameterValueLookup',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {

								let selectedDataItem = args.entity;
								if (args.selectedItem) {
									if (selectedDataItem.ValueType === estimateRuleParameterConstant.Text || selectedDataItem.ValueType === estimateRuleParameterConstant.TextFormula) {

										selectedDataItem.EstRuleParamValueEntity = args.selectedItem;
										selectedDataItem.EstRuleParamValueFk = args.selectedItem.Id;
										selectedDataItem.ActualValue = args.selectedItem.Value;

										if (selectedDataItem.ValueType === estimateRuleParameterConstant.TextFormula) {
											selectedDataItem.ValueText = selectedDataItem.ValueText ? selectedDataItem.ValueText + '+' + args.selectedItem.DescriptionInfo.Translated :  args.selectedItem.DescriptionInfo.Translated;
											selectedDataItem.ValueDetail = selectedDataItem.ValueDetail ? selectedDataItem.ValueDetail + '+' + args.selectedItem.ValueDetail :  args.selectedItem.ValueDetail;

											$injector.get('estimateRuleParameterService').gridRefresh();
											$injector.get('estimateRuleParameterService').markItemAsModified(selectedDataItem);
										}else{
											selectedDataItem.ValueText = args.selectedItem.ValueDetail;
											selectedDataItem.ValueDetail = args.selectedItem.ValueDetail;
										}
									} else {
										selectedDataItem.ValueDetail = args.selectedItem.ValueDetail;
										selectedDataItem.EstRuleParamValueFk = args.selectedItem.Id;
										selectedDataItem.EstRuleParamValueEntity = args.selectedItem;
										selectedDataItem.ActualValue = args.selectedItem.Value;
									}

								}
							}
						}
					],
					onDataRefresh: function ($scope) {
						estimateRuleParameterValueLookupService.getList($scope.entity).then(function (data) {
							if (data) {
								$scope.refreshData(data);
							}
						});
					}
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					//  dataProvider: 'estimateRuleParameterValueLookupService'
					dataProvider: {
						getList: function (config,scope) {
							return estimateRuleParameterValueLookupService.getList(scope.entity);
						},
						getItemByKey: function (key) {
							return estimateRuleParameterValueLookupService.getItemByKey(key);
						},
						getSearchList: function () {
							return estimateRuleParameterValueLookupService.getSearchList();
						},
						getDisplayItem: function (value) {
							return estimateRuleParameterValueLookupService.getItemByIdAsync(value);
						}
					}
				});
			}]);

})(angular);
