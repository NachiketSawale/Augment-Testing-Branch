/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName='hsqe.checklisttemplate';

	angular.module(moduleName).factory('hsqeCheckListTemplate2FormService', ['$injector', '$translate', 'platformDataServiceFactory', 'hsqeCheckListTemplateHeaderService','basicsCommonMandatoryProcessor','basicsUserformCommonService', 'platformModalService',

		function ($injector, $translate, platformDataServiceFactory, parentService,basicsCommonMandatoryProcessor,basicsUserformCommonService, platformModalService) {
			var basicsTaxCodeServiceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'hsqeCheckListTemplate2FormService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/form/'
					},
					entityRole: {
						leaf: {
							itemName: 'HsqChkListTemplate2Form',
							parentService: parentService
						}
					},
					translation: {
						uid: 'hsqeCheckListTemplate2FormService',
						title: 'hsqe.checklisttemplate.checkTemplate2FromGridContainerTitle',
						columns: [{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
					},
					presenter: {
						list: {
							handleCreateSucceeded: function initCreationData(newData) {
								var selectedItem = parentService.getSelected();
								if (selectedItem) {
									newData.HsqChklisttemplateFk = selectedItem.Id;
								}
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								if (service.updateTemporaryCheckListId) {
									service.updateTemporaryCheckListId = false;
									_.forEach(readItems, function (i) {
										let entity = service.getItemById(i.Id);
										if (entity && entity.TemporaryCheckListId) {
											i.TemporaryCheckListId = entity.TemporaryCheckListId;
										}
									});
								}
								return serviceContainer.data.handleReadSucceeded(readItems, data);
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsTaxCodeServiceOption);
			var service = serviceContainer.service;

			service.updateTemporaryCheckListId = false;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'HsqChkListTemplate2FormDto',
				moduleSubModule: 'Hsqe.CheckListTemplate',
				validationService: 'hsqeCheckListTemplate2FromValidationService',
				mustValidateFields: ['Code', 'BasFormFk']
			});

			var getContextFk = function() {
				return parentService.getSelected().Id;
			};

			var showForm = function(formFk, formDataId, allowEdit, openMethod) {
				var basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
				basicsUserFormPassthroughDataService.setInitialData({showInvalidCheckList: false,userFormOpenMethod:openMethod,editable:allowEdit});
				var options = { formId: formFk, formDataId: formDataId, editable: allowEdit, setReadonly: false, modal:true, contextId: getContextFk(), openMethod: openMethod };
				var selectedItem = service.getSelected();
				options.tempContextId = selectedItem.TemporaryCheckListId;
				options.rubricFk = 91;
				options.intersectionId = selectedItem.Id;
				basicsUserformCommonService.editData(options);
			};

			service.showFormData = function(allowEdit, openMethod) {

				var selectedFormData = service.getSelected();
				if (selectedFormData && selectedFormData.Id > 0 && selectedFormData.BasFormFk !== 0) {
					// since showForm needs a relation to FormData we trigger the update function of the root-service
					// So we avoid the 'Please first save changes' popup.
					// todo: collect form inputs inside the complete dto and save only on demand
					if (selectedFormData.Version === 0) {     // first save new records!
						// get root service
						var rootService = parentService;
						while(rootService.parentService() !== null) {
							rootService = rootService.parentService();
						}
						// force root service to update
						rootService.update().then (function() {
							showForm(selectedFormData.BasFormFk, selectedFormData.BasFormDataFk, allowEdit, openMethod);
						});
					}
					else {
						showForm(selectedFormData.BasFormFk, selectedFormData.BasFormDataFk, allowEdit, openMethod);
					}
				}
			};

			return service;

		}]);
})(angular);
