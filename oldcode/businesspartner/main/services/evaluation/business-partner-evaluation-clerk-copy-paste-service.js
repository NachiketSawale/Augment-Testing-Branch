/**
 * Created by chi on 5/21/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainEvaluationClerkCopyPasteService', businessPartnerMainEvaluationClerkCopyPasteService);

	businessPartnerMainEvaluationClerkCopyPasteService.$inject = [];

	function businessPartnerMainEvaluationClerkCopyPasteService() {
		var service = {};
		var localCopyCache = [];
		service.initialize = initialize;
		service.clearCache = clearCache;
		return service;

		// ////////////////////////////

		function initialize(dataService, options) {
			options = options || {};
			dataService.copy = copy;
			dataService.paste = paste(options.paste);
			dataService.canCopy = angular.isFunction(options.canCopy) ? options.canCopy : canCopy;
			dataService.canPaste = canPaste;
		}

		function copy(toCopied) {
			clearCache();
			if (!toCopied) {
				return;
			}
			if (angular.isArray(toCopied)) {
				localCopyCache = angular.copy(toCopied);
			} else if (angular.isObject(toCopied)) {
				localCopyCache = [toCopied];
			}
		}

		function paste(callback) {
			return function () {
				if (angular.isFunction(callback)) {
					callback(localCopyCache);
				}
			};
		}

		function canCopy() {
		}

		function canPaste() {
			return localCopyCache.length > 0;
		}

		function clearCache() {
			localCopyCache = [];
		}
	}
})(angular);