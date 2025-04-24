/**
 * Created by chi on 5/31/2017.
 */
(function(angular){
	'use strict';
	var modName = 'basics.materialcatalog',
		cloudCommonModule = 'cloud.common';

	var basicsMaterialCatalogPriceVersionToCompanyLayout = {
		'fid': 'basics.materialCatalog.priceVesion.to.company.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['companyfk']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [cloudCommonModule],
			'extraWords': {
				CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Compnay'}
			}
		},
		'overloads': {
			'companyfk': { // TODO chi: filterkey
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-company-company-lookup',
						lookupOptions: {
							filterKey: 'basics-materialcatalog-price-version-to-company-company-filter'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'company',
						displayMember: 'Code'
					},
					width: 140
				},
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'basics-company-company-lookup',
						descriptionMember: 'CompanyName',
						lookupOptions: {
							filterKey: 'basics-materialcatalog-price-version-to-company-company-filter'
						}
					}
				}
			}
		},
		'addition': {
			grid: [
				{
					lookupDisplayColumn: true,
					field: 'CompanyFk',
					'name': 'Company Name',
					'name$tr$': 'cloud.common.entityCompanyName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'company',
						displayMember: 'CompanyName'
					},
					width: 140
				}
			]
		}
	};
	angular.module(modName).value('basicsMaterialCatalogPriceVersionToCompanyLayout', basicsMaterialCatalogPriceVersionToCompanyLayout);

})(angular);