/**
 * Created by joshi on 21.08.2014.
 */

(function () {
	/* global globals, _, Platform:false */
	'use strict';

	/**
	 * This constant describes the currently existing boq types, i.e. the main module a boq is used in
	 * (to be distinguished from what we also describe es boq type but is more related to the so called boq standard as GAEB, Free or CRB)
	 */
	angular.module('boq.main').value('boqMainBoqTypes', {
		none: 0,          // No type given
		wic: 1,           // WIC Boq
		project: 2,       // Project Boq
		wicGroup: 3,      // WIC Group Boq
		package: 4,       // Package Boq
		requisition: 5,   // Requisition Boq
		quote: 6,         // Quote Boq
		contract: 7,      // Contract Boq
		pes: 8,           // Pes Boq
		bid: 9,           // Bid Boq
		ord: 10,          // Ord Boq
		wip: 11,          // Wip Boq
		bill: 12          // Bill Boq
	});

	/**
	 * This constant describes the boq line types
	 */
	angular.module('boq.main').value('boqMainLineTypes', {
		position: 0, // Position (leaf element)
		level1: 1,   // Division (level 1)
		level2: 2,   // Division (level 2)
		level3: 3,   // Division (level 4)
		level4: 4,   // Division (level 4)
		level5: 5,   // Division (level 5)
		level6: 6,   // Division (level 6)
		level7: 7,   // Division (level 7)
		level8: 8,   // Division (level 8)
		level9: 9,   // Division (level 9)
		index: 10,
		crbSubQuantity: 11,
		mediaLine: 101,
		chapterSeparator: 102,
		root: 103,   // BoQ (root element)
		leadingLine: 104,
		designDescription: 105,
		textElement: 106,
		note: 107,
		subDescription: 110,
		surchargeItem1: 200,
		surchargeItem2: 201,
		surchargeItem3: 202,
		surchargeItem4: 203
	});

	/**
	 * This constant describes the data types in the boq structure detail
	 */
	angular.module('boq.main').value('boqMainStructureDetailDataType', {
		numeric: 1,
		alphanumeric: 2
	});

	/**
	 * This constant describes the boq item types
	 */
	angular.module('boq.main').value('boqMainItemTypes', {
		empty:             0,
		standard:          1,
		optionalWithoutIT: 2,
		optionalWithIT:    5,
		priceRequest:      6
	});

	/**
	 * This constant describes the boq item types 2
	 */
	angular.module('boq.main').value('boqMainItemTypes2', {
		normal:              1,
		base:                2,
		basePostponed:       3,
		alternative:         5,
		alternativeAwarded:  7,
		crbPrimaryVariant:   11,
		crbEventualVariant:  12
	});

	/**
	 * This constant describes the block types used for the creation of alphanumeric references
	 */
	angular.module('boq.main').value('boqMainBlockTypes', {
		btNone: 0,
		btConst: 1,
		btLower: 2,
		btUpper: 3,
		btNumber: 4
	});

	/**
	 * This constant describes the block types used for the creation of alphanumeric references
	 */
	angular.module('boq.main').value('boqMainStandardTypes', {
		gaeb: 1,
		free: 2,
		crb: 4,
		oeNorm: 5
	});

	/**
	 * This constant describes the rounding config detail types
	 */
	angular.module('boq.main').value('boqMainRoundingConfigDetailType', {
		quantity: 1,
		unitRate: 2,
		amounts: 3
	});

	/**
	 * This constant describes the rounding method
	 */
	angular.module('boq.main').value('boqMainRoundingMethod', {
		standard: 1,
		roundUp: 2,
		roundDown: 3
	});

	/**
	 * This constant describes the round-to modes
	 */
	angular.module('boq.main').value('boqMainRoundTo', {
		digitsBeforeDecimalPoint: 1,
		digitsAfterDecimalPoint: 2,
		significantPlaces: 3
	});

	/**
	 * This constant describes the bill-to modes
	 */
	angular.module('boq.main').value('billToModes', {
		none: 0,
		percentageBased: 1,
		quantityOrItemBased: 2
	});

	/**
	 * @ngdoc service
	 * @name boq.main..service:boqMainCommonService
	 * @description
	 * boqMainCommonService is the data service for all Boq Main common functions.
	 */
	angular.module('boq.main').factory('boqMainCommonService',
		['$log', 'boqMainBlockTypes', 'boqMainStructureDetailDataType', 'boqMainImageProcessor', 'boqMainLineTypes', 'boqMainStandardTypes', 'platformSchemaService',
			'$q', '$translate', '$http', '$injector',
			function ($log, boqMainBlockTypes, boqMainStructureDetailDataType, boqMainImageProcessor, boqMainLineTypes, boqMainStandardTypes, platformSchemaService,
				$q, $translate, $http, $injector) {

				var service = {};
				var CalcParentItem = {};

				var boqMainCrbService = $injector.get('boqMainCrbService');
				var boqMainOenService = $injector.get('boqMainOenService');

				var itemTypeData = null;

				function loadItemTypeData() {

					var deffered = $q.defer();

					if (itemTypeData === null) {
						$http.post(globals.webApiBaseUrl + 'basics/customize/itemtype/list').then(function (response) {
							itemTypeData = [];
							for (var i = 0, len = response.data.length; i < len; i++) {
								itemTypeData.push({Id: response.data[i].Id, Code: response.data[i].Code.Translated});
							}
							deffered.resolve();
						});
					} else {
						deffered.resolve();
					}
					return deffered.promise;
				}

				function getItemTypeById(value) {
					var item = null;
					if (itemTypeData !== null) {
						for (var i = 0; i < itemTypeData.length; i++) {
							if (itemTypeData[i].Id === value) {
								item = itemTypeData[i];
								break;
							}
						}
					}
					return item;
				}

				var itemType2Data = null;

				function loadItemType2Data() {

					var deffered = $q.defer();

					if (itemType2Data === null) {
						$http.post(globals.webApiBaseUrl + 'basics/customize/itemtype2/list').then(function (response) {
							itemType2Data = [];
							for (var i = 0, len = response.data.length; i < len; i++) {
								itemType2Data.push({Id: response.data[i].Id, Code: response.data[i].Code.Translated});
							}
							deffered.resolve();
						});
					} else {
						deffered.resolve();
					}
					return deffered.promise;
				}

				function getItemType2ById(value) {
					var item = null;
					if (itemType2Data !== null) {
						for (var i = 0; i < itemType2Data.length; i++) {
							if (itemType2Data[i].Id === value) {
								item = itemType2Data[i];
								break;
							}
						}
					}
					return item;
				}

				service.buildItemInfo = function buildItemInfo(boqItem) {
					var itemInfos = [];
					var result;

					var itemType = getItemTypeById(boqItem.BasItemTypeFk);
					if (itemType && itemType.Code!==null) {
						itemInfos.push(itemType.Code);
					}

					var itemType2 = getItemType2ById(boqItem.BasItemType2Fk);
					if (itemType2 && itemType2.Code!==null) {
						itemInfos.push(itemType2.Code);
					}

					if (boqItem.IsDisabled) {
						itemInfos.push('X');
					}

					if (boqItem.IsNotApplicable) {
						itemInfos.push('(X)');
					}

					if (boqItem.HasOwnerTextComplements) {
						itemInfos.push($translate.instant('boq.main.itemInfoOwnerTextComplements'));
					}

					if (boqItem.HasBidderTextComplements) {
						itemInfos.push($translate.instant('boq.main.itemInfoBidderTextComplements'));
					}

					if (boqItem.IsKeyitem) {
						itemInfos.push($translate.instant('boq.main.itemInfoKeyItem'));
					}

					result = itemInfos.join();
					result = boqMainCrbService.buildItemInfo(boqItem, result);
					result = boqMainOenService.buildItemInfo(boqItem, result);
					result = _.trimStart(result, ','); // Not reproducable, but will trim leading commas. See JIRA DEV-2157.

					return result;
				};

				LoadItemTypeCodeLookups();

				function LoadItemTypeCodeLookups() {

					var promises = [];
					promises.push(loadItemTypeData());
					promises.push(loadItemType2Data());
					$q.all(promises).then(function () {
						angular.noop();
					});
				}

				/**
				 * @ngdoc function
				 * @name isRootType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type root
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isRootType = function isRootType(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.root);
				};

				/**
				 * @ngdoc function
				 * @name isRoot
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a root item
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isRoot = function isRoot(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isRootType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isWicRoot
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Check if the given boqItem is a WIC root element
				 * @param {Object} boqItem to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isWicRoot = function isWicRoot(boqItem) {
					return (service.isRoot(boqItem) && boqItem.IsWicItem);
				};

				/**
				 * @ngdoc function
				 * @name isPositionType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type position
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isPositionType = function isPositionType(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.position);
				};

				/**
				 * @ngdoc function
				 * @name isItem
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is an item
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isItem = function isItem(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isPositionType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isWicRoot
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Check if the given boqItem is a WIC root element
				 * @param {Object} boqItem to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isWicItem = function isWicItem(boqItem) {
					return (service.isItem(boqItem) && boqItem.IsWicItem);
				};

				/**
				 * @ngdoc function
				 * @name isDivisionType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type division
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isDivisionType = function isDivisionType(lineType) {

					/* jshint -W074 */ // cyclomatic complexity

					if (!lineType) {
						return false;
					}

					var isDiv = false;

					switch (lineType) {
						case boqMainLineTypes.level1:
						case boqMainLineTypes.level2:
						case boqMainLineTypes.level3:
						case boqMainLineTypes.level4:
						case boqMainLineTypes.level5:
						case boqMainLineTypes.level6:
						case boqMainLineTypes.level7:
						case boqMainLineTypes.level8:
						case boqMainLineTypes.level9:
							isDiv = true;
							break;
						default:
							isDiv = false;
							break;
					}

					return isDiv;
				};

				/**
				 * @ngdoc function
				 * @name isDivision
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a division
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isDivision = function isDivision(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isDivisionType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isTextElementType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type textElement
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isTextElementType = function isTextElementType(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.textElement);
				};

				/**
				 * @ngdoc function
				 * @name isTextElement
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a textElement
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isTextElement = function isTextElement(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isTextElementType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isNoteType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type note
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isNoteType = function isNoteType(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.note);
				};

				/**
				 * @ngdoc function
				 * @name isNote
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a note
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isNote = function isNote(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isNoteType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isSubDescriptionType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type subDescription
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSubDescriptionType = function isSubDescriptionType(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.subDescription);
				};

				/**
				 * @ngdoc function
				 * @name isSubDescription
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a subDescription
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSubDescription = function isSubDescription(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isSubDescriptionType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isDesignDescriptionType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type design description
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isDesignDescriptionType = function isDesignDescriptionType(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.designDescription);
				};

				/**
				 * @ngdoc function
				 * @name isDesignDescription
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a design description
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isDesignDescription = function isDesignDescription(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isDesignDescriptionType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isTextElementWithoutReferenceType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given lineType is a text element without reference, i.e.
				 * it's of line type designDescription, note, textElement or subDescription
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isTextElementWithoutReferenceType = function isTextElementWithoutReferenceType(lineType) {
					return !!(angular.isDefined(lineType) &&
						(lineType !== null) &&
						(service.isDesignDescriptionType(lineType) ||
							service.isTextElementType(lineType) ||
							service.isNoteType(lineType) ||
							service.isSubDescriptionType(lineType)));

				};

				/**
				 * @ngdoc function
				 * @name isTextElementWithoutReference
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a text element without reference, i.e.
				 * it's of line type designDescription, note, textElement or subDescription
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isTextElementWithoutReference = function isTextElementWithoutReference(boqItem) {
					return !!(angular.isDefined(boqItem) &&
						(boqItem !== null) &&
						(service.isDesignDescription(boqItem) ||
							service.isTextElement(boqItem) ||
							service.isNote(boqItem) ||
							service.isSubDescription(boqItem)));

				};

				/**
				 * @ngdoc function
				 * @name isLeadDescription
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a lead description
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isLeadDescription = function isLeadDescription(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && boqItem.IsLeadDescription);
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItemType1
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type surchargeItem 1
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItemType1 = function isSurchargeItemType1(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.surchargeItem1);
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItem1
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a surchargeItem 1
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItem1 = function isSurchargeItem1(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isSurchargeItemType1(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItemType2
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type surchargeItem 2
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItemType2 = function isSurchargeItemType2(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.surchargeItem2);
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItem2
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a surchargeItem 2
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItem2 = function isSurchargeItem2(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isSurchargeItemType2(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItemType3
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type surchargeItem 3
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItemType3 = function isSurchargeItemType3(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.surchargeItem3);
				};

				service.isSurchargeItemType4 = function isSurchargeItemType4(lineType) {
					return (angular.isDefined(lineType) && lineType !== null && lineType === boqMainLineTypes.surchargeItem4);
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItem3
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a surchargeItem 3
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItem3 = function isSurchargeItem3(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isSurchargeItemType3(boqItem.BoqLineTypeFk));
				};

				service.isSurchargeItem4 = function isSurchargeItem4(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isSurchargeItemType4(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItemType
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given line type is of type surchargeItem
				 * @param {Number} lineType that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItemType = function isSurchargeItemType(lineType) {
					return (angular.isDefined(lineType) &&
						lineType !== null &&
						(lineType === boqMainLineTypes.surchargeItem1 || lineType === boqMainLineTypes.surchargeItem2 || lineType === boqMainLineTypes.surchargeItem3 || lineType === boqMainLineTypes.surchargeItem4)
					);
				};

				/**
				 * @ngdoc function
				 * @name isSurchargeItem
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given boqItem is a surchargeItem
				 * @param {Object} boqItem that's to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isSurchargeItem = function isSurchargeItem(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && service.isSurchargeItemType(boqItem.BoqLineTypeFk));
				};

				/**
				 * @ngdoc function
				 * @name isDivisionOrRoot
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Check if the given boqItem is a division or root item
				 * @param {Object} boqItem to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isDivisionOrRoot = function isDivisionOrRoot(boqItem) {
					return (angular.isDefined(boqItem) && boqItem !== null && ((boqItem.BoqLineTypeFk > 0 && boqItem.BoqLineTypeFk <= 9) || service.isRoot(boqItem)));
				};

				/**
				 * @ngdoc function
				 * @name isFreeBoqType
				 * @function
				 * @description Check if the given boq structure has a boq standard setting assigned that allows a boq to be free
				 * @param {Object} boqStructure holding the boq standard property to be checked
				 * @returns {Boolean}
				 */
				service.isFreeBoqType = function isFreeBoqType(boqStructure) {

					return (angular.isDefined(boqStructure) && (boqStructure !== null) &&
						(boqStructure.BoqStandardFk === boqMainStandardTypes.free));
				};

				/**
				 * @ngdoc function
				 * @name isGaebBoqType
				 * @function
				 * @description Check if the given BOQ structure is compliant to the GAEB standard
				 * @param {Object} boqStructure
				 * @returns {Boolean}
				 */
				service.isGaebBoqType = function isGaebBoqType(boqStructure) {
					return (_.isObject(boqStructure) && boqStructure.BoqStandardFk === boqMainStandardTypes.gaeb);
				};

				/**
				 * @ngdoc function
				 * @name isCrbBoqType
				 * @function
				 * @description Check if the given BOQ structure is compliant to the swiss CRB standard
				 * @param {Object} boqStructure
				 * @returns {Boolean}
				 */
				service.isCrbBoqType = function isCrbBoqType(boqStructure) {
					return (_.isObject(boqStructure) && boqStructure.BoqStandardFk === boqMainStandardTypes.crb);
				};

				// Checks if the given BOQ structure is compliant to the Austrian OENORM
				service.isOenBoqType = function isOenBoqType(boqStructure) {
					return (boqStructure && boqStructure.BoqStandardFk===boqMainStandardTypes.oeNorm);
				};

				/**
				 * @ngdoc function
				 * @name getDivisionLineTypeByLevel
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines the division line type for the given level
				 * @param {Number} level for which the line type is looked up
				 * @returns
				 */
				service.getDivisionLineTypeByLevel = function getDivisionLineTypeByLevel(level) {
					if (!level && (level < 1 || level > 9)) {
						// Currently only levels between 1 and 9 are supported
						return;
					}
					return boqMainLineTypes['level' + level];
				};

				/**
				 * @ngdoc function
				 * @name insertImages
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines the fitting images and sets them to the given boq item and all of its children
				 * @param {Object} boqitem with its children whose images have to be determined and set
				 * @returns
				 */
				service.insertImages = function (boqItem) {
					if (!boqItem || !angular.isObject(boqItem)) {
						return; // return if undefined or not an object
					}

					// Set correct image path
					boqMainImageProcessor.processItem(boqItem);

					// Recucsively visit the children.
					if (angular.isDefined(boqItem.BoqItems) && boqItem.BoqItems !== null) {
						for (var i = 0; i < boqItem.BoqItems.length; i++) {
							service.insertImages(boqItem.BoqItems[i]);
						}
					}
				};

				service.flatten = function (input, output) {
					if (!angular.isDefined(input)) {
						return output;
					}

					var inputArray = [];

					if (angular.isArray(input)) {
						inputArray = input;
					} else if (angular.isObject(input)) {
						inputArray.push(input);
					} else {
						$log.log('boqMainCommonService -> flatten -> wrong input type');
						return output;
					}

					for (var i = 0; i < inputArray.length; i++) {

						if (angular.isDefined(inputArray[i].BoqItems) && inputArray[i].BoqItems !== null) {
							if (inputArray[i].BoqItems.length > 0) {
								service.flatten(inputArray[i].BoqItems, output);
							}
						}
						output.push(inputArray[i]);
					}
					return output;
				};

				service.flattenList = function flattenList(list) { // TODO: remove BoqItems => general method!!!
					var flatList = [], ncnt = 0, ns, n;
					for (var i = 0; i < list.length; i++) {
						n = list[i];
						flatList[ncnt++] = n;
						if (Object.prototype.hasOwnProperty.call(n, 'BoqItems')) {
							ns = n.BoqItems ? flattenList(n.BoqItems) : 0;
							for (var j = 0; j < ns.length; j++) {
								flatList[ncnt++] = ns[j];
							}
						}
					}
					return flatList;
				};

				service.getRowCellIndex = function (boqItems) {
					var rowColIndex = [];
					var itemCol = {};
					var colIndex = [3, 7, 8, 9];
					rowColIndex.push(boqItems);
					var flatBoqItems = service.flattenList(rowColIndex);
					rowColIndex = [];
					angular.forEach(flatBoqItems, function (item) {
						if (angular.isDefined(item.BoqItems) && item.BoqItems !== null) {
							itemCol.row = flatBoqItems.indexOf(item);
							itemCol.cell = colIndex;
							rowColIndex.push(itemCol);
							itemCol = {};
						}
					});
					return rowColIndex;
				};

				service.getCalcParentBoqItems = function (item, rootBoqItem) {
					var rootBoqItemFlatList = [];
					CalcParentItem = {};
					var pItem = {};

					if (rootBoqItem) {
						rootBoqItemFlatList.push(rootBoqItem);
						rootBoqItemFlatList = service.flattenList(rootBoqItemFlatList);
						if (item) {
							if (item.BoqItemFk !== null) {
								pItem = _.find(rootBoqItemFlatList, {Id: item.BoqItemFk});
								pItem = service.getItemsTotalPrice(pItem, item);
								pItem.ItemTotal = pItem.Finalprice; // price without discount
								pItem.Finalprice = pItem.Finalprice + pItem.Discount;
								if (pItem.nodeInfo.level !== 0) {
									service.getCalcParentBoqItems(pItem);
								} else {
									CalcParentItem = pItem;
								}
							} else {
								CalcParentItem = item;
							}
						}
					}
				};

				service.getCalcRootBoqItem = function () {
					return CalcParentItem;
				};

				service.getItemsTotalPrice = function (parentItem, item) {

					var allItems = [];
					parentItem.Finalprice = 0;
					parentItem.Hours = 0;
					if (parentItem) {
						allItems = service.getAllChildren(parentItem);
						if (allItems.length) {
							angular.extend(allItems[allItems.indexOf(item)], item);
							angular.forEach(allItems, function (item) {
								parentItem.Finalprice = item.Finalprice + parentItem.Finalprice;
								parentItem.Hours = item.Hours + parentItem.Hours;
							});
						}
					}
					return parentItem;
				};

				service.getAllChildren = function (item) {
					var itemsTotal = [];
					if (item) {
						if (Object.prototype.hasOwnProperty.call(item, 'BoqItems') && item.BoqItems !== null) {
							itemsTotal.push(_.flatten(_.pick(item, 'BoqItems')));
						}
					}
					return itemsTotal[0];
				};

				service.getItemColIdList = function (boqItems) {
					var output = [];
					var itemColIdList = [];
					var itemCol = {};
					var colIdList = ['cost', 'corr', 'unitRate', 'discountUR'];
					var flatBoqItems = service.flatten(boqItems, output);
					$log.log('flat' + flatBoqItems);
					angular.forEach(flatBoqItems, function (item) {
						if (angular.isDefined(item.BoqItems) && item.BoqItems !== null) {
							itemCol.item = item;
							itemCol.colId = colIdList;
							itemColIdList.push(itemCol);
							itemCol = {};
						}
					});
					return itemColIdList;
				};

				// region relay navbar events

				service.relaySaveDataRequested = function () {
					service.saveDataRequested.fire(); // relay event
				};
				service.saveDataRequested = new Platform.Messenger();

				// endregion

				/**
				 * @ngdoc function
				 * @name excelColumnFromNumber
				 * @function
				 * @methodOf
				 * @description Excel's algorithm to get Column-Name (A...Z,AA....) from Column-Position
				 * @param {Number} column indicates the column position
				 * @returns {String} returns the column name according to excel rules
				 */
				var excelColumnFromNumber = function excelColumnFromNumber(column) {
					var columnString = '';
					var columnNumber = column;
					while (columnNumber > 0) {
						var currentLetterNumber = (columnNumber - 1) % 26;
						var currentLetter = String.fromCharCode(currentLetterNumber + 65);
						columnString = currentLetter + columnString;
						columnNumber = (columnNumber - (currentLetterNumber + 1)) / 26;
					}

					return columnString;
				};

				/**
				 * @ngdoc function
				 * @name numberFromExcelColumn
				 * @function
				 * @methodOf boq.main..service
				 * @description Excel's algorithm to get Column-Position  from Column-Name (A...Z,AA....)
				 * @param {String} column as string
				 * @returns {Number} returns the column position according to excel rules
				 */
				var numberFromExcelColumn = function numberFromExcelColumn(column) {
					var retVal = 0;
					var col = column.toUpperCase();
					for (var iChar = col.length - 1; iChar >= 0; iChar--) {
						var colPiece = col[iChar];
						var colNum = colPiece.charCodeAt(0) - 64;
						retVal = retVal + colNum * Math.pow(26, col.length - (iChar + 1));

					}
					return retVal;
				};

				/**
				 * @ngdoc function
				 * @name hasFurtherBlockToIncrement
				 * @function
				 * @methodOf
				 * @description Check exist more block to increment
				 * @param {Array} blocks blocks holding various parts of the key code
				 * @param {Number} currentIndex
				 * @returns {Boolean} indicates that there is a further keycode block for incrementation
				 */
				var hasFurtherBlockToIncrement = function hasFurtherBlockToIncrement(blocks, currentIndex) {
					if (blocks && (blocks.length > 0) && (currentIndex < blocks.length)) {
						for (var i = currentIndex + 1; i < blocks.length; i++) {
							var bt = blocks[i].BlockType;

							if (bt === boqMainBlockTypes.btUpper || bt === boqMainBlockTypes.btLower || bt === boqMainBlockTypes.btNumber) {
								return true;
							}
						}
					}

					return false;

				};

				/**
				 * @ngdoc function
				 * @name OZBlock
				 * @function
				 * @methodOf boq.main..service
				 * @description Constructor function for OZBlock object
				 * @param {Number} blockType indicating the block type
				 * @returns {Object}
				 */
				function OZBlock(blockType) {
					this.BlockType = blockType;
					this.BlockChars = [];
				}

				/**
				 * @ngdoc function
				 * @name gaebAlphaNumericIncrement
				 * @function
				 * @methodOf boq.main..service
				 * @description Given an alphanumeric KeyCode (alphanumeric ReferenceNo /part of ReferenceNo),
				 * this method creates a new alphanumeric Code incremented by a decimal amount
				 * (see ALM 58886)
				 *
				 * Method uses Blocks to increment alphanumeric Parts of different bases from right to left
				 * by a mixed-modulo-remainder-algorithm.
				 * @param {String} keyCode the alphanumeric part to increment (part after last dot of reference)
				 * @param {Number} increment the base-10 Number to increment
				 * @returns {String} incremented key code
				 */

				var gaebAlphaNumericIncrement = function gaebAlphaNumericIncrement(keyCode, increment) {

					/* jshint -W071 */ // function has to many statements
					/* jshint -W073 */ // function nested to deeply
					/* jshint -W074 */ // functions cyclomatic complexity si too high

					var result;

					var theChars = keyCode.split('');
					var len = theChars.length;
					var currentBlockType = boqMainBlockTypes.btNone;
					var blocks = [];
					var block;
					var i;

					for (i = len - 1; i >= 0; i--) {
						var currentChar = keyCode.charCodeAt(i);
						if (currentChar >= 65 && currentChar <= 90) {
							// A..Z
							if (currentBlockType !== boqMainBlockTypes.btUpper) {
								currentBlockType = boqMainBlockTypes.btUpper;
								block = new OZBlock(currentBlockType);
								block.BlockChars.push(theChars[i]);
								blocks.push(block);
							} else {
								blocks[blocks.length - 1].BlockChars.push(theChars[i]);
							}
						} else if (currentChar >= 97 && currentChar <= 122) {
							// a..z
							if (currentBlockType !== boqMainBlockTypes.btLower) {
								currentBlockType = boqMainBlockTypes.btLower;
								block = new OZBlock(currentBlockType);
								block.BlockChars.push(theChars[i]);
								blocks.push(block);
							} else {
								blocks[blocks.length - 1].BlockChars.push(theChars[i]);
							}
						} else if (currentChar >= 48 && currentChar <= 57) {
							if (currentBlockType !== boqMainBlockTypes.btNumber) {
								currentBlockType = boqMainBlockTypes.btNumber;
								block = new OZBlock(currentBlockType);
								block.BlockChars.push(theChars[i]);
								blocks.push(block);
							} else {
								blocks[blocks.length - 1].BlockChars.push(theChars[i]);
							}
						} else {
							if (currentBlockType !== boqMainBlockTypes.btConst) {
								currentBlockType = boqMainBlockTypes.btConst;
								block = new OZBlock(currentBlockType);
								block.BlockChars.push(theChars[i]);
								blocks.push(block);
							} else {
								blocks[blocks.length - 1].BlockChars.push(theChars[i]);
							}
						}
					}

					for (i = 0; i < blocks.length; i++) {
						blocks[i].BlockChars.reverse();
					}

					var remainder = increment;
					var reverseLst = [];
					var blockStr = '';
					var currentNum;
					var newCol;
					var localRev = [];
					var prefixRev = [];
					var shift;
					var sPrefix = '';
					var j;

					for (i = 0; i < blocks.length; i++) {
						if (remainder > 0) {
							if (blocks[i].BlockType === boqMainBlockTypes.btConst) {
								reverseLst.push(blocks[i].BlockChars.join(''));
							} else if (blocks[i].BlockType === boqMainBlockTypes.btNumber) {
								var origPart = parseInt(blocks[i].BlockChars.join(''));
								var next = origPart + remainder;
								remainder = 0;
								reverseLst.push(next.toString());
							} else if (blocks[i].BlockType === boqMainBlockTypes.btUpper) {

								blockStr = blocks[i].BlockChars.join('');

								if (remainder > 0) {
									currentNum = numberFromExcelColumn(blockStr);
									currentNum += remainder;
									newCol = excelColumnFromNumber(currentNum);

									if (!hasFurtherBlockToIncrement(blocks, i)) {
										reverseLst.push(newCol);
										remainder = 0;
									} else {
										localRev = [];
										prefixRev = [];
										shift = newCol.length - blockStr.length;

										if (newCol.length >= blockStr.length) {
											for (j = newCol.length - 1; j >= 0; j--) {
												if (j >= shift) {
													localRev.push(newCol[j]);
												} else {
													prefixRev.push(newCol[j]);
												}
											}
										}

										localRev.reverse();
										prefixRev.reverse();

										var sUpper = localRev.join('');
										reverseLst.push(sUpper);

										if (prefixRev.length > 0) {
											sPrefix = prefixRev.join('');
											remainder = numberFromExcelColumn(sPrefix);
										} else {
											remainder = 0;
										}
									}
								} else {
									reverseLst.push(blockStr);
								}
							} else if (blocks[i].BlockType === boqMainBlockTypes.btLower) {

								blockStr = blocks[i].BlockChars.join('');

								if (remainder > 0) {
									currentNum = numberFromExcelColumn(blockStr);
									currentNum += remainder;
									newCol = excelColumnFromNumber(currentNum);

									if (!hasFurtherBlockToIncrement(blocks, i)) {
										reverseLst.push(newCol.toLowerCase());
										remainder = 0;
									} else {
										localRev = [];
										prefixRev = [];
										shift = newCol.length - blockStr.length;

										if (newCol.length >= blockStr.length) {
											for (j = newCol.length - 1; j >= 0; j--) {
												if (j >= shift) {
													localRev.push(newCol[j]);
												} else {
													prefixRev.push(newCol[j]);
												}
											}
										}

										localRev.reverse();
										prefixRev.reverse();

										var sLower = localRev.join('').toLowerCase();
										reverseLst.push(sLower);

										if (prefixRev.length > 0) {
											sPrefix = prefixRev.join('');
											remainder = numberFromExcelColumn(sPrefix);
										} else {
											remainder = 0;
										}
									}
								} else {
									reverseLst.push(blockStr);
								}
							}
						} else {
							// keep
							reverseLst.push(blocks[i].BlockChars.join(''));
						}
					}

					reverseLst.reverse();
					result = reverseLst.join('');

					return result;
				};

				/**
				 * @ngdoc function
				 * @name isValidGapMatch
				 * @function
				 * @methodOf boq.main..service
				 * @description Checks whether [leftSiblingPart] is smaller than [newPart] is smaller than [rightSiblingPart]
				 * @param {String} leftSiblingPart key code of previous sibling item
				 * @param {String} newPart new created key code
				 * @param {String} rightSiblingPart key code of next sibling item
				 * @param {Function} referenceComparer helps to compare references
				 * @returns {Boolean} returns if [leftSiblingPart] is smaller than [newPart] is smaller than [rightSiblingPart]
				 */
				var isValidGapMatch = function isValidGapMatch(leftSiblingPart, newPart, rightSiblingPart, referenceComparer) {
					var isValid = false;

					if (angular.isUndefined(referenceComparer) || (referenceComparer === null)) {
						console.error('boqMainCommonService: function isValidGapMathch -> parameter referenceComparer missing');
						return false;
					}

					if (_.isEmpty(newPart)) {
						isValid = true; // x0x
					} else {
						if (_.isEmpty(leftSiblingPart) && _.isEmpty(rightSiblingPart)) {
							isValid = true; // we assume validity if previous and next sibling node is empty
						} else if (_.isEmpty(leftSiblingPart) && !_.isEmpty(rightSiblingPart)) {
							// newPart has to be smaller than rightSiblingPart
							isValid = (referenceComparer(newPart, rightSiblingPart) === -1);
						} else if (!_.isEmpty(leftSiblingPart) && _.isEmpty(rightSiblingPart)) {
							// leftSiblingPart has to be smaller than newPart
							isValid = (referenceComparer(leftSiblingPart, newPart) === -1);
						} else if (!_.isEmpty(leftSiblingPart) && !_.isEmpty(rightSiblingPart)) {
							// leftSiblingPart has to be smaller than newPart AND
							// newPart has to be smaller than rightSiblingPart
							var biggerThanLeft = (referenceComparer(leftSiblingPart, newPart) === -1);
							var smallerThanRight = (referenceComparer(newPart, rightSiblingPart) === -1);
							isValid = biggerThanLeft && smallerThanRight;
						}
					}

					return isValid;
				};

				/**
				 * @ngdoc function
				 * @name isReferenceMaxLengthExceeded
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Determines if the given referenceLength exceeds the given maximum reference length
				 * @param {Number} referenceLength that's checked
				 * @param {Number} maxReferenceLength that may not be exceeded
				 * @returns {Boolean} returns result of check
				 */
				service.isReferenceMaxLengthExceeded = function isReferenceMaxLengthExceeded(referenceLength, maxReferenceLength) {

					// Special case
					// If max length is -1 there is no limitation of length
					if (maxReferenceLength === -1) {
						return false;
					}

					return referenceLength > maxReferenceLength;
				};

				/**
				 * @ngdoc function
				 * @name generateReference
				 * @function
				 * @methodOf boq.main..service
				 * @description Generates a reference for a boq item
				 * @param {String} s1Part reference part of previous sibling boq item
				 * @param {String} s2Part reference part of next sibling boq item
				 * @param {Boolean} doAppend
				 * @param {Boolean} canCreateAlphanumerical
				 * @param {Boolean} createNewAtEnd forces the new reference to be created at the end of all sibling items
				 * @param {Number} dataType indicates type of reference (numeric or alphanumeric)
				 * @param {Number} stepIncrement defines sizes of incrementation step
				 * @param {Number} lengthReference maximum length of reference
				 * @param {Boolean} useNextAvailable defines if not try to find a reference in the middle of two given references; return first + 1 instead. Needed for generating multiple references
				 * @param {Object} newReferenceContainer Object holding two properties, 'newReference' and 'numberOfReferences', can be initialized with empty object
				 * @param {Function} referenceComparer helps to compare references
				 * @returns {Boolean} inidcating if the generation of the reference was successful
				 */

				/* jshint -W072 */ // function has too many parameters
				service.generateReference = function generateReference(s1Part, s2Part, doAppend, canCreateAlphanumerical, createNewAtEnd, dataType, stepIncrement, lengthReference, useNextAvailable, newReferenceContainer, referenceComparer) {

					/* jshint -W073 */ // function nested to deeply
					/* jshint -W074 */ // function's cyclomatic complexity is too high

					var result = false;
					var _canCreateAlphanumerical = canCreateAlphanumerical;
					var i1 = -1, i2 = -1, lowerI = -1;
					var _returnNumberOfReferences = 0;

					newReferenceContainer.newReference = '';

					// Check if it's possible to create a reference automatically
					if (dataType === boqMainStructureDetailDataType.numeric) {

						// Numerical
						i1 = parseInt(s1Part);
						i2 = parseInt(s2Part);
						if ((i1 !== -1) && (i2 !== -1)) {
							if (createNewAtEnd) {
								newReferenceContainer.newReference = (i1 + stepIncrement).toString();
								if (service.isReferenceMaxLengthExceeded(newReferenceContainer.newReference.toString().length, lengthReference)) {
									newReferenceContainer.newReference = '';
									result = false;
								} else {
									result = true;
									_returnNumberOfReferences = -1;
								}
							} else {
								if ((Math.abs(i1 - i2)) > 1) {
									lowerI = i1 > i2 ? i2 : i1;
									if (useNextAvailable) {
										newReferenceContainer.newReference = (lowerI + 1).toString();
									} else {
										newReferenceContainer.newReference = (lowerI + Math.floor((Math.abs(i1 - i2) / 2))).toString();
									}

									// Calculate the number of references that are possible (it's the diff - 1 (because it is between)).
									// We use the abs function because, we don't really know which value is lower
									_returnNumberOfReferences = Math.abs(i1 - i2) - 1;
									result = true;
								} else {
									result = false;
								}
							}
						} else {
							result = false;
						}
					} else {
						if (_canCreateAlphanumerical) {
							// remove "leading zeros" by a regular expression that leads to a trimLeft of whitespaces
							s1Part = s1Part.replace(/^\s+/, '');
							s2Part = s2Part.replace(/^\s+/, '');
							if (!doAppend) {
								// Switch variables because following logic is based on append
								var _hold = s2Part;
								s2Part = s1Part;
								s1Part = _hold;
							}
							// alphanumerical
							var _s2Split = s2Part.split('');
							if (_s2Split.length === 0) {
								newReferenceContainer.newReference = s1Part;
								result = true;
							} else {

								// The alphanumeric parts "  5" and " 10",  when trimmed do not have same char[].length.
								// But of course we are able to generate a part between them

								//* ** create a new alphanumeric reference part
								//* ** based on s1Part and stepIncrement
								//* ** (see ALM 58886)

								var smallerStep = stepIncrement; // start with given stepIncrement
								newReferenceContainer.newReference = gaebAlphaNumericIncrement(s1Part, smallerStep);
								result = true;

								if (!createNewAtEnd) {
									while ((!isValidGapMatch(s1Part, newReferenceContainer.newReference, s2Part, referenceComparer)) && (smallerStep > 0)) {
										// try smaller step
										if (useNextAvailable) {
											if(newReferenceContainer.newReference === s2Part) {
												// The newReference has already reached the value of the next reference already in use
												// -> no valid reference can be created in the given gap between s1Part and s2Part
												// -> stop searching
												break;
											}
											else {
												smallerStep = 1;
											}
										} else {
											smallerStep = Math.floor(smallerStep / 2);
										}

										newReferenceContainer.newReference = gaebAlphaNumericIncrement(s1Part, smallerStep);
										if (smallerStep > 0) {
											_returnNumberOfReferences = smallerStep - 1; // Todo: was 'numberOfReferences' in original code, but I assume it to be '_returnNumberOfReferences' and replaced it
										}
									}

									if (!isValidGapMatch(s1Part, newReferenceContainer.newReference, s2Part, referenceComparer)) {
										_canCreateAlphanumerical = true;
										newReferenceContainer.newReference = '';
										result = false;
									} else {
										_returnNumberOfReferences++;
									}
								} else {
									_returnNumberOfReferences++;
								}

								if (service.isReferenceMaxLengthExceeded(newReferenceContainer.newReference.toString().length, lengthReference)) {
									newReferenceContainer.newReference = '';
									_returnNumberOfReferences = 0;
									result = false;
								}
							}
						}
						if (!_canCreateAlphanumerical) {
							// in this case it should be possible anyway to create an item - but then without a reference - it has to be set manually
							newReferenceContainer.newReference = '';
							result = true;
						}
					}

					newReferenceContainer.numberOfReferences = _returnNumberOfReferences;

					return result;
				};

				/**
				 * @ngdoc function
				 * @name syncBoqItem
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Syncs the given targetItem with the values of the given sourceItem
				 * @param {Object} sourceItem that carries the values to be synced to the target item
				 * @param {Object} targetItem that's synced to the sourceItem
				 * @param {Boolean} syncQuantity forces or suppresses the sync of the quantity properties
				 * @param {Boolean} syncSums forces or suppresses the sync of the summed up property values
				 */
				service.syncBoqItem = function syncBoqItem(sourceItem, targetItem, syncQuantity, syncSums) {
					/* jshint -W074 */ // cyclomatic complexity

					// Do some checks first
					if (angular.isUndefined(sourceItem) || !_.isObject(sourceItem) || angular.isUndefined(sourceItem.BoqHeaderFk) || angular.isUndefined(sourceItem.BoqItemFk) || angular.isUndefined(sourceItem.Reference)) {
						// The given boqItem doesn't seem to be a valid boq item object.
						// No need to continue...
						return;
					}

					if (angular.isUndefined(targetItem) || !_.isObject(targetItem) || angular.isUndefined(targetItem.BoqHeaderFk) || angular.isUndefined(targetItem.BoqItemFk) || angular.isUndefined(targetItem.Reference)) {
						// The given boqItem doesn't seem to be a valid boq item object.
						// No need to continue...
						return;
					}

					// Fill the following object with property names and flags indicating that the related boq item properties are skipped when doing the sync.
					var skippedProperty = {
						BoqHeaderFk: true,
						BoqItemFk: true,
						BoqItemParent: true,
						BoqLineTypeFk: true,
						BoqItemBasisFk: true,
						BoqItemBasisParent: true,
						BoqItems: true,
						BoqItemChildren: true,
						BoqItemReferenceFk: true,
						BoqItemReferenceParent: true,
						BoqSurcharedEntities: true, // Todo: Typo in dto: surchar(g)ed !!
						BoqSurcharedItemFk: true, // Todo: Typo in dto: surchar(g)ed !!
						HasChildren: true,
						BasBlobsSpecificationFk: true,
						BoqItemPrjBoqFk: true,
						BoqItemPrjItemFk: true,
						BoqItemBidBoqFk: true,
						BoqItemBidItemFk: true,
						BoqItemOrdBoqFk: true,
						BoqItemOrdItemFk: true,
						BoqItemBilBoqFk: true,
						BoqItemBilItemFk: true,
						Id: true,
						InsertedAt: true,
						InsertedBy: true,
						UpdatedAt: true,
						UpdatedBy: true,
						LevelIndex: true,
						Reference: true,
						Version: true,
						WicChildren: true,
						WicParent: true,
						__rt$data: true,
						image: true,
						nodeInfo: true,
						CostGroupAssignments: true
					};

					if (!syncQuantity) {
						// Dont's sync the quantity property values -> skip them
						skippedProperty.QuantityAdj = true;
						skippedProperty.Quantity = true;
						skippedProperty.DiscountedPrice = true;
						skippedProperty.DiscountedPriceOc = true;
					}

					if (!syncSums) {
						// Dont's sync the summable property values -> skip them
						skippedProperty.Finalprice = true;
						skippedProperty.FinalpriceOc = true;
					}

					// Iterate over the target object and copy the corresponding source object values that are not marked as skipped.
					for (var property in targetItem) {
						if (Object.prototype.hasOwnProperty.call(sourceItem, property) && !skippedProperty[property]) {
							// Copy the value of the corresponding source item property.
							if (angular.isDefined(sourceItem[property])) {
								if (property === 'BriefInfo') {
									targetItem[property] = angular.copy(sourceItem[property]);
									if (_.isObject(targetItem[property]) && targetItem[property].Translated === null) {
										targetItem[property].Translated = targetItem[property].Description;
									}
								} else {
									targetItem[property] = sourceItem[property];
								}
							}
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name resetFloatValues
				 * @function
				 * @methodOf boqMainCommonService
				 * @description Reset all float values of the given boqItem to zero
				 * @param {Object} boqItem whose float properties have to be reset to 0
				 */
				service.resetFloatValues = function resetFloatValues(boqItem) {

					// Do some checks first
					if (angular.isUndefined(boqItem) || !_.isObject(boqItem) || angular.isUndefined(boqItem.BoqHeaderFk) || angular.isUndefined(boqItem.BoqItemFk) || angular.isUndefined(boqItem.Reference)) {
						// The given boqItem doesn't seem to be a valid boq item object.
						// No need to continue...
						return;
					}

					// Determine float properties from schema
					var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'BoqItemDto',
						moduleSubModule: 'Boq.Main'
					});
					var numericDomainTypes = ['money', 'quantity', 'percent'];
					var propertyDomain = null;

					for (var property in boqItem) {
						// Filter out float values and reset them to 0.
						if (_.isObject(boqItemAttributeDomains) && _.isObject(boqItemAttributeDomains.properties) && _.isObject(boqItemAttributeDomains.properties[property])) {
							propertyDomain = boqItemAttributeDomains.properties[property].domain;
							if (_.isString(propertyDomain) && numericDomainTypes.indexOf(propertyDomain) !== -1) {
								boqItem[property] = 0;
							}
						}
					}
				};

				service.setBoqTreeExpanded = function (boqRoot, isExpanded) {
					boqRoot.nodeInfo = {collapsed: !isExpanded, lastElement: false, level: 0};

					var childs = boqRoot.BoqItems,
						level = 0;
					while (childs && childs.length > 0) {
						var temp = [];
						level++;
						_.forEach(childs, function (item) {
							item.nodeInfo = {collapsed: false, lastElement: !(item.BoqItems && item.BoqItems.length > 0), level: level};
							if (item.BoqItems && item.BoqItems.length > 0) {
								_.forEach(item.BoqItems, function (boqItem) {
									temp.push(boqItem);
								});
							}
						});
						childs = temp;
					}
				};

				service.setBoqItemLevel = function (rootBoq) {
					if (!rootBoq) {
						return;
					}

					var level = 0;
					setLevel(rootBoq);

					var childs = rootBoq.BoqItems;
					while (childs && childs.length > 0) {
						level++;
						var temp = [];
						_.forEach(childs, function (item) {
							setLevel(item, level);
							if (item.BoqItems && item.BoqItems.length > 0) {
								_.forEach(item.BoqItems, function (boqItem) {
									temp.push(boqItem);
								});
							}
						});
						childs = temp;
					}

					function setLevel(parentBoq, level) {
						if (parentBoq && parentBoq.BoqItems) {
							_.forEach(parentBoq.BoqItems, function (item) {
								// item.BoqItemParent = parentBoq;
								item.LevelCount = level;
							});
						}
					}
				};

				var structure = {};

				service.setBoqStructureEntity = function (boqStructureEntity) {
					structure = boqStructureEntity;
				};

				service.getFormattedReferenceNo = function getFormattedReferenceNo(reference) {
					if (!reference) {
						return reference;
					}

					if (!structure || !structure.BoqStructureDetailEntities || structure.BoqStructureDetailEntities.length === 0 || service.isFreeBoqType(structure)) {
						return reference;
					}

					var splitChar = '.';
					reference = reference.trim();
					var isEndWithSplitChar = reference.endsWith(splitChar);
					var splitNos = _.trimEnd(reference, splitChar).split(splitChar);
					var leadingZerosChar = structure.LeadingZeros ? '0' : ' ';
					var divisionLevelNum = _.filter(structure.BoqStructureDetailEntities, function (item) {
						return item.BoqLineTypeFk !== boqMainLineTypes.index && item.BoqLineTypeFk !== boqMainLineTypes.position;
					}).length;

					var result = '';
					for (var i = 0; i < structure.BoqStructureDetailEntities.length; i++) {
						if (i + 1 > splitNos.length) {
							break;
						}
						if (i + 1 === splitNos.length && !isEndWithSplitChar && i !== divisionLevelNum) {
							break;
						}
						var structureDetail = structure.BoqStructureDetailEntities[i];
						if (structureDetail.BoqLineTypeFk === boqMainLineTypes.index) {
							continue;
						}
						var currentNo = splitNos[i].trim();
						// var startValue = structureDetail.StartValue;
						if (currentNo.length >= structureDetail.LengthReference) {
							continue;
						}
						var currentNoLength = currentNo.length;
						if (currentNo.length < structureDetail.StartValue) {
							for (var k = 0; k < structureDetail.StartValue.length - currentNoLength; k++) {
								currentNo += '0';
							}
						}

						currentNoLength = currentNo.length;
						if (!service.isReferenceMaxLengthExceeded(currentNoLength, structureDetail.LengthReference)) {
							for (var j = 1; j <= (structureDetail.LengthReference - currentNoLength); j++) {
								currentNo = leadingZerosChar + currentNo;
							}
						}

						splitNos[i] = currentNo;
					}

					for (var l = 0; l < splitNos.length; l++) {
						result = result + splitNos[l] + splitChar;
					}
					if (splitNos.length >= structure.BoqStructureDetailEntities.length || !isEndWithSplitChar) {
						result = _.trimEnd(result, splitChar);
					}

					return result;
				};

				return service;
			}
		]);
})();
