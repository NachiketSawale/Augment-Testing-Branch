
(function (angular) {
	'use strict';

	var Module = 'constructionsystem.master';
	var cloudCommonModule = 'cloud.common';

	/**
     * @ngdoc service
     * @name constructionSystemMasterAssemblyResourceTranslationService
     * @description provides translation for basics unit module
     */
	angular.module(Module).factory('constructionSystemMasterAssemblyResourceTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [Module, cloudCommonModule]
			};

			data.words = {
				// attributes unit
				EstCostTypeFk:{ location: Module, identifier: 'estCostTypeFk', initial: 'Cost Type' },
				EstResourceTypeFk:{ location: Module, identifier: 'estResourceTypeFk', initial: 'Resource Type' },
				DescriptionInfo1:{ location: Module, identifier: 'descriptionInfo1', initial: 'Further Description' },
				QuantityDetail:{ location: Module, identifier: 'quantityDetail', initial: 'Quantity Detail' },
				Quantity:{ location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
				BasUomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				QuantityFactorDetail1:{ location: Module, identifier: 'quantityFactorDetail1', initial: 'Quantity Factor Detail 1' },
				QuantityFactor1:{ location: Module, identifier: 'quantityFactor1', initial: 'QuantityFactor1' },
				QuantityFactorDetail2:{ location: Module, identifier: 'quantityFactorDetail2', initial: 'Quantity Factor Detail 2' },
				QuantityFactor2:{ location: Module, identifier: 'quantityFactor2', initial: 'Quantity Factor 2' },
				QuantityFactor3:{ location: Module, identifier: 'quantityFactor3', initial: 'Quantity Factor 3' },
				QuantityFactor4:{ location: Module, identifier: 'quantityFactor4', initial: 'Quantity Factor 4' },
				QuantityFactorCc:{ location: Module, identifier: 'quantityFactorCc', initial: 'Quantity Factor Cc' },

				ProductivityFactorDetail:{ location: Module, identifier: 'productivityFactorDetail', initial: 'Productivity Factor Detail' },
				ProductivityFactor:{ location: Module, identifier: 'productivityFactor', initial: 'Productivity Factor' },
				EfficiencyFactorDetail1:{ location: Module, identifier: 'efficiencyFactorDetail1', initial: 'Efficiency Factor Detail 1' },
				EfficiencyFactor1:{ location: Module, identifier: 'efficiencyFactor1', initial: 'Efficiency Factor 1' },
				EfficiencyFactorDetail2:{ location: Module, identifier: 'efficiencyFactorDetail2', initial: 'Efficiency Factor Detail 2' },
				EfficiencyFactor2:{ location: Module, identifier: 'efficiencyFactor2', initial: 'Efficiency Factor 2' },

				QuantityReal:{ location: Module, identifier: 'quantityReal', initial: 'Quantity Real' },
				QuantityInternal:{ location: Module, identifier: 'quantityInternal', initial: 'Quantity Internal' },
				QuantityTotal:{ location: Module, identifier: 'quantityTotal', initial: 'Quantity Total' },
				CostUnit:{ location: Module, identifier: 'costUnit', initial: 'Cost Unit' },
				BasCurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency' },

				CostFactorDetail1:{ location: Module, identifier: 'costFactorDetail1', initial: 'Cost Factor Detail 1' },
				CostFactor1:{ location: Module, identifier: 'costFactor1', initial: 'Cost Factor 1' },
				CostFactorDetail2:{ location: Module, identifier: 'costFactorDetail2', initial: 'Cost Factor Detail 2' },
				CostFactor2:{ location: Module, identifier: 'costFactor2', initial: 'Cost Factor 2' },
				CostFactorCc:{ location: Module, identifier: 'costFactorCc', initial: 'Cost Factor Cc' },

				CostUnitSubItem:{ location: Module, identifier: 'costUnitSubItem', initial: 'CostUnitSubItem' },
				CostUnitLineItem:{ location: Module, identifier: 'costUnitLineItem', initial: 'CostUnitLineItem' },
				CostTotal:{ location: Module, identifier: 'costTotal', initial: 'Cost Total' },
				HoursUnit:{ location: Module, identifier: 'hoursUnit', initial: 'Hours Unit' },

				HoursUnitSubItem:{ location: Module, identifier: 'hoursUnitSubItem', initial: 'HoursUnitSubItem' },
				HoursUnitLineItem:{ location: Module, identifier: 'hoursUnitLineItem', initial: 'HoursUnitLineItem' },
				HoursUnitTarget:{ location: Module, identifier: 'hoursUnitTarget', initial: 'Hours Unit Target' },
				HoursTotal:{ location: Module, identifier: 'hoursTotal', initial: 'Hours Total' },
				HourFactor:{ location: Module, identifier: 'hourFactor', initial: 'Hour Factor' },

				IsLumpsum:{ location: Module, identifier: 'isLumpsum', initial: 'Is Lumpsum' },
				IsDisabled:{ location: Module, identifier: 'isDisabled', initial: 'Is Disabled' },
				IsIndirectCost :{location: Module, identifier : 'isIndirectCost', initial:'Indirect Cost'},

				CommentText:{ location: Module, identifier: 'comment', initial: 'Comment' },
				EstResourceFlagFk: { location: Module, identifier: 'resourceFlag', initial: 'Resource Flag'},
				IsCost :{location: Module, identifier : 'isCost', initial:'Is Cost'},
				Sorting :{location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},




				// EstHeaderFk:{ location: Module, identifier: 'estHeaderFk', initial: 'EstHeader' },
				// EstLineItemFk:{ location: Module, identifier: 'estLineItemFk', initial: 'EstLineItem' },
				// EstResourceFk:{ location: Module, identifier: 'estResourceFk', initial: 'EstResource' },

				// MdcCostCodeFk:{ location: Module, identifier: 'mdcCostCodeFk', initial: 'CostCode' },
				// MdcMaterialFk:{ location: Module, identifier: 'mdcMaterialFk', initial: 'Material' },
				// PrcStructureFk:{ location: Module, identifier: 'prcStructureFk', initial: 'Procurement Structure' },

				// userDefText: { location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'User Defined Text' },


			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);

