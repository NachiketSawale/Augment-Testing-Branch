/**
 * Created by wri on 9/19/2017.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular,_,globals */
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).value('businessPartnerSynContactsBPGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'IsCheck',
						field: 'IsCheck',
						name: 'Selected',
						name$tr$: 'businesspartner.main.synContact.selected',
						formatter: 'boolean',
						editor: 'boolean',
						width: 50,
						validator: 'setContactGridDataByBP',
						headerChkbox: true
					},
					{
						id: 'TitleFk',
						field: 'TitleFk',
						name: 'Title',
						name$tr$: 'businesspartner.main.synContact.title',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'title',
							displayMember: 'DescriptionInfo.Translated'
						},
						width: 100
					},
					{
						id: 'BusinessPartnerName1',
						field: 'BusinessPartnerName1',
						name: 'Name',
						name$tr$: 'businesspartner.main.name1',
						width: 100
					},
					{
						id: 'BusinessPartnerName2',
						field: 'BusinessPartnerName2',
						name: 'Name',
						name$tr$: 'businesspartner.main.name2',
						width: 100
					},
					/*
                    {
                        id: 'BusinessPartnerName3',
                        field: 'BusinessPartnerName3',
                        name: 'Name',
                        name$tr$: 'businesspartner.main.name3',
                        width: 100
                    },
                    {
                        id: 'BusinessPartnerName4',
                        field: 'BusinessPartnerName4',
                        name: 'Name',
                        name$tr$: 'businesspartner.main.name4',
                        width: 100
                    }, */
					{
						id: 'tradeName',
						field: 'TradeName',
						name: 'Trade Name',
						name$tr$: 'businesspartner.main.tradeName',
						sortable: true,
						width: 100
					},
					{
						id: 'BusinessPartnerStatus',
						field: 'Id',
						name: 'BusinessPartnerStatus',
						name$tr$: 'procurement.rfq.businessPartnerStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'StatusDescriptionTranslateInfo.Translated',
							imageSelector: 'platformStatusIconService'
						},
						width: 100
					},
					/* {
                        id: 'BusinessPartnerStatus2',
                        field: 'Id',
                        name: 'BusinessPartnerStatus2',
                        name$tr$: 'businesspartner.main.entityStatus2',
                        formatter: 'lookup',
                        formatterOptions: {
                            lookupType: 'BusinessPartner',
                            displayMember: 'Status2DescriptionTranslateInfo.Translated',
                            imageSelector: 'businesspartnerMainStatusSalesIconService'
                        },
                        width: 100
                    }, */
					{
						afterId: 'companyfk',
						id: 'CompanyName',
						field: 'CompanyFk',
						name: 'Company Name',
						name$tr$: 'cloud.common.entityCompanyName',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'CompanyName'
						},
						width: 100
					},
					/* {
                        id: 'MatchCode',
                        field: 'MatchCode',
                        name: 'Name',
                        name$tr$: 'businesspartner.main.matchCode',
                        width: 100
                    }, */
					{
						afterId: 'clerkfk',
						id: 'clerkDescription',
						field: 'ClerkFk',
						name: 'Responsible',
						name$tr$: 'businesspartner.main.synContact.responsible',
						sortable: true,
						width: 100,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'clerk',
							displayMember: 'Description'
						}
					},
					{
						id: 'CustomerStatusFk',
						field: 'CustomerStatusFk',
						name: 'Customer Status',
						name$tr$: 'businesspartner.main.customerStatus',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'customerStatus4BusinessParnter',
							displayMember: 'Description'
						},
						width: 100
					},
					/* {
                        id: 'Avaid',
                        field: 'Avaid',
                        name: 'Name',
                        name$tr$: 'businesspartner.main.synContact.avaid',
                        width: 100
                    },
                    {
                        id: 'CreditstandingFk',
                        field: 'CreditstandingFk',
                        name: 'Credit Standing',
                        name$tr$: 'businesspartner.main.creditstandingTitle',
                        sortable: true,
                        formatter: 'lookup',
                        formatterOptions: {
                            lookupType: 'creditstanding',
                            displayMember: 'DescriptionInfo.Description'
                        },
                        width: 100
                    }, */
					{
						id: 'CustomerAbcFk',
						field: 'CustomerAbcFk',
						name: 'BusinessPartnerStatus2',
						name$tr$: 'businesspartner.main.customerAbc',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							lookupModuleQualifier: 'businesspartner.customerabc',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100
					},
					{
						id: 'CustomerSectorFk',
						field: 'CustomerSectorFk',
						name: 'Sector',
						name$tr$: 'businesspartner.main.customerSector',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							imageSelector: '',
							lookupModuleQualifier: 'businesspartner.customersector',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100
					},
					{
						id: 'CustomerGroupFk',
						field: 'CustomerGroupFk',
						name: 'Group',
						name$tr$: 'businesspartner.main.customerGroup',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							imageSelector: '',
							lookupModuleQualifier: 'businesspartner.customergroup',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100
					}
				]
			};
		}
	});

	angular.module(moduleName).value('businessPartnerSynContactsCtGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'IsCheck',
						field: 'IsCheck',
						name: 'Selected',
						name$tr$: 'businesspartner.main.synContact.selected',
						formatter: 'boolean',
						editor: 'boolean',
						width: 50,
						validator: 'setBpAndContactsMapping',
						headerChkbox: true
					},
					{
						id: 'Title',
						field: 'Title',
						name: 'Title',
						name$tr$: 'businesspartner.main.synContact.title',
						width: 100
					},
					{
						id: 'TitleFk',
						field: 'TitleFk',
						name: 'Opening',
						name$tr$: 'businesspartner.main.titleName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'title',
							displayMember: 'DescriptionInfo.Translated'
						},
						width: 100
					},
					{
						id: 'FirstName',
						field: 'FirstName',
						name: 'FirstName',
						name$tr$: 'businesspartner.main.firstName',
						width: 100
					},
					{
						id: 'lastName',
						field: 'FamilyName',
						name: 'Last Name',
						name$tr$: 'businesspartner.main.familyName',
						width: 100,
						formatter: 'description'
					},
					{
						id: 'Email',
						field: 'Email',
						name: 'Email',
						name$tr$: 'cloud.common.sidebarInfoDescription.email',
						width: 130
					},
					{
						id: 'ContactRoleFk',
						field: 'ContactRoleFk',
						name: 'ContactRoleFk',
						name$tr$: 'procurement.common.findBidder.contactRole',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.contact.role',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						width: 100
					},
					{
						id: 'Initials',
						field: 'Initials',
						name: 'Initials',
						name$tr$: 'businesspartner.main.initials',
						width: 100
					},
					/* {
                        id: 'Pronunciation',
                        field: 'Pronunciation',
                        name: 'Pronunciation',
                        name$tr$: 'businesspartner.main.pronunciation',
                        width: 100
                    }, */
					{
						afterId: 'companyfk',
						id: 'CompanyName',
						field: 'CompanyFk',
						name: 'Company Name',
						name$tr$: 'cloud.common.entityCompanyName',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'CompanyName'
						},
						width: 100
					},
					{
						id: 'IsToExchangeUser',
						field: 'IsToExchangeUser',
						name: 'To Exchange User',
						name$tr$: 'businesspartner.main.synContact.isToExchange',
						formatter: 'boolean',
						editor: 'boolean',
						width: 100,
						validator: 'setUserOrGlobalCheck'
					}/* ,
                    {
                        id: 'IsToExchangeGlobal',
                        field: 'IsToExchangeGlobal',
                        name: 'To Exchange Global',
                        name$tr$: 'businesspartner.main.synContact.is2ExchangeGlobal',
                        formatter: 'boolean',
                        editor: 'boolean',
                        width: 100,
                        validator: 'setUserOrGlobalCheck'
                    } */
				]
			};
		}
	});

	angular.module(moduleName).controller('businessPartnerSynchronizeContactsController',
		['$scope', '$translate', 'businessPartnerSynContactsWizardMainService', 'businessPartnerSynContactsCtListService', '$http', 'businessPartnerSynContactsBPListService', 'platformGridAPI',
			function ($scope, $translate, businessPartnerSynContactsWizardMainService, businessPartnerSynContactsCtListService, $http, businessPartnerSynContactsBPListService, platformGridAPI) {

				$scope.options = $scope.$parent.modalOptions;

				$scope.modalOptions = {
					headerText: $translate.instant('businesspartner.main.synContact.synCon2ExSer'),
					body: {
						bPtitle: $translate.instant('businesspartner.main.synContact.businessPartners'),
						contactGridTitle: $translate.instant('businesspartner.main.synContact.contacts'),
						toUserContact: $translate.instant('businesspartner.main.synContact.toUserContact'),
						toGlobalContact: $translate.instant('businesspartner.main.synContact.toGlobalContact'),
						synContacts: $translate.instant('businesspartner.main.synContact.synContacts'),
						checkUserContact: true,
						checkGlobalContact: false

					},
					footer: {
						checkBtn: $translate.instant('businesspartner.main.synContact.checkContacts'),
						uncheckBtn: $translate.instant('businesspartner.main.synContact.uncheckContacts'),
						cancelBtn: $translate.instant('businesspartner.main.synContact.cancel'),
						disableCheckButton: false,
						disableUncheckButton: false
					},
					cancel: function () {
						$scope.$close(false);
					}
				};

				$scope.synContactsDataContainer = {
					currentCheckBp: {},
					currentCheckContacts: [],
					businessPartnerAndContactMapping: new Map()
				};

				$scope.modalOptions.check = function onCheck(isCheck) {
					var map = $scope.synContactsDataContainer.businessPartnerAndContactMapping;
					angular.forEach(map, function (mapItem) {
						angular.forEach(mapItem, function (contactItem) {
							if ($scope.modalOptions.body.checkUserContact) {
								contactItem.IsToExchangeUser = isCheck;
							}
							if ($scope.modalOptions.body.checkGlobalContact) {
								contactItem.IsToExchangeGlobal = isCheck;
							}
						});
					});

					var mapObject = {};
					map.forEach(function (value, key) {
						mapObject[key] = map.get(key);
					});

					if ($scope.synContactsDataContainer.currentCheckBp.Id !== undefined) {
						$http.post(globals.webApiBaseUrl + 'businesspartner/main/exchange/updatecontacts', mapObject).then(function () {
							businessPartnerSynContactsWizardMainService.findContacts($scope.synContactsDataContainer.currentCheckBp.Id).then(function (response) {
								businessPartnerSynContactsWizardMainService.setUserAndGlobalReadonly(response);
								businessPartnerSynContactsWizardMainService.setContactCheck($scope.synContactsDataContainer.businessPartnerAndContactMapping, $scope.synContactsDataContainer.currentCheckBp, response);
								businessPartnerSynContactsCtListService.setDataList(response);
								businessPartnerSynContactsCtListService.refreshGrid();
								businessPartnerSynContactsWizardMainService.checkIndeterminateness(_.filter(businessPartnerSynContactsWizardMainService.getContactGrid().getColumns(), {id: 'IsCheck'})[0], businessPartnerSynContactsWizardMainService.getContactGrid());
							});
						});
					}
				};

				$scope.modalOptions.uncheck = $scope.modalOptions.check;

				$scope.modalOptions.cancel = function onCancel() {
					$scope.$close(false);
				};

				$scope.modalOptions.onHeaderClick = function () {
					if ($scope.modalOptions.body.checkUserContact || $scope.modalOptions.body.checkGlobalContact) {
						$scope.modalOptions.footer.disableCheckButton = $scope.modalOptions.footer.disableUncheckButton = false;
					} else {
						$scope.modalOptions.footer.disableCheckButton = $scope.modalOptions.footer.disableUncheckButton = true;
					}
				};

				$scope.setContactGridDataByBP = function (entity, checked) {
					if (checked && entity) {
						$scope.synContactsDataContainer.currentCheckBp = entity;
						if ($scope.synContactsDataContainer.businessPartnerAndContactMapping.get(entity.Id) === undefined) {
							$scope.synContactsDataContainer.businessPartnerAndContactMapping.set(entity.Id, []);
						}
						businessPartnerSynContactsWizardMainService.findContacts(entity.Id).then(function (response) {
							businessPartnerSynContactsWizardMainService.setUserAndGlobalReadonly(response);
							businessPartnerSynContactsWizardMainService.setContactCheck($scope.synContactsDataContainer.businessPartnerAndContactMapping, entity, response);
							var map = $scope.synContactsDataContainer.businessPartnerAndContactMapping;
							_.forEach(response, function (item) {
								item.IsCheck = true;
								if (!businessPartnerSynContactsWizardMainService.contains(item, map.get($scope.synContactsDataContainer.currentCheckBp.Id))) {
									map.get($scope.synContactsDataContainer.currentCheckBp.Id).push(item);
								}
								// map.get($scope.synContactsDataContainer.currentCheckBp.Id).push(item);
							});
							businessPartnerSynContactsCtListService.setDataList(response);
							businessPartnerSynContactsCtListService.refreshGrid();
							businessPartnerSynContactsWizardMainService.checkIndeterminateness(_.filter(businessPartnerSynContactsWizardMainService.getContactGrid().getColumns(), {id: 'IsCheck'})[0], businessPartnerSynContactsWizardMainService.getContactGrid());
						});
					} else {
						if ($scope.synContactsDataContainer.businessPartnerAndContactMapping.get(entity.Id) !== undefined) {
							$scope.synContactsDataContainer.businessPartnerAndContactMapping.delete(entity.Id);
							businessPartnerSynContactsWizardMainService.findContacts(entity.Id).then(function (response) {
								businessPartnerSynContactsWizardMainService.setUserAndGlobalReadonly(response);
								businessPartnerSynContactsCtListService.setDataList(response);
								businessPartnerSynContactsCtListService.refreshGrid();
								businessPartnerSynContactsWizardMainService.checkIndeterminateness(_.filter(businessPartnerSynContactsWizardMainService.getContactGrid().getColumns(), {id: 'IsCheck'})[0], businessPartnerSynContactsWizardMainService.getContactGrid());
							});
						}
					}
				};

				$scope.setBpAndContactsMapping = function (entity, checked) {
					var map = $scope.synContactsDataContainer.businessPartnerAndContactMapping;
					if (map.get($scope.synContactsDataContainer.currentCheckBp.Id) !== undefined) {
						if (checked && entity) {
							if (!businessPartnerSynContactsWizardMainService.contains(entity, map.get($scope.synContactsDataContainer.currentCheckBp.Id))) {
								map.get($scope.synContactsDataContainer.currentCheckBp.Id).push(entity);
							}
						} else {
							businessPartnerSynContactsWizardMainService.remove(entity, map.get($scope.synContactsDataContainer.currentCheckBp.Id));
						}
					} else {
						var selected = businessPartnerSynContactsBPListService.getSelectedItem();
						if (selected) {
							selected.IsCheck = true;
							$scope.synContactsDataContainer.currentCheckBp = selected;
							if ($scope.synContactsDataContainer.businessPartnerAndContactMapping.get(selected.Id) === undefined) {
								$scope.synContactsDataContainer.businessPartnerAndContactMapping.set(selected.Id, []);
								map.get($scope.synContactsDataContainer.currentCheckBp.Id).push(entity);
							}
							businessPartnerSynContactsBPListService.refreshGrid();
							platformGridAPI.rows.scrollIntoViewByItem('E6430A38383E40349F8D294EC1C7537C', selected);
						}
					}
				};

				$scope.setUserOrGlobalCheck = function () {

				};

			}]);

	angular.module(moduleName).controller('businessPartnerSynContactsBPController',
		['platformGridControllerService', '$scope', '$translate', 'platformGridAPI', 'businessPartnerSynContactsBPListService',
			'businessPartnerSynContactsBPGridColumns', '$timeout', 'businessPartnerSynContactsWizardMainService', 'businessPartnerSynContactsCtListService',
			function (gridControllerService, $scope, $translate, platformGridAPI, businessPartnerSynContactsBPListService,
				gridColumns, $timeout, businessPartnerSynContactsWizardMainService, businessPartnerSynContactsCtListService) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.data = [];
				$scope.gridId = 'E6430A38383E40349F8D294EC1C7537C';

				$scope.onContentResized = function () {
				};
				$scope.setTools = function () {
				};

				// set data to grid
				var setDataSource = function (data) {
					$scope.data = data;
					businessPartnerSynContactsBPListService.setDataList(data);
					businessPartnerSynContactsBPListService.refreshGrid();
					$scope.onContentResized();
				};

				// init
				var init = function () {
					businessPartnerSynContactsWizardMainService.findBusinessPartners().then(function (response) {
						setDataSource(response);
					});
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					gridControllerService.initListController($scope, gridColumns, businessPartnerSynContactsBPListService, null, gridConfig);
				};

				function onSelectedRowsChanged( ) {// jshint ignore:line
					var selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					if (selected) {
						if (selected.IsCheck) {
							$scope.synContactsDataContainer.currentCheckBp = selected;
						} else {
							$scope.synContactsDataContainer.currentCheckBp = {};
						}
						businessPartnerSynContactsWizardMainService.findContacts(selected.Id).then(function (response) {
							businessPartnerSynContactsWizardMainService.setUserAndGlobalReadonly(response);
							businessPartnerSynContactsWizardMainService.setContactCheck($scope.synContactsDataContainer.businessPartnerAndContactMapping, selected, response);
							businessPartnerSynContactsCtListService.setDataList(response);
							businessPartnerSynContactsCtListService.refreshGrid();
							if (businessPartnerSynContactsCtListService.getSelectedItem()) {
								platformGridAPI.rows.scrollIntoViewByItem('043BBC1DCC9540F4B005EBCC7E72B5DA', businessPartnerSynContactsCtListService.getSelectedItem());
							}
							businessPartnerSynContactsWizardMainService.checkIndeterminateness(_.filter(businessPartnerSynContactsWizardMainService.getContactGrid().getColumns(), {id: 'IsCheck'})[0], businessPartnerSynContactsWizardMainService.getContactGrid());
						});
					}
				}

				// resize the grid
				$timeout(function () { // use timeout to do after the grid instance is finished
					platformGridAPI.grids.resize($scope.gridId);
				});

				init();

				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
				});

				function onHeaderCheckboxChange(e) {
					if (e.target) {
						var bpList = businessPartnerSynContactsBPListService.getList();
						var bpIdList = [];
						_.forEach(bpList, function (bp) {
							bpIdList.push(bp.Id);
						});
						businessPartnerSynContactsWizardMainService.findAllBpAndContacts(bpIdList).then(function (response) {
							_.forEach(businessPartnerSynContactsBPListService.getList(), function (item) {
								processAllCheck(e, item, response);
							});
						});
					}
				}

				function processAllCheck(e, item, keyAndContacts) {
					var map = $scope.synContactsDataContainer.businessPartnerAndContactMapping;
					if (e.target.checked && item) {
						if ($scope.synContactsDataContainer.businessPartnerAndContactMapping.get(item.Id) === undefined) {
							$scope.synContactsDataContainer.businessPartnerAndContactMapping.set(item.Id, []);
						}
						var bpId = item.Id;
						var contacts = _.filter(keyAndContacts, {Key: bpId})[0].Contacts;
						_.forEach(contacts, function (contact) {
							contact.IsCheck = true;
							if (!businessPartnerSynContactsWizardMainService.contains(contact, map.get(bpId))) {
								map.get(bpId).push(contact);
							}
							// map.get(bpId).push(contact);
						});
						if (businessPartnerSynContactsBPListService.getSelectedItem()) {
							if (bpId === businessPartnerSynContactsBPListService.getSelectedItem().Id) {
								businessPartnerSynContactsWizardMainService.setUserAndGlobalReadonly(contacts);
								businessPartnerSynContactsWizardMainService.setContactCheck(map, businessPartnerSynContactsBPListService.getSelectedItem(), contacts);
								businessPartnerSynContactsCtListService.setDataList(contacts);
								businessPartnerSynContactsCtListService.refreshGrid();
								businessPartnerSynContactsWizardMainService.checkIndeterminateness(_.filter(businessPartnerSynContactsWizardMainService.getContactGrid().getColumns(), {id: 'IsCheck'})[0], businessPartnerSynContactsWizardMainService.getContactGrid());
							}
						}
					} else {
						if ($scope.synContactsDataContainer.businessPartnerAndContactMapping.get(item.Id) !== undefined) {
							$scope.synContactsDataContainer.businessPartnerAndContactMapping.delete(item.Id);
							if (businessPartnerSynContactsBPListService.getSelectedItem()) {
								if (item.Id === businessPartnerSynContactsBPListService.getSelectedItem().Id) {
									var contactsList = businessPartnerSynContactsCtListService.getList();
									_.forEach(contactsList, function (contact) {
										contact.IsCheck = false;
									});
									businessPartnerSynContactsWizardMainService.setUserAndGlobalReadonly(contactsList);
									businessPartnerSynContactsWizardMainService.setContactCheck(map, businessPartnerSynContactsBPListService.getSelectedItem(), contactsList);
									businessPartnerSynContactsCtListService.setDataList(contactsList);
									businessPartnerSynContactsCtListService.refreshGrid();
									businessPartnerSynContactsWizardMainService.checkIndeterminateness(_.filter(businessPartnerSynContactsWizardMainService.getContactGrid().getColumns(), {id: 'IsCheck'})[0], businessPartnerSynContactsWizardMainService.getContactGrid());
								}
							}

						}
					}
				}
			}
		]);

	angular.module(moduleName).controller('businessPartnerSynContactsCtController',
		['platformGridControllerService', '$scope', 'platformGridAPI', 'businessPartnerSynContactsCtListService',
			'businessPartnerSynContactsCtGridColumns', '$timeout',
			function (gridControllerService, $scope, platformGridAPI,
				businessPartnerSynContactsCtListService, gridColumns, $timeout) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.gridId = '043BBC1DCC9540F4B005EBCC7E72B5DA';

				$scope.onContentResized = function () {
				};

				$scope.setTools = function () {
				};

				// set data to grid
				var setDataSource = function (data) {
					businessPartnerSynContactsCtListService.setDataList(data);
					businessPartnerSynContactsCtListService.refreshGrid();
					$scope.onContentResized();
				};

				// init
				var init = function () {
					setDataSource([]);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					gridControllerService.initListController($scope, gridColumns, businessPartnerSynContactsCtListService, null, gridConfig);
				};

				// resize the grid
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});

				init();

				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
				});

				function onHeaderCheckboxChange(e) {
					if (e.target) {
						_.forEach(businessPartnerSynContactsCtListService.getList(), function (item) {
							$scope.setBpAndContactsMapping(item, e.target.checked);
						});
					}
				}
			}
		]);

})(angular);
