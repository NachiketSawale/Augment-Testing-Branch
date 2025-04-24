/**
 * Created by wed on 1/8/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationAdaptorHelper', [
		'businessPartnerEvaluationTranslationService',
		'commonBusinessPartnerEvaluationTreeUIStandardServiceFactory',
		'commonBusinessPartnerEvaluationDetailUIStandardServiceFactory',
		'commonBusinessPartnerEvaluationDataServiceFactory',
		'commonBusinessPartnerEvaluationDetailServiceFactory',
		'commonBusinessPartnerEvaluationValidationServiceFactory',
		'commonBusinessPartnerEvaluationGroupDataServiceFactory',
		'commonBusinessPartnerEvaluationGroupDataValidationServiceFactory',
		'commonBusinessPartnerEvaluationItemDataServiceFactory',
		'commonBusinessPartnerEvaluationItemDataValidationServiceFactory',
		'commonBusinessPartnerEvaluationDocumentDataServiceFactory',
		'commonBusinessPartnerEvaluationDocumentDataValidationServiceFactory',
		'businessPartnerMainEvaluationClerkServiceFactory',
		'businessPartnerMainEvaluationClerkValidationServiceFactory',
		'businessPartnerMainEvaluationClerkUIStandardServiceFactory',
		'businessPartnerMainEvaluationClerkType',
		function (evaluationTranslationService,
			evaluationTreeUIStandardServiceFactory,
			evaluationDetailUIStandardServiceFactory,
			evaluationDataServiceFactory,
			evaluationDetailServiceFactory,
			evaluationValidationServiceFactory,
			groupDataServiceFactory,
			groupValidationServiceFactory,
			itemDataServiceFactory,
			itemValidationServiceFactory,
			documentDataServiceFactory,
			documentValidationServiceFactory,
			businessPartnerMainEvaluationClerkServiceFactory,
			businessPartnerMainEvaluationClerkValidationServiceFactory,
			businessPartnerMainEvaluationClerkUIStandardServiceFactory,
			businessPartnerMainEvaluationClerkType) {

			function createAdaptorContainer(serviceDescriptor, customAdaptor) {

				var parentService = null;
				var evaluationTreeService = null;
				var evaluationDetailService = null;

				var adaptorService = angular.extend({
					evalClerkQualifier: 'businesspartner.main.evaluation.clerk',
					evalGroupClerkQualifier: 'businesspartner.main.evalgroup.clerk',
					evalSubGroupClerkQualifier: 'businesspartner.main.evalsubgroupdata.clerk',
					isLoadAutomatically: function () {
						return !!parentService.getSelected();
					},
					getDialogTitleTranslation: function () {
						return 'businesspartner.main.screenEvaluatoinDailogTitle';
					},
					getModuleName: function () {
						return this.getParentService().getModule().name;
					},
					getMainService: function () {
						return null;
					},
					getParentService: function () {
						return null;
					},
					getEvaluationDataItemName: function () {
						return 'BusinessPartnerEvaluation';
					},
					getEvaluationDataService: function (serviceDescriptor, evaluationDetailService, evaluationColumns) {
						var context = this, evaluationTreeService = null;
						evaluationTreeService = evaluationDataServiceFactory.createService(serviceDescriptor, context.getMainService(), context.getParentService(), evaluationDetailService, {
							moduleName: this.getModuleName(),
							itemName: this.getEvaluationDataItemName(),
							columns: evaluationColumns,
							initReadData: function (readData) {
								context.extendDataReadParams(readData);
							},
							incorporateDataRead: function (readItems, data) {
								context.onDataReadComplete(readItems, data, context.getParentService(), evaluationTreeService);
							},
							onEvaluationChanged: function (args) {
								context.onEvaluationChanged(args, context.getParentService());
							},
							deleteImmediately: (function () {
								if (context.getMainService().getModule().name === 'procurement.pricecomparison') {
									return true;
								}
								return false;
							})()
						}
						);
						return evaluationTreeService;
					},
					getEvaluationDetailService: function (serviceDescriptor, evaluationColumns) {
						var context = this;
						return evaluationDetailServiceFactory.createService(serviceDescriptor, {
							moduleName: this.getModuleName(),
							columns: evaluationColumns,
							extendReadonlyFields: function (readonlyFields) {
								return context.extendReadonlyFields(readonlyFields);
							}
						});
					},
					getGroupDataService: function (serviceDescriptor) {
						return groupDataServiceFactory.createService(serviceDescriptor, evaluationDetailService, {
							moduleName: this.getModuleName()
						});
					},
					getItemDataService: function (serviceDescriptor) {
						return itemDataServiceFactory.createService(serviceDescriptor, evaluationDetailService, this.getGroupDataService(serviceDescriptor), {
							moduleName: this.getModuleName()
						});
					},
					getDocumentDataService: function (serviceDescriptor) {
						return documentDataServiceFactory.createService(serviceDescriptor, evaluationDetailService, {
							moduleName: this.getModuleName()
						});
					},
					getEvaluationClerkDataService: function (serviceDescriptor) {
						return businessPartnerMainEvaluationClerkServiceFactory.createService(
							serviceDescriptor,
							evaluationDetailService,
							evaluationDetailService,// this.getGroupDataService(serviceDescriptor),
							adaptorService.evalClerkQualifier,
							businessPartnerMainEvaluationClerkType.EVAL, {
								moduleName: this.getModuleName(),
								itemName: 'Evaluation2Clerk',
								canLoad: function (isEvalGrpOrSubGrpClerkOn) {
									return !isEvalGrpOrSubGrpClerkOn;
								}
							});
					},
					getEvaluationClerkValidationService: function (serviceDescriptor) {
						return businessPartnerMainEvaluationClerkValidationServiceFactory.createService(
							serviceDescriptor,
							adaptorService.evalClerkQualifier,
							adaptorService.getEvaluationClerkDataService(serviceDescriptor),
							businessPartnerMainEvaluationClerkType.EVAL);
					},
					getEvaluationClerkUIStandardService: function (serviceDescriptor) {
						return businessPartnerMainEvaluationClerkUIStandardServiceFactory.createService(
							serviceDescriptor,
							adaptorService.evalClerkQualifier,
							evaluationDetailService,// adaptorService.getGroupDataService(serviceDescriptor),
							businessPartnerMainEvaluationClerkType.EVAL);
					},
					getEvaluationGroupClerkDataService: function (serviceDescriptor) {
						return businessPartnerMainEvaluationClerkServiceFactory.createService(
							serviceDescriptor,
							evaluationDetailService,
							this.getGroupDataService(serviceDescriptor),
							adaptorService.evalGroupClerkQualifier,
							businessPartnerMainEvaluationClerkType.GROUP, {
								moduleName: this.getModuleName(),
								itemName: 'EvalGroupData2Clerk',
								canLoad: function (isEvalGrpOrSubGrpClerkOn) {
									return isEvalGrpOrSubGrpClerkOn;
								}
							});
					},
					getEvaluationGroupClerkValidationService: function (serviceDescriptor) {
						return businessPartnerMainEvaluationClerkValidationServiceFactory.createService(
							serviceDescriptor,
							adaptorService.evalGroupClerkQualifier,
							adaptorService.getEvaluationGroupClerkDataService(serviceDescriptor),
							businessPartnerMainEvaluationClerkType.GROUP);
					},
					getEvaluationGroupClerkUIStandardService: function (serviceDescriptor) {
						return businessPartnerMainEvaluationClerkUIStandardServiceFactory.createService(
							serviceDescriptor,
							adaptorService.evalGroupClerkQualifier,
							adaptorService.getGroupDataService(serviceDescriptor),
							businessPartnerMainEvaluationClerkType.SUBGROUP);
					},
					disabledCreate: function (scope, parentService) {
						return !parentService.getSelected();
					},
					onServiceInitialized: function (service) {
						return service;
					},
					extendCreateOptions: function (createOptions) {
						return createOptions;
					},
					extendUpdateOptions: function (updateOptions) {
						return updateOptions;
					},
					extendDataColumns: function (columns) {
						return columns;
					},
					extendDataReadParams: function (readData) {
						readData.filter = '?MainItemId=' + parentService.getIfSelectedIdElse(-1);
					},
					onDataReadComplete: function () {

					},
					onEvaluationChanged: function () {

					},
					extendReadonlyFields: function (readonlyFields) {
						return readonlyFields;
					},
					extendDetailColumns: function (columns) {
						return columns;
					},
					getChartTitle: function (parentNode, parentService) {
						var selectedItem = parentService.getSelected();
						return parentNode && selectedItem ? (parentNode.EvaluationSchemaDescription || '') + ' - ' + (selectedItem.BusinessPartnerName1 || '') : '';
					},
					onControllerCreate: function () {
						// Extend something when controller creating.
					},
					onControllerDestroy: function () {
						// Clear you data when controller destroy.
					}
				}, customAdaptor);

				var evaluationTreeUIStandardService = evaluationTreeUIStandardServiceFactory.createService(serviceDescriptor, evaluationTranslationService, {
					getDataService: function () {
						return evaluationTreeService;
					},
					getMainService: function () {
						return adaptorService.getMainService();
					}
				});

				var evaluationDetailUIStandardService = evaluationDetailUIStandardServiceFactory.createService(serviceDescriptor);

				var evaluationTreeColumns = adaptorService.extendDataColumns(evaluationTreeUIStandardService.getStandardConfigForListView().columns);

				adaptorService.extendDetailColumns(evaluationDetailUIStandardService.getStandardConfigForDetailView().rows);

				parentService = adaptorService.getParentService();
				evaluationDetailService = adaptorService.getEvaluationDetailService(serviceDescriptor, evaluationDetailUIStandardService.getStandardConfigForListView().columns);
				evaluationTreeService = adaptorService.onServiceInitialized(adaptorService.getEvaluationDataService(serviceDescriptor, evaluationDetailService, evaluationTreeColumns));

				var validationService = evaluationValidationServiceFactory.createService(serviceDescriptor, evaluationTreeService, evaluationDetailService);

				var serviceContainer = {
					parentService: parentService,
					evaluationTreeService: evaluationTreeService,
					evaluationDetailService: evaluationDetailService,
					evaluationGroupService: adaptorService.getGroupDataService(serviceDescriptor),
					evaluationGroupValidationService: groupValidationServiceFactory.createService(serviceDescriptor, evaluationDetailService, adaptorService.getGroupDataService(serviceDescriptor)),
					evaluationItemService: adaptorService.getItemDataService(serviceDescriptor),
					evaluationItemValidationService: itemValidationServiceFactory.createService(serviceDescriptor),
					evaluationValidationService: validationService,
					evaluationTreeUIStandardService: evaluationTreeUIStandardService,
					evaluationDetailUIStandardService: evaluationDetailUIStandardService,
					evaluationDocumentService: adaptorService.getDocumentDataService(serviceDescriptor),
					evaluationDocumentValidationService: documentValidationServiceFactory.createService(serviceDescriptor),
					evaluationClerkService: adaptorService.getEvaluationClerkDataService(serviceDescriptor),
					evaluationClerkValidationService: adaptorService.getEvaluationClerkValidationService(serviceDescriptor),
					evaluationClerkUIStandardService: adaptorService.getEvaluationClerkUIStandardService(serviceDescriptor),
					evaluationGroupClerkService: adaptorService.getEvaluationGroupClerkDataService(serviceDescriptor),
					evaluationGroupClerkValidationService: adaptorService.getEvaluationGroupClerkValidationService(serviceDescriptor),
					evaluationGroupClerkUIStandardService: adaptorService.getEvaluationClerkUIStandardService(serviceDescriptor),
					dialogTitleTranslation: adaptorService.getDialogTitleTranslation()
				};

				return {
					completelyAdaptorService: adaptorService,
					serviceContainer: serviceContainer
				};
			}

			return {
				createAdaptorContainer: createAdaptorContainer
			};
		}]);
})(angular);