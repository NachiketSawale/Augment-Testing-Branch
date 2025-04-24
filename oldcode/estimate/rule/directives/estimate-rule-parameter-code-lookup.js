/**
 * Created by lnt on 4/30/2019.
 */

(function (angular) {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc service
	 * @name estimateRuleParameterCodeLookup
	 * @function
	 * @description
	 * estimateRuleParameterCodeLookup: Lookup for param code.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('estimateRuleParameterCodeLookup',
		['$q','$injector', 'platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition','basicsLookupdataLookupDescriptorService', 'estimateRuleParameterCodeLookupService',
			function ($q, $injector, platformGridAPI, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupDescriptorService, estimateRuleParameterCodeLookupService) {

				let isMasterRuleModule = false;

				function checkIfIsMasterRuleModule() {
					isMasterRuleModule = platformGridAPI.grids.exist('70901a01659e4365a0845f63f01843cb');
				}

				let defaults = {
					lookupType: 'parameterCode',
					valueMember: 'Code',
					displayMember: 'Code',
					onDataRefresh: function ($scope) {
						checkIfIsMasterRuleModule();
						if(isMasterRuleModule) {
							estimateRuleParameterCodeLookupService.getEstMainParameters().then(function (response) {
								if (!!response && response.data) {
									let res = _.filter(response.data, function (item) {
										return item.IsLookup === true;
									});
									basicsLookupdataLookupDescriptorService.updateData('parameterCode', res);
									$scope.refreshData(res);
								}
							});
						}
						else {
							estimateRuleParameterCodeLookupService.getPrjEstMainParameters().then(function (response) {
								if (!!response && response.data) {
									let res = _.filter(response.data, function (item) {
										return item.IsLookup === true;
									});
									basicsLookupdataLookupDescriptorService.updateData('prjparameterCode', res);
									$scope.refreshData(res);
								}
							});
						}
					},
					events: [
						{
							name: 'onSelectedItemChanged', // register event and event handler here.
							handler: function (e, args) {
								checkIfIsMasterRuleModule();
								let selectedItem = args.selectedItem;
								if(isMasterRuleModule) {
									let parameterValueService = $injector.get('estimateRuleParameterValueService');
									let selectedparameterValue = parameterValueService.getSelected();
									selectedparameterValue.ValueType = selectedItem.ValueType;
									parameterValueService.markItemAsModified(selectedparameterValue);
								}
								else {
									let prjParameterValueService = $injector.get('estimateProjectEstRuleParameterValueService');
									let selectedPrjParameterValue = prjParameterValueService.getSelected();
									selectedPrjParameterValue.ValueType = selectedItem.ValueType;
									prjParameterValueService.markItemAsModified(selectedPrjParameterValue);
								}
							}
						}]
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							checkIfIsMasterRuleModule();
							if(isMasterRuleModule) {
								return estimateRuleParameterCodeLookupService.getList().then(function (response) {
									return _.filter(response.data, function (item) {
										return item.IsLookup === true;
									});
								});
							}
							else {
								return estimateRuleParameterCodeLookupService.getListByPrj().then(function (response) {
									return _.filter(response.data, function (item) {
										return item.IsLookup === true;
									});
								});
							}
						}
					}
				});
			}]);

})(angular);
