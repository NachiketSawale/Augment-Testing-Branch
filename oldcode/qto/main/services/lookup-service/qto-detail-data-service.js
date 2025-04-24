/**
 * Created by wui on 6/23/2015.
 */

(function(angular){
	'use strict';

	angular.module('qto.main').factory('qtoMainQtoDetailDataService', ['$q',
		function( $q) {
			let service = {};

			let qtoMainDetailService = {};

			service.setQtoDetailService = function (value){
				qtoMainDetailService = value;
			};

			service.getList = function getList() {
				let defer = $q.defer ();
				defer.resolve (qtoMainDetailService.getList());
				return defer.promise;
			};

			service.getDefault = function getDefault() {
				let defer = $q.defer ();
				defer.resolve ({Id: 1});
				return defer.promise;
			};

			service.getItemByKey = function getItemByKey(value) {
				let defer = $q.defer ();
				let list = service.getList();
				for (let i = 0; i < list.length; i++) {
					if (list[i].Id === value) {
						defer.resolve (list[i]);
						break;
					}
				}
				return defer.promise;
			};

			service.getSearchList = function () {
				return service.getList();
			};
			return service;
		}
	]);

})(angular);