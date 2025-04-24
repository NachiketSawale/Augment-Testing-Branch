/**
 * $Id: $
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.parameter';

	angular.module (moduleName).service ('estimateMainParamSourceLookupDataService', ['$http', '$q', '$injector', '$translate', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'estimateMainParamStructureConstant',

		function ($http, $q, $injector, $translate, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, estimateMainParamStructureConstant) {

			let service = {
				getList: getFilteredList,
				getListSync: getListSync,
				getListAsync: getListAsync,
				getItemById: getItemByVal,
				getItemByKey: getItemByVal,
				getItemByIdAsync: getItemByIdAsync,
			};

			let strctContextItems = [
				{
					Id: estimateMainParamStructureConstant.ProjectParam, Code: 'Project', DescriptionInfo: {
						Description: 'ProjectParam',
						Translated: $translate.instant ('estimate.parameter.projectParam')
					}
				},
				{
					Id: estimateMainParamStructureConstant.GlobalParam, Code: 'Global', DescriptionInfo: {
						Description: 'GlobalParam',
						Translated: $translate.instant ('estimate.parameter.globalParam')
					}
				},
				{
					Id: estimateMainParamStructureConstant.RuleParameter, Code: 'Rule', DescriptionInfo: {
						Description: 'RuleParameter',
						Translated: $translate.instant ('estimate.parameter.ruleParameter')
					}
				}
			];

			function getListSync() {
				return strctContextItems;
			}

			function getFilteredList() {
				return $q.when (strctContextItems);
			}

			function getListAsync() {
				return getFilteredList ();
			}

			function getItemByVal(value) {
				let item = _.find (strctContextItems, {Id: value});
				return item;
			}

			function getItemByIdAsync(value) {
				return getItemByVal (value);
			}

			return service;
		}]);
})(angular);
