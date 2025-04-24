/**
 * Created by ltn on 8/11/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.contract').factory('procurementContractInsertMaterialService', ['$http', function ($http) {
		var insertMaterial = function insertMaterial(prcHeaderFK, materialcatalogfk,
			materialgroupfk, materialdiscountgroupfk) {
			return $http.post(
				globals.webApiBaseUrl + 'procurement/contract/wizard/insertMaterial',
				{
					PrcHeaderFK: prcHeaderFK,
					materialcatalogfk: materialcatalogfk,
					materialgroupfk: materialgroupfk,
					materialdiscountgroupfk: materialdiscountgroupfk
				}
			);
		};

		return {
			insertMaterial: insertMaterial
		};
	}]);
})(angular);