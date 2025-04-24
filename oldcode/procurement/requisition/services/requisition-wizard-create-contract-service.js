(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).factory('procurementRequisitionWizardCreateContractService', [
		'$q', '$http', '$injector', '$state', '$translate', 'platformModalService', 'cloudDesktopSidebarService',
		'procurementPackageDataService', 'procurementRequisitionHeaderDataService', 'PlatformMessenger', 'globals', 'platformDialogService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupDataService',
		'platformModuleNavigationService', '$timeout',
		function ($q, $http, $injector, $state, $translate, platformModalService, cloudDesktopSidebarService,
			procurementPackageDataService, procurementRequisitionHeaderDataService, PlatformMessenger, globals, platformDialogService, lookupDescriptorService, lookupDataService, platformModuleNavigationService, $timeout) {
			let service = {};

			service.currentBusinessPartner = null;
			service.isFromPackageCreateContract = new PlatformMessenger();

			service.getModule = () => ({name: moduleName});

			service.createContractWizard = function createContractWizard(options) {
				let defer = $q.defer();
				let parameters = {
					reqHeaderFk: options.ReqHeaderFk,
					businessPartnerFk: options.BusinessPartnerFk,
					subsidiaryFk: !_.isNil(options.SubsidiaryFk) ? options.SubsidiaryFk : null,
					supplierFk: !_.isNil(options.SupplierFk) ? options.SupplierFk : null,
					contactFk: !_.isNil(options.ContactFk) ? options.ContactFk : null,
					isFromVariants: !_.isNil(options.isFromVariants) ? options.isFromVariants : false,
					variants: !_.isNil(options.variants) ? options.variants : null
				}

				$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createcontractfromreq', parameters).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.reject(error);
				});

				return defer.promise;
			};

			service.execute = function execute() {
				procurementPackageDataService.isPackageWizardCreateContract = false;

				if (procurementRequisitionHeaderDataService.hasSelection()) {
					let reqHeader = procurementRequisitionHeaderDataService.getSelected();
					// abort when this requisition is a change order requisition.
					if (!reqHeader.ReqStatus.Isaccepted || reqHeader.ReqStatus.Iscanceled) {

						let dueToStatusText = $translate.instant('procurement.requisition.contract.cannotCreateContractDueToStatus');
						return platformModalService.showMsgBox(dueToStatusText, 'cloud.common.informationDialogHeader', 'info');
					}
					if (reqHeader.ReqHeaderFk && reqHeader.ProjectChangeFk) {
						let parameters = {
							PackageFk: reqHeader.PackageFk,
							SubPackageFk: reqHeader.Package2HeaderFk,
							ProjectFk: reqHeader.ProjectFk
						};
						return getBaseContractForChangeReq(parameters).then(function (response) {
							if (!response?.data || response.data.length === 0) {
								let bodyText = $translate.instant('procurement.requisition.contract.cannotCreateContractDueToNoBaseContract');
								return platformModalService.showMsgBox(bodyText, 'cloud.common.informationDialogHeader', 'info');
							} else {
								// show dialog.
								platformModalService.showDialog({
									// headerTextKey: 'procurement.common.wizard.item.createContract',
									templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/create-change-order-contract.html',
									items: response.data,
									resizeable: true,
									width: '800px',
									windowClass: 'form-modal-dialog',
									reqHeader: reqHeader
								});
							}
						});
					} else if (reqHeader.ReqStatus.Isaccepted && !reqHeader.ReqStatus.Iscanceled) {
						if (reqHeader.ReqStatus.Isordered) {
							platformModalService.showDialog({
								headerTextKey: 'cloud.common.informationDialogHeader',
								bodyTextKey: 'procurement.requisition.contract.disableCreateContractByOrdered',
								showOkButton: true,
								iconClass: 'ico-info'
							});
						} else {
							let request = {
								MainItemIds: [reqHeader.PrcHeaderFk],
								ModuleName: 'procurement.requisition'
							};
							$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request)
								.then(function (response) {
									let hasContractItem = response ? response.data : false;
									createContract(reqHeader, hasContractItem);
								});
						}

					} else {
						platformModalService.showDialog({
							headerTextKey: 'cloud.common.informationDialogHeader',
							bodyTextKey: 'procurement.requisition.contract.disableCreateContract',
							showOkButton: true,
							iconClass: 'ico-info'
						});
					}
				}

				function createContract(reqHeader, hasContractItem) {
					if (reqHeader.BusinessPartnerFk !== null) {
						if (hasContractItem) {
							let procurementContextService = $injector.get('procurementContextService');
							procurementContextService.showDialogAndAgain({
								headerText: $translate.instant('cloud.common.informationDialogHeader'),
								bodyText: $translate.instant('procurement.common.wizard.IsContractNote'),
								showYesButton: true,
								showNoButton: true,
								iconClass: 'ico-info',
								id: procurementContextService.showDialogTemp.isContractNoteReqDialogId,
								dontShowAgain: true
							}).then(function (result) {
								if (result.yes) {
									showCreateContractDialog();
								}
							});
						}
						else {
							showCreateContractDialog();
						}
					} else {
						showCreateContractDialog();
					}

					function showCreateContractDialog(){
						platformDialogService.showDialog({
							headerText$tr$: 'procurement.package.wizard.contract.header',
							templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/create-contract-wizard-new.html',
							minWidth: '850px',
							width: '900px',
							resizeable: true,
							data: {},
							hasContractItem: hasContractItem
						});
					}
				}
			};

			/**
			 * used by wizard 'create contract' in package module.
			 */
			service.showDialogFromRequisition = function showDialogFromRequisition() {
				showDialog();
			};

			service.showDialogFromTicketSystem = function (customOptions) {
				return showDialog(customOptions);
			};

			service.getBussinessPartnerById = function getBussinessPartnerById(Id) {
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/getbussinesspartnerbyid?Id=' + Id).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.reject(error);
				});
				return defer.promise;
			};

			service.findBidder = function findBidder(findBidderComplete, path) {
				let defer = $q.defer();
				let findBidderPromise = null;
				if (!path) {
					findBidderPromise = $http.post(globals.webApiBaseUrl + 'requisition/requisition/wizard/findbidder', findBidderComplete);
				} else {
					findBidderPromise = $http.post(globals.webApiBaseUrl + 'requisition/requisition/wizard/' + path, findBidderComplete);
				}
				if (findBidderPromise) {
					findBidderPromise.then(function (response) {
						defer.resolve(response.data);
					}, function (error) {
						defer.resolve(error);
					});
				} else {
					defer.resolve(null);
				}

				return defer.promise;
			};

			service.getDefaultAddress = function (reqHeaderId) {
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getaddressbyreqheader?reqHeaderId=' + reqHeaderId).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.resolve(error);
				});

				return defer.promise;
			};

			service.getStructureByPrcHeader = function getStructureByPrcHeader(prcHeaderFk) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/getstructurebyPrcHeader?prcHeaderId=' + prcHeaderFk);
			};

			service.getStructureById = function getStructureById(id) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/getstructureById?id=' + id);
			};

			service.createChangeOrderContract = function createChangeOrderContract(selectedItem, variantIds) {
				let selectedReq = procurementRequisitionHeaderDataService.getSelected();
				let parameters = {
					BaseContractFk: selectedItem ? selectedItem.Id : null,
					RequisitionFk: selectedReq ? selectedReq.Id : null,
					VariantIds: variantIds
				};
				return $http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createchangeordercontractfromreq', parameters);
			};

			service.navigateToContract = function navigateToContract(data) {
				if (data === null || data === undefined || data < 0) {
					return;
				}
				let id = angular.isObject(data) ? data.Id : data;
				let url = globals.defaultState + '.' + 'procurement.contract'.replace('.', '');
				$state.go(url).then(function () {
					cloudDesktopSidebarService.filterSearchFromPKeys([id]);
				});

			};
			service.showSimpleDialog = function showSimpleDialog(bodyText, headerText, icon) {
				return platformModalService.showMsgBox(bodyText, headerText, icon);
			};

			function showDialog(customOptions) {
				let header = procurementRequisitionHeaderDataService.getSelected();
				if (!header) {
					return;
				}

				header.bpPrcHeaderEntity = header.PrcHeaderEntity;
				let modalOptions = {};
				let options = {
					// headerText$tr$: 'procurement.common.wizard.item.createContract',
					// templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/create-contract-wizard.html',
					// backdrop: false,
					// width: '60%',
					templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/filter-business-partner-dialog.html',
					backdrop: false,
					width: 'max',
					height: 'max',
					minHeight: '585px',
					IsWizardForCreateContract: true,
					IsShowBranch: true,
					mainData: header,
					resizeable: true,
					controller: ['$scope', function ($scope) {
						$scope.dialog = {};
						$scope.dialog.modalOptions = options;
						$scope.dialog.onReturnButtonPress = function () {
						};
					}]
				};
				angular.extend(modalOptions, options, customOptions);
				return platformDialogService.showDialog(modalOptions);
			}

			function getBaseContractForChangeReq(parameters) {
				if (!parameters || parameters.toString() !== '[object Object]') {
					let defer = $q.defer();
					defer.resolve(null);
					return defer.promise;
				}

				return $http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/getbasecontractforchangereq', parameters);
			}

			// todo
			service.setDefaultSupplier = function(bpId, supplierId, subsidiaryId, entity) {
				if (!entity) {
					return;
				}
				// load bp's suppliers and set the first supplier as default when SupplierId not set.
				let currentSupplier = _.find(lookupDescriptorService.getData('supplier'), {Id: supplierId});
				if (currentSupplier) {
					entity.supplier = angular.copy(currentSupplier);
					entity.SupplierFk = currentSupplier.Id;
				} else {
					let searchRequest = {
						FilterKey: 'businesspartner-main-supplier-common-filter',
						SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
						SearchText: '',
						AdditionalParameters: {
							BusinessPartnerFk: bpId,
							SubsidiaryFk: subsidiaryId
						}
					};
					lookupDataService.getSearchList('supplier', searchRequest).then(function (dataList) {
						let data = dataList.items ? dataList.items : [];
						if (data && data.length > 0) {
							lookupDescriptorService.attachData({'supplier': data});
							entity.supplier = angular.copy(data[0]);
							entity.SupplierFk = data[0].Id;
						}else{
							entity.supplier = {};
							entity.SupplierFk = null;
						}
					});
				}
			};

			service.setDefaultContact = function(bpId, subsidiaryId, entity) {
				if (!entity) {
					return;
				}
				if (bpId) {
					let filterDatas = [];
					let pbContactParam = {Value: bpId, filter: ''};
					$http.post(globals.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', pbContactParam).then(function (response) {
						if (response.data) {
							if(!_.isNil(subsidiaryId)){
								filterDatas = _.filter(response.data.Main, function (item) {
									return  item.SubsidiaryFk === subsidiaryId || _.isNil(item.SubsidiaryFk);
								});
							}else{
								filterDatas = response.data.Main;
							}
							if(filterDatas.length > 0){
								entity.contact = angular.copy(filterDatas[0]);
								entity.ContactFk = filterDatas[0].Id;
							}else{
								entity.contact = null;
								entity.ContactFk = null;
							}
						} else {
							entity.contact = null;
							entity.ContactFk = null;
						}
					});
				}
			};

			service.naviGate = function (entity, property) {
				service.scope.$close(false);
				//
				platformModuleNavigationService.navigate({
					moduleName: 'procurement.contract',
					registerService: 'procurementContractHeaderDataService'
				}, entity, property);
			};

			service.setDataForCreateContract = function () {
				let requisition = procurementRequisitionHeaderDataService.getSelected();
				showInfo(false, '', 0);
				clearContractorInfo();

				if (requisition?.BusinessPartnerFk) {
					let requisitionBP = _.find(lookupDescriptorService.getData('BusinessPartner'), {Id: requisition.BusinessPartnerFk});
					let requisitionSubsidiary = _.find(lookupDescriptorService.getData('Subsidiary'), {Id: requisition.SubsidiaryFk});
					if (!_.isNull(requisitionBP) && !_.isUndefined(requisitionBP)) {
						service.scope.initOptions.dataModels.businessPartner = angular.copy(requisitionBP);
						service.scope.initOptions.isBtnNextDisabled = false;
					}
					service.scope.initOptions.dataModels.subsidiary = angular.copy(requisitionSubsidiary) || {};
					service.setDefaultSupplier(requisition.BusinessPartnerFk, requisition.SupplierFk, requisition.SubsidiaryFk, service.scope.initOptions.dataModels);
					$timeout(function () {
						getContactByBP(service.scope.initOptions.dataModels.businessPartner);
					});
				}
			};

			function showInfo(isShow, message, icon, showCon = false) {
				// let errorType = {info: 1, warning: 2, error: 3};
				let type = 3;
				switch (icon) {
					case 'ico-info':
						type = 1;
						break;
					case 'ico-warning':
						type = 2;
						break;
				}
				service.scope.error = {
					show: isShow,
					messageCol: 1,
					message: message,
					type: type,
					showCon: showCon
				};
			}

			function clearContractorInfo() {
				service.scope.initOptions.dataModels.businessPartner = {};
				service.scope.initOptions.dataModels.subsidiary = {};
				service.scope.initOptions.dataModels.supplier = {};
				service.scope.initOptions.isBtnNextDisabled = true;
			}

			function getContactByBP(bp) {
				if (bp?.Id) {
					let bpId = bp.Id;
					let contacts = _.filter(lookupDescriptorService.getData('contact'), {BusinessPartnerFk: bpId});
					if (contacts && contacts.length > 0) {
						contacts = _.sortBy(contacts, 'Id');
						service.scope.initOptions.dataModels.contact = angular.copy(contacts[0]);
					} else {
						let searchRequest = {
							AdditionalParameters: {BusinessPartnerFk: bpId},
							FilterKey: 'prc-con-contact-filter',
							PageState: {PageNumber: 0, PageSize: 100},
							SearchText: '',
							TreeState: {StartId: null, Depth: null},
							RequirePaging: true
						};

						lookupDataService.getSearchList('contact', searchRequest).then(function (res) {
							let data = res.items ? res.items : [];
							if (data && data.length > 0) {
								data = _.sortBy(data, 'Id');
								lookupDescriptorService.attachData({'contact': data});
								service.scope.initOptions.dataModels.contact = angular.copy(data[0]);
							}
						});
					}
				}
			}

			return service;
		}
	]);

	/**
	 * data service for BusinessPartner grid of wizard 'create contract' dialog' in module 'procurement.requisition'.
	 */
	angular.module(moduleName).factory('procurementRequisitionCreateContractWizardBusinessPartnerService', [
		'platformDataServiceFactory',
		function (platformDataServiceFactory) {

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementRequisitionCreateContractWizardBusinessPartnerService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						return [];
					}
				},
				presenter: {list: {}},
				entitySelection: {},
				modification: {}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;

			// avoid console error: service.parentService() is not a function (see: platformDataServiceModificationTrackingExtension line 300)
			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			return service;
		}
	]);

})(angular);
