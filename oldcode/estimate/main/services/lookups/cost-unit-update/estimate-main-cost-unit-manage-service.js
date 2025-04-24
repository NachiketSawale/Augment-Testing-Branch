/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _, $ */
	'use strict';
	let modName = 'estimate.main';

	angular.module(modName).factory('estimateMainCostUnitManageService', ['$q', '$injector','$translate','platformModalService','platformGridDomainService','basicsLookupdataPopupService', 'estimateMainWizardContext', 'estimateMainResourceFrom', '$templateCache',
		function ($q, $injector,$translate,platformModalService,platformGridDomainService, basicsLookupdataPopupService, estimateMainWizardContext, estimateMainResourceFrom, $templateCache) {

			let service = {};
			let popupToggle = basicsLookupdataPopupService.getToggleHelper();

			let enableEstResourceCostUnitAdvanceEditing = false;

			service.setEnableEstResourceCostUnitAdvanceEditing = function(value){
				enableEstResourceCostUnitAdvanceEditing = !!value;
			};

			service.getCostUnitLookUpFormat = function (entity, columnDef, costUnitValue) {
				// no need for assembly resource
				if(estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource || estimateMainWizardContext.getConfig() === estimateMainResourceFrom.ProjectAssemblyResource){
					return costUnitValue;
				}

				// let resGridId = $injector.get('estimateMainResourceService').getGridId();
				let lineItemGuid = $injector.get('estimateMainService').gridId;
				let permissionService = $injector.get('platformPermissionService');
				if(!permissionService.hasWrite(lineItemGuid)){
					return costUnitValue;
				}
				// the Resources permission is same as lineItem.
				// if(!permissionService.hasWrite(resGridId)){
				// return costUnitValue;
				// }

				if(!entity || !!entity.EstRuleSourceFk || (entity.EstResourceTypeFk !== 1 && entity.EstResourceTypeFk !== 2) || !enableEstResourceCostUnitAdvanceEditing || !entity.Code || (entity.cssClass && entity.cssClass.indexOf('row-readonly-background') > -1)){
					return costUnitValue;
				}

				if(!$injector.get('estimateMainService').getSelectedProjectId()){
					return costUnitValue;
				}

				return openAllJobLookupButton(columnDef, entity) + ' ' + updateJobLookUpButton(columnDef,entity) + costUnitValue;
			};

			function openAllJobLookupButton(column, entity) {
				let classId = _.uniqueId('navigator_');
				let btn = '<button class="block-image tlb-icons ico-menu ' +classId+ '" title="'+ $translate.instant('estimate.main.costUnitUpdateCfg.selectNewCostUnit') +'" style="position: relative; margin-right: 3px"></button>';
				handleClick(classId, function (e) {
					let popupOptions = {
						templateUrl:globals.appBaseUrl + '/estimate.main/templates/cost-unit-update/estimate-main-cost-unit-list.html',
						showLastSize: false,
						width: 900,
						height: 300,
						footerTemplate: $templateCache.get('lookup-popup-footer.html'),
						// controller: 'estimateMainCostUnitListController',
						focusedElement: angular.element(e.target.parentElement),
						relatedTarget: angular.element(e.target)
					};
					$injector.get('estimateMainResourceService').setSelected(entity);
					// toggle popup
					popupToggle.toggle(popupOptions);
				});
				return btn;
			}

			function updateJobLookUpButton(column, entity) {
				let classId = _.uniqueId('navigator_');
				let btn = '<button class="block-image tlb-icons ico-price-update ' +classId+ '" title="'+ $translate.instant('estimate.main.costUnitUpdateCfg.costUnitUpdateTitle') +'" style="position: relative; margin-right: 15px;"></button>';
				let estimateMainResourceType = $injector.get('estimateMainResourceType');
				handleClick(classId, function () {
					let height =  entity.EstResourceTypeFk === estimateMainResourceType.CostCode ? '600px' :'750px';
					$injector.get('estimateMainResourceService').setSelected(entity);

					let modalOptions = {
						templateUrl: globals.appBaseUrl + '/estimate.main/templates/cost-unit-update/estimate-main-cost-unit-update.html',
						resizeable: true,
						width: '900px',
						height:height,
						dataItems: entity
					};

					platformModalService.showDialog(modalOptions);
				});
				return btn;
			}

			function handleClick(classId, func) {
				let timeoutId = setTimeout(function () {
					$('.' + classId).click(function (e) {
						e.stopPropagation();
						func(e);
					});
					clearTimeout(timeoutId);
				},0);
			}

			return service;

		}]);

})(angular);
