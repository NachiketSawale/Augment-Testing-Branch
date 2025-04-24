(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* global _ */
	angular.module( 'basics.materialcatalog' ).directive( 'basicsMaterialMaterialCatalogLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupDescriptorService',
		'platformModalService',
		function (
			BasicsLookupdataLookupDirectiveDefinition,
			basicsLookupdataLookupDescriptorService,
			platformModalService
		) {
			var defaults = {
				lookupType: 'MaterialCatalog',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '9bb33e32db564580a9a8a00e3f31667b',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'bpname', field: 'BusinessPartnerName1', name: 'Business Partner Name1', width: 100, name$tr$: 'cloud.common.entityBusinessPartnerName1' }
				],
				width: 500,
				height: 200,
				title: { name: 'Framework Contract Search Dialog', name$tr$: 'basics.materialcatalog.frameworkContractTitle' },
				buildSearchString:function(searchValue){
					if (_.has(this, 'filterOptions.filterIsFramework') && this.filterOptions.filterIsFramework) {
						var isFrameworkCatalogType = basicsLookupdataLookupDescriptorService.getData('isFrameworkCatalogType');
						if (!isFrameworkCatalogType) {
							platformModalService.showErrorBox('procurement.contract.noIsFrameworkMaterialCatalogType', 'cloud.common.errorMessage');
						}
					}
					if(!searchValue){
						return '';
					}
					var searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")Or BusinessPartnerName1.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g,searchValue);
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);