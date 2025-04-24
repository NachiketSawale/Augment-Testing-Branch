/**
 * Created by alm on 22.06.2022.
 */
(function (angular, globals) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	'use strict';
	var moduleName = 'procurement.requisition';

	globals.lookups.prcBoqHeaders = function prcBoqHeaders($injector) {
		var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService').getService();
		var q = $injector.get('$q');
		return {
			lookupOptions: {
				lookupType: 'prcBoqHeaders',
				valueMember: 'Id',
				displayMember: 'BoqRootItem.Reference',
				uuid: '911680ea1cd444b8ab3b7c0684d2a1a6',
				disableCache: true,
				columns: [
					{  id: 'Reference',
						field: 'BoqRootItem.Reference',
						width: 200,
						name$tr$: 'cloud.common.entityReference'
					},
					{
						id: 'BriefInfo',
						width: 250,
						field: 'BoqRootItem.BriefInfo.Translated',
						name$tr$: 'cloud.common.entityBrief'
					}
				],
				width: 500,
				height: 200
			},
			dataProvider: {
				getList: function () {
					var deferred = q.defer();
					var list = procurementCommonPrcBoqService.getList();
					deferred.resolve(list);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var list = procurementCommonPrcBoqService.getList();
					var item = null;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
					}
					var deferred = q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name prcCommonBoqHeaderLookup
	 * @description ComboBox to select the procurement boq header
	 */

	angular.module(moduleName).directive('prcCommonBoqHeaderLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var ret;
			var defaults = globals.lookups.prcBoqHeaders($injector);
			ret = new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});

			return ret;
		}
	]);
})(angular, globals);