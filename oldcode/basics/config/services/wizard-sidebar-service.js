/**
 * Created by sandu on 25.02.2016.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	angular.module(moduleName).factory('basicsConfigWizardSidebarService', basicsConfigWizardSidebarService);

	basicsConfigWizardSidebarService.$inject = ['$rootScope', '$http', '$q', '$templateCache', '$log', '_', 'globals', 'cloudDesktopSidebarService', 'platformUserInfoService', '$injector'];

	function basicsConfigWizardSidebarService($rootScope, $http, $q, $templateCache, $log, _, globals, cloudDesktopSidebarService, platformUserInfoService, $injector) {
		const state = {
			groups: [],
			module: null,
			wizardComplete: {}
		};
		const wizardMap = new Map();

		return {
			WizardData: WizardData,
			registerModule: registerModule,
			unregisterModule: unregisterModule,
			loadWizards: loadWizards,
			registerWizard: registerWizard,
			getWizardSetupDataMap: getWizardSetupDataMap,
			loadWizardsComplete: loadWizardsComplete,
			loadGenWizConfigs: loadGenWizConfigs,
			invoke: invoke,
			disableWizards: disableWizards,
			data: state,
			invokeModuleWizardRegister:invokeModuleWizardRegister
		};

		/**
		 * @function WizardData
		 * @param serviceName
		 * @param wizardGuid
		 * @param methodName
		 * @param canActivate
		 * @param isHidden
		 * @param userParam
		 * @param functionalPermissionUuid {string|null|undefined} descriptor uuid to be used instead of wizard guid to check functional restrictions
		 * @returns {WizardData}
		 * @constructor
		 */
		function WizardData(serviceName, wizardGuid, methodName, canActivate, isHidden, userParam, functionalPermissionUuid) {
			this.serviceName = serviceName;
			this.wizardGuid = wizardGuid;
			this.methodName = methodName;
			this.canActivate = canActivate || true;
			this.isHidden = isHidden || false;
			this.userParam = userParam;
			this.functionalPermissionUuid = functionalPermissionUuid || wizardGuid.toLowerCase();

			return this;
		}


		/**
		 * @function invokeModuleWizardRegister
		 * @param internalModuleName
		 */
		function invokeModuleWizardRegister(internalModuleName) {
			let mainViewService = $injector.get('mainViewService');
			return mainViewService.registerWizards(internalModuleName);
		}

		function mapWizards(wizardSetupData) {
			_.each(wizardSetupData, function (wizard) {
				wizardMap.set(wizard.wizardGuid, wizard);
			});
		}

		function setCssClass(wizards) {
			if(wizards.length > 0) {
				angular.forEach(wizards, function(wizard) {
					wizard.cssClass = 'e2e_wizard_item_' + wizard.w2GId;
				});
			}
		}

		function loadWizards() {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/sidebar/load',
				params: { module: state.module.name }
			}).then(function (response) {
				if ((!!cloudDesktopSidebarService.isInNewModule) && (cloudDesktopSidebarService.isInNewModule() === true) &&
					(cloudDesktopSidebarService.patternHasBeenResetted() === false) && (!!cloudDesktopSidebarService.filterResetPattern)) {
					cloudDesktopSidebarService.setPatternHasBeenResettedFlag(true);
				}

				state.groups = response.data;
				_.each(state.groups, function (group) {
					group.iconClass = function () {
						return group.visible ? 'ico-up' : 'ico-down';
					};
					group.count = group.wizards.length;
					setCssClass(group.wizards);
				});

				return response.data;
			});
		}

		function loadGenWizConfigs(ids) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/config/genwizard/instance/getGenWizConfigByIds',
				data: ids
			}).then(function (response) {
				extendSetupData(response.data);
				return response.data;
			});
		}

		function loadWizardsComplete() {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/wizard/listWizardsCompleteV',
				params: { module: state.module.name }
			}).then(function (response) {
				state.wizardComplete = response.data;
				return response;
			}, function (error) {
				$log.error(error);
			});
		}

		function extendSetupData(genWizConfigList) {
			var mock = {
				serviceName: 'genericWizardService',
				wizardGuid: '28F33103E8C748D48CDE47FE58C6FF70',
				methodName: 'openWizard'
			};
			_.each(genWizConfigList, function (genWiz) {
				var config = _.clone(mock);
				config.wizardGuid = _.uniqueId();
				config.genWizConfig = genWiz;
				wizardMap.set(genWiz.Instance.Wizard2GroupFk, config);
			});
		}

		function loadTemplate() {
			if ($templateCache.get('basics.config/wizard-item.html')) {
				return $q.when(0);
			} else {
				return $templateCache.loadTemplateFile('basics.config/templates/wizard-sidebar-templates.html');
			}
		}

		function loadUserInfo() {
			return platformUserInfoService.getUserInfoPromise(true).then(function (userInfo) {
				state.userInfo = userInfo;
				return userInfo;
			});
		}

		function registerModule(module) {
			state.module = _.isString(module) ? angular.module(module) : module;

			$q.all([loadWizards(state.module.name), loadTemplate(), loadUserInfo()])
				.then(function () {
					if (state.groups.length) {
						var sidebar = {
							name: cloudDesktopSidebarService.getSidebarIds().newWizards,
							type: 'template',
							templateUrl: 'basics.config/templates/wizard-sidebar.html'
						};
						cloudDesktopSidebarService.registerSidebarContainer(sidebar, true);

					}
				});
			return true;
		}

		function registerWizard(wizardList) {
			if (_.isArray(wizardList) && !_.isEmpty(wizardList)) {
				mapWizards(wizardList);
			} else {
				throw('Parameter for the Wizard registration has to be an array !');
			}
		}

		function disableWizards(disable) {
			$rootScope.$emit('wizard-sidebar:disable-wizards', disable);
		}

		function getWizardSetupDataMap() {
			return wizardMap;
		}

		/**
		 * Execute wizard with the setupData entered in the module resolver and the parameter
		 * from the database
		 * @param setupData
		 * @param param
		 */
		function invoke(setupData, param) {
			return $injector.invoke([setupData.serviceName, function (service) {
				return service[setupData.methodName](param, setupData.userParam, setupData.descriptionInfo);
			}]);
		}

		function unregisterModule() {
			// cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().wizards, true);
			cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().newWizards, true);
		}
	}
})();
