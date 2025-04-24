/**
 * Created by anl on 5/3/2017.
 */

(function (angular) {
	'use strict';

	var ppsItemModule = 'productionplanning.item';
	var cloudCommonModule = 'cloud.common';
	var basicsMaterialModule = 'basics.material';
	var ppsCommonModule = 'productionplanning.common';
	var trsPackageModule = 'transportplanning.package';
	var siteModule = 'basics.site';
	var clerkModule = 'basics.clerk';
	var basicsCommonModule = 'basics.common';
	var basicsUserformModule = 'basics.userform';
	var projectMain = 'project.main';
	var estimateMain = 'estimate.main';
	var documentProject = 'documents.project';
	var ppsProductTemplateModule = 'productionplanning.producttemplate';
	var estimateCommonModule = 'estimate.common';
	var drawingModule = 'productionplanning.drawing'; // for translation of drawing dialog lookup
	var engTaskModule = 'productionplanning.engineering';
	var prodSetModule = 'productionplanning.productionset';
	var productModule = 'productionplanning.product'; // for translation of reuseProductFromStock wizard
	var ppsStrandpatternModule = 'productionplanning.strandpattern';
	var trsReqModule = 'transportplanning.requisition';
	var transportModule = 'transportplanning.transport';
	var ppsMaterialModule = 'productionplanning.ppsmaterial';
	var basicsCustomizeModule = 'basics.customize';
	var logisticJobModule = 'logistic.job';
	var logisticDispatchingModule = 'logistic.dispatching';
	var modelViewerModule = 'model.viewer';
	var prodPlaceModule = 'productionplanning.productionplace';

	/**
     * @ngdoc service
     * @name ppsItemTranslationService
     * @description provides translation for PPS Item module
     */
	angular.module(ppsItemModule).factory('productionplanningItemTranslationService', PPSItemTranslationService);

	PPSItemTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function PPSItemTranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [ppsItemModule, ppsCommonModule, cloudCommonModule, basicsMaterialModule, trsPackageModule,
				siteModule, clerkModule, basicsCommonModule, projectMain, estimateMain,
				documentProject, ppsProductTemplateModule, estimateCommonModule, drawingModule, engTaskModule, prodSetModule,productModule, ppsStrandpatternModule,
				trsReqModule, transportModule, ppsMaterialModule, basicsCustomizeModule, logisticJobModule, logisticDispatchingModule, modelViewerModule, basicsUserformModule, prodPlaceModule]
		};

		data.words = {
			baseGroup: {location: ppsItemModule, identifier: 'baseGroup', initial: 'Basic Data'},
			itemproduction: {location: ppsCommonModule, identifier: 'header.production', initial: '*Production'},
			products: {location: ppsItemModule, identifier: 'products.productsGroup', initial: '*Products'},
			Code: {location: ppsItemModule, identifier: 'code', initial: 'Code'},
			Descriptioninfo: {location: ppsItemModule, identifier: 'descriptionInfo', initial: 'Description'},
			Reference: {location: ppsItemModule, identifier: 'reference', initial: '*Reference'},
			PPSHeaderFk: {location: ppsItemModule, identifier: 'headerFk', initial: 'Header'},
			PpsHeaderFk: {location: ppsItemModule, identifier: 'headerFk', initial: 'Header'},
			PPSItemStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			StatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			StatusId: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			ClerkTecFk: {location: ppsItemModule, identifier: 'clerkFk', initial: 'Prepare Clerk'},
			SiteFk: {location: ppsItemModule, identifier: 'siteFk', initial: 'Site'},
			MaterialGroupFk: {location: ppsItemModule, identifier: 'materialGroupFk', initial: 'Material Group'},
			ResTypeFk: {location: ppsItemModule, identifier: 'resTypeFk', initial: 'Resource Type'},
			PrjLocationFk: {location: ppsCommonModule, identifier: 'prjLocationFk', initial: 'Location'},
			IsLive: {location: ppsItemModule, identifier: 'isLive', initial: 'IsLive'},

			MaterialFk: {location: ppsItemModule, identifier: 'materialFk', initial: 'Material'},
			Quantity: {location: ppsItemModule, identifier: 'quantity', initial: 'Quantity'},
			AssignedQuantity: { location: ppsItemModule, identifier: 'assignedQuantity', initial: '*Assigned Quantity' },
			UomFk: {location: ppsItemModule, identifier: 'uomFk', initial: 'UOM'},
			BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM'},
			dimensions: {location: ppsItemModule, identifier: 'dimensions', initial: 'Dimentions'},
			Length: {location: ppsItemModule, identifier: 'length', initial: 'Length'},
			Width: {location: ppsItemModule, identifier: 'width', initial: 'Width'},
			Height: {location: ppsItemModule, identifier: 'height', initial: 'Height'},
			Weight: { location: ppsItemModule, identifier: 'weight', initial: 'Weight' },
			Weight2: { location: ppsCommonModule, identifier: 'product.weight2', initial: 'Weight2' },
			Weight3: { location: ppsCommonModule, identifier: 'product.weight3', initial: 'Weight3' },
			LengthCalculated: { location: ppsItemModule, identifier: 'lengthcalculated', initial: 'Length Calculated' },
			WidthCalculated: { location: ppsItemModule, identifier: 'widthcalculated', initial: 'Width Calculated' },
			HeightCalculated: { location: ppsItemModule, identifier: 'heightcalculated', initial: 'Height Calculated' },
			WeightCalculated: { location: ppsItemModule, identifier: 'weightcalculated', initial: 'Weight Calculated' },
			Area: {location: ppsItemModule, identifier: 'area', initial: 'Area'},
			Area2: { location: ppsCommonModule, identifier: 'product.area2', initial: 'Area2' },
			Area3: { location: ppsCommonModule, identifier: 'product.area3', initial: 'Area3' },
			Volume: { location: ppsCommonModule, identifier: 'product.volume', initial: '*Volume' },
			Volume2: { location: ppsCommonModule, identifier: 'product.volume2', initial: '*Volume2' },
			Volume3: { location: ppsCommonModule, identifier: 'product.volume3', initial: '*Volume3' },
			BasUomLengthFk: { location: ppsCommonModule, identifier: 'product.lengthUoM', initial: 'Length UoM' },
			BasUomWidthFk: { location: ppsCommonModule, identifier: 'product.widthUoM', initial: 'Width UoM' },
			BasUomHeightFk: { location: ppsCommonModule, identifier: 'product.heightUoM', initial: 'Height UoM' },
			BasUomWeightFk: { location: ppsCommonModule, identifier: 'product.weightUoM', initial: 'Weight UoM' },
			BasUomAreaFk: { location: ppsCommonModule, identifier: 'product.areaUoM', initial: 'Area UoM' },
			BasUomBillFk: { location: ppsCommonModule, identifier: 'product.billUoM', initial: '*Bill Uom' },
			BasUomPlanFk: { location: ppsCommonModule, identifier: 'product.planUoM', initial: '*Plan Uom' },
			BasUomVolumeFk: { location: ppsCommonModule, identifier: 'product.volumeUoM', initial: 'Volume UoM' },
			PlanQuantity: { location: ppsCommonModule, identifier: 'product.planQuantity', initial: '*Plan Quantity' },
			BillQuantity: { location: ppsCommonModule, identifier: 'product.billQuantity', initial: '*Bill Quantity' },
			PpsStrandPatternFk: { location: ppsStrandpatternModule, identifier: 'entityStrandPattern', initial: '*Strand Pattern'},
			ActualWeight: { location: ppsCommonModule, identifier: 'product.actualWeight', initial: 'Actual Weight' },
			IsolationVolume: { location: ppsMaterialModule, identifier: 'productDescription.isolationVolume', initial: '*Isolation Volume' },
			ConcreteVolume: { location: ppsMaterialModule, identifier: 'productDescription.concreteVolume', initial: '*Concrete Volume' },

			productdescparam: {
				location: ppsItemModule,
				identifier: 'productdescParam',
				initial: 'Product Description Param'
			},
			ProductDescriptionFk: {
				location: ppsItemModule,
				identifier: 'productDescription',
				initial: 'Product Description'
			},
			VariableName: {location: ppsItemModule, identifier: 'variableName', initial: 'Variable Name'},
			Sorting: {location: ppsItemModule, identifier: 'sorting', initial: 'Sorting'},
			LgmJobFk:{ location: logisticJobModule, identifier: 'titleLogisticJob', initial: '*Logistic Job' },

			ClerkRoleFk: {location: basicsCommonModule, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			ClerkFk: {location: basicsCommonModule, identifier: 'entityClerk', initial: '*Clerk'},
			ValidFrom: {location: basicsCommonModule, identifier: 'entityValidFrom', initial: '*Valid From'},
			ValidTo: {location: basicsCommonModule, identifier: 'entityValidTo', initial: '*Valid To'},
			Comment: {location: basicsCommonModule, identifier: 'entityCommentText', initial: '*Comment Text'},
			BusinessPartnerFk: {location: cloudCommonModule, identifier: 'businessPartner', initial: '*Business Partner'},
			BusinessPartnerOrderFk: {location: ppsItemModule, identifier: 'businessPartnerOrder', initial: '*Business Partner Order'},
			MdcMaterialFk: {location: basicsMaterialModule, identifier: 'record.material', initial: '*Material'},
			EngDrawingDefFk: {location: ppsItemModule, identifier: 'defaultDrawing', initial: '*Default Drawing'},
			EngDrawingFk: { location: ppsCommonModule, identifier: 'product.drawing', initial: '*Drawing' },
			EngDrawingStatusFk: {location: ppsItemModule, identifier: 'drawingStatus', initial: '*Drawing Status'},
			BoQRefNo: {location: estimateMain, identifier: 'boqItemFk', initial: '*BoQ-Item Ref.No'},
			ProductionOrder: {location: ppsItemModule, identifier: 'entityProductionOrder', initial: '*Production Order'},
			ItemTypeFk: {location: ppsItemModule, identifier: 'entityItemType', initial: '*Item Type'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: '*Project'},
			ProjectId: {location: cloudCommonModule, identifier: 'entityProject', initial: '*Project'},
			PlannedStart: {location: ppsItemModule, identifier: 'plannedStart', initial: '*Planned Start'},
			PlannedFinish: {location: ppsItemModule, identifier: 'plannedFinish', initial: '*Planned Finish'},
			OrdHeaderFk: { location: ppsCommonModule, identifier: 'ordHeaderFk', initial: 'Order Header' },
			UserDefinedIcon: { location: ppsItemModule, identifier: 'userDefinedIcon', initial: '*User Defined Icon' },
			contactsGroup:{ location: ppsCommonModule, identifier: 'contactsGroup', initial: '*Contacts' },
			PpsUpstreamTypeFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsUpstreamTypeFk', initial: '*Upstream Type'},
			From: { location: ppsCommonModule, identifier: 'from', initial: '*From' },
			DocumentTypeFk: {location: basicsCustomizeModule, identifier: 'documenttype', initial: '*Document Type'},
			Description: {location: ppsItemModule, identifier: 'descriptionInfo', initial: '*Description'},
			Barcode: {location: logisticJobModule, identifier: 'entityBarcode', initial: '*Barcode'},
			Revision: {location: ppsCommonModule, identifier: 'document.revision.revision', initial: '*Revision'},
			PpsUpstreamStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			PpsEventReqforFk: {location: ppsItemModule, identifier: 'upstreamItem.ppseventreqfor', initial: '*Required For'},
			PpsUpstreamGoodsTypeFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsupstreamgoodstype', initial: '*Upstream Goods Type'},
			UpstreamResult: {location: ppsItemModule, identifier: 'upstreamItem.upstreamresult', initial: '*Upstream Result'},
			UpstreamGoods: {location: ppsItemModule, identifier: 'upstreamItem.upstreamgoods', initial: '*Upstream Good'},
			UpstreamResultStatus: {location: ppsItemModule, identifier: 'upstreamItem.upstreamresultstatus', initial: '*Status Upstream'},
			BoqItemFk: {location: estimateMain, identifier: 'boqItemFk', initial: '*Boq Item'},
			PpsEventSeqConfigFk: {location: ppsItemModule, identifier: 'PpsEventSeqConfigFk', initial: '*Event Sequence Configuration'},
			Userflag1:  {location: ppsItemModule, identifier: 'userflag1', initial: '*Userflag1'},
			Userflag2:  {location: ppsItemModule, identifier: 'userflag2', initial: '*Userflag2'},
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			AvailableQuantity:  {location: ppsItemModule, identifier: 'upstreamItem.availableQuantity', initial: '*Available Quantity'},
			OpenQuantity:  {location: ppsItemModule, identifier: 'upstreamItem.openQuantity', initial: '*Open Quantity'},
			PpsItemFk: {location: ppsItemModule, identifier: 'entityItem', initial: '*Production Unit'},
			stateInfoGroup: {location: ppsItemModule, identifier: 'stateInfoGroup', initial: '*State Information'},
			IsUpstreamDefined: {location: ppsItemModule, identifier: 'isUpstreamDefined', initial: '*Upstream State'},
			IsTransportPlanned: {location: ppsItemModule, identifier: 'isTransportPlanned', initial: '*Transport State'},
			TrsRequisitionFk: {location: trsReqModule, identifier: 'entityRequisition', initial: '*Transport Requisition'},
			TrsRequisitionDate: {location: trsReqModule, identifier: 'entityRequisitionDate', initial: '*TrsRequisition Date'},
			PpsUpstreamItemFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsUpstreamItemFk', initial: 'Parent Upstream Item'},
			SplitQuantity: {location: ppsItemModule, identifier: 'upstreamItem.splitQuantity', initial: '*Split Quantity'},
			RemainingQuantity: {location: ppsItemModule, identifier: 'upstreamItem.remainingQuantity', initial: '*Remaining Quantity'},
			PpsEventtypeReqforFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsEventtypeReqforFk', initial: 'Required For Type'},
			UpstreamItemQuantity: {location: ppsItemModule, identifier: 'upstreamItem.upstreamItemQuantity', initial: '*UpstreamItem Quantity'},
			FormFk: {location: ppsItemModule, identifier: 'formData.formfk', initial: '*User Form'},

			StartDate: {location: ppsCommonModule, identifier: 'logLayout.date', initial: '*Date'},
			FullyCovered: {location: ppsItemModule, identifier: 'dailyProduction.fullyCovered', initial: '*Full Covered'},
			IsAssigned: {location: ppsItemModule, identifier: 'dailyProduction.isAssigned', initial: '*Is Assigned'},
			Supplier :{location: ppsItemModule, identifier: 'dailyProduction.supplier', initial: '*Supplier'},
			PlanQty :{location: ppsItemModule, identifier: 'dailyProduction.planQty', initial: '*Plan Quantity'},
			RealQty:{location: ppsItemModule, identifier: 'dailyProduction.realQty', initial: '*Actual Quantity'},
			Difference:{location: ppsItemModule, identifier: 'dailyProduction.difference', initial: '*Difference'},
			PlannedProduction: { location: ppsItemModule, identifier: 'productionOverview.plannedProduction', initial: '*Planned Production' },
			PlannedDelivery: { location: ppsItemModule, identifier: 'productionOverview.plannedDelivery', initial: '*Planned Delivery' },
			TrsProductBundleFk: { location: ppsCommonModule, identifier: 'product.trsProductBundleFk', initial: '*Bundle' },
			EstHeaderFk: { location: ppsItemModule, identifier: 'source.estHeader', initial: '*Estimate Header' },
			EstLineItemFk: { location: ppsItemModule, identifier: 'source.estLineItem', initial: '*Estimate Line Item' },
			EstResourceFk: { location: ppsItemModule, identifier: 'source.estResource', initial: '*Estimate Resource' },
			ProductDescriptionCode: { location: ppsItemModule, identifier: 'ppsProductTemplateCode', initial: '*Product Template Code' },
			PpsPlannedQuantityFk: { location: ppsItemModule, identifier: 'source.PpsPlannedQuantityFk', initial: '*Planned Quantity' },
			TksEmployeeCode: { location: ppsItemModule, identifier: 'wizard.actualTimeRecording.employee', initial: '*Employee' },
			TksEmployeeDescription: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
			BasSiteCode: { location: ppsItemModule, identifier: 'wizard.actualTimeRecording.area', initial: '*Area' },
			BasSiteDescription: { location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description' },
			Duration: { location: ppsItemModule, identifier: 'wizard.actualTimeRecording.overallTime', initial: '*Overall Time' },
			AssignedTime: { location: ppsItemModule, identifier: 'wizard.actualTimeRecording.assignedTime', initial: '*Assigned Time' },
			RemainingTime: { location: ppsItemModule, identifier: 'wizard.actualTimeRecording.remainingTime', initial: '*Remaining Time' },
			Correction: { location: ppsItemModule, identifier: 'wizard.actualTimeRecording.correction', initial: '*Correction' },
			IsForTransport: { location: ppsItemModule, identifier: 'upstreamItem.isForTransport', initial: '*For Transport' },
			IsImported: { location: ppsItemModule, identifier: 'upstreamItem.isImported', initial: '*Is Imported' },
			// for translation of UserdefinedDateTime1~5, we cannot reuse method addUserDefinedDateTranslation(), then we add them here directly
			userDefDateTimeGroup: {location: ppsItemModule, identifier: 'userDefDateTimeGroup', initial: '*User-Defined DateTime'},
			UserDefinedDateTime1: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '1' }, initial: '*Date Time 1' },
			UserDefinedDateTime2: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '2' }, initial: '*Date Time 2'},
			UserDefinedDateTime3: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '3' }, initial: '*Date Time 3'},
			UserDefinedDateTime4: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '4' }, initial: '*Date Time 4'},
			UserDefinedDateTime5: {location: ppsItemModule, identifier: 'entityUserDefinedDateTime', param: { p_0: '5' }, initial: '*Date Time 5'},
			TrsOpenQuantity:{location: ppsItemModule, identifier: 'upstreamItem.TrsOpenQuantity', initial: '*Transport Open Quantity'},
			TrsAssignedQuantity:{location: ppsItemModule, identifier: 'upstreamItem.TrsAssignedQuantity', initial: '*Transport Assigned Quantity'},
			planningGroup: {location: ppsItemModule, identifier: 'upstreamItem.planningGroup', initial: '*Planning'},
			DueDate: {location: ppsItemModule, identifier: 'upstreamItem.dueDate', initial: '*Due Date'},
			ProductTemplateCode: {location: ppsCommonModule, identifier: 'product.productDescriptionFk', initial: '*ProductTemplateCode'},
			CurrentLocationJobFk: {location: ppsCommonModule, identifier: 'product.entityJobFromHistory', initial: '*Current Location Job'},
			PrcStockTransactionTypeFk: {location: basicsCustomizeModule, identifier: 'prcstocktransactiontype', initial: '*Procurement Stock Transaction Type'},
			PrjStockFk: {location: basicsCommonModule, identifier: 'stockCode', initial: '*Stock Code'},
			TransactionInfo: { location: ppsItemModule, identifier: 'upstreamItem.transactionInfo', initial: '*Transaction Info' },
		};

		var customColumnsService = customColumnsServiceFactory.getService(ppsItemModule);
		customColumnsService.setTranslation(data.words);

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', ''); // add translation of UserDefinedDate1~5


		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		service.setTranslationForCustomColumns = function () {
			// update data.words with customColumns words
			var customColumnsService = customColumnsServiceFactory.getService(ppsItemModule);
			customColumnsService.setTranslation(data.words);
			// for translations of customColumns, we need to "override" corresponding settings of current service
			// 1. reset data.toTranslate
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
			// 2. reset interface of service with data
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			// 3. reload translations with data
			platformTranslationUtilitiesService.loadModuleTranslation(data);
		};

		service.data = data;
		return service;
	}
})(angular);

