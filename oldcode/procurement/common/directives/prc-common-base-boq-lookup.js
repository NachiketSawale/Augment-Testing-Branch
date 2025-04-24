/**
 * Created by bh on 22.09.2015.
 */
(function (angular, globals) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	'use strict';
	var moduleName = 'procurement.common';

	globals.lookups.prcBaseBoqs = function prcBaseBoqs($injector) {
		var prcBaseBoqLookupService = $injector.get('prcBaseBoqLookupService');
		var q = $injector.get('$q');
		return {
			lookupOptions: {
				lookupType: 'prcBaseBoqs',
				valueMember: 'Id',
				displayMember: 'BoqRootItem.Reference',
				uuid: '911680ea1cd444b8ab3b7c0684d2a2a6',
				disableDataCaching: true,
				columns: [
					{  id: 'Reference',
						field: 'BoqRootItem.Reference',
						name$tr$: 'cloud.common.entityReference'
					},
					{
						id: 'BriefInfo',
						field: 'BoqRootItem.BriefInfo.Translated',
						name$tr$: 'cloud.common.entityBrief'
					}
				],
				width: 500,
				height: 200
			},
			dataProvider: {
				myUniqueIdentifier: 'PrcBaseBoqLookupDataHandler',

				getList: function () {
					var deferred = q.defer();

					deferred.resolve(prcBaseBoqLookupService.getPrcBaseBoqList());
					return deferred.promise;
				},

				getDefault: function () {
					var item = {};
					var list = prcBaseBoqLookupService.getPrcBaseBoqList();
					for (var i = 0; i < list.length; i++) {
						if (list[i].IsDefault === true) {
							item = list[i];
							break;
						}
					}
					return item;
				},

				getItemByKey: function (value) {
					var deferred = q.defer();
					prcBaseBoqLookupService.getPrcBaseBoqList().then(function (list) {
						var item = null;
						if(list&&list.length>0) {
							for (var i = 0; i < list.length; i++) {
								if (list[i].Id === value) {
									item = list[i];
									break;
								}
							}
						}
						deferred.resolve(item);
					});

					return deferred.promise;
				},

				getSearchList: function () {
					return prcBaseBoqLookupService.getPrcBaseBoqList();
				}
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name prcCommonBaseBoqLookup
	 * @requires  basicsCostCodesLookupService
	 * @description ComboBox to select the procurement base boqs
	 */

	angular.module(moduleName).directive('prcCommonBaseBoqLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var ret;
			var defaults = globals.lookups.prcBaseBoqs($injector);
			ret = new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				lookupTypesServiceName: 'prcBaseBoqLookupTypes',
				dataProvider: defaults.dataProvider
			});

			return ret;
		}
	]);
})(angular, globals);