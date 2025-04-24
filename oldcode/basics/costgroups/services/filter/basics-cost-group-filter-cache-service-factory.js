/**
 * Created by wed on 09/04/2019.
 */
(function (angular, window) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupFilterCacheServiceFactory', [function () {

		function CacheServiceFactory(cacheTypes) {
			this._cache = new window.Map();
			this._cacheTypes = cacheTypes || {};
		}

		CacheServiceFactory.prototype.hasCacheType = function (cacheType) {
			return this._cacheTypes.hasOwnProperty(cacheType);
		};

		CacheServiceFactory.prototype.getCacheKey = function (cacheType, serviceDescriptor) {
			if (!this.hasCacheType(cacheType)) {
				throw new Error('cacheType "' + cacheType + '" not exists in current context.');
			}
			return cacheType + '_' + serviceDescriptor;
		};

		CacheServiceFactory.prototype.hasService = function (cacheType, serviceDescriptor) {
			var hasService = false;

			if (this.hasCacheType(cacheType)) {
				var cacheKey = this.getCacheKey(cacheType, serviceDescriptor);
				hasService = this._cache.has(cacheKey);
			}

			return hasService;
		};

		CacheServiceFactory.prototype.getService = function (cacheType, serviceDescriptor) {
			var service = null;

			if (this.hasService(cacheType, serviceDescriptor)) {
				var cacheKey = this.getCacheKey(cacheType, serviceDescriptor);
				service = this._cache.get(cacheKey);
			}

			return service;
		};

		CacheServiceFactory.prototype.setService = function (cacheType, serviceDescriptor, service) {
			if (this.hasCacheType(cacheType)) {
				var cacheKey = this.getCacheKey(cacheType, serviceDescriptor);
				this._cache.set(cacheKey, service);
			}
		};

		return {
			createService: function (cacheTypes) {
				return new CacheServiceFactory(cacheTypes);
			}
		};

	}]);

})(angular, window);