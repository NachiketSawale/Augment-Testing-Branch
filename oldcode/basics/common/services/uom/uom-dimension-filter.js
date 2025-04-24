/**
 * Created by zov on 7/23/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonUomDimensionFilterService
	 * @function
	 * @requires basicsLookupdataLookupFilterService
	 *
	 * @description
	 * #
	 *
	 */
	angular.module('basics.common').factory('basicsCommonUomDimensionFilterService', ['basicsLookupdataLookupFilterService', '_',
		function (basicsLookupdataLookupFilterService, _) {

			function getLengthDimensionFilterKey(dimension) {
				return 'uom-' + dimension + '-length-dimension';
			}

			function filterLengthDimension(uom, dim) {
				if (uom) {
					return uom.LengthDimension === dim;
				}
				return false;
			}

			return {
				registerLengthDimensionFilter: function (dimension) {
					const filterKey = getLengthDimensionFilterKey(dimension);
					const fileter = basicsLookupdataLookupFilterService.getFilterByKey(filterKey);
					if (_.isNil(fileter)) {
						basicsLookupdataLookupFilterService.registerFilter([{
							key: filterKey,
							fn: function (uom) {
								return filterLengthDimension(uom, dimension);
							}
						}]);
					}
					return filterKey;
				},

				registerMassDimensionFilter: function () {
					const filterKey = 'uom-mass-dimension';
					const fileter = basicsLookupdataLookupFilterService.getFilterByKey(filterKey);
					if (_.isNil(fileter)) {
						basicsLookupdataLookupFilterService.registerFilter([{
							key: filterKey,
							fn: function (uom) {
								return uom.MassDimension !== 0;
							}
						}]);
					}

					return filterKey;
				}
			};
		}
	]);
})(angular);

