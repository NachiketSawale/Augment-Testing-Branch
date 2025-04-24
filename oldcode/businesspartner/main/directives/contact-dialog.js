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
						name: 'Branch Description',
						name$tr$: 'businesspartner.main.branchDescription',
						width: 120
					},
					{
						id: 'AddressLine',
						field: 'AddressLine',
						name: 'Branch Address',
						name$tr$: 'businesspartner.main.branchAddress',
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
					},{
						id: 'Remark', field: 'Remark', name: 'Remark', name$tr$: 'cloud.common.entityRemark', width: 100
					},{
						id: 'BusinessPartnerFk', field: 'BusinessPartnerFk', name: 'BusinessPartnerFk', name$tr$: 'cloud.common.entityBusinessPartner', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					},{id:'BpdContactTimelinessFk',field: 'BpdContactTimelinessFk',name: 'BpdContactTimelinessFk',name$tr$: 'businesspartner.main.timeliness', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.contact.timeliness',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					}, {
						id: 'BpdContactOriginFk', field: 'BpdContactOriginFk', name: 'BpdContactOriginFk', name$tr$: 'businesspartner.main.origin', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.contact.origin',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					},{
						id: 'contactabcfk', field: 'BpdContactAbcFk', name: 'contactabcfk', name$tr$: 'businesspartner.main.customerAbc', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.contact.abc',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					},
					{
						id: 'BasTitleFk', field: 'BasTitleFk', name: 'Opening', name$tr$: 'businesspartner.contact.titleName', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'title',
							displayMember: 'DescriptionInfo.Translated'
						}
					},{
						id: 'Initials', field: 'Initials', name: 'Initials', name$tr$: 'businesspartner.main.initials', width: 100
					},
					{
						id: 'Pronunciation', field: 'Pronunciation', name: 'Pronunciation', name$tr$: 'businesspartner.main.pronunciation', width: 100
					},
					{
						id: 'CompanyFk', field: 'CompanyFk', name: 'CompanyFk', name$tr$: 'cloud.common.entityCompany', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						}
					},{
						id: 'CompanyName', field: 'CompanyFk', name: 'Company Name', name$tr$: 'cloud.common.entityCompanyName', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'CompanyName'
						}
					},
					{
						id: 'BasClerkResponsibleCode', field: 'BasClerkResponsibleFk', name: 'BasClerkResponsibleCode', name$tr$: 'cloud.common.entityResponsible', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.lookup.basclerk',
							displayMember: 'Code',
							valueMember: 'Id'
						}
					},
					{
						id: 'BasClerkResponsibleDescription', field: 'BasClerkResponsibleFk', name: 'BasClerkResponsibleDescription', name$tr$: 'cloud.common.entityResponsibleName', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.lookup.basclerk2',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					},
					{
						id: 'Birthdate', field: 'Birthdate', name: 'Birthdate', name$tr$: 'businesspartner.main.birthDate', width: 100
					},
					{
						id: 'NickName', field: 'NickName', name: 'NickName', name$tr$: 'businesspartner.main.nickname', width: 100
					},
					{
						id: 'PartnerName', field: 'PartnerName', name: 'PartnerName', name$tr$: 'businesspartner.main.partnerName', width: 100
					},
					{
						id: 'Children', field: 'Children', name: 'Children', name$tr$: 'businesspartner.main.children', width: 100
					},
					{
						id: 'IsDefault', field: 'IsDefault', name: 'IsDefault', name$tr$: 'cloud.common.entityIsDefault', width: 100,
						formatter: function (row, cell, value) {
							let template = '<input disabled="true" type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
							return '<div class="text-center" >' + template + '</div>';
						}
					},
					{
						id: 'Provider', field: 'Provider', name: 'Provider', name$tr$: 'businesspartner.main.provider', width: 100
					},
					{
						id: 'ProviderId', field: 'ProviderId', name: 'ProviderId', name$tr$: 'businesspartner.main.providerId', width: 100
					},
					{
						id: 'ProviderFamilyName', field: 'ProviderFamilyName', name: 'ProviderFamilyName', name$tr$: 'businesspartner.main.providerFamilyName', width: 100
					},
					{
						id: 'ProviderEmail', field: 'ProviderEmail', name: 'ProviderEmail', name$tr$: 'businesspartner.main.providerEmail', width: 100
					},
					{
						id: 'ProviderAddress', field: 'ProviderAddress', name: 'ProviderAddress', name$tr$: 'businesspartner.main.ProviderAddress', width: 100
					},
					{
						id: 'ProviderComment', field: 'ProviderComment', name: 'Comment', name$tr$: 'cloud.common.entityCommentText', width: 100
					},
					{
						id: 'PortalUserGroupName', field: 'PortalUserGroupName', name: 'PortalUserGroupName', name$tr$: 'businesspartner.main.portalAccessGroup', width: 100
					},
					{
						id: 'LogonName', field: 'LogonName', name: 'LogonName', name$tr$: 'cloud.common.User_LogonName', width: 100
					},
					{
						id: 'IdentityProviderName', field: 'IdentityProviderName', name: 'IdentityProviderName', name$tr$: 'businesspartner.main.identityProviderName', width: 100
					},
					{
						id: 'LastLogin', field: 'LastLogin', name: 'LastLogin', name$tr$: 'businesspartner.main.lastLogin', width: 100
					},
					{
						id: 'Statement', field: 'State', name: 'Statement', name$tr$: 'businesspartner.main.state', width: 100,initial: 'State',
						formatter: function (row, cell, value) {
							let template;
							if(value===1){
								template = '<label disabled="true">active</label>';
							}else if(value===2){
								template = '<label disabled="true">inactive</label>';
							}else{
								template = '<label disabled="true">';
							}

							return '<div class="text-center" >' + template + '</div>';
						}
					},
					{
						id: 'SetInactiveDate', field: 'SetInactiveDate', name: 'SetInactiveDate', name$tr$: 'businesspartner.main.setInactiveDate', width: 100
					},
					{
						id: 'IsLive', field: 'IsLive', name: 'IsLive', name$tr$: 'cloud.common.entityIsLive', width: 100,
						formatter: function (row, cell, value) {
							let template = '<input disabled="true" type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
							return '<div class="text-center" >' + template + '</div>';
						}
					},{
						id: 'EmailPrivat', field: 'EmailPrivat', name: 'EmailPrivat', name$tr$: 'cloud.common.emailPrivate', width: 100
					},{
						id: 'CountryFk', field: 'CountryFk', name: 'Country', name$tr$: 'cloud.common.entityCountry', width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.lookup.country',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					},{
						id:'PortalUserGroupName',field:'PortalUserGroupName',name:'Portal User Group',name$tr$: 'businesspartner.main.portalAccessGroup'
					},{
						id: 'AddressDescriptor',
						field: 'AddressLine',
						name: 'Private address',
						name$tr$: 'businesspartner.main.contactAddress',
						width: 120
					},{
						id: 'PrivateTelephone',
						field: 'PrivateTelephone',
						name: 'Private Telephone',
						name$tr$: 'businesspartner.contact.contactTelephoneNumber',
						width: 120
					},{
						id: 'Title',
						field: 'Title',
						name: 'Title',
						name$tr$: 'businesspartner.main.title',
						width: 120
					}
				],
				title: {name: 'Assign Contact', name$tr$: 'cloud.common.dialogTitleContact'},
				pageOptions: {
					enabled: true
				},
				disableTeams: false
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainContactDialog',
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

							let readOnly = false;
							if ($element[0]?.attributes?.['data-readonly']) {
								readOnly = $element[0].attributes['data-readonly'].value === 'true';
							}

							if (!readOnly && !$scope.lookupOptions.disableTeams && cloudDesktopTeamsManagementService.enableTeamsChatNavigation) {
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

								angular.extend($scope.lookupOptions, {
									extButtons: [
										{
											class: 'control-icons ico-teams',
											title: $translate.instant('basics.clerk.teams.chatInTeams'),
											execute: execute,
											canExecute: canExecute
										}
									]
								});
							}
						}]
				});
			}
		]);

})(angular, globals);