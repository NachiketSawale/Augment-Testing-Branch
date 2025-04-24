/**
 * Created by alm on 5/26/2022.
 */

(function () {
	'use strict';
	var moduleName = 'procurement.requisition';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('procurementRequisitionVariantLayout', [
		function procurementRequisitionVariantLayout() {
			return {
				fid: 'procurement.Requisition.variantForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code','description','remarks','comment']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
						Remarks:{ location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks' },
						Comment: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'}
					}
				}
			};
		}
	]);


	angular.module(moduleName).factory('procurementRequisitionVariantUIStandardService',

		['platformUIStandardConfigService', 'procurementRequisitionTranslationService', 'platformSchemaService', 'procurementRequisitionVariantLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, procurementRequisitionVariantLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ReqVariantDto',
					moduleSubModule: 'Procurement.Requisition'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(procurementRequisitionVariantLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, procurementRequisitionVariantLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
