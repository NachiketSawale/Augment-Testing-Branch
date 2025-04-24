/**
 * Created by rei on 09.02.2016.
 global console
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/**
	 *
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainBeserveService', businesspartnerMainBeserveService);

	businesspartnerMainBeserveService.$inject = ['_', '$q', '$http', '$translate', 'platformModalService', 'platformContextService', 'platformTranslateService',
		'permissions', 'platformPermissionService', 'cloudDesktopSidebarService', '$injector'];

	function businesspartnerMainBeserveService(_, $q, $http, $translate, platformModalService, platformContextService, platformTranslateService, permissions, platformPermissionService, cloudDesktopSidebarService,
		$injector) { // jshint ignore:line
		// all method support by this service listed here

		var crefoPermissionDescriptorAddUpdateSingle = 'db75fac8500a42e185261eaf95ae946e';
		var crefoPermissionDescriptorUpdateMultiple = '55d7d07357f34cf18fb7b9d87b5e2181';
		var hasAddUpdateSingle = false;
		var hasUpdateMultiple = false;

		var crefoBaseUrl = globals.webApiBaseUrl + 'businesspartner/main/beserve/';

		var historicalBedirectNo = 100000000;
		var lastresponseData;

		var initServiceDone = false;

		/**
		 * @description loads all  permission from backend and check for add/update crefo bedirect stuff
		 */
		function loadPermissions() {

			hasAddUpdateSingle = platformPermissionService.has(crefoPermissionDescriptorAddUpdateSingle, permissions.execute);
			hasUpdateMultiple = platformPermissionService.has(crefoPermissionDescriptorUpdateMultiple, permissions.execute);

			return $q.when(true);
		}

		function hasAddUpdateAccess() {
			return hasAddUpdateSingle;
		}

		function hasMultipleUpdateAccess() {
			return hasUpdateMultiple;
		}

		/**
		 * @constructor
		 */
		function CrefoSearchParams(init) {
			this.clear = function () {
				this.name = '';
				this.location = '';
				this.street = '';
				this.zipcode = '';
				this.areacode = '';
				this.phoneno = '';
				this.query = '';
			};

			this.validate = function () {
				// insert wildcard for phonenumber when only Prefix is set
				if (this.areacode && this.areacode.length > 0) {
					if (!this.phoneno || this.phoneno.Length === 0) {
						this.phoneno = '*';
					}
				}
			};

			this.clear();
			if (init) {
				// noinspection JSUnusedAssignment
				// eslint-disable-next-line no-unused-vars
				var self = this;
				// noinspection JSUnusedAssignment
				// eslint-disable-next-line no-unused-vars
				self = _.assign(this, init);
			}
		}

		/**
		 *
		 */
		function addBusinessPartner() { // jshint ignore:line

			// businesspartnerMainHeaderDataService.updateAndExecute(function () {
			var dialogOption = {
				templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/beserveadd-dialog.html',
				controller: 'businesspartnerMainBeserveAddController',
				width: '930px',
				height: '600px',
				resizeable: true,
				onReturnButtonPress: _.noop()  // prevent firing an console.err in case of unhandled key enter press
			};
			return platformModalService.showDialog(dialogOption).then(function () {
			});

		}

		/**
		 *
		 * @returns {*}
		 */
		function showUpdateResult(updatedItems) {

			// noinspection JSUnresolvedVariable
			var updatedItemsParam = (updatedItems || {}).resultdata;
			var dialogOption = {
				templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/beserveresult-dialog.html',
				controller: 'businesspartnerMainBeserveResultController',
				resolve: {
					updatedItemsParam: function () {
						return updatedItemsParam;
					}
				},
				width: '900px', height: '450px', resizeable: true,
				onReturnButtonPress: _.noop()  // prevent firing an console.err in case of unhandled key enter press
			};
			return platformModalService.showDialog(dialogOption).then(function () {
			});
		}

		/**
		 * Update current selected or all business partner from Crefo,
		 * only those will be updated having a valid crefo number (bedirect No.)
		 * @param mainservice
		 * @param {boolean} singleSelection: if true only current item updated, else all
		 */
		function updateBusinessPartner(mainservice, singleSelection) {// jshint ignore:line
			var selectedItems, dialogheight = '500px', beDirectItems;
			if (singleSelection) {
				var items = mainservice.getSelected();
				selectedItems = items ? [items] : null;
				dialogheight = '300px'; // smaller if only one item it there
			} else {
				selectedItems = mainservice.getList();
			}

			if (selectedItems) {
				beDirectItems = _.filter(selectedItems, function (item) {
					return (_.isString(item.BedirektNo) && item.BedirektNo.length > 0);
					// return (_.isString(item.BedirektNo) && item.BedirektNo.length > 0) || (_.isString(item.CrefoNo) && item.CrefoNo.length > 0);
				});
			}
			if (!beDirectItems || beDirectItems.length === 0) {
				return platformModalService.showMsgBox(
					'businesspartner.main.crefoupdatedlg.nobpsfound',
					'businesspartner.main.crefoupdatedlg.updatetitle', 'warning').then(function () {
					_.noop();
				});
			}

			var dialogOption = {
				templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/beserveupdate-dialog.html',
				controller: 'businesspartnerMainBeserveUpdateController',
				resolve: {
					selectedItemsParam: function () {
						return beDirectItems;
					}
				},
				width: '900px', height: dialogheight, resizeable: true,
				onReturnButtonPress: _.noop()  // prevent firing an console.err in case of unhandled key enter press
			};

			return platformModalService.showDialog(dialogOption).then(function (result) {
				console.log(result);
				if (result.ok) {
					return showUpdateResult(result.updatedItems);
				}
			});
		}

		/**
		 *
		 */
		function validateCrefoBuyRequest(currentItem) {
			var result = {valid: true, target: null, assigned: false};
			if (currentItem.resulttype !== 3 /* historical */) {
				return result;
			}

			var nonHistoricalBedirectNo = currentItem.bedirectno - historicalBedirectNo;
			/** @namespace lastresponseData.resultdata */
			_.forEach(lastresponseData.resultdata, function (crefoRecord) {
				if (crefoRecord.bedirectno === nonHistoricalBedirectNo) {// string == int
					result.target = crefoRecord;
					result.valid = false;
				}
			});
			return result;
		}

		/**
		 * function formatAddress
		 * @param selectedItem
		 * @returns {*|Object}
		 */
		function formatAddress(selectedItem) {
			return platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.formattedAddressTemplate',
				{
					name: selectedItem.companyname,
					zipcode: selectedItem.zipcode,
					address: selectedItem.address,
					bedirectno: selectedItem.bedirectno
				});
		}

		/**
		 *
		 * @param selectedItemId
		 * @returns {boolean}
		 */
		function getSelectItemById(selectedItemId) {
			if (!_.isNumber(selectedItemId) && selectedItemId>0 && lastresponseData.resultdata) {
				return false;
			}
			var selectedItem = lastresponseData.resultdata[selectedItemId];
			if (!selectedItem) {
				return false;
			}
			return selectedItem;
		}

		/**
		 * we're going to buy this address from the crefo service
		 * @param selectedItems
		 * @param setLoadingCallback
		 */
		function bedirectUpdateSelectedItems(selectedItems, setLoadingCallback) {

			// noinspection JSCheckFunctionSignatures,UnnecessaryLocalVariableJS
			var promise = platformModalService.showYesNoDialog('businesspartner.main.crefoupdatedlg.confirmupdatebodytext', 'businesspartner.main.crefoupdatedlg.updatetitle').then(function (result) {
				if (result.yes) {
					setLoadingCallback(true);
					var bpIds = [];
					_.forEach(selectedItems, function (n) {
						bpIds.push(n.id);
					});

					return crefoUpdateAddresses(bpIds).then(function (updateResult) {
						setLoadingCallback(false);
						return updateResult;
					}, function error() {
						return false;
					});
				}
				return false;
			});
			return promise;
		}

		/**
		 * we're going to buy this address from the crefo service
		 * @param selectedItem
		 * @param setLoadingCallback
		 */
		function crefoBuySelectedItem(selectedItem, setLoadingCallback) {

			/**
			 * function userDialogAndBuyItem
			 * ask for buy or not with different bodytext and if ok address wll be bought via the service.
			 * after successful purchase we navigate to the new bp
			 * @param bodytext
			 * @param selectedItem
			 */
			function userDialogAndBuyItem(bodytext, selectedItem, askDuplete, bodytextBindWithBpd) {

				/**
				 *
				 * @param createDuplete
				 * @returns {*}
				 */
				function purchase(bindtoexistingbpd) {
					setLoadingCallback(true);
					selectedItem.bindtoexistingbpd = bindtoexistingbpd;
					return crefoPurchaseAddress(selectedItem).then(function (buyResult) {
						setLoadingCallback(false);
						if (buyResult.resultdata && buyResult.resultdata.bpid) {
							navigateToBusinessPartner({bpid: buyResult.resultdata.bpid});
						}
						return true;
					}, function error() {
						return false;
					});
				}

				// noinspection JSCheckFunctionSignatures,UnnecessaryLocalVariableJS
				var promise = platformModalService.showYesNoDialog(bodytext, 'businesspartner.main.crefodlg.buydialogtitle').then(function (result) {
					if (result.yes) {
						if (askDuplete) {
							platformModalService.showYesNoDialog(bodytextBindWithBpd, 'businesspartner.main.crefodlg.bindbpddialogtitle').then(function (result) {
								return purchase(result.yes); // bindtoexistingbpd=true
							});
						} else {
							return purchase(undefined);
						}
					}
					return false;
				});
				return promise;
			}

			if (!selectedItem || selectedItem.resulttype === 2 /* validAssigned */) {
				return;
			}

			var addressInfo = formatAddress(selectedItem);
			var newaddressInfo;
			var bodytext;
			var dlgPromise;

			if (selectedItem.resulttype === 1 || selectedItem.resulttype === 5 /* valid */) {
				// display Dialog
				// bodytext = $translate.instant('businesspartner.main.crefodlg.buydialogtakeaddress', {address: addressInfo});
				bodytext = platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.buydialogtakeaddress', {address: addressInfo});
				var askDuplete = false;
				var bodytextBindWithBpd;
				if (selectedItem.resulttype === 5) {
					askDuplete = true;
					bodytextBindWithBpd = platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.buydialognotbindwithexistingbpd', {address: addressInfo});
				}
				dlgPromise = userDialogAndBuyItem(bodytext, selectedItem, askDuplete, bodytextBindWithBpd);
				return dlgPromise;
			}

			if (selectedItem.resulttype === 3 /* historical */ || selectedItem.resulttype === 4/* 4 historicalassigned */) {
				var checkResult = validateCrefoBuyRequest(selectedItem);
				if (checkResult.target) {
					newaddressInfo = formatAddress(checkResult.target);
					if (checkResult.target.resulttype === 1 /* valid */) {
						bodytext = platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.buydialogtakealternateaddress', {
							address: addressInfo,
							newaddress: newaddressInfo
						});
						dlgPromise = userDialogAndBuyItem(bodytext, checkResult.target);
					} else {
						bodytext = platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.buydialogalreadyassignedwithnavigate', {
							address: addressInfo,
							newaddress: newaddressInfo
						});
						// noinspection JSCheckFunctionSignatures
						dlgPromise = platformModalService.showYesNoDialog(bodytext, 'businesspartner.main.crefodlg.buydialogtitle').then(function (result) {
							if (result.yes) {
								navigateToBusinessPartner(checkResult.target);
								return true;
							}
							return false;
						});
					}
				} else { // target=null, no fallback address available, we cannot buy this address
					bodytext = platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.buydialognofallbackaddress', {address: addressInfo});
					dlgPromise = platformModalService.showMsgBox(bodytext, 'businesspartner.main.crefodlg.buydialogtitle', 'info').then(function () {
						return false;
					});
				}
			}
			return dlgPromise;
		}

		/**
		 * function askNavigateDialog
		 * @param targetbp  the businesspartner
		 * @returns {*}
		 */
		function askNavigateDialog(targetbp) {

			var theAddress = formatAddress(targetbp);
			var bodytext = platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.buydialogalnavigatebody', {address: theAddress});
			// noinspection JSCheckFunctionSignatures
			return platformModalService.showYesNoDialog(bodytext, 'businesspartner.main.crefodlg.buydialogalnavigatetitle').then(function (result) {
				if (result.yes) {
					navigateToBusinessPartner(targetbp);
					return true;
				}
				return false;
			});
		}

		/**
		 * function askNavigateToBizPartnersDialog
		 * @param bizPartners
		 * @returns {*}
		 */
		function askNavigateToBizPartnersDialog(bizPartners) {

			var bodytext = $translate.instant('businesspartner.main.creforesultdlg.navigatetobpstitlebody');
			// noinspection JSCheckFunctionSignatures
			return platformModalService.showYesNoDialog(bodytext, 'businesspartner.main.creforesultdlg.navigatetobpstitle').then(function (result) {
				if (result.yes) {
					navigateToBusinessPartners(bizPartners);
					return true;
				}
				return false;
			});
		}

		function resetService() {
			lastresponseData = undefined;
		}

		var _lastSearchfilter;
		var appctxtoken = 'bp.crefofilter'; // token for save/read application context data

		function getLastSearchfilter() {
			if (_lastSearchfilter === undefined) {
				_lastSearchfilter = platformContextService.getApplicationValue(appctxtoken);
				if (!_.isObject(_lastSearchfilter)) {
					_lastSearchfilter = null;
				}
			}
			return _lastSearchfilter;
		}

		function setLastSearchfilter(para) {
			_lastSearchfilter = para;

			platformContextService.setApplicationValue(appctxtoken, para, true);
			platformContextService.saveContextToLocalStorage();

		}

		function clearCrefoFilter() {
			_lastSearchfilter = null;

			platformContextService.removeApplicationValue(appctxtoken);
			platformContextService.saveContextToLocalStorage();

		}

		/**
		 *
		 * @param item
		 */
		function navigateToBusinessPartner(item) {
			var bpId = item.bpid;
			if (bpId && bpId !== 0) {
				cloudDesktopSidebarService.filterSearchFromPKeys([bpId]);
			}
		}

		/**
		 *
		 * @param items
		 */
		function navigateToBusinessPartners(items) {
			var bpIds = [];
			_.filter(items, function (n) {
				if (n.bpid && n.bpid !== 0) {
					bpIds.push(n.bpid);
				}
			});
			if (bpIds && bpIds.length > 0) {
				cloudDesktopSidebarService.filterSearchFromPKeys(bpIds);
			}
		}

		// noinspection JSClosureCompilerSyntax,JSValidateJSDoc
		/**
		 * read creditreform data by searchfilter
		 * @param searchParams  {"name":"R*",
         "zipcode":"70",
			"street":"*",
			"location":"*",
			"areacode":"*",
			"phoneno":""}
		 * @returns {*} IEnumerable<CrefoSearchResultData>
		 */
		function crefoReadbySearch(searchParams) {
			//  [Route("searchbyfilter"), HttpPost]
			//  public IEnumerable<CrefoSearchResultData> SearchByFilter([FromBody] CrefoSearchData search)
			return $http.post(
				crefoBaseUrl + 'searchbyfilter',
				searchParams
			).then(function success(response) {
				lastresponseData = response.data;
				translateResponseData(lastresponseData);
				return response.data;}, function failed(response) {
				return response.data;
			}
			);
		}

		/*
		 resultcode: 200
		 resultdata: {  bpid: 5837 }
		 resultmessage: "ok"
		 */
		function crefoPurchaseAddress(targetItem) {

			return $http.post(
				crefoBaseUrl + 'purchaseaddress',
				targetItem
			).then(function success(response) {
				// var crefoBuyAddressResult = response.data;
				return response.data;
			}
			);
		}

		/**
		 *
		 * @param businessPartnerIds  list of integer
		 * @returns {*}
		 */
		function crefoUpdateAddresses(businessPartnerIds) {

			return $http.post(
				crefoBaseUrl + 'updateaddress',
				businessPartnerIds
			).then(function success(response) {
				// var crefoUpdateAddressResult = response.data;
				return response.data;
			}
			);
		}

		/**
		 * dispatcher for selecting wizard action
		 * @param action
		 * @param mainService
		 * @param singleSelection
		 */
		function openBeDirect(action, mainService, singleSelection) {
			if (action === 'add') {
				addBusinessPartner(mainService);
			} else if (action === 'update') {
				updateBusinessPartner(mainService, singleSelection);
			}

		}

		/**
		 * check if entry should be dispalyed
		 * @param action
		 * @param mainservice
		 * @param param1
		 * @returns {boolean}
		 */
		function enableBeDirect(action, mainservice, param1) {
			var valid;
			if (action === 'add') {
				return true;
			} else if (action === 'update') {
				valid = !!((_.isBoolean(param1) && param1) ? mainservice.getSelected() : mainservice.getList());
				return valid;
			}
		}

		/**
		 * This function must be called while initializing the businpartner module.
		 * It loads the permissions and inits the environment.
		 * After successful init flag initServiceDone is set to true
		 * @returns {*}  promise
		 */
		function initService() {

			if (initServiceDone) {
				return $q.when(true);
			}

			// loadPermissions()
			return $q.all([loadPermissions()])
				.then(function () {
					initServiceDone = true;
				});

		}

		// noinspection JSUnusedLocalSymbols
		/**
		 * @function openByWizard
		 * @param params
		 * @param userParamFromConfig
		 */
		function openByWizard(params, userParamFromConfig) {

			// forward call to executor functions
			openBeDirect(userParamFromConfig.action, userParamFromConfig.mainService, userParamFromConfig.singleSelection);

		}

		function WizardConfigParams(action, mainService, singleSelection) {
			this.action = action;
			this.mainService = mainService;
			this.singleSelection = singleSelection || false;
		}

		function translateResponseData(lastresponseData) {
			if (lastresponseData && lastresponseData.resultdata && lastresponseData.resultdata.length > 0) {
				let configValues = $injector.get('businesspartnerMainBeserveAddGridCfg');
				_.forEach(lastresponseData.resultdata, function (item) {
					if (!item.message) {
						return;
					}
					let messages = item.message.split('\n');
					let newMessage = null;
					_.forEach(messages, function (msg) {
						let match = msg.match(/%([a-zA-Z0-9_&]*)%/);
						if (match) {
							let modelName = match[1];
							let modelNames = modelName.split('&');
							let fieldTr = null;
							_.forEach(modelNames, function (model) {
								let field = null;
								switch (model) {
									case 'BusinessPartnerName1':
										field = 'companyname';
										break;
									case 'TelephonePattern':
										field = 'phonecomplete';
										break;
									case 'BedirektNo':
										field = 'bedirectno';
										break;
									case 'CrefoNo':
										field = 'crefono';
										break;
									case 'CustomerBranchFk':
										field = 'branchcode';
										break;
									case 'TelefaxPattern':
										field = 'faxcomplete';
										break;
									case 'Email':
										field = 'email';
										break;
									case 'Internet':
										field = 'interneturl';
										break;
									case 'VatNo':
										field = 'vatno';
										break;
									case 'TaxNo':
										field = 'taxnoused';
										break;
									case 'TradeRegister':
										field = 'traderegisterused';
										break;
									case 'TradeRegisterNo':
										field = 'traderegisternoused';
										break;
									default:
										break;
								}

								let tr = null;
								if (field) {
									let col = _.find(configValues, {field: field});
									if (col) {
										tr = $translate.instant(col['name$tr$']);
									}
								}
								else if (model === 'MatchCode') {
									tr = $translate.instant('businesspartner.main.matchCode');
								}

								if (tr) {
									if (fieldTr) {
										fieldTr += ' & ' + tr;
									} else {
										fieldTr = tr;
									}
								}
							});
							if (newMessage) {
								newMessage += '\n' + (fieldTr ? msg.replace(/%([a-zA-Z0-9_&]*)%/, fieldTr) : msg);
							}
							else {
								newMessage = fieldTr ? msg.replace(/%([a-zA-Z0-9_&]*)%/, fieldTr) : msg;
							}
						}
					});
					if (newMessage) {
						item.message = newMessage;
					}
				});
			}
		}

		/**
		 * all interface listed here
		 */
		// noinspection JSUnusedAssignment
		return {
			lastresponseData: lastresponseData,

			CrefoSearchParams: CrefoSearchParams,  // create an new CrefoSearchParams
			WizardConfigParams: WizardConfigParams, // constructor

			initService: initService,
			resetService: resetService,

			getLastSearchfilter: getLastSearchfilter,
			setLastSearchfilter: setLastSearchfilter,
			clearCrefoFilter: clearCrefoFilter,

			crefoBuySelectedItem: crefoBuySelectedItem,
			bedirectUpdateSelectedItems: bedirectUpdateSelectedItems,
			crefoReadbySearch: crefoReadbySearch,

			getSelectItemById: getSelectItemById,
			// navigateToBusinessPartner: navigateToBusinessPartner,
			askNavigateDialog: askNavigateDialog,
			askNavigateToBizPartnersDialog: askNavigateToBizPartnersDialog,

			openBeDirect: openBeDirect,
			enableBeDirect: enableBeDirect,
			hasAddUpdateAccess: hasAddUpdateAccess,
			hasMultipleUpdateAccess: hasMultipleUpdateAccess,

			openByWizard: openByWizard
		};
	}
})(angular);
