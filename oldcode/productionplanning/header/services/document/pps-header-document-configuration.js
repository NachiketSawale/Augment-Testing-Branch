(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.header';

	angular.module(moduleName).factory('ppsHeaderDocumentLayout', DocumentLayout);
	DocumentLayout.$inject = [];
	function DocumentLayout() {
		return {
			fid: 'productionplanning.header.documentlayout',
			version: '1.0.0',
			groups: [{
				gid: 'baseGroup',
				attributes: ['from', 'documenttypefk', 'description', 'barcode', 'revision']
			}, {
				gid: 'entityHistory',
				isHistory: true
			}],
			overloads: {
				from: {readonly: true},
				documenttypefk: {
					readonly: true,
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
				description: {readonly: true},
				barcode: {readonly: true},
				revision: {readonly: true}
			}
		};
	}

})(angular);