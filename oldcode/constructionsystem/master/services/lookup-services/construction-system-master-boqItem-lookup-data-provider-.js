/**
 * Created by jes on 3/8/2017.
 */
/* global globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterBoqItemLookupDataProvider', constructionSystemMasterBoqItemLookupDataProvider);

	constructionSystemMasterBoqItemLookupDataProvider.$inject = [
		'_',
		'$http',
		'boqMainImageProcessor',
		'cloudCommonGridService'
	];

	function constructionSystemMasterBoqItemLookupDataProvider(
		_,
		$http,
		boqMainImageProcessor,
		cloudCommonGridService
	) {
		var service = {
			getList: function () {
				return getSearchList('');
			},
			getSearchList: getSearchList
		};

		var boqHeaders = null;

		function getBoqHeaderLookup() {
			return $http.post(globals.webApiBaseUrl + 'boq/main/getboqheaderlookup', {BoqType: 1}) // only care about wic boq
				.then(function (res) {
					boqHeaders = _.isArray(res.data) ? res.data : [];
					return boqHeaders;
				});
		}

		function getSearchList(searchString) {
			if (_.isArray(boqHeaders)) {
				return search(searchString);
			} else {
				return getBoqHeaderLookup().then(function () {
					return search(searchString);
				});
			}

			function search(searchString) {
				var param = {
					BoqHeaderIds: _.map(boqHeaders, _.property('BoqHeaderFk')),
					FilterValue: searchString
				};
				return $http.post(globals.webApiBaseUrl + 'boq/main/getboqitemsearchlist', param)
					.then(function (res) {
						return _.isArray(res.data) ? processItems(res.data) : [];
					});
			}
		}

		function processItems(items) {
			var output = [];
			cloudCommonGridService.flatten(items, output, 'BoqItems');
			_.forEach(output, function (item) {
				boqMainImageProcessor.processItem(item);
			});
			return items;
		}

		return service;
	}

})(angular, globals);