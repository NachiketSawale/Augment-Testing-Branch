/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'basics.controllingcostcodes';
	let serviceName = 'basicsControllingCostCodesAccountService';

	angular.module(moduleName).factory('basicsControllingCostCodesAccountService', ['basicsControllingCostCodesMainService','platformDataServiceFactory', 'platformModalService',
		'basicsCommonMandatoryProcessor',
		function (basicsControllingCostCodesMainService,platformDataServiceFactory, platformModalService,
			basicsCommonMandatoryProcessor) {

			let canAccount = function canAccount() {
				let selectedContrCostCode = basicsControllingCostCodesMainService.getSelected();
				return !!selectedContrCostCode;
			};

			let controllingCostCodeServiceOption = {
				flatNodeItem: {
					module: moduleName,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.controllingcostcodes.account',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/controllingcostcodes/account/', endCreate: 'create' },
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/controllingcostcodes/account/',
						initReadData: function initReadData(readData) {
							let selectedItem = basicsControllingCostCodesMainService.getSelected();
							readData.MdcContrCostCodeFk = selectedItem.Id;
						},
						usePostForRead: true
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/controllingcostcodes/account/', endUpdate: 'update'},
					actions: { create: 'flat', canCreateCallBackFunc: canAccount,  delete: {}, canDeleteCallBackFunc: canAccount },
					entitySelection: {},
					setCellFocus:true,
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedContrCostCodeItem = basicsControllingCostCodesMainService.getSelected();
								let selectedItem = serviceContainer.service.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.MdcContrCostCodeFk = selectedItem.MdcContrCostCodeFk;
								}
								else if (selectedContrCostCodeItem && selectedContrCostCodeItem.Id > 0) {
									creationData.MdcContrCostCodeFk = selectedContrCostCodeItem.Id;
								}
							},
							handleCreateSucceeded : function(newData){
								return newData;
							}
						}
					},
					entityRole: { node: { itemName: 'Account2MdcContrCost', moduleName: 'Controlling CostCodes',  parentService: basicsControllingCostCodesMainService}},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: null,
							showOptions: false,
							showProjectContext: false,
						}
					},
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(controllingCostCodeServiceOption);
			let service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Account2MdcContrCostDto',
				moduleSubModule: 'Basics.ControllingCostCodes',
				validationService: 'basicsControllingCostCodesAccountValidationService'
			});

			service.hasToLoadOnSelectionChange = function hasToLoadOnSelectionChange(mdccontrcostcode) {
				if(mdccontrcostcode){
					serviceContainer.data.doNotLoadOnSelectionChange = false;
				}
			};

			let baseOnDeleteDone = serviceContainer.data.onDeleteDone;

			serviceContainer.data.onDeleteDone = function(deleteParams, data, response){
				baseOnDeleteDone(deleteParams, data, response); // remove the deleted item form list
				service.gridRefresh(); // Refresh UI to clear validation marks
			};

			return serviceContainer.service;
		}]);

})(angular);