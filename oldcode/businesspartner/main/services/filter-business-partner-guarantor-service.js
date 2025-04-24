/**
 * @ngdoc service
 * @name filterBusinessPartnerGuarantorService
 * @function
 *
 * @description delivery guarantor grid option from businesspartner on filter dialog.
 * @auther pel 24/06 2022
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('filterBusinessPartnerGuarantorService', ['platformGridAPI', 'platformRuntimeDataService','$http','$q',
		function (platformGridAPI, platformRuntimeDataService, $http,$q) {
			var ctOptions = {};
			var ctGridId = '95717603aed74a1da6bf51b510ddca09';
			var readonlyFields = [];

			var service = {
				setCtOptions: setCtOptions,
				setCtGridId: setCtGridId,
				getCtOptions: getCtOptions,
				getCtGridId: getCtGridId,
				showGuarantor: showGuarantor
			};
			return service;

			function setCtOptions(modalOptions) {
				ctOptions = modalOptions;
			}

			function setCtGridId(gridId) {
				ctGridId = gridId;
			}

			function getCtOptions() {
				return ctOptions;
			}

			function getCtGridId() {
				return ctGridId;
			}

			function showGuarantor(bp, certificateTypeId) {
				let deferred = $q.defer();
				if (!platformGridAPI.grids.exist(ctGridId)){
					deferred.resolve(true);
					return deferred.promise;
				}
				var url = globals.webApiBaseUrl + 'businesspartner/main/guarantor/list?mainItemId=' + bp.Id;
				$http.get(url).then(function (response) {
					if(!_.isNil(response) && !_.isNil(response.data)){
						var matchGuarantors = _.filter(response.data, function (guarantor) {
							return guarantor.GuaranteeTypeFk === certificateTypeId;
						});
						platformGridAPI.items.data(ctGridId, matchGuarantors);
						readonlyFields = [];
						getReadonlyFields();
						_.forEach(platformGridAPI.items.data(ctGridId), function (item) {
							platformRuntimeDataService.readonly(item, readonlyFields);
						});
					}
					deferred.resolve(true);
				});
				return deferred.promise;
			}
			function getReadonlyFields() {
				if (_.isEmpty(readonlyFields)) {
					var columns = platformGridAPI.columns.getColumns(ctGridId);
					_.forEach(columns, function (column) {
						readonlyFields.push({field: column.field, readonly: true});
					});
				}
			}
		}
	]);
})(angular);