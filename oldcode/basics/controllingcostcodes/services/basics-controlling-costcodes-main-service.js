/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'basics.controllingcostcodes';
	let serviceName = 'basicsControllingCostCodesMainService';

	angular.module(moduleName).factory('basicsControllingCostCodesMainService', ['platformDataServiceFactory', 'platformModalService',
		'basicsCommonMandatoryProcessor', 'basicsLookupdataLookupDescriptorService',
		function (platformDataServiceFactory, platformModalService,
			basicsCommonMandatoryProcessor, basicsLookupdataLookupDescriptorService) {
			let controllingCostCodeService = {
				hierarchicalRootItem: {
					module: moduleName,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.controllingcostcodes.controllingCostCodes',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/controllingcostcodes/', endRead: 'treefiltered', usePostForRead: true
					},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'ContrCostCodes',
							moduleName: 'cloud.desktop.moduleDisplayNameControllingCostCodes',
							handleUpdateDone: function (updateData, response, data) {
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								basicsLookupdataLookupDescriptorService.removeData('ControllingCostCode');
							}
						}
					},
					presenter: {
						tree: {
							parentProp: 'ContrCostCodeParentFk', childProp: 'ContrCostCodeChildrens'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: false,
							showProjectContext: false,
							withExecutionHints: true
						}
					},
					translation: {
						uid: serviceName,
						title: 'basics.controllingcostcodes.controllingCostCodes',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}]
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(controllingCostCodeService);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ContrCostCodeDto',
				moduleSubModule: 'Basics.ControllingCostCodes',
				validationService: 'basicsControllingCostCodesValidationService'
			});

			return serviceContainer.service;
		}]);

})(angular);