(function (angular) {
	'use strict';
	const moduleName = 'procurement.common';
	/* global angular,globals */
	angular.module(moduleName).factory('procurementCommonCreateButtonBySystemOptionService',
		['$q', '$http',
			function ($q, $http) {
				const service = {};
				let isProcurementCreateOnlyViaWizard = null;
				let httpRoute = globals.webApiBaseUrl + 'basics/common/systemoption/isprocurementcreateonlyviawizard';
				service.removeGridCreateButton = function (scope,arrayCreateButton) {
					if (scope && scope.tools) {
						getDataAndRemoveCreateButton(scope.tools,arrayCreateButton)
					}
				};
				service.removeDetailCreateButton = function (scope,arrayCreateButton) {
					if (scope && scope.$parent && scope.formContainerOptions && scope.formContainerOptions.createBtnConfig) {
						setTimeout(function () {
							let containerScope = scope.$parent;
							while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
								containerScope = containerScope.$parent;
							}
							if (containerScope && containerScope.tools) {
								getDataAndRemoveCreateButton(containerScope.tools,arrayCreateButton)
							}
						},100);
					}
				};

				function getDataAndRemoveCreateButton(tools,arrayCreateButton) {
					if (isProcurementCreateOnlyViaWizard === true) {
						removeCreateButton(tools,arrayCreateButton);
					} else if (isProcurementCreateOnlyViaWizard === null || isProcurementCreateOnlyViaWizard === undefined) {
						$http.get(httpRoute).then(function (response) {
							if (response && response.data !== undefined && response.data !== null) {
								isProcurementCreateOnlyViaWizard = response.data;
							}
							if (response.data === true) {
								removeCreateButton(tools,arrayCreateButton);
							}
						});
					}
				}
				function removeCreateButton(tools,arrayCreateButton) {
					if (arrayCreateButton&&arrayCreateButton.length > 0 &&tools&& tools.items&&tools.items.length > 0) {
						for (let i = 0; i < arrayCreateButton.length; i++) {
							const createButtonIndex = _.findIndex(tools.items, e => e.id === arrayCreateButton[i]);
							if (createButtonIndex > -1) {
								tools.items.splice(createButtonIndex, 1);
							}
						}
						tools.update();
					}
				}
				return service;
			}
		]);
})(angular);
