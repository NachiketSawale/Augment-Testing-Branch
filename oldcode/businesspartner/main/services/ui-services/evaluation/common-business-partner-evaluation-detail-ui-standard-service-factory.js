/**
 * Created by wed on 1/8/2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('commonBusinessPartnerEvaluationDetailUIStandardServiceFactory', [
		'platformUIStandardConfigService',
		'businessPartnerEvaluationDetailLayout',
		'businessPartnerEvaluationTranslationService',
		'platformSchemaService',
		'platformUIStandardExtentService',
		'commonBusinessPartnerEvaluationServiceCache',
		'commonBusinessPartnerEvaluationDetailLayoutFactory',
		'busiessPartnerMainEvaluationDynamicGridOption',
		'basicsPermissionServiceFactory',
		'businessPartnerMainEvaluationPermissionDescriptor',
		function (platformUIStandardConfigService,
			businessPartnerEvaluationDetailLayout,
			businessPartnerEvaluationTranslationService,
			platformSchemaService,
			platformUIStandardExtentService,
			serviceCache,
			evaluationDetailLayoutFactory,
			busiessPartnerMainEvaluationDynamicGridOption,
			basicsPermissionServiceFactory,
			businessPartnerMainEvaluationPermissionDescriptor) {

			let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');

			function createService(serviceDescriptor) {

				if (serviceCache.hasService(serviceCache.serviceTypes.EVALUATION_DETAIL_UI_STANDARD, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.EVALUATION_DETAIL_UI_STANDARD, serviceDescriptor);
				}

				var detailLayout = evaluationDetailLayoutFactory.createLayout(serviceDescriptor);
				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EvaluationDto',
					moduleSubModule: 'BusinessPartner.Main'
				});

				attributeDomains = attributeDomains.properties;

				var service = new StructureUIStandardService(detailLayout, attributeDomains, businessPartnerEvaluationTranslationService);

				platformUIStandardExtentService.extend(service, detailLayout.addition, attributeDomains);

				Array.prototype.push.apply(service.getStandardConfigForDetailView().rows, [
					{
						directive: 'business-partner-evaluation-common-dynamic-grid-directive',
						// directive: 'business-partner-evaluation-group-data-view-directive',
						gid: 'evaluationSchema',
						label$tr$: '',
						model: 'pointspossible',
						readonly: false,
						rid: 'groupdataview',
						sortOrder: 1,
						type: 'directive',
						options: function () {
							return angular.extend(busiessPartnerMainEvaluationDynamicGridOption.getEvalGroupInfo(
								businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVALGROUP')))
							);
						}
					}, {
						directive: 'business-partner-evaluation-common-dynamic-grid-directive',
						// directive: 'business-partner-evaluation-item-data-view-directive',
						gid: 'evaluationItems',
						label$tr$: '',
						model: 'pointspossible',
						readonly: false,
						rid: 'itemdataview',
						sortOrder: 1,
						type: 'directive',
						options: function () {
							return angular.extend(busiessPartnerMainEvaluationDynamicGridOption.getEvalItemInfo(
								businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVALITEM')))
							);
						}
					}, {
						directive: 'business-partner-evaluation-common-dynamic-grid-directive',
						// directive: 'business-partner-evaluation-document-data-view-directive',
						gid: 'evaluationDocument',
						label$tr$: '',
						model: 'pointspossible',
						readonly: false,
						rid: 'itemdataview1',
						sortOrder: 1,
						type: 'directive',
						options: function () {
							return angular.extend(busiessPartnerMainEvaluationDynamicGridOption.getEvalDocumentInfo(
								businessPartnerMainEvaluationPermissionService.hasRead(businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVAL')))
							);
						}
					}]);

				serviceCache.setService(serviceCache.serviceTypes.EVALUATION_DETAIL_UI_STANDARD, serviceDescriptor, service);

				return service;
			}

			return {
				createService: createService
			};
		}
	]);
})(angular);