/**
 * Created by Sudarshan on 16.03.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.certificate');

	/**
	 * @ngdoc service
	 * @name timekeepingCertifiedEmployeeDataService
	 * @description pprovides methods to access, create and update timekeeping certified employee entities
	 */
	myModule.service('timekeepingCertifiedEmployeeDataService', TimekeepingCertifiedEmployeeDataService);

	TimekeepingCertifiedEmployeeDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingCertificateConstantValues', 'timekeepingCertificateDataService'];

	function TimekeepingCertifiedEmployeeDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, timekeepingCertificateConstantValues, timekeepingCertificateDataService) {
		let self = this;
		let timekeepingCertifiedEmployeeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingCertifiedEmployeeDataService',
				entityNameTranslationID: 'timekeeping.certificate.certifiedEmployeeListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/certified/employee/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingCertificateDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingCertificateConstantValues.schemes.certifiedEmployee)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingCertificateDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'CertifiedEmployee', parentService: timekeepingCertificateDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingCertifiedEmployeeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingCertifiedEmployeeValidationService'
		}, timekeepingCertificateConstantValues.schemes.certifiedEmployee));
	}
})(angular);
