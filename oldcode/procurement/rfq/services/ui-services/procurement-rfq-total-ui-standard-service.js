(function () {
	'use strict';

	var moduleName = 'procurement.rfq';

	/**
	 * @ngdoc service
	 * @name procurementRfqTotalDetailLayout
	 * @function
	 * @requires []
	 *
	 * @description
	 * # ui layout service for entity ReqTotal (read only).
	 */
	angular.module(moduleName).factory('procurementRfqTotalDetailLayout', [function () {
		return {
			'fid': 'procurement.rfq.total.detail',
			'version': '1.1.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					'gid': 'baseGroup',
					'attributes': ['totaltypefk', 'valuenet', 'valuetax', 'gross', 'valuenetoc', 'valuetaxoc', 'grossoc', 'commenttext']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'overloads': {
				'totaltypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-procurement-configuration-total-type-combobox',
							'descriptionMember': 'DescriptionInfo.Translated',
							'lookupOptions': {
								readonly: true
							}
						}
					},
					'grid': {
						// id: 'type',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcTotalType',
							displayMember: 'Code'
						}
					}
				}
			},
			'addition': {
				grid: [
					{
						lookupDisplayColumn: true,
						field: 'TotalTypeFk',
						name$tr$: 'procurement.common.totalTypeDes',
						displayMember: 'DescriptionInfo.Translated',
						width: 125
					}]
			}
		};
	}]);

	/**
	 * @ngdoc service
	 * @name procurementRfqTotalUIStandardService
	 * @function
	 * @requires platformUIStandardConfigService
	 *
	 * @description
	 * # ui standard service for entity ReqTotal (read only).
	 */
	angular.module(moduleName).factory('procurementRfqTotalUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementRfqTranslationService', 'procurementRfqTotalDetailLayout', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, platformSchemaService, translationService, layout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ReqTotalDto',
					moduleSubModule: 'Procurement.Requisition'
				});
				domainSchema = domainSchema.properties;

				function RfqUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				RfqUIStandardService.prototype = Object.create(BaseService.prototype);
				RfqUIStandardService.prototype.constructor = RfqUIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);

})();
