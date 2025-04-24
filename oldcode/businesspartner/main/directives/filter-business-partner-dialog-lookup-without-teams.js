/**
 * Created by lcn on 4/8/2019.
 */
// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).directive('businessPartnerMainBusinessPartnerDialogWithoutTeams', ['BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function (lookupDirectiveDefinition, businessPartnerDialogService) {
			const providerInfo = businessPartnerDialogService.createLookupOption(false);
			return new lookupDirectiveDefinition('dialog-edit',
				providerInfo.lookupOptions,
				{
					controller: ['$scope', '$window', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', '$translate',
						function ($scope, $window, $element, cloudDesktopTeamsManagementService, platformModalService, $translate) {

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
							} else if (($scope.options.displayMember === 'TelephoneNumber1' || $scope.options.displayMember === 'FaxNumber') && globals.telephoneScheme.id > 0) {
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
						}],
					dataProvider: providerInfo.dataProvider,
					processData: providerInfo.processData
				});
		}
	]);

	angular.module(moduleName).directive('filterBusinessPartnerDialogLookupWithoutTeams', ['BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function (lookupDirectiveDefinition, businessPartnerDialogService) {
			const providerInfo = businessPartnerDialogService.createLookupOption(false);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit',
				providerInfo.lookupOptions,
				{
					dataProvider: providerInfo.dataProvider,
					processData: providerInfo.processData
				});

		}]);

	angular.module(moduleName).directive('filterBusinessPartnerDialogBiddersLookupWithoutTeams', ['$injector','BasicsLookupdataLookupDirectiveDefinition', 'businessPartnerMainBusinessPartnerDialogService',
		function ($injector,lookupDirectiveDefinition, businessPartnerDialogService) {

			const providerInfo = businessPartnerDialogService.createLookupOption(false);
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
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit',
				providerInfo.lookupOptions,
				{
					dataProvider: providerInfo.dataProvider,
					processData: providerInfo.processData
				});
		}]);

	angular.module(moduleName).directive('businessPartnerMainBusinessPartnerStatusLookupWithoutTeams', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'BusinessPartner',
				valueMember: 'Id',
				displayMember: 'StatusDescriptionTranslateInfo.Description',
				version: 3
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

		}]);

})(angular, globals);
