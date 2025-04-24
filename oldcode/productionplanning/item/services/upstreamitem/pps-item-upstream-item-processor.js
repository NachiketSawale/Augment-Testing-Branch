(function (angular) {
	'use strict';
   /* global _, angular */
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemUpstreamItemProcessor', ppsItemUpstreamItemProcessor);

	ppsItemUpstreamItemProcessor.$inject = ['platformRuntimeDataService'];

	function ppsItemUpstreamItemProcessor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function processItem(item, config) {
			if (item) {
				//backup the fk for project-document
				item.PpsItemUpstreamFk_Bak = item.PpsItemUpstreamFk;
				item.PrcPackageFk_Bak = item.PrcPackageFk;

				//set readonly
				if(item.PpsUpstreamItemFk) {
					var fields = [];
					var readonlyColumns = Object.keys(item).filter(i => i !== 'Quantity' && !i.startsWith('_'));
					_.forEach(readonlyColumns, function (column){
						fields.push({field: column, readonly: true});
					});
					platformRuntimeDataService.readonly(item, fields);
				} else {
					service.setColumnReadOnly(item, 'PpsItemFk', true);
					if (item.Version > 0 && item.UpstreamResult > 0 && item.UpstreamGoods > 0) {
						service.setColumnReadOnly(item, 'PpsUpstreamGoodsTypeFk', true);
					}
					if (item.UpstreamResult) {
						service.setColumnReadOnly(item, 'PpsUpstreamTypeFk', true);
					}
					if (item.PpsItemFk) {
						// request for type column is readonly when upstream items linked to planning units.
						service.setColumnReadOnly(item, 'PpsEventtypeReqforFk', true);
						service.setColumnReadOnly(item, 'DueDate', true);
					} else if (item.PpsHeaderFk && !item.PpsItemFk) {
						// request for column is readonly when upstream items linked to PPS Header only.
						service.setColumnReadOnly(item, 'PpsEventReqforFk', true);
					}
				}

				if (config.parentService.getServiceName() === 'productionplanningItemDataService') {
					var PUService = config.parentService;
					var selectedUnit = PUService.getSelected();

					if (selectedUnit !== null) {
						item.Belonging = item.PpsItemFk !== selectedUnit.Id ? 'parentUnit' : 'currentUnit';
						item.ProjectId = selectedUnit.ProjectFk;
						item.LgmJobFk = item.JobDefFk = selectedUnit.LgmJobFk;
					}
				}

				if (config.parentService.getServiceName() === 'productionplanningEngineeringMainService') {
					var EngService = config.parentService;
					var selectedEng = EngService.getSelected();

					if (selectedEng !== null) {
						item.Belonging = item.PpsItemFk !== selectedEng.PPSItemFk ? 'parentUnit' : 'currentUnit';
						item.ProjectId = selectedEng.ProjectId;
						item.LgmJobFk = item.JobDefFk = selectedEng.LgmJobFk;
					}
				}

				if (config.parentService.getServiceName() === 'productionplanningHeaderDataService') {
					let headerService = config.parentService;
					let selectedHeader = headerService.getSelected();

					if (selectedHeader !== null) {
						item.Belonging = 'currentUnit';
						item.ProjectId = selectedHeader.ProjectFk;
						item.LgmJobFk = item.JobDefFk = selectedHeader.LgmJobFk;
					}
				}
			}
		};

		service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}

})(angular);
