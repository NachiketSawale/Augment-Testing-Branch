/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {

	'use strict';
	var moduleName = 'sales.common';
	/**
	 * @ngdoc directive
	 * @name salesCommonBaseBoqLookup
	 * @description ComboBox to select the sales base boqs
	 */

	angular.module(moduleName).directive('salesCommonBaseBoqLookup', ['_', '$q', '$translate', 'salesCommonBaseBoqLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, $translate, salesCommonBaseBoqLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'salesBaseBoqs',
				valueMember: 'Id',
				displayMember: 'BoqRootItem.Reference',
				uuid: '41f498fc39b545d28c845913b1fdbc55',
				disableDataCaching: true,
				columns: [
					{  id: 'Reference',
						field: 'BoqRootItem.Reference',
						name: $translate.instant('cloud.common.entityReference'),
						formatter: 'code',
						searchable: true
					},
					{
						id: 'BriefInfo',
						field: 'BoqRootItem.BriefInfo',
						name: $translate.instant('cloud.common.entityBrief'),
						formatter: 'translation',
						searchable: true
					}
				],
				width: 500,
				height: 200
			};

			var ret;
			ret = new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				lookupTypesServiceName: 'salesBaseBoqLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'SalesBaseBoqLookupDataHandler',

					getList: function () {
						var deferred = $q.defer();

						deferred.resolve(salesCommonBaseBoqLookupService.getSalesBaseBoqList());
						return deferred.promise;
					},

					getDefault: function () {
						var item = {};
						var list = salesCommonBaseBoqLookupService.getSalesBaseBoqList();
						for (var i = 0; i < list.length; i++) {
							if (list[i].IsDefault === true) {
								item = list[i];
								break;
							}
						}
						return item;
					},

					getItemByKey: function (value) {
						return salesCommonBaseBoqLookupService.getSalesBaseBoqList().then(function (list) {
							return _.find(list, function (item) {
								return item.Id === value;
							});
						});
					},

					getSearchList: function () {
						return salesCommonBaseBoqLookupService.getSalesBaseBoqList();
					}
				}
			});

			return ret;
		}
	]);
})(angular);