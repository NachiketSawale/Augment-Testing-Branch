/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */
(function(angular, globals){
	'use strict';

	let moduleName = 'qto.main';

	globals.lookups.lineitem2Qtolookup = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'lineitem2Qtolookup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'a73d4032f2ad446db440cf74282e39c1',
				columns: [
					{
						id: 'code',
						formatter: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'estimate.main.estimateCode',
						width: 120
					},
					{
						id: 'description',
						formatter: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$: 'estimate.main.estimateDescription',
						width: 120
					},
					{
						id: 'EstimationCode',
						formatter: 'code',
						field: 'EstimationCode',
						name: 'Estimate Code',
						width: 150,
						name$tr$: 'estimate.main.entityEstimationHeader'
					},
					{
						id: 'EstimateDes',
						formatter: 'description',
						field: 'EstimationDescription.Translated',
						name: 'Estimate Description',
						width: 150,
						name$tr$: 'cloud.common.entityEstimateHeaderDescription'
					}
				],
				disableDataCaching: false,
				inputSearchMembers: ['Code', 'DescriptionInfo']
			}
		};
	};

	angular.module(moduleName).directive('qtoMainLineItemLookup', qtoMainLineItemLookup);

	qtoMainLineItemLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition','$injector'];

	function qtoMainLineItemLookup(BasicsLookupdataLookupDirectiveDefinition, $injector) {
		let providerInfo = globals.lookups.lineitem2Qtolookup($injector);

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', providerInfo.lookupOptions);
	}
})(angular, globals);
