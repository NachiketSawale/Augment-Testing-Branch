/**
 * Created by wui on 10/17/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeItemTextLayout', ['basicsLookupdataLookupFilterService',
		function (basicsLookupdataLookupFilterService) {
			var filters = [
				{
					key: 'basics-material-prc-text-type-filter',
					serverSide: true,
					fn: function () {
						return 'Foritem=true and Sorting>0';
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			return {
				'fid': 'basics.material.scope.item.text',
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
								directive: 'prc-Text-type-combobox',
								lookupOptions: {
									filterKey: 'basics-material-prc-text-type-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcTexttype',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'prc-Text-type-combobox',
								'descriptionMember': 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'basics-material-prc-text-type-filter'
								}
							}
						}
					}
				}
			};
		}
	]);

	angular.module(moduleName).factory( 'basicsMaterialItemTextUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService',
			'basicsMaterialScopeItemTextLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function ( platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domains = platformSchemaService.getSchemaFromCache({ typeName: 'MaterialScopeDtlBlobDto', moduleSubModule: 'Basics.Material'}).properties;

				return new BaseService(layout, domains, translationService);
			}
		] );

})(angular);