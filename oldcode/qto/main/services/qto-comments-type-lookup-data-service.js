(function () {
	'use strict';
	/* global globals */
	let moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoDetailCommentTypeLookupDataService',
		['$q','$http','_',
			function ($q,$http,_) {

				let service = {};
				let commentTypeList = [];

				let commentTypePromise = null;

				service.getItemById = function(item){
					return _.find(commentTypeList, {Id : item});
				};

				service.getItemByIdAsync = function(value){
					if (!commentTypePromise) {
						commentTypePromise = getcommentType(value);
					}
					return commentTypePromise.then(function (data) {
						commentTypePromise = null;
						commentTypeList = data;
						return  service.getItemById(value);
					});
				};

				function getcommentType(){
					let options = {
						lookupModuleQualifier: 'basics.customize.qtocommenttype',
						displayProperty: 'Description',
						valueProperty: 'Id',
						CustomIntegerProperty: null
					};

					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'qto/detail/comments/qtoCommentTypeOfRole', options).then(
						function (response) {
							commentTypeList = response.data;
							deferred.resolve(response.data);
						});
					return deferred.promise;
				}


				service.getcommentTypeList = function() {
					return getcommentType();
				};

				return service;
			}]);
})();
