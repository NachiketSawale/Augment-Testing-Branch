/**
 * Created by bh on 15.02.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizePropertiesService
	 * @function
	 *
	 * @description
	 * The basicsCustomizePropertiesService shows a dialog for setting further properties of the selected customization instance.
	 */

	angular.module(moduleName).service('basicsCustomizePropertiesService', BasicsCustomizePropertiesService);

	BasicsCustomizePropertiesService.$inject = ['_', '$injector', '$q' ,'platformModalService'];

	function BasicsCustomizePropertiesService(_, $injector, $q, platformModalService) {

		this.showDialog = function showDialog(entity) {
			var entityTypeService = $injector.get('basicsCustomizeTypeDataService');

			entityTypeService.setSelected(entity).then(function () {
				/* jshint -W074 */ // functions cyclomatic complexity is too high
				if(angular.isUndefined(entity) || entity === null) {
					return;
				}

				var entityTypeInstanceService = $injector.get('basicsCustomizeInstanceDataService');
				var items = entityTypeInstanceService.getList();
				// Currently we take the selected item or the first item to initialize the properties dialog
				if(angular.isDefined(items) && _.isArray(items) && items.length > 0) {

					var selectedItem = entityTypeInstanceService.getSelected();
					selectedItem = (angular.isDefined(selectedItem) && (selectedItem !== null)) ? selectedItem : items[0];

					if (angular.isDefined(selectedItem) && selectedItem !== null) {

						if (entity.ClassName === 'BoQType') {
							showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, selectedItem, 'StructureFk', 'updBoqType', 'BoqStructureFk');
						}
						else if (entity.ClassName === 'CatalogAssignType') {
							showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, selectedItem, 'CatAssignFk', 'updBoqCatAssignConfType', 'BoqCatAssignFk');
						}
						else if (entity.ClassName === 'ProjectContentType') {
							showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, selectedItem, 'ContentFk', 'prjContentType', 'ContentFk');
						}
						else if (isEstimateConfig(entity)) {
							if (entity.ClassName === 'EstUppConfigType' && angular.isDefined(selectedItem.UppConfigFk) && !selectedItem.UppConfigFk) {
								selectedItem.UppConfigFk = 0;
							}
							showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, selectedItem, getReferenceFk(entity));
						}
						else if (entity.ClassName === 'ExcelProfile') {
							$injector.get('basicsCommonExcelProfileService').start(selectedItem, entityTypeService);
						}
					}
				}
				else if(angular.isDefined(items) && _.isArray(items)){
					if(isEstimateConfig(entity)){
						showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, null, getReferenceFk(entity));
					}
					else if (entity.ClassName === 'BoQType') {
						showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, null, 'StructureFk', 'updBoqType', 'BoqStructureFk');
					}
					else if (entity.ClassName === 'ProjectContentType') {
						showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, null, 'ContentFk', 'prjContentType', 'ContentFk');
					}
					else if (entity.ClassName === 'CatalogAssignType') {
						showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, null, 'CatAssignFk', 'updBoqCatAssignConfType', 'BoqCatAssignFk');
					}
				}
			});
		};

		function getReferenceFk(entity) {
			var referenceFk = '';
			switch (entity.ClassName)
			{
				case 'EstColumnConfigType':
					referenceFk = 'ColumnconfigFk';
					break;
				case 'EstConfigType':
					referenceFk = 'ConfigFk';
					break;
				case 'EstStructureType':
					referenceFk = 'StructureconfigFk';
					break;
				case 'EstTotalsConfigType':
					referenceFk = 'TotalsconfigFk';
					break;
				case 'EstUppConfigType':
					referenceFk = 'UppConfigFk';
					break;
				case 'CostBudgetType':
					referenceFk = 'CostBudgetConfigFk';
					break;
				case 'EstRootAssignmentType':
					referenceFk = 'LineitemcontextFk';
					break;

			}
			return referenceFk;
		}

		/**
		 * @ngdoc function
		 * @name isEstimateConfig
		 * @function
		 * @methodOf BasicsCustomizeStatusTransitionService
		 * @description current config dialog is for estimate config
		 * @param entity
		 * @returns boolean
		 */
		function isEstimateConfig(entity) {
			return (entity.ClassName === 'EstColumnConfigType' ||
					entity.ClassName === 'EstUppConfigType' ||
					entity.ClassName === 'EstStructureType' ||
					entity.ClassName === 'EstConfigType' ||
					entity.ClassName === 'EstTotalsConfigType' ||
					entity.ClassName === 'CostBudgetType' ||
					entity.ClassName === 'EstRootAssignmentType'
			);
		}

		function showEstConfigDialog(entity, selectedItem){
			var estimateMainDialogDataService = $injector.get('estimateMainDialogDataService');

			var dialogConfig = {
				contextId: '',
				editType : '',// estimate || customizeforcolumn customizefortotals customizeforstructure customizeforupp
				columnConfigTypeId:'',
				totalsConfigTypeId:'',
				structureConfigTypeId:'',
				uppConfigTypeId:'',
				costBudgetConfigTypeId:'',
				columnConfigFk:'',
				totalsConfigFk:'',
				structureConfigFk:'',
				uppConfigFk:'',
				costBudgetConfigFk:'',
				isInUse : false
			};
			switch(entity.ClassName){
				case 'EstColumnConfigType':
					dialogConfig.editType = 'customizeforcolumn';
					dialogConfig.contextId = selectedItem.ContextFk;
					dialogConfig.columnConfigTypeId = selectedItem.Id;
					dialogConfig.columnConfigFk = selectedItem.ColumnconfigFk;
					break;
				case 'EstTotalsConfigType':
					dialogConfig.editType = 'customizefortotals';
					dialogConfig.contextId = selectedItem.ContextFk;
					dialogConfig.totalsConfigTypeId = selectedItem.Id;
					dialogConfig.totalsConfigFk = selectedItem.TotalsconfigFk;
					break;
				case 'EstUppConfigType':
					dialogConfig.editType = 'customizeforupp';
					dialogConfig.contextId = selectedItem.ContextFk;
					dialogConfig.uppConfigTypeId=selectedItem.Id;
					dialogConfig.uppConfigFk=selectedItem.UppConfigFk;
					break;
				case 'EstStructureType':
					dialogConfig.editType = 'customizeforstructure';
					dialogConfig.contextId = selectedItem.ContextFk;
					dialogConfig.structureConfigTypeId = selectedItem.Id;
					dialogConfig.structureConfigFk = selectedItem.StructureconfigFk;
					break;
				case 'CostBudgetType':
					dialogConfig.editType = 'customizeforcostbudget';
					dialogConfig.contextId = selectedItem.ContextFk;
					dialogConfig.costBudgetConfigTypeId = selectedItem.Id;
					dialogConfig.costBudgetConfigFk = selectedItem.CostBudgetConfigFk;
					break;
				case 'EstConfigType':
					dialogConfig.editType = 'customizeforall';
					dialogConfig.contextId = selectedItem.ContextFk;
					dialogConfig.configTypeId = selectedItem.Id;
					dialogConfig.configFk = selectedItem.ConfigFk;
					break;
				case 'EstRootAssignmentType':
					dialogConfig.editType = 'customizeforruleassign';
					dialogConfig.contextId = selectedItem.ContextFk;
					dialogConfig.configTypeId = selectedItem.Id;
					dialogConfig.configFk = selectedItem.ConfigFk;

					dialogConfig.lineItemcontextFk = selectedItem.LineitemcontextFk;
					dialogConfig.rootAssignTypeId = selectedItem.Id;
					dialogConfig.rootAssignTypeLineItemContext = selectedItem.LineitemcontextFk;
					break;
			}
			if(estimateMainDialogDataService) {
				estimateMainDialogDataService.showDialog(dialogConfig);
			}
		}

		/**
		 * @ngdoc function
		 * @name showPropertiesDialog
		 * @function
		 * @methodOf BasicsCustomizeStatusTransitionService
		 * @description this will be as common show Dialog function to open config dialog window
		 * @param entityTypeService
		 * @param entityTypeInstanceService
		 * @param entity
		 * @param selectedItem
		 * @param referenceFk
		 * @param callbackObjecName
		 * @param callbackReferFk
		 */
		function showPropertiesDialog(entityTypeService, entityTypeInstanceService, entity, selectedItem, referenceFk, callbackObjecName, callbackReferFk){
			if (angular.isDefined(entity) && (entity !== null)) {

				var className = entity.ClassName;
				var boqMainPropertiesDialogService = $injector.get('boqMainPropertiesDialogService');
				var boqMainDocPropertiesService = $injector.get('boqMainDocPropertiesService');

				var estimateProjectRateBookConfigDataService = $injector.get('estimateProjectRateBookConfigDataService');

				if('CatalogAssignType' === className) {
					boqMainPropertiesDialogService.setDialogMode('boqcatalog');
				}
				else if('BoQType' === className) {
					boqMainPropertiesDialogService.setDialogMode('default');
				}


				var entityTypeId = angular.isDefined(selectedItem) && (selectedItem !== null) ? selectedItem.Id : null;
				var entityReferenceFk = angular.isDefined(selectedItem) && (selectedItem !== null) ? selectedItem[referenceFk] : null;
				var mdcLineItemContextFk = _.isObject(selectedItem) ? selectedItem.MdcLineItemContextFk : null;
				var selectedTypePromise = $q.when(null);

				if(angular.isDefined(entityTypeId) && (entityTypeId !== null) && angular.isDefined(entityReferenceFk) && (entityReferenceFk !== null)) {
					selectedTypePromise = $q.when(selectedItem);
				}
				else if('ProjectContentType' === className && selectedItem){
					selectedTypePromise = $q.when(selectedItem);
				}
				else {
					selectedTypePromise = entityTypeInstanceService.load().then(function() {
						/* jshint -W074 */ // functions cyclomatic complexity is too high
						var typeInstances = entityTypeInstanceService.getList();
						if(angular.isDefined(typeInstances) && _.isArray(typeInstances) && typeInstances.length > 0) {
							selectedItem = typeInstances[0];

							//default first row and if has 'Default' one ,then use Default record
							var item = _.find(typeInstances, {'IsDefault':true});
							if(item){
								selectedItem = item;
							}

							entityTypeId = selectedItem.Id;
							entityReferenceFk = selectedItem[referenceFk];

							if(angular.isUndefined(entityTypeId) || (entityTypeId === null) || angular.isUndefined(entityReferenceFk) || (entityReferenceFk === null)) {
								// No structure foreign key could be determined, so we cannot proceed here
								console.error('basicsCustomizePropertiesService -> no foreign key could be determined !');
								return null;
							}

							return selectedItem;
						}
					});
				}

				selectedTypePromise.then(function(selectedTypeInstance) {

					function onPropertiesSaved(e, result) {
						// Here we react on the saving of the Entity properties.
						// Currently we want to update the underlying boq type instance that might have been saved by the
						if(angular.isDefined(result) && (result !== null) && angular.isDefined(result[callbackObjecName]) && (result[callbackObjecName] !== null)) {
							var typeInstance = entityTypeInstanceService.getItemById(result[callbackObjecName].Id);
							if(angular.isDefined(typeInstance) && (typeInstance !== null)) {
								// Merge updated type into loaded Entity type
								// We do this 'manually' because the property names differ between the updated entity and the customize entity
								if((referenceFk in typeInstance) && callbackReferFk in result[callbackObjecName] ) {
									typeInstance[referenceFk] = result[callbackObjecName][callbackReferFk];
									// For the following property names I assume they are not changed that much so I don't check their existance
									typeInstance.UpdatedAt = result[callbackObjecName].UpdatedAt;
									typeInstance.UpdatedBy = result[callbackObjecName].UpdatedBy;
									typeInstance.InsertedAt = result[callbackObjecName].InsertedAt;
									typeInstance.InsertedBy = result[callbackObjecName].InsertedBy;
									typeInstance.Version = result[callbackObjecName].Version;

									entityTypeInstanceService.fireItemModified(typeInstance);
								}
								else {
									console.error('Problem when merging updated type into existing type instance due to property mismatch !!');
								}
							}
						}

						boqMainDocPropertiesService.boqPropertiesSaved.unregister(onPropertiesSaved);
					}

					if(angular.isDefined(selectedTypeInstance) && (selectedTypeInstance !== null)) {
						if(isEstimateConfig(entity)) {
							//check the contextId if null then show some warning message
							if (selectedTypeInstance && angular.isDefined(selectedTypeInstance.ContextFk) && !selectedTypeInstance.ContextFk) {
								platformModalService.showMsgBox('basics.customize.nocontexterrormsg', 'basics.customize.configwarning', 'warning');
								//console.error('can not saved if there is no ContextFk');
								return false;
							}
						}
						else if(entity.ClassName === 'ProjectContentType'){
							if (selectedTypeInstance && angular.isDefined(selectedTypeInstance.LineitemcontextFk) && !selectedTypeInstance.LineitemcontextFk) {
								platformModalService.showMsgBox('basics.customize.nocontexterrormsg', 'basics.customize.configwarning', 'warning');
								return false;
							}
						}

						// Check if there are modifications especially those from the instances, i.e. the boq type list and save them before opening the dialog to edit
						// the boq structure.
						entityTypeId = selectedTypeInstance.Id;
						entityReferenceFk = selectedTypeInstance[referenceFk];
						mdcLineItemContextFk = selectedTypeInstance.LineitemcontextFk;
						entityTypeService.update().then(function () {
							if (!isEstimateConfig(entity)) {
								//register for the saving event, after saving we can assign properties back into type instance
								boqMainDocPropertiesService.boqPropertiesSaved.register(onPropertiesSaved);
							}
							//we can call different show dialog function in different type instance service
							if ('CatalogAssignType' === className) {
								boqMainPropertiesDialogService.showCatalogDialog(entityTypeId, entityReferenceFk, mdcLineItemContextFk);
							}
							else if ('BoQType' === className) {
								boqMainPropertiesDialogService.showDialog(null, entityTypeId, entityReferenceFk, selectedTypeInstance);
							}
							else if ('ProjectContentType' === className) {
								estimateProjectRateBookConfigDataService.showDialogFromCustormize(entityTypeId, entityReferenceFk, selectedTypeInstance);
							}
							else if (isEstimateConfig(entity)) {
								showEstConfigDialog(entity, selectedTypeInstance);
							}
						},
						function () {
							// Something went wrong when checking for instances to be updated and the final update call.
							console.error('basicsCustomizePropertiesService -> updating of type instances went wrong !');
						});
					}
					else{
						//reset to default mode
						boqMainPropertiesDialogService.setDialogMode('default');
					}
				});
			}
		}
	}
})(angular);
