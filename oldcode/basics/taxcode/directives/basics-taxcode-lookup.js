(function (angular) {
	'use strict';

	angular.module('basics.taxcode').directive('basicsTaxCodeLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'ServiceDataProcessDatesExtension',
		function (BasicsLookupdataLookupDirectiveDefinition, ServiceDataProcessDatesExtension) {
			var defaults = {
				version: 2,
				lookupType: 'MdcTaxCode',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'beb36d7a8e0d4ab7807e00bb2302e0ff',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription'},
					{id: 'vatPercent', field: 'VatPercent', name: 'Vat Percent', width: 80, name$tr$: 'cloud.common.entityVatPercent'},
					{
						id: 'ValidFrom',
						field: 'ValidFrom',
						name: 'Valid From',
						name$tr$: 'basics.materialcatalog.validFrom',
						formatter: 'date'
					},
					{
						id: 'ValidTo',
						field: 'ValidTo',
						name: 'Valid To',
						name$tr$: 'basics.materialcatalog.validTo',
						formatter: 'date'
					},
					{
						id: 'comment', field: 'CommentTranslateInfo.Translated', name: 'Comments', width: 80, name$tr$: 'cloud.common.entityComment'
					}
				],
				dataProcessors: [
					new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);