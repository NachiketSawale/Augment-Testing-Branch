/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.layout');

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutInputPhaseGroupDataService
	 * @description pprovides methods to access, create and update timekeeping layout inputPhaseGroup entities
	 */
	myModule.service('timekeepingLayoutInputPhaseGroupDataService', TimekeepingLayoutInputPhaseGroupDataService);

	TimekeepingLayoutInputPhaseGroupDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingLayoutConstantValues', 'timekeepingLayoutUserInterfaceLayoutDataService'];

	function TimekeepingLayoutInputPhaseGroupDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingLayoutConstantValues, timekeepingLayoutUserInterfaceLayoutDataService) {
		var self = this;
		var timekeepingLayoutInputPhaseGroupServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingLayoutInputPhaseGroupDataService',
				entityNameTranslationID: 'timekeeping.layout.timekeepingLayoutInputPhaseGroupEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'timekeeping/layout/inputPhaseGroup/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/layout/inputPhaseGroup/',
					endRead: 'listByParent',
					usePostForRead: false,
					initReadData: function initReadData (readData) {
						var selected = timekeepingLayoutUserInterfaceLayoutDataService.getSelected();
						readData.filter = '?uiLayoutId=' + (selected ? selected.Id : 0);
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingLayoutConstantValues.schemes.inputPhaseGroup)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingLayoutUserInterfaceLayoutDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'InputPhaseGroups', parentService: timekeepingLayoutUserInterfaceLayoutDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingLayoutInputPhaseGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingLayoutInputPhaseGroupValidationService'
		}, timekeepingLayoutConstantValues.schemes.inputPhaseGroup));
	}
})(angular);
