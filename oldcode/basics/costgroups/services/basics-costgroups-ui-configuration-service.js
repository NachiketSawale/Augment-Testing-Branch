(function () {
	'use strict';
	var moduleName = 'basics.costgroups';
	var cloudCommonModule = 'cloud.common';
	/**
	 * @ngdoc service
	 * @name schedulingMainEventConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).value('basicsCostGroupsUIConfigurationService',
		{
			fid: 'basics.costgroups.detail',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['code', 'descriptioninfo', 'quantity', 'uomfk', 'referencequantitycode','leadquantitycalc','noleadquantity','islive']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			translationInfos: {
				'extraModules': [moduleName],
				'extraWords': {
					Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
					Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
					UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'},
					ReferenceQuantityCode: {location: moduleName, identifier: 'referenceQuantityCode', initial: 'Reference Quantity'},

					NoLeadQuantity: {location: moduleName, identifier: 'noleadquantity', initial: 'No Lead Quantity'},
					LeadQuantityCalc: {location: moduleName, identifier: 'leadquantitycalc', initial: 'Calculate Lead Quantity'},
					IsLive: {location: moduleName, identifier: 'islive', initial: 'Active'}
				}
			},
			overloads: {
				code: {
					'mandatory': true
				},
				referencequantitycode: { readonly:true },
				leadquantitycalc :{'domain': 'boolean'},
				noleadquantity :{'domain': 'boolean'},
				'islive' :{'domain': 'boolean',readonly:true},
				'uomfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-uom-lookup',
						'options': {
							'eagerLoad': true
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'basics-lookupdata-uom-lookup',
							lookupOptions: {
								isFastDataRecording: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}
				}
			}
		}
	);
})(angular);

