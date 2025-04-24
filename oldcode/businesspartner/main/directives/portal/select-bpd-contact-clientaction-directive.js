// eslint-disable-next-line no-redeclare
/* globals angular,globals */
(function () {
		'use strict';

		function businessPartnerSelectBpdContactClientActionDirective($q, $injector, $translate, _, cloudDesktopSidebarService, $state, platformModuleStateService,
			basicsWorkflowModuleUtilService, platformTranslateService, platformModalFormConfigService, basicsWorkflowClientActionUtilService) {
			var bizPartnerMainModuleName = 'businesspartner.main';
			var bizPartnerContactSubModuleName = 'businesspartner.contact';
			var bizPartnerContactSubServiceName = 'businesspartner.contact';
			var contactCreationPendingorDone = false;
			return {
				restrict: 'A',
				require: 'ngModel',
				compile: function () {
					return {
						pre: preLink,
						post: postLink
					};
				},
				templateUrl: 'businesspartner.main/templates/portal-select-bpd-contact.html'
			};

			function preLink(scope /* , iElement, attrs, ngModelCtrl */) {

				scope.parameterInvalid = false;

				// prepare scope data, must be palced here !!!
				scope.data = {};
				scope.portalAccessGroupOptions = {
					displayMember: 'DisplayInfo', valueMember: 'Id',
					items: [],
					watchItems: true
				};
				// contact will be set with cuurrent selection from ....
				scope.selectedContact = {fullname: undefined, email: undefined};

			}

			/**
			 *
			 * @param scope
			 * @param iElement
			 * @param attrs
			 * @param ngModelCtrl
			 */
			function postLink(scope, iElement, attrs, ngModelCtrl) {
				// var contactId = {key: 'ContactId', value: 0};
				// var portalAccessGroupId = {key: 'PortalAccessGroupId', value: 0};
				// var output = [contactId, portalAccessGroupId];

				var inputPar1 = 'User.Ext.Provider.Entity';
				var inputPar2 = 'PortalAccessGroupList';
				var outputPar1 = 'ContactId';
				var outputPar2 = 'PortalAccessGroupId';
				var outputPar3 = 'Context';

				function validateParams(response) {
					// validate input and output parameters
					var valid = true;
					var errMsg = [];
					if (response.task.input) {
						if (response.task.input[0] && response.task.input[1]) {
							if (!((response.task.input[0].key === inputPar1) && _.isString(response.task.input[0].value))) {
								errMsg.push('Parameter: ' + inputPar1 + ' is missing or having none valid value');
								valid = false;
							}
							if (!((response.task.input[1].key === inputPar2) && _.isString(response.task.input[1].value))) {
								errMsg.push('Parameter: ' + inputPar2 + ' is missing or having no entries (array required)');
								valid = false;
							}
						} else {
							errMsg.push('not Input Parameters found');
							valid = false;
						}
						if (response.task.output[0] && response.task.output[1]) {

							if (!((response.task.output[0].key === outputPar1) && _.isString(response.task.output[0].value))) {
								errMsg.push('Output Parameter: ' + outputPar1 + ' is missing, required destination definition');
								valid = false;
							}
							if (!((response.task.output[1].key === outputPar2) && _.isString(response.task.output[1].value))) {
								errMsg.push('Output Parameter: ' + outputPar2 + ' is missing, required destination definition');
								valid = false;
							}
							if ((response.task.output[2].key !== outputPar3)) {
								errMsg.push('Output Parameter: ' + outputPar3 + ' is missing, required destination definition');
								valid = false;
							}
						} else {
							errMsg.push('not Output Parameters found');
							valid = false;
						}
					} else {
						errMsg.push('not Parameters found');
						valid = false;
					}
					return {valid: valid, error: _.join(errMsg, '<br>')};
				}

				/**
				 *
				 */
				ngModelCtrl.$render = async function () {
					await basicsWorkflowClientActionUtilService.initScope(scope, ngModelCtrl);
					// save ngmodel into scope
					scope.response = ngModelCtrl.$viewValue;

					// validate input and output parameters
					var validated = validateParams(scope.response);

					if (!validated.valid) {
						scope.parameterInvalid = true;
						scope.parameterInvalidInfo = validated;
						return;
					}

					// param1 'User.Ext.Provider.Entity') {
					scope.data.extProviderInfo = JSON.parse(scope.response.task.input[0].value);
					// param2 'PortalAccessGroupList'
					scope.portalAccessGroupOptions.items = JSON.parse(scope.response.task.input[1].value);

					// select first item if not already selected
					if (scope.portalAccessGroupOptions.items && !scope.data.extProviderInfo.FrmPortalUserGroupFk) {
						scope.data.extProviderInfo.FrmPortalUserGroupFk = scope.portalAccessGroupOptions.items[0].Id;
					}
					// set default PortalAccessGroupId
					setPortalAccessGroupIdtoOutput(scope.data.extProviderInfo.FrmPortalUserGroupFk);
				};

				/**
				 * Update contactId Output variable with latest value
				 */
				function setContactIdtoOutput(selContactId) {

					// scope.response.Context[scope.response.task.output[0].value] = selContactId;
					// very strange, ask Chris Knickenberg why
					if (!Object.prototype.hasOwnProperty.call(scope.response.Context, 'Context')) {
						scope.response.Context.Context = {};
					}
					scope.response.Context.Context[scope.response.task.output[0].value] = selContactId;

				}

				/**
				 * Update contactId Output variable with latest value
				 */
				function setPortalAccessGroupIdtoOutput(selPortalAccessGroupId) {

					// scope.response.Context[scope.response.task.output[1].value] = selPortalAccessGroupId;
					// very strange, ask Chris Knickenberg why
					if (!Object.prototype.hasOwnProperty.call(scope.response.Context, 'Context')) {
						scope.response.Context.Context = {};
					}
					scope.response.Context.Context[scope.response.task.output[1].value] = selPortalAccessGroupId;
				}

				/**
				 * navigate to business partner module with company name as search filter
				 */
				scope.onStartBizPartnerModul = function onStartBizPartnerModul() {

					navigatetoModule({
						search: scope.data.extProviderInfo.CompanyName,
						moduleName: 'businesspartner.main'
					});
				};

				/**
				 *  navigate to business partner contact module with user name and etc. as search filter
				 */
				scope.onStartContactModul = function onStartContactModul() {
					navigatetoModule({
						search: scope.data.extProviderInfo.Email,
						// scope.data.extProviderInfo.Phone + ' ' +
						// scope.data.extProviderInfo.FamilyName,
						moduleName: 'businesspartner.contact'
					});
				};

				function isCurrentModuleNameEqual(expectedModuleName) {
					var currentState = $state.current;
					var stateModuleName = currentState.name.split('.')[1];
					if (stateModuleName === _.replace(expectedModuleName, '.', '')) {
						return true;
					}
					return false;
				}

				/**
				 * returns the select subitem from special module and submodule as object
				 * @param mainmodulename
				 * @param subServiceName
				 * @returns {*}
				 */
				function getSelectedItemObject(mainmodulename) {
					if (!isCurrentModuleNameEqual(mainmodulename)) {
						return null;
					}
					var moduleState = platformModuleStateService.state(mainmodulename);
					var selectedItem = null;
					// main entity selected ?
					if (moduleState.rootService && angular.isFunction(moduleState.rootService.getSelected)) {
						selectedItem = moduleState.rootService.getSelected();
					}
					return selectedItem;
				}

				/**
				 * returns the select subteim from special module and submodule as object
				 * @param mainmodulename
				 * @param subServiceName
				 * @returns {*}
				 */
				function getSelectedSubItemObject(mainmodulename, subServiceName) {
					if (!isCurrentModuleNameEqual(mainmodulename)) {
						return null;
					}
					var selectedSubItem = null;
					var moduleState = platformModuleStateService.state(mainmodulename);

					// main entity selected ?
					if (moduleState.rootService && angular.isFunction(moduleState.rootService.getSelected)) {
						var selectedItem = moduleState.rootService.getSelected();
						if (selectedItem) {
							var subModules = moduleState.rootService.getChildServices() || {};
							var theSubService = _.find(subModules, {'name': subServiceName});
							if (theSubService) {
								selectedSubItem = theSubService.getSelected();  // returns selected item
							}
						}
					}
					return selectedSubItem;
				}

				/**
				 *
				 * @returns {*}
				 */
				function getSelectedContact() {

					var selContact = getSelectedItemObject(bizPartnerContactSubModuleName);
					if (!selContact) {
						selContact = getSelectedSubItemObject(bizPartnerMainModuleName, bizPartnerContactSubServiceName);
					}
					return selContact;
				}

				/**
				 *
				 * @returns {*}
				 */
				function getSelectedBizPartner() {
					return getSelectedItemObject(bizPartnerMainModuleName);
				}

				scope.canLinkToContact = function () {
					var selContact = getSelectedContact();
					if (selContact && _.isNil(selContact.FrmUserExtProviderFk) && _.isString(selContact.Email) && selContact.Email.length > 0) {
						return true;
					}
					return false;
				};

				scope.onLinkSelContactModul = function onLinkSelContactModul() {
					var selContactItem = getSelectedContact();

					if (selContactItem && _.isNil(selContactItem.FrmUserExtProviderFk)) {
						var selContactId = selContactItem.Id;

						scope.selectedContact.fullname = _.trim((_.isNil(selContactItem.FirstName) ? '' : (selContactItem.FirstName + ' ')) + selContactItem.FamilyName);
						scope.selectedContact.email = selContactItem.Email;

						setContactIdtoOutput(selContactId);
					}
				};

				scope.canCreateContactToBpd = function () {
					if (contactCreationPendingorDone) {
						return false;
					}
					var bpd = getSelectedBizPartner();
					return (!!bpd);
				};

				/**
				 *
				 */
				function createContactviaDialog(scope) {
					// first inject all required services
					// var infoSvc = $injector.get('businesspartnerContactContainerInfoService');
					// var contactFormCfg = infoSvc.getContainerInfoByGuid('b732f04ccaa24375a410dbff7f294f70');  // read contact detail form ...

					var infoSvc = $injector.get('businesspartnerMainContainerInformationService');
					var contactFormCfg = infoSvc.getContainerInfoByGuid('2BEA71E2F2BF42EAA0EA2FC60F8F5615');  // read contact detail form ...

					var cfgSvc = $injector.get(contactFormCfg.standardConfigurationService);
					// var dataSvc = $injector.get(contactFormCfg.dataServiceName);
					scope.dataSvc = $injector.get(contactFormCfg.dataServiceName);
					// var stdContactConfig = cfgSvc.standardConfigurationService();
					var stdContactConfig = cfgSvc.getStandardConfigForDetailView();

					var platformContextServices = $injector.get('platformContextService');
					// var telefonSvc = $injector.get('basicsCommonTelephoneService');
					// var addressSvc = $injector.get('basicsCommonAddressService');
					var modalCreateContactConfig = {
						title: $translate.instant('businesspartner.main.contactFormContainerTitle'), // project.main.createProjectTitle'),
						resizeable: true,
						formConfiguration: stdContactConfig,
						handleOK: function handleOK(/* result */) {// result not used
							// var newProject = result.data;
							scope.dataSvc.parentService().update(); // save new contact via the update() method
						}
					};

					// prepare initialization data here
					var contact = scope.data.extProviderInfo;
					var bpd = getSelectedBizPartner();
					var createContactWithAddressPhone = {
						ContactDto: {
							FamilyName: contact.FamilyName, // items 'Kupferbein';
							FirstName: contact.FirstName, // 'Rolf';
							Email: contact.Email,
							CompanyFk: platformContextServices.clientId,  // read company id
							BusinessPartnerFk: bpd.Id,
							CountryFk: scope.data.extProviderInfo.countryFk
						},
						PhoneDto: {
							CountryId: scope.data.extProviderInfo.BasCountryFk,
							Pattern: scope.data.extProviderInfo.Phone,
							PlainPhone: undefined
						},
						AddressDto: {
							CountryId: scope.data.extProviderInfo.BasCountryFk,
							Street: scope.data.extProviderInfo.Street,
							ZipCode: scope.data.extProviderInfo.ZipCode,
							City: scope.data.extProviderInfo.City
						}
					};
					// call standard createItem factory method, with initalization data as object
					// overload >>>initCreationData: function (creationData, svcData, creationOptions)  required to handle this parameters
					//                see contact-data-service
					return scope.dataSvc.createItem(createContactWithAddressPhone).then(function (result) {

							modalCreateContactConfig.dataItem = result;
							// Contact  item  property relevant for use  here
							// AddressDescriptor: null AddressFk:null BasCommunicationchannelFk:null BirthDate:null
							// BusinessPartnerFk:0 Children:null ClerkResponsibleFk:null ompanyFk:1
							// CountryFk: null Email: null FamilyName: null FirstName: null
							// FrmUserExtProviderFk:null Id: 1000511 IdentityProviderName:null Initials: null
							// InsertedAt:"0001-01-01T00:00:00Z" InsertedBy:0  Internet:null
							// IsDefault: false IsLive: true TelephoneNumberDescriptor: null TelephoneNumberFk: null
							// Title:null TitleFk:3
							platformTranslateService.translateFormConfig(modalCreateContactConfig.formConfiguration);

							return platformModalFormConfigService.showDialog(modalCreateContactConfig).then(function (data) {
									if (data && data.ok === true) {
										// console.log(data);
										return $q.when(data);
									}
									if (data === false) {
										scope.dataSvc.deleteItem(modalCreateContactConfig.dataItem);  // delete not used item
										return $q.reject(result);
									}
								}
							);
						},
						function error(result) {
							var modalsvc = $injector.get('platformModalService');
							modalsvc.showErrorBox('Sorry creation failed! I am not able to create a Contact from the current data', 'Contact creation failed!');
						});

				}

				scope.onCreateContacttoBpd = function onCreateContacttoBpd() {
					var bpd = getSelectedBizPartner();
					if (bpd) {
						// we're trying to host the contact details container in dialog and preserve values from the contact fields.
						// and attach the contact to the business partner
						contactCreationPendingorDone = true;
						createContactviaDialog(scope).then(
							function ok(data) {
								contactCreationPendingorDone = false; // reenable creation button
								scope.onLinkSelContactModul();        // we link this new created contact to the new contact
								return $q.when(data);
							},/**/
							function notOk(result) {
								contactCreationPendingorDone = false; // reenable creation button
								return $q.reject(result);
							});
					}
				};

				/**
				 * Update PortalAccessGroupId Output variable with latest value
				 */
				scope.onChangePortalAccessGroup = function onChangePortalAccessGroup() {

					setPortalAccessGroupIdtoOutput(scope.data.extProviderInfo.FrmPortalUserGroupFk);

				};

				var startsWith = function (self, str) {
					return self.substring(0, str.length) === str;
				};

				/**
				 * @TODO move to  sidebarservice for general usage
				 * @param lo Object { modulename, search }
				 */
				function navigatetoModule(lo) {
					var url = globals.defaultState + '.' + lo.moduleName.replace('.', '');

					if ($state.current && startsWith($state.current.name, url)) {
						cloudDesktopSidebarService.filterSearchFromPattern(lo.search);
					} else {
						try {
							cloudDesktopSidebarService.setStartupFilter({filter: lo.search});
							$state.go(url).then(function () {
								_.noop();
							});
						} catch (ex) {
							cloudDesktopSidebarService.removeStartupFilter();
							throw new Error('Navigate to module ' + url + ' failed');
						}
					}
				}

				scope.$watch(function () {
					return scope.response;
				}, function (newVal, oldVal) {
					if (newVal && newVal !== oldVal) {
						ngModelCtrl.$setViewValue(scope.response);
					}
				}, true);
			}
		}

		businessPartnerSelectBpdContactClientActionDirective.$inject = ['$q', '$injector', '$translate', '_', 'cloudDesktopSidebarService', '$state', 'platformModuleStateService',
			'basicsWorkflowModuleUtilService', 'platformTranslateService', 'platformModalFormConfigService', 'basicsWorkflowClientActionUtilService'];
		angular.module('businesspartner.main')
			.directive('businessPartnerSelectBpdContactClientActionDirective', businessPartnerSelectBpdContactClientActionDirective);

	}

)(angular);
