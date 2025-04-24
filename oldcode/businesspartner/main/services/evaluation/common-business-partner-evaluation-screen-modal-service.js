(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationScreenModalService', [
		'$injector',
		'platformModalService',
		'commonBusinessPartnerEvaluationScreenDialogController',
		'$translate',
		'platformSchemaService',
		'basicsLookupdataLookupDefinitionService',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService',
		'commonBusinessPartnerEvaluationAdaptorHelper',
		'basicsPermissionServiceFactory',
		'PlatformMessenger',
		function ($injector,
			platformModalService,
			businessPartnerEvaluationScreenDialogController,
			$translate,
			platformSchemaService,
			basicsLookupdataLookupDefinitionService,
			basicsLookupdataLookupFilterService,
			basicsLookupdataLookupDescriptorService,
			evaluationAdaptorHelper,
			basicsPermissionServiceFactory,
			PlatformMessenger) {

			let service = {};
			let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');

			service.defaultOptions = function () {
				return {
					create: {
						businessPartnerId: -1,

						// 1 Business Partner 2 Project 3 Contract 4 Invoice 5 Package
						evaluationMotiveId: 1,

						saveCallbackFun: function () {
						},

						canSave: false,

						saveImmediately: true
					},
					view: {
						evaluationId: -1,

						saveCallbackFun: function () {
						},

						canSave: false,

						saveImmediately: true
					}
				};
			};

			service.showDialog = function (config) {
				let evaluationDetailService = config.evaluationDetailService;
				evaluationDetailService.create = null;
				evaluationDetailService.view = null;
				evaluationDetailService.UpdateDoneCallBackArray.length = 0;

				let options = service.defaultOptions();
				if (config?.create?.businessPartnerId) {
					angular.extend(options.create, config.create);

					evaluationDetailService.create = options.create;
					if (config.create.canSave) {
						evaluationDetailService.UpdateDoneCallBackArray.push(evaluationDetailService.create.saveCallbackFun);
					}
				} else if (config?.view?.evaluationId) {
					angular.extend(options.view, config.view);

					evaluationDetailService.view = options.view;
					if (config.view.canSave) {
						evaluationDetailService.UpdateDoneCallBackArray.push(evaluationDetailService.view.saveCallbackFun);
					}
				}

				businessPartnerMainEvaluationPermissionService.storeSystemContext();
				let permissionObjectInfo = config?.view ? config.view.permissionObjectInfo : null;
				let loadPermissionPromise = businessPartnerMainEvaluationPermissionService.setPermissionObjectInfo(permissionObjectInfo);

				let modalOptions = {
					headerText: $translate.instant(config.dialogTitleTranslation),
					templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-modal.html',
					controller: [
						'$scope',
						'$translate',
						'$modalInstance',
						'platformDetailControllerService',
						'platformTranslateService',
						'platformGridAPI',
						'businessPartnerRecalculateService',
						'basicsPermissionServiceFactory',
						'businessPartnerMainEvaluationPermissionDescriptor',
						'busiessPartnerMainEvaluationDynamicGridOption',
						function ($scope,
							$translate,
							$modalInstance,
							platformDetailControllerService,
							platformTranslateService,
							platformGridAPI,
							businessPartnerRecalculateService,
							basicsPermissionServiceFactory,
							businessPartnerMainEvaluationPermissionDescriptor,
							busiessPartnerMainEvaluationDynamicGridOption) {
							let evaluationValidationService = config.evaluationValidationService;
							businessPartnerEvaluationScreenDialogController(
								$scope,
								$translate,
								$modalInstance,
								platformDetailControllerService,
								evaluationDetailService,
								evaluationValidationService,
								config.evaluationDetailUIStandardService,
								platformTranslateService,
								platformGridAPI,
								config.evaluationGroupService,
								config.evaluationGroupValidationService,
								config.evaluationItemService,
								config.evaluationItemValidationService,
								config.evaluationDocumentService,
								config.evaluationDocumentValidationService,
								config.evaluationClerkService,
								config.evaluationClerkValidationService,
								config.evaluationClerkUIStandardService,
								config.evaluationGroupClerkService,
								config.evaluationGroupClerkValidationService,
								config.evaluationGroupClerkUIStandardService,
								config.dialogTitleTranslation,
								businessPartnerRecalculateService,
								basicsPermissionServiceFactory,
								businessPartnerMainEvaluationPermissionDescriptor,
								busiessPartnerMainEvaluationDynamicGridOption);
						}],
					width: '1200px',
					height: '880px',
					resizeable: true
				};

				if (loadPermissionPromise) {
					loadPermissionPromise.then(function () {
						platformModalService.showDialog(modalOptions).then(function () {
							businessPartnerMainEvaluationPermissionService.resetSystemContext();
							businessPartnerMainEvaluationPermissionService.reset();

						});
					});
				} else {
					platformModalService.showDialog(modalOptions).then(function () {
						businessPartnerMainEvaluationPermissionService.resetSystemContext();
						businessPartnerMainEvaluationPermissionService.reset();
					});
				}
			};

			service.getWizards = function (getOptions, serviceDescriptor, adaptorServiceName) {
				platformSchemaService.getSchemas([                         // where are all the schemas gone... ?
					{typeName: 'EvaluationDto', moduleSubModule: 'BusinessPartner.Main'},
					{typeName: 'EvaluationItemDataDto', moduleSubModule: 'BusinessPartner.Main'},
					{typeName: 'EvaluationGroupDataDto', moduleSubModule: 'BusinessPartner.Main'},
					{typeName: 'EvaluationDocumentDto', moduleSubModule: 'BusinessPartner.Main'},
					{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'}
				]);
				basicsLookupdataLookupDefinitionService.load([
					'businessPartnerEvaluationSchemaIconCombobox'
				]);
				return {
					id: 33458,
					text: 'Create Businesspartner Evaluation',
					text$tr$: 'businesspartner.main.toolbarNewEvaluationScreen',
					type: 'item',
					showItem: true,
					cssClass: 'md rw',
					fn: function () {
						let options = getOptions();
						if (options) {
							let adaptorContainer = evaluationAdaptorHelper.createAdaptorContainer(serviceDescriptor, $injector.get(adaptorServiceName)),
								dialogOptions = adaptorContainer.serviceContainer;
							if (options.then) {
								options.then(function (result) {
									dialogOptions.create = result.create;
									service.showDialog(dialogOptions);
								});
							} else {
								dialogOptions.create = options.create;
								service.showDialog(dialogOptions);
							}
						}
					}
				};
			};

			let lookupFilters = [
				{
					key: 'businesspartner-main-evaluation-invheader-filter',
					serverKey: 'businesspartner-main-evaluation-invheader-filter',
					serverSide: true,
					fn: function (item) {
						return {
							BusinessPartnerFk: item.BusinessPartnerFk,
							ProjectFk: item.ProjectFk,
							ConHeaderFk: item.ConHeaderFk
						};
					}
				},
				{
					key: 'businesspartner-main-evaluation-conheader-filter',
					serverKey: 'businesspartner-main-evaluation-conheader-filter',
					serverSide: true,
					fn: function (item) {
						let quotes = basicsLookupdataLookupDescriptorService.getData('quote');
						return {
							BusinessPartnerFk: item.BusinessPartnerFk,
							ProjectFk: item.ProjectFk,
							CodeQuotation: item.QtnHeaderFk && quotes?.[item.QtnHeaderFk] ? quotes[item.QtnHeaderFk].Code : ''
						};
					}
				},
				{
					key: 'businesspartner-main-evaluation-qtnheader-filter',
					serverKey: 'businesspartner-main-evaluation-qtnheader-filter',
					serverSide: true,
					fn: function (item) {
						return {BusinessPartnerFk: item.BusinessPartnerFk, ProjectFk: item.ProjectFk};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

			service.evaluationGroupSelectionChanged = new PlatformMessenger();

			return service;
		}
	]);
})(angular);