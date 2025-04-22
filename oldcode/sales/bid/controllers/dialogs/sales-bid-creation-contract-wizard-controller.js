/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name salesBidCreationContractWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard creation bill dialog
	 **/

	angular.module('sales.bid').controller('salesBidCreationContractWizardController', [
		'_', '$scope', '$log', '$modalInstance', '$injector', '$translate', 'salesBidCreateContractWizardDialogService', 'salesBidCreateWizardDialogUIService', 'platformModalService',
		function (_, $scope, $log, $modalInstance, $injector, $translate, salesBidCreateContractWizardDialogService, salesBidCreateWizardDialogUIService, platformModalService) {

			$scope.generateType = 'create';
			// $scope.entity = salesBidCreateContractWizardDialogService.getBidSelected();
			var bidEntity = salesBidCreateContractWizardDialogService.getBidSelected();
			$scope.entity = {
				TypeFk: null,
				BidId: bidEntity.Id,
				RubricCategoryFk: bidEntity.RubricCategoryFk,
				ConfigurationFk: bidEntity.ConfigurationFk,
				Description: bidEntity.DescriptionInfo.Translated,
				ProjectFk: bidEntity.ProjectFk,      // for later usage in mainContractFilter
				BillToFk: null,
				ChangeOrderFk: null
			};
			var filterKey = 'sales-bid-rubric-category-by-order-confirmation-filter';
			var mainContractFilterKey = 'sales-bid-create-contract-wizard-main-contract-filter';

			var config = salesBidCreateWizardDialogUIService.getCreateFormConfiguration(onSelectedItemChangedHandler, filterKey, mainContractFilterKey, bidEntity); // Order Confirmation ([BAS_RUBRIC])
			var mainContractCfg = _.find(config.rows, {model: 'OrdHeaderFk'});
			var changeOrderCfg = _.find(config.rows, {model: 'ChangeOrderFk'});

			// Contract Type
			var contractTypeLookupConfig = $injector.get('basicsLookupdataConfigGenerator').provideGenericLookupConfigForForm(
				'basics.customize.ordertype',
				'Description',
				{
					gid: 'baseGroup',
					rid: 'typeFk',
					model: 'TypeFk',
					required: true,
					sortOrder: 0,
					label: 'Type',
					label$tr$: 'sales.contract.entityContractTypeFk',
					validator: function onTypeChanged(/* entity, typeId */) {
						// TODO: check if obsolete => watch is used instead
					}
				},
				false, // caution: this parameter is ignored by the function
				{
					required: true,
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					filterKey: 'sales-contract-type-with-rubric-filter'
				}
			);

			config.version = '0.4.0';
			config.groups[0].attributes.unshift('typefk');
			config.rows.unshift(contractTypeLookupConfig);

			$scope.formOptions = {
				configure: config
			};

			// Add filter to typeFk
			_.find($scope.formOptions.configure.rows, { rid: 'typeFk' }).options.filterKey = 'sales-contract-type-with-rubric-filter';

			// make rubric category readonly (after contract type was introduced)
			$injector.get('platformRuntimeDataService').readonly($scope.entity, [{field: 'RubricCategoryFk', readonly: true}]);

			// TODO: see alm 143013 for details
			// try to pre-populate main contract
			salesBidCreateContractWizardDialogService.getMainContract(bidEntity.Id).then(function (response) {
				var mainContract = response.data;
				if (mainContract !== null && mainContract.Id > 0 && $scope.entity.TypeFk !== 1 && $scope.entity.TypeFk !== null) {
					$scope.entity.OrdHeaderFk = mainContract.Id;
				}
				else{
					$scope.entity.OrdHeaderFk = null;
				}
			});

			var salesContractTypeLookupDataService = $injector.get('salesContractTypeLookupDataService');

			// try to populate type with related type of current selected bid
			salesContractTypeLookupDataService.getRelatedTypeByBidType(bidEntity.TypeFk).then(function (contractTypeEntity) {
				$scope.entity.TypeFk = _.get(contractTypeEntity, 'Id') || null;

				// no related type found? => we will try to get the default
				if ($scope.entity.TypeFk === null) {
					salesContractTypeLookupDataService.getDefaultAsync().then(function (defaultContractTypeEntity) {
						$scope.entity.TypeFk = _.get(defaultContractTypeEntity, 'Id') || null;
					});
				}
			});

			$scope.isOkDisabled = function isOkDisabled() {
				if ((_.isNil($scope.entity.OrdHeaderFk) && mainContractCfg.required) ||
					(_.isNil($scope.entity.ChangeOrderFk) && changeOrderCfg.required) ||
					_.isNil($scope.entity.RubricCategoryFk)) {
					return true;
				}
				return false;
			};

			$scope.$watch('entity.TypeFk', function (newTypeId /* , oldRubricCat */) {
				if (newTypeId > 0) {
					salesContractTypeLookupDataService.getItemByIdAsync(newTypeId).then(function (typeEntity) {
						$scope.entity.TypeEntity = _.has(typeEntity, 'Id') ? typeEntity :  null; // more convenient

						// suggest main contract
						salesBidCreateContractWizardDialogService.suggestMainContractForChangeOrSide($scope.entity);

						// populate related values like rubric category
						var rubricCategoryId = typeEntity.RubricCategoryFk;
						$scope.entity.RubricCategoryFk = rubricCategoryId;
						// TODO:
						//   - setCodeByRubricCategory(entity, rubricCategoryId);
						//   - reset configuration id
						//   - => setDefaultConfigurationByRubricCategory(rubricCategoryId);

						// make field Main-Contract mandatory if type is change/side contract
						if (typeEntity.IsMain) {
							mainContractCfg.required = false;
							mainContractCfg.visible = false;

							changeOrderCfg.required = false;
							changeOrderCfg.visible = false;
						}
						else if (typeEntity.IsSide) {
							mainContractCfg.required = true;
							mainContractCfg.visible = true;
							mainContractCfg.options.lookupOptions.showClearButton = false;

							changeOrderCfg.required = false;
							changeOrderCfg.visible = false;
							changeOrderCfg.options.lookupOptions.showClearButton = true;
						} else if (typeEntity.IsChange) {
							mainContractCfg.required = true;
							mainContractCfg.visible = true;
							mainContractCfg.options.lookupOptions.showClearButton = false;

							changeOrderCfg.required = true;
							changeOrderCfg.visible = true;
							changeOrderCfg.options.lookupOptions.showClearButton = false;
						}
						else {
							$log.warn('salesBidCreationContractWizardController -> type change: not IsMain, not IsSide, not IsChange!?');
						}
						$scope.$broadcast('form-config-updated');
					});
				}
			});

			$scope.$watch('entity.RubricCategoryFk', function (newRubricCat /* , oldRubricCat */) {
				// sales configuration: set default by rubric category
				$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
					var items = _.filter(data, {RubricCategoryFk: newRubricCat});
					if (_.size(items) > 0) {
						$scope.entity.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
					}
				});
			});

			$scope.modalOptions = {
				headerText: $translate.instant('sales.bid.wizardCWCreateContract'),
				ok: ok,
				close: close,
				cancel: close
			};

			$scope.loading = {
				show: false,
				text: $scope.generateType === 'create' ? $translate.instant('sales.bid.wizardCWCreateContractInProgress') : $translate.instant('sales.bid.wizardCWUpdateContractInProgress')
			};

			function ok() {
				if ($scope.generateType === 'create') {
					$scope.loading.show = true;
					salesBidCreateContractWizardDialogService.canCreateContractFromBid($scope.entity).then(function (canCreateResult) {

						var platformDialogService = $injector.get('platformDialogService');
						var $q = $injector.get('$q');
						if (canCreateResult.canCreate) {

							var promiseCreateContract = $q.when(true);
							if (canCreateResult.needConfirm) {
								promiseCreateContract = platformDialogService.showYesNoDialog(canCreateResult.msg, 'sales.bid.wizardCWCreateContract', 'no').then(function (result) {
									return !!(result.yes);
								});
							}

							promiseCreateContract.then(function (createContract) {
								if (createContract === true) {
									salesBidCreateContractWizardDialogService.isUniqueContract($scope.entity.BidId, $scope.entity.BillToFk).then(function (isUnique) {// $scope.entity.Id
										// contract for this bid does not already exist
										if (isUnique) {
											createContractFromBid();
										} else {
											// bill-to case
											// a) contract for this bid with the same bill-to was already created
											// b) Bid A -> Contract 1 (without setting bill-to); again Bid A -> Contract 2 (without bill-to)
											var type = ($scope.entity.BillToFk !== null) ? 'billto' : null;
											salesBidCreateContractWizardDialogService.createContractDialogConfirmation(type).then(function (result) {
												if (result.yes) {
													createContractFromBid();
												} else {
													close();
												}
											});
										}
									});
								} else {
									$scope.loading.show = false;
								}
							});

						} else {
							platformDialogService.showInfoBox(canCreateResult.msg);
							$scope.loading.show = false;
						}
					});
				}
				else {
					updateContractFromBid();
				}
			}

			function close() {
				$modalInstance.dismiss('cancel');
			}

			function onRubricCatChange(rubricCatId) {
				rubricCatId = rubricCatId || $scope.entity.RubricCategoryFk;
				var lookupType = 'basicsMasterDataRubricCategoryLookupDataService';
				var lookupService = $injector.get(lookupType);
				lookupService.setFilter(5);
				lookupService.getList({lookupType: lookupType}).then(function () {
					// If we find type FK than we set rubric category according to type
					// TODO: Check if we can make this code simpler
					if ($scope.entity.TypeFk) {
						salesContractTypeLookupDataService.getItemByIdAsync($scope.entity.TypeFk).then(function (typeEntity) {
							$scope.entity.RubricCategoryFk = typeEntity.RubricCategoryFk;
						});
					}
					else {
						// If we do not find type FK than take default rubric category
						var item = lookupService.getItemById(rubricCatId, {lookupType: lookupType});
						item = item || lookupService.getDefault({lookupType: lookupType});
						$scope.entity.RubricCategoryFk = item ? item.Id : null;
					}
				});
			}
			function handleResponse(response, generateType) {
				var newContract = response.data;
				var navigator = {moduleName: 'sales.contract'};

				$scope.loading.show = false;
				close();

				var modalOptions = {
					templateUrl: 'sales.common/templates/sales-common-header-created-navigation-dialog.html',
					headerText: $translate.instant(generateType === 'update' ? 'sales.common.contractUpdated.header' : 'sales.common.contractCreated.header'),
					bodyText: $translate.instant(generateType === 'update' ? 'sales.common.contractUpdated.body' : 'sales.common.contractCreated.body', { code: newContract.Code }),
					okBtnText: $translate.instant(generateType === 'update' ? 'sales.common.contractUpdated.okBtn' : 'sales.common.contractCreated.okBtn'),
					navigate: function() {
						$injector.get('platformModuleNavigationService').navigate(navigator, newContract);
						$injector.get('salesCommonUtilsService').toggleSideBarWizard();
						this.cancel();
					}
				};
				platformModalService.showDialog(modalOptions);
			}
			function handleLoading() {
				$scope.loading.show = false;
			}

			function createContractFromBid() {
				salesBidCreateContractWizardDialogService.createContractFromBid($scope.entity)
					.then(function (response) {
						handleResponse(response, 'create');
					});
				handleLoading();
			}

			function updateContractFromBid() {
				salesBidCreateContractWizardDialogService.updateContractFromBid($scope.entity)
					.then(function (response) {
						handleResponse(response, 'update');
					});
				handleLoading();
			}
			$scope.onGenerateTypeChange = function (generateType) {
				$scope.generateType = generateType;
				if ($scope.generateType === 'update') {
					$scope.formOptions.configure.rows.push({
						gid: 'baseGroup',
						rid: 'contract',
						label: 'Code',
						label$tr$: 'Code',
						model: 'Code',
						required: true,
						type: 'directive',
						directive: 'sales-contract-code-selector',
						options: {
							filterKey: 'sales-contract-code-filter',
							valueMember: 'Code',
							displayMember: 'Code',
						},
						sortOrder: 2,
						visible: true,
					});
				}
				else if ($scope.generateType === 'create') {
					let contractIndex = $scope.formOptions.configure.rows.findIndex(row => row.rid === 'contract');
					$scope.formOptions.configure.rows[contractIndex] = {};
				}
				$scope.generateType === 'create' ? $scope.modalOptions.headerText = $translate.instant('sales.bid.wizardCWCreateContract') : $scope.modalOptions.headerText = $translate.instant('sales.bid.wizardCWUpdateContract');
				$scope.$parent.$broadcast('form-config-updated', {});
			};
			$scope.onGenerateTypeChange($scope.generateType);
			function onSelectedItemChangedHandler(e, args) {
				salesBidCreateContractWizardDialogService.onRubricCategoryChanged.fire(args.selectedItem.Id);
			}

			salesBidCreateContractWizardDialogService.registerFilters();
			salesBidCreateContractWizardDialogService.onRubricCategoryChanged.register(onRubricCatChange);
			salesBidCreateContractWizardDialogService.onRubricCategoryChanged.fire();

			$scope.$on('$destroy', function () {
				salesBidCreateContractWizardDialogService.unregisterFilters();
				salesBidCreateContractWizardDialogService.onRubricCategoryChanged.unregister(onRubricCatChange);
			});
		}]);
})();
