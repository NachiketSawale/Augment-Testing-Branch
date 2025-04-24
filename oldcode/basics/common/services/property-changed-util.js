/**
 * Created by chi on 2015/8/13. Implemented by sus.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */
	/* jshint -W074 */
	angular.module('basics.common').factory('platformPropertyChangedUtil',
		['platformObjectHelper', '$timeout', function (platformObjectHelper, $timeout) {

			return {
				onlyOneIsTrue: function (dataService, currentItem, value, field) {
					const $value = value || platformObjectHelper.getValue(currentItem, field);
					const others = [];
					if (value) {
						angular.forEach(dataService.getList(), function (item) {
							if (platformObjectHelper.getValue(item, field)) {
								others.push(item);
							}
							platformObjectHelper.setValue(item, field, false);
						});
					}
					return $timeout(function () {
						platformObjectHelper.setValue(currentItem, field, $value);
						dataService.markItemAsModified(currentItem);
						angular.forEach(others, dataService.markItemAsModified);
					}, 100);
				},
				exclusion: function (fields) {
					return function (dataService, currentItem, value, field) {
						if (value) {
							angular.forEach(fields, function (fieldItem) {
								if (fieldItem !== field) {
									platformObjectHelper.setValue(currentItem, fieldItem, false);
								}
							});
						}
					};
				}
			};
		}]);

})(angular);