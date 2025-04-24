(function (angular) {
	'use strict';
	/* global Platform */

	var moduleName = 'basics.userform';
	var myModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsUserformMainService
	 * @function
	 *
	 * @description
	 * main data service for all userform related functionality.
	 */
	myModule.factory('basicsUserformMainService', [
		'globals',
		'$q',
		'$http',
		'platformDataServiceFactory',
		'basicsUserformCommonService',
		'basicsLookupdataLookupDescriptorService',
		'basicsUserformProcessingTypeService',
		'ServiceDataProcessDatesExtension',
		'basicsUserformWorkflowTemplateLookupService',
		'basicsUserformRubricLookupService',
		function (
			globals,
			$q,
			$http,
			platformDataServiceFactory,
			basicsUserformCommonService,
			basicsLookupdataLookupDescriptorService,
			basicsUserformProcessingTypeService,
			ServiceDataProcessDatesExtension,
			basicsUserformWorkflowTemplateLookupService,
			basicsUserformRubricLookupService) {

			var sidebarSearchOptions = {
				moduleName: moduleName,
				enhancedSearchEnabled: true,
				enhancedSearchVersion: '2.0',
				pattern: '',
				pageSize: 100,
				useCurrentClient: false,
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: false,
				withExecutionHints: true
			};

			// The instance of the main service - to be filled with functionality below
			var serviceFactoryOptions =
				{
					flatRootItem: {
						module: myModule,
						serviceName: 'basicsUserformMainService',
						httpRead: {route: globals.webApiBaseUrl + 'basics/userform/', endRead: 'listFiltered', usePostForRead: true},
						httpCreate: {route: globals.webApiBaseUrl + 'basics/userform/', endCreate: 'create'},
						httpUpdate: {route: globals.webApiBaseUrl + 'basics/userform/', endUpdate: 'updateForm'},
						httpDelete: {route: globals.webApiBaseUrl + 'basics/userform/', endDelete: 'delete'},
						entityRole: {
							root: {codeField: 'Id', descField: 'DescriptionInfo.Translated', itemName: 'Form', moduleName: 'cloud.desktop.moduleDisplayNameUserForm', useIdentification: true}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])],
						translation: {
							uid: 'basicsUserformMainService',
							title: 'basics.userform.formListTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {typeName: 'FormDto', moduleSubModule: 'Basics.UserForm'}
						},
						sidebarSearch: {
							options: sidebarSearchOptions
						}
					}
				};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

			// events
			serviceContainer.service.failedOnOutstandingChanges = new Platform.Messenger();

			// region get/set selected form/rubric id

			serviceContainer.service.getSelectedFormId = function () {

				var selectedForm = serviceContainer.service.getSelected();
				if (selectedForm && selectedForm.Id) {
					return selectedForm.Id;
				}
				return 0;
			};

			serviceContainer.service.getSelectedRubricId = function () {

				var selectedForm = serviceContainer.service.getSelected();
				if (selectedForm && selectedForm.RubricFk) {
					return selectedForm.RubricFk;
				}
				return 0;
			};

			/**
			 * @ngdoc function
			 * @name previewSelectedForm
			 * @function
			 * @description previews the currently selected form template
			 */
			serviceContainer.service.previewSelectedForm = function () {

				var selectedForm = serviceContainer.service.getSelected();
				if (selectedForm && selectedForm.Id) {
					if (selectedForm.Version === 0 || serviceContainer.service.isModelChanged()) { // needs to be saved first!
						serviceContainer.service.failedOnOutstandingChanges.fire();
					} else {
						basicsUserformCommonService.previewForm(selectedForm.Id);
					}
				}
			};

			serviceContainer.service.addFormData = function (contextId) {

				var selectedForm = serviceContainer.service.getSelected();
				if (selectedForm && selectedForm.Id) {
					if (selectedForm.Version === 0 || serviceContainer.service.isModelChanged()) { // needs to be saved first!
						serviceContainer.service.failedOnOutstandingChanges.fire();
					} else {
						basicsUserformCommonService.addData(selectedForm.Id, contextId);
					}
				}
			};

			serviceContainer.service.editFormData = function (formDataId) {

				var selectedForm = serviceContainer.service.getSelected();
				if (selectedForm && selectedForm.Id) {
					if (selectedForm.Version === 0 || serviceContainer.service.isModelChanged()) { // needs to be saved first!
						serviceContainer.service.failedOnOutstandingChanges.fire();
					} else {
						basicsUserformCommonService.editData({formId: selectedForm.Id, formDataId: formDataId});
					}
				}
			};

			/**
			 * @ngdoc function
			 * @name getHtmlTemplate
			 * @function
			 * @description returns the html template of the selected form
			 */
			serviceContainer.service.getHtmlTemplate = function () {

				var deferred = $q.defer();

				var selectedForm = serviceContainer.service.getSelected();
				if (selectedForm && Object.prototype.hasOwnProperty.call(selectedForm, 'HtmlTemplateContent')) {

					if (selectedForm.HtmlTemplateContent === null) {   // first load template
						$http.get(globals.webApiBaseUrl + 'basics/userform/fetchhtmltemplate?formId=' + selectedForm.Id).then(
							function (response) {
								deferred.resolve(response.data);
							});
					} else {
						deferred.resolve(selectedForm.HtmlTemplateContent);
					}
				} else {
					deferred.resolve(null);
				}

				return deferred.promise;
			};

			var init = function () {

				var promises = [];
				promises.push(basicsUserformWorkflowTemplateLookupService.loadData());
				promises.push(basicsUserformRubricLookupService.loadData());
				$q.all(promises).then(function () {
					// basicsLookupdataLookupDescriptorService.updateData(basicsUserformWorkflowTemplateLookupService.getlookupType(), basicsUserformWorkflowTemplateLookupService.getList());
					// basicsLookupdataLookupDescriptorService.updateData(basicsUserformRubricLookupService.getlookupType(), basicsUserformRubricLookupService.getList());
				});
			};
			init();

			return serviceContainer.service;

		}]);
})(angular);
