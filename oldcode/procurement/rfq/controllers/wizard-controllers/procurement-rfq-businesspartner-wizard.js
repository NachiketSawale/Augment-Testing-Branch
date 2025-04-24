/**
 * Created by lja on 03/23/2015.
 */

// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	/** @namespace bpItem.ContactDtos */
	/** @namespace data.BidderList */
	/** @namespace data.RfqBpMapContactId */
	/** @namespace response.OldResultCount */
	/** @namespace response.resultCount */
	/** @namespace bp.BasCommunicationChannelFk */
	/** @namespace bp.BasCommunicationChannelFk */
	angular.module(moduleName).value('procurementRfFindSupplierBusinessPartnerGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'Id',
						field: 'BpIsExisted',
						name: 'Selected',
						name$tr$: 'basics.material.record.select',
						formatter: 'boolean',
						editor: 'boolean',
						width: 30,
						validator: 'setContactGridDataByBidder',
						headerChkbox: true
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
					{
						id: 'BusinessPartnerStatus2',
						field: 'Id',
						name: 'BusinessPartnerStatus2',
						name$tr$: 'procurement.rfq.uniformBusinessPartnerStatus2',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'Status2DescriptionTranslateInfo.Translated',
							imageSelector: 'businesspartnerMainStatusSalesIconService'
						},
						width: 100
					},
					{
						id: 'matchCode',
						field: 'MatchCode',
						name: 'Match Code',
						name$tr$: 'businesspartner.main.matchCode',
						width: 100
					},
					{
						id: 'BusinessPartnerName1',
						field: 'BusinessPartnerName1',
						name: 'Name',
						name$tr$: 'procurement.rfq.wizard.bidders.Name',
						width: 100
					},
					{
						id: 'zipCode',
						field: 'ZipCode',
						name: 'ZipCode',
						name$tr$: 'procurement.rfq.uniformBusinessPartnerNZip',
						width: 100
					},
					{
						id: 'City',
						field: 'City',
						name: 'City',
						name$tr$: 'cloud.common.entityCity',
						width: 100
					},
					{
						id: 'Street',
						field: 'Street',
						name: 'Street',
						name$tr$: 'cloud.common.entityStreet',
						width: 130
					},
					{
						id: 'userdefined1',
						field: 'Userdefined1',
						name: 'User Define 1',
						name$tr$: 'businesspartner.main.import.entityUserDefined1',
						width: 100
					}
				]
			};
		}
	});

	angular.module(moduleName).value('procurementRfFindSupplierBusinessPartnerContractGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'Id',
						field: 'bpContactCheck',
						name$tr$: 'basics.material.record.select',
						formatter: 'boolean',
						editor: 'boolean',
						width: 50,
						validator: 'uniqueContactCheckValidation'
					},
					{
						id: 'ContactRoleFk',
						field: 'ContactRoleFk',
						name: 'ContactRoleFk',
						name$tr$: 'procurement.rfq.wizard.contacts.contactRole',
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
						id: 'TitleFk',
						field: 'TitleFk',
						name: 'Opening',
						name$tr$: 'procurement.rfq.wizard.contacts.Opening',
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
						id: 'FamilyName',
						field: 'FamilyName',
						name: 'FamilyName',
						name$tr$: 'businesspartner.main.familyName',
						width: 100
					},
					{
						id: 'TelephoneNumber1',
						field: 'TelephoneNumber1',
						name: 'TelephoneNumber1',
						name$tr$: 'cloud.common.TelephoneDialogTelephone',
						width: 100
					},
					{
						id: 'Email',
						field: 'Email',
						name: 'Email',
						name$tr$: 'cloud.common.sidebarInfoDescription.email',
						width: 130
					},
					{
						id: 'SubsidiaryFk',
						field: 'SubsidiaryFk',
						name: 'Subsidiary',
						name$tr$: 'cloud.common.entitySubsidiary',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'SubsidiaryDescription'
						},
						width: 100
					}
				]
			};
		}
	});

	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqBusinessPartnerWizardMainController',
		['$scope', '$translate', 'procurementRfqBusinessPartnerWizardMainService',
			'$state', 'procurementRfqMainService', 'cloudDesktopSidebarService', 'platformModalService',
			'procurementRfqBusinessPartnerWizardContractService', 'procurementRfqRequisitionService', 'platformRuntimeDataService', '_',
			'procurementCommonProcessFieldInForeignKeyEntityService',

			function ($scope, $translate, procurementRfqBusinessPartnerWizardService,
				$state, procurementRfqMainService, cloudDesktopSidebarService, platformModalService,
				procurementRfqBusinessPartnerContractService, procurementRfqRequisitionService, platformRuntimeDataService, _, processFieldInForeignKeyEntityService) {

				var rfqHeader = procurementRfqMainService.getSelected(),
					rfqHeaderId = rfqHeader.Id,
					rfqHeaderProjectFk = rfqHeader.ProjectFk;

				// dialog status:search supplier and choose supplier
				var dialogStatus = {
					searchSupplier: 'findBidder',
					chooseSupplier: 'selectBidder'
				};

				var translatePrefix = 'procurement.rfq.wizard.businessPartner';

				// base on the error directive
				var errorType = {
					info: 1,
					error: 3
				};

				// create wizard result
				var CreateBpWizardResult = {
					NoBpSearchOut: 0,
					NoMatchBpSearchOut: 1,
					MatchAndSaveSuccess: 2,
					NotNeedSelectFindSupplier: 3
				};

				$scope.chooseBidderDataContainer = {
					bpGridData: [],
					contactGridData: [],
					businessPartnerAndContactMapping: []
				};

				$scope.findBidderSetting = {
					location: {
						isActive: false,
						isDisabled: true,
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
					prcstructure: {
						isActive: true,
						selectedItemFk: null
					}/* ,
					nationWide: {
						isActive: false
					} */
				};

				$scope.options.onReturnButtonPress = function () {
					if ($scope.step === 'findBidder') {
						$scope.modalOptions.next();
					}
				};

				// dialog button label and loading
				$scope.modalOptions = {
					header: {
						title: $translate.instant('procurement.common.findSupplier.headerText')
					},
					headerText: $translate.instant('procurement.common.findSupplier.headerText'),
					body: {
						title: $translate.instant('procurement.common.findBidder.findTitle'),
						contactGridTitle: $translate.instant('procurement.rfq.rfqFindBidderContact'),
						contactGridTitleCopy: $translate.instant('procurement.rfq.rfqFindBidderContact')
					},
					footer: {
						okBtnText: $translate.instant('cloud.common.ok'),
						prevBtnText: $translate.instant('procurement.common.findBidder.back'),
						closeBtnText: $translate.instant('cloud.common.cancel'),
						nextBtnText: $translate.instant('procurement.common.findBidder.search')
					},
					loading: {
						dialogLoading: false,
						loadingInfo: ''
					},
					next: function () {
						showError(false, '', errorType.info);
						showError(false, '', errorType.error);
						$scope.modalOptions.body.contactGridTitle = $scope.modalOptions.body.contactGridTitleCopy;
						$scope.chooseBidderDataContainer.businessPartnerAndContactMapping = [];
						$scope.modalOptions.header.title = $translate.instant('cloud.common.dialogTitleBusinessPartner');

						findBusinessPartner();
					},
					onBack: function () {
						showError(false, '', errorType.error);
						$scope.step = dialogStatus.searchSupplier;
					},
					onOK: function () {
						var bpGridData = $scope.chooseBidderDataContainer.bpGridData,
							bpMapContactDic = {},
							checkedBpList = _.filter(bpGridData, {BpIsExisted: true});

						for (var i = 0; i < checkedBpList.length; i++) {
							var bpItem = checkedBpList[i];
							bpMapContactDic[bpItem.Id] = null;
							var checkedContactList = _.filter(bpItem.ContactDtos, {bpContactCheck: true});
							if (checkedContactList.length) {
								bpMapContactDic[bpItem.Id] = checkedContactList[0].Id;
							}
						}

						if (checkedBpList.length > 0) {
							procurementRfqBusinessPartnerWizardService
								.createRfqBusinessPartner(rfqHeaderId, checkedBpList, bpMapContactDic)
								.then(function (data) {
									afterCreateRfqWizardForSelectBpList(data);
								}, function (error) {
									requestDataFail(error);
								});
						} else {
							showError(true, $translate.instant(translatePrefix + '.noBidderCreate'), errorType.error);
						}
					},
					close: function () {
						$scope.$close(false);
					},
					cancel: function () {
						$scope.$close(false);
					}
				};

				$scope.$watch(function () {
					$scope.btnNextStatus = ($scope.findBidderSetting.prcstructure.isActive && !$scope.findBidderSetting.prcstructure.selectedItemFk) ||
						($scope.findBidderSetting.withCharacteristic.isActive && $scope.findBidderSetting.withCharacteristic.hasError);
				});

				// init
				function init() {

					$scope.step = dialogStatus.searchSupplier;

					var foreignKeyValue = rfqHeaderProjectFk;
					var lookupType = 'Project';
					var targetFieldNameInForeignKeyEntity = 'AddressFk';
					var callbackFunction = function (targetFieldValue) {
						$scope.findBidderSetting.location.isDisabled = !targetFieldValue;
					};
					var callbackWhenEmptyValue = function () {
						$scope.findBidderSetting.location.isDisabled = true;
					};
					processFieldInForeignKeyEntityService.processFieldInForeignKeyEntity(foreignKeyValue, lookupType, targetFieldNameInForeignKeyEntity, callbackFunction, callbackWhenEmptyValue);

					procurementRfqBusinessPartnerWizardService.getStructureCodes(rfqHeaderId).then(function (data) {
						if (!data || data.length === 0) {
							$scope.findBidderSetting.prcstructure.isActive = false;
							return;
						}

						$scope.findBidderSetting.prcstructure.selectedItemFk = data[0];

						procurementRfqBusinessPartnerWizardService.getEvaluationSchema(data).then(function (schemas) {
							if (schemas.length > 0) {
								$scope.findBidderSetting.evaluation.selectedItemFk = schemas[0].Id;
							}
						});
					}
					);

					var requisitionList = procurementRfqRequisitionService.getList();
					if (requisitionList.length > 0) {
						procurementRfqBusinessPartnerWizardService.getDefaultAddress(requisitionList[0].ReqHeaderFk).then(function (data) {
							if (data && data.Id) {
								$scope.findBidderSetting.location.regional.selectedItemFk = data.CountryFk;
							}
						});
					}
				}

				function showError(isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				}

				function setBpGridData(data) {
					$scope.chooseBidderDataContainer.bpGridData = data.BidderList;
					$scope.chooseBidderDataContainer.businessPartnerAndContactMapping = data.RfqBpMapContactId;
					setBidderReadOnly(data.BidderList, data.RfqBpMapContactId);

					function setBidderReadOnly(bpGridData, selectedBp) {
						_.forEach(selectedBp, function (bp) {
							var item = _.find(bpGridData, {'Id': bp.BusinessPartnerFk});
							platformRuntimeDataService.readonly(item, [{field: 'BpIsExisted', readonly: true}]);
						});
					}
				}

				function findBusinessPartner() {

					var setting = $scope.findBidderSetting,
						location = setting.location,
						bidder = setting.bidder,
						evaluation = setting.evaluation,
						withCharacteristic = setting.withCharacteristic,
						prcstructure = setting.prcstructure;

					if (location.isActive) {
						if (location.regional.isActive && !location.regional.selectedItemFk) {
							showError(true, $translate.instant(translatePrefix + '.selectCountryError'), errorType.error);
							return;
						}
					}

					// fillBidderError
					if (bidder.isActive && !bidder.bidderName) {
						showError(true, $translate.instant(translatePrefix + '.fillBidderError'), errorType.error);
						return;
					}

					if (evaluation.isActive && !evaluation.selectedItemFk) {
						showError(true, $translate.instant(translatePrefix + '.selectEvaluationError'), errorType.error);
						return;
					}

					var findBidderDto = {
						rfqHeaderId: rfqHeaderId,
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
						structureFk: prcstructure.selectedItemFk
					};
					procurementRfqBusinessPartnerWizardService
						.findBidder(findBidderDto)
						.then(function (response) {
							setBpGridData(response);

							$scope.step = dialogStatus.chooseSupplier;
						}, function (error) {
							requestDataFail(error);
						});
				}

				function afterCreateRfqWizardForSelectBpList(response) {
					$scope.modalOptions.loading.dialogLoading = false;
					if (response.Message === CreateBpWizardResult.NotNeedSelectFindSupplier) {
						showError(true, $translate.instant(translatePrefix + '.notNeedSelectFindSupplier'), errorType.error);
					} else if (response.Message === CreateBpWizardResult.NoBpSearchOut) {
						showError(true, $translate.instant(translatePrefix + '.responseNoData'), errorType.error);
					} else if (response.Message === CreateBpWizardResult.NoMatchBpSearchOut || response.Message === CreateBpWizardResult.MatchAndSaveSuccess) {
						showDialog(response);
					}
				}

				function showDialog(response) {

					var message = '<p>' + $translate.instant(translatePrefix + '.findSupplierResult.oldSupplierCount') + ' ' +
						response.OldResultCount + ' ' + '</p>';

					message += '<p>' + $translate.instant(translatePrefix + '.findSupplierResult.resultSaveCount') + ' ' +
						response.resultCount + '</p>';
					$scope.$close(false);
					var modalOptions = {
						headerTextKey: 'cloud.common.informationDialogHeader',
						bodyTextKey: message,
						showOkButton: true,
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions).then(function () {
						stateGo(response.Entity);
					});
				}

				function requestDataFail() {
					$scope.modalOptions.loading.dialogLoading = false;
					showError(true, $translate.instant(translatePrefix + '.createBusinessPartnerFail'), errorType.error);
				}

				function stateGo(data) {
					$scope.$close(false);
					var url = globals.defaultState + '.' + 'procurement.rfq'.replace('.', '');
					$state.go(url).then(function () {
						cloudDesktopSidebarService.filterSearchFromPKeys([data.Id]);
					});
				}

				$scope.setContactGridDataByBidder = function (entity, checked) {
					// if entity.ContactDtos is an Object, this line is very good to turn it to Array. todo livia
					var contactList = [];
					contactList = contactList.concat(entity.ContactDtos);

					setDefaultContact(!!checked);

					$scope.chooseBidderDataContainer.contactGridData = contactList;
					procurementRfqBusinessPartnerContractService.setDataList(contactList);
					procurementRfqBusinessPartnerContractService.refreshGrid();

					function setDefaultContact(isChecked) {
						_.find(contactList, function (item) {
							if (item.IsDefault) {
								item.bpContactCheck = isChecked;
								return true;
							}
						});
					}

				};

				init();
			}
		]);

	angular.module(moduleName).controller('procurementRfqBusinessPartnerController',
		['platformGridControllerService', '$scope', '$translate', 'platformGridAPI', 'procurementRfqWizardBusinessPartnerListService',
			'procurementRfFindSupplierBusinessPartnerGridColumns', '$timeout', 'procurementRfqBusinessPartnerWizardContractService', 'platformRuntimeDataService',
			function (gridControllerService, $scope, $translate, platformGridAPI, procurementRfqBusinessPartnerService,
				gridColumns, $timeout, procurementRfqBusinessPartnerContractService, platformRuntimeDataService) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.data = [];
				$scope.gridId = '9A4B5E8794CA4830AB2AE95D4505D5D6';

				$scope.onContentResized = function () {
				};
				$scope.setTools = function () {
				};

				// set data to grid
				var setDataSource = function (data) {
					$scope.data = data;
					procurementRfqBusinessPartnerService.setDataList(data);
					setContactGridChecked(data, $scope.chooseBidderDataContainer.businessPartnerAndContactMapping);
					procurementRfqBusinessPartnerService.refreshGrid();
					$scope.onContentResized();
				};

				// init
				var init = function () {
					setDataSource($scope.chooseBidderDataContainer.bpGridData);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					gridControllerService.initListController($scope, gridColumns, procurementRfqBusinessPartnerService, null, gridConfig);
				};

				function onSelectedRowsChanged(/* e, arg */) {// jshint ignore:line
					var selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					if (selected) {
						$scope.modalOptions.body.contactGridTitle = $scope.modalOptions.body.contactGridTitleCopy +
							'（' + selected.BusinessPartnerName1 + ')';
						$scope.chooseBidderDataContainer.contactGridData = selected.ContactDtos;
						procurementRfqBusinessPartnerContractService.setDataList(selected.ContactDtos);
						procurementRfqBusinessPartnerContractService.refreshGrid();
					}
				}

				/**
				 * when the bplist grid data init, read the mapping and set the contact list check
				 * @param bpList
				 * @param mapping
				 */
				function setContactGridChecked(bpList, mapping) {
					for (var i = 0; i < mapping.length; i++) {
						var bpId = mapping[i].BusinessPartnerFk,
							contactId = mapping[i].ContactFk,
							bpItem = _.filter(bpList, {Id: bpId});
						if (bpItem.length) {
							var contactDtos = bpItem[0].ContactDtos,
								contactItem = _.filter(contactDtos, {Id: contactId});
							_.forEach(contactDtos, function (item) { // jshint ignore : line
								platformRuntimeDataService.readonly(item, [{field: 'bpContactCheck', readonly: true}]);
							});
							if (contactItem.length) {
								contactItem[0].bpContactCheck = true;
							}
						}
					}
				}

				// resize the grid
				$timeout(function () { // use timeout to do after the grid instance is finished
					platformGridAPI.grids.resize($scope.gridId);
				});

				init();

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
				});
			}
		]);

	angular.module(moduleName).controller('procurementRfqBusinessPartnerContractController',
		['platformGridControllerService', '$scope', 'platformGridAPI', 'procurementRfqBusinessPartnerWizardContractService',
			'procurementRfFindSupplierBusinessPartnerContractGridColumns', '$timeout', '$translate',
			function (gridControllerService, $scope, platformGridAPI,
				procurementRfqBusinessPartnerContractService, gridColumns, $timeout, $translate) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.gridId = '106745809A624F308577572A22354E99';

				$scope.onContentResized = function () {
				};

				$scope.setTools = function () {
				};

				$scope.uniqueContactCheckValidation = function (entity, checked) {

					if (!checked) {
						return {
							apply: true,
							error: '',
							error$tr$: '',
							valid: true
						};
					}

					var contactList = $scope.chooseBidderDataContainer.contactGridData;
					var isCheckedCount = 1;// if checked is true, this must be 1
					for (var i = 0; i < contactList.length; i++) {
						var contact = contactList[i];
						if (contact.bpContactCheck) {
							isCheckedCount++;
						}
					}

					if (isCheckedCount > 1) {
						return {
							apply: true,
							error: $translate.instant('procurement.rfq.wizard.uniqueContactError'),
							error$tr$: $translate.instant('procurement.rfq.wizard.uniqueContactError'),
							valid: false
						};
					} else {
						return {
							apply: true,
							error: '',
							error$tr$: '',
							valid: true
						};
					}
				};

				// set data to grid
				var setDataSource = function (data) {
					procurementRfqBusinessPartnerContractService.setDataList(data);
					procurementRfqBusinessPartnerContractService.refreshGrid();
					$scope.onContentResized();
				};

				// init
				var init = function () {
					setDataSource([]);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					gridControllerService.initListController($scope, gridColumns, procurementRfqBusinessPartnerContractService, null, gridConfig);
				};

				// resize the grid
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});

				init();
			}
		]);
})(angular);
