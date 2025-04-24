(() => {
	'use strict';

	angular.module('platform').factory('platformE2eUtilService', platformE2eUtilService);

	function platformE2eUtilService() {
		const cssPrefix = ' e2e-';

		function getCSSName(name) {
			const parts = name.split('.');
			if (parts.length > 1) {
				return _.kebabCase(parts.slice(-2).join('.'));
			}
			return _.kebabCase(parts[0]);
		}

		function getCssForTest(config, configKeys) {
			for (const key of configKeys) {
				if (config[key]) {
					return cssPrefix + getCSSName(config[key].toLowerCase());
				}
			}
			return '';
		}

		let service = {
			getCssForTest: getCssForTest
		};
		return service;
	}

})();