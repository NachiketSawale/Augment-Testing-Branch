/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.layout');

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutInputPhaseTimeSymbolDataService
	 * @description pprovides methods to access, create and update timekeeping layout inputPhaseTimeSymbol entities
	 */
	myModule.service('timekeepingLayoutInputPhaseTimeSymbolDataService', TimekeepingLayoutInputPhaseTimeSymbolDataService);

	TimekeepingLayoutInputPhaseTimeSymbolDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingLayoutConstantValues', 'timekeepingLayoutInputPhaseDataService'];

	function TimekeepingLayoutInputPhaseTimeSymbolDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingLayoutConstantValues, timekeepingLayoutInputPhaseDataService) {
		var self = this;
		var timekeepingLayoutInputPhaseTimeSymbolServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingLayoutInputPhaseTimeSymbolDataService',
				entityNameTranslationID: 'timekeeping.layout.timekeepingLayoutInputPhaseTimeSymbolEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/layout/inputphasetimesymbol/',
					endRead: 'listByParent',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						var selected = timekeepingLayoutInputPhaseDataService.getSelected();
						readData.filter = '?phaseId=' + (selected ? selected.Id : 0);
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingLayoutConstantValues.schemes.inputPhaseTimeSymbol)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingLayoutInputPhaseDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'InputPhase2TimeSymbols',
						parentService: timekeepingLayoutInputPhaseDataService
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingLayoutInputPhaseTimeSymbolServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingLayoutInputPhaseTimeSymbolValidationService'
		}, timekeepingLayoutConstantValues.schemes.inputPhaseTimeSymbol));
	}
})(angular);
