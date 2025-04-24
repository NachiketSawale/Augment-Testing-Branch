(function () {
	/* global globals, _ */
	'use strict';

	const angularModule = angular.module('timekeeping.recording');

	angularModule.factory('timekeepingRoundingConfigDialogService', ['$http', '$translate', '$q', '$injector', 'platformDialogService', 'platformModalFormConfigService', 'timekeepingRoundingConfigUIConfigurationService', 'timekeepingRoundingConfigDataService',
		function($http, $translate, $q, $injector, platformDialogService, platformModalFormConfigService, timekeepingRoundingConfigUIConfigurationService, timekeepingRoundingConfigDataService) {
			let service = {};

			service.startByRoundingConfig = function(roundingConfig) {
				let dialogConfig;

				let currentItem = timekeepingRoundingConfigDataService.setData(roundingConfig);
				let formConfig = timekeepingRoundingConfigUIConfigurationService.getFormConfig();
				dialogConfig = {
					title: $translate.instant('timekeeping.recording.roundingConfigDialogForm.dialogCustomizeRoundingConfigTitle'),
					dataItem: currentItem,
					formConfiguration: formConfig,
					resizeable: true,
					handleOK: function handleOK() {
						let updateData = {};
						timekeepingRoundingConfigDataService.provideUpdateData(updateData);

						$http.post(globals.webApiBaseUrl + 'timekeeping/recording/roundingconfig/saveconfig', updateData);
					},
					handleCancel: function handleCancel() {
						// Reset state
						timekeepingRoundingConfigDataService.setData({});
					}
				};

				platformModalFormConfigService.showDialog(dialogConfig);
			};

			service.showConfigDialog = function(roundingConfigTypeFk, roundingConfigFk, timesheetContextFk, configTypeEntity) {
				let roundingConfigType = null;
				let roundingConfig = null;
				let deferedRoundingConfig = $q.defer();
				$http.post(globals.webApiBaseUrl + 'basics/customize/timekeepingroundingconfigtype/list').then(function (response) {
					roundingConfigType = _.find(response.data, function(configType) {
						return configType.Id === roundingConfigTypeFk && configType.TimesheetContextFk === timesheetContextFk;
					});

					let typeId = configTypeEntity.Id;
					if(_.isObject(roundingConfigType)) {
						typeId = roundingConfigType.Id;
					}
					$http.get(globals.webApiBaseUrl + 'timekeeping/recording/roundingconfig/gettksroundingconfigbyid?id=' + roundingConfigFk + '&typeId= ' + typeId) .then(function (response) {
						roundingConfig = response.data;
						if (roundingConfig.RoundingConfigType === null){
							roundingConfig.RoundingConfigType = angular.copy(configTypeEntity);
						}
						deferedRoundingConfig.resolve(roundingConfig);
					});
				});

				return deferedRoundingConfig.promise.then(function() {
					service.startByRoundingConfig(roundingConfig);
				});
			};
			return service;
		}
	]);
})();
