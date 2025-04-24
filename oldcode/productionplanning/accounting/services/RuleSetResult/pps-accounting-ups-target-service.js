(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).service('ppsAccountingResultUpstreamTargetDataService',
		['_', '$q', '$http', function upsTargetDataService(_, $q, $http){
			let upstreamItemTarget = [];
			this.getUpstreamItemTarget$ = function  getUpstreamItemTarget (){
				return $http.get(globals.webApiBaseUrl + 'productionplanning/accounting/ruleset/getupstreamitemtarget').then(function (result){
					upstreamItemTarget = result.data;
					return upstreamItemTarget;
				});
			};

			this.getUpstreamItemTarget = () => $q.when(upstreamItemTarget);

			this.getItemByKey = (value) => $q.when(_.find(upstreamItemTarget, {Id: value}));

			this.getItemById = (value) => _.find(upstreamItemTarget, {Id: value});

			this.getItemByIdAsync = function (value) {
				return $q.when(_.find(upstreamItemTarget, {Id: value}));
			};
		}]);
})(angular);