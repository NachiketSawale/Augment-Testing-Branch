(function (angular) {

	'use strict';

	/**
	 * @ngdoc filter
	 * @name platformLocalizedErrormessage
	 * @description translates error keys
	 **/
	angular.module('platform').filter('platformLocalizedErrormessage', ['$translate', function ($translate) {

		return function (errorKeys) {

			var prefix = 'cloud.common';

			var msg = '';
			if (errorKeys) {

				var isAssociativeArray = function (errorKeys) {
					return errorKeys[0].length !== 1;
				};

				var appendMsg = function (errorKey) {
					var tr = $translate.instant(prefix + '.' + errorKey, null, null);
					msg += tr;
				};

				if (angular.isString(errorKeys) || isAssociativeArray(errorKeys)) {

					var key;
					if (isAssociativeArray(errorKeys)) {
						key = errorKeys[0];
					} else {
						key = errorKeys;
					}
					appendMsg(key);
				} else {
					// todo support passing error list
					//for (var property in errorKeys) {
					//   msg += property + ": ";
					//   for (var errorKey in errorKeys[property]) {
					//      appendMsg(errorKeys[property][errorKey]);
					//      msg += "\n";
					//   }
					//}
					msg = 'multiple errors !';
				}
			}
			return msg;
		};
	}]);

})(angular);
