/**
 * Created by wui on 11/1/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeItemTextLayout', ['_', 'basicsLookupdataLookupFilterService', 'procurementContextService',
		function (_, basicsLookupdataLookupFilterService, moduleContext) {
			var filters = [
				{
					key: 'prc-item-scope-prc-text-type-filter',
					serverSide: true,
					fn: function () {
						let mainService = moduleContext.getMainService();
						let currentItem = mainService.getSelected();
						if (!currentItem) {
							return '';
						}
						let prcHeader = currentItem.PrcHeaderEntity;
						if (prcHeader) {
							return {
								ForItem: true,
								PrcConfiguraionFk: _.isFunction(mainService.getPrcConfigurationId) ? mainService.getPrcConfigurationId() : prcHeader.ConfigurationFk
							};
						}

						return {
							ForItem: true,
							PrcConfiguraionFk: 0
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			return {
				'fid': 'prc.item.scope.item.text',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [{
					'gid': 'basicData',
					'attributes': ['prctexttypefk']
				}],
				'overloads': {
					'prctexttypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'procurement-text-type-combobox',
								lookupOptions: {filterKey: 'prc-item-scope-prc-text-type-filter'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Configuration2TextType', 'displayMember': 'Description'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-text-type-combobox',
								'descriptionMember': 'Description',
								lookupOptions: {
									filterKey: 'prc-item-scope-prc-text-type-filter'
								}
							}
						}
					}
				}
			};
		}
	]);

	angular.module(moduleName).factory('prcItemScopeItemTextUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService',
			'prcItemScopeItemTextLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domains = platformSchemaService.getSchemaFromCache({typeName: 'MaterialScopeDtlBlobDto', moduleSubModule: 'Basics.Material'}).properties;

				return new BaseService(layout, domains, translationService);
			}
		]);

})(angular);