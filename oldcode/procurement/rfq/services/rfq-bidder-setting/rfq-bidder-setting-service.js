/**
 * Created by chi on 2/20/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqBidderSettingService', procurementRfqBidderSettingService);

	procurementRfqBidderSettingService.$inject = ['$http', 'globals', '_', 'platformDataServiceFactory', 'platformRuntimeDataService'];

	function procurementRfqBidderSettingService($http, globals, _, platformDataServiceFactory, platformRuntimeDataService) {
		var serviceOptions = {
			module: angular.module(moduleName), serviceName: 'procurementRfqBidderSettingService', presenter: {
				list: {}
			}, dataProcessor: [/*{ //TODO: maybe doable but would take too much time for now
				processItem: function (settings) {
					let additionalEmailForBCC = settings?.AdditionalEmailForBCC;
					let clerkMail = 'test';
					if (_.isString(additionalEmailForBCC)) {
						additionalEmailForBCC = clerkMail + ';' + additionalEmailForBCC;
					} else {
						additionalEmailForBCC = clerkMail + ';';
					}
				}
			}*/
				{
					processItem: function (wizardSettings) {
						if (!wizardSettings.SafeLinkLifetime) {
							wizardSettings.SafeLinkLifetime = 168; // default lifetime of one week
						}
						validateSettings(wizardSettings);
					}
				}], entitySelection: {}, modification: {multi: {}}, actions: {
				create: false, delete: false
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		let rules = {
			DisableDataFormatExport: {
				ToDisable: ['DisableZipping', 'LinkAndAttachment', 'GenerateSafeLink', 'FileNameFromDescription', 'UseAccessTokenForSafeLink']
			}, DisableZipping: {
				ToDisable: ['GenerateSafeLink', 'LinkAndAttachment']
			}, LinkAndAttachment: {
				ToDisable: ['DisableZipping'], ToEnable: ['GenerateSafeLink']
			}, GenerateSafeLink: {
				ToDisable: ['DisableZipping'], SetReadonlyWhenFalse: ['SafeLinkLifetime']
			}, UseAccessTokenForSafeLink: {
				ToEnable: ['GenerateSafeLink']
			}

		}
		data.markItemAsModified = angular.noop;
		service.markItemAsModified = angular.noop;
		service.update = update;
		service.getItemName = getItemName;
		return service;

		// ///////////////////////////

		function update(entity) {
			if (!entity) {
				return;
			}

			validateSettings(entity);
			return $http.post(globals.webApiBaseUrl + 'procurement/rfq/rfqbiddersetting/update', entity).then(function () {
				return true;
			});
		}

		function validateSettings(wizardSettings) {
			if (wizardSettings.__rt$data && wizardSettings.__rt$data.useCaseAllowReadonly === true) {
				_.forEach(Object.keys(wizardSettings), function (key) {
					platformRuntimeDataService.readonly(wizardSettings, [{
						field: key, readonly: false
					}]);
				});
			}
			_.forEach(_.filter(Object.keys(wizardSettings), (key) => wizardSettings[key]), function (field) {
				processRule(wizardSettings, field);
			});

			// currently not used but here for when it's needed
			/*_.forEach(_.filter(Object.keys(wizardSettings), (key) => wizardSettings[key] && rules[key]?.SetReadonlyWhenTrue), function (field) {
				_.forEach(rules[field].SetReadonlyWhenTrue, function (fieldToReadonly) {
					setFieldReadonly(wizardSettings, fieldToReadonly);
				});
			});*/

			_.forEach(_.filter(Object.keys(wizardSettings), (key) => !wizardSettings[key] && rules[key]?.SetReadonlyWhenFalse), function (field) {
				_.forEach(rules[field].SetReadonlyWhenFalse, function (fieldToReadonly) {
					setFieldReadonly(wizardSettings, fieldToReadonly);
				});
			});
		}

		function processRule(wizardSettings, changedSettingKey) {
			let rule = rules[changedSettingKey];
			if (rule) {
				disableFields(wizardSettings, rule.ToDisable);
				enableFields(wizardSettings, rule.ToEnable, rules);
			}
		}

		function disableFields(wizardSettings, fields) {
			_.forEach(fields, function (field) {
				if (field in wizardSettings) {
					wizardSettings[field] = false;
					setFieldReadonly(wizardSettings, field);
				}
			});
		}

		function enableFields(wizardSettings, fields, rules) {
			_.forEach(fields, function (field) {
				if (field in wizardSettings) {
					wizardSettings[field] = true;
					setFieldReadonly(wizardSettings, field);
					let rule = rules[field];
					disableFields(wizardSettings, rule.ToDisable);
					enableFields(wizardSettings, rule.ToEnable);
				}
			});
		}

		function setFieldReadonly(wizardSettings, field) {
			platformRuntimeDataService.readonly(wizardSettings, [{
				field: field, readonly: true
			}]);
			wizardSettings.__rt$data.useCaseAllowReadonly = true;
		}

		function getItemName() {
			return 'RfqBidderSetting';
		}
	}

})(angular);