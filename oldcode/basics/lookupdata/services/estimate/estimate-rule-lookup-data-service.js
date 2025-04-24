/**
 * $Id: estimate-rule-lookup-data-service.js joshi $
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateRuleLookupDataService
	 * @function
	 *
	 * @description
	 * This is the data service for estimate project rule code lookup
	 * */
	angular.module('estimate.rule').factory('estimateRuleLookupDataService', ['platformLookupDataServiceFactory','ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateRuleLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'icon',
						field: 'Icon',
						name: 'Icon',
						width: 100,
						toolTip: 'Icon',
						editor: null,
						formatter: 'imageselect',
						formatterOptions: {
							serviceName: 'basicsCustomizeRuleIconService'
						},
						name$tr$: 'cloud.common.entityIcon'
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 120,
						name$tr$: 'cloud.common.entityCode',
						toolTip: 'Code'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription',
						toolTip: 'Description'
					},
					{
						id: 'comment',
						field: 'Comment',
						name: 'Comment',
						width: 300,
						toolTip: 'Comment',
						formatter: 'comment',
						name$tr$: 'cloud.common.entityComment'
					}
				],
				uuid: '46a439931b444c41a99abaaf4a9a15be'
			});

			let estimateRuleLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/rule/estimaterule/', endPointRead: 'treeWithoutFilter', usePostForRead: true},
				tree:{
					parentProp: 'EstRuleFk',
					childProp: 'EstRules',
					initialState: 'expanded',
					hierarchyEnabled: true,
					childSort: true,
					isInitialSorted: true,
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true}
				},
				dataIsAlreadySorted: true,
				dataProcessor: [new ServiceDataProcessArraysExtension(['EstRules'])],
			};

			return platformLookupDataServiceFactory.createInstance(estimateRuleLookupDataServiceConfig).service;

		}]);
})(angular);
