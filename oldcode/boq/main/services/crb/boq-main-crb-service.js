(function () {
	/* global globals, Platform, _ */
	'use strict';

	var angularModule = angular.module('boq.main');
	var crbBaseRoute;

	angularModule.value('crbBoqPositionTypes', {
		closed: 1,    // Closed position (Geschlossene Position)
		open: 2,      // Open position (Offene Position)
		repeat: 3,    // Repeat position (Wiederholungsposition)
		individual: 4 // Individual position (Individuelle Position (Reserve))
	});

	angularModule.value('crbDocumentTypes', {
		A: 'A', // Musterleistungsverzeichnis
		B: 'B', // Ausschreibung (Basis für Angebot)
		C: 'C', // Angebot
		D: 'D', // Vertrag/Nachtrag
		I: 'I'  // Ausmass
	});

	/**
	 * @ngdoc boqMainCrbService
	 * @name
	 * @function
	 * @description
	 */
	angularModule.factory('boqMainCrbService', ['_', 'math', '$rootScope', '$http', '$injector', '$translate', 'platformRuntimeDataService', 'platformGridAPI', 'platformDialogService', 'platformLongTextDialogService', 'boqMainLineTypes', 'crbBoqPositionTypes',
		function(_, math, $rootScope, $http, $injector, $translate, platformRuntimeDataService, platformGridAPI, platformDialogService, platformLongTextDialogService, boqMainLineTypes, crbBoqPositionTypes) {
			var service = {};
			var isUsingFullLicence = true;

			crbBaseRoute = globals.webApiBaseUrl + 'boq/main/crb/';

			// #region BOQ item creation/deletion

			function getBoqReferenceRangePerLineType(boqLineType) {
				return boqLineType===1 ? [0,3] : boqLineType===boqMainLineTypes.crbSubQuantity ? [12,3] : [boqLineType===boqMainLineTypes.position ? 10 : boqLineType>4 ? boqLineType+3 : boqLineType+2, 1];
			}

			function generateBoqReferenceCore(newParentBoqItem, currentBoqItem, newBoqLineType) {
				var boqReferenceRangePerLineType = getBoqReferenceRangePerLineType(newBoqLineType);
				var incrStartIndex = boqReferenceRangePerLineType[0];
				var incrRange      = boqReferenceRangePerLineType[1];
				var boqReference;
				var boqItemSiblings;
				var maxBoqReferenceEnd;

				switch (newBoqLineType) {
					case 1:                               maxBoqReferenceEnd = '999.'; break;
					case 2:                               maxBoqReferenceEnd = '900.'; break;
					case 3:                               maxBoqReferenceEnd =  '90.'; break;
					case 4:                               maxBoqReferenceEnd =   '9.'; break;
					case 5:                               maxBoqReferenceEnd = '900';  break;
					case 6:                               maxBoqReferenceEnd =  '90';  break;
					case boqMainLineTypes.position:       maxBoqReferenceEnd =   '9';  break;
					case boqMainLineTypes.crbSubQuantity: maxBoqReferenceEnd = '999';  break;
				}

				if (!newParentBoqItem || _.endsWith(currentBoqItem.Reference, maxBoqReferenceEnd)) {
					return null;
				}

				function increment(str) {
					var boqRefPartToIncr;

					function getIncrement() {
						return str.substring(0, incrStartIndex) + boqRefPartToIncr + str.substring(incrStartIndex + incrRange);
					}

					boqRefPartToIncr = (parseInt(str.substring(incrStartIndex, incrStartIndex+incrRange)) + 1).toString().padStart(incrRange,'0');
					if (newBoqLineType===1 && _.startsWith(boqRefPartToIncr, '8')) { boqRefPartToIncr = '900'; }                                            // "Kapitel" may not start with "8"
					if (newBoqLineType===1 && _.endsWith(  boqRefPartToIncr, '0')) { boqRefPartToIncr = increment(boqRefPartToIncr); }                      // "Kapitel" may not end with "0"
					if (!isIndividualPosition(getIncrement()) && str.length<12)    { boqRefPartToIncr = boqRefPartToIncr.substring(0, incrRange-1) + '9'; } // not a subQuantity too?

					return getIncrement();
				}

				boqItemSiblings = _.filter(newParentBoqItem.BoqItems, {BoqLineTypeFk:newBoqLineType});
				boqReference = ([boqMainLineTypes.position,6].includes(newBoqLineType)) ? newParentBoqItem.Reference.padEnd(11,'0') : newParentBoqItem.Reference;
				if (newParentBoqItem.BoqLineTypeFk === boqMainLineTypes.root) {
					boqReference = '109.';
				}
				else if (newBoqLineType === 2) {
					boqReference += '100.';
				} 
				else if (newBoqLineType === 5) { // an individual position here must have an individual position as parent
					boqReference += isIndividualPosition(boqReference) ? '100' : '900';
				}
				else if (newBoqLineType===6 && newParentBoqItem.BoqLineTypeFk!==5) { // a new VB-Unterpositions-Untergruppe
					boqReference = boqReference.substring(0,8) + '090';
				}
				else if (newBoqLineType === boqMainLineTypes.crbSubQuantity) {
					boqReference += '.001';
				}
				else {
					boqReference = increment(boqReference);
				}

				while ((currentBoqItem.BoqLineTypeFk!==boqMainLineTypes.root && boqReference<=currentBoqItem.Reference || _.some(boqItemSiblings, {Reference:boqReference})) &&
					!_.endsWith(boqReference, maxBoqReferenceEnd))
				{
					boqReference = increment(boqReference);
				}

				if (_.some(boqItemSiblings, {Reference:boqReference})) {
					boqReference = null;
				}

				return service.isValidBoqReference(boqReference, newBoqLineType, newParentBoqItem) ? boqReference : null;
			}

			function trimBoqReferenceCore(boqReference, boqLineType) {
				var boqReferenceRangePerLineType = getBoqReferenceRangePerLineType(boqLineType);
				return boqReference.substring(0, boqReferenceRangePerLineType[0] + boqReferenceRangePerLineType[1]);
			}

			function isIndividualPosition(boqReference, boqLineTypeFk) {
				if (!_.isString(boqReference) || boqReference.length>12 /* subQauntity? */ || boqLineTypeFk===boqMainLineTypes.root) {
					return false;
				}

				boqReference = boqReference.padEnd(11, ' ');
				return (boqReference.substr(0,4) + boqReference.substr(5,5)).includes('9');  // Anywhere a '9' except on levels "Abschnitt" and "Unterposition".
			}

			// Returns 'null' if there are more or less than exactly 1 chapter BOQ item.
			service.getSingleChapter = function(boqMainService) {
				var ret = null;
				var chapters = boqMainService.getRootBoqItem().BoqItems;

				if (Boolean(chapters) && chapters.length===1) {
					ret = chapters[0];
				}

				return ret;
			};

			function getNewParentIfCanCreate(boqMainService, currentBoqItem, newBoqLineType) {
				// There only can be 1 chapter and it must be an individual chapter. It is assumed that only individual positions can be created.
				function canCreateNpkBoqItem() {
					var ret = false;

					if (newBoqLineType === 1) {
						ret = boqMainService.getList().length===1;
					}
					else {
						var singleChapter = service.getSingleChapter(boqMainService);
						ret = Boolean(singleChapter && isIndividualPosition(singleChapter.Reference));
					}

					return ret;
				}

				var ret = null;
				if (isUsingFullLicence && currentBoqItem && boqMainService.isCrbBoq() && (!boqMainService.isCrbNpk() || canCreateNpkBoqItem())) {
					ret = currentBoqItem.BoqLineTypeFk===newBoqLineType ? boqMainService.getBoqItemById(currentBoqItem.BoqItemFk) : currentBoqItem;
				}

				return ret;
			}

			service.isIndividualPosition = function(boqMainService, boqItem) {
				return boqMainService.isCrbBoq() && boqItem && isIndividualPosition(boqItem.Reference);
			};

			/**
			 * @ngdoc function
			 * @description Generates a BOQ reference for an individual position based on the incoming parent by incrementing.
			 * @returns {String} generated BOQ reference
			 */
			service.generateBoqReference = function(parentBoqItem, currentBoqItem, newBoqLineType) {
				return generateBoqReferenceCore(parentBoqItem, currentBoqItem, newBoqLineType);
			};

			service.getBoqLineType = function(boqMainService, boqLineType, level, isCrbPreliminary) {
				// BOQ groups cannot be skipped in the default (GAEB) implementation, therefor the incoming 'boqLineType' might be incorrect.
				if (boqMainService.isCrbBoq() && !isCrbPreliminary && ![boqMainLineTypes.position,boqMainLineTypes.crbSubQuantity].includes(boqLineType) && 1<=level && level<=6) {
					boqLineType = boqMainService.getBoqStructure().BoqStructureDetailEntities[level-1].BoqLineTypeFk;
				}

				return boqLineType;
			};

			/**
			 * @ngdoc function
			 * @description Trims the BOQ reference of the incoming BOQ item by removing trailing characters which are not significant for the structure level the BOQ item belongs to.
			 * @param {String} boqItem to be trimmed
			 * @returns {String} trimmed BOQ reference
			 */
			service.trimBoqReference = function trimBoqReference(boqItem) {
				if (!_.isObject(boqItem)) {
					return null;
				}
				return trimBoqReferenceCore(boqItem.Reference, boqItem.BoqLineTypeFk);
			};

			/**
			 * @ngdoc function
			 * @description isValidBoqReference
			 * @returns {Boolean}
			 */
			service.isValidBoqReference = function isValidBoqReference(boqReference, boqLineType, boqParentItem) {
				if (boqLineType === boqMainLineTypes.crbSubQuantity) { return true; }

				var ret;
				var regexPerLinetype = [ // array index === 'BoqLineTypeFk'
					/\.\d{3}0{0}\.\d{2}[1-9]/,
					/\./,
					/\.\d{1}0{2}\./,
					/\.\d{2}0{1}\./,
					/\.\d{3}0{0}\./,
					/\.\d{3}0{0}\.\d{1}0{2}/,
					/\.\d{3}0{0}\.\d{2}0{1}/
				];

				ret = new RegExp('^\\d{2}[1-9]' + regexPerLinetype[boqLineType].source + '$').test(boqReference); // general check of the 'Reference'

				if (ret) {
					ret = isIndividualPosition(boqReference, boqLineType);
				}

				// Checks against the parent
				if (ret && boqLineType!==1) {
					ret = _.startsWith(trimBoqReferenceCore(boqReference, boqLineType), service.trimBoqReference(boqParentItem));
					if (ret && boqLineType===boqMainLineTypes.position && boqParentItem.BoqLineTypeFk!==6) {
						ret = boqParentItem.BoqLineTypeFk===4 && boqReference.substr(8,2)==='00' || boqParentItem.BoqLineTypeFk===5 && boqReference.substr(9,1)==='0';
					}
				}

				if (ret && boqLineType===0 && boqParentItem) {
					boqReference = boqReference.padEnd(11, ' ');
					ret = isIndividualPosition(boqParentItem.Reference) &&  // parent of a "Unterposition" must be an individual position (probably wrong, but in this way an individual position can not be part of the range of repeat positions)
						boqReference.substr(1,1)!=='0' && boqReference.substr(4,1)!=='0'; // "Unterposition" cannot be part of "Abschnitt" 0 or Kapitel X0X
				}

				return ret;
			};

			/**
			 * @ngdoc function
			 * @description Checks if a new BOQ item (only individual position) can be created based on the incoming parameters.
			 * @returns {Boolean}
			 */
			service.canCreateNewPreliminary = function(boqMainService, currentBoqItem, newBoqLineType) {
				var newParentBoqItem;
				var ret;

				newParentBoqItem = getNewParentIfCanCreate(boqMainService, currentBoqItem, newBoqLineType);
				if (!newParentBoqItem) {
					return false;
				}

				ret = [2,3,4].includes(currentBoqItem.BoqLineTypeFk) || currentBoqItem.BoqLineTypeFk===5 && newParentBoqItem.IsPreliminary;
				if (ret) {
					ret = generateBoqReferenceCore(newParentBoqItem, currentBoqItem, newBoqLineType);
				}

				return ret;
			};

			service.canCreateNewSiblingDivision = function(boqMainService, currentBoqItem) {
				if (currentBoqItem === null) { return false; }
				var ret;
				const newBoqLineType = currentBoqItem.BoqLineTypeFk;

				var newParentBoqItem = getNewParentIfCanCreate(boqMainService, currentBoqItem, newBoqLineType);
				if (!newParentBoqItem) {
					return false;
				}

				ret = 1<=currentBoqItem.BoqLineTypeFk && currentBoqItem.BoqLineTypeFk<=6 && !newParentBoqItem.IsPreliminary; // a new sub item of a preliminary must be a preliminary
				if (ret) {
					ret = generateBoqReferenceCore(newParentBoqItem, currentBoqItem, newBoqLineType);
				}

				return ret;
			};

			service.canCreateNewSubDivision = function(boqMainService, currentBoqItem) {
				if (currentBoqItem === null) { return false; }
				var ret;
				const newBoqLineType = currentBoqItem.BoqLineTypeFk===boqMainLineTypes.root ? 1 : currentBoqItem.BoqLineTypeFk+1;

				var newParentBoqItem = getNewParentIfCanCreate(boqMainService, currentBoqItem, newBoqLineType);
				if (!newParentBoqItem) {
					return false;
				}

				ret = (currentBoqItem.BoqLineTypeFk===boqMainLineTypes.root || 1<=currentBoqItem.BoqLineTypeFk && currentBoqItem.BoqLineTypeFk<6) && !newParentBoqItem.IsPreliminary; // a new sub item of a preliminary must be a preliminary
				if (ret) {
					ret = generateBoqReferenceCore(newParentBoqItem, currentBoqItem, newBoqLineType);
				}

				return ret;
			};

			service.canCreateNewPosition = function(boqMainService, currentBoqItem) {
				var ret;
				const newBoqLineType = boqMainLineTypes.position;

				var newParentBoqItem = getNewParentIfCanCreate(boqMainService, currentBoqItem, newBoqLineType);
				if (!newParentBoqItem) {
					return false;
				}

				// Checks if the incoming 'checkedBoqItem' or anyone in the path to the root is a "Hauptposition".
				function hasMainPosition(checkedBoqItem) {
					while (checkedBoqItem && checkedBoqItem.BoqLineTypeFk!==4) {
						checkedBoqItem = boqMainService.getBoqItemById(checkedBoqItem.BoqItemFk);
					}

					return checkedBoqItem && checkedBoqItem.BoqLineTypeFk===4;
				}

				// a new "Unterposition" must have its "Hauptposition" and a new sub item of a preliminary must be a preliminary
				ret = [boqMainLineTypes.position,4,5,6].includes(currentBoqItem.BoqLineTypeFk) && hasMainPosition(currentBoqItem) && !newParentBoqItem.IsPreliminary;
				if (ret) {
					ret = generateBoqReferenceCore(newParentBoqItem, currentBoqItem, newBoqLineType);
				}

				return ret;
			};

			service.canCreateNewSubQuantity = function(boqMainService, currentBoqItem) {
				var ret;
				const newBoqLineType = boqMainLineTypes.crbSubQuantity;

				var newParentBoqItem = getNewParentIfCanCreate(boqMainService, currentBoqItem, newBoqLineType);
				if (!newParentBoqItem || boqMainService.isCrbNpk()) {
					return false;
				}

				ret = [boqMainLineTypes.position,boqMainLineTypes.crbSubQuantity].includes(currentBoqItem.BoqLineTypeFk) && !newParentBoqItem.IsPreliminary; // a new sub item of a preliminary must be a preliminary
				if (ret) {
					ret = generateBoqReferenceCore(newParentBoqItem, currentBoqItem, newBoqLineType);
				}
				
				return ret;
			};

			service.createNewSubQuantity = function(boqMainService, currentBoqItem) {
				var newParentBoqItem = getNewParentIfCanCreate(boqMainService, currentBoqItem, boqMainLineTypes.crbSubQuantity);
				if (!newParentBoqItem) {
					return false;
				}

				boqMainService.createNewBoqItem(newParentBoqItem.Id, currentBoqItem, boqMainLineTypes.crbSubQuantity);
			};

			/**
			 * @ngdoc function
			 * @name filterDeletedBoqItems
			 * @returns {Array}
			 */
			service.filterDeletedBoqItems = function filterDeletedBoqItems(boqMainService, deletedBoqItems) {
				return _.filter(deletedBoqItems, function (boqItem) {
					return service.canDeleteBoqItem(boqMainService, boqItem);
				});
			};

			/**
			 * @ngdoc function
			 * @name canDeleteBoqItem
			 * @returns {Boolean}
			 */
			service.canDeleteBoqItem = function canDeleteBoqItem(boqMainService, currentBoqItem) {
				return isUsingFullLicence
					&&
					(!boqMainService.isCrbNpk() || isIndividualPosition(currentBoqItem.Reference))
					&&
					(!(currentBoqItem.BoqLineTypeFk===2 && currentBoqItem.Reference.endsWith('000.') ||
						currentBoqItem.BoqLineTypeFk===5 && currentBoqItem.Reference.endsWith('000.200')));
			};

			/**
			 * @ngdoc function
			 * @description canPaste
			 * @returns {Boolean}
			 */
			service.canPaste = function canPaste(boqMainService) {
				return isUsingFullLicence && !boqMainService.isCrbNpk();
			};

			// #endregion

			// #region Grid manipulations

			service.setIsUsingFullLicence = function(boqMainService, isUsing) {
				if (boqMainService.isCrbBoq()) {
					isUsingFullLicence = isUsing;
				}
			};

			service.isUsingFullLicence = function() {
				return isUsingFullLicence;
			};

			/**
				* @ngdoc function
				* @name tryDisableContainer
				* @function
				* @methodOf boqMainServiceFactory
				* @description Register given function with events indicating that the loaded boq has changed
				* @param {Object} scope of container to be disabled
				* @param {Boolean} isCrbDisabledFunc for cases the related container is disabled for a CRB boq
				*/
			service.tryDisableContainer = function(scope, boqMainService, isCrbDisabledFunc) {
				var info = isCrbDisabledFunc ? 'boq.main.crbDisabledFunc' : 'boq.main.crbExclusiveFunc';

				function tryShowWhiteboard() {
					var boqStructure = boqMainService.getStructure();
					if (boqStructure && boqStructure.BoqStandardFk) {
						if (boqMainService.isCrbBoq() === isCrbDisabledFunc) { scope.getUiAddOns().getWhiteboard().showInfo($translate.instant(info)); }
						else                                                 { scope.getUiAddOns().getWhiteboard().setVisible(false); }
					}
				}

				tryShowWhiteboard();
				boqMainService.registerForBoqChanged(scope, tryShowWhiteboard);
			};

			service.buildItemInfo = function(boqItem, itemInfo) {
				var crbLabels = [];

				if (Object.prototype.hasOwnProperty.call(boqItem, 'EcoDevisMark')) { // Is it a CRB BOQ?
					if (boqItem.PositionType === crbBoqPositionTypes.open) {
						crbLabels.push('O');
					}
					else if (boqItem.PositionType === crbBoqPositionTypes.repeat) {
						crbLabels.push('W');
					}
					else if (boqItem.PositionType === crbBoqPositionTypes.individual) {
						crbLabels.push('R');
					}
					if (boqItem.IsPreliminary) {
						crbLabels.push('VB');
					}
					if (boqItem.DrawingId) {
						crbLabels.push('D');
					}
					if (boqItem.PrdProductFk) {
						crbLabels.push('P');
					}
					else if (boqItem.PrdMark) {
						crbLabels.push(boqItem.PrdMark);
					}
					if (boqItem.RevisionInfoMark) {
						crbLabels.push(boqItem.RevisionInfoMark);
					}
					if (boqItem.EcoDevisMark) {
						crbLabels.push(boqItem.EcoDevisMark);
					}

					if (_.some(crbLabels)) {
						if (!_.isEmpty(itemInfo)) {
							itemInfo += ', ';
						}
						itemInfo += crbLabels.join();
					}
				}

				return itemInfo;
			};

			// #endregion

			// #region Context data
			function initRevisioninfoTools(scope, boqMainService) {
				var baseRoute = crbBaseRoute + 'revisioninfo/';

				function getBoqChapter() {
					return _.find(boqMainService.getList(), {'BoqLineTypeFk': boqMainLineTypes.level1});
				}

				function getQueryPart(isForChapter) {
					var boqItem = boqMainService.getSelected();
					var boqChapter = getBoqChapter();
					return (isForChapter ? '?chapterReference=' + boqChapter.Reference : '?boqItemReference=' + boqItem.Reference) + '&version=' + boqChapter.Reference2 + '&stand=' + boqChapter.Stand;
				}

				function setRevisionInfoMarks() {
					var rootBoqItem;

					$http.get(baseRoute + 'contextdatapositionsforchapter' + getQueryPart(true)).then(function(response) {
						var hasRevisionInfo = _.isArray(response.data) && _.some(response.data);
						if (hasRevisionInfo && _.isObject(rootBoqItem = boqMainService.getRootBoqItem())) {
							rootBoqItem.RevisionInfoMark = '!';
							boqMainService.gridRefresh();
						}
						platformDialogService.showInfoBox('boq.main.' + (hasRevisionInfo ? 'crbRevisioninfoMarksUpdated' : 'crbRevisioninfoMarksUnavailable'));
					});
				}

				function showRevisionDetails() {
					var revisionDetails;

					$http.get(baseRoute + 'revisiondetailsforposition' + getQueryPart(true)).then(function(response) {
						if ((revisionDetails = response.data) === null) {
							platformDialogService.showInfoBox('boq.main.crbRevisioninfoMarksUnavailable');
						} else {
							platformLongTextDialogService.showDialog({
								headerText$tr$: 'boq.main.crbRevisioninfo',
								codeMode: true,
								hidePager: true,
								dataSource: new function () {
									var detailText = '';
									_.forEach(revisionDetails, function (detail) {
										detailText += getBoqChapter().Reference + detail.referencPart + '\n' +
											$translate.instant('boq.main.crbRevisionError') + ':\n' + detail.shortDescription + '\n';
										if (!_.isEmpty(detail.note)) {
											detailText += $translate.instant('boq.main.crbRevisionReplacement') + ':\n' + detail.note;
										}
										detailText += '\n\n';
									});
									platformLongTextDialogService.LongTextDataSource.call(this);
									this.current = detailText;
								}
							});
						}
					});
				}

				function showRevisioninfoFiles() {
					$http.get(baseRoute + 'contextfilemetadataforposition' + getQueryPart()).then(function(response) {
						if (_.some(response.data)) {
							_.forEach(response.data, function (file) {
								var link = angular.element(document.querySelectorAll('#downloadLink'));
								link[0].href = file.Uri;
								link[0].download = file.Name;
								link[0].type = 'application/octet-stream';
								link[0].click();
							});
						} else {
							platformDialogService.showInfoBox('boq.main.crbRevisioninfoFilesUnavailable');
						}
					});
				}

				function showRevisioninfoLinks() {
					$http.get(baseRoute + 'contextdatalinksforposition' + getQueryPart()).then(function(response) {
						if (!_.some(response.data)) {
							platformDialogService.showInfoBox('boq.main.crbRevisioninfoLinksUnavailable');
						} else {
							_.forEach(response.data, function(link) {
								window.open(link.link);
							});
						}
					});
				}

				function updateTools() {
					var group = {};
					var groupId = 'crbRevisioninfo';

					if (!_.isObject(scope.tools)) {
						return;
					}

					function addItem(item) {
						item.type = 'item';
						item.caption = 'boq.main.' + item.id;
						group.list.items.push(item);
					}

					if (boqMainService.isCopySource && boqMainService.isWicBoq() && boqMainService.isCrbBoq()) {
						if (!_.find(scope.tools.items, {id: groupId})) {
							group.id = groupId;
							group.caption = 'boq.main.' + groupId;
							group.iconClass = 'tlb-icons ico-crb-correction';
							group.type = 'dropdown-btn';
							group.list = {items: []};

							addItem({id: 'crbRevisioninfoMark', fn: setRevisionInfoMarks});
							addItem({id: 'crbRevisionDetails', fn: showRevisionDetails});
							addItem({id: 'crbRevisioninfoFiles', fn: showRevisioninfoFiles});
							addItem({id: 'crbRevisioninfoLinks', fn: showRevisioninfoLinks});

							scope.tools.items.splice(0, 0, group);
							scope.tools.update();
						}
					}
					else if (_.some(_.remove(scope.tools.items, {'id': groupId}))) {
						scope.tools.update();
					}
				}

				boqMainService.registerForBoqChanged(scope, updateTools);
			}

			function initEcodevisTools(scope, boqMainService) {
				var baseRoute = crbBaseRoute + 'ecodevis/';

				function isDisabled() {
					var boqItem = boqMainService.getSelected();
					return !_.isObject(boqItem) || boqItem.BoqLineTypeFk === boqMainLineTypes.root;
				}

				function getQueryPart(isForChapter) {
					var boqItem = boqMainService.getSelected();
					var boqChapter = _.find(boqMainService.getList(), {'BoqLineTypeFk': boqMainLineTypes.level1});
					var commaSeparatedVariables = [];

					if (boqItem && boqItem.EcoDevisInfos) {
						_.forEach(boqItem.EcoDevisInfos, function (ecoDevisInfo) {
							commaSeparatedVariables.push(ecoDevisInfo.getVariableNumber());
						});
					}

					return (isForChapter ? '?chapterReference=' + boqChapter.Reference : ('?boqItemReference=' + boqItem.Reference + '&commaSeparatedVariables=' + commaSeparatedVariables.join(','))) + '&version=' + boqChapter.Reference2 + '&stand=' + boqChapter.Stand;
				}

				function getGridColumns() {
					var columns = [];

					columns.push({field: 'Reference'});
					columns.push({field: 'EcoDevisMark'});
					columns.push({field: 'Graue_Energie'});
					columns.push({field: 'Loesemittelemission'});
					columns.push({field: 'Umwelt_und_gesundheitsrelevante_Bestandteile'});
					columns.push({field: 'Emissionen_aus_Schwermetallen'});
					columns.push({field: 'Formaldehydemissionen'});
					columns.push({field: 'Biozide'});
					columns.push({field: 'Emissionsstandard'});
					columns.push({field: 'Entsorgung'});

					_.forEach(columns, function (column) {
						column.id = column.field;

						switch (column.field) {
							case 'Reference':
								column.name = $translate.instant('boq.main.Reference');
								column.width = 130;
								break;
							case 'EcoDevisMark':
								column.name = $translate.instant('boq.main.crbEcodevisMark1');
								column.width = 30;
								break;
							default:
								column.name = $translate.instant('boq.main.crbEcodevis' + column.field);
								column.width = 90;
								break;
						}
					});

					return columns;
				}

				function getRatingGridRows(gridColumns, rating, hasEmptyRows) {
					function getPropValue(propName) {
						const ratingProperty = _.find(rating, function(ratingProp) { return ratingProp[0]===propName; });
						return ratingProperty ? ratingProperty[1] : '';
					}

					var rows;
					var id = 0;
					var rowActual = {};
					var rowTargetE = {};
					var rowTargete = {};
					var currentBoqItem = boqMainService.getSelected();

					if (rating === null) {
						return [];
					}

					_.forEach(gridColumns, function (column) {
						// "Bemerkungen": "Vergleich f�r R-Wert 5.0 m2K/W",
						// "Material": "Verbundplatte 3-schichtig mit Steinwolle",
						// "Funktionseinheit": "W�rmed�mmung Decke",

						if (column.field === 'EcoDevisMark') {
							rowActual.EcoDevisMark = currentBoqItem.EcoDevisMark;
							rowTargetE.EcoDevisMark = 'E';
							rowTargete.EcoDevisMark = 'e';
						} else if (column.field === 'Reference') {
							rowActual. Reference = currentBoqItem.Reference;
							rowTargetE.Reference = $translate.instant('boq.main.crbEcodevisProE');
							rowTargete.Reference = $translate.instant('boq.main.crbEcodevisProe');
						} else {
							rowActual [column.field] = getPropValue('IST_'    + column.field);
							rowTargetE[column.field] = getPropValue('E_SOLL_' + column.field);
							rowTargete[column.field] = getPropValue('e_SOLL_' + column.field);
						}
					});

					rows = [rowTargetE, rowTargete, rowActual];
					if (hasEmptyRows) {
						rows.splice(2, 0, {});
						rows.splice(4, 0, {});
					}
					_.forEach(rows, function (row) {
						row.Id = id++;
					});

					return rows;
				}

				function setEcoDevisMarks() {
					const boqChapter = _.find(boqMainService.getList(), {'BoqLineTypeFk': boqMainLineTypes.level1});
					var hasEcodevisMarks = false;
					var boqItem;

					$http.get(baseRoute + 'contextdatapositionsforchapter' + getQueryPart(true))
						.then(function (response) {
							if (response.data !== null) {
								var orderedBoqItems = _.orderBy(boqMainService.getList(), 'Reference');

								// Resets
								_.forEach(boqMainService.getList(), function (boqItem) {
									boqItem.EcoDevisMark = '';
									delete boqItem.EcoDevisInfos;
								});

								_.forEach(response.data, function(ecoDevisPosition) {
									const ecoDevisPositionReference = boqChapter?.Reference + ecoDevisPosition.referencPart;

									boqItem = _.findLast(orderedBoqItems, function (aBoqItem) {
										return aBoqItem.Reference===ecoDevisPositionReference || ecoDevisPositionReference.includes('-') && ecoDevisPositionReference.includes(aBoqItem.Reference);
									}); // The key of a variable contains a '-'

									if (_.isObject(boqItem) && boqItem.BoqLineTypeFk !== 1) {
										boqItem.EcoDevisMark = ecoDevisPosition.mark;
										hasEcodevisMarks = true;

										if (boqItem.EcoDevisInfos === undefined) {
											boqItem.EcoDevisInfos = [];
										}
										boqItem.EcoDevisInfos.push({
											'':                                ecoDevisPositionReference,
											'crbEcodevisInfoShortDescription': ecoDevisPosition.shortDescription,
											'crbEcodevisInfoNote':             ecoDevisPosition.note,
											'crbEcodevisInfoEcoText':          ecoDevisPosition.ecoText,
											getVariableNumber: function () {
												return this[''].includes('-') ? (this[''].substring(this[''].length - 2)) : null;
											}
										});
									}
								});

								boqMainService.gridRefresh();
							}

							platformDialogService.showInfoBox('boq.main.' + (hasEcodevisMarks ? 'crbEcodevisMarksUpdated' : 'crbEcodevisMarksUnavailable'));
						});
				}

				function showEcoDevisInformation() {
					var currentBoqItem = boqMainService.getSelected();

					if (currentBoqItem && currentBoqItem.EcoDevisInfos) {
						platformLongTextDialogService.showDialog(
							{
								headerText$tr$: 'boq.main.crbEcodevisInfo',
								codeMode: true,
								hidePager: true,
								dataSource: new function () {
									var infoText = '';
									_.forEach(currentBoqItem.EcoDevisInfos, function (ecoDevisInfo) {
										for (var prop in ecoDevisInfo) {
											if (Object.prototype.hasOwnProperty.call(ecoDevisInfo, prop) && (typeof ecoDevisInfo[prop] !== 'function')) {
												infoText += (prop ? ($translate.instant('boq.main.' + prop) + ': ') : '') + (ecoDevisInfo[prop] ? ecoDevisInfo[prop] : '') + '\n';
											}
										}
										infoText += '\n';
									});
									platformLongTextDialogService.LongTextDataSource.call(this);
									this.current = infoText;
								}
							});
					} else {
						platformDialogService.showInfoBox('boq.main.crbEcodevisInfoUnavailable');
					}
				}

				function takeoverEcoDevisVariabletext() {
					var currentBoqItem = boqMainService.getSelected();

					if (currentBoqItem && currentBoqItem.EcoDevisInfos && _.some(currentBoqItem.EcoDevisInfos, 'crbEcodevisInfoEcoText')) {
						if (!service.ecoDevisVariabletextTakeoverStarted.fire(currentBoqItem)) {
							platformDialogService.showInfoBox('boq.main.crbEcodevisVariabletextUnavailable2');
						}
					} else {
						platformDialogService.showInfoBox('boq.main.crbEcodevisVariabletextUnavailable1');
					}
				}

				function showEcoDevisRating() {
					var modalOptions;
					var gridColumns;
					var gridRows;
					var rating;

					$http.get(baseRoute + 'ecodataratingforposition' + getQueryPart()).then(function(response) {
						if ((rating = response.data) === null) {
							platformDialogService.showInfoBox('boq.main.crbEcodevisRatingUnavailable');
						} else {
							gridColumns = getGridColumns();
							gridRows = getRatingGridRows(gridColumns, rating);

							modalOptions =
								{
									headerText$tr$: 'boq.main.crbEcodevisRating',
									bodyTemplate: ['<section class="modal-body">',
										'<div data-ng-controller="boqMainCrbEcodevisController">',
										'<platform-Grid data="gridData"/>',
										'</div>',
										'</section>'].join(''),
									showOkButton: true,
									resizeable: true,
									height: '300px',
									width: '900px',
									data: {'gridId': 'C54C252D96BC49E991430E8DD0A525E5', 'gridColumns': gridColumns, 'gridRows': gridRows}
								};
							platformDialogService.showDialog(modalOptions);
						}
					});
				}

				function showEcoDevisComparison() {
					var modalOptions;
					var gridColumns;
					var gridRows;
					var gridRow;
					var id = 1000;

					$http.get(baseRoute + 'ecodataratingforposition' + getQueryPart()).then(function(response) {
						const rating = response.data;
						if (rating) {
							$http.get(baseRoute + 'ecodatcomparisonforposition' + getQueryPart()).then(function(response) {
								var comparisons = response.data;
								if (!comparisons) {
									platformDialogService.showInfoBox('boq.main.crbEcodevisComparisonUnavailable');
								} else {
									gridColumns = getGridColumns();

									// Configures the grid rows
									gridRows = getRatingGridRows(gridColumns, rating, true);
									_.forEach(comparisons, function(comparison) {
										function getPropValue(propName) {
											const comparisonProperty = _.find(comparison, function(comparisonProp) { return comparisonProp[0]===propName; });
											return comparisonProperty ? comparisonProperty[1] : '';
										}
										gridRow = {Id: id++};

										_.forEach(gridColumns, function(column) {
											gridRow[column.field] = getPropValue((['Reference','EcoDevisMark'].includes(column.field) ? '' : 'IST_') + column.field);
										});

										gridRows.push(gridRow);
									});

									modalOptions =
										{
											headerText$tr$: 'boq.main.crbEcodevisComparison',
											bodyTemplate: ['<section class="modal-body">',
												'<div data-ng-controller="boqMainCrbEcodevisController">',
												'<platform-Grid data="gridData"/>',
												'</div>',
												'</section>'].join(''),
											showOkButton: true,
											resizeable: true,
											height: '600px',
											width: '999px',
											data: {'gridId': '121280990A7C490C90A3B75A5845C527', 'gridColumns': gridColumns, 'gridRows': gridRows}

										};
									platformDialogService.showDialog(modalOptions);
								}
							});
						}
					});
				}

				function showEcoDevisFiles() {
					$http.get(baseRoute + 'contextfilemetadataforposition' + getQueryPart()).then(function(response) {
						if (_.some(response.data)) {
							_.forEach(response.data, function(file) {
								var link = angular.element(document.querySelectorAll('#downloadLink'));
								link[0].href = file.Uri;
								link[0].download = file.Name;
								link[0].type = 'application/octet-stream';
								link[0].click();
							});
						} else {
							platformDialogService.showInfoBox('boq.main.crbEcodevisFilesUnavailable');
						}
					});
				}

				function showEcoDevisLinks() {
					$http.get(baseRoute + 'contextdatalinksforposition' + getQueryPart()).then(function(response) {
						if (!_.some(response.data)) {
							platformDialogService.showInfoBox('boq.main.crbEcodevisLinksUnavailable');
						} else {
							_.forEach(response.data, function(link) {
								window.open(link.link);
							});
						}
					});
				}

				function updateTools() {
					var group = {};
					var groupId = 'crbEcodevis';

					if (!_.isObject(scope.tools)) {
						return;
					}

					function addItem(item) {
						item.type = 'item';
						item.caption = 'boq.main.' + item.id;
						group.list.items.push(item);
					}

					if (boqMainService.isCopySource && boqMainService.isWicBoq() && boqMainService.isCrbBoq()) {
						if (!_.find(scope.tools.items, {id: groupId})) {
							group.id = groupId;
							group.caption = 'boq.main.' + groupId;
							group.iconClass = 'tlb-icons ico-eco-devis';
							group.type = 'dropdown-btn';
							group.list = {items: []};

							addItem({id: 'crbEcodevisMark2', fn: setEcoDevisMarks});
							addItem({id: 'crbEcodevisInfo', fn: showEcoDevisInformation, disabled: isDisabled});
							addItem({id: 'crbEcodevisVariabletext', fn: takeoverEcoDevisVariabletext, disabled: isDisabled});
							addItem({id: 'crbEcodevisRating', fn: showEcoDevisRating, disabled: isDisabled});
							addItem({id: 'crbEcodevisComparison', fn: showEcoDevisComparison, disabled: isDisabled});
							addItem({id: 'crbEcodevisFiles', fn: showEcoDevisFiles});
							addItem({id: 'crbEcodevisLinks', fn: showEcoDevisLinks});

							scope.tools.items.splice(0, 0, group);
							scope.tools.update();
						}
					}
					else if (_.some(_.remove(scope.tools.items, {'id': groupId}))) {
						scope.tools.update();
					}
				}

				boqMainService.registerForBoqChanged(scope, updateTools);
			}

			function initPrdTools(scope, boqMainService) {
				var baseRoute = crbBaseRoute + 'prd/';

				function getBoqChapters() {
					return _.filter(boqMainService.getList(), {'BoqLineTypeFk': boqMainLineTypes.level1});
				}

				function isEnabledPrd() {
					return !boqMainService.isCopySource && !boqMainService.isWicBoq() && boqMainService.isCrbBoq();
				}

				function isDisabledMarking() {
					return !_.some(getBoqChapters());
				}

				function setPrdMarks() {
					var hasPrdRelatedPositions = false;
					var boqItem;
					var boqChapters = [];

					_.forEach(getBoqChapters(), function (boqChapter) {
						boqChapters.push({'Reference': boqChapter.Reference, 'Reference2': boqChapter.Reference2});
					});

					$http.get(baseRoute + 'relatednpkpositionsforchapter' + '?boqChapterInfoString=' + JSON.stringify(boqChapters))
						.then(function (response) {
							if (response.data !== null) {
								_.forEach(response.data, function (prdRelatedPos) {
									boqItem = _.find(boqMainService.getList(), {'Reference': prdRelatedPos.ref});
									if (_.isObject(boqItem)) {
										boqItem.PrdMark = 'P' + prdRelatedPos.count;
										hasPrdRelatedPositions = true;
									}
								});

								boqMainService.gridRefresh();
							}

							platformDialogService.showInfoBox('boq.main.' + (hasPrdRelatedPositions ? 'crbPrdMarksUpdated' : 'crbPrdProductsUnavailable'));
						});
				}

				function updateTools() {
					var markItemId = 'crbPrdMark';

					function find(itemId) {
						return _.find(scope.tools.items, {id: itemId});
					}

					if (!_.isObject(scope.tools)) {
						return;
					}

					if (isEnabledPrd()) {
						if (!find(markItemId)) {
							scope.addTools([{
								id: markItemId,
								caption: 'boq.main.' + markItemId,
								type: 'item',
								iconClass: 'tlb-icons ico-prd',
								fn: setPrdMarks,
								permission: '#c',
								disabled: isDisabledMarking
							}]);
							scope.tools.update();
						}
					}
					else if (_.some(_.remove(scope.tools.items, {'id': markItemId}))) {
						scope.tools.update();
					}
				}

				function onBoqItemsLoaded() {
					// Inits the grid column 'PrdProduct' asynchronously,
					var rootBoqItem;
					if (isEnabledPrd() && _.isObject(rootBoqItem = boqMainService.getRootBoqItem())) {
						$http.get(baseRoute + 'list' + '?boqHeaderId=' + rootBoqItem.BoqHeaderFk).then(function (response) {
							if (response.data !== null) {
								_.forEach(response.data, function (prdProduct) {
									_.forEach(_.filter(boqMainService.getList(), {PrdProductFk: prdProduct.Id}), function (boqItem) {
										boqItem.PrdProduct = prdProduct;
									});
								});

								boqMainService.gridRefresh();
							}
						});
					}
				}

				boqMainService.registerForBoqChanged(scope, updateTools);
				boqMainService.registerListLoaded(onBoqItemsLoaded);
				scope.$on('$destroy', function () {
					boqMainService.unregisterListLoaded(onBoqItemsLoaded);
				});
			}

			// #endregion

			// #region Cost group
			function initCostGrpCatAssignTool(scope, boqMainService) {
				var itemId = 'crbCostgrpCatAssign';

				function assignCostGrpCats() {
					if (!boqMainService.isCrbBoq()) {
						platformDialogService.showInfoBox('boq.main.crbExclusiveFunc');
					}

					var rootService = boqMainService;
					while (_.isObject(rootService.parentService())) {
						rootService = rootService.parentService();
					}
					rootService.update().then(function (response) {
						if (response) {
							$http.get(globals.webApiBaseUrl + 'boq/main/crb/costgroupcat/getassignsext' + '?boqHeaderId=' + boqMainService.getRootBoqItem().BoqHeaderFk + '&projectId=' + boqMainService.getSelectedProjectId())
								.then(function (response) {
									if (response.data.ErrorText) {
										platformDialogService.showErrorBox(response.data.ErrorText, 'cloud.common.errorMessage');
									} else {
										var modalOptions =
											{
												headerText$tr$: 'boq.main.crbCostgrpCatAssign',
												bodyTemplate: ['<section class="modal-body">',
													'<div data-ng-controller="boqMainCrbCostgroupConfigController">',
													'<div class="modal-wrapper" style="margin-top:10px">',
													'<div class="modal-wrapper grid-wrapper_ subview-container">',
													'<platform-Grid data="gridData" />',
													'</div>',
													'</div>',
													'</div>',
													'</section>'].join(''),
												showOkButton: true,
												showCancelButton: true,
												resizeable: true,
												minHeight: '300px',
												minWidth: '400px',
												boqMainService: boqMainService,
												data: response.data
											};
										platformDialogService.showDialog(modalOptions);
									}
								});
						}
					});
				}

				function updateTools() {
					if (!_.isObject(scope.tools)) {
						return;
					}

					if (boqMainService.isCrbBoq() && !(boqMainService.isWicBoq() || boqMainService.isCopySource)) {
						if (!_.find(scope.tools.items, {'id': itemId})) {
							scope.addTools([{
								id: itemId,
								caption: 'boq.main.' + itemId,
								type: 'item',
								iconClass: 'tlb-icons ico-config-crb-cost-group',
								permission: '#c',
								disabled: function () {
									return !boqMainService.getRootBoqItem();
								},
								fn: assignCostGrpCats
							}]);
							scope.tools.update();
						}
					}
					else if (_.some(_.remove(scope.tools.items, {'id': itemId}))) {
						scope.tools.update();
					}
				}

				boqMainService.registerForBoqChanged(scope, updateTools);
			}

			function isVgrCostgroupCatalog(costGroupService) {
				var currentCostGroupCatalog = costGroupService.parentService().getSelectedEntities()[0];
				return currentCostGroupCatalog && _.startsWith(currentCostGroupCatalog.Code, 'CRBVGR');
			}

			service.attachCrbCostGroupLogic = function (scopeParam, costGroupService) {
				var rootService;
				var cachedCharacteristics;
				var scope = scopeParam;

				if (!_.isObject(scope.tools)) {
					return;
				}

				function onModuleDataRefreshed() {
					cachedCharacteristics = null;
				}

				function calculateQuantities(costGroups) {
					_.forEach(costGroups, function (costGroup) {
						try {
							costGroup.Quantity = math.eval(costGroup.ReferenceQuantityCode, cachedCharacteristics);
						} catch (err) {
							costGroup.Quantity = 0;
						} finally {
							if (costGroup.Quantity === undefined || !isFinite(costGroup.Quantity)) {
								costGroup.Quantity = 0;
							}
							costGroupService.markItemAsModified(costGroup);
						}
					});
				}

				function loadCharacteristics(costGroups, then) {
					cachedCharacteristics = {};

					$http.post(crbBaseRoute + 'costgroup/' + 'loadcharacteristics' + '?costGroupCatalogId=' + costGroups[0].CostGroupCatalogFk)
						.then(function (response) {
							if (_.isObject(response.data)) {
								cachedCharacteristics = response.data;
								then(costGroups);
								costGroupService.gridRefresh();
							}
						});
				}

				function refreshReferenceQuantity() {
					var costGroups = costGroupService.getList();
					if (_.some(costGroups)) {
						loadCharacteristics(costGroups, calculateQuantities);
					}
				}

				function onCellChanged(changedCostGroup, propertyName) {
					if (propertyName === 'ReferenceQuantityCode') {
						if (_.isObject(cachedCharacteristics)) {
							calculateQuantities([changedCostGroup]);
						} else {
							loadCharacteristics([changedCostGroup], calculateQuantities);
						}
					} else if (propertyName === 'IsCrbPrimaryVariant') {
						var costGroupSiblings = _.filter(costGroupService.getList(), function (aCostGroup) {
							return aCostGroup !== changedCostGroup && aCostGroup.CostGroupFk === changedCostGroup.CostGroupFk;
						});
						changedCostGroup.IsCrbPrimaryVariant = true;
						_.forEach(costGroupSiblings, function (costGroupSibling) {
							if (costGroupSibling.IsCrbPrimaryVariant) {
								costGroupSibling.IsCrbPrimaryVariant = false;
								costGroupService.markItemAsModified(costGroupSibling);
							}
						});
					}
				}

				function onProcessItem(costGroup) {
					platformRuntimeDataService.readonly(costGroup, [{field: 'IsCrbPrimaryVariant', readonly: costGroup.CostGroupFk === null}]);
				}

				function onListLoaded() {
					var propIsCrbPrimaryVariant = 'IsCrbPrimaryVariant';
					var gridColumns = platformGridAPI.columns.getColumns(scope.gridId);

					if (_.some(gridColumns)) {
						if (isVgrCostgroupCatalog(costGroupService)) {
							if (_.find(gridColumns, {id: propIsCrbPrimaryVariant}) === undefined) {
								gridColumns.push({
									id: propIsCrbPrimaryVariant, field: propIsCrbPrimaryVariant, name: $translate.instant('boq.main.' + propIsCrbPrimaryVariant),
									editor: 'boolean', formatter: 'boolean'
								});
							}
						} else {
							gridColumns = _.remove(gridColumns, function (col) {
								return col.id !== propIsCrbPrimaryVariant;
							});
						}

						platformGridAPI.columns.configuration(scope.gridId, gridColumns);
						platformGridAPI.configuration.refresh(scope.gridId);
						platformGridAPI.grids.resize(scope.gridId);
					}
				}

				onListLoaded();

				function canRefreshReferenceQuantity() {
					return _.some(costGroupService.getList(), function (item) {
						return !_.isEmpty(item.ReferenceQuantityCode);
					});
				}

				scope.tools.items.splice(0, 0,
					{
						id: 'boqRefresh',
						caption: 'boq.main.refreshReferenceQuantity',
						type: 'item',
						iconClass: 'tlb-icons ico-refresh',
						fn: function () {
							refreshReferenceQuantity();
						},
						disabled: function () {
							return !canRefreshReferenceQuantity();
						}
					});

				rootService = costGroupService;
				while (_.isObject(rootService.parentService())) {
					rootService = rootService.parentService();
				}
				rootService.registerListLoaded(onModuleDataRefreshed);
				costGroupService.registerListLoaded(onListLoaded);
				costGroupService.cellChanged.register(onCellChanged);
				costGroupService.processItem.register(onProcessItem);
				scope.$on('$destroy', function () {
					rootService.unregisterListLoaded(onModuleDataRefreshed);
					costGroupService.unregisterListLoaded(onListLoaded);
					costGroupService.cellChanged.unregister(onCellChanged);
					costGroupService.processItem.unregister(onProcessItem);
				});
			};

			service.canCreateCostgroup = function (costGroupService) {
				var currentCostGroup = costGroupService.getSelected();
				return !(isVgrCostgroupCatalog(costGroupService) && currentCostGroup && currentCostGroup.CostGroupFk); // A VGR costgroup is a 2 level tree
			};

			// The universal key of a sub quantity is the combination of the cost groups and that must be unique
			service.validateUniqueSubquantityKeys = function(boqMainService) {
				if (!boqMainService.isCrbBoq()) {
					return;
				}

				$http.get(globals.webApiBaseUrl+'boq/main/crb/costgroupcat/getassignsext' + '?boqHeaderId='+boqMainService.getSelectedHeaderFk() + '&projectId='+boqMainService.getSelectedProjectId()).then(function(response) {
					let costgroupProps = [];
					_.forEach(response.data.CrbCostgrpCatAssigns, function(crbCostgrpCatAssign) {
						const prjCostgrpCatAssign = _.find(response.data.PrjCostgrpCatAssigns, {'Id':crbCostgrpCatAssign.PrjCostgrpcatAssignFk});
						if (prjCostgrpCatAssign) {
							costgroupProps.push('costgroup_' + prjCostgrpCatAssign.ProjectCostGroupCatalogFk);
						}
					});

					let allSubquantities = _.orderBy(_.filter(boqMainService.getList(), {'BoqLineTypeFk': boqMainLineTypes.crbSubQuantity}), 'Reference');
					if (_.some(allSubquantities)) {
						if (!_.some(costgroupProps)) {
							platformDialogService.showInfoBox('boq.main.crbCostgrpCatAssignMissing');
						}
						else {
							let ambiguousSubquantities = [];
							let subquantitiesGroupedByParent = _.groupBy(allSubquantities, 'BoqItemFk');

							// Collects the ambiguous sub quantities
							_.forEach(subquantitiesGroupedByParent, function(group) {
								// Collects for each subquantity the composite costgroups in an array. E.g. subquantitiesGroupedByCostgroups[0].nullcostgroup_1463null = ['969.112.375.001','969.112.375.003']
								let subquantitiesGroupedByCostgroups = {};
								_.forEach(group, function(boqSubQuantity) {
									let costGroupKey = '';
									_.forEach(costgroupProps, function(costGroupProp) {
										costGroupKey += (boqSubQuantity[costGroupProp]  || 'null').toString();
									});
									if (!subquantitiesGroupedByCostgroups[costGroupKey]) {
										subquantitiesGroupedByCostgroups[costGroupKey] = [];
									}
									subquantitiesGroupedByCostgroups[costGroupKey].push(boqSubQuantity.Reference);
								});

								// Collects the subquantities with ambiguous keys costgroups
								for (const costGroupKey in subquantitiesGroupedByCostgroups) {
									if (subquantitiesGroupedByCostgroups[costGroupKey].length > 1) {
										ambiguousSubquantities.push(subquantitiesGroupedByCostgroups[costGroupKey].join('\n'));
									}
								}
							});

							// Shows them in a message box 
							if (_.some(ambiguousSubquantities)) {
								platformLongTextDialogService.showDialog({
									headerText$tr$: 'boq.main.crbCostgrpCatAssignAmbiguous',
									topDescription: {text: $translate.instant('boq.main.crbSiaExportError2021Comment'), iconClass: 'tlb-icons ico-info'},
									codeMode: true,
									hidePager: true,
									dataSource: new function () {
										platformLongTextDialogService.LongTextDataSource.call(this);
										this.current = ambiguousSubquantities.join('\n\n');
									}
								});
							}
						}
					}
				});
			};
			// #endregion

			service.initCrbTools = function(scope, boqMainService) {
				initRevisioninfoTools(scope, boqMainService);
				initEcodevisTools(scope, boqMainService);
				initPrdTools(scope, boqMainService);
				$injector.get('boqMainCrbAbschnitt000Service').initTools(scope, boqMainService);
				initCostGrpCatAssignTool(scope, boqMainService);

				// #region Important information (shown for a button click or for the first usage of a chapter from a source BOQ)
				function initImportantInformationTool(scope, dataService, boqMainService) {
					dataService.onPostClipboardSuccess = function (targetOfPasteBoqMainService, pastedData) {
						var pastedChapter;

						if (!(targetOfPasteBoqMainService.isCrbBoq() && _.some(pastedData) && _.some(pastedData[0].BoqItems))) {
							return;
						}

						pastedChapter = pastedData[0].BoqItems[0].Reference.substring(0, 3);
						var matchingBoqItems = _.filter(targetOfPasteBoqMainService.getList(), function (existingBoqItem) {
							return _.startsWith(existingBoqItem.Reference, pastedChapter);
						});
						if (!_.some(matchingBoqItems)) {
							showImportantInformation(false);
						}
					};

					function showImportantInformation(showErrorBox) {
						var boqChapter = _.find(boqMainService.getList(), {'BoqLineTypeFk': boqMainLineTypes.level1});
						if (boqChapter) {
							$http.get(crbBaseRoute + 'importantinformation' + '?chapterReference='+boqChapter.Reference + '&version='+boqChapter.Reference2).then(function(response) {
								if (response.data && response.data.Uri) {
									platformDialogService.showInfoBox('boq.main.crbImportantInformationDownloaded');
									var link = angular.element(document.querySelectorAll('#downloadLink'));
									link[0].href     = response.data.Uri;
									link[0].download = response.data.Name;
									link[0].type     = 'application/octet-stream';
									link[0].click();
								}
								else if (showErrorBox) {
									platformDialogService.showInfoBox('boq.main.crbImportantInformationUnavailable');
								}
							});
						}
					}

					function updateTools() {
						var itemId = 'crbImportantInformation';

						function find(itemId) {
							return _.find(scope.tools.items, {id: itemId});
						}

						if (!_.isObject(scope.tools)) {
							return;
						}

						if (boqMainService.isCrbBoq() && (boqMainService.isWicBoq() || boqMainService.isCopySource)) {
							if (!find(itemId)) {
								scope.tools.items.splice(0, 0, {
									id: itemId,
									caption: 'boq.main.' + itemId,
									type: 'item',
									iconClass: 'tlb-icons ico-preview-form',
									fn: showImportantInformation
								});
								scope.tools.update();
							}
						}
						else if (_.some(_.remove(scope.tools.items, {'id': itemId}))) {
							scope.tools.update();
						}
					}

					boqMainService.registerForBoqChanged(scope, updateTools);
				}

				initImportantInformationTool(scope, service, boqMainService);
				// #endregion

				// #region Removal tool
				function initRemovalTool(scope, boqMainService) {
					var itemId = 'crbBoqItemRemoval';

					function removeBoqItems() {
						if (!isUsingFullLicence) {
							platformDialogService.showInfoBox('boq.main.crbFullLicenseExclusiveFunc');
							return;
						}

						platformDialogService.showYesNoDialog('boq.main.' + itemId, 'cloud.common.infoBoxHeader').then(function (result) {
							if (result.yes) {
								var output = [];
								var removedBoqItems;
								var allBoqItems = boqMainService.getList();

								// Collects BOQ items to be removed
								var leafBoqGroups = _.filter(allBoqItems, function (boqItem) {
									return !_.some(boqItem.BoqItems) && boqItem.BoqLineTypeFk !== boqMainLineTypes.position;
								});
								_.forEach(leafBoqGroups, function (boqItem) {
									while (boqItem.BoqItemFk !== null && !boqItem.IsPreliminary) {
										boqItem.ToBeRemoved = !boqItem.Reference.endsWith('.000.') && _.every(boqItem.BoqItems, 'ToBeRemoved');
										boqItem = _.find(allBoqItems, {'Id': boqItem.BoqItemFk});
									}
								});

								// Removes the BOQ items
								removedBoqItems = _.orderBy(_.filter(allBoqItems, 'ToBeRemoved'), 'Reference');
								boqMainService.deleteEntities(removedBoqItems);
								if (_.some(removedBoqItems)) {
									_.forEach(removedBoqItems, function (boqItem) {
										output.push(boqItem.Reference + ' ' + (boqItem.BriefInfo.Description ? boqItem.BriefInfo.Description : ''));
									});

									platformLongTextDialogService.showDialog(
										{
											headerText$tr$: 'cloud.common.infoBoxHeader',
											topDescription: {text: $translate.instant('boq.main.crbBoqItemRemovalDone'), iconClass: 'tlb-icons ico-info'},
											codeMode: true,
											hidePager: true,
											dataSource: new function () {
												platformLongTextDialogService.LongTextDataSource.call(this);
												this.current = output.join('\n');
											}
										});
								} else {
									platformDialogService.showInfoBox('boq.main.crbBoqItemRemovalCanceled');
								}
							}
						});
					}

					function updateTools() {
						var callingContext = boqMainService.getCallingContext();
						if (!scope.tools || callingContext && Object.prototype.hasOwnProperty.call(callingContext, 'QtoHeader')) {
							return;
						}

						if (boqMainService.isCrbBoq() && !(boqMainService.isWicBoq() || boqMainService.isCopySource)) {
							if (!_.find(scope.tools.items, {'id': itemId})) {
								scope.addTools([{
									id: itemId,
									caption: 'boq.main.' + itemId,
									type: 'item',
									iconClass: 'control-icons ico-checked-2',
									permission: '#d',
									fn: removeBoqItems
								}]);
								scope.tools.update();
							}
						}
						else if (_.some(_.remove(scope.tools.items, {'id': itemId}))) {
							scope.tools.update();
						}
					}

					boqMainService.registerForBoqChanged(scope, updateTools);
				}

				initRemovalTool(scope, boqMainService);
				// #endregion

				// #region Manipulates the "New ..." tool items

				// Extends the "new" toolbar items by CRB specific ones.
				// Sets a concrete caption text in dependency of the current 'BoqLineTypeFk'.
				function updateNewTools() {
					var crbNewGroup = {};
					var crbNewGroupId = 'crbNew';
					var currentBoqItem = boqMainService.getSelected();
					var captionPerLinetype = [ // array index === 'BoqLineTypeFk'
						'd u m m y   f o r   t h e   r o o t',
						'crbNewKapitel',
						'crbNewAbschnitt',
						'crbNewUnterabschnitt',
						'crbNewHauptposition',
						'crbNewUnterpositionsgruppe',
						'crbNewUnterpositionsuntergruppe',
						'crbNewUnterpositionsuntergruppe']; // duplicated to unify the tool caption on this 'BoqLineTypeFk'

					if (!scope.tools || boqMainService.isCopySource) {
						return;
					}

					function getCaption(isSubdivision) {
						const index = currentBoqItem.BoqLineTypeFk===boqMainLineTypes.root ? 1 : currentBoqItem.BoqLineTypeFk===boqMainLineTypes.position ? 6 : currentBoqItem.BoqLineTypeFk + (isSubdivision ? 1 : 0);
						return $translate.instant('boq.main.' + captionPerLinetype[index]);
					}

					function setCaption(tooId, caption) {
						const tool = _.find(scope.tools.items,{'id':tooId});
						if (tool) {
							tool.caption = caption;
						}
					}

					function addItem(item) {
						item.type = 'item';
						item.caption = 'boq.main.' + item.id;
						crbNewGroup.list.items.push(item);
					}

					function isEnabledNew(newLineType) {
						var currentBoqItem = boqMainService.getSelected();
						return currentBoqItem && currentBoqItem.Reference!==undefined && service.canCreateNewPreliminary(boqMainService, currentBoqItem, newLineType);
					}

					function isDisabledNewPosGroup() {
						return !isEnabledNew(5);
					}

					function isDisabledNewPosSubGroup() {
						return !isEnabledNew(6);
					}

					// #region CRB 'new' toolbar items
					if (boqMainService.isCrbBoq() && !boqMainService.isWicBoq()) {
						if (!_.find(scope.tools.items, {id: crbNewGroupId})) {
							crbNewGroup.id = crbNewGroupId;
							crbNewGroup.caption = 'boq.main.crbNewPreliminary';
							crbNewGroup.iconClass = 'tlb-icons ico-sub-vb-new';
							crbNewGroup.type = 'dropdown-btn';
							crbNewGroup.list = {items: []};
							crbNewGroup.permission = '#c',
							crbNewGroup.disabled = function () {
								return isDisabledNewPosGroup() && isDisabledNewPosSubGroup();
							};

							addItem({id: 'crbNewUnterpositionsgruppe',      fn: scope.crbCreateNewPosGroup,    disabled: isDisabledNewPosGroup});
							addItem({id: 'crbNewUnterpositionsuntergruppe', fn: scope.crbCreateNewPosSubGroup, disabled: isDisabledNewPosSubGroup});

							scope.addTools([crbNewGroup]);
						}
					} else {
						_.remove(scope.tools.items, {'id': crbNewGroupId});
					}
					// #endregion

					// #region CRB caption text
					if (boqMainService.isCrbBoq() && currentBoqItem) {
						setCaption('boqNewByContext',   $translate.instant('boq.main.crbNewSubQuantity'));
						setCaption('boqInsert',         $translate.instant('boq.main.crbNewUnterposition'));
						setCaption('boqNewDivision',    getCaption(false));
						setCaption('boqNewSubdivision', getCaption(true));
					}
					// #endregion

					scope.tools.update();
				}

				boqMainService.registerForBoqChanged(scope, updateNewTools);
				boqMainService.registerSelectionChanged(updateNewTools);
				scope.$on('$destroy', function () {
					boqMainService.unregisterSelectionChanged(updateNewTools);
				});

				// #endregion
								
				let unregister = function() {};
				if (!boqMainService.isCopySource) {
					unregister = $rootScope.$on('reporting:resolveCustomParameter', function(dummy, reportValue) {
						if (reportValue.reportInfo.fileName === 'CRB_BoQ.frx') {
							$injector.get('boqMainCrbSiaService').exportCrbSia(boqMainService, reportValue.parameter);
						}
					});
				}
				scope.$on('$destroy', function () {
					isUsingFullLicence = true;
					unregister();
				});
			};

			service.crbCostgrpCatAssignsChanged = new Platform.Messenger();
			service.prdProductChanged = new Platform.Messenger();
			service.ecoDevisVariabletextTakeoverStarted = new Platform.Messenger();

			return service;
		}
	]);

	// #region Eco-Devis
	angularModule.controller('boqMainCrbEcodevisController', ['$scope', 'platformGridAPI',
		function ($scope, platformGridApi) {
			$scope.gridId = $scope.dialog.modalOptions.data.gridId;
			$scope.gridData = {state: $scope.gridId};
			platformGridApi.grids.config({id: $scope.gridId, options: {idProperty: 'Id'}});
			platformGridApi.events.register($scope.gridId, 'onInitialized', onGridInitialized);
			function onGridInitialized() {
				platformGridApi.columns.configuration($scope.gridId, $scope.dialog.modalOptions.data.gridColumns);
				platformGridApi.items.data(           $scope.gridId, $scope.dialog.modalOptions.data.gridRows);
			}

			$scope.$on('$destroy', function () {
				platformGridApi.events.unregister($scope.gridId, 'onInitialized', onGridInitialized);
				platformGridApi.grids. unregister($scope.gridId);
			});
		}
	]);
	// #endregion

	// #region PRD
	angularModule.directive('boqMainCrbSelectPrdLookup', ['$http', 'platformDialogService', 'platformModuleStateService', 'boqMainLineTypes',
		function ($http, platformDialogService, platformModuleStateService, boqMainLineTypes) {
			return {
				scope: {options: '='},
				templateUrl: globals.appBaseUrl + 'basics.common/templates/input-dialog-directive-input.html',
				link: function (scope, element) {
					var prdProducts;
					var baseRoute = crbBaseRoute + 'prd/';
					var boqMainService = scope.options.boqMainService;
					var boqMainCrbService = scope.options.boqMainCrbService;
					var currentBoqItem = boqMainService.getSelected();
					var currentBoqChapter = _.find(_.filter(boqMainService.getList(), {'BoqLineTypeFk': boqMainLineTypes.level1}), function (boqChapter) {
						return _.startsWith(currentBoqItem.Reference, boqChapter.Reference);
					});

					scope.getInputStyle = function () {
						element.find('.value-input').html(scope.options.format(currentBoqItem.PrdProduct)); // Updates the text (no better idea where to call it)
						return {width: element.parents('.slick-cell:first').find('.input-group').width() - element.find('.input-group-btn').width() + 'px', display: 'block'};
					};

					scope.clearValue = function () {
						currentBoqItem.PrdProduct = null;
						currentBoqItem.PrdProductFk = null;
						boqMainCrbService.prdProductChanged.fire([]);
					};

					scope.editValue = function () {
						$http.get(baseRoute + 'fornpkpos' + '?boqItemReference=' + currentBoqItem.Reference + '&version=' + currentBoqChapter.Reference2)
							.then(function (response) {
								if ((prdProducts = JSON.parse(response.data)) === null) {
									platformDialogService.showInfoBox('boq.main.crbPrdProductsUnavailable');
								} else {
									var modalOptions = // todo reason for red text (see failed try of SVN revision 581302)
										{
											headerText$tr$: 'boq.main.crbPrdSelectProduct',
											bodyTemplate: ['<section class="modal-body">',
												'<p style="color:red;">Ohne den ge&ouml;ffneten UI-Container "LV Dokumente" werden bei einer &Auml;nderung der Produkt-Zuordnung Dokumente werder hinzugef&uuml;gt noch gel&ouml;scht.</p>',
												'<div data-ng-controller="boqMainCrbPrdSelectionController">',
												'<div platform-simple-grid data-ng-model="data" data-options="simpleGridOptions"/>',
												'</div>',
												'</section>'].join(''),
											customButtons: [{id: 'product', caption$tr$: 'boq.main.crbPrdProductDetail'}, {id: 'supplier', caption$tr$: 'boq.main.crbPrdSupplierDetail'}],
											showOkButton: true,
											showCancelButton: true,
											resizeable: true,
											height: '600px',
											availablePrdProducts: prdProducts,
											currentPrdProduct: currentBoqItem.PrdProduct
										};
									platformDialogService.showDialog(modalOptions).then(function (result) {
										$http.post(baseRoute + 'create' + '?prdId=' + result.selectedPrdProduct.id + '&prdName=' + result.selectedPrdProduct.name +
											'&boqChapter=' + currentBoqChapter.Reference + '&boqVersion=' + currentBoqChapter.Reference2)
											.then(function (response) {
												var boqItemToSave;
												if ((response.data = JSON.parse(response.data)) !== null) {
													currentBoqItem.PrdProduct = response.data.PrdProduct;
													currentBoqItem.PrdProductFk = response.data.PrdProduct.Id;
													boqMainService.markItemAsModified(currentBoqItem);

													// Ensures that the new and not yet persisted PRD documents are able to be saved even if the document UI container is not active
													boqItemToSave = boqMainService.assertPath(platformModuleStateService.state(boqMainService.getModule()).modifications, false, currentBoqItem);
													if (!_.isArray(boqItemToSave.BoqItem)) { // Not the project BOQ module?
														boqItemToSave = boqItemToSave.BoqItemToSave[0];
													}
													_.forEach(response.data.PrdDocuments, function (document) {
														if (!_.isArray(boqItemToSave.BoqItemDocumentToSave)) {
															boqItemToSave.BoqItemDocumentToSave = [];
														}
														boqItemToSave.BoqItemDocumentToSave.push(document);
													});
													boqMainCrbService.prdProductChanged.fire(response.data.PrdDocuments); // Only has any affect if the document UI container is active
												}
											});
									});
								}
							});
					};
				}
			};
		}]);

	angularModule.controller('boqMainCrbPrdSelectionController', ['_', '$http', '$scope', 'platformContextService',
		function(_, $http, $scope, platformContextService) {
			var urlBase;
			var currentPrdProduct = $scope.dialog.modalOptions.currentPrdProduct;
			$scope.data = {'items': _.sortBy($scope.dialog.modalOptions.availablePrdProducts, 'name')};
			$scope.data.selectedValue = _.isObject(currentPrdProduct) ? currentPrdProduct.ProductKey : $scope.data.items[0].id; // The array never is empty here

			function getSelectedPrdProduct() {
				return _.find($scope.data.items, {'id': $scope.data.selectedValue});
			}

			$http.get(crbBaseRoute + 'prd/' + 'productcatalogurl')
				.then(function (response) {
					urlBase = response.data;
				});

			$scope.simpleGridOptions = {
				id: '82D830EF4549406AB8B1C24F27719DD5',
				defaultSortColumnField: 'name',
				columns: [{field: 'selected', name: '', formatter: 'radio', options: {valueMember: 'id'}},
					{field: 'productPictureContent', name: '', formatter: 'image', options: {width: '100px', height: '100px'}}, // without 'width'/'height' it looks better for not existing picture
					{field: 'name', name$tr$: 'boq.main.crbPrdName', formatter: 'description'},
					{field: 'supplierName', name$tr$: 'boq.main.crbPrdSupplier', formatter: 'description'}]
			};

			$scope.dialog.getButtonById('product').fn = function () {
				window.open(urlBase + '/product_detail/' + $scope.data.selectedValue + '?language=' + platformContextService.getLanguage());
			};

			$scope.dialog.getButtonById('supplier').fn = function () {
				window.open(urlBase + '/company_detail/' + getSelectedPrdProduct().supplierId + '?language=' + platformContextService.getLanguage());
			};

			$scope.dialog.getButtonById('ok').fn = function () {
				$scope.$close({'ok': true, 'selectedPrdProduct': getSelectedPrdProduct()});
			};
		}
	]);
	// #endregion

	// #region Cost group
	angularModule.controller('boqMainCrbCostgroupConfigController', ['_', '$http', '$scope', '$translate','platformDialogService', 'platformGridAPI', 'platformRuntimeDataService', 'boqMainCrbCostgroupLookupService', 'boqMainCrbService',
		function(_, $http, $scope, $translate, platformDialogService, platformGridAPI, platformRuntimeDataService, boqMainCrbCostgroupLookupService, boqMainCrbService) {
			var boqMainService       = $scope.dialog.modalOptions.boqMainService;
			var prjCostgrpCatAssigns = $scope.dialog.modalOptions.data.PrjCostgrpCatAssigns;
			var crbCostgrpCatAssigns = $scope.dialog.modalOptions.data.CrbCostgrpCatAssigns;
			_.remove(crbCostgrpCatAssigns, {Code:'005'}); // VGR costgroup is not wanted by IMPLENIA

			function setReadonlyState(crbCostgrpCatAssign) {
				platformRuntimeDataService.readonly(crbCostgrpCatAssign, crbCostgrpCatAssign.IsUsed);
				platformRuntimeDataService.readonly(crbCostgrpCatAssign, [{field: 'Sorting', readonly: crbCostgrpCatAssign.PrjCostgrpcatAssignFk <= 0}]);
			}

			function onAssignmentChanged(_dummy, arg) {
				function deleteAssignment() {
					crbCostgrpCatAssign.PrjCostgrpcatAssignFk = 0;
					crbCostgrpCatAssign.BasCostgroupCatFk     = 0;
					crbCostgrpCatAssign.Sorting               = null;
					crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = '';
				}

				var crbCostgrpCatAssign = arg.item;
				var prjCostgrpCatAssign = _.find(prjCostgrpCatAssigns, {'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk});

				setReadonlyState(crbCostgrpCatAssign);

				if (prjCostgrpCatAssign) {
					if (crbCostgrpCatAssign.Code==='001' && !(['CRBeBKP-H','CRBeBKP-T','CRBBKP'].some(allowedCodePrefix=>prjCostgrpCatAssign.Code.startsWith(allowedCodePrefix)))) {
						platformDialogService.showInfoBox('boq.main.crbCostgrpCatAssign001');
						deleteAssignment();
					}
					else if (crbCostgrpCatAssign.Code==='003' && !(['CRBeBKP-H','CRBeBKP-T'].some(allowedCodePrefix=>prjCostgrpCatAssign.Code.startsWith(allowedCodePrefix)))) {
						platformDialogService.showInfoBox('boq.main.crbCostgrpCatAssign003');
						deleteAssignment();
					}
					else {
						crbCostgrpCatAssign.BasCostgroupCatFk              = prjCostgrpCatAssign.ProjectCostGroupCatalogFk; // or ContextCostGroupCatalogFk
						crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = prjCostgrpCatAssign.Description;
					}
				}
				else {
					deleteAssignment();
				}

				platformGridAPI.rows.refreshRow({'gridId': $scope.gridId, 'item': crbCostgrpCatAssign});
			}

			// Inits the grid columns
			var gridColumns = [
				{field: 'Name',                           name: $translate.instant('boq.main.crbCostgrpCatStructure'), width: 200},
				{field: 'PrjCostgrpcatAssignFk',          name: $translate.instant('cloud.common.entityCode'),         width: 100},
				{field: 'PrjCostgrpcatAssignDescription', name: $translate.instant('cloud.common.entityDescription'),  width: 150},
				{field: 'Sorting',                        name: $translate.instant('cloud.common.entitySorting'),      width:  70, formatter: 'integer', editor: 'integer'}];
			_.forEach(gridColumns, function(column) { column.id = column.field; });
			boqMainCrbCostgroupLookupService.initLookupColumn(gridColumns[1]);

			// Inits the grid rows
			boqMainCrbCostgroupLookupService.setSourceData(prjCostgrpCatAssigns);
			_.forEach(crbCostgrpCatAssigns, function (crbCostgrpCatAssign) {
				var prjCostgrpCatAssign = _.find(prjCostgrpCatAssigns, {'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk});
				if (prjCostgrpCatAssign) {
					crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = prjCostgrpCatAssign.Description;
				}
				setReadonlyState(crbCostgrpCatAssign);
			});

			// Inits the grid
			$scope.gridId = '77FDDDA194C6434DB5989144482A8A33';
			$scope.gridData = {state: $scope.gridId};
			platformGridAPI.grids.config({'id': $scope.gridId, 'options': {idProperty: 'Code'}, 'columns': gridColumns});
			platformGridAPI.items.data(         $scope.gridId, _.orderBy(crbCostgrpCatAssigns, 'Code'));
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onAssignmentChanged);
			$scope.$on('$destroy', function () {
				platformGridAPI.events.register($scope.gridId, 'onCellChange',  onAssignmentChanged);
			});

			$scope.dialog.getButtonById('ok').fn = function () {
				platformGridAPI.grids.commitEdit($scope.gridId);
				$scope.$close({ok: true});
				$http.post(globals.webApiBaseUrl + 'boq/main/crb/costgroupcat/saveassigns', crbCostgrpCatAssigns)
					.then(function () {
						boqMainService.refreshBoqData();  // Enforces a refresh of the UI container which depends on the 'crbCostgrpCatAssigns'
						boqMainCrbService.crbCostgrpCatAssignsChanged.fire();
					});
			};
		}
	]);

	angularModule.factory('boqMainCrbCostgroupLookupService', ['_', '$q', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function(_, $q, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var availableCostgroupCatalogs = [];

			var service = platformLookupDataServiceFactory.createInstance({}).service;

			service.getLookupData = function () {
				return $q.when(availableCostgroupCatalogs);
			};
			service.getItemById = function (id) {
				return _.find(availableCostgroupCatalogs, ['Id', id]);
			};
			service.getItemByIdAsync = function (id) {
				return $q.when(service.getItemById(id));
			};

			service.initLookupColumn = function (lookupColumn) {
				var lookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'boqMainCrbCostgroupLookupService'});

				lookupColumn.editor = 'lookup';
				lookupColumn.formatter = lookupConfig.grid.formatter;
				lookupColumn.formatterOptions = lookupConfig.grid.formatterOptions;
				lookupColumn.editor = lookupConfig.grid.editor;
				lookupColumn.editorOptions = lookupConfig.grid.editorOptions;
				lookupColumn.editorOptions.lookupOptions.showClearButton = true;
				lookupColumn.editorOptions.lookupOptions.additionalColumns = true;
				lookupColumn.editorOptions.lookupOptions.columns.push({id: 'IsBoq', field: 'IsBoq', formatter: 'boolean', name$tr$: 'basics.customize.isboq'});
			};

			service.setSourceData = function (sourceData) {
				availableCostgroupCatalogs = [];
				_.forEach(sourceData, function (prjCostgrpCatAssign) {
					availableCostgroupCatalogs.push({'Id': prjCostgrpCatAssign.Id, 'Code': prjCostgrpCatAssign.Code, 'DescriptionInfo': {Translated: prjCostgrpCatAssign.Description}, 'IsBoq': prjCostgrpCatAssign.IsBoQ});
				});
			};

			return service;
		}
	]);
	// #endregion

	// #region Abschnit000Service
	// This service provides the special behaviour for Abschnitt000 that its BOQ item children are hidden until they are explecitely loaded.
	angularModule.factory('boqMainCrbAbschnitt000Service', ['platformDialogService',
		function(platformDialogService) {
			var thisService = {};
			var boqMainService;

			function attachAbschnitt000s() {
				boqMainService.setSelectedHeaderFk(boqMainService.getRootBoqItem().BoqHeaderFk, true, null, null, null, null, true).then(function() {
					platformDialogService.showInfoBox('boq.main.crbBoqItem000sAttached');
				});
			}

			thisService.initTools = function(scope, boqMainServiceParam) {
				if (boqMainServiceParam.isCopySource) {
					return;
				}

				boqMainService = boqMainServiceParam;

				function updateTools() {
					if (!scope.tools) {
						return;
					}

					const toolId = 'crbAbschnitt000';

					function find(itemId) {
						return _.find(scope.tools.items, {'id':itemId});
					}

					if (boqMainService.isCrbBoq() && !boqMainService.isCopySource) {
						if (!find(toolId)) {
							scope.addTools([{
								id: toolId,
								caption: 'boq.main.' + toolId,
								type: 'item',
								iconClass: 'tlb-icons ico-crb-000',
								fn: attachAbschnitt000s
							}]);
							scope.tools.update();
						}
					}
					else if (_.some(_.remove(scope.tools.items, {'id':toolId}))) {
						scope.tools.update();
					}
				}

				boqMainService.registerForBoqChanged(scope, updateTools);
			};

			return thisService;
		}
	]);
	// #endregion

})();
