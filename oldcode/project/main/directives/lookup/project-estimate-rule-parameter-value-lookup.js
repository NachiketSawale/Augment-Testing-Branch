(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).directive('projectEstimateRuleParameterValueLookup',
		['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'projectEstimateRuleParameterValueLookupService', 'estimateRuleParameterConstant',
			function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition, projectEstimateRuleParameterValueLookupService, estimateRuleParameterConstant) {
				var defaults = {
					lookupType: 'PrjRuleParameterValueLookup',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								var selectedDataItem = args.entity;
								if (args.selectedItem !== null) {
									if (selectedDataItem.ValueType === estimateRuleParameterConstant.Text || selectedDataItem.ValueType === estimateRuleParameterConstant.TextFormula) {
										selectedDataItem.ParameterText = args.selectedItem.ValueText;
										selectedDataItem.EstRuleParamValueEntity = args.selectedItem;
										selectedDataItem.EstRuleParamValueFk = args.selectedItem.Id;
										selectedDataItem.ActualValue = args.selectedItem.Value;

										if (selectedDataItem.ValueType === estimateRuleParameterConstant.TextFormula) {
											selectedDataItem.ValueText = selectedDataItem.ValueText ? selectedDataItem.ValueText + '+' + args.selectedItem.DescriptionInfo.Translated : args.selectedItem.DescriptionInfo.Translated;
											selectedDataItem.ValueDetail = selectedDataItem.ValueDetail ? selectedDataItem.ValueDetail + '+' + args.selectedItem.ValueDetail : args.selectedItem.ValueDetail;
											$injector.get('estimateProjectEstRuleParamService').gridRefresh();
											$injector.get('estimateProjectEstRuleParamService').markItemAsModified(selectedDataItem);
										} else {
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
						if($scope.options && _.isString($scope.options.paramValueDataServiceName)){
							let paramValueService = $injector.get($scope.options.paramValueDataServiceName);
							paramValueService.refreshLookupData();
						}

						projectEstimateRuleParameterValueLookupService.getList($scope.entity).then(function (data) {
							if (data) {
								$scope.refreshData(data);
							}
						});
					}
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function (config, scope) {
							return projectEstimateRuleParameterValueLookupService.getList(scope.entity);
						},
						getItemByKey: function (key) {
							return projectEstimateRuleParameterValueLookupService.getItemByKey(key);
						},
						getSearchList: function () {
							return projectEstimateRuleParameterValueLookupService.getSearchList();
						},
						getDisplayItem: function (value) {
							return projectEstimateRuleParameterValueLookupService.getItemByIdAsync(value);
						}
					}
				});
			}]);

})(angular);
