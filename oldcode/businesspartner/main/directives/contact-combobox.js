(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name businessPartnerMainFilteredContactCombobox
	 * @function
	 *
	 * @description
	 * businessPartnerMainFilteredContactCombobox is a directive for a combo box showing contact. It is important to set a filter key to reduce the number of elements being shown
	 */
	angular.module('businesspartner.main').directive('businessPartnerMainFilteredContactCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 3,
				lookupType: 'contact',
				valueMember: 'Id',
				displayMember: 'FullName',
				uuid: 'e008134d1ba941f1ac9af03db4548fd5',
				columns: [
					{id: 'FirstName', field: 'FirstName', name: 'FirstName', name$tr$: 'businesspartner.main.firstName', width: 100},
					{id: 'FamilyName', field: 'FamilyName', name: 'FamilyName', name$tr$: 'businesspartner.main.familyName', width: 100},
					{id: 'Title', field: 'Title', name: 'Title', name$tr$: 'businesspartner.main.title', width: 100},
					{id: 'Description', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 120},
					{id: 'AddressLine', field: 'AddressLine', name: 'Address', name$tr$: 'cloud.common.entityAddress', width: 120}
				],
				width: 500,
				height: 200,
				pageOptions: {
					enabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				controller: ['$scope', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', '$translate',
					function ($scope, $element, cloudDesktopTeamsManagementService, platformModalService, $translate) {

						let readOnly = false;
						if ($element[0]?.attributes?.['data-readonly']) {
							readOnly = $element[0].attributes['data-readonly'].value === 'true';
						}

						if (!readOnly) {
							let execute = function (/* event, editValue */) {
								let chatURL = 'https://teams.microsoft.com/l/chat/0/0?users=';
								let displayItem = $scope.$$childTail.displayItem;
								let selectedItems = $scope.$$childTail.selectedItems; // If selectedItems is empty array, displayItem should not exist.
								let emails = [];
								if (displayItem?.Email) {
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
									let title = $translate.instant('basics.clerk.teams.title');
									let msg = $translate.instant('basics.clerk.teams.contactHasNoEmail');
									return platformModalService.showMsgBox(msg, title, 'error');
								}
							};

							let canExecute = function () {
								// Add tooltip for grid cell button
								let teamsButtonElements = document.getElementsByClassName('control-icons ico-teams');
								for (let ele of teamsButtonElements) {
									if (ele.title === '') {
										ele.title = $translate.instant('basics.clerk.teams.chatInTeams');
									}
								}

								let selectedEntitys = $scope.$$childTail.selectedItems;
								if (selectedEntitys) { // selectedEntitys is defined
									for (let entity of selectedEntitys) {
										if (entity.Email) {
											return true;
										}
									}
									return false;
								} else { // selectedEntitys is not defined
									return $scope.$$childTail.displayItem?.Email;
								}
							};

							if (cloudDesktopTeamsManagementService.enableTeamsChatNavigation) {
								angular.extend($scope.lookupOptions, {extButtons: [{
									class: 'control-icons ico-teams',
									title : $translate.instant('basics.clerk.teams.chatInTeams'),
									execute: execute,
									canExecute: canExecute
								}]});
							}
						}
					}]
			});
		}]);
})(angular);