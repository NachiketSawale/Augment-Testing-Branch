/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	angular.module('sales.contract').directive('salesContractWipCodeGridSelector', ['_', '$injector', 'moment', '$q', 'salesWipLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $injector, moment, $q, salesWipLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 2,
				lookupType: 'salesWipCodeGridSelector',
				valueMember: 'Id',
				// displayMember: 'Code',
				uuid: '4BEE8BBCBC92472DB4C523AA32B05BCC',
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
									args.entity.CurrencyFk = dataItem.CurrencyFk;
									args.entity.DescriptionInfo = dataItem.DescriptionInfo;
									args.entity.ProjectFk = dataItem.ProjectFk;
									args.entity.CompanyFk = dataItem.CompanyFk;
									args.entity.ClerkFk = dataItem.ClerkFk;
									args.entity.OrdHeaderFk = dataItem.OrdHeaderFk;
									args.entity.WipHeaderFk = dataItem.Id;
									args.entity.RubricCategoryFk = dataItem.RubricCategoryFk;
									args.entity.ConfigurationFk = dataItem.ConfigurationFk;
									if (dataItem.PerformedFrom) {
										let startDate = new Date(dataItem.PerformedFrom);
										args.entity.PerformedFrom = moment(startDate);
									}
									if (dataItem.PerformedTo) {
										let endDate = new Date(dataItem.PerformedTo);
										args.entity.PerformedTo = moment(endDate);
									}
							

									$injector.get('salesContractCreateWipWizardDialogService').getWipHeaderFk(dataItem.Id);
								}
							}
						}
					}
				]
			};
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'salesWipCodeGridLookupHandler',
					getList: function getList(/* settings, scope */) {	
						salesWipLookupDataService.getSalesWipByContractList().then(function (data) {
							return _.filter(data, function (item) {
								return !item.IsOrderedStatus && !item.IsReadOnly;
							});
						});
					},
					getDefault: function getDefault() {
						return $q.when([]);
					},
					getItemByKey: function getItemByKey(value/* , options, scope */) {
						return salesWipLookupDataService.getItemById(value);
					},
					getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
						return salesWipLookupDataService.getSalesWipByContractList().then(function (data) {
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
