/**
 * Created by wuj on 9/2/2015.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementconfiguration';
	angular.module(modName)
		.factory('basicsProcurementConfigurationPrcTotalTypeLayout',
			[function () {
				return {
					'fid': 'basics.procurementconfiguration.frctotaltype.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['descriptioninfo', 'sorting',
								'isdefault', 'prctotalkindfk',
								'isbold', 'isitalic', 'iseditablenet', 'iseditabletax',
								'iseditablegross','code','formula','isautocreate','sqlstatement','isdashbtotal','isshowinpricecomparison']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							PrcTotalKindFk: {
								location: modName,
								identifier: 'entityTotalType',
								initial: 'Total Kind'
							},
							IsBold: {location: modName, identifier: 'entityIsBold', initial: 'Is Bold'},
							IsItalic: {location: modName, identifier: 'entityIsItalic', initial: 'Is Italic'},
							IsEditableNet: {
								location: modName,
								identifier: 'entityIsEditable',
								initial: 'Is Editable Net'
							},
							IsEditableTax: {
								location: modName,
								identifier: 'entityIsEditableTax',
								initial: 'Is Editable Tax'
							},
							IsEditableGross: {
								location: modName,
								identifier: 'entityIsEditableGross',
								initial: 'Is Editable Gross'
							},
							Formula:{
								location: modName,
								identifier: 'entityFormula',
								initial: 'Formula'
							},
							IsAutoCreate:{
								location: modName,
								identifier: 'entityIsAutoCreate',
								initial: 'Is Auto Create'
							},
							SqlStatement: {
								location: modName,
								identifier: 'sqlStatement',
								initial: 'Sql Statement'
							},
							IsDashBTotal:{
								location: modName,
								identifier: 'entityIsDashBTotal',
								initial: 'For Budget In Dashboards'
							},
							IsShowInPriceComparison:{
								location: modName,
								identifier: 'entityIsShowInPriceComparison',
								initial: 'Is show in Price Comparison'
							}
						}
					},
					'overloads': {
						'prctotalkindfk': {
							'detail': {
								//options: {
								//	displayMember: 'Description',
								//	valueMember: 'Id',
								//	items: lookUpItems.totalType
								//}
								'type': 'directive',
								'directive': 'basics-procurement-configuration-total-kind-combobox'
							},
							'grid': {
								editorOptions: {
									directive: 'basics-procurement-configuration-total-kind-combobox'
								},
								formatterOptions: {
									lookupType: 'PrcTotalKind',
									displayMember: 'Description'
								}
							}
						}
					}
				};
			}])
		.factory('basicsProcurementConfigurationPrcTotalTypeUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfigurationPrcTotalTypeLayout', 'platformSchemaService',
				function (platformUIStandardConfigService, translationService,
								  layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcTotalTypeDto',
						moduleSubModule: 'Basics.ProcurementConfiguration'
					});
					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}
					function UIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;

					return  new BaseService(layout, domainSchema, translationService);
				}
			]);
})();