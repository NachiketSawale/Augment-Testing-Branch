/**
 * Created by lcn on 4/8/2019.
 */
// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).directive('businessPartnerMainBusinessPartnerDialog', ['BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function (lookupDirectiveDefinition, businessPartnerDialogService) {
			const providerInfo = businessPartnerDialogService.createLookupOption();
			return new lookupDirectiveDefinition('dialog-edit',
				providerInfo.lookupOptions,
				{
					controller: ['_', '$scope', '$window', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', 'basicsLookupdataLookupDescriptorService', '$translate',
						function (_, $scope, $window, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate) {

							let getPhoneImage = function () {
								let imgPos = globals.telephoneScheme.css.indexOf('ico-phone');
								return globals.telephoneScheme.css.substring(imgPos);
							};

							let executeEmail = function (/* event, editValue */) {
								let bpEntity = $scope.$$childTail.displayItem;
								if (bpEntity?.Email) {
									$window.location.href = 'mailto:' + bpEntity.Email;
								}
							};

							let executeTelephone = function () {
								let field = $scope.options.displayMember;
								let bpEntity = $scope.$$childTail.displayItem;
								if (bpEntity?.[field]) {
									let link = globals.telephoneScheme.scheme + ':' + bpEntity[field];
									if (globals.telephoneScheme.id === 2) {
										link += '?call';
									}
									$window.location.href = link;
								}
							};

							const lookupOptions = $scope.options ? $scope.options : $scope.lookupOptions;

							if (lookupOptions.displayMember === 'Email') {
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
							} else if ((lookupOptions.displayMember === 'TelephoneNumber1' || lookupOptions.displayMember === 'FaxNumber') && globals.telephoneScheme.id > 0) {
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

							businessPartnerDialogService.navigateToTeams(_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate);
						}],
					dataProvider: providerInfo.dataProvider,
					processData: providerInfo.processData
				});
		}
	]);

	angular.module(moduleName).directive('businessPartnerMainOptionalBusinessPartnerDialog', ['BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function (lookupDirectiveDefinition, businessPartnerDialogService) {
			const providerInfo = businessPartnerDialogService.createLookupOption();
			providerInfo.lookupOptions.showClearButton = true;
			return new lookupDirectiveDefinition('input-base',
				providerInfo.lookupOptions,
				{
					dataProvider: providerInfo.dataProvider,
					processData: providerInfo.processData
				});

		}
	]);

	angular.module(moduleName).directive('filterBusinessPartnerDialogLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function (lookupDirectiveDefinition, businessPartnerDialogService) {
			const providerInfo = businessPartnerDialogService.createLookupOption();
			return new lookupDirectiveDefinition('dialog-edit',
				providerInfo.lookupOptions,
				{
					controller: ['_', '$scope', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', 'basicsLookupdataLookupDescriptorService', '$translate',
						function (_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate) {
							businessPartnerDialogService.navigateToTeams(_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate);
						}],
					dataProvider: providerInfo.dataProvider,
					processData: providerInfo.processData
				});
		}]);

	angular.module(moduleName).directive('filterBusinessPartnerDialogBiddersLookup', ['$injector','BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function ($injector,lookupDirectiveDefinition, businessPartnerDialogService) {

			const providerInfo = businessPartnerDialogService.createLookupOption();
			providerInfo.lookupOptions.dynamicLookupMode = true;
			providerInfo.lookupOptions.dynamicDisplayMember = 'BpName1';
			providerInfo.lookupOptions.events = [
				{
					name: 'onSelectedItemChanged',
					handler: function (e, args) {
						if (args.entity) {
							let validateService;
							if (args.entity.ModuleName === 'Package2ExtBidder') {
								let loadRes = $injector.get('procurementPackage2ExtBidderService').loadControllerInitData();
								validateService = loadRes.validationService;
							} else {
								let dataService = $injector.get('procurementCommonSuggestedBiddersDataService').getService();
								validateService = $injector.get('procurementCommonSuggestedBiddersValidationService')(dataService);
							}

							args.entity.IsValidateBpName1 = false;
							if (args.selectedItem) {
								args.entity.BusinessPartnerFk = args.selectedItem.Id;
								if (args.entity.BpName1 === args.selectedItem.BusinessPartnerName1) {
									args.entity.IsValidateBpName1 = true;
								}
							} else {
								args.entity.BusinessPartnerFk = null;
							}
							validateService.validateBusinessPartnerFk(args.entity, args.entity.BusinessPartnerFk, 'BusinessPartnerFk');
						}
					}
				}
			];
			return new lookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions, {
				controller: ['_', '$scope', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', 'basicsLookupdataLookupDescriptorService', '$translate',
					function (_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate) {
						businessPartnerDialogService.navigateToTeams(_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate);
					}],
				dataProvider: providerInfo.dataProvider,
				processData: providerInfo.processData
			});

		}]);

	angular.module(moduleName).directive('businessPartnerMainBusinessPartnerStatusLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function (lookupDirectiveDefinition, businessPartnerDialogService) {
			let defaults = {
				lookupType: 'BusinessPartner',
				valueMember: 'Id',
				displayMember: 'StatusDescriptionTranslateInfo.Description',
				version: 3
			};

			return new lookupDirectiveDefinition('combobox-edit', defaults, {
				controller: ['_', '$scope', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', 'basicsLookupdataLookupDescriptorService', '$translate',
					function (_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate) {
						businessPartnerDialogService.navigateToTeams(_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate);
					}]
			});

		}]);

})(angular, globals);
