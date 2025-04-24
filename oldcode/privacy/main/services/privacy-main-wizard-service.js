((angular) => {
	'use strict';

	let moduleName = 'privacy.main';
	angular.module(moduleName).service('privacyMainSidebarWizardService', PrivacyMainSidebarWizardService);

	PrivacyMainSidebarWizardService.$inject = ['platformTranslateService', 'platformDialogService', 'platformModalFormConfigService', 'platformContextService', '$translate', '$http',
		'privacyMainConstantValues', 'privacyMainPrivacyRequestDataService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataSimpleLookupService', 'globals', '_', 'platformSidebarWizardCommonTasksService'];

	function PrivacyMainSidebarWizardService(platformTranslateService, platformDialogService, platformModalFormConfigService, platformContextService, $translate, $http,
		privacyMainConstantValues, privacyMainPrivacyRequestDataService, basicsLookupdataLookupFilterService, basicsLookupdataSimpleLookupService,
		globals, _ , platformSidebarWizardCommonTasksService) {

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'privacy-clerk-filter',
				serverKey : 'privacy-clerk-filter',
				fn: function (entity) {
					return !entity.IsAnonymized;
				}
			}]);

		function getRowIsWithBackup (readonly) {
			return {
				gid: 'baseGroup',
				rid: 'isWithBackup',
				label$tr$: 'privacy.main.isWithBackup',
				type: 'boolean',
				model: 'IsWithBackup',
				visible: true,
				sortOrder: 1,
				readonly: readonly
			};
		}

		function getRowClerkId (readonly) {
			return {
				gid: 'baseGroup',
				rid: 'clerkId',
				label$tr$: 'privacy.main.clerkId',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'cloud-clerk-clerk-dialog',
					descriptionMember: 'Description',
					lookupOptions: {
						showClearButton: false,
						filterKey: 'privacy-clerk-filter'
					}
				},
				model: 'Id',
				visible: true,
				sortOrder: 2,
				readonly: readonly
			};
		}

		function getRowUserId (readonly) {
			return {
				gid: 'baseGroup',
				rid: 'userId',
				label$tr$: 'privacy.main.userId',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'usermanagement-user-user-dialog',
					descriptionMember: 'Description',
					lookupOptions: {
						showClearButton: false,
						filterKey: 'privacy-clerk-filter'
					}
				},
				model: 'Id',
				visible: true,
				sortOrder: 2,
				readonly: readonly
			};
		}

		function getRowContactId (readonly){
			return {
				gid: 'baseGroup',
				rid: 'contactId',
				label$tr$: 'privacy.main.contactId',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'business-partner-main-filtered-contact-combobox',
					descriptionMember: 'Description',
					lookupOptions: {
						showClearButton: false,
						filterKey: 'privacy-clerk-filter'
					}
				},
				model: 'Id',
				visible: true,
				sortOrder: 2,
				readonly: readonly
			};
		}

		function getRowBpId (readonly){
			return {
				gid: 'baseGroup',
				rid: 'contactId',
				label$tr$: 'privacy.main.businessPartnerId',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'business-partner-main-business-partner-dialog',
					descriptionMember: 'Description',
					lookupOptions: {
						initValueField: 'BusinesspartnerBpName1',
						showClearButton: false,
						filterKey: 'privacy-clerk-filter'
					}
				},
				model: 'Id',
				visible: true,
				sortOrder: 2,
				readonly: readonly
			};
		}

		function create (isWithBackup, type, value){
			privacyMainPrivacyRequestDataService.doUpdate().then(function(){
				let actionData = {Type: type, Id: value};

				if( privacyMainPrivacyRequestDataService.isExisting(value)) {
					platformDialogService.showInfoBox('privacy.main.requestAlreadyExists');

				} else {
					$http.post(globals.webApiBaseUrl + 'privacy/main/request/validate', actionData).then(function (result) {

						if (result) {
							let grade = isWithBackup ? privacyMainConstantValues.grade.withBackup : privacyMainConstantValues.grade.withoutBackup;
							let creationData = {
								Pkey1: grade,
								Pkey2: type,
								Pkey3: privacyMainConstantValues.requestedBy.client
							};
							$http.post(globals.webApiBaseUrl + 'privacy/main/request/create', creationData
							).then(function (response) {
								if (response && response.data) {
									response.data.RenderedDataId = value;
									privacyMainPrivacyRequestDataService.createSucceed(response.data);
								}
							});
						} else {
							platformDialogService.showInfoBox('privacy.main.requestAlreadyExists');
						}
					});
				}
			});
		}

		function prepareToAnonymise (title, type) {
			let item = {
				'IsWithBackup': false,
				'Id': null
			};

			let rows = [ getRowIsWithBackup(false)];
			switch (type){
				case privacyMainConstantValues.handledType.clerk:
					rows.push(getRowClerkId( false));
					break;
				case privacyMainConstantValues.handledType.user:
					rows.push(getRowUserId( false));
					break;
				case privacyMainConstantValues.handledType.contact:
					rows.push(getRowContactId( false));
					break;
				case privacyMainConstantValues.handledType.businessPartner:
					rows.push(getRowBpId( false));
					break;
			}

			let anonymiseClerkConfig = {
				title: $translate.instant(title),
				dataItem: item,
				formConfiguration: {
					fid: 'privacy.main.anonymiseClerk',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['IsWithBackup', 'Id']
						}
					],
					rows: rows
				},
				handleOK: function handleOK(result) {
					if(result && result.data) {
						create(result.data.IsWithBackup, type, result.data.Id);
					}
				}
			};
			platformTranslateService.translateFormConfig(anonymiseClerkConfig.formConfiguration);
			platformModalFormConfigService.showDialog(anonymiseClerkConfig);
		}

		function anonymise(title, question, type) {

			let rows = [ getRowIsWithBackup(true)];
			switch (type){
				case privacyMainConstantValues.handledType.clerk:
					rows.push(getRowClerkId( true));
					break;
				case privacyMainConstantValues.handledType.user:
					rows.push(getRowUserId( true));
					break;
				case privacyMainConstantValues.handledType.contact:
					rows.push(getRowContactId( true));
					break;
				case privacyMainConstantValues.handledType.businessPartner:
					rows.push(getRowBpId( true));
					break;
			}

			let selected = privacyMainPrivacyRequestDataService.getSelected();
			let currentUserId = platformContextService.getCurrentUserId();
			if (platformSidebarWizardCommonTasksService.assertSelection(selected)) {
				if(selected.PrivacyHandledTypeFk === type) {
					if (selected.InsertedBy !== currentUserId &&
						(selected.PrivacyGradeFk === privacyMainConstantValues.grade.withBackup || selected.PrivacyGradeFk === privacyMainConstantValues.grade.withoutBackup)) {
						basicsLookupdataSimpleLookupService.refreshCachedData({
							lookupModuleQualifier: 'privacy.config.grade',
							displayMember: 'Description',
							valueMember: 'Id',
							filter: {
								customBoolProperty: 'ISWITHBACKUP'
							}
						}).then(function (response) {
							if (response) {
								let grade = _.find(response, {Id: selected.PrivacyGradeFk});
								let item = {
									'IsWithBackup': grade.Iswithbackup,
									'Id': selected.RenderedDataId
								};
								let anonymiseClerkConfig = {
									title: $translate.instant(title),
									dataItem: item,
									formConfiguration: {
										fid: 'privacy.main.anonymiseClerk',
										version: '1.0.0',
										showGrouping: false,
										groups: [
											{
												gid: 'baseGroup',
												attributes: ['IsWithBackup', 'Id']
											}
										],
										rows: rows
									},
									handleOK: function handleOK() {
										platformDialogService.showYesNoDialog(question, title, 'no')
											.then(function (result) {
												let actionData = {ActionId: 1, Id: selected.Id};
												if (result.yes) {
													$http.post(globals.webApiBaseUrl + 'privacy/main/request/execute', actionData
													).then(function (response) {// response not used
														platformDialogService.showInfoBox('privacy.main.anonymizedSucceed');
														if (response.data) {
															privacyMainPrivacyRequestDataService.takeOver(response.data);
														}
													});
												}
											});
									}
								};
								platformTranslateService.translateFormConfig(anonymiseClerkConfig.formConfiguration);
								platformModalFormConfigService.showDialog(anonymiseClerkConfig);
							}
						});
					} else {
						if (selected.InsertedBy === currentUserId) {
							platformDialogService.showInfoBox('privacy.main.usernotallowed');
						} else {
							platformDialogService.showInfoBox('privacy.main.requestAlreadyAnonymized');
						}
					}
				} else {
					platformDialogService.showInfoBox('privacy.main.wrongType');
				}
			}
		}

		this.anonymiseClerk = function anonymiseClerk() {
			anonymise('privacy.main.anonymiseClerk2', 'privacy.main.confirmationClerkQuestion', privacyMainConstantValues.handledType.clerk);
		};

		this.prepareToAnonymiseClerk = function prepareToAnonymiseClerk() {
			prepareToAnonymise('privacy.main.anonymiseClerk', privacyMainConstantValues.handledType.clerk);
		};

		this.anonymiseContact = function anonymiseContact() {
			anonymise('privacy.main.anonymiseContact2', 'privacy.main.confirmationContactQuestion', privacyMainConstantValues.handledType.contact);
		};

		this.prepareToAnonymiseContact = function prepareToAnonymiseContact() {
			prepareToAnonymise('privacy.main.anonymiseContact', privacyMainConstantValues.handledType.contact);
		};

		this.anonymiseBp = function anonymiseBp() {
			anonymise('privacy.main.anonymiseBusinessPartner2', 'privacy.main.confirmationBpQuestion', privacyMainConstantValues.handledType.businessPartner);
		};

		this.prepareToAnonymiseBp = function prepareToAnonymiseBp() {
			prepareToAnonymise('privacy.main.anonymiseBusinessPartner', privacyMainConstantValues.handledType.businessPartner);
		};

		this.anonymiseUser = function anonymiseUser() {
			anonymise('privacy.main.anonymiseUser2', 'privacy.main.confirmationUserQuestion', privacyMainConstantValues.handledType.user);
		};

		this.prepareToAnonymiseUser = function prepareToAnonymiseUser() {
			prepareToAnonymise('privacy.main.anonymiseUser', privacyMainConstantValues.handledType.user);
		};

		this.deleteAnonymised = function deleteAnonymised() {
			let selected = privacyMainPrivacyRequestDataService.getSelected();
			if (platformSidebarWizardCommonTasksService.assertSelection(selected)) {
				if (selected.IsWithBackup && (selected.PrivacyGradeFk === privacyMainConstantValues.grade.anonymizedWithBackup || selected.PrivacyGradeFk === privacyMainConstantValues.grade.anonymizedWithBackup)) {
					platformDialogService.showYesNoDialog('privacy.main.confirmationDeleteQuestion', 'privacy.main.anonymiseDelete', 'no')
						.then(function (result) {
							let actionData = {ActionId: 2, Id: selected.Id};
							if (result.yes) {
								$http.post(globals.webApiBaseUrl + 'privacy/main/request/execute', actionData
								).then(function (response) {// response not used
									platformDialogService.showInfoBox('privacy.main.deleteSucceed');
									if(response.data){
										privacyMainPrivacyRequestDataService.takeOver(response.data);
									}
								});
							}
						});
				} else {
					platformDialogService.showInfoBox('privacy.main.noBackup');
				}
			}
		};
	}
})(angular);
