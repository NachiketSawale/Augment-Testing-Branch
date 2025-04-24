(function (angular) {
	/*global angular,globals,$*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).directive('basicsRiskRegisterDependentLookup', [
		'BasicsLookupdataLookupDirectiveDefinition','platformCreateUuid','basicsRiskRegisterDataService',
		'basicsRiskRegisterImpactService','basicsRiskRegisterDependentLookupService',
		'$q',

		function (BasicsLookupdataLookupDirectiveDefinition,platformCreateUuid,
		          basicsRiskRegisterDataService, basicsRiskRegisterImpactService,basicsRiskRegisterDependentLookupService,
		          $q) {
			var defaults = {
				lookupType: 'RiskEvents',
				valueMember: 'Code',
				displayMember: 'Code',
				showCustomInputContent: true,
				formatter: basicsRiskRegisterDependentLookupService.displayFormatter,
				uuid: platformCreateUuid(),
				idProperty:'Id',
				columns: [//get the columns for rjisk event
					/*{ id: 'code', field: 'Code', name: 'Code',  width: 100 },
					{ id: 'description', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 100 }*/
					{
						id: 'code',
						formatter: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						editor: 'directive',
						grouping: {
							title: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						},
						editorOptions: {
							directive: 'basics-common-limit-input',
							validKeys: {
								regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
							}
						},
						width: 70
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						editor : 'translation',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						maxLength: 255,
						grouping: {
							title: 'cloud.common.entityDescription',
							getter: 'Description',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				],
				treeOptions:{
					parentProp: 'RiskRegisterParentFk',
					childProp: 'RiskRegisters',
					initalState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					idProperty: 'Id'
				},
				title:{
					name: 'Risk Events',
					name$tr$:'basics.riskregister.riskEventsGridTitle'
				},
				onDataRefresh: function($scope){
					var data = basicsRiskRegisterDependentLookupService.loadLookupData().then(function (data) {
						if(data){
							$scope.refreshData(data);
						}
					});
				},
				events:[
					{
						name:'onSelectedItemChanged',
						handler: function (e, args) {
							var scope = this;
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								basicsRiskRegisterDependentLookupService.clearAllItems(args, scope,true);

								basicsRiskRegisterImpactService.markItemAsModified(args.entity);
							}
							//add item
							else{
								//args.selectedItem.ValueType = args.selectedItem.ParamvaluetypeFk;
								basicsRiskRegisterDependentLookupService.onSelectionChange(args, scope);
								basicsRiskRegisterImpactService.markItemAsModified(args.entity);
							}
						}
					},
					{
						name: 'onInputGroupClick',
						handler: function (e) {
							if (e.target.className.indexOf('ico-parameter') === -1 && e.target.className.indexOf('ico-menu') === -1) {
								return;
							}
							//if this has been setted readonly,
							if(this.ngReadonly){
								return;
							}

							//basicsRiskRegisterDependentLookupService.openPopup(e, this);
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					getList: function (config, scope) {
						return $q.when(basicsRiskRegisterDependentLookupService.getListAsync());
					},

					getItemByKey: function (value, config, scope) {
						return basicsRiskRegisterDependentLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value, config, scope) {
						return basicsRiskRegisterDependentLookupService.getItemByIdAsync(value);
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					var onOpenPopupClicked = function (event, editValue) {
						editValue(event);
					};

					$.extend($scope.lookupOptions, {
						buttons: [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-add',
								execute: onOpenPopupClicked,
								canExecute:function(){
									return true;
								}
							}
						]
					});

				}]
			});
		}
	]);
})(angular);
