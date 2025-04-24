/*
 * Created by alm on 01.25.2021.
 */


(function (angular) {
	/* global globals */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
     * @ngdoc service
     * @name hsqeCheckListLocationDataService
     * @function
     *
     * @description
     * Provides some information on all containers in the module.
     */
	angular.module(moduleName).factory('hsqeCheckListLocationDataService', ['$injector', '$translate','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService','hsqeCheckListDataService','basicsCommonMandatoryProcessor','hsqeCheckListLocationReadonlyProcessor',
		function ($injector, $translate, dataServiceFactory, lookupDescriptorService, cloudDesktopSidebarService, parentService,basicsCommonMandatoryProcessor,readonlyProcessor) {

			var service;
			var factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'hsqeCheckListLocationDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/location/'
					},
					entityRole: {
						leaf: {itemName: 'Location', parentService: parentService}
					},
					dataProcessor:[readonlyProcessor],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = parentService.getSelected();
								creationData.mainItemId = selected.Id;
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						},
						canDeleteCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						}
					}
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(factoryOptions);
			service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'HsqCheckList2LocationDto',
				moduleSubModule: 'Hsqe.CheckList',
				validationService: 'hsqeCheckListLocationValidationService',
				mustValidateFields: ['PrjLocationFk']
			});
			return service;
		}
	]);
})(angular);
