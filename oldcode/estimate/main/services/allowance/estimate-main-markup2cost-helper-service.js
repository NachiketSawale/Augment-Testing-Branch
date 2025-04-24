(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainMarkup2costcodeHelperService', ['_', 'estimateMainContextDataService',
		function(_, estimateMainContextDataService){

			let service = {};

			service.getMarkup2CostCodeEntity = function(resource)
			{
				if (resource.ProjectCostCodeFk)
				{
					let markupEntity = estimateMainContextDataService.getMarkupEntityByPrjCostCodeId(resource.ProjectCostCodeFk);

					if (markupEntity)
					{
						return markupEntity;
					}

					if(!resource.MdcCostCodeFk){
						let projectCostCode = estimateMainContextDataService.getPrjCostCodeById(resource.ProjectCostCodeFk);
						if(projectCostCode && projectCostCode.ParentFk){
							let parentProjectCostCode = estimateMainContextDataService.getPrjCostCodeById(projectCostCode.ParentFk);
							if(parentProjectCostCode && parentProjectCostCode.MdcCostCodeFk){
								return this.getMarkup2CostCodeEntityByCostCodeId(parentProjectCostCode.MdcCostCodeFk);
							}
						}
					}
				}

				if (resource.MdcCostCodeFk)
				{
					return this.getMarkup2CostCodeEntityByCostCodeId(resource.MdcCostCodeFk);
				}

				return null;
			};

			service.getMarkup2CostCodeEntityByCostCodeId = function(mdcCostCodeId)
			{
				let currentCostCodeFk = mdcCostCodeId;

				while (currentCostCodeFk)
				{
					let markupEntity = estimateMainContextDataService.getMarkupEntityByMdcCostCodeId(currentCostCodeFk);

					if (markupEntity)
					{
						return markupEntity;
					}
					else
					{
						let mdcCostCodeEntity = estimateMainContextDataService.getMdcCostCodeById(currentCostCodeFk);

						currentCostCodeFk = mdcCostCodeEntity && mdcCostCodeEntity.ParentFk ? mdcCostCodeEntity.ParentFk : null;
					}
				}

				return null;
			};

			return service;
		}
	]);
})(angular);