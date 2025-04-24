/**
 * Created by lcn on 11/22/2024.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainBusinessPartnerDialogService',
		['$injector', '$state', '$q', 'basicsLookupdataLookupDataService',
			'BasicsLookupdataLookupDirectiveDefinition', 'BasicsCommonDateProcessor', 'filterBusinessPartnerDialogFields',
			function ($injector, $state, $q, lookupDataService, BasicsLookupdataLookupDirectiveDefinition, BasicsCommonDateProcessor, dialogFields) {

				return {
					createLookupOption: createLookupOption,
					navigateToTeams: navigateToTeams
				};

				function createLookupOption(showTeams, fields) {
					const resolve = {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {
							return platformSchemaService.getSchemas([
								{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'GuarantorDto', moduleSubModule: 'BusinessPartner.Main'}
							]);
						}]
					};
					const openAddDialogFn = function ($injector, entity, settings) {
						let $q = $injector.get('$q');
						let defer = $q.defer();
						let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
						let platformTranslateService = $injector.get('platformTranslateService')

						function getCreateBusinessPartnerFormConfig() {
							let bpUiLayout = $injector.get('businessPartnerMainBusinessPartnerUIStandardService');
							let contactUiLayout = $injector.get('businessPartnerMainContactUIStandardService');
							let bpRows = [];
							let bpForm = platformTranslateService.translateFormConfig(bpUiLayout.getStandardConfigForDetailView());
							_.forEach(angular.copy(bpForm.rows), function (row) {
								if (row.rid === 'email') {
									row.model = 'BusinessPartnerEmail';
									row.sortOrder = 3;
								}
								if (row.rid === 'address') {
									row.required = true;
									row.sortOrder = 1;
								}
								if (row.rid === 'businesspartnername1') {
									row.sortOrder = 0;
								}
								if (row.rid === 'telephone') {
									row.sortOrder = 2;
								}
								if (row.rid === 'businesspartnername1' || row.rid === 'email' || row.rid === 'address' || row.rid === 'telephone') {
									row.gid = 'baseGroup';
									row.readonly = false;
									bpRows.push(row);
								}
							});
							let contactRows = [];
							_.forEach(angular.copy(contactUiLayout.getStandardConfigForDetailView().rows), function (row) {
								if (row.rid === 'email') {
									row.model = 'ContactEmail';
									row.label$tr$ = 'businesspartner.main.contactEmail';
									row.sortOrder = 6;
								}
								if (row.rid === 'firstname') {
									row.sortOrder = 4;
									row.navigator = null;
								}
								if (row.rid === 'familyname') {
									row.sortOrder = 5;
									row.navigator = null;
								}
								if (row.rid === 'telephonenumberdescriptor') {
									row.label$tr$ = 'businesspartner.main.contactTelephone';
									row.sortOrder = 6;
								}
								if (row.rid === 'firstname' || row.rid === 'email' || row.rid === 'telephonenumberdescriptor' || row.rid === 'familyname') {
									row.gid = 'baseGroup';
									row.readonly = false;
									contactRows.push(row);
								}
							});
							let contactConfig = {rows: contactRows};
							contactConfig = platformTranslateService.translateFormConfig(contactConfig);
							contactRows = contactConfig.rows;
							let conf = {
								fid: 'businesspartner.main.createBusinessPartner',
								version: '1.0.0',
								showGrouping: false,
								groups: [{
									gid: 'baseGroup',
									attributes: []
								}],
								rows: _.concat(bpRows, contactRows),
								addValidationAutomatically: true
							};
							return conf;
						}

						let bpValidateService = angular.copy($injector.get('businesspartnerMainHeaderValidationService'));
						bpValidateService.asyncValidateSubsidiaryDescriptor$AddressDto = function validateBusinessPartnerAddress(entity, value, model) {
							let result = {apply: true, valid: true};
							if (angular.isUndefined(value) || value === null || value === -1 || _.isEmpty(value)) { //value.trim() === ''
								result.valid = false;
								result.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
								result.error$tr$param$ = {
									fieldName: $injector.get('$translate').instant('cloud.common.entityAddress')
								};
							}
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							entity.SubsidiaryDescriptor.AddressDto = value;
							return result;
						};
						let dataItem = {
							ContactEmail: '',
							FirstName: '',
							FamilyName: '',
							TelephoneNumberDescriptor: '',
							BusinessPartnerEmail: '',
							BusinessPartnerName1: '',
							SubsidiaryDescriptor: {
								AddressDto: '',
								TelephoneNumber1Dto: ''
							}
						};
						bpValidateService.validateBusinessPartnerName1(dataItem, null, 'BusinessPartnerName1');
						bpValidateService.asyncValidateSubsidiaryDescriptor$AddressDto(dataItem, '', 'SubsidiaryDescriptor.AddressDto');
						let platformModalFormConfigService = $injector.get('platformModalFormConfigService');
						let modalCreateProjectConfig = {
							title: 'Create Businesspartner',
							resizeable: true,
							dataItem: dataItem,
							formConfiguration: getCreateBusinessPartnerFormConfig(),
							validationService: bpValidateService,
							handleOK: function handleOK(result) {
								let $http = $injector.get('$http');
								$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/createbpinadddialog', result.data)
									.then(function (res) {
										res.data.main.BasCommunicationChannelFk = res.data.main.CommunicationChannelFk;
										entity.ContactFk = res.data.contact.Id;
										entity.Email = res.data.contact.Email;
										entity.ContactTel1 = res.data.contact.TelephoneNumberItem !== null ? res.data.contact.TelephoneNumberItem.Telephone : null;
										entity.SubsidiaryFromBpDialog = false;
										entity.SubsidiaryFk = res.data.subsidiary.Id;
										entity.SupplierFk = null;
										entity.SupplierDescription = null;
										entity.BpEmailFk = res.data.main.Id;
										entity.ContactEmailFk = res.data.contact.Id;
										$injector.get('procurementRfqBusinessPartnerService').markItemAsModified(entity);
										defer.resolve(res.data.main);
									});
							},
							dialogOptions: {
								disableOkButton: function () {
									let result = false;
									getCreateBusinessPartnerFormConfig().rows.forEach(function (r) {
										let hasFieldError = platformRuntimeDataService.hasError(modalCreateProjectConfig.dataItem, r.model);
										if (hasFieldError) {
											result = true;
										}
									});
									return result;
								}
							}
						};
						platformModalFormConfigService.showDialog(modalCreateProjectConfig);
						return defer.promise;
					};
					showTeams = showTeams || true;
					dialogFields = fields || dialogFields;
					let defaults = {
						version: 3,
						uuid: 'a3cac64f52af43beb1b7a32d127531bd',
						lookupType: 'BusinessPartner',
						valueMember: 'Id',
						displayMember: 'BusinessPartnerName1',
						maxWidth: '90%',
						maxHeight: '90%',
						width: '1120px',
						height: '697px',
						dataProcessor: [],
						columns: dialogFields,
						title: {name: 'Assign Business Partner', name$tr$: 'cloud.common.dialogTitleBusinessPartner'},
						pageOptions: {
							enabled: true,
							size: 100
						},
						dialogOptions: {
							id: '000af9b0abd14af8b594f45800ae99de',
							width: '90%',
							height: '90%',
							minHeight: '585px',
							template: '',
							resizeable: true,
							templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/filter-business-partner-dialog.html',
							resolve: showTeams ? resolve : {},
						},
						disableDataCaching: true,
						resizeable: true,
						buildSearchString: function (searchValue) {
							if (!searchValue) {
								return '';
							}
							var searchString = 'Code.Contains("%SEARCH%") Or TradeName.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
							return searchString.replace(/%SEARCH%/g, searchValue);
						},
						createOptions: {
							initCreateData: function (createData, entity) {

							},
							handleCreateSuccess: function (createItem/* , entity */) {
								return createItem;
							},
							handleCreateSuccessAsync: function ($injector/* , createItem, entity */) {
								return $injector.get('$q').when(true);
							},
							extendDisplayFields: function (fields/* , entity */) {
								return fields;
							}
						},
						openAddDialogFn: showTeams ? openAddDialogFn : function () {
						},
					};
					let defaultDataProvider = lookupDataService.registerDataProviderByType(defaults.lookupType);
					return {
						lookupOptions: defaults,
						dataProvider: {
							getSearchList: function (searchRequest, options, curScope) {
								if (!angular.isObject(searchRequest)) {
									return $q.when([]);
								}

								searchRequest.AdditionalParameters = searchRequest.AdditionalParameters || {};
								searchRequest.AdditionalParameters.ModuleName = getModuleName($state.current);
								return defaultDataProvider.getSearchList(searchRequest, options, curScope);
							},
							getItemByKey: function getItemByKey(value, options, scope) {
								return defaultDataProvider.getItemByKey(value, options, scope);
							}
						},
						processData: function (dataList) {
							const dateProcessor = new BasicsCommonDateProcessor(['CraftcooperativeDate', 'TradeRegisterDate', 'Updated', 'Inserted']);
							_.forEach(dataList, function (item) {
								dateProcessor.processItem(item);
							});
							return dataList;
						}
					};
				}

				function getModuleName(state) {
					const urlPath = state.url.split('/');
					return urlPath[0] !== '^' ? urlPath[1] : `${urlPath[1]}.${urlPath[2]}`;
				}

				function navigateToTeams(_, $scope, $element, cloudDesktopTeamsManagementService, platformModalService, basicsLookupdataLookupDescriptorService, $translate) {
					var lookupDescriptorService = basicsLookupdataLookupDescriptorService;

					var readOnly = false;  // true -> read only -> nothing to do
					if ($element[0] && $element[0].attributes && $element[0].attributes['data-readonly']) {
						readOnly = $element[0].attributes['data-readonly'].value === 'true';
					}

					if (!readOnly) {
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

							var isTextEditable = false;
							if ($scope.lookupOptions && $scope.lookupOptions.isTextEditable) {
								isTextEditable = $scope.lookupOptions.isTextEditable;
							}
							if (isTextEditable && $scope.entity) { // if isTextEditable is true, displayItem is null.
								var businessPartnerID = $scope.entity.BusinessPartnerFk;
								var displayItems = getBusinessPartnerData(businessPartnerID);
								displayItems.forEach(function (entity) {
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
								var msg = $translate.instant('basics.clerk.teams.bpHasNoEmail');
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

							var isTextEditable = false;
							if ($scope.lookupOptions && $scope.lookupOptions.isTextEditable) {
								isTextEditable = $scope.lookupOptions.isTextEditable;
							}

							if (isTextEditable && $scope.entity) { // if isTextEditable is true, displayItem is null.
								var businessPartnerID = $scope.entity.BusinessPartnerFk;
								var displayItems = getBusinessPartnerData(businessPartnerID);
								for (var entity of displayItems) {
									if (entity.Email) {
										return true;
									}
								}
							}

							var selectedEntitys = $scope.$$childTail.selectedItems;
							if (selectedEntitys) { // if selectedEntitys is defined, displayItem must be defined.
								for (var entity of selectedEntitys) {
									if (entity.Email) {
										return true;
									}
								}
								return false;
							} else { // if selectedEntitys is not defined, displayItem may be defined
								return $scope.$$childTail.displayItem && $scope.$$childTail.displayItem.Email;
							}
						};

						if (cloudDesktopTeamsManagementService.enableTeamsChatNavigation) {
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
					}

					function getBusinessPartnerData(businessPartnerId) {
						if (!businessPartnerId) {
							return [];
						}
						let item = lookupDescriptorService.getLookupItem('BusinessPartner', businessPartnerId); // get from cache firstly.
						if (!item) { // if no cache, get from server and store it to cache.
							lookupDescriptorService.loadItemByKey('BusinessPartner', businessPartnerId)
								.then(function (data) {
									if (data) {
										item = data;
									}
								});
						}
						return item ? [item] : [];
					}
				}
			}
		]);

})(angular, globals);