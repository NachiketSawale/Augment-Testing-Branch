/**
 * Created by xsi on 2016-10-10.
 */
/* global _,globals */
(function () {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainParamComplexLookupCommonService', ['$http', '$injector',
		'constructionSystemMainParamUpdateService', 'platformCreateUuid',
		'constructionSystemMainParameterFormatterService','basicsLookupdataPopupService', 'basicsLookupdataConfigGenerator',
		'estimateParameterPrjParamValidationService', 'estimateCommonLookupValidationService', 'platformGridAPI',
		function ($http, $injector, constructionSystemMainParamUpdateService, platformCreateUuid,
			constructionSystemMainParameterFormatterService, basicsLookupdataPopupService, basicsLookupdataConfigGenerator,
			paramValidationService, estimateCommonLookupValidationService, platformGridAPI) {

			// Object presenting the service
			var service = {};

			function refreshRootParam(entity, param, rootServices){
				if(entity.IsRoot || entity.IsEstHeaderRoot){
					angular.forEach(rootServices, function(serv){
						if(serv){
							var rootService = $injector.get(serv);
							var affectedRoot = _.find(rootService.getList(), {IsRoot : true});
							if(!affectedRoot){
								affectedRoot = _.find(rootService.getList(), {IsEstHeaderRoot : true});
							}
							if(affectedRoot){
								affectedRoot.Param = param;
								rootService.fireItemModified(affectedRoot);
							}
						}
					});
				}
			}
			var popupToggle = basicsLookupdataPopupService.getToggleHelper();

			service.openPopup = function openPopup(e, scope){
				// noinspection JSCheckFunctionSignatures
				var popupOptions = {
					templateUrl:globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-complex-lookup.html',
					title: 'estimate.parameter.params',
					showLastSize: true,
					controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
					width: 900,
					height: 300,
					focusedElement: angular.element(e.target.parentElement),
					relatedTarget: angular.element(e.target),
					scope: scope.$new()
				};
				// toggle popup
				popupToggle.toggle(popupOptions);
				function controller($scope, lookupControllerFactory, $popupInstance) {
					var options = scope.$parent.$parent.config.formatterOptions;
					service.initController($scope, lookupControllerFactory, options, $popupInstance);

					// for close the popup-menu
					$scope.$on('$destroy', function() {
						if($scope.$close) {
							$scope.$close();
						}
					});
				}
			};

			service.onSelectionChange = function onSelectionChange(args, scope){
				var  entity = args.entity,
					opt = scope.$parent.$parent.config.formatterOptions,
					lookupItems = _.isArray(args.previousItem) ? args.previousItem : [args.previousItem];
				if(args.selectedItem && args.selectedItem.Id){
					var selectedItem = angular.copy(args.selectedItem);
					selectedItem.MainId = 0;
					lookupItems.push(args.selectedItem);
					constructionSystemMainParamUpdateService.setParamToSave([selectedItem], entity, opt.itemServiceName, opt.itemName);
					entity.Param =_.map(_.uniq(lookupItems,'Id'), 'Code');
				}else{
					constructionSystemMainParamUpdateService.setParamToDelete(lookupItems && lookupItems.length ? lookupItems : null , entity, opt.itemServiceName, opt.itemName);
				}
				scope.ngModel = entity.Param;
				refreshRootParam(scope.entity, scope.ngModel, opt.RootServices);
			};

			service.clearAllItems = function clearAllItems(args, scope){
				var entity = args.entity,
					opt = scope.$parent.$parent.config.formatterOptions,
					lookupItems = constructionSystemMainParameterFormatterService.getItemsByParam(scope.entity, opt);
				constructionSystemMainParamUpdateService.setParamToDelete(lookupItems && lookupItems.length ? lookupItems : null, entity, opt.itemServiceName, opt.itemName);

				entity.Param = [];
				scope.ngModel = [];
				refreshRootParam(entity, scope.ngModel, opt.RootServices);
			};

			service.getColumns = function getColumns(){
				return [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 70,
						toolTip: 'Code',
						editor : 'code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						editor : 'translation',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				];
			};

			var getAllColumns = function getAllColumns(){
				var addCols = [
					{
						id: 'estparamgrpfk',
						field: 'EstParameterGroupFk',
						name: 'EstParameterGroupFk',
						width: 120,
						toolTip: 'Est Parameter Group Fk',
						editor : 'lookup',
						formatter: 'lookup',
						name$tr$: 'basics.customize.estparametergroup'
					},
					{
						id: 'valuedetail',
						field: 'ValueDetail',
						name: 'ValueDetail',
						width: 120,
						toolTip: 'ValueDetail',
						editor : 'comment',
						formatter: 'comment',
						name$tr$: 'basics.customize.valuedetail'
					},
					{
						id: 'parametervalue',
						field: 'ParameterValue',
						name: 'ParameterValue',
						width: 120,
						toolTip: 'ParameterValue',
						editor : 'quantity',
						formatter: 'quantity',
						name$tr$: 'basics.customize.parametervalue'
					},
					{
						id: 'uomfk',
						field: 'UomFk',
						name: 'UomFk',
						width: 120,
						toolTip: 'UomFk',
						editor : 'integer',
						formatter: 'integer',
						name$tr$: 'cloud.common.entityUoM'
					},
					{
						id: 'defaultvalue',
						field: 'DefaultValue',
						name: 'DefaultValue',
						width: 120,
						toolTip: 'DefaultValue',
						editor : 'quantity',
						formatter: 'quantity',
						name$tr$: 'estimate.parameter.defaultValue'
					}
				];
				var columns = service.getColumns().concat(addCols);
				var uomConfig = _.find(columns, function (item) {
					return item.id === 'uomfk';
				});

				var paramgrpConfig = _.find(columns, function (item) {
					return item.id === 'estparamgrpfk';
				});

				angular.extend(uomConfig,basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService', cacheEnable: true }).grid);

				angular.extend(paramgrpConfig,basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.parametergroup').grid);

				estimateCommonLookupValidationService.addValidationAutomatically(columns, paramValidationService);

				return columns;
			};

			service.displayFormatter = function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
				var column = {formatterOptions: { serviceName: 'constructionSystemMainParameterFormatterService'}},
					service = $injector.get('platformGridDomainService');
				var param = entity.Param && entity.Param.length ?  entity.Param[0]:'default';
				return service.formatter('imageselect')(null,null, param, column, entity, null, null);
			};

			service.initController = function initController(scope, lookupControllerFactory, opt, popupInstance) {
				var displayData = constructionSystemMainParameterFormatterService.getItemsByParam(scope.entity, opt);
				var gridId = platformCreateUuid();
				var gridOptions = {
					gridId: gridId,
					columns: getAllColumns(),
					idProperty : 'Id'
				};

				var self = lookupControllerFactory.create({grid: true}, scope, gridOptions);
				self.updateData(displayData);

				// resize the content by interaction
				popupInstance.onResizeStop.register(function () {
					platformGridAPI.grids.resize(gridOptions.gridId);
				});

				var updateDisplayData = function updateDisplayData(displayData){
					scope.displayItem = displayData;
					scope.ngModel = _.map(displayData, 'Code');
					// noinspection JSPrimitiveTypeWrapperUsage
					scope.entity.Param = scope.ngModel;
					self.updateData(displayData);
					var itemService = $injector.get(opt.itemServiceName);
					itemService.fireItemModified(scope.entity);
					refreshRootParam(scope.entity, scope.ngModel, opt.RootServices);
				};

				scope.createItem = function(){
					var creationData = {
						itemName: [opt.itemName],
						item : scope.entity,
						itemServiceName : opt.itemServiceName
					};

					createLookupItem(creationData).then(function(data){
						var newParam = data[opt.itemName+'Param'];
						newParam.Code = '...';
						newParam.MainId = angular.copy(newParam.Id);
						constructionSystemMainParamUpdateService.setParamToSave([newParam], scope.entity, opt.itemServiceName, opt.itemName);
						var displayData = constructionSystemMainParameterFormatterService.getItemsByParam(scope.entity, opt);
						updateDisplayData(displayData);
					});
				};

				scope.deleteItem = function(){
					var items = self.getSelectedItems();
					constructionSystemMainParamUpdateService.setParamToDelete(items, scope.entity, opt.itemServiceName, opt.itemName);
					var displayData = constructionSystemMainParameterFormatterService.getItemsByParam(scope.entity, opt);
					updateDisplayData(displayData);
				};

				// Define standard toolbar Icons and their function on the scope
				scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: scope.createItem,
							disabled: false
						},
						{
							id: 't2',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: scope.deleteItem,
							disabled: false
						}
					]
				};

				scope.tools.update = function update(){};

				// noinspection JSUnusedLocalSymbols
				function onCellChange(e, args){
					var item = args.item,
						col = args.grid.getColumns()[args.cell].field;

					var modified = false;
					if (col === 'ValueDetail'||col === 'ParameterValue') {
						modified = true;
					}
					if(modified){
						platformGridAPI.items.invalidate(gridId, item);
					}

					constructionSystemMainParamUpdateService.markParamAsModified(item, scope.entity,
						opt.itemServiceName, opt.itemName, constructionSystemMainParameterFormatterService.getLookupList( opt.itemName));

				}
				platformGridAPI.events.register(gridOptions.gridId, 'onCellChange', onCellChange);

				scope.$on('$destroy', function () {
					platformGridAPI.events.unregister(gridOptions.gridId, 'onCellChange', onCellChange);
				});

			};

			function createLookupItem(data) {
				return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/create', data).then(function(response){
					return response.data;
				});
			}

			return service;
		}]);
})();