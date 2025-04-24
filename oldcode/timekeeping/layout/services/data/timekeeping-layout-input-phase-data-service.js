/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.layout');

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutInputPhaseDataService
	 * @description pprovides methods to access, create and update timekeeping layout inputPhase entities
	 */
	myModule.service('timekeepingLayoutInputPhaseDataService', TimekeepingLayoutInputPhaseDataService);

	TimekeepingLayoutInputPhaseDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingLayoutConstantValues', 'timekeepingLayoutInputPhaseGroupDataService'];

	function TimekeepingLayoutInputPhaseDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingLayoutConstantValues, timekeepingLayoutInputPhaseGroupDataService) {
		var self = this;
		var timekeepingLayoutInputPhaseServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingLayoutInputPhaseDataService',
				entityNameTranslationID: 'timekeeping.layout.timekeepingLayoutInputPhaseEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'timekeeping/layout/inputPhase/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/layout/inputPhase/',
					endRead: 'listByParent',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						var selected = timekeepingLayoutInputPhaseGroupDataService.getSelected();
						readData.filter = '?phaseGroupId=' + (selected ? selected.Id : 0);
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingLayoutConstantValues.schemes.inputPhase)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingLayoutInputPhaseGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'InputPhases', parentService: timekeepingLayoutInputPhaseGroupDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingLayoutInputPhaseServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingLayoutInputPhaseValidationService'
		}, timekeepingLayoutConstantValues.schemes.inputPhase));
	}
})(angular);
