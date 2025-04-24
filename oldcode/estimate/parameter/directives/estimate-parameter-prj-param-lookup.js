/**
 * Created by wul on 7/31/2018.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.parameter';
	angular.module(moduleName).directive('estimateParameterPrjParamLookup',
		['_', '$q','$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateParamLookupDataService','basicsLookupdataLookupDescriptorService', 'estimateParamComplexLookupCommonService',
			function (_, $q, $injector,BasicsLookupdataLookupDirectiveDefinition, estimateParamLookupDataService,basicsLookupdataLookupDescriptorService, estimateParamComplexLookupCommonService) {
				let defaults = {
					lookupType: 'estimateParameterPrjParamLookup',
					valueMember: 'Code',
					displayMember: 'Code',
					onDataRefresh: function ($scope) {
						estimateParamLookupDataService.getEstMainParameters().then(function (response) {
							if(!!response && response.data){
								let res = _.filter(response.data, function (item) {
									return item.IsLive === true;
								});
								basicsLookupdataLookupDescriptorService.updateData('EstMainParameters',res);
								$scope.refreshData(res);
							}
						});
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if(args.selectedItem.Islookup){
									args.selectedItem.ValueType = args.selectedItem.ParamvaluetypeFk ? args.selectedItem.ParamvaluetypeFk : args.selectedItem.ValueType;
									estimateParamComplexLookupCommonService.cusParameterValueAssignments(args.selectedItem, true);
								}
							}
						}
					]
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							return estimateParamLookupDataService.getList().then(function(response){
								return _.filter(response.data, function (item) {
									return item.IsLive === true;
								});
							});
						}
					}
				});
			}]);

})(angular);
