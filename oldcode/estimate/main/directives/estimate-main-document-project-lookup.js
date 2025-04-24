/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* jshint -W072 */
	angular.module('estimate.main').directive('estimateMainDocumentProjectLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupDirectiveDefinition) {
			let defaults = {
				version: 3,
				lookupType: 'EstimateMainHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '434bdad9cbdc4909a68f501cb672c575',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'estimate.main.estimateCode',
						width: 120
					},
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$: 'estimate.main.estimateDescription',
						width: 120
					}
				],
				width: 500,
				height: 200,
				title: {name: 'Estimate Search Dialog', name$tr$: 'estimate.main.estimateTitle'}
			};
			return new BasicsLookupDirectiveDefinition('lookup-edit', defaults);
		}]);
})(angular);
