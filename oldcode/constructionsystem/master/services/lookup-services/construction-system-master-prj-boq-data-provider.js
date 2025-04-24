(function (angular) {

	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterPrjBoqDataProvider',
		['$q',
			'$http',
			'basicsLookupdataLookupFilterService',
			'basicsLookupdataLookupDescriptorService',

			function ($q,
				$http,
				basicsLookupdataLookupFilterService,
				basicsLookupdataLookupDescriptorService) {

				var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/testinput/';

				return {
					getList: function (options) {
						var filter = basicsLookupdataLookupFilterService.getFilterByKey(options.filterKey),
							projectId = -1;
						if (filter.serverSide) {
							projectId = filter.fn();
						}
						return $http.get(httpRoute + 'getlist?ProjectId=' + projectId);
					},
					getItemByKey: function (value) {
						var boqItem = basicsLookupdataLookupDescriptorService.getData('PrjBoqItem'),
							findBoqItem,
							citem;

						for (var item in boqItem) {// jshint ignore:line
							if(Object.prototype.hasOwnProperty.call(boqItem,item)) {
								citem = boqItem[item];
								if (citem && citem.BoqHeaderFk && citem.BoqHeaderFk === value) {
									findBoqItem = citem;
									break;
								}
							}
						}

						if (!findBoqItem) {
							return $http.get(httpRoute + 'getprjboqitembykey?boqItemId=' + value).then(function (response) {
								if (Array.isArray(response.data)) {
									return response.data[0];
								}
								else {
									return response.data;
								}
							});
						}
						else {
							return $q.when(findBoqItem || []);
						}
					},
					getSearchList: function (searchString) {
						return $http.get(httpRoute + 'getlist?ProjectId=' + searchString).then(function (response) {
							if (Array.isArray(response.data)) {
								basicsLookupdataLookupDescriptorService.attachData({ PrjBoqItem: response.data });
							}
							return response.data;
						});
					}
				};
			}
		]);

})(angular);