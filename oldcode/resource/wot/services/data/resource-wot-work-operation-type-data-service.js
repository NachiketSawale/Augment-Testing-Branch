/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('resource.wot');

	/**
	 * @ngdoc service
	 * @name resourceWotWorkOperationTypeDataService
	 * @description provides methods to access, create and update resource wot workOperationType entities
	 */
	myModule.service('resourceWotWorkOperationTypeDataService', ResourceWotWorkOperationTypeDataService);

	ResourceWotWorkOperationTypeDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceWotConstantValues', 'resourceWotWorkOperationTypeProcessor'];

	function ResourceWotWorkOperationTypeDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceWotConstantValues, resourceWotWorkOperationTypeProcessor) {
		let self = this;
		let resourceWotWorkOperationTypeServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceWotWorkOperationTypeDataService',
				entityNameTranslationID: 'resource.wot.entityWorkOperationType',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/wot/workoperationtype/',
					usePostForRead: true,
					endDelete: 'multidelete',
					endRead: 'filtered'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceWotConstantValues.schemes.workOperationType), resourceWotWorkOperationTypeProcessor],
				entityRole: {root: {itemName: 'WorkOperationTypes', moduleName: 'cloud.desktop.moduleDisplayNameWorkOperationTypes'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				translation: {
					uid: 'resourceWotWorkOperationTypeDataService',
					title: 'resource.wot.entityWorkOperationType',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: resourceWotConstantValues.schemes.workOperationType
				},
				sidebarSearch: {
					options: {
						moduleName: 'resource.wot',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: null,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceWotWorkOperationTypeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceWotWorkOperationTypeValidationService'
		}, resourceWotConstantValues.schemes.workOperationType));
	}
})(angular);
