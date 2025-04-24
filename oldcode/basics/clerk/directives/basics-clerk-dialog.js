(function cloudClerkClerkDialogDefinition(angular) {
	'use strict';

	angular.module('basics.clerk').directive('cloudClerkClerkDialog', [
		'BasicsLookupdataLookupDirectiveDefinition', 'platformUserInfoService', 'basicsLookupdataLookupFilterService',
		function cloudClerkClerkDialog(BasicsLookupdataLookupDirectiveDefinition, platformUserInfoService,
			basicsLookupdataLookupFilterService) {

			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'basics-clerk-by-company-filter',
				serverSide: true,
				serverKey: 'basics-clerk-by-company-filter',
				fn: function (entity) {
					return { CompanyFk: entity.CompanyFk };
				}
			}]);

			var defaults = {
				lookupType: 'clerk',
				valueMember: 'Id',
				displayMember: 'Code',
				version: 3,
				disableDataCaching: false,
				uuid: '43683f5e7d484ff1bf274762205f0e1b',
				dialogUuid: '6df7ca744ab64644b2f791b1ee3dc831',
				width: 500,
				height: 200,
				title: {
					name: 'cloud.common.dialogTitleClerk'
				},
				layoutOptions: {
					uiStandardServiceName: 'basicsClerkUIStandardService',
					schemas: [
						{
							typeName: 'ClerkDto',
							moduleSubModule: 'Basics.Clerk'
						}
					]
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				dataProcessor: {
					execute : dataProcessor
				}
			};

			function dataProcessor(data, options){

				if(options.removeSelfFromClerk){
					// remove self from clerk
					var currentUserId = platformUserInfoService.getCurrentUserInfo().UserId;
					data = data.filter(clerk=>clerk.UserFk!== currentUserId);
				}
				return data;
			}

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				controller: [
					'$scope',
					'$element',
					'cloudDesktopTeamsManagementService',
					'platformModalService',
					'$translate',
					function cloudClerkClerkDialogController(
						$scope,
						$element,
						cloudDesktopTeamsManagementService,
						platformModalService,
						$translate) {

						var readOnly = false;
						if ($element[0] && $element[0].attributes && $element[0].attributes['data-readonly']) {
							readOnly = $element[0].attributes['data-readonly'].value === 'true';
						}

						if (!readOnly) {// true -> read only -> nothing to do

							var execute = function (/* event, editValue */) {
								var chatURL = 'https://teams.microsoft.com/l/chat/0/0?users=';
								var displayItem = $scope.$$childTail.displayItem;
								var selectedItems = $scope.$$childTail.selectedItems; // If selectedItems is empty array, displayItem should not exist.
								var emails = [];
								if (displayItem && displayItem.Email) {
									emails.push(displayItem.Email);
								}
								if (selectedItems) {
									selectedItems.forEach(function (entity) {
										if (entity.Email && !emails.includes(entity.Email)) {
											emails.push(entity.Email);
										}
									});
								}
								if (emails.length) {
									emails = emails.join(',');
									chatURL += emails;
									window.open(chatURL);
								} else {
									var title = $translate.instant('basics.clerk.teams.title');
									var msg = $translate.instant('basics.clerk.teams.clerkHasNoEmail');
									return platformModalService.showMsgBox(msg, title, 'error');
								}
							};

							var canExecute = function () {
								// Add tooltip for grid cell button
								var teamsButtonElements = document.getElementsByClassName('control-icons ico-teams');
								for (var ele of teamsButtonElements) {
									if (ele.title === '') {
										ele.title = $translate.instant('basics.clerk.teams.chatInTeams');
									}
								}

								var selectedEntitys = $scope.$$childTail.selectedItems;
								if (selectedEntitys) { // selectedEntitys is defined
									for (var entity of selectedEntitys) {
										if (entity.Email) {
											return true;
										}
									}
									return false;
								} else { // selectedEntitys is not defined
									return $scope.$$childTail.displayItem && $scope.$$childTail.displayItem.Email;
								}
							};

							if (cloudDesktopTeamsManagementService.enableTeamsChatNavigation) {
								angular.extend($scope.lookupOptions, {
									extButtons: [
										{
											class: 'control-icons ico-teams',
											title :$translate.instant('basics.clerk.teams.chatInTeams'),
											execute: execute,
											canExecute: canExecute
										}
									]
								});
							}
						}
					}]
			});
		}
	]);
})(angular);