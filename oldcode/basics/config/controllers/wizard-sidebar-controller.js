/**
 * Created by sandu on 29.02.2016.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name BasicsConfigWizardSidebarController
	 * @function
	 * executes assigned wizards with/ without parameters
	 * invoke takes service and methodname from the wizard setup data
	 * and the parameters assigned in the ui
	 * @description
	 * Controller for the  Sidebar, contains the wizard execution
	 * and data load on Sidebar open.
	 **/
	const moduleName = 'basics.config';
	angular.module(moduleName).controller('basicsConfigWizardSidebarController', BasicsConfigWizardSidebarController);

	BasicsConfigWizardSidebarController.$inject = ['$scope', '$rootScope', '$timeout', '$templateCache', '$log', '$q', '_', 'basicsConfigWizardSidebarService', '$injector', 'platformPermissionService', 'permissions'];

	function BasicsConfigWizardSidebarController($scope, $rootScope, $timeout, $templateCache, $log, $q, _, basicsConfigWizardSidebarService, $injector, platformPermissionService, permissions) {
		const ctrl = this;
		let wizardsComplete;
		let wizardSetupDataMap;

		ctrl.data = [];
		ctrl.itemTemplate = $templateCache.get('basics.config/sidebar-item.html');
		ctrl.groupTemplate = $templateCache.get('basics.config/sidebar-group.html');
		ctrl.wizard = null;
		ctrl.executeWizard = executeWizard;
		$scope.isHidden = false;
		ctrl.index = 0;
		ctrl.hide = false;

		function executeWizard(w2GId) {
			// ui assigned wizards with parameters
			var wizardGroups = ctrl.data;
			var wizardData = _.filter(wizardsComplete, function (wizard) {
				return wizard.Id === w2GId && wizard.Type === 'I';
			});
			var setupData;
			if (!_.isEmpty(wizardData)) {
				setupData = wizardSetupDataMap.get(wizardData[0].WizardGuid);
				// selected wizard from wizardGroups to extend setupData with translated wizard name and description
				_.each(wizardGroups, function (group) {
					_.find(group.wizards, function (wizard) {
						if (wizard.w2GId === w2GId) {
							if (setupData && wizard.name) {
								setupData.descriptionInfo = {name: wizard.name};
								if (wizard.description) {
									setupData.descriptionInfo.description = wizard.description;
								}
							}
						}
					});
				});

				// genwiz cannot be handled by WizardGuid because every instance has the same Guid
				if (!setupData) {
					setupData = wizardSetupDataMap.get(wizardData[0].Id);
				}
				// wizards without parameter
			} else {
				_.each(wizardGroups, function (group) {
					_.find(group.wizards, function (wizard) {
						if (wizard.w2GId === w2GId) {
							setupData = wizardSetupDataMap.get(wizard.wizardGuid);
							if (setupData && wizard.name) {
								setupData.descriptionInfo = {name: wizard.name};
								if (wizard.description) {
									setupData.descriptionInfo.description = wizard.description;
								}
							}
						}
					});
				});
			}

			var param = {};
			if (wizardData) {
				_.each(wizardData, function (wData) {
					param[wData.Name] = wData.Value;
				});
			}

			if (setupData && (setupData.canActivate === true || (angular.isFunction(setupData.canActivate) && setupData.canActivate(setupData)))) {
				basicsConfigWizardSidebarService.invoke(setupData, param);
			}
			// genwizard
			else if (setupData && setupData.genWizConfig) {
				var genWizSetupData = basicsConfigWizardSidebarService.getWizardSetupDataMap().get(setupData.genWizConfig.Instance.Wizard2GroupFk);
				$injector
					.get(genWizSetupData.serviceName)
					.canActivate(genWizSetupData)
					.then(function then(result) {
						if (result) {
							basicsConfigWizardSidebarService.invoke(genWizSetupData, param);
						}
					});
			}
		}

		function loadWizards() {
			updateWizards();
			$scope.asyncInProgress = true;

			basicsConfigWizardSidebarService
				.loadWizardsComplete()
				.then(function (response) {
					$scope.asyncInProgress = false;
					var wiz2GroupIds = [];
					wizardsComplete = response.data;
					_.each(wizardsComplete, function (wiz) {
						wiz2GroupIds.push(wiz.Id);
					});
					return wiz2GroupIds;
				})
				.then(function (value) {
					return basicsConfigWizardSidebarService.loadGenWizConfigs(value);
				});
		}

		/**
		 * updateWizards loads the wizards shown in the sidebar
		 * and all the wizard setup data from the registration.
		 * Wizards are checked if isHidden is set.
		 */
		function updateWizards() {
			basicsConfigWizardSidebarService.loadWizards()
				.then((response) => {
					wizardSetupDataMap = basicsConfigWizardSidebarService.getWizardSetupDataMap();
					ctrl.data = [];

					response.forEach((wizardGroup) => {
						wizardGroup.wizards = wizardGroup.wizards.filter((wizard) => {
							const wizardSetupData = wizardSetupDataMap.get(wizard.wizardGuid);

							if (wizardSetupData) {
								if (wizardSetupData.isHidden === true || (angular.isFunction(wizardSetupData.isHidden) && wizardSetupData.isHidden(wizardSetupData))) {
									$scope.isHidden = true;

									return false;
								}

								return platformPermissionService.functionalRoleHas(null, wizardSetupData.functionalPermissionUuid, permissions.execute);
							}

							return platformPermissionService.functionalRoleHas(null, wizard.wizardGuid.toLowerCase(), permissions.execute);
						});

						wizardGroup.wizards.forEach((wizard) => {
							wizard.hide = false;
						});

						if (wizardGroup.wizards.length > 0) {
							ctrl.data.push(wizardGroup);
						}
					});
				});
		}

		let unregister = [];

		unregister.push(
			$rootScope.$on('asyncInProgress', (event, args) => {
				$scope.asyncInProgress = _.isBoolean(args) ? args : false;
			})
		);

		unregister.push(
			$rootScope.$on('permission-service:changed', () => {
				loadWizards();
			})
		);

		unregister.push(
			$rootScope.$on('wizard-sidebar:disable-wizards', (event, state) => {
				$scope.isDisabled = state;
				$timeout(_.noop, 0, true);
			})
		);

		// unregister when container destroyed
		unregister.push(
			$scope.$on('$destroy', function () {
				_.over(unregister)();
				unregister = null;
			})
		);

		loadWizards();
	}
})();
