/**
 * Created by shen on 1/3/2022
 */

	(function (angular) {
		'use strict';
		let moduleName = angular.module('project.main');
		/**
		 * @ngdoc service
		 * @name project2SalesTaxCodeDataService
		 * @function
		 *
		 * @description
		 * project2SalesTaxCodeDataService is the data service for all location related functionality.
		 */
		/* jshint -W072 */ // many parameters because of dependency injection
		moduleName.service('project2SalesTaxCodeDataService', Project2SalesTaxCodeDataService);

		Project2SalesTaxCodeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
			'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainService', 'basicsSalesTaxCodeMainService', '$q'];

		function Project2SalesTaxCodeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainService, basicsSalesTaxCodeMainService, $q) {

			let self = this;
			let Project2SalesTaxCodeServiceOption = {
				flatNodeItem: {
					module: moduleName,
					serviceName: 'project2SalesTaxCodeDataService',
					entityNameTranslationID: 'project.main.project2salestaxcodeListTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'project/main/project2salestaxcode/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = projectMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						projectMainConstantValues.schemes.project2SalesTaxCode),],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selected = projectMainService.getSelected();
								creationData.PKey1 = selected.Id;

							}
						}
					},
					entityRole: {
						node: {itemName: 'Project2SalesTaxCodes', parentService: projectMainService}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createService(Project2SalesTaxCodeServiceOption, self);
			serviceContainer.data.Initialised = true;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: ''
			}, projectMainConstantValues.schemes.project2SalesTaxCode));
		}
	})(angular);
