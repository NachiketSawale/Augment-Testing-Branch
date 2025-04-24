/**
 * Created by lcn on 5/7/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('businessPartnerMainGeneralsDataService', ['platformDataServiceFactory', 'businesspartnerMainHeaderDataService',
		'$http', '_', '$q', '$translate', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', 'businessPartnerMainGeneralsReadOnlyProcessor',
		'basicsCommonMandatoryProcessor', 'businesspartnerStatusRightService',
		function (dataServiceFactory, parentService, $http, _, $q, $translate, lookupDataService, lookupDescriptorService, readonlyProcessor, basicsCommonMandatoryProcessor,
			businesspartnerStatusRightService) {
			var serviceContainer;
			var service;

			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businessPartnerMainGeneralsDataService',
					httpCRUD: {route: globals.webApiBaseUrl + 'businesspartner/main/generals/'},
					dataProcessor: [readonlyProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var status = parentService.getItemStatus();
								if (status.IsReadonly === true) {
									businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
								}

								lookupDescriptorService.attachData(readData);
								return serviceContainer.data.handleReadSucceeded(readData.Main, data);
							}, initCreationData: function initCreationData(creationData) {
								var parentItem = parentService.getSelected();
								creationData.PKey1 = parentItem.Id;
							}, handleCreateSucceeded: function (item) {
								var defaultItem = _.find(service.getList(), {PrcGeneralstypeFk: item.PrcGeneralstypeFk});
								if (defaultItem) {
									item.PrcGeneralstypeFk = null;
									return;
								}
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'Generals', parentService: parentService, doesRequireLoadAlways: true
						}
					}
				}
			};
			serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'GeneralsDto',
				moduleSubModule: 'BusinessPartner.Main',
				validationService: 'businessPartnerMainGeneralsValidationService',
				mustValidateFields: ['PrcGeneralstypeFk']
			});

			var canCreate = serviceContainer.service.canCreate;
			serviceContainer.service.canCreate = function () {
				return canCreate() && !parentService.getItemStatus().IsReadonly;
			};

			var canDelete = serviceContainer.service.canDelete;
			serviceContainer.service.canDelete = function () {
				return canDelete() && !parentService.getItemStatus().IsReadonly;
			};

			return service;
		}]);
})(angular);