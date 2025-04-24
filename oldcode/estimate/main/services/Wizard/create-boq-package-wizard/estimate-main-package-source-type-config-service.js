/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainPackageSourceTypeConfigService', ['platformTranslateService', 'estimateMainResourceType',
		function (platformTranslateService, estimateMainResourceType) {
			let PACKAGE_SOURCE_TYPE = {
				PROJECT_BOQ: {
					value: 1,
					label: 'Project BoQ',
					label$tr$: 'estimate.main.createBoqPackageWizard.sourceType.projectBoq.label',
					stepConfig: {
						id: '61B48F12874C4DA3A9B52DCE0F5F33FD',
						stepSettingsId: '61B48F12874C4DA3A9B52DCE0F5F33FD',
						title: 'Select Project BoQ',
						cssClass: 'flex-in-form',
						title$tr$: 'estimate.main.createBoqPackageWizard.sourceType.projectBoq.title',
						form: platformTranslateService.translateFormConfig(getFormConfigBySourceType(1))
					},
					properties: {
						gridId: '784CB9C7C5024B80BCBF2641C622B7A4',
						list: 'boqList',
						selectedList: 'selectedBoqIdList',
						isTree: true,
						childItemProperty: 'BoqItems',
						detailProperty: 'BriefInfo.Translated',
						prcStructureProperty: 'PrcStructureFk',
						noItemsMessage: 'estimate.main.createBoqPackageWizard.sourceType.projectBoq.noItemMessage',
						processor: 'boqMainImageProcessor',
						selectedNodeList: 'selectedNodeBoqIdList',
						selectedIdentificationIdList: 'selectedIdentificationIdList',
						selectedParentId2DescendantIdsMap: 'selectedParentId2DescendantIdsMap',
						selectedRootId2DescendantIdsMap: 'selectedRootId2DescendantIdsMap'
					},
					assignStepConfig: getAssignStepConfig(1)
				},
				WIC_BOQ: {
					value: 2,
					label: 'WIC BoQ',
					label$tr$: 'estimate.main.createBoqPackageWizard.sourceType.wicBoQ.label',
					hide: true,
					stepConfig: {
						id: '4EC9834EF8ED4D48B8131618ABEC5528',
						stepSettingsId: '4EC9834EF8ED4D48B8131618ABEC5528',
						title: 'Select WIC BoQ',
						cssClass: 'flex-in-form',
						title$tr$: 'estimate.main.createBoqPackageWizard.sourceType.wicBoQ.title',
						form: platformTranslateService.translateFormConfig(getFormConfigBySourceType(2))
					},
					properties: {
						gridId: '784CB9C7C5024B80BCBF2641C622B7A4',
						list: 'boqList',
						selectedList: 'selectedBoqIdList',
						isTree: true,
						childItemProperty: 'BoqItems',
						detailProperty: 'BriefInfo.Translated',
						prcStructureProperty: 'PrcStructureFk',
						noItemsMessage: 'estimate.main.createBoqPackageWizard.sourceType.wicBoQ.noItemMessage',
						processor: 'boqMainImageProcessor',
						selectedNodeList: 'selectedNodeBoqIdList',
						selectedIdentificationIdList: 'selectedIdentificationIdList',
						selectedParentId2DescendantIdsMap: 'selectedParentId2DescendantIdsMap',
						selectedRootId2DescendantIdsMap: 'selectedRootId2DescendantIdsMap'
					},
					assignStepConfig: getAssignStepConfig(2)
				},
				LINE_ITEM: {
					value: 9,
					label: 'Line Items',
					label$tr$: 'estimate.main.createBoqPackageWizard.sourceType.LineItems.label',
					hide: true,
					stepConfig: {
						id: 'BF0037DEB45D4CFA8010A740169C7CE1',
						stepSettingsId: 'BF0037DEB45D4CFA8010A740169C7CE1',
						title: 'Select Line Items via Proc.Structure',
						cssClass: 'flex-in-form',
						title$tr$: 'estimate.main.createBoqPackageWizard.sourceType.LineItems.title',
						// form: platformTranslateService.translateFormConfig(getFormConfigBySourceType(3))
					},
					properties: {
						gridId: 'D1837267EB5447A9A690128A7F128C7E',
						list: 'LineItem',
						selectedList: null,
						isTree: true,
						selectedNodeList: null,
						selectedIdentificationIdList: 'selectedIdentificationIdList',
						selectedParentId2DescendantIdsMap: 'selectedParentId2DescendantIdsMap',
						selectedRootId2DescendantIdsMap: 'selectedRootId2DescendantIdsMap'
						// childItemProperty: 'ChildItems',
						// detailProperty: 'DescriptionInfo.Translated',
						// prcStructureProperty: 'Id'
						// noItemsMessage: 'estimate.main.createBoqPackageWizard.sourceType.wicBoQ.noItemMessage',
						// processor: 'boqMainImageProcessor'
					},
					assignStepConfig: getAssignStepConfig(9)
				},
				RESOURCE: {
					value: 5,
					label: 'Resources',
					label$tr$: 'estimate.main.createBoqPackageWizard.sourceType.resources.label',
					stepConfig: {
						id: 'A48D3143A58542C493753E4527E0AA81',
						stepSettingsId: 'A48D3143A58542C493753E4527E0AA81',
						title: 'Select Resources',
						cssClass: 'flex-in-form',
						title$tr$: 'estimate.main.createBoqPackageWizard.sourceType.resources.title',
						form: platformTranslateService.translateFormConfig(getFormConfigBySourceType(5))
					},
					properties: {
						gridId: 'CE7E1D028B124C178A27AD57D143B070',
						list: 'resourceList',
						selectedList: 'selectedResourceIdList',
						isTree: true,
						childItemProperty: 'ResourceChildren',
						detailProperty: 'BriefInfo.Translated',
						noItemsMessage: function (response) {
							return 'estimate.main.createBoqPackageWizard.sourceType.resources.noItemMessage2';
						},
						processor: 'estimateMainResourceImageProcessor',
						allowSelection: function (item) {
							return !((item && item.EstResourceTypeFk === estimateMainResourceType.SubItem) || !item || item.isProtectedAssembly);
						}
					},
					assignStepConfig: getAssignStepConfig(5)
				},
				getSourceTypeObjectByValue: function (value) {
					return PACKAGE_SOURCE_TYPE[_.findKey(PACKAGE_SOURCE_TYPE, {'value': value})];
				},
				getAllSourceTypesAsArray: function () {
					return _.filter(_.values(this), 'value');
				}
			};

			let PRC_STRUCTURE_TYPE = {
				PRC_STRUCTURE_LINE_ITEM: {
					value: 3,
					label: 'Procurement Structure of Line Item',
					label$tr$: 'estimate.main.createBoqPackageWizard.sourceType.prcStructureLineItem.label',
					stepConfig: {
						id: 'BD086B423858466C82CDE72829E24DCF',
						stepSettingsId: 'BD086B423858466C82CDE72829E24DCF',
						title: 'Select Procurement Structure (Line Item)',
						cssClass: 'flex-in-form',
						title$tr$: 'estimate.main.createBoqPackageWizard.sourceType.prcStructureLineItem.title',
						form: platformTranslateService.translateFormConfig(getFormConfigBySourceType(3))
					},
					properties: {
						gridId: '84C6496230BE48348541DAEACB2D8440',
						list: 'prcStructureList',
						selectedList: 'selectedPrcStructureIdList',
						isTree: true,
						childItemProperty: 'ChildItems',
						detailProperty: 'DescriptionInfo.Translated',
						prcStructureProperty: 'Id',
						noItemsMessage: function(response){
							if(!response.IsWithoutPackage){
								return 'estimate.main.createBoqPackageWizard.sourceType.prcStructureLineItem.noProcurementStructureMessage';
							}
							return 'estimate.main.createBoqPackageWizard.sourceType.prcStructureLineItem.noItemMessage';
						},
						selectedNodeList: null,
						selectedIdentificationIdList: 'selectedIdentificationIdList',
						selectedParentId2DescendantIdsMap: 'selectedParentId2DescendantIdsMap',
						selectedRootId2DescendantIdsMap: 'selectedRootId2DescendantIdsMap'
					}
				},
				PRC_STRUCTURE_PROJECT_BOQ: {
					value: 4,
					label: 'Procurement Structure of Project BoQ',
					label$tr$: 'estimate.main.createBoqPackageWizard.sourceType.prcStructureProjectBoq.label',
					stepConfig: {
						id: '413C80DF872C4FD1B8CB421C645177F8',
						stepSettingsId: '413C80DF872C4FD1B8CB421C645177F8',
						title: 'Select Procurement Structure (Project BoQ)',
						cssClass: 'flex-in-form',
						title$tr$: 'estimate.main.createBoqPackageWizard.sourceType.prcStructureProjectBoq.title',
						form: platformTranslateService.translateFormConfig(getFormConfigBySourceType(4))
					},
					properties: {
						gridId: '84C6496230BE48348541DAEACB2D8440',
						list: 'prcStructureList',
						selectedList: 'selectedPrcStructureIdList',
						isTree: true,
						childItemProperty: 'ChildItems',
						detailProperty: 'DescriptionInfo.Translated',
						prcStructureProperty: 'Id',
						noItemsMessage: function(response) {
							if(!response.IsWithoutPackage){
								return 'estimate.main.createBoqPackageWizard.sourceType.prcStructureLineItem.noProcurementStructureMessage';
							}
							return 'estimate.main.createBoqPackageWizard.sourceType.prcStructureProjectBoq.noItemMessage';
						},
						selectedNodeList: null,
						selectedIdentificationIdList: 'selectedIdentificationIdList',
						selectedParentId2DescendantIdsMap: 'selectedParentId2DescendantIdsMap',
						selectedRootId2DescendantIdsMap: 'selectedRootId2DescendantIdsMap'
					}
				},


				getStructureTypeObjectByValue: function (value) {
					return PRC_STRUCTURE_TYPE[_.findKey(PRC_STRUCTURE_TYPE, {'value': value})];
				},
				getAllStructureTypesAsArray: function () {
					return _.filter(_.values(this), 'value');
				}
			};

			function getFormConfigBySourceType(sourceType) {
				let config = {
					fid: 'selectScopeSource',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'default'
					}]
				};
				switch (sourceType) {
					case 1:
					case 2:
						config.rows = [{
							gid: 'default',
							rid: 'scope',
							model: 'boqList',
							// label: sourceType === 1 ? 'Select Project BoQ' : 'Select WIC BoQ',
							// label$tr$: sourceType === 1 ? 'estimate.main.createBoqPackageWizard.selectProjectBoqTitle' : 'estimate.main.createBoqPackageWizard.selectWicBoQTitle',
							type: 'directive',
							directive: 'estimate-main-boq-package-source-boq-grid'
						}];
						break;
					case 3:
					case 4:
						config.rows = [{
							gid: 'default',
							rid: 'scope',
							model: 'prcStructureList',
							// label: 'Select Procurement Structure',
							// label$tr$: 'estimate.main.createBoqPackageWizard.selectProcurementStructureTitle',
							type: 'directive',
							directive: 'estimate-main-boq-package-source-prc-structure-grid'
						}];
						break;
					case 5:
						config.rows = [{
							gid: 'default',
							rid: 'scope',
							model: 'resourceList',
							type: 'directive',
							directive: 'estimate-main-boq-package-source-resource-grid'
						}];
						break;
					default:
						break;
				}
				return config;
			}

			let sourceTypeObject ={
				PACKAGE_SOURCE_TYPE: PACKAGE_SOURCE_TYPE,
				PRC_STRUCTURE_TYPE : PRC_STRUCTURE_TYPE
			};

			return sourceTypeObject;

			function getAssignStepConfig(sourceType) {
				let config = {
					stepSettingsId: '650C46CD24B49B84AF9BABFA9BDEA45F',
					id: '650C46CD24B49B84AF9BABFA9BDEA45F',
					title: 'Assign Package',
					title$tr$: 'estimate.main.createBoqPackageWizard.assignPackage',
					canFinish: false
				};

				switch (sourceType) {
					case 1:
					case 2:
						config.stepSettingsId = config.id = 'fdd0e09f96faaa49594619f8c41de83d';
						break;
					case 9:
						config.stepSettingsId = config.id = '028ebc73827492b19e22946974e29426';
						break;
					case 5:
						config.stepSettingsId = config.id = '650C46CD24B49B84AF9BABFA9BDEA45F';
						break;
					default:
						break;
				}
				return config;
			}
		}
	]);

})(angular);
