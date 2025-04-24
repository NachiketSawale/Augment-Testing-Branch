(function (angular, globals) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,$ */

	globals.lookups.Contact = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'Contact',
				valueMember: 'Id',
				displayMember: 'FullName',
				uuid: '50c5e8839b6a40a89364af863893f9fe',
				columns: [
					{
						id: 'FirstName',
						field: 'FirstName',
						name: 'FirstName',
						name$tr$: 'businesspartner.main.firstName',
						width: 100
					},
					{
						id: 'FamilyName',
						field: 'FamilyName',
						name: 'FamilyName',
						name$tr$: 'businesspartner.main.familyName',
						width: 100
					},
					{id: 'Title', field: 'Title', name: 'Title', name$tr$: 'businesspartner.main.title', width: 100},
					{
						id: 'Telephone1',
						field: 'Telephone1',
						name: 'Telephone',
						name$tr$: 'businesspartner.main.telephoneNumber',
						width: 100
					},
					{
						id: 'Telephone2',
						field: 'Telephone2',
						name: 'Other Tel.',
						name$tr$: 'businesspartner.main.telephoneNumber2',
						width: 100
					},
					{
						id: 'Telefax',
						field: 'Telefax',
						name: 'Telefax',
						name$tr$: 'businesspartner.main.telephoneFax',
						width: 100
					},
					{
						id: 'Mobile',
						field: 'Mobile',
						name: 'Mobile',
						name$tr$: 'businesspartner.main.mobileNumber',
						width: 100
					},
					{
						id: 'Internet',
						field: 'Internet',
						name: 'Internet',
						name$tr$: 'businesspartner.main.internet',
						width: 100
					},
					{id: 'Email', field: 'Email', name: 'Email', name$tr$: 'businesspartner.main.email', width: 100},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 120
					},
					{
						id: 'AddressLine',
						field: 'AddressLine',
						name: 'Address',
						name$tr$: 'cloud.common.entityAddress',
						width: 120
					},
					{
						id: 'ContactRoleFk', field: 'ContactRoleFk', name: 'Role', name$tr$: 'businesspartner.main.role', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.contact.role',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					}
				],
				title: {name: 'Assign Contact', name$tr$: 'cloud.common.dialogTitleContact'},
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainContactDialogWithoutTeams',
		['globals', 'BasicsLookupdataLookupDirectiveDefinition', 'platformDomainService',
			function (globals, BasicsLookupdataLookupDirectiveDefinition, platformDomainService) {

				let providerInfo = globals.lookups.Contact();
				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions, {
					controller: ['$scope', '$window', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', '$translate',
						function ($scope, $window, $element, cloudDesktopTeamsManagementService, platformModalService, $translate) {

							let getPhoneImage = function () {
								let imgPos = globals.telephoneScheme.css.indexOf('ico-phone');
								return globals.telephoneScheme.css.substring(imgPos);
							};

							let executeEmail = function (/* event, editValue */) {
								let contactEntity = $scope.$$childTail.displayItem;
								if (contactEntity?.Email) {
									$window.location.href = 'mailto:' + contactEntity.Email;
								}
							};

							let executeTelephone = function () {
								let field = $scope.options.displayMember;
								let contactEntity = $scope.$$childTail.displayItem;
								if (contactEntity?.[field]) {
									let link = globals.telephoneScheme.scheme + ':' + contactEntity[field];
									if (globals.telephoneScheme.id === 2) {
										link += '?call';
									}
									$window.location.href = link;
								}
							};

							if ($scope.options.displayMember === 'Email') {
								$.extend($scope.lookupOptions, {
									extButtons: [
										{
											class: 'btn btn-default ' + platformDomainService.loadDomain('email').image,
											execute: executeEmail,
											canExecute: function () {
												return true;
											}
										}
									]
								});
							} else if (($scope.options.displayMember === 'Telephone1'
								|| $scope.options.displayMember === 'Telephone2'
								|| $scope.options.displayMember === 'Telefax'
								|| $scope.options.displayMember === 'Mobile') && globals.telephoneScheme.id > 0) {
								$.extend($scope.lookupOptions, {
									extButtons: [
										{
											class: 'btn btn-default control-icons ' + getPhoneImage(),
											execute: executeTelephone,
											canExecute: function () {
												return true;
											}
										}
									]
								});
							}
						}]
				});
			}
		]);

})(angular, globals);