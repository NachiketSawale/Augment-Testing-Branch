/**
 * Created by wui on 6/23/2015.
 */

(function (angular) {
	'use strict';

	angular.module('businesspartner.evaluationschema').factory('businesspartnerEvaluationSchemaIconDataService', ['$q', 'basicsLookupdataLookupDescriptorService',
		function ($q, basicsLookupdataLookupDescriptorService) {

			let iconDatas = initIcons();

			basicsLookupdataLookupDescriptorService.updateData('businessPartnerEvaluationSchemaIcon', iconDatas);

			return {
				getListAsync: function () {
					return iconDatas;
				},
				getList: function () {
					let deferred = $q.defer();
					deferred.resolve(iconDatas);
					return deferred.promise;
				},
				getDefault: function () {
					let deferred = $q.defer();
					deferred.resolve(iconDatas[0]);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					let deferred = $q.defer();
					deferred.resolve(iconDatas[value - 1]);
					return deferred.promise;
				},
				getSearchList: function () {
					let deferred = $q.defer();
					deferred.resolve(iconDatas);
					return deferred.promise;
				}
			};
		}
	]);

	function initIcons() {
		let data = [];
		for (let outerIndex = 1; outerIndex <= 6; outerIndex++) {
			for (let interIndex = 0; interIndex <= 2; interIndex++) {
				data.push({
					Id: data.length + 1,
					Name: 'indicator' + outerIndex + '-' + interIndex,
					Description: ' '
				});
			}
		}
		// eslint-disable-next-line no-redeclare
		for (let outerIndex = 7; outerIndex <= 12; outerIndex++) {
			// eslint-disable-next-line no-redeclare
			for (let interIndex = 0; interIndex <= 5; interIndex++) {
				data.push({
					Id: data.length + 1,
					Name: 'indicator' + outerIndex + '-' + interIndex,
					Description: ' '
				});
			}
		}

		return data;
	}

})(angular);