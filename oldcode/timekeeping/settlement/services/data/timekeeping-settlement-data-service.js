/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.settlement');

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementDataService
	 * @description provides methods to access, create and update timekeeping settlement  entities
	 */
	myModule.service('timekeepingSettlementDataService', TimekeepingSettlementDataService);

	TimekeepingSettlementDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingSettlementConstantValues'];

	function TimekeepingSettlementDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingSettlementConstantValues) {
		let self = this;

		let timekeepingSettlementServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'timekeepingSettlementDataService',
				entityNameTranslationID: 'timekeeping.settlement.settlementEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/settlement/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'TimekeepingSettlementDto',
					moduleSubModule: 'Timekeeping.Settlement'
				})],
				entityRole: {root: {itemName: 'Settlement', moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingSettlement'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				actions: {delete: true, create: 'flat'},
				sidebarSearch: {
					options: {
						moduleName: 'timekeeping.settlement',
						enhancedSearchEnabled: false,
						enhancedSearchVersion: '2.0',
						includeDateSearch: null,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingSettlementServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingSettlementValidationService'
		}, timekeepingSettlementConstantValues.schemes.settlement));
	}
})(angular);
