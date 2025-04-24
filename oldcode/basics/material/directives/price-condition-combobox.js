(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	//var module = angular.module('basics.material');
	angular.module(moduleName).directive('basicsMaterialPriceConditionCombobox', ['platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition',
		function (platformGridAPI, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'prcpricecondition',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: true
			};

			//commit editing when the directive is contained by a slick grid
			var commitGridEditing = function commitGridEditing(element) {
				if (element) {
					var grid = element.scope();
					if (grid && grid.gridId) {
						platformGridAPI.grids.commitEdit(grid.gridId);
					}
				}
			};

			//update grid display when the directive is contained by a slick grid
			var refreshGridRow = function refreshGridRow(element, entity) {
				if (element) {
					var grid = element.scope();
					if (grid && grid.gridId) {
						platformGridAPI.rows.refreshRow({gridId: grid.gridId, item: entity});
					}
				}
			};
			/* jshint -W098*/
			var controller = ['$scope', '$injector', function controller(scope, $injector) {
				if (!scope.disableEdit) {
					var buttons = [{
						img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-grid-edit',
						canExecute:function(){
							return true;
						},
						execute: function showEditDialog(e) {
							var grid = angular.element(e.target).closest('.platformgrid');
							commitGridEditing(grid);
							var options = scope.options, targetDataService;
							//get the data service from config
							if (angular.isObject(options.dataService)) {
								targetDataService = options.dataService;
							} else if (angular.isFunction(options.dataService)) {
								targetDataService = options.dataService.call(this);
							}else if(angular.isString(options.dataService)){
								targetDataService = $injector.get(options.dataService);
							}

							if (targetDataService && targetDataService.showEditDialog) {
								targetDataService.showEditDialog({
									options: scope.options,
									entity: scope.entity
								}).then(function () {
									refreshGridRow(grid, scope.entity);
								});
							}
						}
					}];
					$.extend(scope.lookupOptions, {buttons: buttons});
				}
			}];
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);


	angular.module(moduleName).directive('boqBasicsMaterialPriceConditionCombobox', ['platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsMaterialPriceConditionDataServiceNew',
		function (platformGridAPI, BasicsLookupdataLookupDirectiveDefinition, basicsMaterialPriceConditionDataServiceNew) {
			var defaults = {
				lookupType: 'prcpricecondition',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: true,
				events: [{
					name: 'onSelectedItemChanged',
					handler: function selectedItemChanged(e, args) {
						if(Object.prototype.hasOwnProperty.call(args,'entity') && args.entity) {
							basicsMaterialPriceConditionDataServiceNew.boqPriceConditionItemChanged(args.selectedItem ? args.selectedItem.Id : null);
						}
					}
				}]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);

	angular.module(moduleName).directive('itemBasicsMaterialPriceConditionCombobox', ['platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsMaterialPriceConditionDataServiceNew',
		function (platformGridAPI, BasicsLookupdataLookupDirectiveDefinition, basicsMaterialPriceConditionDataServiceNew) {
			var defaults = {
				lookupType: 'prcpricecondition',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: true,
				events: [{
					name: 'onSelectedItemChanged',
					handler: function selectedItemChanged(e, args) {
						if(Object.prototype.hasOwnProperty.call(args,'entity') && args.entity) {
							basicsMaterialPriceConditionDataServiceNew.itemPriceConditionItemChanged(args.selectedItem ? args.selectedItem.Id : null);
						}
					}
				}]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);

})(angular);