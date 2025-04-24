(function () {
	/* global globals, _ */
	'use strict';

	const angularModule = angular.module('boq.main');

	angularModule.factory('boqMainCrbBoqItemService', ['$translate', 'accounting', 'platformSchemaService', 'platformContextService', 'platformLanguageService', 'platformRuntimeDataService', 'platformDataValidationService', 'basicsLookupdataConfigGenerator', 'boqMainCrbService', 'boqMainChangeService', 'boqMainCommonService', 'boqMainCrbPreliminariesLookupService', 'boqMainCrbQuantityTypeLookupService', 'boqMainCrbPriceTypeLookupService', 'boqMainLineTypes', 'boqMainItemTypes2', 'crbBoqPositionTypes',
		function ($translate, accounting, platformSchemaService, platformContextService, platformLanguageService, platformRuntimeDataService, platformDataValidationService, basicsLookupdataConfigGenerator, boqMainCrbService,
			boqMainChangeService, boqMainCommonService, boqMainCrbPreliminariesLookupService, boqMainCrbQuantityTypeLookupService, boqMainCrbPriceTypeLookupService, boqMainLineTypes, boqMainItemTypes2, crbBoqPositionTypes) {
			var service = {};

			const propProduct                = 'PrdProduct';
			const propHintText               = 'HintText';
			const propAssociationCalculation = 'AssociationCalculation';
			const propQuantityType           = 'QuantityType';
			const propPriceType              = 'PriceType';
			const propSerialNumber           = 'SerialNumber';
			const propBoqItemPreliminaryFk   = 'BoqItemPreliminaryFk';
			const crbBoqItemFields           = [propProduct,propHintText,propAssociationCalculation,propQuantityType,propPriceType,propSerialNumber,propBoqItemPreliminaryFk];
			const crbSubQuantityExclusiveFields = _.filter(crbBoqItemFields, function(field) { return ![propPriceType,propProduct,propHintText].includes(field); }).concat('Quantity','QuantityAdj','BasItemType2Fk','AGN','AAN');
			var defaultQuantityFormatter;
			var defaultPriceFormatter;
			var defaultFinalPriceFormatter;

			function calcBoqPositionQuantity(boqMainService, changedBoqItem) {
				var boqPosition = changedBoqItem.BoqLineTypeFk===boqMainLineTypes.position ? changedBoqItem : _.find(boqMainService.getList(), {'Id':changedBoqItem.BoqItemFk});

				// !!! Additional implemented on the server in CrbBoqSplitQuantityLogic.CalculateBoqItemQuantity() !!!
				if (boqPosition !== changedBoqItem) { // Changed the BOQ sub quantity?
					boqPosition.Quantity    = 0;
					boqPosition.QuantityAdj = 0;
					_.forEach(_.filter(boqPosition.BoqItems, function(subQuantity) { return service.isSubQuantityUsedForTheCalculation(subQuantity); }), function(subQuantity) {
						boqPosition.Quantity    += subQuantity.Quantity;
						boqPosition.QuantityAdj += subQuantity.QuantityAdj;
					});
				}

				boqMainService.boqItemQuantityChanged.fire( boqPosition);
				boqMainChangeService.reactOnChangeOfBoqItem(boqPosition, 'Quantity',    boqMainService, boqMainCommonService, true);
				boqMainChangeService.reactOnChangeOfBoqItem(boqPosition, 'QuantityAdj', boqMainService, boqMainCommonService, true);

				calcBoqPositionPrice(boqMainService, changedBoqItem);
			}

			function calcBoqPositionPrice(boqMainService, changedBoqItem) { // the average price of the sub quantites
				if (!changedBoqItem || changedBoqItem.BoqLineTypeFk!==boqMainLineTypes.crbSubQuantity) {
					return;
				}

				const boqPosition = _.find(boqMainService.getList(), {'Id':changedBoqItem.BoqItemFk});

				function calcTotal(priceProp) {
					var total = 0;
					_.forEach(_.filter(boqPosition.BoqItems, function(subQuantity) { return service.isSubQuantityUsedForTheCalculation(subQuantity); }), function(subQuantity) {
						total += subQuantity[priceProp] * subQuantity.Quantity;
					});
					return total;
				}

				if (boqPosition.UseSubQuantityPrice)
				{
					boqPosition.Price   = boqPosition.Quantity===0 ? 0 : calcTotal('Price')   / boqPosition.Quantity;
					boqPosition.PriceOc = boqPosition.Quantity===0 ? 0 : calcTotal('PriceOc') / boqPosition.Quantity;

					boqMainService.boqItemQuantityChanged.fire( boqPosition);
					boqMainChangeService.reactOnChangeOfBoqItem(boqPosition, 'Price',   boqMainService, boqMainCommonService, true);
					boqMainChangeService.reactOnChangeOfBoqItem(boqPosition, 'PriceOc', boqMainService, boqMainCommonService, true);
				}
			}

			function cloneBriefInfo(targetBoqItem, sourceBoqItem) {
				targetBoqItem.BriefInfo.Translated    = sourceBoqItem.BriefInfo.Translated;
				targetBoqItem.BriefInfo.Description   = sourceBoqItem.BriefInfo.Description;
				targetBoqItem.BriefInfo.DescriptionTr = sourceBoqItem.BriefInfo.DescriptionTr;
				targetBoqItem.BriefInfo.Modified      = true;
			}

			service.adjustGridColumns = function(boqMainService, gridColumns) {
				const cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());

				function formatNumeric(boqItem, value, decimalPlaces, bracketQuantityTypes) {
					var isInBrackets = _.isNumber(value) && bracketQuantityTypes.includes(boqItem.QuantityType);
					value = !_.isNumber(value) ? '' : accounting.formatNumber(value, decimalPlaces, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
					return '<div class="flex-box flex-align-center"><span class="flex-element text-right">' + (isInBrackets ? '(' : '') + value + (isInBrackets ? ')' : '') + '</span></div>';
				}

				function formatQuantity(row, cell, value, columnDef, boqItem, plainText) {
					if ([boqMainLineTypes.crbSubQuantity,boqMainLineTypes.position].includes(boqItem.BoqLineTypeFk)) {
						return boqItem.QuantityType==='W' ? 'per' : formatNumeric(boqItem, value, 3, ['B','K','R']);
					}
					else {
						return defaultQuantityFormatter(row, cell, value, columnDef, boqItem, plainText);
					}
				}

				function formatPrice(row, cell, value, columnDef, boqItem, plainText, uniqueId, options) {
					if (boqItem.BoqLineTypeFk === boqMainLineTypes.crbSubQuantity) {
						if (platformRuntimeDataService.isHideContent(boqItem, columnDef.field)) {
							return ' ';
						}
						else {
							return formatNumeric(boqItem, value, 2, ['Q','R','U']);
						}
					}
					else {
						return defaultPriceFormatter(row, cell, value, columnDef, boqItem, plainText, uniqueId, options);
					}
				}

				// bre:
				// 'BoqItem.Finalprice/FinalpriceOc' is not calculated (and not saved in database) for 'BoqLineType.CrbSubQuantity' because it is not expected in CRB standard.
				// But customers wish to see it in the UI.
				function formatFinalprice(row, cell, value, columnDef, boqItem, plainText, uniqueId, options) {
					value = boqItem.Quantity * boqItem.Price;
					return formatPrice(row, cell, value, columnDef, boqItem, plainText, uniqueId, options);
				}
				function formatFinalpriceOc(row, cell, value, columnDef, boqItem, plainText, uniqueId, options) {
					value = boqItem.Quantity * boqItem.PriceOc;
					return formatPrice(row, cell, value, columnDef, boqItem, plainText, uniqueId, options);
				}

				function setFormatter(columnId, formatter, defaultFormatter) {
					var column = _.find(gridColumns, ['id', columnId]);
					if (column) {
						column.formatter = boqMainService.isCrbBoq() ? formatter : defaultFormatter;
					}
				}

				function getFormatter(columnId) {
					var column = _.find(gridColumns, ['id', columnId]);
					return column ? column.formatter : undefined;
				}

				if (defaultQuantityFormatter === undefined) {
					defaultQuantityFormatter = getFormatter('quantity');
				}
				if (defaultPriceFormatter === undefined) {
					defaultPriceFormatter = getFormatter('price');
				}
				if (defaultFinalPriceFormatter === undefined) {
					defaultFinalPriceFormatter = getFormatter('finalprice');
				}
				setFormatter('quantityadj',   formatQuantity,     defaultQuantityFormatter);
				setFormatter('quantity',      formatQuantity,     defaultQuantityFormatter);
				setFormatter('price',         formatPrice,        defaultPriceFormatter);
				setFormatter('priceoc',       formatPrice,        defaultPriceFormatter);
				setFormatter('finalprice',    formatFinalprice,   defaultFinalPriceFormatter);
				setFormatter('finalpriceoc',  formatFinalpriceOc, defaultFinalPriceFormatter);
			};

			service.getGridColumns = function(boqMainService) {
				var preliminaryColumn;

				let gridColumns = [];

				function addGridColumn(dtoProperties, propName, lookupDataService) {
					var gridColumn;
					var lookupConfig;
					var propAttrib = dtoProperties[propName];

					gridColumn = {
						'id':propName, 'field':propName, 'name':$translate.instant('boq.main.' + propName),
						'editor': propAttrib.domain, 'formatter': propAttrib.domain, 'maxLength':propAttrib.maxlen,
						'grouping': {'getter':propName, 'aggregators':[], 'aggregateCollapsed':true, 'generic':true}
					};
					if (lookupDataService) {
						lookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: lookupDataService});
						gridColumn.formatter        = lookupConfig.grid.formatter;
						gridColumn.formatterOptions = lookupConfig.grid.formatterOptions;
						gridColumn.editor           = lookupConfig.grid.editor;
						gridColumn.editorOptions    = lookupConfig.grid.editorOptions;
						gridColumn.editorOptions.lookupOptions.showClearButton = !propAttrib.mandatory;
					}

					gridColumns.push(gridColumn);
					return gridColumn;
				}

				function formatPrdProduct1(prdProduct) {
					return _.isObject(prdProduct) ? prdProduct.ProductName : '';
				}

				function formatPrdProduct2(dummy1, dummy2, dummy3, dummy4, boqItem) {
					return formatPrdProduct1(boqItem.PrdProduct);
				}

				// The CRB columns are createted in not CRB BOQs too, because the dynamic turn on/off of their visibility never worked reliable.
				// Instead of the CRB columns are read only in not CRB BOQs (see function 'getReadOnlyFieldsForItem')
				if (!boqMainService.isCopySource) {
					if (boqMainService.isWicBoq()) {
						gridColumns.push({id: propHintText, field: propHintText, name: $translate.instant('boq.main.' + propHintText), width: 200});
					}
					else {
						// when the CrbBoqItem schema is not finish load, getSchemaFromCache will return null
						let crbBoqItemSchema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'CrbBoqItemDto'});
						if(crbBoqItemSchema && crbBoqItemSchema.properties){
							let dtoProperties = crbBoqItemSchema.properties;
							addGridColumn(dtoProperties, 'AssociationCalculation');
							addGridColumn(dtoProperties, 'QuantityType', 'boqMainCrbQuantityTypeLookupService');
							addGridColumn(dtoProperties, 'PriceType', 'boqMainCrbPriceTypeLookupService');
							addGridColumn(dtoProperties, 'SerialNumber');

							preliminaryColumn = addGridColumn(dtoProperties, 'BoqItemPreliminaryFk', 'boqMainCrbPreliminariesLookupService');
							preliminaryColumn.formatterOptions.displayMember = 'Reference';
							preliminaryColumn.editorOptions.lookupOptions.displayMember = preliminaryColumn.formatterOptions.displayMember;
							boqMainCrbPreliminariesLookupService.completeLookupOptions(preliminaryColumn.editorOptions.lookupOptions);
							boqMainCrbPreliminariesLookupService.setBoqMainService(boqMainService);

							boqMainCrbQuantityTypeLookupService.setBoqMainService(boqMainService);
							boqMainCrbPriceTypeLookupService.   setBoqMainService(boqMainService);

							gridColumns.push({
								id: propProduct,
								field: propProduct,
								name: $translate.instant('boq.main.' + propProduct),
								width: 100,
								formatter: formatPrdProduct2,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'boq-main-crb-select-prd-lookup', // boqMainCrbSelectPrdLookup
									lookupOptions: {
										showClearButton: true,
										format: formatPrdProduct1,
										boqMainService: boqMainService,
										boqMainCrbService: service
									}
								}
							});
						}
					}
				}

				return gridColumns;
			};

			function checkAGN(boqItem, agn, basItemType2Fk, boqValidationService, boqMainService) {
				var result = true;

				if (basItemType2Fk && !agn) {
					result = {valid:false, apply:true, error:$translate.instant('cloud.common.emptyOrNullValueErrorMessage',{fieldName:$translate.instant('boq.main.AGN')})};
				}
				platformRuntimeDataService.applyValidationResult(result, boqItem,      'AGN');
				platformDataValidationService.finishValidation(  result, boqItem, agn, 'AGN', boqValidationService, boqMainService);

				return result;
			}

			function checkAAN(boqItem, aan, basItemType2Fk, boqValidationService, boqMainService) {
				var result = true;

				if (basItemType2Fk && !aan) {
					result = {valid:false, apply:true, error:$translate.instant('cloud.common.emptyOrNullValueErrorMessage',{fieldName:$translate.instant('boq.main.AAN')})};
				}
				platformRuntimeDataService.applyValidationResult(result, boqItem,      'AAN');
				platformDataValidationService.finishValidation(  result, boqItem, aan, 'AAN', boqValidationService, boqMainService);

				return result;
			}

			service.validateBasItemType2Fk = function(boqItem, basItemType2Fk, boqValidationService, boqMainService) {
				return checkAGN(boqItem, boqItem.AGN, basItemType2Fk, boqValidationService, boqMainService) && checkAAN(boqItem, boqItem.AAN, basItemType2Fk, boqValidationService, boqMainService);
			};

			service.validateAGN = function(boqItem, agn, boqValidationService, boqMainService) {
				return checkAGN(boqItem, agn, boqItem.BasItemType2Fk, boqValidationService, boqMainService);
			};

			service.validateAAN = function(boqItem, aan, boqValidationService, boqMainService) {
				return checkAAN(boqItem, aan, boqItem.BasItemType2Fk, boqValidationService, boqMainService);
			};

			function hideSubQuantityPrices(boqSubQuantity, boqPosition) {
				if (boqSubQuantity.BoqLineTypeFk!==boqMainLineTypes.crbSubQuantity || boqSubQuantity.BoqItemFk!==boqPosition.Id) {
					return;
				}
				platformRuntimeDataService.hideContent(boqSubQuantity, ['Price','PriceOc','Finalprice','FinalpriceOc'], !boqPosition.UseSubQuantityPrice);
			}

			service.propertyChanged = function(boqMainService, changedBoqItem, propertyName) {
				if (!boqMainService.isCrbBoq()) {
					return;
				}

				function updateQuantityType(boqItem) {
					if      (!boqItem.BasItemType2Fk)                                       { boqItem.QuantityType = 'A'; }
					else if ( boqItem.BasItemType2Fk===boqMainItemTypes2.crbPrimaryVariant) { boqItem.QuantityType = 'J'; }
					else if (!boqItem.BasItemType2Fk!==boqMainItemTypes2.crbPrimaryVariant) { boqItem.QuantityType = 'Q'; }
				}

				function find2ndPrimaryVariantInSameAgnGroup(boqItem) {
					return _.find(boqMainService.getList(), function(bi) { return bi!==boqItem && bi.AGN===boqItem.AGN && bi.BasItemType2Fk===boqMainItemTypes2.crbPrimaryVariant; });
				}

				var exchangeRate = _.isNumber(boqMainService.getCurrentExchangeRate()) ? boqMainService.getCurrentExchangeRate() : 1;
				if (exchangeRate === 0) { exchangeRate = 1; }

				switch (propertyName) {
					case 'Quantity':
					case 'QuantityAdj': {
						if (changedBoqItem.BoqLineTypeFk === boqMainLineTypes.crbSubQuantity) {
							if (propertyName==='Quantity' && (changedBoqItem._originQuantity===changedBoqItem.QuantityAdj || changedBoqItem.QuantityAdj===0)) {
								changedBoqItem.QuantityAdj = changedBoqItem.Quantity;
							}
							calcBoqPositionQuantity(boqMainService, changedBoqItem);
						}
					} break;

					case 'QuantityType': {
						if (changedBoqItem.BoqLineTypeFk===boqMainLineTypes.position && !_.isEmpty(_.find(boqMainService.getList(), {'BoqItemFk':changedBoqItem.Id}))) { // BOQ position which has BOQ sub quantities ?
							changedBoqItem.QuantityType = null;
						}
						else {
							if (changedBoqItem.QuantityType === 'W') {
								changedBoqItem.Quantity    = 0;
								changedBoqItem.QuantityAdj = 0;
							}
							calcBoqPositionQuantity(boqMainService, changedBoqItem);
						}
					} break;

					case 'BasItemType2Fk': { // Ensures that there is only 1 primary variant in the AGN group. Here another BOQ item might be updated.
						if (changedBoqItem.BasItemType2Fk === boqMainItemTypes2.crbPrimaryVariant) {
							var the2ndPrimaryVariantBoqItem = find2ndPrimaryVariantInSameAgnGroup(changedBoqItem);
							if (the2ndPrimaryVariantBoqItem) {
								the2ndPrimaryVariantBoqItem.BasItemType2Fk = boqMainItemTypes2.crbEventualVariant;
								updateQuantityType(                     the2ndPrimaryVariantBoqItem);
								calcBoqPositionQuantity(boqMainService, the2ndPrimaryVariantBoqItem);
								boqMainService.markItemAsModified(      the2ndPrimaryVariantBoqItem);
							}
						}

						updateQuantityType(changedBoqItem);
						calcBoqPositionQuantity(boqMainService, changedBoqItem);
					} break;

					case 'AGN': { // Ensures that there is only 1 primary variant in the AGN group. Here the changed BOQ item might be updated again.
						if (changedBoqItem.BasItemType2Fk===boqMainItemTypes2.crbPrimaryVariant && find2ndPrimaryVariantInSameAgnGroup(changedBoqItem)) {
							changedBoqItem.BasItemType2Fk = boqMainItemTypes2.crbEventualVariant;
							updateQuantityType(changedBoqItem);
							calcBoqPositionQuantity(boqMainService, changedBoqItem);
						}
					} break;

					case 'Price': {
						if (changedBoqItem.BoqLineTypeFk === boqMainLineTypes.crbSubQuantity) {
							changedBoqItem.PriceOc = changedBoqItem.Price * exchangeRate;
						}
						calcBoqPositionPrice(boqMainService, changedBoqItem);
					} break;
					case 'PriceOc': {
						if (changedBoqItem.BoqLineTypeFk === boqMainLineTypes.crbSubQuantity) {
							changedBoqItem.Price = changedBoqItem.PriceOc / exchangeRate;
						}
						calcBoqPositionPrice(boqMainService, changedBoqItem);
					} break;

					case 'UseSubQuantityPrice': {
						if (changedBoqItem.UseSubQuantityPrice) {
							changedBoqItem.Price     = 0;
							changedBoqItem.PriceOc   = 0;
							changedBoqItem.PriceType = null;
						}
						else {
							changedBoqItem.PriceType = null;
							_.forEach(changedBoqItem.BoqItems, function(subQuantity) {
								subQuantity.Price     = 0;
								subQuantity.PriceOc   = 0;
								subQuantity.PriceType = null;
								boqMainService.markItemAsModified(subQuantity);
							});
						}
						boqMainChangeService.reactOnChangeOfBoqItem(changedBoqItem, 'Price',   boqMainService, boqMainCommonService, true);
						boqMainChangeService.reactOnChangeOfBoqItem(changedBoqItem, 'PriceOc', boqMainService, boqMainCommonService, true);
						_.forEach(changedBoqItem.BoqItems, function(subQuantity) {
							hideSubQuantityPrices(subQuantity, changedBoqItem);
							boqMainService.markItemAsModified(subQuantity); // triggers the rendering of the grid cell
						});
					} break;

					case 'BoqItemPreliminaryFk': {
						boqMainCrbPreliminariesLookupService.tryRepairBoqItemPreliminaryFk(changedBoqItem);
					} break;

					case 'BriefInfo':
					case 'BasUomFk': {
						if (changedBoqItem.BoqLineTypeFk === boqMainLineTypes.position) {
							_.forEach(changedBoqItem.BoqItems, function(boqSubQuantity) {
								cloneBriefInfo(boqSubQuantity, changedBoqItem);
								boqSubQuantity.BasUomFk      = changedBoqItem.BasUomFk;
								boqMainService.markItemAsModified(boqSubQuantity);
							});
						}
					} break;
				}
			};

			service.handleCreateSucceeded = function(boqMainService, newBoqItem) {
				if (!boqMainService.isCrbBoq() || !newBoqItem || newBoqItem.BoqLineTypeFk!==boqMainLineTypes.crbSubQuantity) {
					return;
				}

				const parentBoqPosOfNewBoqSubQuantity = boqMainService.getBoqItemById(newBoqItem.BoqItemFk);

				cloneBriefInfo(newBoqItem, parentBoqPosOfNewBoqSubQuantity);
				newBoqItem.BasUomFk =      parentBoqPosOfNewBoqSubQuantity.BasUomFk;

				if (!_.some(parentBoqPosOfNewBoqSubQuantity.BoqItems)) { // Is the first child created?
					if (parentBoqPosOfNewBoqSubQuantity.UseSubQuantityPrice) {
						newBoqItem.Price    = parentBoqPosOfNewBoqSubQuantity.Price;
						newBoqItem.PriceOc  = parentBoqPosOfNewBoqSubQuantity.PriceOc;
					}

					if (!parentBoqPosOfNewBoqSubQuantity.QuantityType) {
						parentBoqPosOfNewBoqSubQuantity.QuantityType = 'A';
					}
					_.forEach(crbSubQuantityExclusiveFields, function(field) {
						newBoqItem[field] = parentBoqPosOfNewBoqSubQuantity[field];
						if (!['Quantity','QuantityAdj','QuantityType'].includes(field)) {
							parentBoqPosOfNewBoqSubQuantity[field] = null;
						}
					});

					boqMainService.markItemAsModified(parentBoqPosOfNewBoqSubQuantity);
				}

				hideSubQuantityPrices(newBoqItem, parentBoqPosOfNewBoqSubQuantity);
				boqMainService.fireItemModified(newBoqItem);
			};

			service.onDeleteDone = function(boqMainService, parentBoqItem, deletedBoqItem) {
				if (!parentBoqItem || !_.some(parentBoqItem.BoqItems) || !deletedBoqItem || deletedBoqItem.BoqLineTypeFk!==boqMainLineTypes.crbSubQuantity) {
					return;
				}

				calcBoqPositionQuantity(boqMainService, deletedBoqItem);
			};

			service.getReadOnlyFieldsForItem = function(boqMainService, currBoqItem, allFields, readOnlyFields) {
				var crbReadOnlyFields = readOnlyFields.slice();

				if (!boqMainService.isCrbBoq()) {
					platformRuntimeDataService.hideContent(currBoqItem, ['UseSubQuantityPrice'], true); // Declared in BoqItemDto but only used in CRB
					return crbReadOnlyFields.concat(crbBoqItemFields).concat(['UseSubQuantityPrice']);
				}

				// Always generated
				crbReadOnlyFields.push('BoqLineTypeFk');

				// 'Reference'
				if (currBoqItem.BoqLineTypeFk === 1) {
					// Only can be edited in an empty individual chapter BOQ item. This restriction ensures to get vaild 'Reference' values for the few children.
					// It is easier to check the Abschnitt BOQ item, the 'Reference' of the chapter BOQ item could be invalid.
					const singleChapter = boqMainCrbService.getSingleChapter(boqMainService);
					const boqItems = boqMainService.getList();
					if (!(boqMainCrbService.isIndividualPosition(boqMainService, singleChapter) && boqItems.length===4 && _.find(boqItems, {'Reference':singleChapter.Reference+'000.'}))) {  // 4 = root + chapter + .000. + .000.200
						crbReadOnlyFields.push('Reference');
					}
				}
				else if (!(boqMainCrbService.isIndividualPosition(boqMainService, currBoqItem) && _.isEmpty(currBoqItem.BoqItems))) {
					crbReadOnlyFields.push('Reference');
				}

				// Standard info cannot be edited in a closed position and in a NPK
				if (currBoqItem.PositionType===crbBoqPositionTypes.closed || (boqMainService.isWicBoq() && !boqMainCrbService.isIndividualPosition(boqMainService, currBoqItem))) {
					crbReadOnlyFields.push('BriefInfo');
					crbReadOnlyFields.push('BasUomFk');
				}

				// The release year is editable only in an individual position
				if (!(currBoqItem.BoqLineTypeFk===1 && boqMainCrbService.isIndividualPosition(boqMainService, currBoqItem))) {
					crbReadOnlyFields.push('Reference2');
				}

				// 'PriceType' is the counterpart in CRB
				_.forEach(['Included','NotSubmitted'], function(field) {
					crbReadOnlyFields.push(field);
					platformRuntimeDataService.hideContent(currBoqItem, [field], true); // else, the content would be an empty checkbox
				});

				// CRB price conditions care about the fields in its own way
				crbReadOnlyFields.push('Discount');
				crbReadOnlyFields.push('DiscountOc');
				crbReadOnlyFields.push('DiscountPercent');
				crbReadOnlyFields.push('DiscountPercentIt');
				crbReadOnlyFields.push('DiscountText');
				crbReadOnlyFields.push('MdcTaxCodeFk');

				// 'UseSubQuantityPrice'
				if (currBoqItem.BoqLineTypeFk === boqMainLineTypes.position) {
					_.forEach(currBoqItem.BoqItems, function(boqSubQuantity) {
						hideSubQuantityPrices(boqSubQuantity, currBoqItem);
					});
				}
				else {
					crbReadOnlyFields.push('UseSubQuantityPrice');
					platformRuntimeDataService.hideContent(currBoqItem, ['UseSubQuantityPrice'], true);
				}

				// SubQuantity position fields
				if (currBoqItem.BoqLineTypeFk === boqMainLineTypes.crbSubQuantity) {
					crbReadOnlyFields = allFields.slice();
					_.forEach(crbSubQuantityExclusiveFields.concat(['Price','PriceOc','PriceType','PrjChangeFk','ProjectBillToFk']), function(field) { // All fields are read only except those of the list
						crbReadOnlyFields.splice(crbReadOnlyFields.indexOf(field), 1);
					});

					_.forEach(crbReadOnlyFields.concat(['ExSalesRejectedQuantity']), function(field) {
						if (!['Reference','BoqLineTypeFk','Finalprice','FinalpriceOc','BriefInfo','BasUomFk','PrjChangeStatusFk'].includes(field)) {
							platformRuntimeDataService.hideContent(currBoqItem, [field], true);
						}
					});
				}
				else if (currBoqItem.BoqLineTypeFk!==boqMainLineTypes.position || currBoqItem.BoqLineTypeFk===boqMainLineTypes.position && _.some(currBoqItem.BoqItems)) {
					crbReadOnlyFields = crbReadOnlyFields.concat(crbSubQuantityExclusiveFields);
				}

				// Quantity fields
				if (currBoqItem.QuantityType === 'W') {
					crbReadOnlyFields.push('Quantity');
					crbReadOnlyFields.push('QuantityAdj');
				}

				// Price fields, depends on property 'UseSubQuantityPrice'
				if ([boqMainLineTypes.position,boqMainLineTypes.crbSubQuantity].includes(currBoqItem.BoqLineTypeFk)) {
					const priceFields = ['Price','PriceOc','Pricegross','PricegrossOc','PriceType'];
					if (currBoqItem.BoqLineTypeFk===boqMainLineTypes.position && currBoqItem.UseSubQuantityPrice) {
						crbReadOnlyFields = crbReadOnlyFields.concat(priceFields);
					}
					else if (currBoqItem.BoqLineTypeFk === boqMainLineTypes.crbSubQuantity) {
						const boqPosition = _.find(boqMainService.getList(), {'Id':currBoqItem.BoqItemFk});
						if (boqPosition && !boqPosition.UseSubQuantityPrice) {
							crbReadOnlyFields = crbReadOnlyFields.concat(priceFields);
						}
					}
				}

				if (!boqMainCrbService.isUsingFullLicence()) {
					crbReadOnlyFields = allFields.slice();
					_.forEach(['Quantity','Price','PriceOc'], function(field) { // All fields are read only except those of the list
						if (!readOnlyFields.includes(field)) {
							crbReadOnlyFields.splice(crbReadOnlyFields.indexOf(field), 1);
						}
					});
				}

				return crbReadOnlyFields;
			};

			service.isSubQuantityUsedForTheCalculation = function(boqSubQuantity) {
				return boqSubQuantity && boqSubQuantity.BoqLineTypeFk===boqMainLineTypes.crbSubQuantity && ['A','B','D','J','K','M'].includes(boqSubQuantity.QuantityType);
			};

			return service;
		}
	]);

	angularModule.factory('boqMainCrbPriceTypeLookupService', ['$q', '$http', 'platformLookupDataServiceFactory', 'platformContextService', 'crbDocumentTypes',
		function ($q, $http, platformLookupDataServiceFactory, platformContextService, crbDocumentTypes) {
			var boqMainService;
			var culture = platformContextService.getCulture();
			var lookupPriceTypes = [];
			var descriptions = _.startsWith(culture, 'fr') ? ['Prix de l\'offre de l\'entrepreneur (standard)', 'Prix indicatif établi par le concepteur, non modifiable par l\'entrepreneur', 'Compris dans l\'offre (fixé par l\'entrepreneur)', 'Non compris dans l\'offre (fixé par l\'entrepreneur)', 'Cette tâche est prévue être exécutée en régie. (fixé par le concepteur, qui attend un "prix pour quantité partielle" de la part de l\'entrepreneur. Le montant résultant de "quantité x prix de la quantité partielle" correspond au total des prestations en régie)'] :
				_.startsWith(culture, 'it') ? ['Prezzo d\'offerta dell\'imprenditore (standard)', 'Pianificatore del prezzo target, l\'imprenditore non può cambiare questo', 'Incluso nell\'offerta (imprenditore determinato)', 'Non offerto (imprenditore determinato)', 'Per questo lavoro è prevista una versione del regista. (Determina il pianificatore e si aspetta un prezzo di quantità parziale dal contraente. L\'importo della quantità risultante x prezzo della quantità parziale corrisponde al totale dell\'attività lavorativa diretta)'] :
					['Angebotspreis des Unternehmers (Standard)', 'Richtpreis Planer, Unternehmer kann diesen nicht verändern', 'Inbegriffen im Angebot (bestimmt Unternehmer)', 'Nicht offeriert (bestimmt Unternehmer)', 'Für diese Arbeit ist eine Ausführung in Regie vorgesehen. (Bestimmt Planer und erwartet vom Unternehmer einen Teilmengenpreis. Der resultierende Betrag aus Menge x Teilmengenpreis entspricht der gesamten Leistung in Regie)'];

			_.forEach(['A','F','I','N','R'], function(priceTypeCode) {
				lookupPriceTypes.push({'Id':priceTypeCode, 'Code':priceTypeCode, 'DescriptionInfo':{'Translated':descriptions[lookupPriceTypes.length]}});
			});

			var service = platformLookupDataServiceFactory.createInstance({}).service;
			service.getLookupData = function() {
				var filteredLookupPriceTypes = [];
				return $http.get(globals.webApiBaseUrl + 'boq/main/crb/' + 'crbdocumenttype?boqHeaderId='+boqMainService.getSelectedBoqHeader()).then(function(response) {
					if (_.isObject(response.data = JSON.parse(response.data))) {
						const currentCrbDocumentType = response.data.CurrentCrbDocumentType;
						_.forEach(lookupPriceTypes, function(priceType) {
							if (!([crbDocumentTypes.A,crbDocumentTypes.B].includes(currentCrbDocumentType) && ['I','N'].includes(priceType.Code))) {
								filteredLookupPriceTypes.push(priceType);
							}
						});
						return filteredLookupPriceTypes;
					}
				});
			};
			service.getItemById = function (id) {
				return _.find(lookupPriceTypes, ['Id', id]);
			};
			service.getItemByIdAsync = function (id) {
				return $q.when(service.getItemById(id));
			};

			service.setBoqMainService = function (boqMainServiceParam) {
				boqMainService = boqMainServiceParam;
			};

			return service;
		}
	]);

	angularModule.factory('boqMainCrbQuantityTypeLookupService', ['$q', 'platformLookupDataServiceFactory', 'platformContextService', 'boqMainItemTypes2',
		function ($q, platformLookupDataServiceFactory, platformContextService, boqMainItemTypes2) {
			var service;
			var boqMainService;
			var culture = platformContextService.getCulture();
			var lookupQuantityTypes = [];
			var descriptions = _.startsWith(culture, 'fr') ? ['Avant-métré du concepteur', 'Quantité fixe du concepteur', 'Avant-métré établi selon les instructions du concepteur, l\'avant-métré ne peut être réalisé que selon les instructions du concepteur, à prendre en compte dans le calcul', 'Article-par sans indication de quantité, à ne pas prendre en considération', 'Avant-métré du concepteur/projeteur, à prendre en considération (variante primaire)', 'Quantité fixe établie par le concepteur/projeteur, à prendre en considération (variante primaire)', 'Avant-métré établi selon les instructions du concepteur, l\'avant-métré ne peut être réalisé que selon les instructions du concepteur, à prendre en compte dans le calcul (variante primaire)', 'Avant-métré établi par le concepteur, à ne pas prendre en compte dans le calcul (variante éventuelle)', 'Quantité fixe établie par le concepteur, à ne pas prendre en compte dans le calcul (variante éventuelle)', 'Avant-métré établi selon les instructions du concepteur, l\'avant-métré ne peut être réalisé que selon les instructions du concepteur, à ne pas prendre en compte dans le calcul (variante éventuelle)'] :
				_.startsWith(culture, 'it') ? ['Pianificatore di dimensioni in anticipo', 'Pianificatore di quantità fisse', 'La misurazione anticipata su indicazione del pianificatore, può essere effettuata solo su indicazione del pianificatore, deve essere presa in considerazione', 'Per articolo senza quantità, da non includere', 'Pianificazione anticipata delle misure da includere (variante primaria)', 'Quantità fissa del pianificatore, da includere (variante primaria)', 'La misurazione anticipata su istruzioni del pianificatore, può essere eseguita solo su istruzioni del pianificatore, deve essere presa in considerazione (variante primaria)', 'Planner, da non includere nel calcolo (variante di contingenza)', 'Quantità fissa del pianificatore, da non includere (variante contingente)', 'La misurazione anticipata su istruzioni del pianificatore, può essere eseguita solo su istruzioni del pianificatore, non deve essere inclusa nel calcolo (variante di contingenza)'] :
					['Vorausmass Planer', 'Festmenge Planer', 'Vorausmass auf Anweisung Planer, darf nur auf Anweisung des Planers ausgeführt werden, ist einzurechnen', 'Per-Position ohne Mengenangabe, nicht einzurechnen', 'Vorausmass Planer, einzurechnen (Primärvariante)', 'Festmenge Planer, einzurechnen (Primärvariante)', 'Vorausmass auf Anweisung Planer, darf nur auf Anweisung des Planers ausgeführt werden, ist einzurechnen (Primärvariante)', 'Vorausmass Planer, nicht einzurechnen(Eventualvariante)', 'Festmenge Planer, nicht einzurechnen (Eventualvariante)', 'Vorausmass auf Anweisung Planer, darf nur auf Anweisung des Planers ausgeführt werden, ist nicht einzurechnen (Eventualvariante)'];

			_.forEach(['A','B','D','W','J','K','M','Q','R','U'], function (quantityTypeCode) {
				lookupQuantityTypes.push({Id: quantityTypeCode, Code: quantityTypeCode, DescriptionInfo: {Translated: descriptions[lookupQuantityTypes.length]}});
			});

			service = platformLookupDataServiceFactory.createInstance({}).service;
			service.getLookupData = function() {
				function filterQuantityTypes(itemType2) {
					var validQuantityTypes;
					validQuantityTypes = itemType2===boqMainItemTypes2.crbPrimaryVariant ? ['J','K','M'] : itemType2===boqMainItemTypes2.crbEventualVariant ? ['Q','R','U'] : ['A','B','D','W'];
					return _.filter(lookupQuantityTypes, function(quantityType) { return validQuantityTypes.includes(quantityType.Id); } );
				}
				return $q.when(filterQuantityTypes(boqMainService.getSelected().BasItemType2Fk));
			};
			service.getItemById = function(id) {
				return _.find(lookupQuantityTypes, ['Id', id]);
			};
			service.getItemByIdAsync = function(id) {
				return $q.when(service.getItemById(id));
			};

			service.setBoqMainService = function (boqMainServiceParam) {
				boqMainService = boqMainServiceParam;
			};

			return service;
		}
	]);

	angularModule.factory('boqMainCrbPreliminariesLookupService', ['$q', 'platformLookupDataServiceFactory',
		function ($q, platformLookupDataServiceFactory) {
			var boqMainService;

			var service = platformLookupDataServiceFactory.createInstance({}).service;

			service.getLookupData = function () {
				var currentBoqItemReference = boqMainService.getSelected().Reference;

				function filterPreliminaries(boqItems) {
					var ret = [];
					var boqPreliminaries;

					// Only preliminaries of the same "Kapitel" and "Abschnitt" can be used.

					boqItems = JSON.parse(JSON.stringify(boqItems)); // deep clone

					_.forEach(boqItems, function (boqItem) {
						boqPreliminaries = filterPreliminaries(boqItem.BoqItems);
						if (boqItem.BoqLineTypeFk === 1 || _.startsWith(boqItem.Reference, currentBoqItemReference.substring(0, 5)) && (boqItem.IsPreliminary || _.some(boqPreliminaries))) {
							ret.push(boqItem);
							boqItem.BoqItems = boqPreliminaries;
						}
					});

					return ret;
				}

				return $q.when(filterPreliminaries(_.filter(boqMainService.getList(), function (boqItem) {
					return boqItem.BoqLineTypeFk === 1 && _.startsWith(boqItem.Reference, currentBoqItemReference.substring(0, 3));
				})));
			};
			service.resetCache = function () {
				return service.getLookupData();
			};
			service.getItemById = function (id) {
				return _.find(boqMainService.getList(), ['Id', id]);
			};
			service.getItemByIdAsync = function (id) {
				return $q.when(service.getItemById(id));
			};

			service.setBoqMainService = function (boqMainServiceParam) {
				boqMainService = boqMainServiceParam;
			};

			service.completeLookupOptions = function (lookupOptions) {
				lookupOptions.additionalColumns = false;
				lookupOptions.columns = [{id: 'Reference', field: 'Reference', name$tr$: 'cloud.common.entityReference'},
					{id: 'Brief', field: 'BriefInfo.Description', name$tr$: 'cloud.common.entityBrief'}];
				lookupOptions.treeOptions = {parentProp: 'BoqItemFk', childProp: 'BoqItems'};
			};

			service.tryRepairBoqItemPreliminaryFk = function (quantityDetail) {
				var boqItem = _.find(boqMainService.getList(), {'Id': quantityDetail.BoqItemPreliminaryFk});
				if (!(boqItem && boqItem.IsPreliminary)) { // It is only allowed to assign a preliminary.
					quantityDetail.BoqItemPreliminaryFk = null;
				}
			};

			return service;
		}
	]);
})();
