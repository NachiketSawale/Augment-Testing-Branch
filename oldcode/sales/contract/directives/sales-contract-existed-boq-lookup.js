/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {

	'use strict';
	var moduleName = 'sales.common';
	/**
	 * @ngdoc directive
	 * @name salesContractExistedBoqLookup
	 * @description ComboBox to select the sales contract existed boqs
	 */

	angular.module(moduleName).directive('salesContractExistedBoqLookup', ['_', '$q', '$translate', '$injector', 'salesCommonBaseBoqLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, $translate, $injector, salesCommonBaseBoqLookupService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'salesContractExistedBoqs',
				valueMember: 'Id',
				displayMember: 'BoqRootItem.Reference',
				uuid: '7091855730c946699f5ffdc3947319f8',
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
				lookupTypesServiceName: 'salesContractExistedBoqLookupTypes',
				dataProvider: {
					myUniqueIdentifier: 'salesContractExistedBoqLookupTypes',

					getList: function () {
						var deferred = $q.defer();
						var lookupService = $injector.get('basicsLookupdataLookupDescriptorService');
						deferred.resolve(_.map(lookupService.getData('salesContractExistedBoqs')));
						return deferred.promise;
					},
					getItemByKey: function (value) {
						var lookupService = $injector.get('basicsLookupdataLookupDescriptorService');
						var list = _.map(lookupService.getData('salesContractExistedBoqs'));

						return $q.when(list).then(function (list) {
							return _.find(list, function (item) {
								return item.Id === value;
							});
						});
					},

					getSearchList: function () {
						var lookupService = $injector.get('basicsLookupdataLookupDescriptorService');
						var list = _.map(lookupService.getData('salesContractExistedBoqs'));

						return $q.when(list);
					}
				}
			});

			return ret;
		}
	]);
})(angular);