/**
 * Created by baf on 08.05.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('change.main');

	/**
	 * @ngdoc service
	 * @name changeMainReferenceDataService
	 * @description pprovides methods to access, create and update change main reference entities
	 */
	myModule.service('changeMainReferenceDataService', ChangeMainReferenceDataService);

	ChangeMainReferenceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'changeMainConstantValues', 'changeMainService', 'changeMainReferenceProcessorService'];

	function ChangeMainReferenceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, changeMainConstantValues, changeMainService, changeMainReferenceProcessorService) {
		var self = this;
		var changeMainReferenceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'changeMainReferenceDataService',
				entityNameTranslationID: 'change.main.referenceEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'change/main/changereference/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = changeMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [changeMainReferenceProcessorService, platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					changeMainConstantValues.schemes.changeReference)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = changeMainService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ProjectFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ChangeReferences', parentService: changeMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(changeMainReferenceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'changeMainReferenceValidationService'
		}, changeMainConstantValues.schemes.changeReference));
	}
})(angular);
