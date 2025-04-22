/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	angular.module('sales.contract').directive('salesContractCodeSelector', ['_', '$q', 'salesContractLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, salesContractLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 2,
				lookupType: 'salesContractCodeSelector',
				valueMember: 'Id',
				uuid: '9E9CDA313E754949BEF028B3EFDA8ED3', //'4BEE8BBCBC92472DB4C523AA32B05BCC',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 140, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description', width: 240, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription' }
				],
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let dataItem = angular.copy(args.selectedItem);
							if (args.entity && dataItem) {
								if (dataItem && args.entity) {
									args.entity.OrdHeaderFk = dataItem.Id;
								}
							}
						}
					}
				]
			};
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'salesContractCodeLookupHandler',
					getList: function getList() {	
						salesContractLookupDataService.getSalesContractByBid().then(function (data) {
							return _.filter(data, function (item) {
								return !item.IsOrderedStatus && !item.IsReadOnly;
							});
						});
					},
					getDefault: function getDefault() {
						return $q.when([]);
					},
			
					getSearchList: function getSearchList() {
						return salesContractLookupDataService.getSalesContractByBid().then(function (data) {
							data = _.filter(data, function (item) {
								return !item.IsOrderedStatus && !item.IsReadOnly;
							});
							return data;
						});
					}
				}
			});
		}
	]);
})();
