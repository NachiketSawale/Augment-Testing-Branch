/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupFilterMarkFilterFactory', [
		'_',
		'PlatformMessenger',
		'basicsCostGroupFilterCacheService',
		'basicsCostGroupFilterCacheTypes',
		function (_,
		          PlatformMessenger,
		          filterCacheService,
		          cacheTypes) {

			function createService(serviceDescriptor, createOptions) {
				if (!filterCacheService.hasService(cacheTypes.COSTGROUP_MARK_FILTER_SERVICE, serviceDescriptor)) {

					var options = angular.merge({
							onRemoveFilter: angular.noop
						}, createOptions),
						service = {
							_filterItems: [],
							onRemoveFilter: new PlatformMessenger(),
							isFilter: function () {
								return this._filterItems.length > 0;
							},
							addFilter: function (items) {
								_.each(items, function (item) {
									if (!_.some(service._filterItems, {Id: item.Id})) {
										service._filterItems.push(item);
									}
								});
							},
							removeFilter: function (predicate, stopFireEvent, resetMarker) {
								var removePredicate = predicate && _.isFunction(predicate) ? predicate : function () {
									return true;
								};
								var removeItems = _.remove(this._filterItems, function (item) {
									var isMatched = removePredicate(item);
									if (isMatched && resetMarker !== false) {
										item.IsMarked = false;
									}
									return isMatched;
								});

								if (!stopFireEvent) {
									options.onRemoveFilter(this._filterItems);
								}
								this.onRemoveFilter.fire(this._filterItems, removeItems);
							},
							getFilters: function () {
								return this._filterItems;
							}
						};

					filterCacheService.setService(cacheTypes.COSTGROUP_MARK_FILTER_SERVICE, serviceDescriptor, service);

				}
				return filterCacheService.getService(cacheTypes.COSTGROUP_MARK_FILTER_SERVICE, serviceDescriptor);
			}

			return {
				createService: createService
			};

		}

	]);

})(angular);