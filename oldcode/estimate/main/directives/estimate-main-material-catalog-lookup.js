(function (angular) {
	'use strict';
	/* global angular */
	/* global _ */
	angular.module('estimate.main').directive('estimateMainMaterialCatalogLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MaterialCatalog',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '224D24326DD64C978792C244D76A2AF8',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription'},
					{id: 'bpname', field: 'BusinessPartnerName1', name: 'Business Partner Name1', width: 100, name$tr$: 'cloud.common.entityBusinessPartnerName1'}
				],
				width: 500,
				height: 200,
				title: {name: 'Select Material Catalog', name$tr$: 'estimate.assemblies.importAssembliesWizard.selectMaterial'},
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					var searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")Or BusinessPartnerName1.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g, searchValue);
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);