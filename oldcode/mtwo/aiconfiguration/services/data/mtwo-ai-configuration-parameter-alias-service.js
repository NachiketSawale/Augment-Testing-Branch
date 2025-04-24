/**
 * @author: chd
 * @date: 5/26/2021 1:30 PM
 * @description:
 */
/**
 * @author: chd
 * @date: 3/24/2021 10:06 AM
 * @description:
 */
(function (angular) {
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).factory('mtwoAiConfigurationParameterAliasService', ['_', '$q',
		function (_, $q) {
			let parameterAlias = {};

			function attachData(data) {
				parameterAlias = data;
			}

			function getParameterAlias() {
				return parameterAlias;
			}

			function getItemById(value) {
				return _.find(parameterAlias, {Alias: value});
			}

			function getItemByIdAsync(value) {
				let deferred = $q.defer();
				deferred.resolve(getItemById(value));
				return deferred.promise;
			}

			return {
				attachData: attachData,
				getParameterAlias: getParameterAlias,
				getItemById: getItemById,
				getItemByIdAsync: getItemByIdAsync,
				getList: function () {
					let defer = $q.defer();
					defer.resolve(getParameterAlias());
					return defer.promise;
				},
				getItemByKey: function (value) {
					let item = _.find(getParameterAlias(), {Alias: value});
					let deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				},
			};
		}
	]);

})(angular);
