/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('basics.company');

	/**
	 * @ngdoc service
	 * @name basicsCompanyTimekeepingGroupDataService
	 * @description pprovides methods to access, create and update basics company timekeepingGroup entities
	 */
	myModule.service('basicsCompanyTimekeepingGroupDataService', BasicsCompanyTimekeepingGroupDataService);

	BasicsCompanyTimekeepingGroupDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'basicsCompanyConstantValues', 'basicsCompanyMainService'];

	function BasicsCompanyTimekeepingGroupDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, basicsCompanyConstantValues, basicsCompanyMainService) {
		var self = this;
		var basicsCompanyTimekeepingGroupServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsCompanyTimekeepingGroupDataService',
				entityNameTranslationID: 'basics.company.timekeepingGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/company/timekeepinggroup/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = basicsCompanyMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					basicsCompanyConstantValues.schemes.timekeepingGroup)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = basicsCompanyMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				translation: {
					uid: 'basicsCompanyTimekeepingGroupDataService',
					title: 'basics.company.timekeepingGroupEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: basicsCompanyConstantValues.schemes.timekeepingGroup
				},
				entityRole: {
					leaf: {itemName: 'TimekeepingGroups', parentService: basicsCompanyMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsCompanyTimekeepingGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'basicsCompanyTimekeepingGroupValidationService'
		}, basicsCompanyConstantValues.schemes.timekeepingGroup));

	}
})(angular);
