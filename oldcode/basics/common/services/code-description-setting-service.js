/**
 * Created by baf on 2016/12/01
 */
(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	/* @name platform.basicsCommonCodeDescriptionSettingsService
	 * @function
	 * @description Service for getting settings regarding code and description max length settings of different entities
	 */
	angular.module(moduleName).service('basicsCommonCodeDescriptionSettingsService', BasicsCommonCodeDescriptionSettingsService);

	BasicsCommonCodeDescriptionSettingsService.$inject = ['$http', '$q', '_', 'globals'];

	function BasicsCommonCodeDescriptionSettingsService($http, $q, _, globals) {
		const data = {};

		function entityToKey(entity) {
			return entity.typeName + '_' + entity.modul;
		}

		function takeOverSet(set) {
			const key = entityToKey(set);
			data[key] = set;
		}

		this.loadSettings = function loadSettings(entities) {
			return $http.post(globals.webApiBaseUrl + 'basics/common/codedesc/settings', entities).then(function (response) {
				_.forEach(response.data, function (set) {
					takeOverSet(set);
				});

				return true;
			});
		};

		this.getSettings = function getSettings(entities) {
			var res = [];

			_.forEach(entities, function (entity) {
				var key = entityToKey(entity);
				var set = data[key];
				if (!_.isNull(set) && !_.isUndefined(set)) {
					res.push(set);
				}

				return res;
			});

			return res;
		};
	}
})(angular);