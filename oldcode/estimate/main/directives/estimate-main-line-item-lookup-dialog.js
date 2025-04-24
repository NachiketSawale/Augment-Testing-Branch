/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */
(function(angular, globals){
	'use strict';

	var moduleName = 'estimate.main';

	globals.lookups.estLineItemLookup = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'estlineitemlookup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'c54ba5e9e9ef477180a280f7b517e2e8',
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
					},
					{
						id: 'boqitemfk',
						field: 'BoqItemFk',
						name: 'BoQ Item Ref. No',
						name$tr$: 'estimate.main.boqItemFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estboqitems',
							displayMember: 'Reference',
							dataServiceName:'estimateMainBoqItemService',
							mainServiceName:'estimateMainService'
						},
						width: 120
					},
					{
						id: 'brief',
						name: 'BoQ Root Item Ref. No BriefInfo',
						field: 'BoqItemFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estboqitems',
							displayMember: 'BriefInfo.Translated',
							dataServiceName: 'estimateMainBoqItemService',
							mainServiceName:'estimateMainService'
						},
						width: 120
					},
					{
						id: 'boqheaderfk',
						name: 'BoQ Root Item Ref. No',
						name$tr$: 'estimate.main.boqRootRef',
						field: 'BoqHeaderFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'estBoqHeaders',
							displayMember: 'Reference',
							dataServiceName: 'estimateMainBoqHeaderService',
							mainServiceName:'estimateMainService'
						},
						width: 120
					}
				],
				width: 500,
				height: 200,
				title: {name: 'Estimate Search Dialog', name$tr$: 'estimate.main.estimateTitle'},
				disableDataCaching: true,
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	angular.module(moduleName).directive('estimateMainEstLineItemLookupDialog', estimateMainEstLineItemLookupDialog);

	estimateMainEstLineItemLookupDialog.$inject = ['BasicsLookupdataLookupDirectiveDefinition','$translate'];

	function estimateMainEstLineItemLookupDialog(BasicsLookupdataLookupDirectiveDefinition,$translate) {
		var providerInfo = globals.lookups.estLineItemLookup();
		_.find(providerInfo.lookupOptions.columns, {id: 'brief'}).name = $translate.instant('estimate.main.boqItemFk') + ' -' + $translate.instant('estimate.main.briefInfo');

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
	}
})(angular, globals);
