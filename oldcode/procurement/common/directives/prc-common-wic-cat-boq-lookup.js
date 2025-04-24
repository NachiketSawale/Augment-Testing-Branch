
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var  moduleName = 'procurement.common';

	angular.module(moduleName).directive('prcCommonWicCatBoqLookup', [
		'$q',
		'$http',
		'BasicsLookupdataLookupDictionary',
		'basicsLookupdataLookupDescriptorService',
		'BasicsLookupdataLookupDirectiveDefinition',
		function (
			$q,
			$http,
			LookupDictionary,
			basicsLookupdataLookupDescriptorService,
			BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'PrcWicCatBoqs',
				valueMember: 'Id',
				displayMember: 'BoqRootItem.Reference',
				uuid: '2b0e16feb9c34564a670e194910c1085',
				columns: [
					{id: 'boqnumber', field: 'BoqRootItem.Reference', name: 'Reference', formatter: 'description', name$tr$: 'cloud.common.entityReference' },
					{id: 'description', field: 'BoqRootItem.BriefInfo.Translated', name: 'Brief', formatter: 'description', name$tr$: 'cloud.common.entityBrief'}
				],
				width: 500,
				height: 200
			};
			var promiseCache = new LookupDictionary(false);
			function asyncGetList(boqWicCatFk) {
				return $http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + boqWicCatFk)
					.then(function (result) {
						basicsLookupdataLookupDescriptorService.updateData(defaults.lookupType, result.data);
						return result.data;
					});
			}
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getSearchList: function (searchString, displayMember, scope) {
						return asyncGetList(scope.entity.BoqWicCatFk);
					},

					getList: function (lookupOptions, scope) {
						return asyncGetList(scope.entity.BoqWicCatFk);
					},

					getItemByKey: function (value, options, scope) {
						if (value.Id) {
							var wicCatBoqs = basicsLookupdataLookupDescriptorService.getData(defaults.lookupType);
							if (wicCatBoqs && wicCatBoqs.length) {
								var wicCatBoq = wicCatBoqs[value.Id];
								if (wicCatBoq) {
									return $q.when(wicCatBoq);
								}
							}
						}
						if (value.PKey1 ||
							(scope && scope.entity && scope.entity.BoqWicCatFk)
						) {
							var defer;
							var key = value.PKey1 || scope.entity.BoqWicCatFk;
							var valueId = value.Id || scope.entity.BoqWicCatBoqFk;
							var promise = promiseCache.get(key);
							if (!promise) {
								defer = $q.defer();
								promiseCache.add(key, defer);
								return $q.when($http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + key)
									.then(function (result) {
										basicsLookupdataLookupDescriptorService.updateData(defaults.lookupType, result.data);
										var ret = _.find(result.data, {Id: valueId});
										ret = ret ? ret : null;
										defer.resolve(ret);
										defer = null;
										promiseCache.remove(key);
										return ret;
									}));
							}
							else {
								defer = promise;
							}
							return defer.promise;
						}
						else {
							return $q.when({});
						}
					}
				}
			});
		}]);
})(angular);