/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

( function (angular) {
	'use strict';
	/* global $, globals */
	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc service
	 * @name estimateRuleComplexLookup
	 * @function
	 *
	 * @description
	 * lookup to show assigned estimate rules in different estimation structures with two different dropdown popup
	 */
	angular.module(moduleName).directive('estimateAssemblyRuleComplexLookup', [
		'estimateAssembliesRuleComplexLookupService',
		'BasicsLookupdataLookupDirectiveDefinition',
		'$injector',
		'estimateAssembliesService',
		'estimateRuleComplexLookupCommonService',
		'estimateAssembliesRuleUpdateService',
		'_',
		'$q',
		function (estimateAssembliesRuleComplexLookupService,
			BasicsLookupdataLookupDirectiveDefinition,
			$injector,
			estimateAssembliesService,
			estimateRuleComplexLookupCommonService,
			estimateAssembliesRuleUpdateService,
			_,
			$q) {

			function updateRuleItems(e, args, editorScope) {

				let mainEntity = args.entity || editorScope.$parent.entity,
					relationEntityService = null,
					ruleEntitys = args.selectedItems;
				try{
					relationEntityService = $injector.get(mainEntity.RuleRelationServiceNames.r);
				}catch (ex) {
					return false;
				}

				// identify the mainEntity for the relation service
				if(mainEntity)
				{
					relationEntityService.currentMainEntity(mainEntity);
				}

				let newRules = [];
				_.forEach(ruleEntitys,function (ruleEntity) {
					if (mainEntity && !_.isEmpty(ruleEntity)) {
						let newValue = ruleEntity.Id;

						if(!mainEntity.Rule || !_.isArray(mainEntity.Rule)) {
							mainEntity.Rule = [];
						}

						if(!_.isUndefined(newValue) && !_.find(mainEntity.Rule, function(r){return r === newValue;}))
						{
							mainEntity.Rule.push(newValue);
							estimateAssembliesRuleUpdateService.setRuleToSave(mainEntity,newValue);
							editorScope.entity.Rule = mainEntity.Rule; // set for the lookup editor's formatter
							editorScope.entity.RuleIcons = angular.copy(editorScope.entity.Rule);
							mainEntity.RuleIcons = angular.copy(mainEntity.Rule);
							// relationEntityService.createRelations(mainEntity, ruleEntity);
							newRules.push(ruleEntity);
						}
					}
				});

				if(newRules.length > 0){
					// the main item is just created in frontend, not actually in db, first save it
					// then add the rules to db
					if(mainEntity.RuleRelationServiceNames.mainEntityIsNew === true)
					{
						$injector.get(mainEntity.RuleRelationServiceNames.m).update().then(function(){
							mainEntity.RuleRelationServiceNames.mainEntityIsNew = false; // the item is already existed in db
							// set again the rules for popup parameter window
							_.forEach(newRules,function (item) {
								estimateAssembliesRuleUpdateService.setRuleToSave(mainEntity,item.Id);
							});
							relationEntityService.createMultiRelations(mainEntity, newRules);
						});
					}
					else {
						relationEntityService.createMultiRelations(mainEntity, newRules);
					}
				}

				if(ruleEntitys){
					relationEntityService.updateMainEntityAfterRuleChanged();
				}

			}

			let scope,
				defaults = {
					lookupType: 'estimateAssemblyRuleComplexLookup',
					// valueMember: 'Code',

					// the rule entity's id field, bind to the mainEntity.Rule field in the column definition
					// once the rule item is selected, the mainEntity.Rule = rule.Id, an integer
					valueMember: 'Id',
					// displayMember: 'Icon', // removed, see 97574 TODO: needs to be verified, e.g. by wui.
					showCustomInputContent: true,
					formatter: $injector.get('estimateAssembliesRuleFormatterService').lookupFormatter,
					uuid: '4C0EB736ED8E4A8195E0CF8191C9250D',
					columns: estimateRuleComplexLookupCommonService.getColumnsReadOnly(),
					gridOptions: {
						multiSelect: true
					},
					title: {
						name: 'estimate.rule.rules'
					},
					treeOptions: {
						parentProp: 'EstRuleFk',
						childProp: 'EstRules',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true,
						idProperty:'Id'
					},

					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						return searchValue;
					},

					onDataRefresh: function ($scope) {
						let deferred = $q.defer();
						scope = $scope;
						let ruleItems = estimateAssembliesRuleComplexLookupService.refresh($scope);
						deferred.resolve(ruleItems);
						deferred.promise.then(function(response){
							if (response){
								scope.refreshData(response);
							}
						});
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function(e, args) {
								/* let editorScope = this;
								updateRuleItems(e, args, editorScope); */
								let scope = this;
								let relationEntityService = null;
								let mainEntity = args.entity || this.$parent.entity;
								try{
									relationEntityService = $injector.get(mainEntity.RuleRelationServiceNames.r);
								}catch (ex) {
									return false;
								}

								if(mainEntity)
								{
									relationEntityService.currentMainEntity(mainEntity);
								}

								if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
									relationEntityService.deleteAllRelationsFrom(mainEntity).then(function(deleteToRules){
										let mainService = $injector.get(mainEntity.RuleRelationServiceNames.m);
										if(mainService) {
											let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
											if (deleteToRules && deleteToRules.length > 0) {
												let delOption = {
													entity: mainEntity,
													itemName: mainService.getItemName(),
													mainServiceName: mainEntity.RuleRelationServiceNames.m,
													isPrjAssembly: false,
													projectId: 0,
													estHeaderFk: mainEntity.EstHeaderFk,
													ruleToDelete: deleteToRules
												};
												estimateRuleFormatterService.deleteParamByRule(delOption);
											}
										}

									});// promise
									estimateAssembliesRuleUpdateService.clearAll(args, scope);
									relationEntityService.updateMainEntityAfterRuleChanged();
								}
							}
						},
						{
							name: 'onSelectedItemsChanged',
							handler: function(e, args) {
								let editorScope = this;
								updateRuleItems(e, args, editorScope);
							}
						},
						{
							name: 'onInputGroupClick',
							handler: function (e) {
								let editorScope = this;
								if (e.target.className.indexOf('rule-icons') === -1) {
									return;
								}

								let entity = editorScope.$parent.$parent.entity,// ex: the assembly entity
									relationEntityService = null;
								try{
									relationEntityService = $injector.get(entity.RuleRelationServiceNames.r);
								}catch (e1) {
									return false;
								}
								// the relation service must have a popup method
								if(relationEntityService) {
									// identify the mainEntity for the relation service
									relationEntityService.currentMainEntity(editorScope.$parent.$parent.entity);
									// popup
									relationEntityService.openPopup(e, editorScope);
								}

							}
						}
					]
				};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: {
					getList: function (config, scope) {
						return estimateAssembliesRuleComplexLookupService.getListAsync(config, scope);
					},

					getItemByKey: function (value, config, scope) {
						// return estimateAssembliesRuleComplexLookupService.getItemByIdAsync(value);
						return estimateAssembliesRuleComplexLookupService.getSearchList(value, config, scope);
					},

					getSearchList: function (value, config, scope) {
						return estimateAssembliesRuleComplexLookupService.getSearchList(value, config, scope);
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					let onOpenPopupClicked = function (event, editValue) {
						editValue(event);
						$scope.lookupOptions.popupOptions.width = 1000;
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
