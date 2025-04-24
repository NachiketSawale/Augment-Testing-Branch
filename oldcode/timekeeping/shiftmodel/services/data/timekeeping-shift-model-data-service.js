/**
 * Created by leo on 02.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeDataService
	 * @function
	 *
	 * @description
	 * timekeepingEmployeeDataService is the data service for all employee related functionality.
	 */
	let moduleName= 'timekeeping.shiftmodel';
	let shiftModule = angular.module(moduleName);
	shiftModule.factory('timekeepingShiftModelDataService', ['$http', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		function ($http, platformDataServiceFactory, mandatoryProcessor) {

			let factoryOptions = {
				flatRootItem: {
					module: shiftModule,
					serviceName: 'timekeepingShiftModelDataService',
					entityNameTranslationID: 'timekeeping.shiftmodel.entityShift',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/shiftmodel/', endRead: 'filtered', endDelete: 'multidelete', usePostForRead: true
					},
					entitySelection: { supportsMultiSelection: true },
					entityRole: {
						root: {
							itemName: 'Shifts',
							moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingShiftModel',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true
						}
					},
					translation: {
						uid: 'timekeepingShiftModelDataService',
						title: 'timekeeping.shiftmodel.entityShift',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ShiftDto',
							moduleSubModule: 'Timekeeping.ShiftModel'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'ShiftDto',
				moduleSubModule: 'Timekeeping.ShiftModel',
				validationService: 'timekeepingShiftModelValidationService'
			});

			let service = serviceContainer.service;
			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
			};

			service.createDeepCopy = function createDeepCopy() {
				let command = {
					Action: 4,
					Shifts: [ service.getSelected() ]
				};

				$http.post(globals.webApiBaseUrl + 'timekeeping/shiftmodel/execute', command)
					.then(function (response) {
						serviceContainer.data.handleOnCreateSucceeded(response.data.Shifts[0], serviceContainer.data);
					},
					function (/* error */) {
					});
			};

			return service;
		}]);
})(angular);
