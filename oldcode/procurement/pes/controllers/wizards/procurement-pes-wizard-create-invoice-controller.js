/**
 * Created by lvy on 6/14/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).controller('ProcurementPesCreateInvoiceController', [
		'$scope', '$rootScope', '$timeout', '$translate', 'platformTranslateService', 'platformModuleNavigationService', 'procurementPesHeaderService', 'basicsLookupdataLookupDescriptorService', 'procurementPesWizardCreateInvoiceService', 'platformDataValidationService', 'platformModuleStateService','platformModuleInfoService', 'platformRuntimeDataService',
		function ($scope, $rootScope, $timeout, $translate, platformTranslateService, platformModuleNavigationService, procurementPesHeaderService, basicsLookupdataLookupDescriptorService, procurementPesWizardCreateInvoiceService, platformDataValidationService, platformModuleStateService,platformModuleInfoService, platformRuntimeDataService) {
			$scope.options = $scope.$parent.modalOptions;
			$scope.createInvParameter = [];
			$scope.createFailDetail = [];
			$scope.createSuccessDetail = [];
			$scope.createFailDetailShow = false;
			$scope.createSuccessDetailShow = false;
			$scope.currentItem = {};
			$scope.currentItemNum = 0;
			$scope.currentItemSum = 0;
			$scope.nextItemDisabled = true;
			$scope.previousItemDisabled = true;
			var entities = $scope.options.currentItem;
			var headerMainText = $translate.instant('procurement.pes.wizard.createInvoiceCaption');
			var pesHaveDifferentVatgroup = $translate.instant('procurement.pes.wizard.pesHaveDifferentVatgroup');
			var vatgroupFromPesLowest = $translate.instant('procurement.pes.wizard.vatgroupFromPesLowest');

			var conHeaderView = basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
			var pesStatuses = basicsLookupdataLookupDescriptorService.getData('PesStatus');
			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];

			var formConfig = procurementPesWizardCreateInvoiceService.getformConfig();

			// translate form config.
			platformTranslateService.translateFormConfig(formConfig);
			$scope.formContainerOptions = {};
			$scope.formContainerOptions.formOptions = {
				configure: formConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.modalOptions = {
				cancelButtonText: $translate.instant('cloud.common.cancel'),
				closeButtonText: $translate.instant('cloud.common.close'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: headerMainText,
				// goToButtonText: $translate.instant('cloud.common.Navigator.goTo'),
				goToButtonText: platformModuleInfoService.getNavigatorTitle('procurement.invoice'),
				message: $translate.instant('basics.common.validation.correctValidationErrors'),
				cannotCreateMessage: '',
				nextButtonText: $translate.instant('basics.common.button.nextStep'),
				previousButtonText: $translate.instant('basics.common.button.previousStep'),
				createInvoiceForOnePes: $translate.instant('procurement.pes.wizard.createInvoiceForOnePes'),
				createInvoiceForSameContract: $translate.instant('procurement.pes.wizard.createInvoiceForSameContract'),
				createInvoiceForAllPes: $translate.instant('procurement.pes.wizard.createInvoiceForAllPes'),
				step: 'step1',
				createMehtod: 'one2one',
				originCreateMehtod: ''
			};
			$scope.isSuccessed = false;
			$scope.stepOneNextDisabled = false;
			$scope.stepOneShowMessage = false;
			$scope.hasErrors = function checkForErrors() {
				return platformDataValidationService.hasErrors(procurementPesWizardCreateInvoiceService);
			};

			setIsCannotCreateProp(entities.Pes);
			var cannotCreate = _.filter(entities.Pes, {CannotCreate: true});
			if (cannotCreate.length === entities.Pes.length) {
				$scope.modalOptions.createMehtod = '';
				$scope.modalOptions.cannotCreateMessage = $translate.instant('procurement.pes.wizard.cannotCreateInvForStatus', {
					pesCode: ''
				});
				$scope.stepOneNextDisabled = true;
				$scope.stepOneShowMessage = true;
			}
			else if (cannotCreate.length !== 0) {
				var cannotCreateCodes = _.map(cannotCreate, 'Code');
				$scope.modalOptions.cannotCreateMessage = $translate.instant('procurement.pes.wizard.cannotCreateInvForStatus', {
					pesCode: cannotCreateCodes.join(',')
				});
				entities.Pes = _.filter(entities.Pes, {CannotCreate: false});
				$scope.stepOneShowMessage = true;
			}

			$scope.modalOptions.back = function onBack() {
				if ($scope.currentItemNum === 2) {
					$scope.currentItemNum = 1;
					$scope.previousItemDisabled  = true;
				}
				else {
					$scope.currentItemNum -= 1;
				}
				if ($scope.currentItemNum !== $scope.currentItemSum) {
					$scope.nextItemDisabled = false;
				}
				$scope.createInvParameter[$scope.currentItemNum] = $scope.currentItem;
				$scope.currentItem = $scope.createInvParameter[$scope.currentItemNum-1];

				$scope.modalOptions.headerText = headerMainText + ' ' + $scope.currentItemNum + '/' + $scope.currentItemSum;
				if ($scope.modalOptions.createMehtod === 'one2one') {
					$scope.modalOptions.headerText += ' - Pes"' + $scope.currentItem.PesCode + '"';
				}
				else if ($scope.modalOptions.createMehtod === 'one2samecontract') {
					$scope.modalOptions.headerText += ' - Contract"' + $scope.currentItem.ContractCode + '"';
				}
			};
			$scope.modalOptions.next = function onNext() {
				if ($scope.modalOptions.originCreateMehtod !== $scope.modalOptions.createMehtod) {
					$scope.modalOptions.originCreateMehtod = $scope.modalOptions.createMehtod;
					$scope.createInvParameter = [];
					if ($scope.modalOptions.createMehtod === 'one2one') {
						_.forEach(entities.Pes, function (pes, idx) {
							let codeConfig = entities.pesConfig2InvConfig[pes.PrcConfigurationFk];
							$scope.createInvParameter.push({
								Id: idx,
								PesIds: [pes.Id],
								PesCode: pes.Code,
								ConHeaderFk: pes.ConHeaderFk,
								Reference: entities.InvoiceNo,
								Code: codeConfig.InvoiceCode,
								CodeReadonly: codeConfig.InvoiceCodeReadonly,
								PrcConfigFk: codeConfig.Id,
								PrcConfigHeaderFk: codeConfig.PrcConfigHeaderFk,
								InvTypeFk: codeConfig.InvTypeFk,
								RubricCategoryFk: codeConfig.RubricCategoryFk,
								ProjectFk: pes.ProjectFk,
								DateInvoiced: entities.DateInvoiced,
								vatGroupMessage: null,
								Version: 0
							});
						});
					}
					else if ($scope.modalOptions.createMehtod === 'one2samecontract') {
						var arrFromContract = {};
						var idx = 0;
						_.forEach(entities.Pes, function (pes) {
							var k;
							if (!pes.ConHeaderFk) {
								k = -1;
							}
							else {
								k = pes.ConHeaderFk;
							}
							var conHeader = _.find(conHeaderView, {Id: pes.ConHeaderFk});
							if (!arrFromContract[k]) {
								let codeConfig = entities.pesConfig2InvConfig[pes.PrcConfigurationFk];
								arrFromContract[k] = {};
								arrFromContract[k] = {
									Id: idx,
									PesIds: [pes.Id],
									ConHeaderFk: pes.ConHeaderFk,
									Reference: entities.InvoiceNo,
									Code: codeConfig.InvoiceCode,
									CodeReadonly: codeConfig.InvoiceCodeReadonly,
									PrcConfigFk: codeConfig.Id,
									PrcConfigHeaderFk: codeConfig.PrcConfigHeaderFk,
									InvTypeFk: codeConfig.InvTypeFk,
									RubricCategoryFk: codeConfig.RubricCategoryFk,
									ProjectFk: pes.ProjectFk,
									BpdVatGroupFk: pes.BpdVatGroupFk,
									DateInvoiced: entities.DateInvoiced,
									ContractCode: conHeader ? conHeader.Code : '',
									vatGroupMessage: null,
									Version: 0
								};
								idx++;
							}
							else {
								arrFromContract[k].PesIds.push(pes.Id);
								if (arrFromContract[k].BpdVatGroupFk !== pes.BpdVatGroupFk) {
									arrFromContract[k].vatGroupMessage = [pesHaveDifferentVatgroup, vatgroupFromPesLowest];
								}
							}
						});
						for (var h in arrFromContract) {
							if (arrFromContract[h]) {
								$scope.createInvParameter.push(arrFromContract[h]);
							}
						}

					}
					else if ($scope.modalOptions.createMehtod === 'one2all') {
						var pesIds = [];
						var preVatgroupfk = null;
						var isDifferentVatgroup = false;
						_.forEach(entities.Pes, function (pes, idx) {
							pesIds.push(pes.Id);
							if (idx === 0) {
								preVatgroupfk = pes.BpdVatGroupFk;
							}
							else if (preVatgroupfk !== pes.BpdVatGroupFk) {
								isDifferentVatgroup = true;
							}
						});
						pesIds.sort(function(a,b) {
							return a-b;
						});
						var pesMinId = _.find(entities.Pes, {Id: pesIds[0]});
						let codeConfig = entities.pesConfig2InvConfig[pesMinId.PrcConfigurationFk];
						$scope.createInvParameter.push({
							Id: 0,
							PesIds: pesIds,
							ConHeaderFk: pesMinId.ConHeaderFk,
							Reference: entities.InvoiceNo,
							Code: codeConfig.InvoiceCode,
							CodeReadonly: codeConfig.InvoiceCodeReadonly,
							PrcConfigFk: codeConfig.Id,
							PrcConfigHeaderFk: codeConfig.PrcConfigHeaderFk,
							InvTypeFk: codeConfig.InvTypeFk,
							RubricCategoryFk: codeConfig.RubricCategoryFk,
							ProjectFk: pesMinId.ProjectFk,
							DateInvoiced: entities.DateInvoiced,
							vatGroupMessage: isDifferentVatgroup === true ? [pesHaveDifferentVatgroup, vatgroupFromPesLowest] : null,
							Version: 0
						});
					}
					$scope.currentItemSum = $scope.createInvParameter.length;
				}
				if ($scope.currentItemNum === 0) {
					$scope.currentItem = $scope.createInvParameter[$scope.currentItemNum];
					$scope.currentItemNum = 1;
					$scope.modalOptions.step = 'step2';
					procurementPesWizardCreateInvoiceService.createItemsFromPes($scope.createInvParameter);
				}
				else {
					$scope.createInvParameter[$scope.currentItemNum - 1 ] = $scope.currentItem;
					$scope.currentItem = $scope.createInvParameter[$scope.currentItemNum];
					$scope.currentItemNum += 1;
					$scope.previousItemDisabled  = false;
				}
				platformRuntimeDataService.readonly($scope.currentItem, [{field: 'Code', readonly: $scope.currentItem.CodeReadonly}]);
				$scope.nextItemDisabled = $scope.currentItemNum === $scope.currentItemSum;

				$scope.modalOptions.headerText = headerMainText + ' ' + $scope.currentItemNum + '/' + $scope.currentItemSum;
				if ($scope.modalOptions.createMehtod === 'one2one') {
					$scope.modalOptions.headerText += ' - Pes"' + $scope.currentItem.PesCode + '"';
				}
				else if ($scope.modalOptions.createMehtod === 'one2samecontract') {
					$scope.modalOptions.headerText += ' - Contract"' + $scope.currentItem.ContractCode + '"';
				}
			};
			$scope.modalOptions.ok = function onOK() {
				$scope.isLoading = true;
				$scope.previousItemDisabled  = true;
				$scope.nextItemDisabled = true;
				$scope.modalOptions.step = 'step3';
				$scope.modalOptions.headerText = headerMainText;
				var params = [];
				_.forEach($scope.createInvParameter, function (i) {
					params.push({
						PesIds: i.PesIds,
						ConHeaderFk: i.ConHeaderFk,
						Reference: i.Reference,
						Code: i.Code,
						ProjectFk: i.ProjectFk,
						DateInvoiced: i.DateInvoiced,
						PrcConfigFk: i.PrcConfigFk,
						InvTypeFk: i.InvTypeFk
					});
				});
				var promise = $scope.options.dataProcessor.call(this, params);

				promise.then(function (res) {
					$scope.isLoading = false;
					$scope.isSuccessed = true;
					$scope.resData = [];

					if (res.data.length) {
						_.forEach(res.data, function (d) {
							if (d.Message[0]) {
								let msg = d.Message[0];
								let msgFirst = $translate.instant('procurement.pes.wizard.createInvSuccess');
								let msgSecond =$translate.instant('procurement.pes.wizard.newCode',{newCode:msg});
								$scope.createSuccessDetail.push({'msgFirst':msgFirst,'msgSecond':msgSecond});
							}
							if (d.Error[0]) {
								$scope.createFailDetail.push(d.Error[0]);
							}
							if (d.InvHeader) {
								$scope.resData.push(d);
							}
						});
						if ($scope.createSuccessDetail.length) {
							$scope.createSuccessDetailShow = true;
						}
						if ($scope.createFailDetail.length) {
							$scope.createFailDetailShow = true;
						}
					}

					$scope.modalOptions.closeButtonText = $translate.instant('cloud.common.close'); // set cancel btn display 'close'

				}, function (/* error */) {
					$scope.isLoading = false;
					$scope.isFailed = true;

					$scope.createFailDetail.push('Create Failed!'); // display update feedback
					$scope.modalOptions.closeButtonText = $translate.instant('cloud.common.close'); // set cancel btn display 'close'
				});
			};

			$scope.modalOptions.close = function onCancel() {
				var modState = platformModuleStateService.state(procurementPesWizardCreateInvoiceService.getModule());
				if (modState.validation && modState.validation.issues) {
					modState.validation.issues = [];
				}
				procurementPesHeaderService.refresh();
				$scope.$close(false);
			};
			$scope.modalOptions.cancel = $scope.modalOptions.close;

			$scope.modalOptions.goToInvoice = function onGoTo() {
				platformModuleNavigationService.navigate({
					moduleName: 'procurement.invoice'
				}, $scope.resData, 'CreateFromPes'
				);

				$scope.$close(false);
			};

			function setIsCannotCreateProp(pess) {
				_.forEach(pess, function (pes) {
					var isCannotCreate = true;
					if (pesStatuses && pes && pes.PesStatusFk && pesStatuses[pes.PesStatusFk]) {
						var pesStatus = pesStatuses[pes.PesStatusFk];
						if (pesStatus.IsInvoiced === false && pesStatus.IsCanceled === false && pesStatus.IsVirtual === false) {
							isCannotCreate = false;
						}
					}
					pes.CannotCreate = isCannotCreate;
				});
			}

			/**
             * @name apply
             * @description if '$apply' is running, delay to next digest cycle
             */
			/*  function apply(fn) {
                var phase = $scope.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    fn();
                    $timeout(function () {
                        $scope.$digest();
                    });
                } else {
                    fn();
                    $scope.$digest();
                }
            } */
		}]);
})(angular);