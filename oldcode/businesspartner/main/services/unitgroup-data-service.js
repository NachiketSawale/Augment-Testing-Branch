/**
 * Created by lcn on 5/7/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('businessPartnerMainUnitgroupDataService', ['platformDataServiceFactory', 'businesspartnerMainHeaderDataService',
		'businessPartnerMainUnitgroupReadOnlyProcessor', 'basicsCommonMandatoryProcessor', 'businesspartnerStatusRightService',
		function (dataServiceFactory, parentService, readonlyProcessor, basicsCommonMandatoryProcessor, businesspartnerStatusRightService) {
			var serviceContainer;
			var service;

			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businessPartnerMainUnitgroupDataService',
					httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/unitgroup/'},
					httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/unitgroup/'},
					dataProcessor: [readonlyProcessor],
					presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}},
					entityRole: {
						leaf: {
							itemName: 'Bp2controllinggroup', parentService: parentService, doesRequireLoadAlways: true
						}
					}
				}
			};
			serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Bp2controllinggroupDto',
				moduleSubModule: 'BusinessPartner.Main',
				validationService: 'businessPartnerMainUnitgroupValidationService',
				mustValidateFields: ['ControllinggroupFk']
			});

			function incorporateDataRead(readData, data) {
				var status = parentService.getItemStatus();
				if (status.IsReadonly === true) {
					businesspartnerStatusRightService.setListDataReadonly(readData, true);
				}

				return data.handleReadSucceeded(readData, data);
			}

			var canCreate = serviceContainer.service.canCreate;
			serviceContainer.service.canCreate = function () {
				return canCreate() && !parentService.getItemStatus().IsReadonly;
			};

			var canDelete = serviceContainer.service.canDelete;
			serviceContainer.service.canDelete = function () {
				return canDelete() && !parentService.getItemStatus().IsReadonly;
			};

			return service;

			function initCreationData(creationData) {
				var selected = parentService.getSelected();
				creationData.PKey1 = selected.Id;
			}
		}]);
})(angular);