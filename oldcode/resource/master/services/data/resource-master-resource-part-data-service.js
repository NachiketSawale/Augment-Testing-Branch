/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.master');

	/**
	 * @ngdoc service
	 * @name resourceMasterResourcePartDataService
	 * @description provides methods to access, create and update resource master resource part entities
	 */
	myModule.service('resourceMasterResourcePartDataService', ResourceMasterResourcePartDataService);

	ResourceMasterResourcePartDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceMasterConstantValues', 'resourceMasterMainService'];

	function ResourceMasterResourcePartDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, resourceMasterConstantValues, resourceMasterMainService) {
		var self = this;
		var resourceMasterResourcePartServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceMasterResourcePartDataService',
				entityNameTranslationID: 'resource.master.resourceMasterResourcePartEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/master/resourcePart/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceMasterMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceMasterConstantValues.schemes.resourcePart)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceMasterMainService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						handleCreateSucceeded: function handleCreateSucceeded() {
							resourceMasterMainService.SetSelectedRateReadOnly(true);
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Parts', parentService: resourceMasterMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceMasterResourcePartServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.handleOnDeleteSucceeded = function (deleteParams, data,response) {
			if(serviceContainer.data.itemList.length === 0){
				resourceMasterMainService.SetSelectedRateReadOnly(false);
			}
		};
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceMasterResourcePartValidationService'
		}, resourceMasterConstantValues.schemes.resourcePart));
	}
})(angular);
