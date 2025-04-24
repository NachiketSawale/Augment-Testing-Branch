/**
 * Created by mov on 2/27.
 */

(function (angular, globals)
{
	/* global  globals, _ */
	'use strict';

	globals.lookups.qtoDetailBoqItemCode = function qtoDetailBoqItemCode($injector, $translate, $q, $http){
		return {
			lookupOptions:{
				lookupType: 'qtoDetailBoqItemCode',
				valueMember: 'Id',
				displayMember: 'Reference',
				uuid: '366d896a6e894a77bcbd667e2e414499',
				'treeOptions': {
					'parentProp': 'BoqItemFk',
					'childProp': 'BoqItems',
					'initialState': 'expanded'
				},
				matchDisplayMembers: ['Reference'],
				isClientSearch: true,
				columns: [
					{
						'id': 'Brief',
						'field': 'BriefInfo.Translated',
						'name': 'Brief',
						'formatter': 'description',
						'name$tr$': 'cloud.common.entityBrief'
					},
					{
						'id': 'Reference',
						'field': 'Reference',
						'name': 'Reference',
						'formatter': 'description',
						'name$tr$': 'cloud.common.entityReference'
					},
					{
						'id': 'BasUomFk',
						'field': 'BasUomFk',
						'name': 'Uom',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						'name$tr$': 'cloud.common.entityUoM'
					}
				],
				title: { name: 'CommentText', name$tr$: 'qto.formula.comment.title' },
				searchInterval: 1200,
				events: [
					{
						name: 'onInitialized',
						handler: function (e, args) {
							let entity = $injector.get('qtoMainDetailService').getSelected();

							let qtoBoqList = $injector.get('basicsLookupdataLookupDescriptorService').getData('qtoBoqItemLookupService');
							let boqItem = entity ? _.find(qtoBoqList, {Id: entity.BoqItemFk}) || $injector.get('qtoBoqItemLookupService').getItemById(entity.BoqItemFk) : null;

							if (boqItem){
								// Workaround for popup to search for the correct selected item
								let onModelChangeFn = args.lookup.onModelChange;
								args.lookup.onModelChange = function(){};
								args.lookup.selectItem(boqItem);
								// args.lookup.setViewValue(boqItem.Reference);
								setTimeout(function(){
									args.lookup.onModelChange = onModelChangeFn;
								});
							}
						}
					},
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedItem = angular.copy(args.selectedItem);
							if (!args.entity || (selectedItem && selectedItem.BoqLineTypeFk !== 0 && selectedItem.BoqLineTypeFk !== 11)) {
								return;
							}

							let qtoBoqStructureService = $injector.get('qtoBoqStructureService');
							let hasSubQuantityItem = false;
							if(qtoBoqStructureService.isCrbBoq() && selectedItem && selectedItem.boqlinetypefk === 0 && _.isArray(selectedItem.BoqItems) && selectedItem.BoqItems.length > 0){
								// if position boq contains sub quantity, can not assign qto lines to BoqItem which contains sub quantity items.
								hasSubQuantityItem =  !!_.find(selectedItem.BoqItems, function(item){return item.BoqLineTypeFk === 11;});
								if(hasSubQuantityItem){
									return;
								}
							}

							let isValid = true;
							let dataService = $injector.get('qtoMainDetailService');

							// find the same group qto by the qto primary boqitemcode
							let referencedLines = dataService.getTheSameGroupQto(args.entity);

							if (selectedItem) {
								args.entity.BoqItemCode = selectedItem.Reference;
								args.entity.BoqItemFk = selectedItem.Id;
								args.entity.BasUomFk = selectedItem.BasUomFk;
							} else {
								args.entity.BoqItemCode = '';
								args.entity.BoqItemFk = null;
								isValid = false;
							}

							let deffered = $q.defer();
							if (selectedItem) {
								if (selectedItem.BoqLineTypeFk === 0 && !hasSubQuantityItem) {
									// will set the default split to qtoline.
									$http.get(globals.webApiBaseUrl + 'qto/main/detail/getboqsplitquantitiesForQto?boqItemId=' + selectedItem.Id + '&boqHeaderId=' + selectedItem.BoqHeaderFk).then(function (response) {
										let data = response.data;
										args.entity.BoqItemFk = selectedItem.Id;
										args.entity.BoqSplitQuantityFk = data.length > 0 ? data[0].Id : null;

										// if the selected item is a position boq, then set the last qto lineItem or to null
										let itemList = dataService.getList();
										let items = _.filter(itemList, function (item) {
											return item.Version > 0 && item.BoqItemFk === args.entity.BoqItemFk && item.EstLineItemFk && item.Id !== args.entity.Id;
										});
										if (items.length > 0) {
											args.entity.EstHeaderFk = items[items.length - 1].EstHeaderFk;
											args.entity.EstLineItemFk = items[items.length - 1].EstLineItemFk;
										} else {
											args.entity.EstHeaderFk = null;
											args.entity.EstLineItemFk = null;
										}

										deffered.resolve();
									});
								} else if (selectedItem.BoqLineTypeFk === 11){
									args.entity.BoqItemFk = selectedItem.Id;
									deffered.resolve();
								}else {
									args.entity.BoqItemFk = null;
									isValid = false;
									deffered.resolve();
								}
							}

							$q.when(deffered.promise).then(function () {

								/* if boq item change, set as true */
								args.entity.IsBoqItemChange = true;
								args.entity.IsBoqSplitChange = true;
								args.entity.IsLineItemChange = false;


								let platformDataValidationService = $injector.get('platformDataValidationService');
								let result = platformDataValidationService.createErrorObject('Invalid Boq Item');//  {apply: true, valid: isValid, error: 'Invalid Boq Item'};
								result.valid = isValid;
								result.error = $translate.instant('qto.main.selectBoqItemError');

								let model = 'BoqItemCode';
								let service = $injector.get('qtoMainDetailGridValidationService');

								// set boq split quantity readonly
								if (result.valid) {
									service.validateBoqSplitQuantityFk(args.entity, args.entity.BoqSplitQuantityFk, 'BoqSplitQuantityFk');
								}

								$injector.get('platformRuntimeDataService').applyValidationResult(result, args.entity, model);

								result = platformDataValidationService.finishValidation(result, args.entity, args.entity.BoqItemCode, model, service, dataService);
								if (result.valid) {
									let allFormulaUoms = $injector.get('basicsLookupdataLookupDescriptorService').getData('QtoFormulaAllUom');
									dataService.updateReadOnlyDetail(args.entity, allFormulaUoms);

									// change the group qto' boqitem code
									if (referencedLines && referencedLines.length) {
										_.forEach(referencedLines, function (item) {
											/* if boq item change, set as true */
											item.IsBoqItemChange = true;
											item.IsBoqSplitChange = true;
											item.IsLineItemChange = false;
											item.BoqItemFk = args.entity.BoqItemFk;
											item.BoqItemCode = args.entity.BoqItemCode;
											item.BoqHeaderFk = args.entity.BoqHeaderFk;
											item.BasUomFk = args.entity.BasUomFk;
											item.BoqSplitQuantityFk = args.entity.BoqSplitQuantityFk;
											item.Id !== args.entity.Id && dataService.updateReadOnlyDetail(item, allFormulaUoms);
										});
										dataService.markEntitiesAsModified(referencedLines);
										dataService.updateQtoDetailGroupInfo();
									}

									let newReferencedLines = dataService.getTheSameGroupQto(args.entity);
									if (referencedLines.length !== newReferencedLines.length){
										service.validateNewGroup(newReferencedLines);
									}
								}

								dataService.markItemAsModified(args.entity);

								let qtoBoqStructureService = $injector.get('qtoBoqStructureService');
								let boqItemList = qtoBoqStructureService.getList();

								if (args.previousItem) {
									qtoBoqStructureService.calculateQtoDetaiByBoqitem(dataService.getList(), boqItemList, args.previousItem.Id, boqItemList[0]);
								}

								if (args.selectedItem) {
									qtoBoqStructureService.calculateQtoDetaiByBoqitem(dataService.getList(), boqItemList, args.selectedItem.Id, boqItemList[0]);
								}
							});
						}
					}
				],
				formatInput: function (newValue) {
					if (!newValue) {
						return newValue;
					}

					return $injector.get('qtoBoqItemLookupService').formatBoqReference(newValue);
				}
			},
			dataProvider: 'qtoBoqItemLookupService'
		};
	};

	angular.module( 'qto.main' ).directive( 'qtoDetailBoqItemLookup', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition','$translate', '$q', '$http',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition,$translate, $q, $http)
		{
			let defaults = globals.lookups.qtoDetailBoqItemCode($injector, $translate, $q, $http);

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	] );
})(angular, globals);