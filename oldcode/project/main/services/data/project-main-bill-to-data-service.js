/**
 * Created by baf on 15.05.2020
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainBillToDataService
	 * @description pprovides methods to access, create and update project main billTo entities
	 */
	myModule.service('projectMainBillToDataService', ProjectMainBillToDataService);

	ProjectMainBillToDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainService','projectMainBillToReadOnlyProcessor'];

	function ProjectMainBillToDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainService, projectMainBillToReadOnlyProcessor) {
		let self = this;
		let projectMainBillToServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectMainBillToDataService',
				entityNameTranslationID: 'project.main.billToEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/billto/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.billTo), projectMainBillToReadOnlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						handleCreateSucceeded: function handleBillToCreateSucceeded(newData) {
							newData.BusinessPartnerFk = null;
							newData.CustomerFk = null;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'BillTos', parentService: projectMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainBillToServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainBillToValidationService'
		}, projectMainConstantValues.schemes.billTo));
	}
})(angular);
