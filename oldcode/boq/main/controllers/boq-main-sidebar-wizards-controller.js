/**
 @ngdoc controller
 * @name cloudSettingsDialogController
 * @function
 *
 * @description
 * Controller for the Document Properties Structure Details view.
 */

(function () {
	/* global _ */
	'use strict';

	var moduleName = 'boq.main';

	// jshint -W072
	// jshint +W098
	angular.module(moduleName).controller('boqMainWizardsController',
		['$scope', 'platformTranslateService', 'cloudDesktopSidebarService', 'boqMainWizardService',
			function ($scope, platformTranslateService, cloudDesktopSidebarService, boqMainWizardService) {

				$scope.sidebarOptions = {
					name: cloudDesktopSidebarService.getSidebarIds().newWizards,
					title: 'Wizards',
					wizards: boqMainWizardService.getWizardList(),
					showItemFunction: showItemFunction
				};

				function showItemFunction(id) {
					var itemById;
					// get group-element in list
					for (var i = 0; i < boqMainWizardService.getWizardList().items.length; i++) {
						// get list-Element from found group-element
						itemById = _.find(boqMainWizardService.getWizardList().items[i].subitems, {id: id});
						// Execute function
						if (itemById) {
							itemById.fn();
							break;
						}
					}
				}

				platformTranslateService.registerModule('cloud.desktop');

				// loads or updates translated strings
				var loadTranslations = function () {
					// load translation ids and convert result to object
					// $scope.modalOptions.headerText = $translate.instant('cloud.desktop.settingsFormTitle');
					// platformTranslateService.translateFormConfig(cloudSettingsDialogFormConfig);
				};

				// register translation changed event
				// platformTranslateService.translationChanged.register(loadTranslations);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					// platformTranslateService.translationChanged.unregister(loadTranslations);
				});

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('cloud.desktop')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}
			}]);
})();