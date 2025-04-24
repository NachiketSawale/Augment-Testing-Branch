/**
 * Created by jhe on 1/11/2019.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	var module = angular.module(moduleName);
	module.factory('procurementContractCrewDataService', ['globals', 'procurementContractHeaderDataService', 'platformDataServiceFactory','basicsCommonMandatoryProcessor',
		'procurementContractCrewFilterService','procurementContextService',

		function (globals, procurementContractHeaderDataService, platformDataServiceFactory, mandatoryProcessor,
			filterService, procurementContextService) {
			var service;
			var sortId;
			var factoryOptions = {
				flatLeafItem: {
					module: module,
					serviceName: 'procurementContractCrewDataService',
					entityNameTranslationID: 'procurement.contract.entityCrew',
					httpCreate: { route: globals.webApiBaseUrl + 'procurement/contract/conCrew/', endCreate: 'createcrew' },
					httpRead: { route: globals.webApiBaseUrl + 'procurement/contract/conCrew/',
						endRead: 'list'},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'Crew', parentService: procurementContractHeaderDataService}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = procurementContractHeaderDataService.getSelected();
								creationData.ConHeaderFk = selected.Id;
								creationData.IsLive = true;
								var CurrentDtos = service.getList();
								if (CurrentDtos.length === 0) {
									creationData.Sorting = 1;
								}
								else {
									CurrentDtos.sort(sortId);
									creationData.Sorting = CurrentDtos[CurrentDtos.length - 1].Sorting + 1;
								}
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'ConCrewDto',
				moduleSubModule: 'Procurement.Contract',
				validationService: 'procurementContractCrewValidationService',
				mustValidateFields: ['DescriptionInfo','Sorting']
			});

			service = serviceContainer.service;

			// filters register and un-register, it will call by the contract-module.js
			service.registerFilters = function () {
				filterService.registerFilters();
			};

			// unload filters
			service.unRegisterFilters = function () {
				filterService.unRegisterFilters();
			};

			sortId = function (a, b) {
				return a.Sorting - b.Sorting;
			};

			return service;

		}]);
})(angular);
