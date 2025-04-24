(function (angular) {
	/*global angular,_,globals*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).factory('basicsRiskRegisterDependentLookupService', [
		'$http', '$q',
		'basicsRiskRegisterDataService','$injector',
		'estimateRuleComplexLookupService','basicsRiskRegisterDependencyUpdateService',
		'basicsRiskRegisterDependencyCommonService','basicsLookupdataPopupService',
		'PlatformMessenger','basicsRiskRegisterDependencyFormatterService',
		function ($http, $q,
			basicsRiskRegisterDataService,$injector,estimateRuleComplexLookupService,basicsRiskRegisterDependencyUpdateService,
		          basicsRiskRegisterDependencyCommonService,basicsLookupdataPopupService,
		          PlatformMessenger,basicsRiskRegisterDependencyFormatterService) {
			// Object presenting the service
			var service = {};

			// private code
			var lookupData = {
				basicsRiskItems: []
			};

			service.getOptions = function getOptions(scope) {
				var config = scope.$parent.$parent.groups;
				if (!config) {
					return;
				}
				var group = _.find(scope.$parent.$parent.groups, {gid: 'basicData'});

				var ruleConfig = _.find(group.rows, {rid: 'riskdependenton'});
				return ruleConfig ? ruleConfig.formatterOptions : null;
			};

			function treeFilter(items, childProp, filterFunc) {

				var result = [];

				_.forEach(items, function (item) {

					var childrenItems;

					var currentItem = item;

					var filterResult = filterFunc(item);

					if (item[childProp] && angular.isArray(item[childProp]) && item[childProp].length > 0) {

						childrenItems = treeFilter(item[childProp], childProp, filterFunc);
					}

					if (childrenItems && angular.isArray(childrenItems)) {
						currentItem = angular.copy(item);
						currentItem[childProp] = childrenItems;
					}

					if (filterResult || (childrenItems && angular.isArray(childrenItems) && childrenItems.length > 0)) {
						result.push(currentItem);
					}
				});

				return result;
			}

			function getRiskEvents() {
				var selected = basicsRiskRegisterDataService.getSelected() || $injector.get('estimateMainRiskEventsDataService').getSelected();
				var id = null;
				if(selected){
					id = selected.Id;
				}
				return $http.get(globals.webApiBaseUrl + 'basics/riskregister/list?userId=' + id);
			}

			service.getList = function getList() {
				if(lookupData.estParamItems.length >0){
					return lookupData.estParamItems;
				}
				else{
					getRiskEvents().then(function(response){
						lookupData.basicsRiskItems = _.filter(response.data, function (item) {
							return item.IsLive === true;
						});
						return lookupData.basicsRiskItems;
					});
				}
			};

			service.getItemById = function getItemById(value) {
				var items = [];
				var list = lookupData.basicsRiskItems;
				if(list && list.length>0){
					angular.forEach(value, function(val){
						var item = _.find(list, {'Code':val});
						if(item && item.Id){
							items.push(item);
						}
					});
				}
				return _.uniqBy(items, 'Id');
			};

			service.onSelectionChange = function onSelectionChange(args, scope) {
				var entity = args.entity,
					lookupItems = _.isArray(args.previousItem) ? args.previousItem : [args.previousItem];
				var opt = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope);
				if (args.selectedItem && args.selectedItem.Id) {

					var selectedItem = angular.copy(args.selectedItem);
					selectedItem.MainId = 0;
					lookupItems.push(args.selectedItem);
					basicsRiskRegisterDependencyUpdateService.setDepenToSave([selectedItem], entity, opt.itemServiceName, opt.itemName);
					entity.RiskDependencies = _.map(_.uniq(lookupItems, 'Id'), 'Id');
				} else {
					basicsRiskRegisterDependencyUpdateService.setDepenToDelete(lookupItems && lookupItems.length ? lookupItems : null, entity, opt.itemServiceName, opt.itemName);
				}
				scope.ngModel = entity.RiskDependencies;
				basicsRiskRegisterDependencyCommonService.refreshRootParam(scope.entity, scope.ngModel, opt.RootServices);
			};

			//  look up data service call
			service.loadLookupData = function loadLookupData() {
				return getRiskEvents().then(function (response) {
					lookupData.basicsRiskItems = _.filter(response.data, function (item) {
						return item;
					});
					return lookupData.basicsRiskItems;
				});
			};

			service.clearAllItems = function clearAllItems(args, scope, canDelete) {
				var opt = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope),
					lookupItems = basicsRiskRegisterDependencyFormatterService.getItemsByDepen(scope.entity, opt);

				if (lookupItems && lookupItems.length > 0) {
					var entity = args.entity;

					basicsRiskRegisterDependencyUpdateService.setDepenToDelete(lookupItems && lookupItems.length ? lookupItems : null, entity, opt.itemServiceName, opt.itemName);


					if (canDelete) {
						//service.onCloseOverlayDialog.fire();
						entity.RiskDependencies = basicsRiskRegisterDependencyFormatterService.getDepenNotDeleted(opt.itemName);
						scope.ngModel = entity.RiskDependencies;
						basicsRiskRegisterDependencyFormatterService.clearDepenNotDeleted(opt.itemName);
						basicsRiskRegisterDependencyCommonService.refreshRootParam(entity, scope.ngModel, opt.RootServices);
					} else {
						var mainService = $injector.get(opt.itemServiceName);
						mainService = !mainService ? basicsRiskRegisterDataService : mainService;

						mainService.update().then(function () {
							//service.onCloseOverlayDialog.fire();
							entity.RiskDependencies = basicsRiskRegisterDependencyFormatterService.getDepenNotDeleted(opt.itemName);
							scope.ngModel = entity.RiskDependencies;
							basicsRiskRegisterDependencyFormatterService.clearDepenNotDeleted(opt.itemName);
							basicsRiskRegisterDependencyCommonService.refreshRootParam(entity, scope.ngModel, opt.RootServices);
						}
						);
					}
				}
			};

			service.displayFormatter = function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
				if (!entity) {
					return;
				}
				var column = {formatterOptions: {serviceName: 'basicsRiskRegisterDependencyFormatterService'}},
					service = $injector.get('platformGridDomainService');

				var param = [];
				if (_.isArray(entity.RiskDependentOn)) {
					param = entity.RiskDependencies && entity.RiskDependencies.length ? {params: entity.RiskDependencies} : 'default';
				}
				return service.formatter('imageselect')(null, null, param, column, entity, null, null);
			};

			service.getListAsync = function getListAsync() {
				if (lookupData.basicsRiskItems && lookupData.basicsRiskItems.length > 0) {
					return $q.when(lookupData.basicsRiskItems);
				} else {
					return getRiskEvents().then(function (response) {
						lookupData.basicsRiskItems = _.filter(response.data, function (item) {
							return item;
						});
						return lookupData.basicsRiskItems;
					});
				}
			};

			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if (lookupData.basicsRiskItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if (!lookupData.basicsRiskItemsPromise) {
						lookupData.basicsRiskItemsPromise = service.getListAsync();
					}
					return lookupData.basicsRiskItemsPromise.then(function (data) {
						lookupData.basicsRiskItemsPromise = null;
						lookupData.basicsRiskItems = data;
						return service.getItemById(value);
					});
				}
			};

			//General stuff
			service.reLoad = function(){
				service.loadLookupData();
			};

			return service;
		}
	]);
})(angular);
