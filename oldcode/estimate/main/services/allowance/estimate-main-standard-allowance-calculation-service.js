(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful
	/* jshint -W074 */ //
	/* jshint -W073 */ //
	angular.module(moduleName).factory('estimateMainStandardAllowanceCalculationService',[ '_', '$injector', 'estimateMainContextDataService',
		'estimateMainRoundingService', 'estimateMainSimpleAllowanceLineItemCalculationService', 'estimateMainEstimateByMarkupLineItemCalculationService',
		'estimateMainMarkup2costcodeHelperService', 'estimateMainResourceType', 'estimateMainCompleteCalculationService',
		function (_, $injector, estimateMainContextDataService, estimateMainRoundingService, estimateMainSimpleAllowanceLineItemCalculationService,
			estimateMainEstimateByMarkupLineItemCalculationService, estimateMainMarkup2costcodeHelperService, estimateMainResourceType, estimateMainCompleteCalculationService) {
			let service = {};

			function isSubItemOrPlant(resource){
				return resource.EstResourceTypeFk === estimateMainResourceType.SubItem || resource.EstResourceTypeFk === estimateMainResourceType.Plant || resource.EstResourceTypeFk === estimateMainResourceType.PlantDissolved;
			}

			function createAllowanceCalcService(){
				if(_.isEmpty(estimateMainContextDataService.getAllowanceEntity())){
					return null;
				}
				let allowanceCalcOption = {
					AllowanceEntity : estimateMainContextDataService.getAllowanceEntity(),
					Markup2CostCodes : estimateMainContextDataService.getEstMarkup2CostCode(),
					FixedLineItems: estimateMainContextDataService.getFixedPriceLineItems(),
					LineItemsWithAA: estimateMainContextDataService.getLineItemsWithAdvancedAll(),
					getAdvanceAll: function getAdvanceAll() {
						if (!this.AllowanceEntity) {
							return 0;
						}

						if (this.AllowanceEntity.QuantityTypeFk === 3) {
							return _.sumBy(this.LineItemsWithAA, function (e) {
								return e.AdvancedAllUnitItem * e.WqQuantityTarget;
							});
						} else {
							return _.sumBy(this.LineItemsWithAA, function (e) {
								return e.AdvancedAllUnitItem * e.QuantityTarget;
							});
						}
					}
				};

				let creatorService = allowanceCalcOption.AllowanceEntity && allowanceCalcOption.AllowanceEntity.MdcAllowanceTypeFk === 2 ? estimateMainEstimateByMarkupLineItemCalculationService : estimateMainSimpleAllowanceLineItemCalculationService;

				return creatorService.createAllowanceCalculator(allowanceCalcOption);
			}

			function calculateStandardAllowance(lineItem, resources, getChildrenFunc)
			{
				if(!lineItem || !resources)
				{
					return;
				}

				let resourceInFirstLevel = _.filter(resources, function(e){return !e.EstResourceFk;});

				let allowanceCalculator = createAllowanceCalcService();

				/* getChildrenFunc */
				let getChildrenFuncInternal = getChildrenFunc || function(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resources, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				};

				calculateStandardAllowanceOfResource(lineItem, resourceInFirstLevel, getChildrenFuncInternal, allowanceCalculator);

				calculateStandardAllowanceOfLineItem(lineItem, resourceInFirstLevel, allowanceCalculator);
			}

			function calculateStandardAllowanceOfResource(lineItem, resources, getChildrenFunc, allowanceCalculator)
			{
				if (!resources || !_.isArray(resources) || !getChildrenFunc)
				{
					return;
				}

				_.forEach(resources, function(resource)
				{
					resetResource(resource);

					if (isSubItemOrPlant(resource))
					{
						let children = getChildrenFunc(resource);

						if (children && _.isArray(children))
						{
							calculateStandardAllowanceOfResource(lineItem, children, getChildrenFunc, allowanceCalculator);

							_.forEach(children, function(item){
								if(!item.IsDisabled && !item.IsDisabledPrc && !item.IsInformation){
									resource.Gc += item.Gc;
									resource.Ga += item.Ga;
									resource.Am += item.Am;
									resource.Rp += item.Rp;
									resource.Gar += item.Gar;
									resource.Fm += item.Fm || 0;
									resource.GcUnitLineItem += item.GcUnitLineItem || 0;
									resource.GaUnitLineItem += item.GaUnitLineItem || 0;
									resource.AmUnitLineItem += item.AmUnitLineItem || 0;
									resource.RpUnitLineItem += item.RpUnitLineItem || 0;
									resource.FmUnitLineItem += item.FmUnitLineItem || 0;
								}
							});
						}
					}
					else if (resource.MdcCostCodeFk || resource.ProjectCostCodeFk)
					{
						let markup2CostCodeEntity = estimateMainMarkup2costcodeHelperService.getMarkup2CostCodeEntity(resource);

						if (markup2CostCodeEntity && !lineItem.IsNoMarkup && allowanceCalculator)
						{
							allowanceCalculator.calculate(lineItem, resource, markup2CostCodeEntity);
						}
					}

					estimateMainRoundingService.doRoundingValues(['Gc','Ga','Am','Rp','Gar'], resource);
				});
			}

			function calculateStandardAllowanceOfLineItem(lineItem, resources, allowanceCalculator)
			{
				if(!lineItem)
				{
					return;
				}

				let isTotalWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();

				// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
				let qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

				let lineItemQuantityFactor = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;

				lineItem.AdvancedAllUnitItem = lineItem.QuantityUnitTarget * lineItem.AdvancedAllUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.AdvancedAll = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.AdvancedAllUnitItem;

				if (lineItem.IsFixedPrice)
				{
					lineItem.ManualMarkup = 0;
					lineItem.ManualMarkupUnitItem = 0;
				}
				else
				{
					// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
					let qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

					lineItem.ManualMarkupUnitItem = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : lineItem.QuantityUnitTarget * lineItem.ManualMarkupUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
					lineItem.ManualMarkup = qtyTarget * lineItem.ManualMarkupUnitItem;
				}

				resetLineItem(lineItem);

				let resourceList = resources && _.isArray(resources) ? resources : [];

				let aaGraPrec = allowanceCalculator ? allowanceCalculator.getAAGraPrec(lineItem) : 0;

				if (estimateMainCompleteCalculationService.isOptionItemWithIT(lineItem) || (!lineItem.IsOptional && !lineItem.IsDaywork)){

					_.forEach(resourceList, function(resource)
					{
						if(!resource.IsDisabled && !resource.IsDisabledPrc && !resource.IsInformation){
							lineItem.Gc += resource.Gc;
							lineItem.Ga += resource.Ga;
							lineItem.Am += resource.Am;
							lineItem.Rp += resource.Rp;
						}
					});

					lineItem.Ga += (lineItem.AdvancedAll * aaGraPrec);
				}

				if (lineItem.IsGc)
				{
					lineItem.GcUnit = lineItem.GcUnitItem = 0;
					lineItem.GaUnit = lineItem.GaUnitItem = 0;
					lineItem.AmUnit = lineItem.AmUnitItem = 0;
					lineItem.RpUnit = lineItem.RpUnitItem = 0;
				}
				else if(estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem))
				{
					calculateGaAmRpUnit(lineItem, resourceList, aaGraPrec);
				}
				else if (lineItem.IsNoMarkup)
				{
					lineItem.GcUnit = lineItem.GcUnitItem = 0;
					lineItem.GaUnit = lineItem.GaUnitItem = 0;
					lineItem.AmUnit = lineItem.AmUnitItem = 0;
					lineItem.RpUnit = lineItem.RpUnitItem = 0;
				}
				else
				{
					calculateGaAmRpUnit(lineItem, resourceList, aaGraPrec);
				}

				estimateMainRoundingService.doRoundingValues(['Gc','Ga','Am','Rp'], lineItem);

				/* calculate FM,Allowance */
				if (allowanceCalculator)
				{
					lineItem.Fm = allowanceCalculator.calculateFm(lineItem, resources);
					lineItem.Allowance = allowanceCalculator.calculateAllowance(lineItem);
					lineItem.AllowanceUnit = allowanceCalculator.calculateAllowanceUnit(lineItem, resources);
					lineItem.AllowanceUnitItem = lineItem.AllowanceUnit * lineItemQuantityFactor;
				}
				else
				{
					lineItem.Fm = 0;
					// lineItem.Allowance = lineItem.AllowanceUnitItem = lineItem.AllowanceUnit = 0;
					lineItem.Allowance = lineItem.IsGc ? -1 * lineItem.CostTotal : lineItem.AdvancedAll + lineItem.ManualMarkup;
					lineItem.AllowanceUnitItem = lineItem.IsGc ? -1 * lineItem.CostUnitTarget : lineItem.AdvancedAllUnitItem + lineItem.ManualMarkupUnitItem;
					lineItem.AllowanceUnit = lineItem.IsGc ? -1 * lineItem.CostUnit : lineItem.AdvancedAllUnit + lineItem.ManualMarkupUnit;
				}

				calculateGrandTotal(lineItem, isTotalWq);
			}

			function calculateGaAmRpUnit(lineItem, resources, aaGraPrec)
			{
				if(!lineItem || !resources)
				{
					return;
				}

				_.forEach(resources, function(resource){
					if (!resource.IsDisabled && !resource.IsDisabledPrc && !resource.IsInformation)
					{
						lineItem.GcUnit += (resource.GcUnitLineItem ? resource.GcUnitLineItem : 0);
						lineItem.GaUnit += (resource.GaUnitLineItem ? resource.GaUnitLineItem : 0);
						lineItem.AmUnit += (resource.AmUnitLineItem ? resource.AmUnitLineItem : 0);
						lineItem.RpUnit += (resource.RpUnitLineItem ? resource.RpUnitLineItem : 0);
					}
				});

				lineItem.GaUnit += (aaGraPrec * lineItem.AdvancedAllUnit);

				let lineItemQuantityFactor = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;

				lineItem.GcUnitItem = lineItem.GcUnit * lineItemQuantityFactor;
				lineItem.GaUnitItem = lineItem.GaUnit * lineItemQuantityFactor;
				lineItem.AmUnitItem = lineItem.AmUnit * lineItemQuantityFactor;
				lineItem.RpUnitItem = lineItem.RpUnit * lineItemQuantityFactor;
			}

			function calculateGrandTotal(lineItem, isTotalWq)
			{
				let qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

				let lineItemQuantityFactor = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;

				if (estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) || lineItem.IsDisabled)
				{
					let factor  = lineItem.Quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor * lineItem.CostFactor1 * lineItem.CostFactor2;

					if (!lineItem.IsFixedPrice)
					{
						lineItem.GrandCostUnit = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.CostUnit + lineItem.MarkupCostUnit + lineItem.AllowanceUnit + (lineItem.EscalationCostUnit ? lineItem.EscalationCostUnit : 0) + (lineItem.RiskCostUnit ? lineItem.RiskCostUnit : 0);
						lineItem.GrandCostUnit = estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);

						lineItem.GrandCostUnitTarget = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.QuantityUnitTarget * lineItem.GrandCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
						lineItem.GrandCostUnitTarget = estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.GrandCostUnitTarget);
						lineItem.URDUnitItem = 0;
					}
					else
					{
						lineItem.GrandCostUnit = factor === 0 ? 0 : lineItem.GrandCostUnitTarget / factor;
						lineItem.GrandCostUnit = estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);

						let fixAllowanceUnit = (lineItem.GrandCostUnit - lineItem.CostUnit - lineItem.MarkupCostUnit - (lineItem.EscalationCostUnit ? lineItem.EscalationCostUnit : 0) - (lineItem.RiskCostUnit ? lineItem.RiskCostUnit : 0));
						lineItem.URDUnitItem = (fixAllowanceUnit - lineItem.AllowanceUnit) * factor;
						lineItem.AllowanceUnit = fixAllowanceUnit;
					}

					lineItem.AllowanceUnitItem = lineItem.AllowanceUnit * factor;
					lineItem.GcUnitItem = lineItem.GcUnit * factor;
					lineItem.GaUnitItem = lineItem.GaUnit * factor;
					lineItem.AmUnitItem = lineItem.AmUnit * factor;
					lineItem.RpUnitItem = lineItem.RpUnit * factor;
					lineItem.ManualMarkupUnitItem = lineItem.ManualMarkupUnit * factor;
					lineItem.ManualMarkup = 0;
					lineItem.GrandTotal = 0;
					lineItem.Allowance = 0;
					lineItem.URD = 0;
				}
				else
				{
					if (lineItem.IsFixedPrice)
					{
						lineItem.GrandCostUnit = lineItemQuantityFactor === 0 ? 0 : lineItem.GrandCostUnitTarget / lineItemQuantityFactor;
						lineItem.GrandCostUnit = estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);

						lineItem.GrandTotal = lineItem.IsGc || lineItem.IsIncluded ? 0 : qtyTarget * lineItem.GrandCostUnitTarget;
						lineItem.GrandTotal =  estimateMainRoundingService.doRoundingValue('GrandTotal',lineItem.GrandTotal);

						let fixedPriceAllowance = (lineItem.GrandTotal - lineItem.CostTotal - lineItem.MarkupCostTotal - (lineItem.EscalationCostTotal ? lineItem.EscalationCostTotal : 0) - (lineItem.RiskCostTotal ? lineItem.RiskCostTotal : 0));

						/* calculate URD */
						lineItem.URD = fixedPriceAllowance.toFixed(6) - lineItem.Allowance.toFixed(6);
						lineItem.URDUnitItem = qtyTarget === 0 ? 0 : lineItem.URD / qtyTarget;
						lineItem.Allowance = fixedPriceAllowance;
						lineItem.AllowanceUnitItem = qtyTarget === 0 ? 0 : lineItem.Allowance / qtyTarget;
						lineItem.AllowanceUnit = lineItemQuantityFactor === 0 ? 0 : lineItem.AllowanceUnitItem / lineItemQuantityFactor;
						lineItem.ManualMarkup = lineItem.ManualMarkupUnitItem = lineItem.ManualMarkupUnit =0;
					}
					else
					{
						lineItem.AllowanceUnitItem = qtyTarget === 0 ? 0 : lineItem.Allowance / qtyTarget;
						lineItem.AllowanceUnit = lineItemQuantityFactor === 0 ? 0 : lineItem.AllowanceUnitItem / lineItemQuantityFactor;
						lineItem.GrandCostUnit = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.CostUnit + lineItem.MarkupCostUnit + lineItem.AllowanceUnit + (lineItem.EscalationCostUnit ? lineItem.EscalationCostUnit : 0) + (lineItem.RiskCostUnit ? lineItem.RiskCostUnit : 0);
						lineItem.GrandCostUnit = estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);

						lineItem.GrandCostUnitTarget = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.QuantityUnitTarget * lineItem.GrandCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
						lineItem.GrandCostUnitTarget = estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.GrandCostUnitTarget);

						lineItem.GrandTotal = lineItem.IsGc || lineItem.IsIncluded ? 0 : qtyTarget * lineItem.GrandCostUnitTarget;
						lineItem.GrandTotal =  estimateMainRoundingService.doRoundingValue('GrandTotal',lineItem.GrandTotal);

						lineItem.ManualMarkupUnitItem = lineItem.QuantityUnitTarget * lineItem.ManualMarkupUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
						lineItem.ManualMarkup = qtyTarget * lineItem.ManualMarkupUnitItem;
						/* calculate URD */
						lineItem.URD = 0;
						lineItem.URDUnitItem = 0;
					}
				}

				/* calculate Margin */
				lineItem.Margin1 = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) || lineItem.IsGc ? 0 : lineItem.Revenue > 0 ? lineItem.Revenue - lineItem.CostTotal - lineItem.Gc : 0;
				lineItem.Margin2 = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : lineItem.Revenue > 0 ? lineItem.Revenue - lineItem.GrandTotal : 0;
			}

			function resetLineItem(lineItem)
			{
				lineItem.GcUnitItem = lineItem.GcUnit = lineItem.Gc =0;
				lineItem.GaUnitItem =lineItem.GaUnit = lineItem.Ga = 0;
				lineItem.AmUnitItem = lineItem.AmUnit = lineItem.Am = 0;
				lineItem.RpUnitItem = lineItem.RpUnit = lineItem.Rp = 0;
				lineItem.Fm = 0;
				lineItem.URD = 0;
			}

			function resetResource(resource)
			{
				resource.Gc = 0;
				resource.Ga = 0;
				resource.Am = 0;
				resource.Rp = 0;
				resource.Gar = 0;
				resource.Fm = 0;
				resource.GcUnitLineItem = 0;
				resource.GaUnitLineItem = 0;
				resource.AmUnitLineItem = 0;
				resource.RpUnitLineItem = 0;
				resource.FmUnitLineItem = 0;
			}

			function reCalculateAdvAllowance(lineItem, field) {
				if (!lineItem){
					return;
				}

				let isTotalWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();
				// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
				let qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

				let lineItemQuantityFactor = lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;


				if(field === 'AdvancedAll'){
					lineItem.AdvancedAllUnitItem = !qtyTarget ? 0 : lineItem.AdvancedAll / qtyTarget;
					lineItem.AdvancedAllUnitItem = estimateMainRoundingService.doRoundingValue('AdvancedAllUnitItem', lineItem.AdvancedAllUnitItem);

					lineItem.AdvancedAllUnit = !lineItemQuantityFactor ? 0 : lineItem.AdvancedAllUnitItem / lineItemQuantityFactor;
					lineItem.AdvancedAllUnit = estimateMainRoundingService.doRoundingValue('AdvancedAllUnit', lineItem.AdvancedAllUnit);
				}

				if(field === 'AdvancedAllUnitItem'){
					lineItem.AdvancedAll = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.AdvancedAllUnitItem;
					lineItem.AdvancedAll = estimateMainRoundingService.doRoundingValue('AdvancedAll', lineItem.AdvancedAll);

					lineItem.AdvancedAllUnit = !lineItemQuantityFactor ? 0 : lineItem.AdvancedAllUnitItem / lineItemQuantityFactor;
					lineItem.AdvancedAllUnit = estimateMainRoundingService.doRoundingValue('AdvancedAllUnit', lineItem.AdvancedAllUnit);
				}

				if(field === 'AdvancedAllUnit'){
					lineItem.AdvancedAllUnitItem = lineItem.AdvancedAllUnit * lineItemQuantityFactor;
					lineItem.AdvancedAllUnitItem = estimateMainRoundingService.doRoundingValue('AdvancedAllUnitItem', lineItem.AdvancedAllUnitItem);

					lineItem.AdvancedAll = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.AdvancedAllUnitItem;
					lineItem.AdvancedAll = estimateMainRoundingService.doRoundingValue('AdvancedAll', lineItem.AdvancedAll);
				}

				calculateStandardAllowance(lineItem, $injector.get('estimateMainResourceService').getList());
			}

			function reCalculateManualMarkup(lineItem,field) {
				if (!lineItem){
					return;
				}

				if(field === 'ManualMarkupUnit'){
					lineItem.ManualMarkupUnit = lineItem.ManualMarkupUnit === '' ? 0 : lineItem.ManualMarkupUnit;
					return;
				}

				if(lineItem.ManualMarkup === '' || lineItem.ManualMarkupUnitItem === ''){
					lineItem.ManualMarkup = 0;
					lineItem.ManualMarkupUnitItem = 0;
					lineItem.ManualMarkupUnit = 0;
					return;
				}

				let isTotalWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();
				// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
				let qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

				let lineItemQuantityFactor = lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;

				if(field === 'ManualMarkup'){
					lineItem.ManualMarkupUnitItem = !qtyTarget ? 0 : lineItem.ManualMarkup / qtyTarget;
					lineItem.ManualMarkupUnitItem = estimateMainRoundingService.doRoundingValue('ManualMarkupUnitItem', lineItem.ManualMarkupUnitItem);

					lineItem.ManualMarkupUnit = !lineItemQuantityFactor ? 0 : lineItem.ManualMarkupUnitItem / lineItemQuantityFactor;
					lineItem.ManualMarkupUnit = estimateMainRoundingService.doRoundingValue('ManualMarkupUnit', lineItem.ManualMarkupUnit);
				}

				if(field === 'ManualMarkupUnitItem'){
					lineItem.ManualMarkup = qtyTarget * lineItem.ManualMarkupUnitItem; // + URD
					lineItem.ManualMarkup = estimateMainRoundingService.doRoundingValue('ManualMarkup', lineItem.ManualMarkup);

					lineItem.ManualMarkupUnit = !lineItemQuantityFactor ? 0 : lineItem.ManualMarkupUnitItem / lineItemQuantityFactor;
					lineItem.ManualMarkupUnit = estimateMainRoundingService.doRoundingValue('ManualMarkupUnit', lineItem.ManualMarkupUnit);
				}

				calculateStandardAllowance(lineItem, $injector.get('estimateMainResourceService').getList());
			}

			service.calculateStandardAllowance = calculateStandardAllowance;
			service.reCalculateAdvAllowance = reCalculateAdvAllowance;
			service.reCalculateManualMarkup = reCalculateManualMarkup;

			return service;
		}
	]);
})(angular);