/**
 * Created by wui on 3/24/2015.
 * Handle lookup options dynamically.
 */

(function(angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';
	
	angular.module(moduleName).factory('basicsLookupdataLookupOptionService', [function () {

		var dynamicOptions = {};

		return {
			getOptions: getOptions,
			setOptions: setOptions,
			updateOptions: updateOptions,
			deleteOptions: deleteOptions,
			updateDisplayData: updateDisplayData,
			clear: clear,
			customizer: customizer
		};

		/**
		 * Custom merge function for lookup options
		 * @returns {*}
		 */
		function customizer(objValue, srcValue, key) {
			if (_.isArray(objValue) || key === 'title') {
				return srcValue;
			}
		}

		/**
		 * @description get dynamic options by lookup key.
		 * @param key
		 * @returns {*}
		 */
		function getOptions(key) {
			return dynamicOptions[key];
		}

		/**
		 * @description set dynamic options by lookup key.
		 * @param key
		 * @param value
		 */
		function setOptions(key, value) {
			var lookupApi = lookup(key);
			dynamicOptions[key] = value;
			if (lookupApi) {
				lookupApi.updateOptions(dynamicOptions[key]);
			}
		}

		/**
		 * @description update dynamic options by lookup key.
		 * @param key --lookup key
		 * @param value  --lookup options
		 */
		function updateOptions(key, value) {
			var lookupApi = lookup(key);
			var oldOptions = dynamicOptions[key];

			if (oldOptions) {
				angular.extend(oldOptions, value);
			} else {
				dynamicOptions[key] = value;
			}

			if (lookupApi) {
				lookupApi.updateOptions(dynamicOptions[key]);
			}
		}

		/**
		 * @description delete dynamic options by lookup key
		 * @param key
		 */
		function deleteOptions(key) {
			if (dynamicOptions.hasOwnProperty(key)) {
				dynamicOptions[key] = null;
				delete dynamicOptions[key];
			}
		}

		/**
		 * @description update display information data.
		 * @param key
		 */
		function updateDisplayData(key) {
			var lookupApi = lookup(key);
			if (lookupApi) {
				lookupApi.updateDisplayData();
			}
		}

		/**
		 * @description clear dynamic options cache.
		 */
		function clear(){
			dynamicOptions = {};
		}

		/**
		 * @description get lookup instance by lookup key.
		 * @param key
		 * @returns {*}
		 */
		function lookup(key) {
			if (key) {
				var lookupElement = $('div[data-lookup-key=' + key + ']');
				return lookupElement.length ? lookupElement.data('lookup') : null;
			}
		}

	}]);

})(angular);
