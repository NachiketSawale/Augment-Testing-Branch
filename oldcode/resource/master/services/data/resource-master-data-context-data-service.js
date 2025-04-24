/**
 * Created by baf on 01.02.2021
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.master');

	/**
	 * @ngdoc service
	 * @name resourceMasterDataContextDataService
	 * @description pprovides methods to access, create and update resource master dataContext entities
	 */
	myModule.service('resourceMasterDataContextDataService', ResourceMasterDataContextDataService);

	ResourceMasterDataContextDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceMasterConstantValues', 'resourceMasterMainService', 'resourceMasterDataContextProcessor'];

	function ResourceMasterDataContextDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, resourceMasterConstantValues, resourceMasterMainService, resourceMasterDataContextProcessor) {
		var self = this;
		var serviceContainer = null;

		this.canCreateDataContext = function canCreateDataContext() {
			var result = false;
			var selected = resourceMasterMainService.getSelected();
			if(selected && !_.find(serviceContainer.data.itemList, function (item) { return item.BelongsToLoginContext; })){
				result = true;
			}
			return result;
		};

		this.canDeleteDataContext = function canDeleteDataContext() {
			var selected = self.getSelected();

			return !!selected && selected.BelongsToLoginContext;
		};

		var resourceMasterDataContextServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceMasterDataContextDataService',
				entityNameTranslationID: 'resource.master.dataContextEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/master/datacontext/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceMasterMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {
					delete: true, canDeleteCallBackFunc: self.canDeleteDataContext,
					create: 'flat', canCreateCallBackFunc: self.canCreateDataContext},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceMasterConstantValues.schemes.dataContext),
					resourceMasterDataContextProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceMasterMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'MasterDataContexts', parentService: resourceMasterMainService}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(resourceMasterDataContextServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceMasterDataContextValidationService'
		}, resourceMasterConstantValues.schemes.dataContext));
	}
})(angular);
