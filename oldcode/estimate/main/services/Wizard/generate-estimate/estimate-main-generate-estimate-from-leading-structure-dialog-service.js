(function () {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainGenerateEstimateFromLeadingStructureDialogService', ['globals', 'PlatformMessenger', '$http', '_', '$injector', '$translate', '$q',
		'basicsLookupdataConfigGenerator', 'platformModalService', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateWizardGenerateSourceLookupService',
		function (globals, PlatformMessenger, $http, _, $injector, $translate, $q, basicsLookupdataConfigGenerator, platformModalService, platformDataValidationService, platformRuntimeDataService, estimateWizardGenerateSourceLookupService) {

			let service = {
				setOkdisabale: setOkdisabale,
				onCalculationDone: new PlatformMessenger()
			};

			service.showDialog = function showDialog() {
				let dataItem = {
					StructureId: 1,
					EstStructureId:-1,
					IsBySplitQuantity: false,
					CopyUserDefined1: false,
					CopyUserDefined2: false,
					CopyUserDefined3: false,
					CopyUserDefined4: false,
					CopyUserDefined5: false,
					CreateNew: true,
					UpdateExistedItem: false,
					CopyCostGroup: false,
					CopyPrjCostGroup: false,
					CopyWic: false,
					CopyControllingUnit: false,
					CopyLocation: false,
					CopyProcStructure: false,
					CopyBoqFinalPrice: false,
					CopyRelatedWicAssembly: false,
					IsGenerateAsReferenceLineItems: false,
					CopyLeadingStructrueDesc: true,
					UpdateLeadStrucDescToExistingItem: false,
					__rt$data: {
						readonly: [
							{field: 'CopyCostGroup', readonly: true},
							{field: 'CopyPrjCostGroup', readonly: true},
							{field: 'CopyWic', readonly: true},
							{field: 'CopyControllingUnit', readonly: true},
							{field: 'CopyLocation', readonly: true},
							{field: 'CopyProcStructure', readonly: true},
							{field: 'CopyBoqFinalPrice', readonly: true},
							{field: 'CopyRelatedWicAssembly', readonly: true},
							{field: 'IsBySplitQuantity', readonly: true},
							{field: 'IsGenerateAsReferenceLineItems', readonly: true},
							{field: 'CopyUserDefined1', readonly: true},
							{field: 'CopyUserDefined2', readonly: true},
							{field: 'CopyUserDefined3', readonly: true},
							{field: 'CopyUserDefined4', readonly: true},
							{field: 'CopyUserDefined5', readonly: true},
							{field: 'UpdateLeadStrucDescToExistingItem', readonly: true}
						]
					}
				};
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-generate-estimate-from-leading-structure.html',
					backdrop: false,
					windowClass: 'form-modal-dialog',
					width: 800,
					headerText: $translate.instant('estimate.main.generateItemFromLeadingStructure'),
					resizeable: true,
					dataItem: dataItem
				});
			};

			service.generateItemFromLeadingStructure = function generateItemFromLeadingStructure(scope) {
				let result = {data: scope.dataItem};
				let estimateMainService = $injector.get('estimateMainService');
				let sourceLookupDetail = estimateWizardGenerateSourceLookupService.getItemByKey(result.data.StructureId);
				if (sourceLookupDetail) {
					let postData = {
						'StructureId': result.data.StructureId,
						'StructureName': sourceLookupDetail.StructureName,
						'RootItemId': sourceLookupDetail.RootItemId,
						// Create only new line items
						'CreateOnlyNewLineItem': result.data.CreateNew,
						// Create new line items (from new BoQ items) and update the existing items
						'UpdateExistedItem': result.data.UpdateExistedItem,
						'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
						'ProjectFk': estimateMainService.getSelectedProjectId(),
						'EstStructureId': sourceLookupDetail.EstStructureId,
						'CopyCostGroup': result.data.CopyCostGroup,
						'CopyPrjCostGroup': result.data.CopyPrjCostGroup,
						'CopyWic': result.data.CopyWic,
						'CopyControllingUnit': result.data.CopyControllingUnit,
						'CopyLocation': result.data.CopyLocation,
						'CopyProcStructure': result.data.CopyProcStructure,
						'CopyBoqFinalPrice': result.data.CopyBoqFinalPrice,
						'CopyRelatedWicAssembly': result.data.CopyRelatedWicAssembly,
						'IsBySplitQuantity': result.data.IsBySplitQuantity,
						'IsGenerateAsReferenceLineItems': result.data.IsGenerateAsReferenceLineItems,
						'CopyLeadingStructrueDesc': result.data.CopyLeadingStructrueDesc,
						'UpdateLeadStrucDescToExistingItem': result.data.UpdateLeadStrucDescToExistingItem,
						'CopyUserDefined1': result.data.CopyUserDefined1,
						'CopyUserDefined2': result.data.CopyUserDefined2,
						'CopyUserDefined3': result.data.CopyUserDefined3,
						'CopyUserDefined4': result.data.CopyUserDefined4,
						'CopyUserDefined5': result.data.CopyUserDefined5,
						'IsDayWork': true
					};

					estimateMainService.setAoTQuantityRelationForWizard(postData);
					if (postData.ProjectFk > 0 && postData.EstHeaderFk > 0) {
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/generatefromleadingstructure', postData)
							.then(function (response) {
								// refresh line item container
								if (response.data && response.data.result) {

									scope.$close();

									let permission = $q.when(null);
									if (postData.StructureName === 'Boq') {
										if (postData.RootItemId) {
											permission = $injector.get('estimateMainBoqLookupService').loadDataByBoqHeaderId([postData.RootItemId]);
										}
									}
									permission.then(function () {
										$injector.get('basicsBoqSplitQuantityLookupDataService').resetCache({lookupType: 'basicsBoqSplitQuantityLookupDataService'});
										let estimateProjectService = $injector.get('estimateProjectService');
										let projectCompositeItems = estimateProjectService.getList();
										if (projectCompositeItems && projectCompositeItems.length > 0) {
											let a = null;
											_.forEach(projectCompositeItems, function (item) {
												if (item.EstHeader.Id === estimateMainService.getSelectedEstHeaderId()) {
													a = item;
												}
											});

											if (a) {
												estimateMainService.setEstimateHeader(a, 'EstHeader.Code');
											}
										} else {
											estimateMainService.load();
										}
									});
								}else{
									scope.concurrencyInfo.message = response.data.errorLog || response.data.Message;
									scope.concurrencyInfo.show = !!scope.concurrencyInfo.message;
									scope.submitting = false;
								}
							}, function (){
								scope.$close();
							});
					}
				}
			};

			service.processUpdateExistedItem = function processUpdateExistedItem(entity) {
				if (!entity.UpdateExistedItem) {
					entity.UpdateLeadStrucDescToExistingItem = entity.UpdateExistedItem;
				}

				let fields = [
					{field: 'UpdateLeadStrucDescToExistingItem', readonly: !entity.UpdateExistedItem}
				];

				platformRuntimeDataService.readonly(entity, fields);
			};

			let IsDisable = false;

			function setOkdisabale(Okdisable) {
				IsDisable = Okdisable;
			}

			// validate the StructureId that should be not empty.
			service.validateStructureId = function validateStructureId(entity, value) {
				if (value !== undefined) {
					IsDisable = !(entity.CreateNew || entity.UpdateExistedItem);
				} else {
					IsDisable = true;
				}

				if (value) {
					let structureType = $injector.get('estimateWizardGenerateSourceLookupService').getItemByKey(value);
					if (!structureType) {
						return;
					}

					if(structureType.StructureName ==='Schedule'){
						entity.CopyCostGroup = false;
						entity.CopyPrjCostGroup = false;
						entity.CopyWic = false;
						entity.CopyBoqFinalPrice = false;
						entity.CopyRelatedWicAssembly = false;

						entity.IsBySplitQuantity = false;
						entity.IsGenerateAsReferenceLineItems = false;
						entity.CopyUserDefined1 = false;
						entity.CopyUserDefined2 = false;
						entity.CopyUserDefined3 = false;
						entity.CopyUserDefined4 = false;
						entity.CopyUserDefined5 = false;
					}else if(structureType.StructureName !=='Boq') {

						entity.CopyCostGroup = false;
						entity.CopyPrjCostGroup = false;
						entity.CopyWic = false;
						entity.CopyControllingUnit = false;
						entity.CopyLocation = false;
						entity.CopyProcStructure = false;
						entity.CopyBoqFinalPrice = false;
						entity.CopyRelatedWicAssembly = false;

						entity.IsBySplitQuantity = false;
						entity.IsGenerateAsReferenceLineItems = false;
						entity.CopyUserDefined1 = false;
						entity.CopyUserDefined2 = false;
						entity.CopyUserDefined3 = false;
						entity.CopyUserDefined4 = false;
						entity.CopyUserDefined5 = false;
					}

					entity.StructureName = structureType.StructureName;
					entity.EstStructureId = structureType.EstStructureId;

					let notByBoq = structureType.StructureName !== 'Boq';
					let notByAct = structureType.StructureName !== 'Schedule';
					$injector.get('platformRuntimeDataService').readonly(entity, [
						{field: 'CopyCostGroup', readonly: notByBoq},
						{field: 'CopyPrjCostGroup', readonly: notByBoq},
						{field: 'CopyWic', readonly: notByBoq},
						{field: 'CopyControllingUnit', readonly: notByBoq && notByAct},
						{field: 'CopyLocation', readonly: notByBoq && notByAct},
						{field: 'CopyProcStructure', readonly: notByBoq && notByAct},
						{field: 'CopyBoqFinalPrice', readonly: notByBoq},
						{field: 'CopyRelatedWicAssembly', readonly: notByBoq || !entity.CreateNew},

						{field: 'IsBySplitQuantity', readonly: notByBoq},
						{field: 'IsGenerateAsReferenceLineItems', readonly: !entity.IsBySplitQuantity},
						{field: 'CopyUserDefined1', readonly: notByBoq},
						{field: 'CopyUserDefined2', readonly: notByBoq},
						{field: 'CopyUserDefined3', readonly: notByBoq},
						{field: 'CopyUserDefined4', readonly: notByBoq},
						{field: 'CopyUserDefined5', readonly: notByBoq}
					]);
				}
			};

			function validateIsBySplitQuantity(entity, value) {
				$injector.get('platformRuntimeDataService').readonly(entity, [
					{field: 'IsGenerateAsReferenceLineItems', readonly: !value},
				]);
				if (!value) {
					entity.IsGenerateAsReferenceLineItems = false;
				}
			}

			service.getFormConfig = function getFormConfig() {
				return {
					fid: 'estimate.main.generateLineItemDialog',
					version: '0.0.1',
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							header: 'Basic setting',
							header$tr$: 'estimate.main.generateLineByStructure.baseSetting',
							isOpen: true,
							attributes: ['structureid']
						}, {
							gid: 'assignmentCopying',
							header: 'Copying Assignment',
							header$tr$: 'estimate.main.generateLineByStructure.assignmentCopying',
							isOpen: false,
							attributes: []
						}, {
							gid: 'copyDescAndUserDefined',
							header: 'Copying Description and User Defined',
							header$tr$: 'estimate.main.generateLineByStructure.copyDescAndUserDefined',
							isOpen: false,
							attributes: []
						}, {
							gid: 'additionalSetting',
							header: 'Additional Setting',
							header$tr$: 'estimate.main.generateLineByStructure.additionalSetting',
							isOpen: false,
							attributes: []
						}
					],
					'overloads': {},
					rows: [
						{
							gid: 'baseGroup',
							rid: 'StructureId',
							label$tr$: 'estimate.main.StructureId',
							type: 'directive',
							model: 'StructureId',
							required: true,
							'directive': 'estimate-wizard-generate-structure-lookup',
							'options': {
								displayMember: 'Desc',
								lookupOptions: {
									showClearButton: true
								}
							},
							validator: service.validateStructureId,
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'CreateNew',
							label$tr$: 'estimate.main.createNew',
							type: 'directive',
							model: 'CreateNew',
							directive: 'estimate-wizard-generate-source-create-new-checkbox',
							sortOrder: 2
						},
						{
							gid: 'baseGroup',
							rid: 'UpdateExistedItem',
							label: '   ',
							type: 'directive',
							model: 'UpdateExistedItem',
							directive: 'estimate-wizard-generate-source-update-old-checkbox',
							sortOrder: 3
						},
						{
							gid: 'assignmentCopying',
							rid: 'copyWic',
							label: 'Wic',
							label$tr$: 'estimate.main.generateLineByStructure.copyWic',
							type: 'boolean',
							model: 'CopyWic',
							sortOrder: 6
						},
						{
							gid: 'assignmentCopying',
							rid: 'copyCostGroup',
							label: 'Cost Group',
							label$tr$: 'estimate.main.generateLineByStructure.copyCostGroup',
							type: 'boolean',
							model: 'CopyCostGroup',
							sortOrder: 7
						},
						{
							gid: 'assignmentCopying',
							rid: 'copyPrjCostGroup',
							label: 'Cost Group',
							label$tr$: 'estimate.main.generateLineByStructure.copyPrjCostGroup',
							type: 'boolean',
							model: 'CopyPrjCostGroup',
							sortOrder: 8
						},
						{
							gid: 'assignmentCopying',
							rid: 'copyControllingUnit',
							label: 'Controlling Unit',
							label$tr$: 'estimate.main.generateLineByStructure.copyControllingUnit',
							type: 'boolean',
							model: 'CopyControllingUnit',
							sortOrder: 9
						},
						{
							gid: 'assignmentCopying',
							rid: 'copyLocation',
							label: 'Location',
							label$tr$: 'estimate.main.generateLineByStructure.copyLocation',
							type: 'boolean',
							model: 'CopyLocation',
							sortOrder: 10
						},
						{
							gid: 'assignmentCopying',
							rid: 'copyProcStructure',
							label: 'Procurement Structure',
							label$tr$: 'estimate.main.generateLineByStructure.copyProcStructure',
							type: 'boolean',
							model: 'CopyProcStructure',
							sortOrder: 11
						},
						{
							gid: 'copyDescAndUserDefined',
							rid: 'CopyLeadingStructrueDesc',
							label: 'Overwrite the existing description',
							label$tr$: 'estimate.main.generateLineByStructure.copyLeadingStructureDesc',
							type: 'boolean',
							model: 'CopyLeadingStructrueDesc',
							visible: true,
							sortOrder: 3
						},
						{
							gid: 'copyDescAndUserDefined',
							rid: 'UpdateLeadStrucDescToExistingItem',
							label: 'Update Description to existing Items',
							label$tr$: 'estimate.main.generateLineByStructure.updateLeadStructureDescToExistingItem',
							type: 'boolean',
							model: 'UpdateLeadStrucDescToExistingItem',
							visible: true,
							sortOrder: 4
						},
						{
							gid: 'copyDescAndUserDefined',
							rid: 'CopyUserDefined1',
							label: 'User Defined 1',
							label$tr$: 'estimate.main.generateLineByStructure.copyUserDefined1',
							type: 'boolean',
							model: 'CopyUserDefined1',
							sortOrder: 13
						},
						{
							gid: 'copyDescAndUserDefined',
							rid: 'CopyUserDefined2',
							label: 'User Defined 2',
							label$tr$: 'estimate.main.generateLineByStructure.copyUserDefined2',
							type: 'boolean',
							model: 'CopyUserDefined2',
							sortOrder: 14
						},
						{
							gid: 'copyDescAndUserDefined',
							rid: 'CopyUserDefined3',
							label: 'User Defined 3',
							label$tr$: 'estimate.main.generateLineByStructure.copyUserDefined3',
							type: 'boolean',
							model: 'CopyUserDefined3',
							sortOrder: 15
						},
						{
							gid: 'copyDescAndUserDefined',
							rid: 'CopyUserDefined4',
							label: 'User Defined 4',
							label$tr$: 'estimate.main.generateLineByStructure.copyUserDefined4',
							type: 'boolean',
							model: 'CopyUserDefined4',
							sortOrder: 16
						},
						{
							gid: 'copyDescAndUserDefined',
							rid: 'CopyUserDefined5',
							label: 'User Defined 5',
							label$tr$: 'estimate.main.generateLineByStructure.copyUserDefined5',
							type: 'boolean',
							model: 'CopyUserDefined5',
							sortOrder: 17
						},
						{
							gid: 'additionalSetting',
							rid: 'isBySplitQuantity',
							label: 'Generate Line item by Split Quantity',
							label$tr$: 'estimate.main.generateLineByStructure.isBySplitQuantity',
							type: 'boolean',
							model: 'IsBySplitQuantity',
							validator: validateIsBySplitQuantity,
							sortOrder: 1
						},
						{
							gid: 'additionalSetting',
							rid: 'isGenerateAsReferenceLineItems',
							label: 'Generate as reference Line items',
							label$tr$: 'estimate.main.generateLineByStructure.isGenerateAsReferenceLineItems',
							type: 'boolean',
							model: 'IsGenerateAsReferenceLineItems',
							visible: true,
							sortOrder: 2
						},
						{
							gid: 'additionalSetting',
							rid: 'copyBoqFinalPrice',
							label: 'Boq Final Price',
							label$tr$: 'estimate.main.generateLineByStructure.copyBoqFinalPrice',
							type: 'boolean',
							model: 'CopyBoqFinalPrice',
							sortOrder: 12
						},
						{
							gid: 'additionalSetting',
							rid: 'copyRelatedAssemblyWic',
							label: 'Copy Related Assemblies from WIC',
							label$tr$: 'estimate.main.generateLineByStructure.copyRelatedAssemblyWic',
							type: 'boolean',
							model: 'CopyRelatedWicAssembly',
							sortOrder: 12
						}
					]
				};
			};

			return service;

		}]);
})();
