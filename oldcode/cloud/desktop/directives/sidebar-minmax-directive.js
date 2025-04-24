(function (angular) {
	'use strict';
	var modulename = 'cloud.desktop';
	angular.module(modulename).directive('cloudDesktopSidebarMinmax',
		['$translate','cloudDesktopSidebarUserSettingsService', function ($translate,cloudDesktopSidebarUserSettingsService) {
			return {
				restrict: 'E',
				scope: {
					toggleSize: '&',
					setSidebarMaximizeStatus: '&'
				},
				template: '<button type="button" class="tlb-icons minMaxDirective" ng-class="sidebarSizeCssClass" ng-click="toggleSize()" title="{{iconTitle}}"><span>{{iconTitle}}</span></button>',
				link: function (scope, element) {
					let sidebarToolMaxIcon = $translate.instant('cloud.desktop.sidebarToolMaxIcon');
					let sidebarToolMinIcon = $translate.instant('cloud.desktop.sidebarToolMinIcon');
					
					let maxIcon = 'ico-sdb-maximize';
					let minIcon = 'ico-sdb-minimize';

					scope.sidebarSizeCssClass = maxIcon;
					scope.iconTitle = sidebarToolMaxIcon;

					scope.toggleSize = function () {
						var className = (scope.sidebarSizeCssClass === maxIcon) ? maxIcon : minIcon;
						var sidebarId = getSelectedSidebarId();
						scope.toggleSidebarSize(className,sidebarId);
					};

					scope.toggleSidebarSize = function (className, selectedSidebarId) {
						const sidebar = angular.element('.sidebar').find('section').filter('#' + selectedSidebarId);
						const sidebarId = sidebar.attr('id');
						let isMaximized = className === maxIcon;
						scope.sidebarSizeCssClass = isMaximized ? minIcon : maxIcon;
						scope.iconTitle = isMaximized ? sidebarToolMinIcon : sidebarToolMaxIcon;
						if (isMaximized) {scope.sidebarSize = sidebar.outerWidth(); sidebar.addClass('maximize');
						} else {sidebar.removeClass('maximize');}
						scope.setSidebarMaximizeStatus(isMaximized, sidebarId);
						element.attr('title', scope.iconTitle);
					};

					scope.setSidebarMaximizeStatus = function(state,sidebarId) {
						var sidebarmaxSettings  = getUserSettingsWithSidebarMax();
						if (state === false) {
							delete sidebarmaxSettings[sidebarId];
						} else {
							sidebarmaxSettings[sidebarId] = state;
						}

						cloudDesktopSidebarUserSettingsService.saveSidebarUserSettingsinLocalstorage(sidebarmaxSettings);
					};

					scope.$on('cloudDesktopSidebarMinmax', function (event,data) {
						var selectedId = data.id;
						if(getElementLength(selectedId) > 0){
							var sidebarmaxSettings  = getUserSettingsWithSidebarMax();
							if (sidebarmaxSettings && sidebarmaxSettings.hasOwnProperty(selectedId)) {
								scope.toggleSidebarSize(maxIcon,selectedId);
							} else {
								scope.toggleSidebarSize(minIcon,selectedId);
							}
						}

					});

					var sidebarmaxSettings  = getUserSettingsWithSidebarMax();
					if(sidebarmaxSettings){
						var sidebarId = getSelectedSidebarId();
						if (sidebarmaxSettings.hasOwnProperty(sidebarId)) {
							scope.toggleSidebarSize(scope.sidebarSizeCssClass,sidebarId);
						}
					}

					function getElementLength(elementId){
						var element = angular.element(document.getElementById(elementId));
						var minMaxElements = element.find('.minMaxDirective');
						var length = minMaxElements.length;
						return length;
					}

					function getSelectedSidebarId() {
						var sidebar = angular.element('.sidebar').find('section.selected');
						return sidebar.attr('id');
					}

					function getUserSettingsWithSidebarMax() {
						var userSettings = cloudDesktopSidebarUserSettingsService.getSidebarUserSettingValues();
						if (userSettings && userSettings.sidebarmax) {
							return userSettings.sidebarmax;
						}

						userSettings = userSettings || {};  // Initialize userSettings with an empty object if it's null or undefined
						userSettings.sidebarmax = userSettings.sidebarmax || {}; // Ensure sidebarmax is an object

						return userSettings.sidebarmax;
					}
				}
			};
		}
		]
	);
})(angular);
