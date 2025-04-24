/**
 * Created by lnt on 13.07.2018.
 */

(function (angular) {
	/* _ */
	'use strict';

	let modName = 'qto.main';
	let mod = angular.module(modName);
	// Layout specs
	mod.factory('qtoMainDetailLayout', [
		'_','$', 'moment', '$injector', '$translate', 'qtoMainDetailService', 'qtoMainHeaderDataService', 'qtoMainLineType', 'boqItemLookupDataService', 'qtoMainFormulaType', 'qtoMainDetailGridValidationService', 'basicsLookupdataConfigGenerator', 'qtoBoqType', 'QtoType',
		function (_,$, moment, $injector, $translate, qtoMainDetailService, qtoMainHeaderDataService, qtoMainLineType, boqItemLookupDataService, qtoMainFormulaType, qtoMainDetailGridValidationService, basicsLookupdataConfigGenerator, qtoBoqType, qtoType) {
			return {
				getQtoMainDetailLayout: function (boqType, isSource) {

					let isPrjBoq = (boqType === qtoBoqType.PrjBoq);
					let isPrcBoq = (boqType === qtoBoqType.PrcBoq);
					let  isWipBoq = (boqType === qtoBoqType.WipBoq);
					let  isPesBoq = (boqType === qtoBoqType.PesBoq);
					let  isBillingBoq = (boqType === qtoBoqType.BillingBoq);
					let  isQtoBoq = (boqType === qtoBoqType.QtoBoq);

					let qtoLocationLookupService ={};
					let qtoFormulaFilter = {};

					let dataService = qtoMainDetailService;
					let validationService = qtoMainDetailGridValidationService;

					if( isQtoBoq){
						qtoLocationLookupService = 'qtoProjectLocationLookupDataService';
						qtoFormulaFilter  ='qto-detail-formula-filter';

					}else if(isPrjBoq){
						qtoLocationLookupService ='boqMainQtoLocationLookupService';
						qtoFormulaFilter='qto-detail-formula-filter-prj';
						dataService = $injector.get('boqMainQtoDetailService');
						validationService = $injector.get('boqMainQtoDetailValidationService');
					}else if(isPrcBoq){
						qtoLocationLookupService ='procurementPackageQtoLocationLookupService';
						qtoFormulaFilter='qto-detail-formula-filter-prc';

						dataService = $injector.get('procurementPackageQtoDetailService');
						validationService = $injector.get('procurementPackageQtoDetailValidationService');
					}else if(isWipBoq){
						qtoLocationLookupService ='salesWipQtoLocationLookupService';
						qtoFormulaFilter ='qto-detail-formula-filter-wip';

						dataService = $injector.get('salesWipQtoDetailService');
						validationService = $injector.get('salesWipQtoDetailValidationService');
					}else if(isPesBoq){
						qtoLocationLookupService ='procurementPesQtoLocationLookupService';
						qtoFormulaFilter = 'qto-detail-formula-filter-pes';

						dataService = $injector.get('procurementPesQtoDetailService');
						validationService = $injector.get('procurementPesQtoDetailValidationService');
					}else if(isBillingBoq){
						qtoFormulaFilter ='qto-detail-formula-filter-billing';
						qtoLocationLookupService ='salesBillingQtoLocationLookupService';

						dataService = $injector.get('salesBillingQtoDetailService');
						validationService = $injector.get('salesBillingQtoDetailValidationService');
					}

					let onSelectedItemChanged = function (e, args) {
						if (args.selectedItem) {
							args.entity.EstHeaderFk = args.selectedItem.EstHeaderFk;

							let assignedAttributes = function () {
								// find the same group qto by the qto primary boqitemcode
								let referencedLines = dataService.getTheSameGroupQto(args.entity);
								if (referencedLines.length > 0) {
									referencedLines.forEach(function (item) {
										item.EstHeaderFk = args.selectedItem.EstHeaderFk;
										item.EstLineItemFk = args.selectedItem.Id;

										item.MdcControllingUnitFk = args.selectedItem.MdcControllingUnitFk;
										item.PrcStructureFk = args.selectedItem.PrcStructureFk;
										item.PrjLocationFk = args.selectedItem.PrjLocationFk;
										item.AssetMasterFk = args.selectedItem.MdcAssetMasterFk;

										item.SortCode01Fk = args.selectedItem.SortCode01Fk;
										item.SortCode02Fk = args.selectedItem.SortCode02Fk;
										item.SortCode03Fk = args.selectedItem.SortCode03Fk;
										item.SortCode04Fk = args.selectedItem.SortCode04Fk;
										item.SortCode05Fk = args.selectedItem.SortCode05Fk;
										item.SortCode06Fk = args.selectedItem.SortCode06Fk;
										item.SortCode07Fk = args.selectedItem.SortCode07Fk;
										item.SortCode08Fk = args.selectedItem.SortCode08Fk;
										item.SortCode09Fk = args.selectedItem.SortCode09Fk;
										item.SortCode10Fk = args.selectedItem.SortCode10Fk;

										args.entity.IsLineItemChange = true;
									});

									dataService.markEntitiesAsModified(referencedLines);
									dataService.updateQtoDetailGroupInfo();
								}
							};

							if (!args.entity.EstLineItemFk) {
								assignedAttributes();
							} else {
								let platformChangeSelectionDialogService = $injector.get('platformChangeSelectionDialogService');
								platformChangeSelectionDialogService.showDialog({
									bodyText$tr$: 'qto.main.selectChangedLineItemWarning',
									dontShowAgain: true,
									id: 'dba607020113431eb9c1e2182a1159da'
								}).then(result => {
									if (result.yes || result.ok) {
										assignedAttributes();
									}
								});
							}
						}
					};

					let onEstLineItemSelectedItemChanged = function (e, args) {
						if (args.selectedItem) {
							args.entity.EstHeaderFk = args.selectedItem.EstHeaderFk;

							let assignedAttributes = function () {
								// find the same group qto by the qto primary boqitemcode
								let referencedLines = dataService.getTheSameGroupQto(args.entity);
								if (referencedLines.length > 0) {
									referencedLines.forEach(function (item) {
										item.EstHeaderFk = args.selectedItem.EstHeaderFk;
										item.EstLineItemFk = args.selectedItem.Id;

										item.MdcControllingUnitFk = args.selectedItem.MdcControllingUnitFk;
										item.PrcStructureFk = args.selectedItem.PrcStructureFk;
										item.PrjLocationFk = args.selectedItem.PrjLocationFk;
										item.AssetMasterFk = args.selectedItem.MdcAssetMasterFk;

										item.SortCode01Fk = args.selectedItem.SortCode01Fk;
										item.SortCode02Fk = args.selectedItem.SortCode02Fk;
										item.SortCode03Fk = args.selectedItem.SortCode03Fk;
										item.SortCode04Fk = args.selectedItem.SortCode04Fk;
										item.SortCode05Fk = args.selectedItem.SortCode05Fk;
										item.SortCode06Fk = args.selectedItem.SortCode06Fk;
										item.SortCode07Fk = args.selectedItem.SortCode07Fk;
										item.SortCode08Fk = args.selectedItem.SortCode08Fk;
										item.SortCode09Fk = args.selectedItem.SortCode09Fk;
										item.SortCode10Fk = args.selectedItem.SortCode10Fk;

										item.IsLineItemChange = true;
									});

									dataService.markEntitiesAsModified(referencedLines);
									dataService.updateQtoDetailGroupInfo();
								}
							};

							if (!args.entity.EstLineItemFk) {
								assignedAttributes();
							} else {
								let platformChangeSelectionDialogService = $injector.get('platformChangeSelectionDialogService');
								platformChangeSelectionDialogService.showDialog({
									bodyText$tr$: 'qto.main.selectChangedLineItemWarning',
									dontShowAgain: true,
									id: 'dba607020113431eb9c1e2182a1159da'
								}).then(result => {
									if (result.yes || result.ok) {
										assignedAttributes();
									}
								});
							}
						}
					};

					let attributs = ['boqitemcode', 'boqsplitquantityfk', 'basuomfk', 'prjlocationfk', 'assetmasterfk',
						'prcstructurefk', 'mdccontrollingunitfk', 'qtolinetypecode', 'qtoformulafk', 'factor',
						'value1detail', 'operator1', 'value2detail', 'operator2', 'value3detail', 'operator3',
						'value4detail', 'operator4', 'value5detail', 'operator5',
						'formularesultui', 'result', 'subtotal', 'isblocked', 'isreadonly',
						'specialuse', 'performeddate', 'performedfromwip', 'performedtowip', 'performedfrombil', 'performedtobil', 'progressinvoiceno',
						'remarktext', 'remark1text', 'pagenumber', 'linereference', 'lineindex',
						'wipheaderfk', 'pesheaderfk', 'ordheaderfk', 'linetext', 'qtodetailstatusfk', 'v','bilheaderfk','userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5',
						'sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk',
						'qtodetailsplitfromreference'];

					if(isBillingBoq || isWipBoq || isPesBoq ) {
						attributs.push('isbq');
						attributs.push('isiq');
						attributs.push('billtofk');
						if (isBillingBoq || isWipBoq) {
							attributs.push('estlineitemfk');
						}
					}else if(isPrcBoq || isPrjBoq) {
						attributs.push('iswq');
						attributs.push('isaq');
						attributs.push('billtofk');
					}else {
						attributs.push('iswq');
						attributs.push('isaq');
						attributs.push('isbq');
						attributs.push('isiq');
						attributs.push('isgq');
						attributs.push('billtofk');
						attributs.push('estlineitemfk');
					}

					let projectIdOfheaderService = function projectIdOfheaderService(boqType, isSource) {

						let headerService ={};
						let projectId = -1;
						switch (boqType) {
							case qtoBoqType.PrjBoq:
								headerService = $injector.get('boqMainService');
								if (_.isFunction(headerService.getSelectedProjectId)) {
									projectId = headerService.getSelectedProjectId();
								}
								break;
							case qtoBoqType.PrcBoq:
								headerService = $injector.get('procurementPackageDataService');
								if (_.isFunction(headerService.getSelected)) {
									projectId = headerService.getSelected().ProjectFk;
								}
								break;
							case qtoBoqType.WipBoq:
								headerService = $injector.get('salesWipService');
								if (_.isFunction(headerService.getSelected)) {
									projectId = headerService.getSelected().ProjectFk;
								}
								break;
							case qtoBoqType.QtoBoq:
								if (isSource) {
									projectId = $injector.get('qtoMainDetailLookupFilterService').selectedQtoHeader.ProjectFk;
								} else {
									projectId = qtoMainDetailService.getSelectedProjectId();
								}
								break;
							case qtoBoqType.PesBoq:
								headerService = $injector.get('procurementPesHeaderService');
								if (_.isFunction(headerService.getSelected)) {
									projectId = headerService.getSelected().ProjectFk;
								}
								break;
							case qtoBoqType.BillingBoq:
								headerService = $injector.get('salesBillingService');
								if (_.isFunction(headerService.getSelected)) {
									projectId = headerService.getSelected().ProjectFk;
								}
								break;
						}

						return projectId;
					};

					let layOut= {
						'fid': 'qto.main.detail',
						'version': '1.0.0',
						'showGrouping': true,
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes':attributs
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'qtodetailstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.qtodetailstatus', null, {
								showIcon: true
							}),
							'boqitemfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-lookup-data-by-custom-data-service',
										descriptionMember: 'BriefInfo.Description',
										lookupOptions: {
											'lookupType': 'boqItemLookupDataService',
											'dataServiceName': 'boqItemLookupDataService',
											'valueMember': 'Id',
											'displayMember': 'Reference',
											'filter': function () {
												if (qtoMainHeaderDataService.getSelected()) {
													return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
												}
											},
											'lookupModuleQualifier': 'boqItemLookupDataService',
											'columns': [
												{
													'id': 'Brief',
													'field': 'BriefInfo.Description',
													'name': 'Brief',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityBrief'
												},
												{
													'id': 'Reference',
													'field': 'Reference',
													'name': 'Reference',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityReference'
												},
												{
													'id': 'BasUomFk',
													'field': 'BasUomFk',
													'name': 'Uom',
													'formatter': 'lookup',
													'formatterOptions': {
														lookupType: 'uom',
														displayMember: 'Unit'
													},
													'name$tr$': 'cloud.common.entityUoM'
												}
											],
											'treeOptions': {
												'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
											},
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (e, args) {
														let selectedItem = angular.copy(args.selectedItem);
														if (!selectedItem) {
															args.entity.BoqItemCode = '';
															args.entity.BoqItemFk = null;
														}
													}
												}
											]
										}
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'boqItemLookupDataService',
										dataServiceName: 'boqItemLookupDataService',
										filter: function () {
											if (qtoMainHeaderDataService.getSelected()) {
												return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
											}
										},
										'filterKey': 'boq-item-reference-filter',
										displayMember: 'Reference'
									},
									editor: 'lookup',
									'editorOptions': {
										'lookupDirective': 'basics-lookup-data-by-custom-data-service',
										'lookupType': 'boqItemLookupDataService',
										'lookupOptions': {
											'enableCache': false,
											'lookupType': 'boqItemLookupDataService',
											'dataServiceName': 'boqItemLookupDataService',
											'valueMember': 'Id',
											'displayMember': 'Reference',
											'filter': function () {
												if (qtoMainHeaderDataService.getSelected()) {
													return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
												}
											},
											'lookupModuleQualifier': 'boqItemLookupDataService',
											'columns': [
												{
													'id': 'Brief',
													'field': 'BriefInfo.Description',
													'name': 'Brief',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityBrief'
												},
												{
													'id': 'Reference',
													'field': 'Reference',
													'name': 'Reference',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityReference'
												},
												{
													'id': 'BasUomFk',
													'field': 'BasUomFk',
													'name': 'Uom',
													'formatter': 'lookup',
													'formatterOptions': {
														lookupType: 'uom',
														displayMember: 'Unit'
													},
													'name$tr$': 'cloud.common.entityUoM'
												}
											],
											'treeOptions': {
												'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
											}
										}
									},
									width: 130
								}
							},
							'boqitemcode': {
								'navigator': {
									moduleName: 'boq.main',
									'navFunc': function (triggerFieldOption, item) {
										let boqRuleComplexLookupService = $injector.get ('boqRuleComplexLookupService');
										if (boqRuleComplexLookupService) {
											boqRuleComplexLookupService.setNavFromBoqProject ();
											$injector.get ('boqMainService').setList ([]);
											let qtoMainHeaderDataService = $injector.get ('qtoMainHeaderDataService');
											if (qtoMainHeaderDataService) {
												qtoMainHeaderDataService.updateAndExecute (function () {
													let projectId = qtoMainHeaderDataService.getSelectedProjectId ();
													boqRuleComplexLookupService.setProjectId (projectId);
													boqRuleComplexLookupService.loadLookupData ().then (function () {
														triggerFieldOption.ProjectFk = projectId;
														triggerFieldOption.NavigatorFrom = 'EstBoqItemNavigator';
														$injector.get ('platformModuleNavigationService').navigate ({moduleName: 'boq.main'}, item, triggerFieldOption);
													});
												});
											}

										}
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'qto-detail-boq-item-lookup',
										lookupOptions: {
											'enableCache': false,
											'lookupType': 'qtoDetailBoqItemCode',
											dataServiceName: 'qtoBoqItemLookupService',
											isTextEditable: true,
											filter: function () {
												return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
											},
											disableDataCaching: false
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'qto-detail-boq-item-lookup',
										lookupOptions: {
											'enableCache': false,
											'lookupType': 'qtoDetailBoqItemCode',
											dataServiceName: 'qtoBoqItemLookupService',
											isTextEditable: true,
											filter: function () {
												return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
											},
											disableDataCaching: false
										}
									},
									formatter: function (row, cell, value, columnDef, entity) {
										var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
										if (platformRuntimeDataService.hasError(entity, columnDef.field)) {
											var errorMessage = platformRuntimeDataService.getErrorText(entity, columnDef.field);
											value = _.isEmpty(value) ? '' : value;
											return '<div class="invalid-cell" title="' + errorMessage + '">' + value + '</div>';
										}

										if (_.isEmpty(entity[columnDef.field]) && entity.BoqItemFk > 0) {
											var qtoBoqList = $injector.get('basicsLookupdataLookupDescriptorService').getData('qtoBoqItemLookupService');
											var boqItem = _.find(qtoBoqList, {Id: entity.BoqItemFk});

											// Re-assignment
											entity[columnDef.field] = boqItem ? boqItem.Reference : null;
											return boqItem ? boqItem.Reference : '';
										}

										let result = value ? value :entity[columnDef.field];
										return result + $injector.get('platformGridDomainService').getNavigator(columnDef, entity);
									},
									width: 130
								}
							},
							'basuomfk': {
								'readonly': true,
								'detail': {
									'type': 'directive',
									'model': 'BasUomFk',
									'directive': 'basics-lookupdata-uom-lookup'
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'uom',
										displayMember: 'Unit'
									},
									width: 100
								}
							},
							'prjlocationfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-lookup-data-by-custom-data-service',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											'enableCache': true,
											'lookupType': 'ProjectLocation',
											'dataServiceName': qtoLocationLookupService,
											'valueMember': 'Id',
											'displayMember': 'Code',
											'filter': function () {
												var projectId = -1;
												if(isQtoBoq) {
													projectId = qtoMainDetailService.getSelectedProjectId();
												}else if(isPrjBoq){
													projectId = $injector.get('boqMainQtoDetailService').getSelectedProjectId();
												}else if(isPrcBoq) {
													projectId = $injector.get('procurementPackageQtoDetailService').getSelectedProjectId();
												}else  if(isWipBoq){
													projectId = $injector.get('salesWipQtoDetailService').getSelectedProjectId();
												}else  if(isPesBoq){
													projectId = $injector.get('procurementPesQtoDetailService').getSelectedProjectId();
												}else  if(isBillingBoq) {
													projectId = $injector.get('salesBillingQtoDetailService').getSelectedProjectId();
												}
												return projectId;
											},
											'lookupModuleQualifier': qtoLocationLookupService,
											'showClearButton': true,
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
													'field': 'DescriptionInfo.Translated',
													'name': 'Description',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityDescription'
												}
											],
											'treeOptions': {
												'parentProp': 'LocationParentFk', 'childProp': 'Locations'
											}
										}
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ProjectLocation',
										displayMember: 'Code'
									},
									editor: 'lookup',
									disableDataCaching: true,
									'editorOptions': {
										'lookupDirective': 'basics-lookup-data-by-custom-data-service',
										'lookupType': qtoLocationLookupService,
										'lookupOptions': {
											'enableCache': true,
											'lookupType': 'ProjectLocation',
											'dataServiceName': qtoLocationLookupService,
											'valueMember': 'Id',
											'displayMember': 'Code',
											'filter': function () {
												var projectId = -1;
												if(isQtoBoq) {
													projectId = qtoMainDetailService.getSelectedProjectId();
												}else if(isPrjBoq){
													projectId = $injector.get('boqMainQtoDetailService').getSelectedProjectId();
												}else if(isPrcBoq) {
													projectId = $injector.get('procurementPackageQtoDetailService').getSelectedProjectId();
												}else  if(isWipBoq){
													projectId = $injector.get('salesWipQtoDetailService').getSelectedProjectId();
												}else  if(isPesBoq){
													projectId = $injector.get('procurementPesQtoDetailService').getSelectedProjectId();
												}else  if(isBillingBoq) {
													projectId = $injector.get('salesBillingQtoDetailService').getSelectedProjectId();
												}
												return projectId;
											},
											'lookupModuleQualifier': qtoLocationLookupService,
											'showClearButton': true,
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
													'field': 'DescriptionInfo.Translated',
													'name': 'Description',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityDescription'
												}
											],
											'treeOptions': {
												'parentProp': 'LocationParentFk', 'childProp': 'Locations'
											},
											'uuid': '45FE67F981C242808E4F6E6F17A42949'
										}
									},
									width: 100
								}
							},
							'assetmasterfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										readOnly: true,
										lookupDirective: 'basics-asset-master-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {showClearButton: true},
										directive: 'basics-asset-master-dialog'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'AssertMaster',
										displayMember: 'Code'
									},
									width: 100,
									bulkSupport: false
								}
							},
							'qtolinetypecode':{
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'qto-line-type-code-lookup',
										lookupOptions: {
											'enableCache': false,
											'lookupType': 'qtoLineTypeCode',
											dataServiceName: 'qtoLineTypeCodeLookupService',
											isTextEditable: true,
											isSupportedKeyDown: true,
											disableDataCaching: false
										},
										descriptionMember: 'Description',

									},
									'change': 'formOptions.onPropertyChanged'
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'qto-line-type-code-lookup',
										lookupOptions: {
											'enableCache': false,
											'lookupType': 'qtoLineTypeCode',
											dataServiceName: 'qtoLineTypeCodeLookupService',
											isTextEditable: true,
											isSupportedKeyDown: true,
											disableDataCaching: false,
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (e, args) {
														let selectedItem = angular.copy(args.selectedItem);
														let syncLineTypeInGroup = false;

														if(args.previousItem && args.previousItem.Id === 1){
															args.entity.bakResult = args.entity.Result;
															if(selectedItem.Id ===8){
																syncLineTypeInGroup = true;
																args.entity.Result = '(' + args.entity.Result + ')';
															}

														}else if(args.previousItem && args.previousItem.Id === 2 && selectedItem && selectedItem.Id ===1  ){
															args.entity.Result = args.entity.bakResult;
														}else if(args.previousItem && args.previousItem.Id === 8 && selectedItem && selectedItem.Id ===1 ){
															syncLineTypeInGroup = true;
															dataService.changeQtoLineTypeFromAuxToStd(args.entity);
														}

														if (selectedItem){
															args.entity.QtoLineTypeCode = selectedItem.Code;
															args.entity.QtoLineTypeFk = selectedItem.Id;
															if(selectedItem.Id === 2){
																args.entity.Result = 0;
															}
														}

														let qtoDetailValidationServiceFactory = $injector.get('qtoDetailValidationServiceFactory');
														let validationService = qtoDetailValidationServiceFactory.createNewQtoDetailValidationService(dataService,qtoBoqType.QtoBoq);
														validationService.validateQtoLineTypeFk(args.entity, args.entity.QtoLineTypeCode);

														if(syncLineTypeInGroup){
															validationService.validateNSyncQtoLineTypeInGroup(args.entity, selectedItem, args.previousItem);
														}

														args.entity.IsCalculate = true;
														dataService.markItemAsModified(args.entity);
													}
												},
												{
													name: 'onInitialized',
													handler: function (e, args) {
														var entity = dataService.getSelected();

														var qtolinetypeList = $injector.get('basicsLookupdataLookupDescriptorService').getData('qtoLineTypeCodeLookupService');
														var qtolinetype = entity ? _.find(qtolinetypeList, { Id: entity.QtoLineTypeFk }) || $injector.get('qtoLineTypeCodeLookupService').getItemById(entity.QtoLineTypeFk) : null;

														if (qtolinetype){
															var onModelChangeFn = args.lookup.onModelChange;

															args.lookup.onModelChange = function(){};
															args.lookup.selectItem(qtolinetype);

															setTimeout(function(){
																args.lookup.onModelChange = onModelChangeFn;
															});
														}
													}
												},
												{
													name: 'onEditValueChanged',
													handler: function (e, args) {

														if(args.entity && args.entity.QtoLineTypeCode === args.newValue){
															return;
														}

														if(!args.newValue) {
															let qtoDetailValidationServiceFactory = $injector.get('qtoDetailValidationServiceFactory');
															let validationService = qtoDetailValidationServiceFactory.createNewQtoDetailValidationService(dataService, qtoBoqType.QtoBoq);
															validationService.validateQtoLineTypeFk(args.entity, args.entity.newValue);
															return;
														}

														let qtolinetypeList = $injector.get('basicsLookupdataLookupDescriptorService').getData('qtoLineTypeCodeLookupService');
														let qtoType = _.find(qtolinetypeList, function (qtoLineType){
															return qtoLineType.CodeInfo && qtoLineType.CodeInfo.Description === args.entity.newValue;
														});
														if (!qtoType) {
															return;
														}

														if(args.entity.QtoLineTypeFk === 1){
															args.entity.bakResult = args.entity.Result;
															args.entity.Result = 0;
														}else if(args.entity.QtoLineTypeFk === 2 && qtoType.Id === 1){
															args.entity.Result = args.entity.bakResult;
														}

														args.entity.QtoLineTypeCode = qtoType.Code;
														args.entity.QtoLineTypeFk = qtoType.Id;

														if(args.entity.V){
															args.entity.V = _.toUpper(args.entity.V);
														}
														args.entity.IsCalculate = true;
													}

												}
											]
										}
									},
									formatter: function (row, cell, value, columnDef, entity) {
										var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
										if (platformRuntimeDataService.hasError(entity, columnDef.field)) {
											var errorMessage = platformRuntimeDataService.getErrorText(entity, columnDef.field);
											value = _.isEmpty(value) ? '' : value;
											return '<div class="invalid-cell" title="' + errorMessage + '">' + value + '</div>';
										}

										if (entity.QtoLineTypeFk > 0) {
											var qtolinetypeList = $injector.get('basicsLookupdataLookupDescriptorService').getData('qtoLineTypeCodeLookupService');

											if(!qtolinetypeList){
												qtolinetypeList = $injector.get('basicsLookupdataLookupDescriptorService').getData('qtolinetype');
											}

											if(!_.isNumber(entity.QtoLineTypeFk)){
												entity.QtoLineTypeFk = parseInt(entity.QtoLineTypeFk);
											}
											var qtolinetype = _.find(qtolinetypeList, {Id: entity.QtoLineTypeFk});

											// Re-assignment
											entity[columnDef.field] = qtolinetype && qtolinetype.CodeInfo ?  qtolinetype.CodeInfo.Description : null;
											return qtolinetype && qtolinetype.CodeInfo.Description ?  qtolinetype.CodeInfo.Description : '';
										}

										return entity.QtoLineTypeCode ?  entity.QtoLineTypeCode:'';
									},
									width: 130,
									bulkSupport: false
								}
							},
							'qtoformulafk': {
								'detail': {
									'type': 'directive',
									'options': {
										formatter: 'dynamic',
										domain: function (item, column) {
											var domain;
											switch (item.QtoLineTypeFk) {
												case qtoMainLineType.CommentLine:
													domain = 'directive';
													column.field = 'LineText';
													column.editorOptions = {
														directive: 'qto-comment-combobox',
														isTextEditable: true,
														multiSelect: true
													};
													column.formatterOptions = {
														lookupType: 'QtoComment',
														displayMember: 'CommentText',
														field: 'LineText',
														multiSelect: true
													};
													break;
												case qtoMainLineType.LRefrence:
												case qtoMainLineType.RRefrence:
												case qtoMainLineType.IRefrence:
													domain = 'remark';
													column.QtoFormulaFk = null;
													column.field = 'QtoFormulaFk';
													column.editorOptions = null;
													column.formatterOptions = null;

													break;
												default :
													domain = 'lookup';
													column.field = 'QtoFormulaFk';
													column.editorOptions = {
														directive: 'qto-formula-lookup',
														// filterKey: qtoFormulaFilter,
														lookupOptions: {
															filterKey: qtoFormulaFilter,
															showClearButton: true
														}
													};
													column.formatterOptions = {
														lookupType: 'QtoFormula',
														displayMember: 'Code',
														imageSelector: 'qtoFormulaIconProcessor'
													};
													break;
											}
											return domain;
										}
									}
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column, flag) {
										var domain;
										let isQtoFormula = false;
										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.CommentLine:
												domain = 'directive';
												column.field = 'LineText';
												column.editorOptions = {
													directive: 'qto-comment-combobox',
													isTextEditable: true,
													showClearButton: true
												};
												column.formatterOptions = {
													lookupType: 'QtoComment',
													displayMember: 'CommentText',
													field: 'LineText'
												};
												break;
											case qtoMainLineType.LRefrence:
											case qtoMainLineType.RRefrence:
											case qtoMainLineType.IRefrence:
												domain = 'remark';
												column.QtoFormulaFk = null;
												column.field = 'QtoFormulaFk';
												column.editorOptions = null;
												column.formatterOptions = null;

												break;
											default :
												isQtoFormula = true;
												domain = 'lookup';
												column.field = 'QtoFormulaFk';
												column.editorOptions = {
													directive: 'qto-formula-lookup',
													// filterKey: qtoFormulaFilter
													lookupOptions: {
														filterKey: qtoFormulaFilter,
														showClearButton: true,
														events: [
															{
																name: 'onSelectedItemChanged',
																handler: function () {
																	qtoMainDetailService.setIsFormulaChanged(true);
																}
															}
														]
													}
												};
												column.formatterOptions = {
													lookupType: 'QtoFormula',
													displayMember: 'Code',
													imageSelector: 'qtoFormulaIconProcessor'
												};
												break;
										}
										let lookupDomainFormatter = function lookupDomainFormatter(row, cell, value, columnDef, dataContext, plainText) {
											let platformGridDomainService = $injector.get('platformGridDomainService');
											value = _.get(dataContext, columnDef.field);

											let result = '';

											if (item) {
												let css = platformGridDomainService.alignmentCssClass(domain);
												let formatter = platformGridDomainService.formatter(domain);

												result = formatter(row, cell, value, columnDef, item, plainText);
												if (css) {
													result = '<div class="' + css + '">' + result + '</div>';
												}
												return result;
											}

											return result;
										};

										return isQtoFormula && !flag ? lookupDomainFormatter : domain;
									},
									width: 130,
									bulkSupport: false
								}
							},
							'factor': {
								'detail': {},
								'grid': {
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain = 'factor';

										var tempPlaces = 6;

										let qtoHeader = boqType === qtoBoqType.QtoBoq ? qtoMainHeaderDataService.getSelected() : qtoMainHeaderDataService.getCurrentHeader();
										if (qtoHeader) {
											tempPlaces = qtoHeader.NoDecimals;
										}

										column.editorOptions = {decimalPlaces: tempPlaces};
										column.formatterOptions = {decimalPlaces: tempPlaces};
										return domain;
									},
									width: 125,
									bulkSupport: false
								}
							},
							'value1detail': {
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Value1Detail';
										column.editorOptions = null;
										column.formatterOptions = null;
										column.required = false;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:
												if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk === 2) {
													domain = 'remark';
													column.field = 'LineText';
													column.editorOptions = null;
													column.formatterOptions = null;
													column.maxLength = 255;
												} else {
													domain = 'description';
													column.field = 'Value1Detail';
													column.editorOptions = null;
													column.formatterOptions = null;
												}
												break;
											case qtoMainLineType.RRefrence:
												domain = 'lookup';
												column.field = 'QtoDetailReferenceFk';
												column.editorOptions = {
													directive: 'qto-detail-reference-lookup',
													filterKey: 'qto-detail-reference-filter',
													lookupOptions: {
														showClearButton: true
													}
												};
												column.formatterOptions = {
													lookupType: 'QtoDetail',
													displayMember: 'QtoDetailReference'
												};
												break;
											case qtoMainLineType.LRefrence:
											case qtoMainLineType.IRefrence:
												domain = 'lookup';
												column.field = 'BoqItemReferenceFk';
												column.editorOptions = {
													directive: 'qto-detail-boq-reference-lookup',
													filterKey: 'boq-item-reference-filter',
													lookupOptions: {
														showClearButton: true
													}

												};
												column.formatterOptions = {
													lookupType: 'qtoDetailBoqReference',
													displayMember: 'Reference'
												};
												break;
											default:
												domain = 'description';
												column.field = 'Value1Detail';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									},
									width: 120,
									bulkSupport: false
								}
							},
							'operator1': {
								'detail': {
									'type': 'directive',
									'directive': 'qto-detail-formula-lookup',
									'options': {
										rid: 'Operator1',
										model: 'Operator1',
										lookupDirective: 'qto-detail-formula-lookup'
									},
									domain: function (item, column) {
										var domain;
										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator1 && item.QtoFormula.Operator1.indexOf(item.Operator1) >= 0) || item.Operator1 === null || item.Operator1 === '') {
																domain = 'lookup';
																column.field = 'Operator1';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for operator1
																		currentItem: item,
																		OperatorFiled: 'Operator1'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for operator1
																	currentItem: item,
																	OperatorFiled: 'Operator1'
																};
															} else {
																domain = 'description';
																column.field = 'Operator1';
																column.editorOptions = null;
																column.formatterOptions = null;
															}

															break;
														default:
															domain = 'description';
															column.field = 'Operator1';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator1';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									width: 80,
									bulkSupport: false,
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Operator1';
										column.editorOptions = null;
										column.formatterOptions = null;

										if (item.QtoFormula) {
											switch (item.QtoLineTypeFk) {
												case qtoMainLineType.Standard:
												case qtoMainLineType.Hilfswert:
												case qtoMainLineType.Subtotal:
												case qtoMainLineType.ItemTotal:

													if (item.QtoFormula) {
														switch (item.QtoFormula.QtoFormulaTypeFk) {
															case qtoMainFormulaType.Script:
															case qtoMainFormulaType.Predefine:

																if ((item.QtoFormula.Operator1 && item.QtoFormula.Operator1.indexOf(item.Operator1) >= 0) || item.Operator1 === null || item.Operator1 === '') {
																	domain = 'lookup';
																	column.field = 'Operator1';
																	column.editorOptions = {
																		lookupDirective: 'qto-detail-formula-lookup',
																		lookupType: 'QtoFormulaLookupType',
																		dataServiceName: 'qtoFormulaLookupService',
																		lookupOptions: {
																			displayMember: 'Code',
																			showClearButton: true,
																			isTextEditable: false,
																			// to mark as cell for operator1
																			currentItem: item,
																			OperatorFiled: 'Operator1'
																		}
																	};
																	column.formatterOptions = {
																		lookupType: 'QtoFormulaLookupType',
																		dataServiceName: 'qtoFormulaLookupService',
																		displayMember: 'Code',
																		// to mark as cell for operator1
																		currentItem: item,
																		OperatorFiled: 'Operator1'
																	};

																} else {
																	domain = 'description';
																	column.field = 'Operator1';
																	column.editorOptions = null;
																	column.formatterOptions = null;
																}
																break;
															default:
																domain = 'description';
																column.field = 'Operator1';
																column.editorOptions = null;
																column.formatterOptions = null;
																break;
														}
													}
													break;
												default:
													domain = 'description';
													column.field = 'Operator1';
													column.editorOptions = null;
													column.formatterOptions = null;
													break;
											}
										}

										return domain;
									}
								}
							},
							'value2detail': {
								'detail': {},
								'grid': {
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain;

										domain = 'description';
										column.field = 'Value2Detail';
										column.editorOptions = null;
										column.formatterOptions = null;
										column.required = false;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:
												if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk !== 2) {
													domain = 'description';
													column.field = 'Value2Detail';
													column.editorOptions = null;
													column.formatterOptions = null;
												}
												break;
											case qtoMainLineType.LRefrence:
												domain = 'lookup';
												column.field = 'PrjLocationReferenceFk';
												column.editorOptions = {
													lookupDirective: 'basics-lookup-data-by-custom-data-service',
													lookupType: qtoLocationLookupService,
													lookupOptions: {
														dataServiceName: qtoLocationLookupService,
														valueMember: 'Id',
														displayMember: 'Code',
														filter: function () {
															let projectId = -1;
															if (isQtoBoq) {
																projectId = qtoMainDetailService.getSelectedProjectId();
															} else if (isPrjBoq) {
																projectId = $injector.get('boqMainQtoDetailService').getSelectedProjectId();
															} else if (isPrcBoq) {
																projectId = $injector.get('procurementPackageQtoDetailService').getSelectedProjectId();
															} else if (isWipBoq) {
																projectId = $injector.get('salesWipQtoDetailService').getSelectedProjectId();
															} else if (isPesBoq) {
																projectId = $injector.get('procurementPesQtoDetailService').getSelectedProjectId();
															} else if (isBillingBoq) {
																projectId = $injector.get('salesBillingQtoDetailService').getSelectedProjectId();
															}
															return projectId;
														},
														filterKey: 'location-reference-filter',
														lookupModuleQualifier: qtoLocationLookupService,
														showClearButton: true,
														columns: [
															{
																'id': 'Code',
																'field': 'Code',
																'name': 'Code',
																'formatter': 'code',
																'name$tr$': 'cloud.common.entityCode'
															},
															{
																'id': 'Description',
																'field': 'DescriptionInfo.Translated',
																'name': 'Description',
																'formatter': 'description',
																'name$tr$': 'cloud.common.entityDescription'
															}
														],
														'treeOptions': {
															'parentProp': 'LocationParentFk', 'childProp': 'Locations'
														}
													}
												};

												column.formatterOptions = {
													lookupType: 'ProjectLocation',
													displayMember: 'Code'
												};
												break;
											default:
												domain = 'description';
												column.field = 'Value2Detail';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									},
									width: 120,
									bulkSupport: false
								}
							},
							'operator2': {
								'detail': {
									'type': 'directive',
									'directive': 'qto-detail-formula-lookup',
									'options': {
										rid: 'Operator2',
										model: 'Operator2',
										lookupDirective: 'qto-detail-formula-lookup'
									},
									domain: function (item, column) {
										var domain;
										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator2 && item.QtoFormula.Operator2.indexOf(item.Operator2) >= 0) || item.Operator2 === null || item.Operator2 === '') {
																domain = 'lookup';
																column.field = 'Operator2';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator2
																		currentItem: item,
																		OperatorFiled: 'Operator2'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator2
																	currentItem: item,
																	OperatorFiled: 'Operator2'
																};
															} else {
																domain = 'description';
																column.field = 'Operator2';
																column.editorOptions = null;
																column.formatterOptions = null;
															}

															break;
														default:
															domain = 'description';
															column.field = 'Operator2';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator2';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									width: 80,
									bulkSupport: false,
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Operator2';
										column.editorOptions = null;
										column.formatterOptions = null;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Script:
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator2 && item.QtoFormula.Operator2.indexOf(item.Operator2) >= 0) || item.Operator2 === null || item.Operator2 === '') {
																domain = 'lookup';
																column.field = 'Operator2';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator2
																		currentItem: item,
																		OperatorFiled: 'Operator2'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator2
																	currentItem: item,
																	OperatorFiled: 'Operator2'
																};

															} else {
																domain = 'description';
																column.field = 'Operator2';
																column.editorOptions = null;
																column.formatterOptions = null;
															}

															break;
														default:
															domain = 'description';
															column.field = 'Operator2';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator2';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								}
							},
							'value3detail': {
								'detail': {},
								'grid': {
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Value3Detail';
										column.editorOptions = null;
										column.formatterOptions = null;
										column.required = false;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:
												if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk !== 2) {
													domain = 'description';
													column.field = 'Value3Detail';
													column.editorOptions = null;
													column.formatterOptions = null;
												}
												break;
											default:
												domain = 'description';
												column.field = 'Value3Detail';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									},
									width: 120,
									bulkSupport: false
								}
							},
							'operator3': {
								'detail': {
									'type': 'directive',
									'directive': 'qto-detail-formula-lookup',
									'options': {
										rid: 'Operator3',
										model: 'Operator3',
										lookupDirective: 'qto-detail-formula-lookup'
									},
									domain: function (item, column) {
										var domain;
										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator3 && item.QtoFormula.Operator3.indexOf(item.Operator3) >= 0) || item.Operator3 === null || item.Operator3 === '') {
																domain = 'lookup';
																column.field = 'Operator3';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator3
																		currentItem: item,
																		OperatorFiled: 'Operator3'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator3
																	currentItem: item,
																	OperatorFiled: 'Operator3'
																};
															} else {
																domain = 'description';
																column.field = 'Operator3';
																column.editorOptions = null;
																column.formatterOptions = null;
															}
															break;
														default:
															domain = 'description';
															column.field = 'Operator3';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator3';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									width: 80,
									bulkSupport: false,
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Operator3';
										column.editorOptions = null;
										column.formatterOptions = null;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Script:
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator3 && item.QtoFormula.Operator3.indexOf(item.Operator3) >= 0) || item.Operator3 === null || item.Operator3 === '') {
																domain = 'lookup';
																column.field = 'Operator3';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator3
																		currentItem: item,
																		OperatorFiled: 'Operator3'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator3
																	currentItem: item,
																	OperatorFiled: 'Operator3'
																};
															} else {
																domain = 'description';
																column.field = 'Operator3';
																column.editorOptions = null;
																column.formatterOptions = null;
															}
															break;
														default:
															domain = 'description';
															column.field = 'Operator3';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator3';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								}
							},
							'value4detail': {
								'detail': {},
								'grid': {
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Value4Detail';
										column.editorOptions = null;
										column.formatterOptions = null;
										column.required = false;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:
												if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk !== 2) {
													domain = 'description';
													column.field = 'Value4Detail';
													column.editorOptions = null;
													column.formatterOptions = null;
												}
												break;
										}
										return domain;
									},
									width: 120,
									bulkSupport: false
								}
							},
							'operator4': {
								'detail': {
									'type': 'directive',
									'directive': 'qto-detail-formula-lookup',
									'options': {
										rid: 'Operator4',
										model: 'Operator4',
										lookupDirective: 'qto-detail-formula-lookup'
									},
									domain: function (item, column) {
										var domain;
										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator4 && item.QtoFormula.Operator4.indexOf(item.Operator4) >= 0) || item.Operator4 === null || item.Operator4 === '') {
																domain = 'lookup';
																column.field = 'Operator4';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator4
																		currentItem: item,
																		OperatorFiled: 'Operator4'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator4
																	currentItem: item,
																	OperatorFiled: 'Operator4'
																};
															} else {
																domain = 'description';
																column.field = 'Operator4';
																column.editorOptions = null;
																column.formatterOptions = null;
															}
															break;
														default:
															domain = 'description';
															column.field = 'Operator4';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator4';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									width: 80,
									bulkSupport: false,
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Operator4';
										column.editorOptions = null;
										column.formatterOptions = null;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Script:
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator4 && item.QtoFormula.Operator4.indexOf(item.Operator4) >= 0) || item.Operator4 === null || item.Operator4 === '') {
																domain = 'lookup';
																column.field = 'Operator4';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator4
																		currentItem: item,
																		OperatorFiled: 'Operator4'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator4
																	currentItem: item,
																	OperatorFiled: 'Operator4'
																};
															} else {
																domain = 'description';
																column.field = 'Operator4';
																column.editorOptions = null;
																column.formatterOptions = null;
															}
															break;
														default:
															domain = 'description';
															column.field = 'Operator4';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator4';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								}
							},
							'value5detail': {
								'detail': {},
								'grid': {
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain;
										domain = 'description';
										column.field = 'Value5Detail';
										column.editorOptions = null;
										column.formatterOptions = null;
										column.required = false;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:
												if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk !== 2) {
													domain = 'description';
													column.field = 'Value5Detail';
													column.editorOptions = null;
													column.formatterOptions = null;
												}
												break;
										}
										return domain;
									},
									width: 120,
									bulkSupport: false
								}
							},
							'operator5': {
								'detail': {
									'type': 'directive',
									'directive': 'qto-detail-formula-lookup',
									'options': {
										rid: 'Operator5',
										model: 'Operator5',
										lookupDirective: 'qto-detail-formula-lookup'
									},
									domain: function (item, column) {
										var domain;
										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator5 && item.QtoFormula.Operator5.indexOf(item.Operator5) >= 0) || item.Operator5 === null || item.Operator5 === '') {
																domain = 'lookup';
																column.field = 'Operator5';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator5
																		currentItem: item,
																		OperatorFiled: 'Operator5'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator5
																	currentItem: item,
																	OperatorFiled: 'Operator5'
																};
															} else {
																domain = 'description';
																column.field = 'Operator5';
																column.editorOptions = null;
																column.formatterOptions = null;
															}
															break;
														default:
															domain = 'description';
															column.field = 'Operator5';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator3';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									width: 80,
									bulkSupport: false,
									domain: function (item, column) {
										var domain;

										domain = 'description';
										column.field = 'Operator5';
										column.editorOptions = null;
										column.formatterOptions = null;

										switch (item.QtoLineTypeFk) {
											case qtoMainLineType.Standard:
											case qtoMainLineType.Hilfswert:
											case qtoMainLineType.Subtotal:
											case qtoMainLineType.ItemTotal:

												if (item.QtoFormula) {
													switch (item.QtoFormula.QtoFormulaTypeFk) {
														case qtoMainFormulaType.Script:
														case qtoMainFormulaType.Predefine:
															if ((item.QtoFormula.Operator5 && item.QtoFormula.Operator5.indexOf(item.Operator5) >= 0) || item.Operator5 === null || item.Operator5 === '') {
																domain = 'lookup';
																column.field = 'Operator5';
																column.editorOptions = {
																	lookupDirective: 'qto-detail-formula-lookup',
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	lookupOptions: {
																		displayMember: 'Code',
																		showClearButton: true,
																		isTextEditable: false,
																		// to mark as cell for Operator5
																		currentItem: item,
																		OperatorFiled: 'Operator5'
																	}
																};

																column.formatterOptions = {
																	lookupType: 'QtoFormulaLookupType',
																	dataServiceName: 'qtoFormulaLookupService',
																	displayMember: 'Code',
																	// to mark as cell for Operator5
																	currentItem: item,
																	OperatorFiled: 'Operator5'
																};
															} else {
																domain = 'description';
																column.field = 'Operator5';
																column.editorOptions = null;
																column.formatterOptions = null;
															}
															break;
														default:
															domain = 'description';
															column.field = 'Operator5';
															column.editorOptions = null;
															column.formatterOptions = null;
															break;
													}
												}
												break;
											default:
												domain = 'description';
												column.field = 'Operator5';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
										return domain;
									}
								}
							},
							'formularesultui': {
								readonly: true,
								'detail': {
									'type': 'remark'
								},
								'grid': {
									formatter: function (row, cell, value, columnDef, entity/* , plainText */) {
										function handleClick(classId, func) {
											var timeoutId = setTimeout(function () {
												$('.' + classId).click(function (e) {
													e.stopPropagation();
													func(e);
												});
												clearTimeout(timeoutId);
											}, 0);
										}

										value = _.isString(value) ? value : '';

										var outValue = '<div class="ng-pristine ng-untouched ng-valid ng-scope ng-empty">';
										outValue += '<div class="control-directive input-group">';
										outValue += '<input type="text" class="form-control text-left" readonly="readonly" value="' + value + '"></input>';

										if(value !== ''){
											var classId = _.uniqueId('navigator_');
											outValue += '<span class="input-group-btn" >';
											outValue += '<button class="btn btn-default input-sm"><span class="control-icons ico-input-lookup lookup-ico-dialog ' + classId + '">&nbsp;</span></button>';
											handleClick(classId, function (/* e */) {
												qtoMainDetailService.showFormulaResultDetails(entity);
											});
											outValue += '</button>';
										}

										outValue += '</div></div>';
										return outValue;
									},
									width: 120
								}
							},
							'result': {
								readonly: true,
								'detail': {},
								'grid': {
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain = 'quantity';

										if (!item.notSyncToList) {
											validationService.validateResult(item, true);
										}

										var tempPlaces = 6;

										let qtoHeader = boqType === qtoBoqType.QtoBoq ? qtoMainHeaderDataService.getSelected() : qtoMainHeaderDataService.getCurrentHeader();
										if (qtoHeader) {
											tempPlaces = qtoHeader.NoDecimals;
										}

										if (item.QtoLineTypeFk === qtoMainLineType.Hilfswert){
											item.Result = _.isString(item.Result) ? parseFloat(item.Result.replace(/[()]/g, '')) : item.Result;

											item.Result = item.Result.toFixed(tempPlaces);

											item.Result = '(' + item.Result + ')';
											domain = 'description';
											column.cssClass = 'cell-right ';
											column.editorOptions = null;
											column.formatterOptions = null;
										}
										else {
											column.editorOptions = {decimalPlaces: tempPlaces};
											column.formatterOptions = {decimalPlaces: tempPlaces};
										}

										return domain;
									},
									width: 120
								}
							},
							'isblocked': {
								'detail': {
									'type': 'boolean'
								},
								'grid': {
									formatter: 'boolean',
									width: 120
								}
							},
							'isreadonly': {
								'detail': {
									'type': 'boolean'
								},
								'grid': {
									formatter: 'boolean',
									width: 120
								}
							},
							'specialuse': {
								'detail': {
									'type': 'description'
								},
								'grid': {
									formatter: 'description',
									width: 120,
									bulkSupport: false
								}
							},
							'performeddate': {
								'detail': {
									'type': 'dateutc'
								},
								'grid': {
									formatter: 'dateutc',
									width: 120
								}
							},
							'remarktext': {
								'mandatory': true,
								'detail': {
									'type': 'description',
									maxLength: 252
								},
								'grid': {
									formatter: 'description',
									maxLength: 252,
									width: 120
								}
							},
							'remark1text': {
								'mandatory': true,
								'detail': {
									'type': 'description',
									maxLength: 252
								},
								'grid': {
									formatter: 'description',
									width: 120,
									maxLength: 252,
									bulkSupport: false
								}
							},
							'pagenumber': {
								'detail': {
									type: 'dynamic',
									domain: function (item, column) {
										var domain = 'integer';
										column.regex = item && item.QtoTypeFk === 1 ? '^[0-9]{0,5}$' : '^[0-9]{0,4}$';
										return domain;
									},
									validator: 'validatePageNumber',
									bulkSupport: false
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain = 'integer';
										column.regex = item && item.QtoTypeFk === 1 ? '^[0-9]{0,5}$' : '^[0-9]{0,4}$';
										return domain;
									},
									validator: 'validatePageNumber',
									bulkSupport: false
								}
							},
							'linereference': {
								'detail': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain = 'description';

										column.regex = item && item.QtoTypeFk === qtoType.OnormQTO ? '^[0-9]{0,3}$' : '^[A-Za-z]{0,1}$';

										if (item.LineReference) {
											item.LineReference = item.LineReference.toUpperCase();
										}

										return domain;
									},
									validator: 'validateLineReference'
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain = 'description';

										column.regex = item && item.QtoTypeFk === qtoType.OnormQTO ? '^[0-9]{0,3}$' : '^[A-Za-z]{0,1}$';

										if (item.LineReference) {
											item.LineReference = item.LineReference.toUpperCase();
										}

										return domain;
									},
									validator: 'validateLineReference',
									bulkSupport: false
								}
							},
							'lineindex': {
								'detail': {
									type: 'dynamic',
									domain: function (item, column) {
										var domain = 'integer';
										column.regex = '^[0-9]{0,1}$';
										if (item && item.QtoTypeFk) {
											switch (item.QtoTypeFk) {
												case qtoType.FreeQTO:
													column.regex = '^[0-9]{0,2}$';
													break;
												case qtoType.OnormQTO:
													column.regex = '^[0-9]{0,3}$';
													break;
												default:
													column.regex = '^[0-9]{0,1}$';
													break;
											}
										}

										return domain;
									},
									validator: 'validateLineIndex',
									bulkSupport: false
								},
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain = 'integer';

										column.regex = '^[0-9]{0,1}$';
										if (item && item.QtoTypeFk) {
											switch (item.QtoTypeFk) {
												case qtoType.FreeQTO:
													column.regex = '^[0-9]{0,2}$';
													break;
												case qtoType.OnormQTO:
													column.regex = '^[0-9]{0,3}$';
													break;
												default:
													column.regex = '^[0-9]{0,1}$';
													break;
											}
										}

										return domain;
									},
									validator: 'validateLineIndex',
									bulkSupport: false
								}
							},
							'wipheaderfk': {
								'navigator': {
									moduleName: 'sales.wip',
									registerService: 'salesWipService'
								},
								'detail': {
									'type': 'directive',
									'directive': 'sales-wip-code-selector',
									'options': {
										showClearButton: true,
										displayMember: 'Code',
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													let currentQtoLine = args.entity;
													if(args.selectedItem) {
														let item = args.selectedItem;
														currentQtoLine.PerformedFromWip = _.isString(item.PerformedFrom) ? moment.utc(item.PerformedFrom) : item.PerformedFrom;
														currentQtoLine.PerformedToWip = _.isString(item.PerformedTo) ? moment.utc(item.PerformedTo) : item.PerformedTo;

														if (!item.OrdHeaderFk) {
															currentQtoLine.BillToFk = null;
														} else {
															$injector.get('qtoHeaderSalesContractLookupDialogService').getContractById(item.OrdHeaderFk).then(function (data) {
																if (data) {
																	args.entity.BillToFk = data.BillToFk;
																	dataService.gridRefresh(); // detail container need this refresh
																}
															});
														}
													}
													else {
														currentQtoLine.PerformedFromWip = null;
														currentQtoLine.PerformedToWip = null;
													}
												}
											}
										]
									}
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'sales-wip-code-selector',
										filterKey: 'qto-main-wip-reference-filter',
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													let currentQtoLine = args.entity;
													if(args.selectedItem) {
														let item = args.selectedItem;
														currentQtoLine.PerformedFromWip =  _.isString(item.PerformedFrom) ? moment.utc(item.PerformedFrom) : item.PerformedFrom;
														currentQtoLine.PerformedToWip =  _.isString(item.PerformedTo) ? moment.utc(item.PerformedTo) : item.PerformedTo;

														if (!item.OrdHeaderFk) {
															currentQtoLine.BillToFk = null;
														} else {
															$injector.get('qtoHeaderSalesContractLookupDialogService').getContractById(item.OrdHeaderFk).then(function (data) {
																if (data) {
																	args.entity.BillToFk = data.BillToFk;
																}
															});
														}
													}
													else {
														currentQtoLine.PerformedFromWip = null;
														currentQtoLine.PerformedToWip = null;
													}
												}
											}
										]
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'salesWipLookupDataService',
										displayMember: 'Code'
									},
									width: 130,
									bulkSupport: false
								}
							},
							'performedfromwip': {
								'readonly': true,
								'detail': {
									'type': 'dateutc',
									'formatter': 'dateutc'
								},
								'grid': {
									'formatter': 'dateutc',
									'width': 100
								}
							},
							'performedtowip': {
								'readonly': true,
								'detail': {
									'type': 'dateutc',
									'formatter': 'dateutc'
								},
								'grid': {
									'formatter': 'dateutc',
									'width': 100
								}
							},
							'bilheaderfk':{
								'navigator': {
									moduleName: 'sales.billing',
									registerService: 'salesBillingService'
								},
								'detail': {
									'type': 'directive',
									'directive': 'sales-billing-no-selector',
									'options': {
										showClearButton: true,
										displayMember: 'BillNo',
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													let currentQtoLine = args.entity;
													if(args.selectedItem) {
														let item = args.selectedItem;
														currentQtoLine.PerformedFromBil =  _.isString(item.PerformedFrom) ? moment.utc(item.PerformedFrom) : item.PerformedFrom;
														currentQtoLine.PerformedToBil =  _.isString(item.PerformedTo) ? moment.utc(item.PerformedTo) : item.PerformedTo;
														currentQtoLine.ProgressInvoiceNo = item.ProgressInvoiceNo;
														if(!item.OrdHeaderFk){
															currentQtoLine.BillToFk = null;
														}else{
															$injector.get('qtoHeaderSalesContractLookupDialogService').getContractById(item.OrdHeaderFk).then(function (data) {

																if(data) {
																	args.entity.BillToFk = data.BillToFk;
																	dataService.gridRefresh (); // detail container need this refresh
																}
															});
														}
													}
													else {
														currentQtoLine.PerformedFromBil = null;
														currentQtoLine.PerformedToBil = null;
														currentQtoLine.ProgressInvoiceNo = null;
													}
												}
											}
										]
									}
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'BillNo',
										directive: 'sales-billing-no-selector',
										filterKey: 'qto-main-bill-reference-filter',
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													let currentQtoLine = args.entity;
													if(args.selectedItem) {
														let item = args.selectedItem;
														currentQtoLine.PerformedFromBil =  _.isString(item.PerformedFrom) ? moment.utc(item.PerformedFrom) : item.PerformedFrom;
														currentQtoLine.PerformedToBil =  _.isString(item.PerformedTo) ? moment.utc(item.PerformedTo) : item.PerformedTo;
														currentQtoLine.ProgressInvoiceNo = item.ProgressInvoiceNo;

														if(!item.OrdHeaderFk){
															currentQtoLine.BillToFk = null;
														}else{
															$injector.get('qtoHeaderSalesContractLookupDialogService').getContractById(item.OrdHeaderFk).then(function (data) {
																if(data) {
																	args.entity.BillToFk = data.BillToFk;
																}
															});
														}
													}
													else {
														currentQtoLine.PerformedFromBil = null;
														currentQtoLine.PerformedToBil = null;
														currentQtoLine.ProgressInvoiceNo = null;
													}
												}
											}
										]
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'salesBillingNoLookupDataService',
										displayMember: 'BillNo'
									},
									width: 130,
									bulkSupport: false
								}
							},
							'performedfrombil': {
								'readonly': true,
								'detail': {
									'type': 'dateutc',
									'formatter': 'dateutc'
								},
								'grid': {
									'formatter': 'dateutc',
									'width': 100
								}
							},
							'performedtobil': {
								'readonly': true,
								'detail': {
									'type': 'dateutc',
									'formatter': 'dateutc'
								},
								'grid': {
									'formatter': 'dateutc',
									'width': 100
								}
							},
							'progressinvoiceno': {
								'readonly': true,
								'width': 120
							},
							'pesheaderfk': {
								'navigator': {
									moduleName: 'procurement.pes',
									registerService: 'procurementPesHeaderService'
								},
								'detail': {
									'type': 'directive',
									'directive': 'procurement-pes-header-grid-lookup',
									'options': {
										showClearButton: true,
										displayMember: 'Code'
									}
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'procurement-pes-header-grid-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'pesHeaderLookupDataService',
										displayMember: 'Code'
									},
									width: 130,
									bulkSupport: false
								}
							},
							'billtofk':{
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'qto-detail-bill-to-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (e, args) {
														if(args.selectedItem) {
															let selectQtoHeader = qtoMainHeaderDataService.getSelected ();
															let projectFk = selectQtoHeader.ProjectFk;
															let filter = '(CompanyFk=' + $injector.get ('platformContextService').getContext ().clientId + ') and (ProjectFk=' + projectFk + ')';

															args.entity.BillToFk = args.selectedItem.Id;
															$injector.get ('qtoHeaderSalesContractLookupDialogService').getSearchList (filter, 'code', args.entity).then (function (data) {
																if(data && data.length){
																	args.entity.OrdHeaderFk = data[0].Id;
																}
															});
														}else {
															args.entity.OrdHeaderFk = null;
														}
													}
												}
											]
										}
									}
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'qto-detail-bill-to-lookup',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Code',
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (e, args) {
														if(args.selectedItem) {
															if(args.entity) {
																let selectQtoHeader = qtoMainHeaderDataService.getSelected();
																let projectFk = selectQtoHeader.ProjectFk;
																let filter = '(CompanyFk=' + $injector.get('platformContextService').getContext().clientId + ') and (ProjectFk=' + projectFk + ')';

																args.entity.BillToFk = args.selectedItem.Id;
																$injector.get('qtoHeaderSalesContractLookupDialogService').getSearchList(filter, 'code', args.entity).then(function (data) {
																	if (data && data.length) {
																		args.entity.OrdHeaderFk = data[0].Id;
																	}
																});
															}
														}else {
															args.entity.OrdHeaderFk = null;
														}
													}
												}
											]
										}

									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'qtoDetailBillToLookup',
										displayMember: 'Code',
										dataServiceName: 'qtoDetailBillToLookupDataService'
									},
									bulkSupport: true

								}
							},
							'ordheaderfk': {
								navigator: {
									moduleName: 'sales.contract',
									registerService: 'salesContractService'
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'qto-header-sales-contract-lookup-dialog',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'qto-main-header-sales-contract-filter',
											showClearButton: true,
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (e, args) {
														args.entity.BillToFk = args.selectedItem ? args.selectedItem.BillToFk: null;
													}
												}
											]
										}
									}
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'qto-header-sales-contract-lookup-dialog',
										lookupOptions: {
											filterKey: 'qto-main-header-sales-contract-filter',
											showClearButton: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'DescriptionInfo',
												name: 'Description',
												width: 200,
												formatter: 'translation',
												name$tr$: 'cloud.common.entityDescription'
											}],
											additionalColumns: true,
											dialogOptions: {
												alerts: [{
													theme: 'info',
													message: $translate.instant('sales.common.onlyOrderedContractsStatusInfo',
														{statuslist: $translate.instant('sales.common.orderedContractsStatusDescription')})
												}]
											},
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (e, args) {
														args.entity.BillToFk = args.selectedItem ? args.selectedItem.BillToFk: null;
													}
												}
											]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'SalesContractInQto',
										displayMember: 'Code',
										dataServiceName: 'qtoHeaderSalesContractLookupDialogService'
									},
									bulkSupport: false
								}
							},
							'subtotal': {
								readonly: true,
								'mandatory': true,
								'detail': {},
								'grid': {
									formatter: 'dynamic',
									domain: function (item, column) {
										var domain = 'quantity';

										var tempPlaces = 6;

										let qtoHeader = boqType === qtoBoqType.QtoBoq ? qtoMainHeaderDataService.getSelected() : qtoMainHeaderDataService.getCurrentHeader();
										if (qtoHeader) {
											tempPlaces = qtoHeader.NoDecimals;
										}

										column.editorOptions = {decimalPlaces: tempPlaces};
										column.formatterOptions = {decimalPlaces: tempPlaces};
										return domain;
									},
									width: 120
								}
							},
							'linetext': {
								'hide': true,
								'bulkSupport': false
							},
							'v': {
								regex: '^[A-Za-z1-9]{0,1}$',
								// validator:'validateLineIndex',
								bulkSupport: false
							},
							'boqsplitquantityfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsBoqSplitQuantityLookupDataService',
								additionalColumns: false,
								'valMember':'Id',
								'dispMember':'SplitNo',
								'filter': function (item) {
									var currentBoqItemAndBoqHeader = null;
									if (item) {
										currentBoqItemAndBoqHeader = {};
										currentBoqItemAndBoqHeader.BoqItemFk = item.BoqItemFk;
										currentBoqItemAndBoqHeader.BoqHeaderFk = item.BoqHeaderFk;
									}
									return currentBoqItemAndBoqHeader;
								},
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											/* if boq split quantity change, set as true */
											if(args.entity && args.selectedItem) {
												args.entity.IsBoqSplitChange = true;
												args.entity.IsLineItemChange = false;
												args.entity.MdcControllingUnitFk = args.selectedItem.MdcControllingUnitFk;
												args.entity.PrcStructureFk = args.selectedItem.PrcStructureFk;
												args.entity.PrjLocationFk = args.selectedItem.PrjLocationFk;
											}
										}
									}
								]
							}, {bulkSupport: false}),
							'prcstructurefk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-procurementstructure-structure-dialog',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true
										},
										directive: 'basics-procurementstructure-structure-dialog'
									},
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prcstructure',
										displayMember: 'Code'
									}
								}
							},
							'mdccontrollingunitfk': {
								'detail': {
									'model': 'MdcControllingUnitFk',
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'controlling-structure-dialog-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'qto-main-controlling-unit-filter',
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'controlling-structure-dialog-lookup',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'qto-main-controlling-unit-filter',   // 'est-controlling-unit-filter',
											'additionalColumns':true,
											'displayMember':'Code',
											'addGridColumns':[{
												id: 'Description',
												field: 'DescriptionInfo',
												name: 'Description',
												width: 300,
												formatter: 'translation',
												name$tr$: 'cloud.common.entityDescription'
											}]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Controllingunit',
										displayMember: 'Code'
									}
								}
							},
							'userdefined1': {
								'mandatory': false,
								'detail': {
									'type': 'description',
									maxLength: 252
								},
								'grid': {
									formatter: 'description',
									maxLength: 252,
									width: 120
								}
							},
							'userdefined2': {
								'mandatory': false,
								'detail': {
									'type': 'description',
									maxLength: 252
								},
								'grid': {
									formatter: 'description',
									maxLength: 252,
									width: 120
								}
							},
							'userdefined3': {
								'mandatory': false,
								'detail': {
									'type': 'description',
									maxLength: 252
								},
								'grid': {
									formatter: 'description',
									maxLength: 252,
									width: 120
								}
							},
							'userdefined4': {
								'mandatory': false,
								'detail': {
									'type': 'description',
									maxLength: 252
								},
								'grid': {
									formatter: 'description',
									maxLength: 252,
									width: 120
								}
							},
							'userdefined5': {
								'mandatory': false,
								'detail': {
									'type': 'description',
									maxLength: 252
								},
								'grid': {
									formatter: 'description',
									maxLength: 252,
									width: 120
								}
							},
							'sortcode01fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode01LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode02fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode02LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode03fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode03LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode04fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode04LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode05fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode05LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode06fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode06LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode07fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode07LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode08fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode08LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode09fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode09LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'sortcode10fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectSortCode10LookupDataService',
								showClearButton: true,
								filter: function () {
									var projectId = projectIdOfheaderService(boqType, isSource);
									return projectId;
								}
							}),
							'qtodetailsplitfromreference': {
								'readonly': true
							},
							'estlineitemfk': {
								'detail': {
									type: 'directive',
									directive: 'qto-main-line-item-lookup',
									options: {
										filterKey: 'est-lineitem-qtoline-filter',
										pKeyMaps: [{pkMember: 'EstHeaderFk', fkMember: 'EstHeaderFk'}],
										showClearButton: true,
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													onEstLineItemSelectedItemChanged(e, args);
												}
											}
										]
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'qto-main-line-item-lookup',
										lookupOptions: {
											'showClearButton': true,
											'displayMember': 'Code',
											'filterKey': 'est-lineitem-qtoline-filter',
											pKeyMaps: [{pkMember: 'EstHeaderFk', fkMember: 'EstHeaderFk'}],
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (e, args) {
														onEstLineItemSelectedItemChanged(e, args);
													}
												}
											]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'lineitem2Qtolookup',
										displayMember: 'Code',
										filterKey: 'est-lineitem-qtoline-filter',
										pKeyMaps: [{pkMember: 'EstHeaderFk', fkMember: 'EstHeaderFk'}],
										useNewLookupType: true
									}
								}
							}
						},
						'addition': {
							grid: [
								{
									IsReadonly: true,
									field: 'QtoLineTypeFk',
									displayMember: 'DescriptionInfo.Translated',
									name$tr$: 'qto.main.QtoLineTypeDesc',
									editor: null,
									editorOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated',
										directive: 'qto-line-type-code-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'qtoLineTypeCodeLookupService',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 130
								},
								{
									lookupDisplayColumn: true,
									field: 'AssetMasterFk',
									displayMember: 'Description',
									name$tr$: 'qto.main.AssetMasterDesc',
									width: 100
								},
								{
									IsReadonly: true,
									field: 'BoqItemFk',
									editor: null,// 'directive',
									displayMember: 'BriefInfo.Translated',
									name$tr$: 'qto.main.BriefInfo',
									width: 120,
									editorOptions: {
										showClearButton: true,
										displayMember: 'BriefInfo.Translated',
										directive: 'qto-detail-boq-item-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'qtoBoqItemLookupService',
										displayMember: 'BriefInfo.Translated',
										BoqType: boqType
									},
								},
								{
									lookupDisplayColumn: true,
									field: 'PrjLocationFk',
									displayMember: 'DescriptionInfo.Translated',
									name$tr$: 'qto.main.PrjLocationDesc',
									width: 120
								},
								{
									IsReadonly: true,
									field: 'QtoFormulaFk',
									// displayMember: 'DescriptionInfo.Translated',
									name$tr$: 'qto.main.QtoFormulaDesc',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'QtoFormula',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 130
								},
								{
									IsReadonly: true,
									field: 'QtoDetailReference',
									displayMember: 'QtoDetailReference',
									name$tr$: 'qto.main.QtoDetailReference',
									sortable: true,
									width: 130
								},
								{
									IsReadonly: true,
									field: 'WipHeaderFk',
									displayMember: 'DescriptionInfo.Translated',
									name$tr$: 'qto.main.WipHeaderDescription',
									editor: null,
									editorOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated',
										directive: 'sales-wip-code-selector'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'salesWipLookupDataService',
										displayMember: 'DescriptionInfo.Translated',
										BoqType: boqType
									},
									width: 130
								},
								{
									IsReadonly: true,
									field: 'BilHeaderFk',
									displayMember: 'DescriptionInfo.Description',
									name$tr$: 'qto.main.BillDescription',
									editor: null,
									editorOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Description',
										directive: 'sales-billing-no-selector'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'salesBillingNoLookupDataService',
										displayMember: 'DescriptionInfo.Translated',
										BoqType: boqType
									},
									width: 130
								},
								{
									IsReadonly: true,
									field: 'PesHeaderFk',
									displayMember: 'Description',
									name$tr$: 'qto.main.PesHeaderDescription',
									editor: null,// 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description',
										directive: 'procurement-Pes-Header-Lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'pesHeaderLookupDataService',
										displayMember: 'Description',
										BoqType: boqType
									},
									width: 130
								},
								{
									IsReadonly: true,
									field: 'BillToFk',
									displayMember: 'Description',
									name$tr$: 'qto.main.BillToDesc',
									editor: null,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description',
										directive: 'qto-detail-bill-to-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'qtoDetailBillToLookupDataService',
										displayMember: 'Description'
									},
									width: 130
								}
							],
							'detail': [
								{
									'rid': 'WipHeaderFk',
									'gid': 'WIP',
									'label$tr$': 'qto.main.WipHeaderDescription',
									'model': 'WipHeaderFk',
									'type': 'directive',
									'directive': 'sales-wip-code-selector',
									'options': {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									}
								},
								{
									'rid': 'WipHeaderFk',
									'gid': 'WIP',
									'label$tr$': 'qto.main.WipHeaderDescription',
									'model': 'WipHeaderFk',
									'type': 'directive',
									'directive': 'sales-wip-code-selector',
									'options': {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									}
								},
								{
									'rid': 'PesHeaderFk',
									'gid': 'PES',
									'label$tr$': 'qto.main.PesHeaderDescription',
									'model': 'PesHeaderFk',
									'type': 'directive',
									'directive': 'procurement-Pes-Header-Lookup',
									'options': {
										showClearButton: true,
										displayMember: 'Description'
									}
								},
								{
									'rid': 'PesHeaderFk',
									'gid': 'PES',
									'label$tr$': 'qto.main.PesHeaderDescription',
									'model': 'PesHeaderFk',
									'type': 'directive',
									'directive': 'procurement-Pes-Header-Lookup',
									'options': {
										showClearButton: true,
										displayMember: 'Description'
									}
								},
								{
									'rid': 'BilHeaderFk',
									'gid': 'Bill',
									'label$tr$': 'qto.main.BillDescription',
									'model': 'BilHeaderFk',
									'type': 'directive',
									'directive': 'sales-billing-no-selector',
									'options': {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									}
								},
								{
									'rid': 'BillToFk',
									'gid': 'BillTo',
									'label$tr$': 'qto.main.BillToDesc',
									'model': 'BillToFk',
									'type': 'directive',
									'directive': 'qto-detail-bill-to-lookup',
									'options': {
										showClearButton: true,
										displayMember: 'Description'
									}
								}

							]
						}
					};
					return layOut;
				}
			};
		}]);

	angular.module(modName).factory('qtoMainUIStandardService', ['qtoMainDetailLayoutServiceFactory','qtoBoqType',

		function (qtoMainDetailLayoutServiceFactory,qtoBoqType) {

			return qtoMainDetailLayoutServiceFactory.createQtoDetailLayoutService(qtoBoqType.QtoBoq);
		}
	]);
})(angular);



