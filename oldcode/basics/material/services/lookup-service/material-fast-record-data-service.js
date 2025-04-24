(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialFastRecordDataService', [
		'$q',
		'$http',
		'$translate',
		function ($q, $http, $translate) {
			let cache = new Map();
			const service = {};
			const baseUrl = globals.webApiBaseUrl + 'basics/material/commoditysearch/';

			service.getItemById = function (id) {
				return cache.get(id);
			};

			service.getItemByIdAsync = function (id) {
				const item = cache.get(id);

				if (item) {
					return $q.when(item);
				}

				return $http.get(baseUrl + 'getcommoditybyid?materialId=' + id).then(function (response) {
					const data = response.data;

					if (data) {
						cache.set(id, data);
					}

					return data;
				});
			};

			service.resolveStringValueCallback = function (options) {
				return function (value) {
					if (!value) {
						return {
							apply: true,
							valid: true,
							value: null
						};
					}

					const cacheItem = searchMaterialFromCache(value);

					if (cacheItem) {
						return {
							apply: true,
							valid: true,
							value: cacheItem.Id
						};
					}

					const fastSearchPayload = {
						Code: value
					};

					if(options.prepareFastSearchPayload) {
						options.prepareFastSearchPayload(fastSearchPayload);
					}

					return $http.post(baseUrl + 'fastsearch', fastSearchPayload).then(function (response) {
						const item = response.data;

						if (item) {
							cache.set(item.Id, item);

							return {
								apply: true,
								valid: true,
								value: item.Id
							};
						}

						return {
							apply: true,
							valid: false,
							value: value,
							error: $translate.instant('basics.material.materialNotFound')
						};
					});
				};
			};

			function searchMaterialFromCache(code) {
				const items = [...cache.values()];

				return _.find(items, item => {
					return item.Code && item.Code.toLowerCase() === code.toLowerCase();
				});
			}

			return service;
		}
	]);

})(angular);