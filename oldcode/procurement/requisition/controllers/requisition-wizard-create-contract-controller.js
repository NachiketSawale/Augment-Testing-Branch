(function (angular) {
	'use strict';
	let moduleName = 'procurement.requisition';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc controller
	 * @name procurementRequisitionCreateContractDialogController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for wizard 'create contract' of module 'procurement.requisition'
	 */
	angular.module(moduleName).controller('procurementRequisitionWizardCreateContractController', [
		'$scope', '$timeout', '$state', '$translate', 'platformGridAPI', 'cloudDesktopSidebarService',
		'procurementPackageDataService', 'procurementRequisitionHeaderDataService',
		'procurementRequisitionWizardCreateContractService', 'procurementRequisitionCreateContractWizardBusinessPartnerService',
		'procurementCommonProcessFieldInForeignKeyEntityService',
		function ($scope, $timeout, $state, $translate, platformGridAPI, cloudDesktopSidebarService,
			procurementPackageDataService, procurementRequisitionHeaderDataService,
			requisitionWizardCreateContractService, requisitionCreateContractWizardBusinessPartnerService,
			processFieldInForeignKeyEntityService) {

			let reqHeader = procurementRequisitionHeaderDataService.getSelected() || {};
			let reqHeaderBizPartnerId = reqHeader.BusinessPartnerFk;

			// dialog status:search supplier and choose supplier
			let dialogStatus = {
				searchSupplier: 'step1',
				chooseSupplier: 'step2'
			};

			let oldModalOptions = $scope.dialog.modalOptions;

			$scope.modalOptions = {
				bodyTitle: $translate.instant('procurement.common.findBidder.findTitle'),

				btnOkText: $translate.instant('cloud.common.ok'),
				btnCancelText: $translate.instant('cloud.common.cancel'),
				btnBackText: $translate.instant('basics.common.button.back'),
				btnSearchText: $translate.instant('cloud.common.toolbarSearch'),

				dialogLoading: false,
				loadingInfo: '',

				step: dialogStatus.searchSupplier,
				btnNextStatus: true,
				btnOkStatus: false,
				searchOrChooseSupplierStatus: true,

				onNext: function onNext() {
					loadSupplier();
				},
				onBack: function () {
					showInfo(false, '', 0);
					if (reqHeaderBizPartnerId) {
						$scope.$close(false);
					}
					requisitionWizardCreateContractService.currentBusinessPartner = null;
					$scope.modalOptions.step = dialogStatus.searchSupplier;

					$scope.modalOptions.bodyTitle = $translate.instant('procurement.common.findBidder.findTitle');
				},
				onOK: function () {
					let bpdId = requisitionWizardCreateContractService.currentBusinessPartner.Id;

					if (procurementPackageDataService.isPackageWizardCreateContract) {
						requisitionWizardCreateContractService.isFromPackageCreateContract.fire(null, requisitionWizardCreateContractService.currentBusinessPartner);
						$scope.$close(false);
					} else {
						let options = {
							ReqHeaderFk: reqHeader.Id,
							BusinessPartnerFk: bpdId
						};

						$scope.modalOptions.dialogLoading = true;
						requisitionWizardCreateContractService.createContractWizard(options).then(function (data) {
							$scope.modalOptions.dialogLoading = false;
							if (angular.isArray(data) && data.length > 0) {
								$scope.$close(false);
								let url = globals.defaultState + '.' + 'procurement.contract'.replace('.', '');
								$state.go(url).then(function () {
									cloudDesktopSidebarService.filterSearchFromPKeys(data.map(e => e.Id));
								});
							} else {
								showInfo(true, $translate.instant('procurement.requisition.contract.createContractWizardFail'), 'ico-error');
							}
						}, function () {
							$scope.modalOptions.dialogLoading = false;
							showInfo(true, $translate.instant('procurement.requisition.contract.createContractWizardFail'), 'ico-error');
						});
					}
				},
				onCancel: function onCancel() {
					$scope.$close(false);
				}
			};

			$scope.findBidderSetting = {
				location: {
					isActive: false,
					distance: {
						isActive: false,
						selectedItemFk: null
					},
					regional: {
						isActive: false,
						selectedItemFk: null,
						addressElement: null
					}
				},
				bidder: {
					isActive: false,
					bidderName: null
				},
				evaluation: {
					isActive: false,
					selectedItemFk: null,
					point: null
				},
				withCharacteristic: {
					isActive: false,
					selectedItemFk: null,
					hasError: false
				},
				nationWide: {
					isActive: false
				},
				prcstructure: {
					isActive: true,
					selectedItemFk: null
				}
			};

			if (oldModalOptions.isTicketSystem) {
				$scope.modalOptions.onOK = function () {
					$scope.$close(requisitionWizardCreateContractService.currentBusinessPartner.Id);
				};
				$scope.modalOptions.onCancel = function () {
					$scope.$close();
				};
				$scope.findBidderSetting.prcstructure.isActive = false;
			}

			$scope.$watch(function () {
				$scope.modalOptions.btnOkStatus = !requisitionWizardCreateContractService.currentBusinessPartner;
				$scope.modalOptions.btnNextStatus = ($scope.findBidderSetting.prcstructure.isActive && !$scope.findBidderSetting.prcstructure.selectedItemFk) ||
					($scope.findBidderSetting.withCharacteristic.isActive && $scope.findBidderSetting.withCharacteristic.hasError);
			});

			requisitionCreateContractWizardBusinessPartnerService.registerSelectionChanged(function () {
				requisitionWizardCreateContractService.currentBusinessPartner = requisitionCreateContractWizardBusinessPartnerService.getSelected();
			});

			init();

			// //////////////////////////////////////////////////////////////////////////////////////////////////////////
			function init() {
				requisitionWizardCreateContractService.currentBusinessPartner = null;

				let foreignKeyValue = reqHeader.ProjectFk;
				let lookupType = 'Project';
				let targetFieldNameInForeignKeyEntity = 'AddressFk';
				let callbackFunction = function (targetFieldValue) {
					$scope.findBidderSetting.location.isDisabled = !targetFieldValue;
				};
				let callbackWhenEmptyValue = function () {
					$scope.findBidderSetting.location.isDisabled = true;
				};
				processFieldInForeignKeyEntityService.processFieldInForeignKeyEntity(foreignKeyValue, lookupType, targetFieldNameInForeignKeyEntity, callbackFunction, callbackWhenEmptyValue);

				if (!procurementPackageDataService.isPackageWizardCreateContract && !oldModalOptions.isTicketSystem) {
					requisitionWizardCreateContractService.getDefaultAddress(reqHeader.Id).then(function (data) {
						if (data?.Id) {
							$scope.findBidderSetting.location.regional.selectedItemFk = data.CountryFk;
						}
					});
					if (reqHeader.PrcHeaderFk) {
						requisitionWizardCreateContractService.getStructureByPrcHeader(reqHeader.PrcHeaderFk).then(function (response) {
							if (response?.data) {
								$scope.findBidderSetting.prcstructure.selectedItemFk = response.data.Id;
							} else {
								$scope.findBidderSetting.prcstructure.isActive = false;
							}
						});
					}
				} else {
					reqHeaderBizPartnerId = null;

					let packageHeader = procurementPackageDataService.getSelected();
					if (packageHeader?.StructureFk) {
						requisitionWizardCreateContractService.getStructureById(packageHeader.StructureFk).then(function (response) {
							if (response?.data) {
								$scope.findBidderSetting.prcstructure.selectedItemFk = response.data.Id;
							} else {
								$scope.findBidderSetting.prcstructure.isActive = false;
							}
						});
					} else {
						$scope.findBidderSetting.prcstructure.isActive = false;
					}
				}

				// if reqHeader's businessPartnerFk exist , show go to Next to show the businessPartner
				if (reqHeaderBizPartnerId) {
					$scope.modalOptions.searchOrChooseSupplierStatus = false;
					$scope.modalOptions.onNext();
				}
			}

			/**
			 * load sppliers by search conditions.
			 */
			function loadSupplier() {
				requisitionCreateContractWizardBusinessPartnerService.setList([]);

				if (!reqHeaderBizPartnerId) {
					let setting = $scope.findBidderSetting,
						location = setting.location,
						bidder = setting.bidder,
						evaluation = setting.evaluation,
						withCharacteristic = setting.withCharacteristic,
						prcstructure = setting.prcstructure;

					if (location.isActive) {
						if (location.regional.isActive && !location.regional.selectedItemFk) {
							showInfo(true, $translate.instant('procurement.common.findBidder.selectCountryError'), 'ico-error');
							return;
						}
					}

					if (bidder.isActive && !bidder.bidderName) {
						showInfo(true, $translate.instant('procurement.common.findBidder.fillBidderError'), 'ico-error');
						return;
					}

					if (evaluation.isActive && !evaluation.selectedItemFk) {
						showInfo(true, $translate.instant('procurement.common.findBidder.selectEvaluationError'), 'ico-error');
						return;
					}

					let findBidderComplete = {
						isLocation: location.isActive,
						isBidderName: bidder.isActive,
						isCharacteristic: withCharacteristic.isActive,
						isEvaluation: evaluation.isActive,
						isDistance: location.distance.isActive,
						isRegional: location.regional.isActive,
						isPrcStructure: prcstructure.isActive,
						distanceId: location.distance.selectedItemFk,
						regionalCountryId: location.regional.selectedItemFk,
						regionalAddressElement: location.regional.addressElement,
						bidderName: bidder.bidderName,
						evaluationId: evaluation.selectedItemFk,
						evaluationPoint: evaluation.point,
						basCharacteristicId: withCharacteristic.selectedItemFk,
						characteristicOperation: withCharacteristic.selectedOp ? withCharacteristic.selectedOp.value : '',
						characteristicValue2Compare: withCharacteristic.selectedItem ? withCharacteristic.selectedItem.compareValue : null,
						isNationWide: setting.nationWide.isActive,
						structureFk: prcstructure.selectedItemFk
					};

					$scope.modalOptions.step = dialogStatus.chooseSupplier;
					$scope.modalOptions.bodyTitle = $translate.instant('procurement.common.findBidder.selectOneBp');
					$scope.modalOptions.dialogLoading = true;

					if (!procurementPackageDataService.isPackageWizardCreateContract) {
						// search buiness partner for requisition wizard 'create contract'.
						findBidderComplete.reqHeaderIds = [reqHeader.Id];
						requisitionWizardCreateContractService.findBidder(findBidderComplete).then(getDataSuccess, getDataFail);
					} else {
						// search buiness partner for package wizard 'create contract'.
						let packageHeader = procurementPackageDataService.getSelected();
						if (packageHeader !== null) {
							findBidderComplete.packageId = packageHeader ? packageHeader.Id : null;
							requisitionWizardCreateContractService.findBidder(findBidderComplete, 'packagefindbidder').then(getDataSuccess, getDataFail);
						}
					}
				} else {
					// get businesspartner by Id
					$scope.modalOptions.step = dialogStatus.chooseSupplier;
					$scope.modalOptions.dialogLoading = true;
					requisitionWizardCreateContractService.getBussinessPartnerById(reqHeaderBizPartnerId).then(getDataSuccess, getDataFail);
				}
			}

			// get data success
			function getDataSuccess(data) {
				// show or remove info.
				$scope.modalOptions.dialogLoading = false;
				if (!data || data.length === 0) {
					showInfo(true, $translate.instant('procurement.requisition.contract.createContractWizardNoDataFeekBack'), 'ico-error');
				} else {
					showInfo(false, '', 0);
				}
				requisitionCreateContractWizardBusinessPartnerService.setList(data || []); // set data for grid
			}

			// get data fail
			function getDataFail() {
				$scope.modalOptions.dialogLoading = false;
				showInfo(true, $translate.instant('cloud.common.loadDataError'), 'ico-error');
			}

			/**
			 * @ngdoc function
			 * @param {boolean} isShow (true: show, false: hidden)
			 * @param {string} message
			 * @param {object} icon
			 */
			function showInfo(isShow, message, icon) {
				if (isShow) {
					// expand modaloptions for showing description
					oldModalOptions.topDescription = {
						iconClass: 'tlb-icons ' + icon,
						text: message
					};
				} else {
					// delete key from object. Szenario: exist top-description and klick on back-button -> new content in dialog, but top-description is still available.
					delete oldModalOptions.topDescription;
				}
			}
		}
	]);

	/**
	 * controller for businesspartner grid of wizard 'create contract' dialog in module 'procurement.requisition'.
	 */
	angular.module(moduleName).controller('procurementRequisitionCreateContractWizardBusinessPartnerController', [
		'$scope', 'procurementRequisitionCreateContractWizardBusinessPartnerService', 'basicsCommonDialogGridControllerService',
		function ($scope, dataService, dialogGridControllerService) {

			let gridConfig = {
				initCalled: false,
				columns: [],
				uuid: '2b83b2c77ee048078ef5fc2550c1f816'
			};

			let columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'BusinessPartnerName1',
								field: 'BusinessPartnerName1',
								name: 'BusinessPartnerName1',
								name$tr$: 'procurement.requisition.contract.createContractWizardBusinessName1',
								width: 125
							},
							{
								id: 'BusinessPartnerName2',
								field: 'BusinessPartnerName2',
								name: 'BusinessPartnerName2',
								name$tr$: 'procurement.requisition.contract.createContractWizardBusinessName2',
								width: 125
							},
							{
								id: 'Telephone',
								field: 'TelephoneNumber1',
								name: 'Telephone',
								name$tr$: 'procurement.requisition.contract.telephone',
								width: 125
							},
							{
								id: 'City',
								field: 'City',
								name: 'City',
								name$tr$: 'procurement.requisition.contract.createContractWizardCity',
								width: 125
							},
							{
								id: 'Description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'procurement.requisition.contract.createContractWizardDescription',
								width: 125
							},
							{
								id: 'Iso2',
								field: 'Iso2',
								name: 'Iso2',
								name$tr$: 'procurement.requisition.contract.createContractWizardIos2',
								width: 125
							},
							{
								id: 'MatchCode',
								field: 'MatchCode',
								name: 'MatchCode',
								name$tr$: 'procurement.requisition.contract.createContractWizardMatchCode',
								width: 125
							},
							{
								id: 'Street',
								field: 'Street',
								name: 'Street',
								name$tr$: 'procurement.requisition.contract.createContractWizardStreet',
								width: 125
							},
							{
								id: 'ZipCode',
								field: 'ZipCode',
								name: 'ZipCode',
								name$tr$: 'procurement.requisition.contract.createContractWizardZipCode',
								width: 125
							}
						]
					};
				}
			};

			dialogGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);
		}
	]);

})(angular);