/**
 * Created by jes on 8/1/2016.
 */

(function (angular) {
	'use strict';

	/* global globals */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainScriptDataService', constructionSystemMainScriptDataService);

	constructionSystemMainScriptDataService.$inject = [
		'$http',
		'constructionSystemMainInstanceService',
		'constructionsystemMasterScriptEvalService'
	];

	function constructionSystemMainScriptDataService(
		$http,
		constructionSystemMainInstanceService,
		constructionsystemMasterScriptEvalService) {

		var service = {};

		var currentScript = {
			cosHeaderId: -1,
			validationScriptData: ''
		};

		var load = function () {
			var mainItem = constructionSystemMainInstanceService.getSelected();
			if (mainItem) {
				var cosHeaderId = mainItem.HeaderFk;
				if (cosHeaderId !== currentScript.cosHeaderId) {
					return $http.post(globals.webApiBaseUrl + 'constructionsystem/master/script/listorcreate', {
						mainItemId: cosHeaderId
					}).then(function (response) {
						var item = response.data;
						if (item) {
							currentScript.cosHeaderId = item.CosHeaderFk ? item.CosHeaderFk : -1;
							currentScript.validationScriptData = item.ValidateScriptData ? item.ValidateScriptData : '';
						}
					});
				}
			}
		};

		service.getCurrentScript = function () {
			return currentScript;
		};
		service.validate = constructionsystemMasterScriptEvalService.validate;

		constructionSystemMainInstanceService.registerSelectionChanged(load);

		load();

		return service;
	}

})(angular);