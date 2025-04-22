(function () {

	'use strict';

	angular.module('sales.billing').directive('salesBillingCodeSelector', ['_', '$q', 'moment', 'salesBillingNoLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, moment, salesBillingNoLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'salesBillingCodeSelector',
				valueMember: 'Id',
				// displayMember: 'Code',
				uuid: 'B7CD7EE6569C421B936F89352A8CC8F6',
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
									args.entity.Description = dataItem.DescriptionInfo.Translated;
									args.entity.ProjectFk = dataItem.ProjectFk;
									args.entity.RubricCategoryFk = dataItem.RubricCategoryFk;
									args.entity.BilHeaderFk = dataItem.Id;
									args.entity.ConfigurationFk = dataItem.ConfigurationFk;
									args.entity.TypeFk = dataItem.TypeFk;
									args.entity.OrdHeaderFk = dataItem.OrdHeaderFk;
									
								}
							}
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'salesBillingNoLookupHandler',

					getList: function getList(/* settings, scope */) {
						return salesBillingNoLookupDataService.getSalesBillingByWipList().then(function (data) {
							return data;
						});
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value , options) {
						return salesBillingNoLookupDataService.getItemById(value, options);
					},

					getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
						return salesBillingNoLookupDataService.getSalesBillingByWipList().then(function (data) {
							return data;
						});
					}
				}
			});
		}
	]);

})();
