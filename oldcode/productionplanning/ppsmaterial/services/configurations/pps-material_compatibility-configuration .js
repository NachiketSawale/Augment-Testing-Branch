(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.ppsmaterial';

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	angular.module(moduleName).value('ppsMaterialCompatibilityLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	// master Layout
	angular.module(moduleName).factory('ppsMaterialCompatibilityLayout', ppsMaterialCompatibilityLayout);
	ppsMaterialCompatibilityLayout.$inject = ['$http', 'productionplanningPpsMaterialRecordMainService'];
	function ppsMaterialCompatibilityLayout($http, productionplanningPpsMaterialRecordMainService) {
		let handlerFn = function (e, args) {
			let selected = productionplanningPpsMaterialRecordMainService.getSelected();
			if (selected) {
				if (_.isNil(selected.PpsMaterial)) {
					$http.get(globals.webApiBaseUrl + 'productionplanning/ppsmaterial/getorcreateppsmaterial?mdcMaterialId=' + selected.Id)
						.then(function (result){
							selected.PpsMaterial = result.data;
							args.entity.PpsMaterialProductFk = selected.PpsMaterial.Id;
						});
				} else {
					args.entity.PpsMaterialProductFk = selected.PpsMaterial.Id;
				}
			}

			let choice = args.selectedItem;
			if(choice){
				if (_.isNil(choice.PpsMaterial)) {
					$http.get(globals.webApiBaseUrl + 'productionplanning/ppsmaterial/getorcreateppsmaterial?mdcMaterialId=' + choice.Id)
						.then(function (result){
							choice.PpsMaterial = result.data;
							args.entity.PpsMaterialItemFk = choice.PpsMaterial.Id;
						});
				}
				else {
					args.entity.PpsMaterialItemFk = choice.PpsMaterial.Id;
				}
			}
		};

		return {
			'fid': 'productionplanning.ppsmaterial.ppsMaterialCompatibilityLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicConfiguration',
					attributes: [
						'mdcmaterialitemfk', 'remark', 'userdefined1', 'userdefined2', 'userdefined3','userdefined4','userdefined5','userflag1','userflag2'
					]
				}
			],
			'overloads': {
				mdcmaterialitemfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'material-new-lookup',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: handlerFn
								}]
							}

						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialNew',
							displayMember: 'Code'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								events: [{
									name: 'onSelectedItemChanged',
									handler: handlerFn
								}]},
							lookupDirective: 'material-new-lookup',
							descriptionMember: 'DescriptionInfo1.Translated'
						}
					}
				}
			}
		};
	}
})(angular);