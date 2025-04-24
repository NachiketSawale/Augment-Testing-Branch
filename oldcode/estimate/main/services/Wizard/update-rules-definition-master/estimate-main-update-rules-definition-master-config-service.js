/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals */

	'use strict';

	let modulename = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainUpdateRulesDefinitionMasterConfigService
     * @description configuration to show dialog for Update rules definition master service wizard.
     */
	angular.module(modulename).service('estimateMainUpdateRulesDefinitionMasterConfigService', ['$http','$translate','$injector','platformDataValidationService','basicsLookupdataConfigGenerator',
		function ($http,$translate,$injector,platformDataValidationService,basicsLookupdataConfigGenerator) {
			let service = {
				getFormConfig: getFormConfig,
			};

			function getFormConfig() {
				let formConfig = {
					title: $translate.instant('estimate.main.updateRules'),
					fid: 'estimate.main.updateRules',
					version: '1.0.0',
					showGrouping: false,
					change: 'change',
					overloads: {},
					skipPermissionCheck: true,
					addValidationAutomatically: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes:[]
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid:'createUpdateRule',
							label: '',
							type: 'radio',
							model: 'isCreateUpdateRule',
							sortOrder:1,
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'baseGroup1',
								items: [
									{
										Id: 1,
										Description: $translate.instant('estimate.main.createRule'),
										Value: 'IsCreateRule'
									},
									{
										Id: 2,
										Description: $translate.instant('estimate.main.updateExistingRules'),
										Value: 'IsUpdateRule'
									}]
							}
						},
						{
							rid: 'code',
							gid: 'baseGroup',
							label: 'Code',
							label$tr$: 'cloud.common.entityCode',
							model: 'Code',
							type: 'code',
							required: true,
							sortOrder: 2,
							asyncValidator: function(entity, value, model){
								let postData = {
									Id: 0,
									Code: value,
									MdcLineItemContextFk: $injector.get('estimateMainRuleDataService').getSelected().MdcLineItemContextFk
								};

								let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model,$injector.get('estimateRuleComboService'));

								asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/isuniquecode', postData).then(function (response) {
									let res = {};
									if (response.data) {
										res.valid = true;
									} else {
										res.valid = false;
										res.apply = true;
										res.error = '...';
										res.error$tr$ = 'estimate.rule.errors.uniqCode';
									}
									return res;
								});
								return asyncMarker.myPromise;
							}
						},
						{
							rid: 'description',
							gid: 'baseGroup',
							label: 'Description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							sortOrder: 3
						},
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'estimateRuleLookupDataService',
							showClearButton: true,
							enableCache: true
						},
						{
							gid: 'baseGroup',
							rid: 'ruleLookup',
							label: 'Rules Master',
							label$tr$: 'estimate.main.rulesMaster',
							model: 'rulesMasterTargetId',
							sortOrder: 4
						})
					]
				};
				return formConfig;
			}
			return service;
		}
	]);
})();
