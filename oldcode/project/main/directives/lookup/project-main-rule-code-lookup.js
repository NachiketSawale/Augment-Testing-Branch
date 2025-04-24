(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).directive('projectMainRuleCodeLookup',
		['$q', '$injector', 'platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDescriptorService', 'projectMainRuleCodeLookupService', 'estimateProjectEstimateRulesService',
			function ($q, $injector, platformGridAPI, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupDescriptorService, projectMainRuleCodeLookupService, estimateProjectEstimateRulesService) {

				var defaults = {
					lookupType: 'prjRuleCode',
					valueMember: 'Code',
					displayMember: 'Code',
					onDataRefresh: function ($scope) {
						projectMainRuleCodeLookupService.getEstRuleCodeItems().then(function (response) {
							if (!!response && response.data) {

								var output = [];
								$injector.get('cloudCommonGridService').flatten(response.data, output, 'EstRules');

								basicsLookupdataLookupDescriptorService.updateData('estRuleCodeItems', output);
								var prjEstRuleList = estimateProjectEstimateRulesService.getList();
								if (prjEstRuleList && prjEstRuleList.length > 0) {
									if (prjEstRuleList.length > 0) {
										var filterData = [];
										_.forEach(output, function (estRule) {
											var rule = _.filter(prjEstRuleList, {'Code': estRule.Code});
											if (rule && rule.length === 0) {
												filterData.push(estRule);
											}
										});
										$scope.refreshData(filterData);
									} else {
										$scope.refreshData(output);
									}
								}
							}
						});
					},
					regex: '^[\\s\\S]{0,24}$'
					/*events: [{
						 name: 'onSelectedItemChanged', //register event and event handler here.
						 handler: function (e, args) {

						 }
					}]*/
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							return projectMainRuleCodeLookupService.getList().then(function (response) {
								var prjEstRuleList = estimateProjectEstimateRulesService.getList();
								if (prjEstRuleList && prjEstRuleList.length > 0) {
									if (prjEstRuleList.length > 0) {
										var filterData = [];
										_.forEach(response, function (estRule) {
											var rule = _.filter(prjEstRuleList, {'Code': estRule.Code});
											if (rule && rule.length === 0) {
												filterData.push(estRule);
											}
										});
										return filterData;
									} else {
										return response;
									}
								}
							});
						}
					}
				});
			}]);
})(angular);
