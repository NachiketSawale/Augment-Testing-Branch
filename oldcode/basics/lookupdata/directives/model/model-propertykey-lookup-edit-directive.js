/**
 * Created by luy on 6/13/2020.
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	angular.module('basics.lookupdata').directive('modelAdministrationPropertyKeyLookupEditDirective', [
		'$q',
		'$http',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupDescriptorService',
		function (
			$q,
			$http,
			BasicsLookupdataLookupDirectiveDefinition,
			basicsLookupdataLookupDescriptorService) {

			var defaults = {
				version: 3,
				lookupType: 'modelAdministrationPropertyKeys',
				valueMember: 'Id',
				displayMember: 'PropertyName',
				showClearButton: true,
				disableDataCaching: true,
				columns: [
					{
						id: 'PropertyName',
						field: 'PropertyName',
						name: 'PropertyName',
						formatter: 'comment',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'ValueTypeFk',
						field: 'ValueTypeFk',
						name: 'ValueTypeFk',
						formatter: 'lookup',
						name$tr$: 'cloud.common.entityType',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.mdlvaluetype',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						width: 150
					}
				],
				uuid: 'efa1d62fee4849d7903dd2711952d539',
				pageOptions: {
					enabled: true,
					size: 100
				}
			};
			basicsLookupdataLookupDescriptorService.addData('modelAdministrationPropertyKeys', []);

			function getPageListByFilter(searchRequest){
				var deferred = $q.defer();
				var searchResult = {};
				var defaultRequest = {
					FilterKey: null,
					PageState: {PageNumber: 0, PageSize: 100},
					SearchFields: ['PropertyName', 'ValueTypeFk'],
					SearchText: '',
					TreeState: {StartId: null, Depth: null}
				};
				searchRequest = !searchRequest ? defaultRequest : searchRequest;
				$http.post(globals.webApiBaseUrl + 'model/administration/propertykey/listwithvaluetypebypage', searchRequest).then(function (response) {
					if (response.data !== null && response.data.RecordsFound > 0) {
						if (response.data.SearchList && response.data.SearchList.length) {
							basicsLookupdataLookupDescriptorService.addData('modelAdministrationPropertyKeys', response.data.SearchList);
						}
						searchResult = {
							itemsFound: response.data.RecordsFound,
							itemsRetrieved: response.data.RecordsRetrieved,
							items: response.data.SearchList
						};
						deferred.resolve(searchResult);
					}
				});

				return deferred.promise;
			}

			var getItemPromise = {};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function () {
						return getPageListByFilter();
					},
					getSearchList: function (searchRequest) {
						return getPageListByFilter(searchRequest);
					},
					getItemByKey: function (key) {
						var defer = $q.defer();
						if (!key) {
							defer.resolve(null);
							return defer.promise;
						}
						else {
							var keys = basicsLookupdataLookupDescriptorService.getData('modelAdministrationPropertyKeys');
							if (keys) {
								var item = _.find(keys, {Id: key});
								if (item) {
									defer.resolve(item);
									return defer.promise;
								}
							}

						}
						if (getItemPromise[key]) {
							return getItemPromise[key];
						}
						else {
							getItemPromise[key] = $http.get(globals.webApiBaseUrl + 'model/administration/propertykey/getwithvaluetype?id=' + key).then(function(res) {
								basicsLookupdataLookupDescriptorService.addData('modelAdministrationPropertyKeys', [res.data]);
								getItemPromise[key] = null;
								return res.data;
							});
							return getItemPromise[key];
						}
					}
				}
			});
		}
	]);
})(angular);