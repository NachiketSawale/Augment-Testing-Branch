/**
 * @author: chd
 * @date: 4/8/2021 10:14 AM
 * @description:
 */

(function (angular) {
	'use strict';

	angular.module('mtwo.aiconfiguration').factory('mtwoAIConfigurationAliasLookupLookupService', ['_', '$q', 'mtwoAIConfigurationModelTypeLookUpItems',
		function (_, $q, lookUpItems) {
			return {
				getList: function () {
					let deferred = $q.defer();
					deferred.resolve(lookUpItems.modelType);
					return deferred.promise;
				},

				getItemByKey: function (value) {
					let item = _.find(lookUpItems.modelType, {Id: value});
					let deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				},

				getItemById: function (value) {
					return _.find(lookUpItems.modelType, {Id: value});
				},

				getItemByIdAsync: function (value) {
					let item = _.find(lookUpItems.modelType, {Id: value});
					let deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);
