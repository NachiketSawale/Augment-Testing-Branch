/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).constant('estimateMainBeReplaceType', {
		costCode: 1,
		material: 2,
		plant: 3,
		assembly: 4
	});

	/**
	 * @ngdoc service
	 * @name estimateMainReplaceResourceUIService
	 * @function
	 * @description retrieve ui configuration from this service
	 */
	angular.module(moduleName).factory('estimateMainReplaceResourceUIService', ['$injector', '$translate',
		'platformTranslateService', 'basicsLookupdataConfigGenerator', 'estimateMainReplaceResourceCommonService', 'estimateMainResourceService', 'estimateAssembliesResourceService', 'estimateMainWizardContext', 'estimateMainResourceFrom', 'estimateMainScopeSelectionService',
		'estimateMainBeReplaceType', 'estimateMainResourceType', 'estimateMainReplaceFunctionType',
		function ($injector, $translate,
			platformTranslateService,
			basicsLookupdataConfigGenerator,
			estimateMainReplaceResourceCommonService, estimateMainResourceService, estimateAssembliesResourceService, estimateMainWizardContext, estimateMainResourceFrom, estimateMainScopeSelectionService,
							estimateMainBeReplaceType, estimateMainResourceType, estimateMainReplaceFunctionType) {
			let service = {};
			let resourceDataService = null;

			service.setResourceDataServcie = function (dataService) {
				resourceDataService = dataService;
			};

			let targetJob = function (serviceName, readonly) {
				return basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
					dataServiceName: serviceName,
					enableCache: true,
					events: [{
						name: 'onSelectedItemChanged',
						handler: function onSelectedItemChangedHandler(e, args) {
							if (args && args.entity) {
								if (args.selectedItem && (args.selectedItem.LgmJobFk || args.selectedItem.LgmJobFk === 0)) {
									args.entity.TargetJobFk = args.selectedItem.LgmJobFk;
									// estimateMainReplaceResourceCommonService.onCostCodeTargetChanged.fire(args.selectedItem.MdcCostCodeFk);
								}
							}
						}
					}],
					desMember: 'JobDescription',
					// filterKey: 'estimate-main-project-cost-code-job-filter',
					lookupOptions: {
						defaultFilter: function () {
							return $injector.get('estimateMainService').getSelectedProjectId();
						}
					}
				},
				{
					gid: 'g21',
					rid: 'targetJob',
					model: 'RepaceWithProjectCostCodeId',
					sortOrder: 31,
					label: 'Replace Element Job',
					label$tr$: 'estimate.main.replaceResourceWizard.replaceJob',
					readonly: readonly
				}
				);
			};

			let targetMaterialJob = function (serviceName, readOnly) {
				return basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
					dataServiceName: serviceName,
					enableCache: true,
					events: [{
						name: 'onSelectedItemChanged',
						handler: function onSelectedItemChangedHandler(e, args) {
							if (args && args.entity) {
								if (args.selectedItem && (args.selectedItem.LgmJobFk || args.selectedItem.LgmJobFk === 0)) {
									args.entity.TargetJobFk = args.selectedItem.LgmJobFk;
									// estimateMainReplaceResourceCommonService.onCostCodeTargetChanged.fire(args.selectedItem.MdcCostCodeFk);
								}
							}
						}
					}],
					desMember: 'JobDescription',
					// filterKey: 'estimate-main-project-material-job-filter',
					lookupOptions: {
						defaultFilter: function () {
							return $injector.get('estimateMainService').getSelectedProjectId();
						}
					}
				},
				{
					gid: 'g21',
					rid: 'targetJob',
					model: 'TargetProjectCostCodeId',
					sortOrder: 31,
					label: 'Replace Element Job',
					label$tr$: 'estimate.main.replaceResourceWizard.replaceJob',
					readonly: readOnly
				}
				);
			};

			// ignore job
			let ignoreJob = {
				gid: 'g21',
				rid: 'ignorejob',
				model: 'IgnoreJob',
				label: 'Ignore Current Element Job',
				label$tr$: 'estimate.main.replaceResourceWizard.ignorejob',
				sortOrder: 5,
				type: 'boolean'
			};

			// set the default current element
			function setDefaultElementAndJob(selectedResourceItem, replaceType) {
				estimateMainReplaceResourceCommonService.setDefaultType(replaceType);

				// child of assembly shouldn't be included in the replace wizard
				if(selectedResourceItem && selectedResourceItem.isChildOfComposite){
					estimateMainReplaceResourceCommonService.setDefaultCurrentElement(null, null);
					return;
				}

				if (selectedResourceItem) {
					let toBeReplacedFk =
						(replaceType === estimateMainBeReplaceType.costCode && selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.CostCode) ? selectedResourceItem.MdcCostCodeFk :
							(replaceType === estimateMainBeReplaceType.material && selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Material) ? selectedResourceItem.MdcMaterialFk :
								(replaceType === estimateMainBeReplaceType.assembly && (selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Assembly || selectedResourceItem.EstAssemblyFk)) ? selectedResourceItem.Id : null;

					let currentJobId = $injector.get('estimateMainService').getLgmJobId(selectedResourceItem);
					if (replaceType === estimateMainBeReplaceType.costCode) {
						if (estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource) {
							let copyResourceItem = angular.copy(selectedResourceItem);
							copyResourceItem.Id = toBeReplacedFk;
							estimateMainReplaceResourceCommonService.setDefaultCurrentElement(toBeReplacedFk, copyResourceItem);
						}
						else {
							// find out the Id of the project cost code by job and mdcCostCodeFk
							let prjCostCodes = $injector.get('estimateMainLookupService').getEstCostCodesSyn();
							let findPrjCostCode = _.find(prjCostCodes, function (item) {
								return (item.MdcCostCodeFk === toBeReplacedFk || item.Code === selectedResourceItem.Code);
							});
							estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
							if (findPrjCostCode) {
								estimateMainReplaceResourceCommonService.setDefaultCurrentElement(findPrjCostCode.Id, findPrjCostCode);
							}else{
								estimateMainReplaceResourceCommonService.setDefaultCurrentElement(null, null);
							}
						}
					}
					else if(replaceType === estimateMainBeReplaceType.material) {
						if (estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource) {
							estimateMainReplaceResourceCommonService.setDefaultCurrentElement(toBeReplacedFk);
						}
						else {
							let prjMaterials = $injector.get('estimateMainPrjMaterialLookupService').getPrjMaterialSyn();
							let findprjMaterial = _.find(prjMaterials, function (item) {
								return item.MdcMaterialFk === toBeReplacedFk && item.LgmJobFk === currentJobId;
							});
							estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
							estimateMainReplaceResourceCommonService.setDefaultCurrentElement(toBeReplacedFk, findprjMaterial);
						}
					}
					else if(replaceType === estimateMainBeReplaceType.assembly){
						if (estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource) {
							let estimateMainResAssemblyLookupSer = $injector.get('estimateMainResourceAssemblyLookupService');
							let assemblies = estimateMainResAssemblyLookupSer.getList();
							let findAssemble = _.find(assemblies, function (item) {
								return item.Code === selectedResourceItem.Code;
							});
							estimateMainReplaceResourceCommonService.setDefaultCurrentElement(findAssemble.Id, findAssemble);
							estimateMainResAssemblyLookupSer.setCurrentCode(selectedResourceItem.Code);
						}
						else {
							let estimateMainResAssemblyLookupSer = $injector.get('estimateMainResourceAssemblyLookupService');
							let assemblies = estimateMainResAssemblyLookupSer.getList();
							let findAssemble = _.find(assemblies, function (item) {
								return item.Code === selectedResourceItem.Code && item.LgmJobFk === (selectedResourceItem.LgmJobFk || currentJobId);
							});
							if(findAssemble){
								// find the source job in this case(material)
								estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
								estimateMainReplaceResourceCommonService.setDefaultCurrentElement(findAssemble.Id, findAssemble);
								estimateMainResAssemblyLookupSer.setCurrentCode(selectedResourceItem.Code);
							}else{
								estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(null);
								estimateMainReplaceResourceCommonService.setDefaultCurrentElement(null, null);
							}

						}
					}else if(replaceType === estimateMainBeReplaceType.plant){
						// find the source job in this case(material)
						estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
						estimateMainReplaceResourceCommonService.setDefaultCurrentElement(selectedResourceItem.EtmPlantFk, null);
					}
				} else {
					estimateMainReplaceResourceCommonService.setDefaultCurrentElement(0);
					estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(0);
				}
			}

			service.getReplacementFormConfig = function getReplacementFormConfig(_reload, resourceType) {

				let isEstAssemblyResource = estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource;

				let formConfig = {
					fid: 'estimate.main.replaceResourceWizard.replaceform',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'g21',
							isOpen: true,
							header: 'Select Replacement Element',
							header$tr$: 'estimate.main.replaceResourceWizard.group1Name',
							attributes: [
								'mdccostcodefk', 'materialfk', 'estassemblyfk'
							]
						},
						{
							gid: 'g22',
							isOpen: true,
							header: 'Replaced Value Configuration',
							header$tr$: 'estimate.main.replaceResourceWizard.group2Name',
							attributes: [
								'replacedfields'
							]
						}
					],
					rows: [
						{
							gid: 'g22',
							rid: 'replacedfields',
							label: 'Resource Configure Details',
							label$tr$: 'estimate.main.replaceResourceWizard.replaceDetailsGrid',
							type: 'directive',
							model: 'replacedFields',
							directive: 'estimate-main-replaced-fields-grid',
							readonly: false,
							rows: 20,
							visible: true,
							sortOrder: 30
						}
					]
				};

				// function selection lookup
				let functionTypeRow =
				{
					gid: 'g21',
					rid: 'functionType',
					label: 'Function Type',
					label$tr$: 'estimate.main.replaceResourceWizard.functionType',
					type: 'directive',
					directive: 'estimate-main-replace-resource-function-type',
					model: 'FunctionTypeFk',
					'required': true,
					options: {
						serviceName: 'estimateMainReplaceResourceFunctionTypeLookupDataService',
						displayMember: 'DescriptionInfo.Translated',
						valueMember: 'Id',
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if (args.selectedItem) {
									if (args.entity) {
										// clear the current element value
										args.entity.ToBeReplacedFk = null;
										args.entity.ToBeReplacedElement = null;

										args.entity.BeReplacedWithFk = null;
										args.entity.BeReplacedWithElement = null;

									}
									// update the form view
									estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(null);
									estimateMainReplaceResourceCommonService.onFormConfigUpdated.fire(args.selectedItem, args.entity.ResourceTypeId);
									estimateMainReplaceResourceCommonService.onBroadcastConfigUpdated.fire();
								}
							}
						}]
					},
					readonly: false,
					disabled: false,
					visible: true,
					sortOrder: 2
				};
				formConfig.rows.push(functionTypeRow);

				let costCodeLookupDirective = isEstAssemblyResource ? 'estimate-main-assembly-cost-codes-lookup': 'estimate-main-project-cost-codes-lookup';
				let materialLookupDirective = isEstAssemblyResource ? 'estimate-assemblies-material-lookup': 'estimate-main-material-lookup';

				let originalRows = [
					// CostCode
					{
						gid: 'g21',
						rid: 'mdccostcodefk',
						model: 'CostCodeFk',
						sortOrder: 10,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						maxLength: 255,
						visible: true,
						required: true,
						options: {
							lookupType: 'estmdccostcodes',
							lookupDirective: costCodeLookupDirective,
							showClearButton: true,
							descriptionMember: isEstAssemblyResource ? 'DescriptionInfo.Translated' : 'Description',
							lookupOptions: {
								showClearButton: true,
								disableDataCaching: true,
								isTextEditable: false,
								valueMember: 'Id',
								displayMember: 'Code',
								events: []
							}
						}
					},
					// Material
					{
						gid: 'g21',
						rid: 'materialfk',
						model: 'MaterialFk',
						sortOrder: 10,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						maxLength: 255,
						visible: true,
						required: true,
						options: {
							lookupType: 'MaterialRecord',
							lookupDirective: materialLookupDirective,
							dataServiceName: 'estimateMainMaterialLookupDataService',
							showClearButton: true,
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								isTextEditable: false,
								valueMember: 'Id',
								displayMember: 'Code',
								events: []
							}
						}
					},
					// Assembly
					{
						gid: 'g21',
						rid: 'estassemblyfk',
						model: 'EstAssemblyFk',
						sortOrder: 10,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						maxLength: 255,
						visible: true,
						required: true,
						options: {
							lookupType: 'estassemblyfk',
							lookupDirective: 'estimate-main-assembly-template-lookup',
							showClearButton: true,
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								isTextEditable: false,
								valueMember: 'Id',
								displayMember: 'Code',
								events: [],
								lookupOptions: {
									filterAssemblyKey:'estimate-main-resources-prj-assembly-priority-filter'
								}
							}
						}
					},
					// Equipment Assembly
					{
						gid: 'g21',
						rid: 'estassemblyfk',
						model: 'EstAssemblyFk',
						sortOrder: 10,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						maxLength: 255,
						visible: true,
						required: true,
						options: {
							lookupType: 'estassemblyfk',
							lookupDirective: 'estimate-main-replace-resource-plant-lookup',
							showClearButton: true,
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								isTextEditable: false,
								valueMember: 'Id',
								displayMember: 'Code',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if(args) {
												let selectedItem = args.selectedItem;
												if(args.entity && !selectedItem){
													args.entity.SelectedPlantAssemblyCodes = '';
													args.entity.SelectedPlantAssemblyIds = [];
												}
											}
										}
									}
								]
							}
						}
					}
				];

				let lookupOptionEvents = [
					{
						name: 'onSelectedItemChanged',
						handler: function onSelectedItemChangedHandler(e, args) {
							if (args && args.entity) {
								args.entity.ToBeReplacedElement = args.selectedItem;
								// estimateMainReplaceResourceCommonService.onCurrentItemChange.fire(args.selectedItem);
							}
						}
					},
					{
						name: 'onSelectedItemChanged',
						handler: function onSelectedItemChangedHandler(e, args) {
							if (args && args.entity) {
								args.entity.BeReplacedWithElement = args.selectedItem;
								// estimateMainReplaceResourceCommonService.setReplaceElement(args.entity.BeReplacedWithElement);
								if (args.selectedItem && args.selectedItem.EstHeaderFk) {
									args.entity.AssemblyHeaderFk = args.selectedItem.EstHeaderFk;
								}
							}
						}
					}
				];

				let isToBeReplacedElementCostCode = false;
				let isToBeReplacedElementMaterial = false;
				let isBeReplacedElementAssembly = false;
				let isBeReplacedPlantAssembly = false;
				// filter the rows with selectFunction
				let selectedFunction = estimateMainReplaceResourceCommonService.getSelectedFunction();
				let replaceType = estimateMainBeReplaceType.costCode;

				if (selectedFunction && selectedFunction.Id) {
					let firstRowIndex = 0, secondRowIndex = 0;
					let estimateResourceService = resourceDataService || (isEstAssemblyResource ? estimateAssembliesResourceService : estimateMainResourceService);
					let selectedResourceItem = estimateResourceService.getSelectedTargetReplacement();
					if (selectedResourceItem) {

						if (selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Material && !_reload) {
							// default will be materail type
							estimateMainReplaceResourceCommonService.setSelectedFunction({Id: estimateMainReplaceFunctionType.ReplaceMaterial});
							selectedFunction = estimateMainReplaceResourceCommonService.getSelectedFunction();
						}

						if ((selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Assembly || (selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.SubItem && selectedResourceItem.EstAssemblyFk))  && !_reload) {
							// default will be Assembly type
							estimateMainReplaceResourceCommonService.setSelectedFunction({Id: estimateMainReplaceFunctionType.ReplaceAssembly});
							selectedFunction = estimateMainReplaceResourceCommonService.getSelectedFunction();
						}

						if ((selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Plant || selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) && !_reload) {
							// default will be Plant type
							estimateMainReplaceResourceCommonService.setSelectedFunction({Id: estimateMainReplaceFunctionType.ReplacePlantByPlant});
							selectedFunction = estimateMainReplaceResourceCommonService.getSelectedFunction();
						}
					}

					switch (selectedFunction.Id) {
						case estimateMainReplaceFunctionType.ReplaceCostCode: // Replace CostCode
							firstRowIndex = secondRowIndex = 0;
							isToBeReplacedElementCostCode = true;
							replaceType = estimateMainBeReplaceType.costCode;
							break;
						case estimateMainReplaceFunctionType.ReplaceCostCodeByMaterial: // Replace CostCode By Material
							secondRowIndex = 1;
							isToBeReplacedElementMaterial = true;
							replaceType = estimateMainBeReplaceType.costCode;
							break;
						case estimateMainReplaceFunctionType.ReplaceCostCodeByAssembly: // Replace CostCode By Assembly
							secondRowIndex = 2;
							// isToBeReplacedElementCostCode = true;
							replaceType = estimateMainBeReplaceType.costCode;
							break;
						case estimateMainReplaceFunctionType.ReplaceMaterial: // Replace Material
							firstRowIndex = secondRowIndex = 1;
							replaceType = estimateMainBeReplaceType.material;
							isToBeReplacedElementMaterial = true;
							break;
						case estimateMainReplaceFunctionType.ReplaceMaterialByCostCode: // Replace Material By CostCode
							firstRowIndex = 1;
							secondRowIndex = 0;
							isToBeReplacedElementCostCode = true;
							replaceType = estimateMainBeReplaceType.material;
							break;
						case estimateMainReplaceFunctionType.ReplaceMaterialByAssembly: // Replace Material By Assembly
							firstRowIndex = 1;
							secondRowIndex = 2;
							replaceType = estimateMainBeReplaceType.material;
							break;
						case estimateMainReplaceFunctionType.ReplaceAssembly: // replace Assembly by assembly
							firstRowIndex = secondRowIndex = 2;
							isBeReplacedElementAssembly = true;
							replaceType = estimateMainBeReplaceType.assembly;
							break;
						case estimateMainReplaceFunctionType.ReplaceAssemblyByCostCode: // replace Assembly by costCode
							firstRowIndex = 2;
							secondRowIndex = 0;
							isBeReplacedElementAssembly = true;
							isToBeReplacedElementCostCode = true;
							replaceType = estimateMainBeReplaceType.assembly;
							break;
						case estimateMainReplaceFunctionType.ReplaceAssemblyByMaterial: // replace Assembly by material
							firstRowIndex = 2;
							secondRowIndex = 1;
							isBeReplacedElementAssembly = true;
							isToBeReplacedElementMaterial = true;
							replaceType = estimateMainBeReplaceType.assembly;
							break;
						case estimateMainReplaceFunctionType.ReplacePlantByPlant:
							firstRowIndex = secondRowIndex = 3;
							isBeReplacedPlantAssembly = true;
							replaceType = estimateMainBeReplaceType.plant;
							break;
						case estimateMainReplaceFunctionType.RemoveResource: // remove resource
							firstRowIndex = 0;
							secondRowIndex = 0;
							replaceType = estimateMainBeReplaceType.costCode;
							switch (resourceType){
								case estimateMainReplaceFunctionType.Material:{
									replaceType = estimateMainBeReplaceType.material;
									firstRowIndex = 1;
									break;
								}
								case estimateMainReplaceFunctionType.Assembly:{
									replaceType = estimateMainBeReplaceType.assembly;
									isBeReplacedElementAssembly = true;
									firstRowIndex = 2;
									break;
								}
								case estimateMainReplaceFunctionType.EquipmentAssembly:{
									replaceType = estimateMainBeReplaceType.plant;
									isBeReplacedPlantAssembly = true;
									firstRowIndex = 3;
									break;
								}
							}
							break;
						default:
							break;

					}

					// set the default current element
					setDefaultElementAndJob(selectedResourceItem, replaceType);

					let firstRow = angular.copy(originalRows[firstRowIndex]);
					if(isBeReplacedElementAssembly){
						firstRow.options.lookupDirective = 'estimate-main-resource-assembly-lookup';
					}
					if(isBeReplacedPlantAssembly){
						firstRow.options.lookupOptions.filterPlantAssemblyKey = 'plant-assembly-filter-by-estimate';
					}
					firstRow.options.lookupOptions.events.push({
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.SourceJobFk = null;
						}
					});
					formConfig.rows.push(firstRow);

					if(selectedFunction.Id !== estimateMainReplaceFunctionType.RemoveResource){
						let rowIn = angular.copy(originalRows[secondRowIndex]);
						if (isToBeReplacedElementCostCode) {
							rowIn.options.lookupDirective = 'estimate-main-cost-codes-lookup';
							rowIn.options.descriptionMember = 'DescriptionInfo.Translated';
						}else if(isBeReplacedPlantAssembly){
							rowIn.options.lookupDirective = 'estimate-main-replace-resource-plant-to-lookup';
						}
						formConfig.rows.push(rowIn);
					}

					// rename for the first group(Model and Label and Label$tr$) and attach the correct events

					let itemsInGroup1 = _.filter(formConfig.rows, {gid: 'g21'});
					let itemIndex = 0;
					_.each(itemsInGroup1, function (item) {
						if (itemIndex === 1) {
							item.model = 'ToBeReplacedFk';
							item.sortOrder = 10;
							item.label = 'Current Element';
							item.label$tr$ = 'estimate.main.replaceResourceWizard.currentElement';
							if (item.options.lookupOptions && item.options.lookupOptions.events) {
								item.options.lookupOptions.events.push(angular.copy(lookupOptionEvents[0]));
								if (replaceType === estimateMainBeReplaceType.material) {
									item.options.lookupOptions.filterKey = 'estimate-main-material-project-lookup-filter';
								}
							}
						}
						else if (itemIndex === 2) {
							item.model = 'BeReplacedWithFk';
							item.sortOrder = 20;
							item.label = 'Replaced With Element';
							item.label$tr$ = 'estimate.main.replaceResourceWizard.replacedElement';
							if (item.options.lookupOptions && item.options.lookupOptions.events) {
								item.options.lookupOptions.events.push(angular.copy(lookupOptionEvents[1]));
								if(isToBeReplacedElementMaterial) {
									item.options.lookupOptions.filterKey = 'estimate-main-replace-material-lookup-filter';
								}
							}
						}
						itemIndex++;
					});
				}

				if(isBeReplacedPlantAssembly && selectedFunction.Id !== estimateMainReplaceFunctionType.RemoveResource) {
					formConfig.rows.push({
						gid: 'g21',
						rid: 'selectedPlantAssemblyCodes',
						model: 'SelectedPlantAssemblyCodes',
						label: 'Selected Assembly Codes',
						label$tr$: 'estimate.main.replaceResourceWizard.selectedPlantAssemblyCodes',
						sortOrder: 32,
						type: 'description',
						visible: true,
						readonly: true,
						required: false,
					});
				}

				// set the selection 'select estiamte scope'
				if(estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateMainResource){
					let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
					if (selectlineItemscopeRow) {
						selectlineItemscopeRow.gid = 'g21';
						selectlineItemscopeRow.sortOrder = 1;
					}
					formConfig.rows.push(selectlineItemscopeRow);
				}

				let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
				if (resultSetScopeRow) {
					resultSetScopeRow.gid = 'g21';
					resultSetScopeRow.sortOrder = 1;
				}
				formConfig.rows.push(resultSetScopeRow);

				let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

				if (allEstimateScopeRow) {
					allEstimateScopeRow.gid = 'g21';
					allEstimateScopeRow.sortOrder = 1;
				}
				formConfig.rows.push(allEstimateScopeRow);

				/* let scopeRow = estimateMainScopeSelectionService.getAllScopeFormRow();

				if (scopeRow) {
					scopeRow.gid = 'g21';
					scopeRow.sortOrder = 1;
				}

				formConfig.rows.push(scopeRow); */

				if (!isEstAssemblyResource) {

					formConfig.rows.push(ignoreJob);

					let sourceJobFk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'estimateMainCurrentElementJobService',
						enableCache: true,
						lookupOptions: {
							defaultFilter: function () {
								return $injector.get('estimateMainService').getSelectedProjectId();
							}
						}
					},
					{
						gid: 'g21',
						rid: 'lgmjobfk',
						model: 'SourceJobFk',
						sortOrder: 11,
						label: 'Current Element Job',
						label$tr$: 'estimate.main.replaceResourceWizard.currentJob',
						required: replaceType === estimateMainBeReplaceType.costCode,
						readonly: true // replaceType === estimateMainBeReplaceType.assembly
					}
					);

					formConfig.rows.push(sourceJobFk);

					if (isToBeReplacedElementCostCode && selectedFunction.Id !== 141) {
						formConfig.rows.push(targetJob('estimateMainReplaceElementJobService', true));
					}
					else if (isToBeReplacedElementMaterial) {
						formConfig.rows.push(targetMaterialJob('estimateMainReplaceElementJobService', true));
					}
				}


				// function selection lookup
				let sourceTypeRow =
					{
						gid: 'g21',
						rid: 'sourceType',
						label: 'Resource Type',
						label$tr$: 'estimate.main.replaceResourceWizard.resourceType',
						type: 'select',
						model: 'ResourceTypeId',
						'required': true,
						options: {
							displayMember: 'desc',
							valueMember: 'id',
							items: []
						},
						readonly: false,
						disabled: false,
						visible: selectedFunction.Id === 141,
						sortOrder: 2,
						validator: function (entity, value){
							estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(null);
							estimateMainReplaceResourceCommonService.onFormConfigUpdated.fire({Id: 141}, value);
							estimateMainReplaceResourceCommonService.onBroadcastConfigUpdated.fire();
						}
					};

				let sourceTypes = [
					{id: 11, desc: $translate.instant('estimate.main.mdcCostCodeFk')},
					{id: 12, desc: $translate.instant('estimate.main.mdcMaterialFk')},
					{id: 13, desc: $translate.instant('estimate.main.assembly')},
					{id: 15, desc: $translate.instant('estimate.main.equipmentAssembly')}
				];

				sourceTypeRow.options.items = !isEstAssemblyResource ? sourceTypes : sourceTypes.filter(item => item.id !== 15);

				formConfig.rows.push(sourceTypeRow);
				formConfig.groups[1].visible = selectedFunction.Id !== estimateMainReplaceFunctionType.RemoveResource && selectedFunction.Id !== estimateMainReplaceFunctionType.ReplacePlantByPlant;

				platformTranslateService.translateFormConfig(formConfig);

				return angular.copy(formConfig);
			};

			// form config for modify resource
			service.getModifyFormConfig = function getModifyFormConfig() {
				let mainViewService = $injector.get('mainViewService');
				let currentModuleName = mainViewService.getCurrentModuleName();

				let header$tr$ = '';

				if (currentModuleName === moduleName){ // Estimate
					header$tr$ = 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label';
				}else if (currentModuleName === 'estimate.assemblies'){
					header$tr$ = 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.labelAssembly';
				}

				let formConfig = {
					fid: 'estimate.main.replaceResourceWizard.replaceform',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'g20',
							isOpen: true,
							header: 'Select Estimate Scope',
							header$tr$: header$tr$,
							attributes: [
								'estimatescope'
							]
						},
						{
							gid: 'g21',
							isOpen: true,
							header: 'Filter Resource (optional)',
							header$tr$: 'estimate.main.replaceResourceWizard.group1Name',
							attributes: [
								'filterfileds', 'specifyresource'
							]
						},
						{
							gid: 'g22',
							isOpen: true,
							header: 'Configure Modification',
							header$tr$: 'estimate.main.modifyResourceWizard.group2Name',
							attributes: [
								'modifyfields'
							]
						}
					],
					rows: [
						{
							gid: 'g21',
							rid: 'filterfileds',
							type: 'directive',
							model: 'filterFileds',
							directive: 'estimate-main-modify-filter-resource-fileds',
							readonly: false,
							visible: true,
							sortOrder: 10
						},
						{
							gid: 'g21',
							rid: 'specifyresource',
							type: 'directive',
							model: 'specifyResource',
							directive: 'estimate-main-modify-specify-resource',
							readonly: false,
							visible: true,
							sortOrder: 20
						},
						{
							gid: 'g22',
							rid: 'modifyfields',
							type: 'directive',
							model: 'modifyFields',
							directive: 'estimate-main-modify-bulk-editor-grid',
							readonly: false,
							visible: true,
							sortOrder: 30
						}
					]
				};

				/* let scopeRow = estimateMainScopeSelectionService.getAllScopeFormRow();

				if (scopeRow) {
					scopeRow.gid = 'g20';
					scopeRow.sortOrder = 10;
				}

				formConfig.rows.push(scopeRow); */

				// set the selection 'select estiamte scope'
				if(estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateMainResource){
					let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
					if (selectlineItemscopeRow) {
						selectlineItemscopeRow.gid = 'g20';
						selectlineItemscopeRow.sortOrder =  10;
					}
					formConfig.rows.push(selectlineItemscopeRow);
				}

				let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
				if (resultSetScopeRow) {
					resultSetScopeRow.gid = 'g20';
					resultSetScopeRow.sortOrder =  10;
				}
				formConfig.rows.push(resultSetScopeRow);

				let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

				if (allEstimateScopeRow) {
					allEstimateScopeRow.gid = 'g20';
					allEstimateScopeRow.sortOrder =  10;
				}
				formConfig.rows.push(allEstimateScopeRow);

				platformTranslateService.translateFormConfig(formConfig);

				return angular.copy(formConfig);
			};

			service.getSpecifyResourceLookupConfig = function getSpecifyResourceLookupConfig() {

				let isFromAssemblyModule = estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource;
				let costCodeLookupDirective =
					isFromAssemblyModule ?
						'estimate-main-assembly-cost-codes-lookup'
						: 'estimate-main-project-cost-codes-lookup';
				let materialLookupDirective =
					isFromAssemblyModule ?
						'estimate-assemblies-material-lookup'
						: 'estimate-main-material-lookup';

				let filterKey = isFromAssemblyModule ?
					'' : 'estimate-main-material-project-lookup-filter';
				let assemblyLookDirective = isFromAssemblyModule ?
					'estimate-Assembly-resource-assembly-lookup'
					: 'estimate-main-resource-assembly-lookup';

				let assemblyConfig = {
					gid: 'g21',
					rid: 'mdcspecifylookupfk',
					model: 'SpecifyLookupFk',
					sortOrder: 10,
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					maxLength: 255,
					visible: true,
					options: {
						lookupType: 'resourceAssembly',
						lookupDirective: assemblyLookDirective,
						// dataServiceName: 'estimateMainMaterialLookupDataService',
						showClearButton: true,
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							showClearButton: true,
							isTextEditable: false,
							valueMember: 'Id',
							displayMember: 'Code',
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function onSelectedItemChangedHandler(e, args) {
										if (args && args.entity) {
											args.entity.SpecifyLookupElement = args.selectedItem;
											estimateMainReplaceResourceCommonService.setSpecifyResource(args.entity.SpecifyLookupElement, true);
											if(args.selectedItem){
												$injector.get('estimateMainResourceAssemblyLookupService').setCurrentCode(args.selectedItem.Code);
											}
										}
									}
								}
							]
						}
					}
				};

				let formConfig = {
					fid: 'estimate.main.replaceResourceWizard.replaceform',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'g21',
							isOpen: true,
							header: 'Select Replacement Element',
							header$tr$: 'estimate.main.replaceResourceWizard.group1Name',
							attributes: [
								'mdcspecifylookupfk'
							]
						}
					],
					rows: [
						// CostCode
						{
							gid: 'g21',
							rid: 'mdcspecifylookupfk',
							model: 'SpecifyLookupFk',
							sortOrder: 10,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							maxLength: 255,
							visible: true,
							options: {
								lookupType: 'estmdccostcodes',
								lookupDirective: costCodeLookupDirective,
								showClearButton: true,
								descriptionMember: isFromAssemblyModule ? 'DescriptionInfo.Translated' : 'Description',
								lookupOptions: {
									showClearButton: true,
									disableDataCaching: true,
									isTextEditable: false,
									valueMember: 'Id',
									displayMember: 'Code',
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function onSelectedItemChangedHandler(e, args) {
												if (args && args.entity) {
													args.entity.SpecifyLookupElement = args.selectedItem;
													estimateMainReplaceResourceCommonService.setSpecifyResource(args.entity.SpecifyLookupElement, true);
													estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(args.selectedItem ? args.selectedItem.Id : null);
												}
											}
										}
									]
								}
							}
						},
						// Material
						{
							gid: 'g21',
							rid: 'mdcspecifylookupfk',
							model: 'SpecifyLookupFk',
							sortOrder: 10,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							maxLength: 255,
							visible: true,
							options: {
								lookupType: 'estmdccostcodes',
								lookupDirective: materialLookupDirective,
								dataServiceName: 'estimateMainMaterialLookupDataService',
								showClearButton: true,
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									isTextEditable: false,
									valueMember: 'Id',
									displayMember: 'Code',
									filterKey: filterKey,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function onSelectedItemChangedHandler(e, args) {
												if (args && args.entity) {
													args.entity.SpecifyLookupElement = args.selectedItem;
													estimateMainReplaceResourceCommonService.setSpecifyResource(args.entity.SpecifyLookupElement, true);
													estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(args.selectedItem ? args.selectedItem.Id : null);
												}
											}
										}
									]
								}
							}
						},
						// Assembly
						assemblyConfig
					]
				};

				let estimateResourceService = resourceDataService || (
					estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource ?
						estimateAssembliesResourceService
						: estimateMainResourceService);
				let selectedResourceItem = estimateResourceService.getSelected();
				if(selectedResourceItem) {
					// set the default current element
					let replaceType = selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.CostCode ? estimateMainBeReplaceType.costCode : selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Material ? estimateMainBeReplaceType.material : (selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.Assembly || (selectedResourceItem.EstResourceTypeFk === estimateMainResourceType.SubItem && selectedResourceItem.EstAssemblyFk)) ? estimateMainBeReplaceType.assembly : null;
					setDefaultElementAndJob(selectedResourceItem, replaceType);
				}else{
					setDefaultElementAndJob(null, 1);
				}

				platformTranslateService.translateFormConfig(formConfig);
				return angular.copy(formConfig);
			};

			service.getSpecifyResourceJobLookupConfig = function getSpecifyResourceJobLookupConfig() {
				if (estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource) {
					return null;
				}
				let formConfig = {
					fid: 'estimate.main.replaceResourceWizard.replaceform',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'g21',
							isOpen: true,
							attributes: [
								'mdcspecifylookupfk'
							]
						}
					],
					rows: []
				};
				// label replace
				let tj = targetJob('estimateMainCurrentElementJobService', false);
				let tmj = targetMaterialJob('estimateMainCurrentElementJobService', false);
				tj.label = tmj.label = 'Specify Resource Job';
				tj.label$tr$ = tmj.label$tr$ = 'estimate.main.modifyResourceWizard.specifyResourceJob';
				ignoreJob.label = 'Ignore Specify Resource Job';
				ignoreJob.label$tr$ = 'estimate.main.modifyResourceWizard.ignorejob';

				formConfig.rows.push(tj);
				formConfig.rows.push(tmj);
				formConfig.rows.push(targetAssemblyJob);
				formConfig.rows.push(ignoreJob);

				platformTranslateService.translateFormConfig(formConfig);
				return angular.copy(formConfig);
			};

			let targetAssemblyJob = {
				gid: 'g21',
				rid: 'targetJob',
				model: 'TargetProjectCostCodeId',
				sortOrder: 31,
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				maxLength: 255,
				visible: true,
				options: {
					lookupType: 'jobAssembly',
					lookupDirective: 'estimate-main-job-assembly-lookup',
					showClearButton: false,
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						showClearButton: false,
						isTextEditable: false,
						valueMember: 'Id',
						displayMember: 'JobCode',
						filterKey: estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource ? '' : 'estimate-main-material-project-lookup-filter',
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function onSelectedItemChangedHandler(e, args) {
									if (args && args.entity) {
										if (args.selectedItem && (args.selectedItem.LgmJobFk || args.selectedItem.LgmJobFk === 0)) {
											args.entity.TargetJobFk = args.selectedItem.LgmJobFk;
											// estimateMainReplaceResourceCommonService.onCostCodeTargetChanged.fire(args.selectedItem.MdcCostCodeFk);
										}
									}
								}
							}
						]
					}
				}
			};



			return service;
		}]);
})(angular);
