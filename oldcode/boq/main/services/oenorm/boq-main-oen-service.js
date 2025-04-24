(function () {
	/* global globals, _ */
	'use strict';

	const angularModule = angular.module('boq.main');

	angularModule.factory('boqMainOenService', ['$http', '$translate', '$timeout', 'platformSchemaService', 'platformRuntimeDataService', 'boqMainLineTypes', 'boqMainItemTypes', 'boqMainItemTypes2', 'boqMainOenBoqStructure', 'boqMainOenLvHeaderLookupService',
		function($http, $translate, $timeout, platformSchemaService, platformRuntimeDataService, boqMainLineTypes, boqMainItemTypes, boqMainItemTypes2, boqMainOenBoqStructure, boqMainOenLvHeaderLookupService) {
			var service = {};
			var scope;
			var textComplementService;

			// #region BOQ item creation/deletion

			function isFollowingPosition(boqItem) {
				return boqItem && boqItem.BoqLineTypeFk===boqMainLineTypes.position && !boqItem.IsUnsharedPosition;
			}

			function hasRemainingReference(boqMainService, parentOfNewBoqItem) {
				const maxReferencePart = geMaxReferencePart(parentOfNewBoqItem, isBoqWithStructure(boqMainService));
				return isBoqWithStructure(boqMainService) ? !['ZZ','Z'].includes(maxReferencePart) : 'ZZZZZZZZZZZZ'!==maxReferencePart;
			}

			function isBoqWithStructure(boqMainService) {
				return boqMainService.getStructure().BoqStructureDetailEntities[0].BoqLineTypeFk!==boqMainLineTypes.position;
			}

			function geMaxReferencePart(parentBoqItem, isBoqWithStructure) {
				var siblingBoqItems;
				if (parentBoqItem) {
					siblingBoqItems = parentBoqItem.BoqItems;
				}
				if (_.isEmpty(siblingBoqItems)) {
					return '';
				}

				const lastSiblingBoqItem = _.last(siblingBoqItems);

				var maxReferencePart = lastSiblingBoqItem.Reference;
				if (isBoqWithStructure) {
					if (lastSiblingBoqItem.BoqLineTypeFk===boqMainLineTypes.position && !_.endsWith(maxReferencePart,'.')) { // Mehrfachverwendung?
						maxReferencePart = maxReferencePart.slice(0,-1);
					}
					maxReferencePart = maxReferencePart.slice(isFollowingPosition(lastSiblingBoqItem) ? -2 : -3, -1);
				}

				return maxReferencePart;
			}

			service.isHG = function isHG(boqItem) {
				return _.isObject(boqItem) ? boqItem.BoqLineTypeFk === 1 : false;
			};

			service.isOG = function isOG(boqItem) {
				return _.isObject(boqItem) ? boqItem.BoqLineTypeFk === 2 : false;
			};

			service.isLG = function isLG(boqItem) {
				return _.isObject(boqItem) ? boqItem.BoqLineTypeFk === 3 : false;
			};

			service.isUG = function isUG(boqItem) {
				return _.isObject(boqItem) ? boqItem.BoqLineTypeFk === 4 : false;
			};

			service.isValidBoqReference = function(boqMainService, boqReference, currentBoqItem, parentBoqItem) {
				const topBoqLineType = boqMainService.getBoqStructure().BoqStructureDetailEntities[0].BoqLineTypeFk;
				const chars0 = /[A-Z0-9]{1,12}/;
				const chars1 = new RegExp((currentBoqItem.IsUnsharedPosition ? '' : /[A-Z0-9]{1}\./.source) + /[A-Z0-9]{0,1}/.source);
				const chars2 = /[A-Z0-9]{2}\./;
				var regexPerLinetype = []; // array index === 'BoqLineTypeFk'
				regexPerLinetype[1] =                                                                  chars2;
				regexPerLinetype[2] = new RegExp(regexPerLinetype[1].source + (topBoqLineType>1 ? '' : chars2.source));
				regexPerLinetype[3] = new RegExp(regexPerLinetype[2].source + (topBoqLineType>2 ? '' : chars2.source));
				regexPerLinetype[4] = new RegExp(regexPerLinetype[3].source +                          chars2.source);
				regexPerLinetype[5] = new RegExp(regexPerLinetype[4].source +                          chars2.source);
				regexPerLinetype[0] = new RegExp(regexPerLinetype[5].source +                          chars1.source);
				if (!isBoqWithStructure(boqMainService)) { regexPerLinetype[0] = chars0; }

				var ret = new RegExp('^' + regexPerLinetype[currentBoqItem.BoqLineTypeFk].source + '$').test(boqReference); // general check of the 'Reference'

				if (ret && parentBoqItem.BoqLineTypeFk!==boqMainLineTypes.root) {
					ret = _.startsWith(boqReference, parentBoqItem.Reference); // Checks against the parent
				}

				return ret;
			};

			service.canCreateNewPosition = function(boqMainService, currentBoqItem) {
				if (!boqMainService.isOenBoq() || !currentBoqItem) {
					return false;
				}

				var ret = !isBoqWithStructure(boqMainService) || [4,5,boqMainLineTypes.position].includes(currentBoqItem.BoqLineTypeFk);
				if (ret) {
					ret = hasRemainingReference(boqMainService, currentBoqItem.BoqLineTypeFk===boqMainLineTypes.position ? boqMainService.getBoqItemById(currentBoqItem.BoqItemFk) : currentBoqItem);
				}

				return ret;
			};

			service.canCreateNewSiblingDivision = function(boqMainService, currentBoqItem) {
				if (!boqMainService.isOenBoq() || !currentBoqItem) {
					return false;
				}

				var ret = isBoqWithStructure(boqMainService) && 1<=currentBoqItem.BoqLineTypeFk && currentBoqItem.BoqLineTypeFk<=5;
				if (ret) {
					ret = hasRemainingReference(boqMainService, boqMainService.getBoqItemById(currentBoqItem.BoqItemFk));
				}

				return ret;
			};

			service.canCreateNewSubDivision = function(boqMainService, currentBoqItem) {
				if (!boqMainService.isOenBoq() || !currentBoqItem) {
					return false;
				}

				var ret = isBoqWithStructure(boqMainService) && (currentBoqItem.BoqLineTypeFk===boqMainLineTypes.root || 1<=currentBoqItem.BoqLineTypeFk && currentBoqItem.BoqLineTypeFk<5);
				if (ret) {
					ret = hasRemainingReference(boqMainService, currentBoqItem);
				}

				return ret;
			};

			service.generateBoqReference = function(boqMainService, newBoqLineType) {
				function increase(originReferencePart) {
					if (_.isEmpty(originReferencePart)) {
						return '';
					}

					const allowedChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
					var charIndexes = [];
					var i;
					var increasedReferencePart = '';


					for (i=0; i<originReferencePart.length; i++) {
						charIndexes.push(allowedChars.indexOf(originReferencePart[i]));
					}

					for (i=charIndexes.length-1; i>=0; i--) {
						if (0<=charIndexes[i] && charIndexes[i]<35) {
							charIndexes[i]++;
							break;
						}
						else {
							charIndexes[i] = 0;
						}
					}

					for (i=0; i<charIndexes.length; i++) {
						increasedReferencePart += allowedChars[charIndexes[i]];
					}

					return increasedReferencePart;
				}

				var currentBoqItem = boqMainService.getSelected();
				var parentOfNewBoqItem = currentBoqItem.BoqLineTypeFk===newBoqLineType ? boqMainService.getBoqItemById(currentBoqItem.BoqItemFk) : currentBoqItem;

				var ret = parentOfNewBoqItem.BoqLineTypeFk===boqMainLineTypes.root ? '' : parentOfNewBoqItem.Reference;
				if (_.isEmpty(parentOfNewBoqItem.BoqItems)) {
					ret += parentOfNewBoqItem.BoqLineTypeFk===5 ? 'A' : '01';
				}
				else {
					ret += increase(geMaxReferencePart(parentOfNewBoqItem, isBoqWithStructure(boqMainService)));
				}

				if (isBoqWithStructure(boqMainService)) {
					ret += '.';
				}
				else if (_.isEmpty(_.trim(ret,'0'))) { // Need to repair an overflow?
					ret = ret.split('0').join('Z') + '0'; // Replaces all '0' by 'Z' and adds '0'
				}


				return ret;
			};

			service.handleCreateSucceeded = function(boqMainService, newBoqItem) {
				if (!boqMainService.isOenBoq() || !newBoqItem) {
					return;
				}

				const parentOfNewBoqItem = boqMainService.getBoqItemById(newBoqItem.BoqItemFk);

				if (!isBoqWithStructure(boqMainService) || (newBoqItem.BoqLineTypeFk===boqMainLineTypes.position && parentOfNewBoqItem && parentOfNewBoqItem.BoqLineTypeFk===4)) {
					newBoqItem.IsUnsharedPosition = true;
				}

				boqMainService.fireItemModified(newBoqItem); 
			};

			// Gets the BOQ line type by considering the different values for the top level goup (HG==1, OG==2, LG==3)
			service.getBoqLineType = function(boqMainService, boqLineType, level) {
				if (!boqMainService.isOenBoq()) {
					return boqLineType;
				}

				if (boqLineType!==boqMainLineTypes.position && 1<=level && level<=5) {
					boqLineType = boqMainService.getBoqStructure().BoqStructureDetailEntities[level-1].BoqLineTypeFk;
				}

				return boqLineType;
			};

			// Extends the "new" toolbar items by OENORM specific ones and sets a concrete caption text in dependency of the current 'BoqLineTypeFk'.
			service.updateNewToolCaptions = function(scope, boqMainService) {
				var currentBoqItem = boqMainService.getSelected();
				const captionPerLinetype = [ // array index === 'BoqLineTypeFk'
					'newFolgeposition',
					'newHauptgruppe',
					'newObergruppe',
					'newLeistungsgruppe',
					'newUnterleistungsgruppe',
					'newGrundtext'];

				if (!scope.tools || boqMainService.isCopySource) {
					return;
				}

				function getDivisionCaption(boqMainService, currentBoqItem, isSubdivision) {
					var caption;
					if (!isBoqWithStructure(boqMainService) || currentBoqItem.BoqLineTypeFk===boqMainLineTypes.position || currentBoqItem.BoqLineTypeFk===5 && isSubdivision) {
						caption = '';
					}
					else {
						const topBoqLineType = boqMainService.getBoqStructure().BoqStructureDetailEntities[0].BoqLineTypeFk;
						const index = currentBoqItem.BoqLineTypeFk===boqMainLineTypes.root ? topBoqLineType : currentBoqItem.BoqLineTypeFk + (isSubdivision ? 1 : 0);
						caption = $translate.instant('boq.main.oen.uicontainer.boqStructure.' + captionPerLinetype[index]);
					}

					return caption;
				}

				function getPositionCaption(boqMainService, currentBoqItem) {
					const keyPart = !isBoqWithStructure(boqMainService) || currentBoqItem.IsUnsharedPosition || currentBoqItem.BoqLineTypeFk===4 ? 'newUngeteiltePosition' : 'newFolgeposition';
					return $translate.instant('boq.main.oen.uicontainer.boqStructure.' + keyPart);
				}

				function setCaption(tooId, caption) {
					const tool = _.find(scope.tools.items,{'id':tooId});
					if (tool) {
						tool.caption = caption;
					}
				}

				if (currentBoqItem && boqMainService.getBoqStructure().BoqStructureDetailEntities) {
					setCaption('boqNewByContext', '');
					setCaption('boqInsert',         getPositionCaption(boqMainService, currentBoqItem));
					setCaption('boqNewDivision',    getDivisionCaption(boqMainService, currentBoqItem, false));
					setCaption('boqNewSubdivision', getDivisionCaption(boqMainService, currentBoqItem, true));
				}

				scope.tools.update();
			};

			// #endregion

			// #region Grid and Field manipulations

			function isOenItemTypeNormal(boqItem) {
				return boqItem.BasItemTypeFk===boqMainItemTypes.standard && boqItem.BasItemType2Fk===boqMainItemTypes2.normal;
			}

			/* still unused
			function isOenItemTypeNormalOfVariant(boqItem) {
				return boqItem.BasItemTypeFk===boqMainItemTypes.standard && boqItem.BasItemType2Fk===boqMainItemTypes2.base;
			}

			function isOenItemTypeAlternative(boqItem) {
				return boqItem.BasItemTypeFk===boqMainItemTypes.standard && boqItem.BasItemType2Fk===boqMainItemTypes2.alternative;
			}
			*/

			function isOenItemTypeEventual(boqItem) {
				return boqItem.BasItemTypeFk===boqMainItemTypes.optionalWithoutIT && boqItem.BasItemType2Fk===null;
			}

			service.getReadOnlyFieldsForItem = function(boqMainService, boqItem, readOnlyFields) {
				if (!boqMainService.isOenBoq()) {
					return readOnlyFields;
				}

				const allBoqItemFields = platformSchemaService.getSchemaFromCache({moduleSubModule:'Boq.Main', typeName:'BoqItemDto'}).properties; // The fields from base class which not contains those of 'OenBoqItemDto'
				const boqItemFieldsUsedByOen = ['Reference','Reference2','BasItemTypeFk','BasItemType2Fk','BriefInfo','BasUomFk','Quantity','QuantityAdj','Price','PriceOc','Urb1','Urb1Oc','Urb2','Urb2Oc',
					'ItemTotal','ItemTotalOc','DiscountPercentIt','Discount','DiscountOc','Finalprice','FinalpriceOc','MdcTaxCodeFk'];

				var oenReadOnlyFields = readOnlyFields.slice();

				// All fields of 'BoqItemDto' are read only except those of the list 'boqItemFieldsUsedByOen'
				for (var field in allBoqItemFields) {
					if (!boqItemFieldsUsedByOen.includes(field)) {
						platformRuntimeDataService.hideContent(boqItem, [field], true);
						if (!oenReadOnlyFields.includes(field)) {
							oenReadOnlyFields.push(field);
						}
					}
				}

				// Always generated
				oenReadOnlyFields.push('BoqLineTypeFk');

				// Always calculated
				oenReadOnlyFields = oenReadOnlyFields.concat(['ItemTotal',  'ItemTotalOc', 'ItemTotalUrb1', 'ItemTotalUrb1Oc', 'ItemTotalUrb2', 'ItemTotalUrb2Oc']);
				oenReadOnlyFields = oenReadOnlyFields.concat(['Discount',    'DiscountOc',  'DiscountUrb1',  'DiscountUrb1Oc',  'DiscountUrb2',  'DiscountUrb2Oc']);
				oenReadOnlyFields = oenReadOnlyFields.concat(['Finalprice','FinalpriceOc','FinalpriceUrb1','FinalpriceUrb1Oc','FinalpriceUrb2','FinalpriceUrb2Oc']);

				// Price properties
				oenReadOnlyFields = oenReadOnlyFields.concat(['Price','PriceOc','Urb1','Urb1Oc','Urb2','Urb2Oc','DiscountPercentIt','DiscountPercentItUrb1','DiscountPercentItUrb2']);
				var oenLvHeader = boqMainOenLvHeaderLookupService.getOenLvHeader();
				if (oenLvHeader) {
					platformRuntimeDataService.hideContent(boqItem, ['DiscountPercentIt'], oenLvHeader.IsWithPriceShares);

					if(oenLvHeader.IsAllowedBoqDiscount && boqItem.BoqLineTypeFk===boqMainLineTypes.root ||
						oenLvHeader.IsAllowedHgDiscount  && boqItem.BoqLineTypeFk===1 ||
						oenLvHeader.IsAllowedOgDiscount  && boqItem.BoqLineTypeFk===2 ||
						oenLvHeader.IsAllowedLgDiscount  && boqItem.BoqLineTypeFk===3 ||
						oenLvHeader.IsAllowedUlgDiscount && boqItem.BoqLineTypeFk===4)
					{
						if (oenLvHeader.IsWithPriceShares) {
							_.remove(oenReadOnlyFields, function(field) { return ['DiscountPercentItUrb1','DiscountPercentItUrb2'].includes(field); });
						}
						else {
							_.remove(oenReadOnlyFields, function(field) { return ['DiscountPercentIt'].includes(field); });
						}
					}
					else if (boqItem.BoqLineTypeFk === boqMainLineTypes.position) {
						if (oenLvHeader.IsWithPriceShares) {
							_.remove(oenReadOnlyFields, function(field) { return ['Urb1','Urb1Oc','Urb2','Urb2Oc'].includes(field); });
						}
						else {
							platformRuntimeDataService.hideContent(boqItem,      ['Urb1','Urb1Oc','Urb2','Urb2Oc'], true);
							_.remove(oenReadOnlyFields, function(field) { return ['Price','PriceOc'].includes(field); });
						}
					}

					// According to the OENORM rules is gross only of interest on the root 
					platformRuntimeDataService.hideContent(boqItem, ['FinalgrossOc','Finalgross'], boqItem.BoqLineTypeFk!==boqMainLineTypes.root);
				}

				// 'OenZzFk' and 'OenZzVariantFk'
				if (!boqItem.OenZzFk) {
					oenReadOnlyFields.push('OenZzVariantFk');
				}
				if (isOenItemTypeNormal(boqItem) || isOenItemTypeEventual(boqItem)) {
					oenReadOnlyFields.push('OenZzFk');
					oenReadOnlyFields.push('OenZzVariantFk');
				}

				if (boqItem.BoqLineTypeFk !== boqMainLineTypes.position) {
					_.forEach(['BasItemTypeFk','BasItemType2Fk'], function(field) {
						oenReadOnlyFields.push(field);
						platformRuntimeDataService.hideContent(boqItem, [field], true);
					});
				}

				return oenReadOnlyFields;
			};

			service.propertyChanged = function(changedBoqItem, propertyName) {
				if (!changedBoqItem.IsOenBoq) {
					return;
				}

				switch (propertyName) {
					case 'OenZzFk': { // For the OenZzFk is the primary key for the OenZzvariant entity, changes to the OenZzFk should reset already existing OenZzVariantFk assignment
						changedBoqItem.OenZzVariantFk = null;
					} break;

					// Of the 2 values depend the valid values of 'BasItemTypeFk', 'BasItemType2Fk', 'OenZzFk' and 'OenZzVariantFk'
					case 'BasItemTypeFk': 
					case 'BasItemType2Fk': {
						// Validates 'BasItemType2Fk'
						if (propertyName === 'BasItemTypeFk') {
							if (changedBoqItem.BasItemTypeFk === boqMainItemTypes.standard) {
								if (changedBoqItem.BasItemType2Fk === null) {
									changedBoqItem.BasItemType2Fk = boqMainItemTypes2.normal;
								}
							}
							else {
								changedBoqItem.BasItemType2Fk = null;
							}
						}

						// Validates 'BasItemTypeFk'
						if (propertyName === 'BasItemType2Fk') {
							if (changedBoqItem.BasItemType2Fk === null) {
								if (changedBoqItem.BasItemTypeFk === boqMainItemTypes.standard) {
									changedBoqItem.BasItemTypeFk = boqMainItemTypes.empty;
								}
							}
							else {
								changedBoqItem.BasItemTypeFk = boqMainItemTypes.standard;
							}
						}

						// Validates 'OenZzFk' and 'OenZzVariantFk'
						if (isOenItemTypeNormal(changedBoqItem) || isOenItemTypeEventual(changedBoqItem)) {
							changedBoqItem.OenZzFk        = null;
							changedBoqItem.OenZzVariantFk = null;
						}
					} break;
				}
			};

			service.tryDisableContainer = function(scope, boqMainService, isOenDisabledFunc, isWicDisabledFunc) {
				var info1 = isOenDisabledFunc ? 'boq.main.oenDisabledFunc' : 'boq.main.oenExclusiveFunc';
				var info2 = 'boq.main.oenWicDisabledFunc';

				function tryShowWhiteboard() {
					const boqStructure = boqMainService.getStructure();
					const isWicOenBoq = boqMainService.isOenBoq() && boqMainService.isWicBoq();
					if (boqStructure && boqStructure.BoqStandardFk) {
						if      (boqMainService.isOenBoq() === isOenDisabledFunc)        { scope.getUiAddOns().getWhiteboard().showInfo($translate.instant(info1)); }
						else if (isWicOenBoq && !isOenDisabledFunc && isWicDisabledFunc) { scope.getUiAddOns().getWhiteboard().showInfo($translate.instant(info2)); }
						else                                                             { scope.getUiAddOns().getWhiteboard().setVisible(false); }
					}
				}

				tryShowWhiteboard();
				boqMainService.registerForBoqChanged(scope, tryShowWhiteboard);
			};

			service.buildItemInfo = function(boqItem, itemInfo) {
				var oenLabels = [];

				if (Object.prototype.hasOwnProperty.call(boqItem, 'OenStatusFk')) { // Is it an OENORM BOQ?
					if (boqItem.BoqLineTypeFk === boqMainLineTypes.position) {
						oenLabels.push(boqItem.IsUnsharedPosition ? 'U' : 'F');
					}

					itemInfo = oenLabels.join();
				}

				return itemInfo;
			};

			// #endregion

			// #region Blob specification

			const bloGapTag = 'blo';
			const blGapTag  = 'bl';
			const alGapTag  = 'al';
			const maskTag   = 'textcomplement';
			const kindAttrib     = ' kind';
			const markLblAttrib  = ' marklbl';
			const emptyGapContent  = '<emptygap>.....</emptygap>';

			var unmaskGaps = function() {};

			service.addBlobSpecificationSwitchTool = function(scopeParam, boqMainService, textComplementServiceParam) {
				scope = scopeParam;
				textComplementService = textComplementServiceParam;
				var toolGroup = {};
				const toolInfo = {
					'BasBlobsSpecificationFk': 'tlb-icons ico-oen-specification',
					'BlobsCommentFk':          'tlb-icons ico-oen-comment',
					'BlobsLbChangeFk':         'tlb-icons ico-oen-change-description'
				};
				const toolGroupId = 'oenBlobSpecificationSwitch';

				function getCaptionKey(blobFkFieldName) {
					var currentBoqItem = boqMainService.getSelected();
					if (!currentBoqItem) {
						return;
					}

					var captionOffset = '';
					if      (blobFkFieldName === 'BasBlobsSpecificationFk') { captionOffset = [boqMainLineTypes.position,5].includes(currentBoqItem.BoqLineTypeFk) ? '' : '2'; }
					else if (blobFkFieldName === 'BlobsCommentFk')          { captionOffset = boqMainService.isWicBoq()                                            ? '' : '2'; }

					return 'boq.main.oen.' + blobFkFieldName + captionOffset;
				}

				function setCurrentBlobSpecificationFkFieldName(blobFkFieldName) {
					if (!boqMainService.isOenBoq()) {
						return;
					}

					scope.currentBlobSpecificationFkFieldName = blobFkFieldName;

					toolGroup.caption   = getCaptionKey(blobFkFieldName);
					toolGroup.iconClass = toolInfo[blobFkFieldName];
					if (scope.tools && _.isFunction(scope.tools.update)) {
						scope.tools.update();
					}
				}

				function maskGaps(blobSpecificationText) {
					var gapNumber = 0;
					textComplementService.setList([]);

					if (blobSpecificationText && !blobSpecificationText.includes('<'+maskTag) && scope.currentBlobSpecificationFkFieldName==='BasBlobsSpecificationFk') {
						const htmlElements = new DOMParser().parseFromString(blobSpecificationText, 'text/html').body.childNodes;
						gapNumber = 0;
						blobSpecificationText = '';
						_.forEach(htmlElements, function(htmlElement) {
							if ('p'===htmlElement.localName && _.some(htmlElement.childNodes, function(pChild) { return [bloGapTag,blGapTag,alGapTag].includes(pChild.localName); })) {
								blobSpecificationText += '<p>';
								_.forEach(htmlElement.childNodes, function(pChild) {
									if ([bloGapTag,blGapTag,alGapTag].includes(pChild.localName)) {
										gapNumber++;
										blobSpecificationText += service.createBlobSpecificationGap(pChild.localName, pChild.innerText, gapNumber);
									}
									else {
										blobSpecificationText += pChild.nodeType===1 /* node? */ ? pChild.outerHTML : pChild.nodeValue;
									}
								});
								blobSpecificationText += '</p>';
							}
							else {
								blobSpecificationText += htmlElement.outerHTML;
							}
						});
					}

					return blobSpecificationText;
				}

				unmaskGaps = function(blobSpecificationText) {
					return blobSpecificationText.replaceAll(emptyGapContent,'').replaceAll('</'+maskTag+'>','').replaceAll(/<textcomplement[\s\S]*?>/gi,'');
				};

				function updateSpecification(blobSpecification) {
					if (!blobSpecification) { return; }

					blobSpecification.Content = maskGaps(blobSpecification.Content);
					scope.specification = blobSpecification;
				}

				function onSpecificationSwitched(blobFkFieldName) {
					setCurrentBlobSpecificationFkFieldName(blobFkFieldName);
					updateSpecification({'Content':null, 'Id':0, 'Version':0});

					var currentBoqItem = boqMainService.getSelected();
					if (currentBoqItem && currentBoqItem[blobFkFieldName]) {
						var modifiedBlobSpecification = _.find(boqMainService.getModifiedBlobSpecification(), function(blobSpecification) {
							if (blobFkFieldName === 'BasBlobsSpecificationFk') { return blobSpecification.   BoqItemId===currentBoqItem.Id; }
							else                                               { return blobSpecification.OenBoqItemId===currentBoqItem.Id && blobFkFieldName===blobSpecification.BlobSpecificationFkFieldName; }
						});
						if (modifiedBlobSpecification) {
							updateSpecification(modifiedBlobSpecification.Specification);
						}
						else {
							$http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + currentBoqItem[blobFkFieldName]).then(function(result) {
								updateSpecification(result.data);
							});
						}
					}
				}

				function onBoqChanged() {
					$timeout(function() {
						scope.$broadcast('boq-loaded', boqMainService.isOenBoq());
					}, 1000);

					setCurrentBlobSpecificationFkFieldName('BasBlobsSpecificationFk');
				}
				boqMainService.registerForBoqChanged(scope, onBoqChanged);

				function onCurrentSpecificationChanged(specification) {
					if (!boqMainService.isOenBoq()) { return; }
					if (!scope.specification || !specification || scope.specification.Id!==specification.Id) {
						setCurrentBlobSpecificationFkFieldName('BasBlobsSpecificationFk');
					}
					updateSpecification(specification);
				}
				boqMainService.currentSpecificationChanged.register(onCurrentSpecificationChanged);

				function onCurrentBoqItemChanged() {
					var currentBoqItem = boqMainService.getSelected();

					if (!scope.tools || !currentBoqItem) {
						return;
					}

					function setCaption(toolId) {
						const toolGroup = _.find(scope.tools.items, {'id':toolGroupId});
						if (toolGroup) {
							const tool = _.find(toolGroup.list.items, {'id':toolId});
							if (tool) {
								tool.caption = getCaptionKey(toolId);
							}
						}
					}

					setCaption('BasBlobsSpecificationFk');
					setCaption('BlobsCommentFk');

					scope.tools.update();
				}
				boqMainService.registerSelectionChanged(onCurrentBoqItemChanged);

				function isDisabledBlobsCommentFk() {
					var currentBoqItem = boqMainService.getSelected();
					if (!currentBoqItem) { return true; }
					return !boqMainService.isWicBoq() && currentBoqItem.BoqLineTypeFk===5; // Grundtext?

				}

				function isDisabledBlobsLbChangeFk() {
					var currentBoqItem = boqMainService.getSelected();
					if (!currentBoqItem) { return true; }
					return !boqMainService.isWicBoq() || currentBoqItem.BoqLineTypeFk===5; // Grundtext?
				}

				toolGroup.id        = toolGroupId;
				toolGroup.type      = 'dropdown-btn';
				toolGroup.iconClass = 'tlb-icons ico-oen-specification';
				toolGroup.list      = {items:[]};
				toolGroup.disabled  = function() { return !boqMainService.isOenBoq(); };
				for (var toolInfoProp in toolInfo) {
					toolGroup.list.items.push({
						id:        toolInfoProp,
						type:      'item',
						caption:   'boq.main.oen.' + toolInfoProp,
						iconClass: toolInfo[toolInfoProp],
						fn:        onSpecificationSwitched,
						disabled:  toolInfoProp==='BlobsCommentFk' ? isDisabledBlobsCommentFk : toolInfoProp==='BlobsLbChangeFk' ? isDisabledBlobsLbChangeFk : false
					});
				}

				onBoqChanged();

				scope.$on('$destroy', function() {
					boqMainService.currentSpecificationChanged.unregister(onCurrentSpecificationChanged);
					boqMainService.unregisterSelectionChanged(onCurrentBoqItemChanged);
					setCurrentBlobSpecificationFkFieldName('BasBlobsSpecificationFk'); // A must for the correct update of the toolbar 
				});

				return toolGroup;
			};

			service.createBlobSpecificationGap = function(gapTag, gapContent, gapNumber) {
				if (scope.currentBlobSpecificationFkFieldName !== 'BasBlobsSpecificationFk') {
					return ''; 
				}

				var gap;
				var textComplement;
				var textComplements = _.clone(textComplementService.getList());
				gapNumber = gapNumber || ((!_.some(textComplements) ? 0 : _.maxBy(textComplements,'Id').Id) + 1);

				gap  = '<'+maskTag+kindAttrib+'="'+gapTag+'"'+markLblAttrib+'="'+(gapNumber)+'">';
				gap += '<'+gapTag+'>' + (gapContent || emptyGapContent) + '</'+gapTag+'>';
				gap += '</'+maskTag+'>';

				textComplement = {
					'Id':        gapNumber,
					'Sorting':   gapNumber,
					'ComplType': gapTag,
					'ComplBody': gapContent===emptyGapContent ? '' : gapContent,
				};
				textComplements.push(textComplement);
				textComplementService.setList(textComplements);

				return gap;
			};

			service.replaceBlobSpecificationGap = function(currentBlobSpecification, gapNumber, newGapContent, textComplementHelperService) {
				var blobSpecificationText = currentBlobSpecification.Content;
				var   newTextComplement;
				const oldTextComplement = textComplementHelperService.findTextComplement(blobSpecificationText, gapNumber);
				const htmlElements = new DOMParser().parseFromString(oldTextComplement, 'text/html').body.childNodes;

				if (htmlElements && htmlElements.length===1) {
					const gapHtmlNode = htmlElements[0].childNodes[0];
					const oldGap = gapHtmlNode.outerHTML;
					var   newGap = '<'+gapHtmlNode.localName+'>' + (newGapContent || emptyGapContent) +  '</'+gapHtmlNode.localName+'>';

					newTextComplement                = oldTextComplement.    replace(oldGap,            newGap);
					currentBlobSpecification.Content = blobSpecificationText.replace(oldTextComplement, newTextComplement);
				}
			};

			service.setModifiedBlobSpecification = function(boqMainService) {
				if (!(boqMainService.isOenBoq() && scope.specification && scope.specification.Content)) {
					return;
				}

				function getModifiedBlobSpecifications(completeBoq) {
					var blobsComment, blobsLbChange;
					var modifiedSpecifications = boqMainService.getModifiedBlobSpecification();

					if (completeBoq.BoqItem) {
						blobsComment  = _.find(modifiedSpecifications, {'OenBoqItemId':completeBoq.BoqItem.Id, 'BlobSpecificationFkFieldName':'BlobsCommentFk'});
						blobsLbChange = _.find(modifiedSpecifications, {'OenBoqItemId':completeBoq.BoqItem.Id, 'BlobSpecificationFkFieldName':'BlobsLbChangeFk'});
					}

					// The deep clone is necesary to prevent a refresh of the editor (which has a binding to property 'Content') when function 'unmaskGaps' is called
					if (blobsComment)  { completeBoq.OenExtension.BlobsCommentToSave  = _.cloneDeep(blobsComment. Specification); }
					if (blobsLbChange) { completeBoq.OenExtension.BlobsLbChangeToSave = _.cloneDeep(blobsLbChange.Specification); }
					completeBoq.BlobToSave = _.cloneDeep(completeBoq.BlobToSave);

					_.forEach([completeBoq.BlobToSave, completeBoq.OenExtension.BlobsCommentToSave, completeBoq.OenExtension.BlobsCommentToSave], function(blobToSave) {
						if (blobToSave) {
							blobToSave.Content = unmaskGaps(blobToSave.Content);
						}
					});

					// Only transient in OENORM
					delete completeBoq.BoqTextComplementToSave;
					delete completeBoq.BoqTextComplementToDelete;
				}

				if (!boqMainService.getModifiedOenBlobSpecifications) {
					boqMainService.getModifiedOenBlobSpecifications = getModifiedBlobSpecifications;
				}

				if (scope.currentBlobSpecificationFkFieldName === 'BasBlobsSpecificationFk') {
					boqMainService.setSpecificationAsModified(scope.specification);
				}
				else {
					var blobSpecification;
					var currentBoqItem         = boqMainService.getSelected();
					var modifiedSpecifications = boqMainService.getModifiedBlobSpecification();
					var blobSpecificationKey   = {'OenBoqItemId':currentBoqItem.Id, 'BlobSpecificationFkFieldName':scope.currentBlobSpecificationFkFieldName};

					_.remove(modifiedSpecifications, blobSpecificationKey);

					blobSpecification = _.clone(blobSpecificationKey);
					blobSpecification.Specification = scope.specification;
					modifiedSpecifications.push(blobSpecification);

					boqMainService.markItemAsModified(currentBoqItem); // enables the saving
				}
			};

			service.isBlobSpecificationEditable = function(boqMainService) {
				var currentBoqItem = boqMainService.getSelected();
				if (!currentBoqItem || !boqMainService.isOenBoq()) {
					return false;
				}

				var ret = true;

				if (!boqMainService.isWicBoq() && [boqMainLineTypes.root,1].includes(currentBoqItem.BoqLineTypeFk)) { // root or HG?
					ret = false;
				}

				return ret;
			};

			service.isTextcomplementFieldEditable = function(field) {
				return field==='ComplBody';
			};

			// #endregion
			
			// #region Copy&Paste

			service.adjustPastedAndSelectedItem = function adjustPastedAndSelectedItem(readjustedItems, selectedItem, pastedItem, sourceBoqMainService/* , targetBoqMainService */) {
				// The sole purpose here is to make sure the pastedItem is a socalled LG item that can be pasted on a target HG item.
				// So starting from the given selected item we determine the next LG item in the parent chain (if neccessary at all).

				if(_.isObject(pastedItem)) {
					if(service.isLG(pastedItem)) {
						// Here we already have an LG item
						// -> leave without changing the inital readjustedItems;
						return readjustedItems;
					}
					else if(pastedItem.BoqLineTypeFk > 3 || pastedItem.BoqLineTypeFk === boqMainLineTypes.position) {
						// Here we search the parent chain for an LG item
						let clonedParentChain = [];
						let headOfParentChain = sourceBoqMainService.getParentChainOf(pastedItem, clonedParentChain, true);
						// Determine LG item in parent chain
						headOfParentChain = _.find(clonedParentChain, function(item) {
							return service.isLG(item);
						});

						if(service.isLG(headOfParentChain)) {
							readjustedItems.pastedItem = headOfParentChain;
						}
					}
				}

				return readjustedItems;
			};

			service.canPaste = function canPaste(selectedItem, pastedItem, boqStructure) {
				var canPaste = true;
				var sourceLevel = pastedItem.BoqLineTypeFk;
				var boqStructureId = boqStructure.Id;
				var targetLevel = 0;

				// First check for general impossible combination, i.e. items that don't exist in target boq definition or cannot be pasted there
				switch(boqStructureId) {
					case boqMainOenBoqStructure.OenormHG:
						canPaste = !(pastedItem.BoqLineTypeFk === boqMainLineTypes.root);
						break;
					case boqMainOenBoqStructure.OenormOG:
						canPaste =  !(pastedItem.BoqLineTypeFk === boqMainLineTypes.root) ||
										!service.isHG(pastedItem);
						break;
					case boqMainOenBoqStructure.OenormLG:
						canPaste =  !(pastedItem.BoqLineTypeFk === boqMainLineTypes.root) ||
										!service.isHG(pastedItem) ||
										!service.isOG(pastedItem);
						break;
					case boqMainOenBoqStructure.OenormWithoutStructure:
						canPaste = false;
						break;
				}

				if(!canPaste || selectedItem.BoqLineTypeFk === boqMainLineTypes.position) {
					return false;
				}

				if (selectedItem.BoqLineTypeFk === boqMainLineTypes.root) {
					switch(boqStructureId) {
						case boqMainOenBoqStructure.OenormHG:
							targetLevel = 0;
							break;
						case boqMainOenBoqStructure.OenormOG:
							targetLevel = 1;
							break;
						case boqMainOenBoqStructure.OenormLG:
							targetLevel = 2;
							break;
						case boqMainOenBoqStructure.OenormWithoutStructure:
							break;
					}
				}
				else {
					targetLevel = selectedItem.BoqLineTypeFk;
				}

				if (sourceLevel - targetLevel !== 1) {
					canPaste = false;
				}

				return canPaste;
			};

			// #endregion

			return service;
		}
	]);

	/**
	 * This constant describes the four different OENORM strcuture definitions
	 */
	angularModule.value('boqMainOenBoqStructure', {
		OenormLG: 191,
		OenormOG: 192,
		OenormHG: 193,
		OenormWithoutStructure: 194
	});

	angularModule.factory('boqMainOenBoqStructureService', ['$http',
		function ($http) {
			var service = {};
			var boqStructures = [];

			service.loadData = function() {
				return $http.post(globals.webApiBaseUrl + 'boq/main/oen/boqstructures').then(function(result) {
					boqStructures = result.data;
				});
			};

			service.getList = function() {
				return boqStructures;
			};

			return service;
		}
	]);

})();
