/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListFormDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListFormDataService', ['$injector', '$http', '$translate','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'cloudDesktopSidebarService','hsqeCheckListDataService','basicsLookupdataLookupFilterService', 'basicsCommonMandatoryProcessor','platformModuleStateService','hsqeCheckListFormReadonlyProcessor',
		function ($injector, $http, $translate, dataServiceFactory, lookupDescriptorService, cloudDesktopSidebarService,
			parentService, basicsLookupdataLookupFilterService, basicsCommonMandatoryProcessor, platformModuleStateService,readonlyProcessor) {
			var service = {}, serviceContainer = null;

			var onReadSucceeded = function onReadSucceeded(readData, data) {
				if (readData && readData.length > 0) {
					lookupDescriptorService.attachData(readData);
					return serviceContainer.data.handleReadSucceeded(readData, data);
				}
			};
			var factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'hsqeCheckListFormDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/form/'
					},
					entityRole: {
						leaf: {itemName: 'FormData', parentService: parentService}
					},
					dataProcessor:[readonlyProcessor],
					presenter: {
						list: {
							incorporateDataRead: onReadSucceeded,
							initCreationData: function initCreationData(creationData) {
								var selected = parentService.getSelected();
								creationData.HsqCheckListFk = selected.Id;
							}
						}
					},
					actions:{
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						},
						canDeleteCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						}
					}
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(factoryOptions);
			var data = serviceContainer.data;
			service = serviceContainer.service;
			var filters = [{
				key: 'hsqe-checklist-form-data-filter',
				serverSide: true,
				fn: function () {
					return 'RubricFk = ' + parentService.checkListRubricFk;
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);


			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'HsqCheckList2FormDto',
				moduleSubModule: 'Hsqe.CheckList',
				validationService: 'hsqeCheckListFormValidationService',
				mustValidateFields: ['Code', 'FormFk']
			});

			service.deleteCheckListForm = function deleteCheckListForm(entity) {
				if (entity.Id < 0) return;
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false, entity);
				service.addEntityToDeleted(elemState, entity, data, modState);
			};
			service.addCheckListForm = function addCheckListForm(entity, checkListEntity) {
				var item = {
					Id: -entity.Id,
					Code: entity.Code,
					DescriptionInfo: entity.DescriptionInfo,
					HsqCheckListFk: checkListEntity.Id,
					FormFk: entity.BasFormFk,
					InsertedAt: entity.InsertedAt,
					InsertedBy: entity.InsertedBy
				};
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false, item);
				service.addEntityToModified(elemState, item, modState.modifications);
				return item;
			};
			service.cleanCheckListForm = function cleanCheckListForm() {
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false);
				elemState.FormDataToSave = null;
				elemState.FormDataToDelete = null;
			};

			service.deleteCheckListForm = function(formList){
				var modState = platformModuleStateService.state(service.getModule());
				var elemState = service.assertPath(modState.modifications, false);
				elemState.FormDataToSave = null;
				elemState.FormDataToDelete = formList;
			};

			service.showFormData = function showFormData(allowEdit, openMethod) {
				var selectedFormData = service.getSelected();
				if (selectedFormData && selectedFormData.Id > 0 && selectedFormData.FormFk !== 0) {
					// todo: collect form inputs inside the complete dto and save only on demand
					if (selectedFormData.Version === 0) {
						// get root service
						var rootService = parentService;
						while (rootService.parentService() !== null) {
							rootService = rootService.parentService();
						}
						// force root service to update
						rootService.update().then(function () {
							showForm(selectedFormData.FormFk, selectedFormData.BasFormDataFk, allowEdit, openMethod);
						});
					} else {
						showForm(selectedFormData.FormFk, selectedFormData.BasFormDataFk, allowEdit, openMethod);
					}
				}
			};
			var showForm = function (formFk, formDataId, allowEdit, openMethod) {
				var contextId = parentService.getSelected().Id;
				var parentItem = parentService.getSelected();
				var invalidCheckList = (parentItem.HsqCheckListFk > 0);
				var basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
				basicsUserFormPassthroughDataService.setInitialData({
					showInvalidCheckList: invalidCheckList,
					userFormOpenMethod: openMethod,
					editable: true
				});
				var options = {
					formId: formFk,
					formDataId: formDataId,
					editable: allowEdit,
					setReadonly: false,
					modal: true,
					contextId: contextId,
					openMethod: openMethod,
					fromModule: parentItem.HsqCheckListFk > 0 ? 73 : null
				};
				$injector.get('basicsUserformCommonService').editData(options);
			};
			return service;
		}
	]);
})(angular);
