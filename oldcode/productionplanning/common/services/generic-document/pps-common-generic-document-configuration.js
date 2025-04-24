(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonGenericDocumentLayout', DocumentLayout);
	DocumentLayout.$inject = ['ppsCommonGenericDocumentFromValuesHelper', 'basicsLookupdataConfigGenerator'];
	function DocumentLayout(ppsCommonGenericDocumentFromValuesHelper, basicsLookupdataConfigGenerator) {
		let selectOptions = {
			items: ppsCommonGenericDocumentFromValuesHelper.translatedFromValues,
			valueMember: 'id',
			displayMember: 'description'
		};

		return {
			fid: 'productionplanning.common.generic.document.layout',
			version: '1.0.0',
			groups: [{
				gid: 'baseGroup',
				attributes: ['from', 'documenttypefk', 'ppsdocumenttypefk', 'description', 'barcode', 'revision']
			}, {
				gid: 'entityHistory',
				isHistory: true
			}],
			overloads: {
				from: {
					readonly: true,
					grid: {
						formatter: 'select',
						formatterOptions: selectOptions,
						editor: 'select',
						editorOptions: selectOptions
					}
				},
				documenttypefk: {
					//readonly: true,
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-table-document-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'documentType',
							displayMember: 'Description'
						},
						width: 120
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-table-document-type-combobox',
							descriptionMember: 'Description'
						}
					}
				},
				ppsdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsdocumenttype', null, {showIcon: false}),
				//description: {readonly: true},
				//barcode: {readonly: true},
				revision: {readonly: true}
			}
		};
	}

})(angular);