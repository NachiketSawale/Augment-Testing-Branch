/**
 * Created by pel on 2/25/2021.
 */
(function (angular) {
	'use strict';
	/*global _,globals*/

	var modName = 'basics.clerk';
	angular.module(modName).directive('basicsRoleForWorkflowDialog', [
		'$q',
		'$http',
		'BasicsLookupdataLookupDirectiveDefinition',
		'$translate',
		'basicsLookupdataLookupDescriptorService',
		function (
			$q,
			$http,
			BasicsLookupdataLookupDirectiveDefinition,
			$translate,
			lookupDescriptorService
		) {
			var defaults = {
				lookupType: 'basicsRole',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: 'c1d24b51a07f4ad1b6a946bda23ebfe9',
				dialogUuid: '6d17db2529224a3f83590c0b2f3f1866',
				columns: [
					{ id: 'description', field: 'DescriptionInfo.Translated', name: 'Description', name$tr$: 'basics.reporting.entityDescription', width: 150 }
				],
				width: 750,
				height: 200,
				title: { name: $translate.instant('basics.clerk.roleTitle')}
			};

			var customOptions = {
				lookupTypesServiceName: 'BasicsRole',
				url: {getList: 'basics/customize/ClerkRole/list'},
				dataProvider: {
					getList: function () {
						var deferred = $q.defer();
						deferred.resolve(getDataFromDB());
						return deferred.promise;
					},
					getItemByKey: function (value) {
						var deferred = $q.defer();
						var reportsList = lookupDescriptorService.getData('BasicsRole');
						if(reportsList) {
							deferred.resolve(_.find(reportsList, {Id: value}));
						}
						else {
							getDataFromDB().then(function (data) {
								deferred.resolve(_.find(data, {Id: value}));
							});
						}
						return deferred.promise;
					},
					getSearchList: function getSearchList(value, param, scope, searchSettings) {
						var list = [];
						var deferred = $q.defer();
						var reportsList = lookupDescriptorService.getData('BasicsRole');
						if (reportsList) {
							_.forEach(reportsList, function (i) {
								var val = getParam(i, param);
								var searchStr = searchSettings.searchString ? searchSettings.searchString.toLowerCase() : null;
								if (val && searchStr && val.search(searchStr) !== -1) {
									list.push(i);
								}
							});
							deferred.resolve(list);
						}
						else {
							getDataFromDB().then(function (data) {
								if (data) {
									_.forEach(data, function (i) {
										var val = getParam(i, param);
										var searchStr = searchSettings.searchString ? searchSettings.searchString.toLowerCase() : null;
										if (val && searchStr && val.search(searchStr) !== -1) {
											list.push(i);
										}
									});
								}
								deferred.resolve(list);
							});
						}

						return deferred.promise;
					}
				}
			};

			function getDataFromDB() {
				var deferred = $q.defer();
				$http.post(globals.webApiBaseUrl + customOptions.url.getList)
					.then(function (response) {
						lookupDescriptorService.attachData({BasicsRole: response.data}); //store it into lookup descriptor service
						deferred.resolve(response.data);
					});
				return deferred.promise;
			}

			function getParam(item, param) {
				var value = null;
				if (!param) {
					return value;
				}
				var paramArray = param.split('.');
				if (paramArray === 1) {
					return item[param].toLowerCase();
				}
				else {
					var obj = item;
					paramArray.every(function(i) {
						if (_.isObject(obj[i])) {
							obj = obj[i];
							return true;
						}
						else {
							value = obj[i];
							return false;
						}
					});
					return value.toLowerCase();
				}

			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, customOptions);
		}
	]);
})(angular);