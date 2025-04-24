(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'basics.customize';
	const basicsCustomizeModule = angular.module(moduleName);

	basicsCustomizeModule.service('basicsCustomizeInstanceActionService', BasicsCustomizeInstanceActionService);

	BasicsCustomizeInstanceActionService.$inject = ['_', '$injector', '$http', '$translate', 'platformModalService',
		'basicsCustomizeEmailServerConfigurationService', 'basicsCustomizeAllowanceConfigurationService','basicsCustomizeEstimateAllowanceConfigurationService',
		'basicsCustomizeEstimateRoundingConfigurationService', 'basicsCustomizeBoqRoundingConfigurationService', 'basicsCustomizeTimekeepingRoundingConfigurationService',
		'basicsCustomizeMaterialRoundingConfigurationService', 'basicsCustomizeEstimateParameterConfigurationService', 'basicsCustomizeTypeDataService', 'usermanagementMainAdsConfigService'];

	function BasicsCustomizeInstanceActionService(_, $injector, $http, $translate, platformModalService,
		basicsCustomizeEmailServerConfigurationService, basicsCustomizeAllowanceConfigurationService,basicsCustomizeEstimateAllowanceConfigurationService,
		basicsCustomizeEstimateRoundingConfigurationService, basicsCustomizeBoqRoundingConfigurationService, basicsCustomizeTimekeepingRoundingConfigurationService,
		basicsCustomizeMaterialRoundingConfigurationService, basicsCustomizeEstimateParameterConfigurationService, basicsCustomizeTypeDataService, usermanagementMainAdsConfigService) {
		function getActionButton(instanceAction/* , title */) {
			if(instanceAction === 'EMailServerSetting' || instanceAction === 'AllowanceSetting' || instanceAction === 'EstimateParameterSetting'){
				return {
					id: instanceAction,
					formatter: 'action',
					field: 'Id',
					actionList: [],
					name: 'Action',
					name$tr$: 'basics.customize.action',
					width: 20
				};
			}else{
				return {
					id: instanceAction,
					formatter: 'action',
					field: 'Id',
					actionList: [],
					name: 'Check Config',
					name$tr$: 'basics.customize.checkConfig',
					width: 20
				};
			}
		}

		function getCheckITwo5DConfigurationActionInstance(selType) {
			const checkConfigurationUrl = globals.webApiBaseUrl + 'basics/customize/special/checkConfiguration';
			return {
				toolTip: $translate.instant('basics.customize.checkConfig'),
				icon: 'control-icons ico-config-test',
				callbackFn: function (entity) {
					// modalDialog show
					let entityData = {Id: selType.Id, ToSave: [entity]};
					$http.post(checkConfigurationUrl, {
						Instance: entityData,
						InstanceAction: selType.InstanceAction,
						Id: selType.Id
					}).then(function (result) {
						result = result.data;
						let bodyTextKey;
						let headerTextKey;
						let iconClass;
						if (result.Succeeded) {
							headerTextKey = 'basics.customize.ConfigurationCheckSuccessful';
							iconClass = 'ico-info';
							bodyTextKey = result.Info;
						} else {
							headerTextKey = 'basics.customize.ConfigurationCheckError';
							iconClass = 'ico-error'; // error
							bodyTextKey = result.ErrorCode + '\n\r' + result.ErrorMessage;
						}
						platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
						// modalDialog hide
					});
				}
			};
		}

		function getAllowanceSettingActionInstance() {
			return {
				toolTip: 'Edit Estimate Allowance Settings',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: basicsCustomizeAllowanceConfigurationService.editAllowanceConfiguration
			};
		}

		function getEstimateAllowanceSettingActionInstance() {
			return {
				toolTip: 'Edit Estimate Allowance Settings',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: basicsCustomizeEstimateAllowanceConfigurationService.editAllowanceConfiguration
			};
		}

		function getEMailServerSettings(/* selType */){
			return {
				toolTip: 'E-Mail ServerSettings',
				icon: 'tlb-icons ico-settings',
				callbackFn: basicsCustomizeEmailServerConfigurationService.showEmailServerSettingsDialog
			};
		}

		function showCostGroupConfiguration(entity) {
			let serv = $injector.get('basicsCustomizeCostGroupConfigurationService');
			if(entity.Version === 0) {
				return basicsCustomizeTypeDataService.update().then(function () {
					return serv.showDialog(entity);
				});
			} else {
				return serv.showDialog(entity);
			}
		}

		function getCostGroupConfigurationActionInstance() {
			return {
				toolTip: 'Edit Cost Group Configuration',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: showCostGroupConfiguration
			};
		}

		function getBoqRoundingConfigurationActionInstance() {
			return {
				toolTip: 'Edit Rounding Configuration Configuration',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: basicsCustomizeBoqRoundingConfigurationService.showRoundingConfigurationDialog
			};
		}

		function getEstimateRoundingConfigurationActionInstance() {
			return {
				toolTip: 'Edit Rounding Configuration Configuration',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: basicsCustomizeEstimateRoundingConfigurationService.showRoundingConfigurationDialog
			};
		}

		function getTimekeepingRoundingConfigurationActionInstance() {
			return {
				toolTip: 'Edit Rounding Configuration Configuration',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: basicsCustomizeTimekeepingRoundingConfigurationService.showRoundingConfigurationDialog
			};
		}

		function getMaterialRoundingConfigurationActionInstance() {
			return {
				toolTip: 'Edit Rounding Configuration Configuration',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: basicsCustomizeMaterialRoundingConfigurationService.showRoundingConfigurationDialog
			};
		}

		function getEstimateParameterSettingActionInstance() {
			return {
				toolTip: 'Edit Estimate Parameter Configuration',
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: basicsCustomizeEstimateParameterConfigurationService.editEstimateParameterConfiguration
			};
		}

		function getLdapSettingActionInstance() {
			return {
				toolTip: $translate.instant('basics.customize.checkConfig'),
				icon: 'control-icons ico-config-test',
				callbackFn: function(entity) {
					return usermanagementMainAdsConfigService.ldapValidationForParametersList(entity);
				}
			};
		}

		this.getInstanceActionColumn = function getInstanceActionColumn(selfData) {
			let result = null;
			switch (selfData.selType.InstanceAction) {
				case 'AllowanceSetting':
					result = getActionButton(selfData.selType.InstanceAction, 'Allowance Settings');
					result.actionList.push(getAllowanceSettingActionInstance());
					break;
				case'CheckITwo5DConfiguration':
					result = getActionButton(selfData.selType.InstanceAction, 'Check Config');
					result.actionList.push(getCheckITwo5DConfigurationActionInstance(selfData.selType));
					break;
				case 'CostGroupConfiguration':
					result = getActionButton(selfData.selType.InstanceAction, 'Edit Config');
					result.actionList.push(getCostGroupConfigurationActionInstance());
					break;
				case'EMailServerSetting':
					result = getActionButton(selfData.selType.InstanceAction, 'E-Mail Server Settings');
					if(basicsCustomizeEmailServerConfigurationService.hasManagementAccess()){
						result.actionList.push(getEMailServerSettings(selfData.selType));
					}
					break;
				case'BoqRoundingConfiguration':
					result = getActionButton(selfData.selType.InstanceAction, 'Boq Rounding Configuration');
					result.actionList.push(getBoqRoundingConfigurationActionInstance());
					break;
				case'EstimateRoundingConfiguration':
					result = getActionButton(selfData.selType.InstanceAction, 'Estimate Rounding Configuration');
					result.actionList.push(getEstimateRoundingConfigurationActionInstance());
					break;
				case 'EstimateAllowanceSetting':
					result = getActionButton(selfData.selType.InstanceAction, 'Estimate Allowance Settings');
					result.actionList.push(getEstimateAllowanceSettingActionInstance());
					break;
				case'TimekeepingRoundingConfiguration':
					result = getActionButton(selfData.selType.InstanceAction, 'Timekeeping Rounding Configuration');
					result.actionList.push(getTimekeepingRoundingConfigurationActionInstance());
					break;
				case'MaterialRoundingConfiguration':
					result = getActionButton(selfData.selType.InstanceAction, 'Material Rounding Configuration');
					result.actionList.push(getMaterialRoundingConfigurationActionInstance());
					break;
				case'EstimateParameterSetting':
					result = getActionButton(selfData.selType.InstanceAction, 'Estimate Parameter Configuration');
					result.actionList.push(getEstimateParameterSettingActionInstance());
					break;
				case'CheckLdapConfiguration':
					result = getActionButton(selfData.selType.InstanceAction, 'Check Config');
					result.actionList.push(getLdapSettingActionInstance());
					break;

			}

			return result;
		};
	}
})(angular);
