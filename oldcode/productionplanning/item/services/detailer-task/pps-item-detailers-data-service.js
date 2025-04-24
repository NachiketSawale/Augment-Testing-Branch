/**
 * Created by lav on 9/24/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemDetailersDataService', EventConfigDataService);

	EventConfigDataService.$inject = ['platformDataServiceFactory',
		'platformDataServiceEntityReadonlyProcessor',
		'$injector',
		'ppsItemDetailersFilterService',
		'productionplanningItemDataService',
		'$http',
		'platformModalService'];

	function EventConfigDataService(platformDataServiceFactory,
									platformDataServiceEntityReadonlyProcessor,
									$injector,
									ppsItemDetailersFilterService,
									productionplanningItemDataService,
									$http,
									platformModalService) {
		var serviceOptions = {
			flatRootItem: {
				module: moduleName + '.detailers',
				serviceName: 'ppsItemDetailersDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/item/clerk/',
					endRead: 'detailers'
				},
				entityRole: {
					root: {
						rootForModule: moduleName + '.detailer' //no real module!
					}
				},
				actions: {},
				dataProcessor: [platformDataServiceEntityReadonlyProcessor]
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = container.service;
		container.data.showHeaderAfterSelectionChanged = null;
		service.getSelectedFilter = function (filter) {
			return ppsItemDetailersFilterService.entity[filter];
		};

		service.setSelectedFilter = function () {
			_.forEach(service.getChildServices(), function (service) {
				service.load();
			});
		};

		service.canAssign = function () {
			return getResult();
		};

		function doAssign(request, result) {
			$http.post(globals.webApiBaseUrl + 'productionplanning/item/clerk/assigndetailer', request).then(function (response) {
				if (response) {
					if (!response.data) {
						var modalOptions = {
							headerTextKey: moduleName + '.assignDetailerWarningTitle',
							bodyTextKey: moduleName + '.assignDetailerWarningBody',
							showOkButton: true,
							iconClass: 'ico-warning'
						};
						return platformModalService.showDialog(modalOptions);
					} else {
						_.forEach(result, function (assign) {
							productionplanningItemDataService.syncDynamicColumns(assign.PpsItemFk);
						});
						var selected = service.getSelected();
						service.deselect().then(function () {
							service.setSelected(selected);
						});
					}
				}
			});
		}

		function getLogConfig(result){
			return $injector.get('ppsCommonLoggingHelper').isLogEnableOnPropertyWithValidEntityType(
				{moduleSubModule: 'ProductionPlanning.Engineering', typeName: 'EngTask2ClerkDto'},
				'ClerkFk',
				result[0].ClerkRoleFk
			);
		}

		service.assign = function () {
			var result = getResult();
			if (!result || result.length < 1) {
				return;
			}
			let logCfg = getLogConfig(result);
			let isLogEnable = (_.isNil(logCfg))? false: !!logCfg.logEnable;
			let requestObj = {
				Detailers: result,
				IsLogEnable: isLogEnable
			};

			if (isLogEnable === true) {
				const schemaOption = {moduleSubModule: 'ProductionPlanning.Engineering', typeName: 'EngTask2ClerkDto'};
				const translationSrv = $injector.get('productionplanningCommonTranslationService');
				const entity = {
					ClerkFk: result[0].ClerkFk,
					ClerkRoleFk: result[0].ClerkRoleFk,
					ModificationInfo: {
						ModifiedProperties: [{
							LogReasonDescription: logCfg.logReasonDescription,
							LogReasonGroupId: logCfg.logReasonGroupId,
							LogRequired: logCfg.logConfigType === 0 || logCfg.LogConfigType === 0, // 0 maps required
							NewValue: result[0].ClerkFk,
							PropName: 'ClerkFk'
						}]
					}
				};
				if(logCfg.logConfigType === 2 || logCfg.LogConfigType === 2){ // 2 maps "silent"
					doAssign(requestObj, result);
				}
				else if(logCfg.logConfigType === 1 || logCfg.LogConfigType === 1){ // 1 maps "optional"
					$injector.get('ppsCommonLoggingValidationExtension').showLoggingDialog(entity, schemaOption, translationSrv, false).then(response => {
						requestObj.UpdateReason = response.value.ClerkFk.UpdateReason;
						requestObj.UpdateRemark = response.value.ClerkFk.UpdateRemark;
					}).finally(() => {
						doAssign(requestObj, result);
					});
				}
				else { // the rest case is 0, that maps "required". And if user click the cancel-button on LoggingDialog, we will cancel assigning.
					$injector.get('ppsCommonLoggingValidationExtension').showLoggingDialog(entity, schemaOption, translationSrv, false).then(response => {
						requestObj.UpdateReason = response.value.ClerkFk.UpdateReason;
						requestObj.UpdateRemark = response.value.ClerkFk.UpdateRemark;
						doAssign(requestObj, result);
					});
				}

			} else {
				doAssign(requestObj, result);
			}

		};

		service.refresh();//refresh first

		return service;

		function getResult() {
			var result;
			var selectedClerk = service.getSelected();
			if (!selectedClerk) {
				return result;
			}
			var roleId = ppsItemDetailersFilterService.entity.roleId;
			if (!roleId) {
				return result;
			}
			var selectedPpsItems = productionplanningItemDataService.getSelectedEntities();
			return _.map(selectedPpsItems, function (selected) {
				return {
					ClerkFk: selectedClerk.Id,
					ClerkRoleFk: roleId,
					PpsItemFk: selected.Id
				};
			});
		}
	}

})(angular);
