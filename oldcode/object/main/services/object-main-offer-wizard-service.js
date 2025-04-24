(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name objectMainOfferWizardService
	 * @description
	 *
	 * @example
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('object.main').factory('objectMainOfferWizardService',
		['$injector', '$translate', '$http', 'moment', 'platformTranslateService', 'platformModalService', 'platformModalFormConfigService',
			'basicsLookupdataLookupFilterService', 'objectMainUnitService', 'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsClerkUtilitiesService',
			'objectMainProspectService', 'platformModuleNavigationService','objectMainUnitInstallmentDataService',
			function ($injector, $translate, $http, moment, platformTranslateService, platformModalService, platformModalFormConfigService,
				basicsLookupdataLookupFilterService, objectMainUnitService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsClerkUtilitiesService,
				objectMainProspectService, platformModuleNavigationService, objectMainUnitInstallmentDataService) {

				let serviceContainer = {data: {}, service: {}};

				serviceContainer.service.createObjectUnitOffer = function createObjectUnitOffer() {
					let title = $translate.instant('object.main.titelObjectUnitOffer');
					let selectedMainUnitService = objectMainUnitService.getSelected();
					let selectedMainProspectService = objectMainProspectService.getSelected();
					let UnitInstallment = objectMainUnitInstallmentDataService.getSelected();
					let handleOK = function (postUploadfunction) {
						return function (result) {
							$http.post(globals.webApiBaseUrl + 'object/main/unit/execute', result.data)
								.then(function (response) {
										$injector.get('objectMainAffectedByObjectDataServiceFactory').takeNewItem(response.data.SalesBidToSave[0], 'BidHeaderDto');
										postUploadfunction(response);

										let myDialogOptions = {
											headerTextKey: title,
											bodyTextKey: 'object.main.wizardOfferBodyText',
											iconClass: 'ico-info',
											showOkButton: true,
											customButtons: [{
												id: 'goTo',
												cssClass: 'tlb-icons ico-goto border-none',
												fn: function (button, event, closeFn) {
													let item = response.data.SalesBidToSave[0];
													let navigatorConf = {
														moduleName: 'sales.bid'
													};
													platformModuleNavigationService.navigate(navigatorConf, item, 'Id');
													closeFn();
												}
											}]
										};

										platformModalService.showDialog(myDialogOptions);

									},
									function (/*error*/) {
									});
						};
					};

					let validationCheck = function validationCheck(objectUnitOffer) {
						return objectUnitOffer.Code === '' || objectUnitOffer.ClerkFk === null ||
							objectUnitOffer.ContractTypeFk === null || objectUnitOffer.QuoteDate === null;
					};
					if (selectedMainProspectService && selectedMainProspectService.Id) {
						let action = 1;
						let nowDate = moment.utc();
						// user id -> clerk
						let userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1);

						let modalCreateOfferConfig = {
							title: title,
							dataItem: {
								Action: action,
								ObjectUnitOffer: {
									ProjectFk: selectedMainUnitService.Header.ProjectFk,
									BusinesspartnerFk: selectedMainProspectService.BusinessPartnerFk,
									SubsidiaryFk: selectedMainProspectService.SubsidiaryFk,
									CustomerFk: selectedMainProspectService.CustomerFk,
									QuoteDate: nowDate,
									DescriptionInfo: {
										Translated: selectedMainUnitService.Description
									},
									ObjUnitFk: selectedMainUnitService.Id,
									//CurrencyFk: selectedMainUnitService.Header.Project.CurrencyFk,
									StructureType: 1,    // see salesBidCreateBidWizardDialogService: defaults

									//for necessary disableOkButton
									Code: '',
									ExchangeRate: 0,
									ClerkFk: null,
									ContractTypeFk: null,
									Price: selectedMainUnitService.Price,
									TaxCodeFk:selectedMainUnitService.TaxCodeFk
								}
							},
							formConfiguration: {
								fid: 'object.main.DescriptionInfoModal',
								version: '0.2.4',
								showGrouping: false,
								groups: [
									{
										gid: 'baseGroup',
										attributes: ['ObjectUnitOffer.Code', 'ObjectUnitOffer.QuoteDate',
											'ObjectUnitOffer.ClerkFk', 'ObjectUnitOffer.ContractTypeFk']
									}
								],
								rows: [
									{
										gid: 'baseGroup',
										rid: 'Code',
										model: 'ObjectUnitOffer.Code',
										label$tr$: 'cloud.common.entityCode',
										type: 'code',
										sortOrder: 1,
										required: true
									},
									{
										gid: 'baseGroup',
										rid: 'ClerkFk',
										model: 'ObjectUnitOffer.ClerkFk',
										label$tr$: 'sales.common.entityClerkFk',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'cloud-clerk-clerk-dialog',
											descriptionMember: 'Description',
											lookupOptions: {
												showClearButton: false
											}
										},
										sortOrder: 11,
										required: true
									},
									basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('project.main.contracttype', 'Description', {
										gid: 'baseGroup',
										rid: 'ContractTypeFk',
										model: 'ObjectUnitOffer.ContractTypeFk',
										label$tr$: 'sales.common.entityContracttypeFk',
										sortOrder: 14,
										required: true
									})
								]
							},
							dialogOptions: {},
							handleOK: handleOK(function () {
								// Load successful
							})
						};

						if (!_.isNil(UnitInstallment)) {
							modalCreateOfferConfig.dataItem.UnitInstallment = [];
							modalCreateOfferConfig.dataItem.UnitInstallment.push(UnitInstallment);

							basicsClerkUtilitiesService.getClerkByUserId(userId).then(function (clerk) {
								modalCreateOfferConfig.dataItem.ObjectUnitOffer.ClerkFk = clerk && clerk.IsLive ? clerk.Id : 0;
							});

							modalCreateOfferConfig.dialogOptions.disableOkButton = function disableOkButtonForOffer() {
								return validationCheck(modalCreateOfferConfig.dataItem.ObjectUnitOffer);
							};
							platformTranslateService.translateFormConfig(modalCreateOfferConfig.formConfiguration);
							platformModalFormConfigService.showDialog(modalCreateOfferConfig);
						}else {
							let modalOptions = {
								headerText: $translate.instant(title),
								bodyText: $translate.instant('object.main.selectInstallationAgreement'),
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
						}
					} else {
						//Error MessageText
						let modalOptions = {
							headerText: $translate.instant(title),
							bodyText: $translate.instant('object.main.noCurrentProspectSelection'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				};

				return serviceContainer.service;
			}
		]);
})(angular);
