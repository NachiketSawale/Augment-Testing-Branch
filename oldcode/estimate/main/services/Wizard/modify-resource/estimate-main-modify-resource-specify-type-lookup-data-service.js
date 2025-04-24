/**
 * Created by bel on 03/11/2017.
 */
(function () {
	'use strict';
	let modulename = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainModifyResourceSpecifyTypeService
	 * @description
	 * estimateMainModifyResourceSpecifyTypeService is the data service for estimate modify resource specify resource type list.
	 */
	angular.module(modulename).factory('estimateMainModifyResourceSpecifyTypeService', ['$q', '$http', '$translate',
		function ($q, $http, $translate) {

			let data = [
				{Id: 1, Description: $translate.instant('basics.costcodes.costCodes')},
				{Id: 2, Description: $translate.instant('basics.material.record.material')},
				{Id: 4, Description: $translate.instant('estimate.assemblies.assembly')}
			];
			let service = {};

			service.getList = function getList() {
				let defer = $q.defer();
				defer.resolve(data);

				return defer.promise;
			};

			return service;
		}
	]);
})();
