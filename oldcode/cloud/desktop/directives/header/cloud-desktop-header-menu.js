(() => {
	'use strict';

	function cloudDesktopHeaderMenu(cloudDesktopHeaderMenuService, basicsLookupdataPopupService, $http, platformUserInfoService, basicsCommonActiveCollaboratorsService, $timeout, basicsCommonUserAvatarService,$translate) {
		return {
			restrict: 'EA',
			scope: false,
			templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/cloud-desktop-header-menu.html',
			link: function(scope, elem, attr) {
				let instance;
				let urlProfile;
				let defaultPopupOptions = {
					multiPopup: false,
					plainMode: true,
					hasDefaultWidth: false
				};

				let defaultMenuListOptions = {
					showImages: false,
					showTitles: true
				};

				// Show Profile Implementation
				const userId = platformUserInfoService.getCurrentUserInfo().UserId;

				// endpoint not yet available, so disabling error dialog
				$http.get(globals.webApiBaseUrl + 'cloud/common/identityuserinfo/getidentityuserprofile', {
					headers: {
						errorDialog: false
					},
					params: {
						userId: userId
					}
				}).then((response) => {
					urlProfile = response.data;
				}).catch((error) => {
					console.error('Error fetching identity provider data:', error);
					return null;
				});

				function openPopupContainer(option, event) {
					instance = basicsLookupdataPopupService.toggleLevelPopup(option);

					if (!_.isNil(instance)) {
						instance.closed
							.then(function () {
								angular.element(event.target).parents('button').removeClass('active');
								instance = null;
							});
					}
				}

				function getParentElement(event) {
					let focusElem = angular.element(event.target);
					if(event.target.tagName === 'BUTTON') {
						return focusElem;
					} else {
						return focusElem.parents('button');
					}

				}

				function addCSSClass(parent) {
					angular.element(elem).find('button').removeClass('active');
					parent.addClass('active');
				}

				scope.openFirstHeaderPopup = function(event) {
					cloudDesktopHeaderMenuService.checkModuleVideo().then(function(result) {
						let parent = getParentElement(event);
						addCSSClass(parent);

						scope.helpMenu = $.extend({}, defaultMenuListOptions, {
							items: cloudDesktopHeaderMenuService.getOptionsHelp(scope, result)
						});

						let popupOptions = $.extend({}, defaultPopupOptions, {
							scope: scope,
							focusedElement: parent,
							template: '<div data-platform-menu-list data-list="helpMenu" data-init-once data-popup></div>'
						});

						openPopupContainer(popupOptions, event);
					});

				};

				scope.openSecondHeaderPopup = function(event) {
					let parent = getParentElement(event);
					addCSSClass(parent);

					scope.notificationsMenu = $.extend({}, defaultMenuListOptions, {
						items: cloudDesktopHeaderMenuService.getOptionsNotifications(scope)
					});



					let popupOptions = $.extend({}, defaultPopupOptions, {
						scope: scope,
						focusedElement: parent,
						template: '<div data-platform-menu-list data-list="notificationsMenu" data-init-once data-popup></div>'
					});

					openPopupContainer(popupOptions, event);
				};

				scope.openThirdHeaderPopup = function(event) {
					cloudDesktopHeaderMenuService.checkUserConnectToEmployee().then(function (result) {
						let parent = getParentElement(event);
						addCSSClass(parent);
						scope.profileMenu = $.extend({}, defaultMenuListOptions, {
							items: cloudDesktopHeaderMenuService.getOptionsProfile(scope, urlProfile, result)
						});

						let popupOptions = $.extend({}, defaultPopupOptions, {
							scope: scope,
							focusedElement: parent,
							template: '<div data-platform-menu-list data-list="profileMenu" data-init-once data-popup></div>'
						});

						openPopupContainer(popupOptions, event);
					});
				}

                scope.getInitials = function (name) {
					return basicsCommonUserAvatarService.getInitials(name);
				};

				scope.getAvatarColor = function (name) {
					const { background, foreground } = basicsCommonUserAvatarService.generateAvatarColors(name);
					return { 'background-color': background, 'color': foreground };
				};

				scope.tooltip = {
					visible: false,
					name: '',
					email: '',
					position: { top: 0, left: 0 }
				};

				scope.initializePopover = function(event, collab) {
					let rect = event.target.getBoundingClientRect();

					scope.tooltip = {
						visible: true,
						name: collab.DisplayName || $translate.instant('cloud.desktop.collaboratorNA'),
						email: collab.EMail || $translate.instant('cloud.desktop.collaboratorNA'),
						position: {
							top: rect.top + window.scrollY,
							left: rect.right + 15
						}
					};
				};

				scope.hideTooltip = function() {
					scope.tooltip.visible = false;
				};

				function updateCollaborators(collaborators) {
					scope.$evalAsync(() => scope.menuList = collaborators || []);
				}

				scope.getLengthOfCollaborators = function(){
					return scope.menuList?.length || 0;
				}

				scope.showCollabInDesktop = function(){
					if(scope.isDesktopActive){
						return true
					}else{
						return false;
					}
				}

				scope.openFourthHeaderPopup = function(event) {
					let parent = getParentElement(event);
					addCSSClass(parent);

					scope.collaboratorList = $.extend({}, defaultMenuListOptions, {
						items: scope.menuList
					});

					let popupOptions = $.extend({}, defaultPopupOptions, {
						scope: scope,
						focusedElement: parent,
						template: `
						<div data-platform-menu-list data-init-once data-popup>
						   <ul class="collaborator-list" >
						   <li class="collaborator-item-active"> ` + $translate.instant('cloud.desktop.activeInModule') + `</li>
						   <li><hr></li>
								<li class="collaborator-item"
								   ng-repeat="collab in collaboratorList.items track by $index"
								   ng-mouseover="initializePopover($event,collab)"
								   ng-mouseleave="hideTooltip()">

								   <span class="avatar" ng-style="getAvatarColor(collab.DisplayName)">{{ getInitials(collab.DisplayName) }}</span>
								   <span class="collaborator-name">{{ collab.DisplayName }}</span>

									<!-- Tooltip Element -->
								   <div class="tooltip-box" ng-show="tooltip.visible && tooltip.name === collab.DisplayName">
								   <div class="tooltip-avatar" ng-style="getAvatarColor(tooltip.name)">{{ getInitials(tooltip.name) }}</div>
								   <div class="tooltip-content">
										<span>{{ tooltip.name }}</span>
										<span>{{ tooltip.email }}</span>
									</div>
								   </div>
						   </li>
						   </ul>
					   </div>`,
					});

					openPopupContainer(popupOptions, event);

				};

				basicsCommonActiveCollaboratorsService.registerCollaboratorsUpdated(updateCollaborators);

				scope.$on('$destroy', function () {
					basicsCommonActiveCollaboratorsService.stopCollaboration();
				});

			}
		};
	}


	cloudDesktopHeaderMenu.$inject = ['cloudDesktopHeaderMenuService', 'basicsLookupdataPopupService', '$http', 'platformUserInfoService','basicsCommonActiveCollaboratorsService', '$timeout','basicsCommonUserAvatarService','$translate'];
	angular.module('cloud.desktop').directive('cloudDesktopHeaderMenu', cloudDesktopHeaderMenu);
})();