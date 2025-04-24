/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.period');

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodDataService
	 * @description provides methods to access, create and update timekeeping period  entities
	 */
	myModule.service('timekeepingPeriodDataService', TimekeepingPeriodDataService);

	TimekeepingPeriodDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingPeriodConstantValues'];

	function TimekeepingPeriodDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingPeriodConstantValues) {

		var self = this;
		var timekeepingPeriodServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'timekeepingPeriodDataService',
				entityNameTranslationID: 'timekeeping.period.timekeepingPeriodEntity',
				httpCRUD: {route: globals.webApiBaseUrl + 'timekeeping/period/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PeriodDto',
					moduleSubModule: 'Timekeeping.Period'
				})],
				entityRole: {root: {itemName: 'Periods', moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingPeriod'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'timekeeping.period',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: null,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				},
				translation: {
					uid: 'timekeepingPeriodDataService',
					title: 'timekeeping.period.timekeepingPeriodEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: {
						typeName: 'PeriodDto',
						moduleSubModule: 'Timekeeping.Period'
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingPeriodServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingPeriodValidationService'
		}, timekeepingPeriodConstantValues.schemes.period));
	}
})(angular);
