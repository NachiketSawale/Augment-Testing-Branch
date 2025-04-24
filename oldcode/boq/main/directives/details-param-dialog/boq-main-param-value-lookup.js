/**
 * Created by zos on 3/15/2018.
 */

(function (angular) {
	/* global _ */ 
	'use strict';
	var moduleName = 'boq.main';
	angular.module(moduleName).directive('boqMainParameterValueLookup',
		['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'boqMainParameterValueLookupService', 'boqMainDetailsParamListDataService', 'estimateRuleParameterConstant',
			function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition, boqMainParameterValueLookupService, boqMainDetailsParamListDataService, estimateRuleParameterConstant) {
				var defaults = {
					lookupType: 'EstMainParameterValues',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								var selectedDataItem = args.entity;
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
						boqMainParameterValueLookupService.forceReload().then(function (response) {
							var selectItem = boqMainDetailsParamListDataService.getSelected();

							var data = _.filter(response.data, function (item) {
								if (selectItem.Code === item.Code && selectItem.ValueType === item.ValueType) {
									return true;
								}
							});
							boqMainParameterValueLookupService.setLookupData(response.data);
							data = _.sortBy(data, 'Sorting');
							$scope.refreshData(data);
						});
					}
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {

						getList: function (config, scope) {
							return boqMainParameterValueLookupService.getListAsync(config, scope);
						},

						getItemByKey: function (value) {
							return boqMainParameterValueLookupService.getItemByIdAsync(value);
						},

						getDisplayItem: function (value) {
							return boqMainParameterValueLookupService.getItemByIdAsync(value);
						},

						getSearchList: function (value) {
							return boqMainParameterValueLookupService.getSearchList(value);
						}
					}
				});
			}]);

})(angular);
