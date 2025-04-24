(function(angular){

	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).controller('procurementCommonCreateWicFromContractWizardController',  createWicCatalogController);

	createWicCatalogController.$inject = ['$http', '$scope', '$translate', '$injector', 'platformGridAPI', 'platformModalService', 'platformTranslateService', 'procurementContractHeaderDataService', 'basicsLookupdataLookupDescriptorService','_',
		'basicsCustomWicTypeLookupDataService','basicsLookupdataConfigGenerator'];

	// eslint-disable-next-line no-unused-vars
	function createWicCatalogController($http, $scope, $translate, $injector, platformGridAPI, platformModalService, platformTranslateService, procurementContractHeaderDataService, basicsLookupdataLookupDescriptorService,_,
		basicsCustomWicTypeLookupDataService,basicsLookupdataConfigGenerator) {

		// check if able to create wic catalog.
		let cancel = true;
		let conHeader=$scope.modalOptions.conHeader;

		let canUpdateWicBoqFromContract = false;
		let wicCatBoqId = 0;

		$http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/checkprcboq?conHeaderFk=' + conHeader.Id).then(function (res) {
			if (res) {
				cancel = false;
			}
		}).finally(function () {
			if (cancel) {
				$scope.modalOptions.cancel();
			} else {
				$http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/getboqitembyid?ConHeaderFk=' + conHeader.Id).then(function (res) {
					$scope.currentItem.ConBoqItemFk = res && res.data ? res.data.Id : null;
				});
			}
		});
		$scope.modalOptions = $scope.modalOptions || { };
		$scope.customOptions = {
			updateBtnDisabled: updateBtnDisabled,
			update: update,
			okBtnDisabled: okBtnDisabled,
			ok: OK
		};
		let wicType = basicsCustomWicTypeLookupDataService.getDefault({lookupType: 'basicsCustomWicTypeLookupDataService'});
		if (!wicType) {
			basicsCustomWicTypeLookupDataService.getFilteredList({lookupType: 'basicsCustomWicTypeLookupDataService'})
				.then(function () {
					wicType = basicsCustomWicTypeLookupDataService.getDefault({lookupType: 'basicsCustomWicTypeLookupDataService'});
					$scope.currentItem.WicTypeFk = wicType ? wicType.Id : null;
				});
		}

		$scope.currentItem = {
			ConHeaderFk: conHeader.Id,
			WicGroupFk: null,
			WicTypeFk: wicType ? wicType.Id : null,
			ValidFrom: conHeader.ValidFrom,
			ValidTo: conHeader.ValidTo,
			PaymentTermPaFk: conHeader.PaymentTermPaFk,
			ClerkPrcFk: conHeader.ClerkPrcFk,
			ConBoqItemFk: null,
			PaymentTermFiFk: conHeader.PaymentTermFiFk,
			PaymentTermAdFk: conHeader.PaymentTermAdFk,
		};

		let wicTypeConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
			dataServiceName: 'basicsCustomWicTypeLookupDataService',
			enableCache: true
		}, {
			'sortOrder': 3,
			'gid': 'basicData',
			'rid': 'wicboq.mdcwictypefk',
			'model': 'WicTypeFk',
			'label': 'WIC Type',
			'label$tr$': 'basics.customize.wictype'
		});

		let formConfig = {
			'fid': 'updateFrameworkMaterialCatalogWizard',
			'version': '1.0.0',     // if same version setting can be reused, otherwise discard settings
			'showGrouping': false,
			'groups': [{
				'gid': 'basicData',
				'header$tr$': 'procurement.common.wizard.generatePaymentSchedule.wizard',
				'isOpen': true,
				'sortOrder': 1
			}],
			'rows': [
				{
					'sortOrder': 1,
					'gid': 'basicData',
					'rid': 'wicGroup',
					'model': 'WicGroupFk',
					'label': 'WIC Group',
					'label$tr$': 'procurement.common.boq.wicGroup',
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'validator': function (entity, value) {
						if(value && entity.WicGroupFk !== value && entity.ConBoqItemFk){
							$http.get(globals.webApiBaseUrl + 'boq/wic/boq/canupdatewicboqfromcontract?wicGroupId=' + value + '&conBoqItemId=' + entity.ConBoqItemFk).then(function (res) {
								if(res.data !== null && res.data !== ''){
									canUpdateWicBoqFromContract = true;
									let wicCatBoq = res.data.WicBoq;
									wicCatBoqId = res.data.WicBoq.Id;
									entity.WicTypeFk = wicCatBoq.MdcWicTypeFk;
									entity.ValidFrom = wicCatBoq.ValidFrom;
									entity.ValidTo = wicCatBoq.ValidTo;
									entity.PaymentTermPaFk = wicCatBoq.BasPaymentTermFk;
									entity.PaymentTermAdFk = wicCatBoq.BasPaymentTermAdFk;
									entity.PaymentTermFiFk = wicCatBoq.BasPaymentTermFiFk;
									entity.ClerkPrcFk = wicCatBoq.BasClerkFk;

									$scope.currentItem.WicTypeFk = wicCatBoq.MdcWicTypeFk;
									$scope.currentItem.ValidFrom = wicCatBoq.ValidFrom;
									$scope.currentItem.ValidTo = wicCatBoq.ValidTo;
									$scope.currentItem.PaymentTermPaFk = wicCatBoq.BasPaymentTermFk;
									$scope.currentItem.PaymentTermAdFk = wicCatBoq.BasPaymentTermAdFk;
									$scope.currentItem.PaymentTermFiFk = wicCatBoq.BasPaymentTermFiFk;
									$scope.currentItem.ClerkPrcFk = wicCatBoq.BasClerkFk;
								}else {
									canUpdateWicBoqFromContract = false;
									wicCatBoqId = 0;
									entity.WicTypeFk = wicType ? wicType.Id : null;
									entity.ValidFrom = conHeader.ValidFrom;
									entity.ValidTo = conHeader.ValidTo;
									entity.PaymentTermPaFk = conHeader.PaymentTermPaFk;
									entity.ClerkPrcFk = conHeader.ClerkPrcFk;
									entity.PaymentTermFiFk = conHeader.PaymentTermFiFk;
									entity.PaymentTermAdFk = conHeader.PaymentTermAdFk;

									$scope.currentItem.WicTypeFk = wicType ? wicType.Id : null;
									$scope.currentItem.ValidFrom = conHeader.ValidFrom;
									$scope.currentItem.ValidTo = conHeader.ValidTo;
									$scope.currentItem.PaymentTermPaFk = conHeader.PaymentTermPaFk;
									$scope.currentItem.ClerkPrcFk = conHeader.ClerkPrcFk;
									$scope.currentItem.PaymentTermFiFk = conHeader.PaymentTermFiFk;
									$scope.currentItem.PaymentTermAdFk = conHeader.PaymentTermAdFk;
								}
							});
						}
					},
					'options': {
						'lookupDirective': 'basics-lookup-data-by-custom-data-service',
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupOptions': {
							'valueMember': 'Id',
							'displayMember': 'Code',
							'lookupModuleQualifier': 'estimateAssembliesWicGroupLookupDataService',
							'dataServiceName': 'estimateAssembliesWicGroupLookupDataService',
							'showClearButton': false,
							'lookupType': 'estimateAssembliesWicGroupLookupDataService',
							'columns': [
								{
									'id': 'Code',
									'field': 'Code',
									'name': 'Code',
									'formatter': 'code',
									'name$tr$': 'cloud.common.entityCode'
								},
								{
									'id': 'Description',
									'field': 'DescriptionInfo',
									'name': 'Description',
									'formatter': 'translation',
									'name$tr$': 'cloud.common.entityDescription'
								}
							],
							'uuid': 'aee374374c634e27ba45e6e145f872ae',
							'isTextEditable': false,
							'treeOptions': {
								'parentProp': 'WicGroupFk',
								'childProp': 'WicGroups',
								'initialState': 'expanded',
								'inlineFilters': true,
								'hierarchyEnabled': true
							}
						}
					}
				},
				{
					'sortOrder': 2,
					'gid': 'basicData',
					'rid': 'wicBoqItemId',
					'model': 'ConBoqItemFk',
					'label': 'Target WIC BoQ',
					'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.targetWicBoq',
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'lookupDirective': 'basics-lookup-data-by-custom-data-service',
						'descriptionMember': 'BriefInfo.Translated',
						'lookupOptions': {
							'valueMember': 'Id',
							'displayMember': 'Reference',
							'showClearButton': false,
							'lookupModuleQualifier': 'prcCommonRootBoqItemLookupService',
							'dataServiceName': 'prcCommonRootBoqItemLookupService',
							'lookupType': 'prcCommonRootBoqItemLookupService',
							'columns': [
								{
									'id': 'reference',
									'field': 'Reference',
									'name': 'Reference',
									'formatter': 'description',
									'name$tr$': 'boq.main.Reference'
								},
								{
									'id': 'brief',
									'field': 'BriefInfo',
									'name': 'Outline Specification',
									'formatter': 'translation',
									'name$tr$': 'boq.main.BriefInfo'
								}
							],
							'uuid': '49b49742451d430ca63453b7d9d03487',
							'filter': function () {
								// currently, PKey1 means qtnHeaderId, PKey2 means conHeaderId.
								let qtnHeaderId = $scope.currentItem.QtnHeaderFk || -1;
								let conHeaderId = conHeader.Id;

								return {PKey1: qtnHeaderId, PKey2: conHeaderId};
							},
							'disableDataCaching': true,
							'isClientSearch': false,
							'isTextEditable': false
						}
					}
				},
				wicTypeConfig,
				{
					'sortOrder': 4,
					'gid': 'basicData',
					'rid': 'validFrom',
					'model': 'ValidFrom',
					'label': 'Valid From',
					'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityValidFrom',
					'type': 'date'
				},
				{
					'sortOrder': 5,
					'gid': 'basicData',
					'rid': 'validTo',
					'model': 'ValidTo',
					'label': 'Valid To',
					'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityValidTo',
					'type': 'date'
				},
				{
					'sortOrder': 6,
					'gid': 'basicData',
					'rid': 'paymentTermPaFk',
					'model': 'PaymentTermPaFk',
					'label': 'Payment Term Pa',
					'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermPaFk',
					'type': 'directive',
					'directive': 'basics-lookupdata-payment-term-lookup',
					'options': {
						'showClearButton': true
					}
				},
				{
					'sortOrder': 7,
					'gid': 'basicData',
					'rid': 'paymentTermFiFk',
					'model': 'PaymentTermFiFk',
					'label': 'Payment Term Fi',
					'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermFiFk',
					'type': 'directive',
					'directive': 'basics-lookupdata-payment-term-lookup',
					'options': {
						'showClearButton': true
					}
				},
				{
					'sortOrder': 8,
					'gid': 'basicData',
					'rid': 'paymentTermAdFk',
					'model': 'PaymentTermAdFk',
					'label': 'Payment Term Ad',
					'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermAdFk',
					'type': 'directive',
					'directive': 'basics-lookupdata-payment-term-lookup',
					'options': {
						'showClearButton': true
					}
				},
				{
					'sortOrder': 9,
					'gid': 'basicData',
					'rid': 'clerkFk',
					'model': 'ClerkPrcFk',
					'label': 'Responsible',
					'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityClerkFk',
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'lookupDirective': 'cloud-clerk-clerk-dialog',
						'descriptionMember': 'Description',
						'lookupOptions': {
							'filterKey': 'con-wizard-update-framework-material-catalog-clerk-filter',
							'showClearButton': true
						}
					}
				}
			]
		};
		$scope.formContainerOptions = {};
		var formTranslatedConfig = platformTranslateService.translateFormConfig(formConfig);
		$scope.formContainerOptions.formOptions = {
			configure: formTranslatedConfig, showButtons: [], validationMethod: function () {
			}
		};
		function getTimeString(time) {
			return (_.isObject(time) && _.isFunction(time.format)) ? time.format('YYYY[-]MM[-]DD[T00:00:00Z]') : time;
		}

		function updateBtnDisabled(){
			return !canUpdateWicBoqFromContract;
		}

		function update(){
			$scope.modalOptions.dialogLoading = true;
			var param = {
				WicCatBoqId: wicCatBoqId,
				WicGroupFk:  $scope.currentItem.WicGroupFk,
				ConHeaderFk: conHeader.Id,
				WicTypeFk: $scope.currentItem.WicTypeFk,
				ValidFrom: getTimeString($scope.currentItem.ValidFrom),
				ValidTo: getTimeString($scope.currentItem.ValidTo),
				PaymentTermPaFk: $scope.currentItem.PaymentTermPaFk,
				PaymentTermFiFk: $scope.currentItem.PaymentTermFiFk,
				PaymentTermAdFk: $scope.currentItem.PaymentTermAdFk,
				ClerkPrcFk: $scope.currentItem.ClerkPrcFk
			};
			$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/updatewiccatalog',param).then(function(res){
				var title = 'cloud.common.informationDialogHeader';
				var message = 'procurement.common.createSuccessfully';
				platformModalService.showMsgBox(message, title, 'info').finally(function () {
					procurementContractHeaderDataService.refreshSelectedEntities();
				});
				$scope.$close(true);
				$scope.modalOptions.dialogLoading = false;
			});
		}

		function okBtnDisabled(){
			var entity = $scope.currentItem;
			return !entity.WicGroupFk > 0;
		}

		function OK(){
			$scope.modalOptions.dialogLoading = true;
			var param = {
				WicGroupFk:  $scope.currentItem.WicGroupFk,
				ConHeaderFk: conHeader.Id,
				WicTypeFk: $scope.currentItem.WicTypeFk,
				ValidFrom: getTimeString($scope.currentItem.ValidFrom),
				ValidTo: getTimeString($scope.currentItem.ValidTo),
				PaymentTermPaFk: $scope.currentItem.PaymentTermPaFk,
				PaymentTermFiFk: $scope.currentItem.PaymentTermFiFk,
				PaymentTermAdFk: $scope.currentItem.PaymentTermAdFk,
				ClerkPrcFk: $scope.currentItem.ClerkPrcFk
			};
			// eslint-disable-next-line no-unused-vars
			$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createwiccatalog',param).then(function(res){
				return $http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + res.data.WicGroupFk)
					.then(function (result) {
						basicsLookupdataLookupDescriptorService.updateData('PrcWicCatBoqs', result.data);
						let request = {
							ConHeaderFk: conHeader.Id,
							BoqWicCatFk: res.data.WicGroupFk,
							BoqWicCatBoqFk: res.data.Id,
							PaymentTermPaFk: $scope.currentItem.PaymentTermPaFk,
							PaymentTermFiFk: $scope.currentItem.PaymentTermFiFk,
							PaymentTermAdFk: $scope.currentItem.PaymentTermAdFk
						};
						return $http.post(globals.webApiBaseUrl + 'procurement/contract/header/setisframework',request);
					});
			}).finally(function(){
				var title = 'cloud.common.informationDialogHeader';
				var message = 'procurement.common.createSuccessfully';
				platformModalService.showMsgBox(message, title, 'info').finally(function () {
					procurementContractHeaderDataService.refreshSelectedEntities();
				});
				$scope.$close(true);
				$scope.modalOptions.dialogLoading = false;
			});
		}
	}

})(angular);