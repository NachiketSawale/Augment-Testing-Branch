(function (angular) {
	'use strict';
	/* global _,globals */
	const moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name constructionsystemMainCommonLookupService
	 * @function
	 *
	 * @description
	 * constructionsystemMainCommonLookupService is the common functions for script result constructionsystem line item and resource related functionality.
	 */
	angular.module(moduleName).factory('constructionsystemMainCommonLookupService',
		['$q', '$http', '$injector',
			function ($q, $http, $injector) {

				var service = {};

				// eslint-disable-next-line no-unused-vars
				var selectedLookupItem = null;
				service.sysOpts = null;
				service.setSysOpts = function(opts){

					service.sysOpts = opts;
				};

				var considerDisabledDirect = null;

				service.resetLookupItem = function resetLookupItem(){
					selectedLookupItem = {};
				};
				// change config to make all read only
				service.modifyStandardConfigForListView = function modifyStandardConfigForListView(listConfig, systemOption) {

					if (systemOption === false) {

						// set all grid columns readonly
						_.each(listConfig.columns, function (col) {
							if (col.editor) {
								col.editor = null;
								if (col.editorOptions) {
									col.editorOptions = null;
								}
							}
						});
					}

					return {
						getStandardConfigForListView: function () {
							return listConfig;
						}
					};
				};

				service.modifyStandardConfigForInstanceView = function modifyStandardConfigForListView(listConfig, systemOption) {

					// set all grid columns readonly
					_.each(listConfig.columns, function (col) {
						if (col) {
							if (systemOption === false) {
								_.remove(listConfig.columns, {id: 'isusermodified'});
							}
						}

					});


					return {
						getStandardConfigForListView: function () {
							return listConfig;
						}
					};
				};



				service.getListForCos = function getListForCos(instanceHeaderId,instanceId){

					var payload = {
						InsHeaderId: instanceHeaderId,
						InstanceId: instanceId
					};

					return $http.post(globals.webApiBaseUrl + 'constructionsystem/main/lineitem/list',payload).then(function(response){
						return response.data;
					});

				};

				service.getConsiderDisabledDirect = function getConsiderDisabledDirect(){
					if(considerDisabledDirect === null){
						considerDisabledDirect = false;
						_.filter(service.sysOpts, function (systemOption) {
							if (systemOption.Id === 10073) {
								considerDisabledDirect = systemOption.ParameterValue.toLowerCase() === 'true' || systemOption.ParameterValue === '1';
							}
						});
					}
					return considerDisabledDirect;
				};






















				return service;
			}]);
})(angular);