/* eslint-disable prefer-const */
/**
 * Corresponds to the backend c# class 'RIB.Visual.Boq.Main.Core.BoqConstants'.
 */

import { IBoqItemEntity } from '@libs/boq/interfaces';

/**
 + This enum describes the possible values a BoqLineTypeFk in a BoqItemEntity may have
 + and gives meaning to it by a declarative name.
 */
export enum BoqLineType
{
	Position = 0, // Position (leaf element)
	DivisionLevelFirst = 1,  // First Division. We can have up to 9 division levels at the moment
	DivisionLevelLast = 9,   // Last Division
	Index = 10,
	CrbSubQuantity = 11,
	MediaLine = 101,
	ChapterSeparator = 102,
	Root = 103,   // BoQ (root element)
	LeadingLine = 104,
	DesignDescription = 105,
	TextElement = 106,
	Note = 107,
	SubDescription = 110,
	SurchargeItem1 = 200,
	SurchargeItem2 = 201,
	SurchargeItem3 = 202,
	SurchargeItem4 = 203
}

/** BOQ standard */
export enum BoqStandard
{
	Gaeb   = 1,
	Free   = 2,
	Crb    = 4,
	OeNorm = 5,
}

/**
 * This constant describes the boq item types
 */
export enum BoqMainItemTypes {
	Empty             = 0,
	Standard          = 1,
	OptionalWithoutIT = 2,
	OptionalWithIT    = 5,
	PriceRequest      = 6
}

/**
 * This constant describes the boq item types 2
 */
export enum BoqMainItemTypes2 {
	Normal               = 1,
	Base                 = 2,
	BasePostponed        = 3,
	Alternative          = 5,
	AlternativeAwarded   = 7,
	CrbPrimaryVariant    = 11,
	CrbEventualVariant   = 12
}

/**
 * This constant describes the rounding config detail types
 */
export enum BoqMainRoundingConfigDetailType {
	Quantity = 1,
	UnitRate = 2,
	Amounts  = 3
}

/**
 * This constant describes the rounding method
 */
export enum BoqMainRoundingMethod {
	Standard    = 1,
	RoundUp     = 2,
	RoundDown   = 3
}

/**
 * This constant describes the round-to modes
 */
export enum BoqMainRoundTo {
	DigitsBeforeDecimalPoint   = 1,
	DigitsAfterDecimalPoint    = 2,
	SignificantPlaces          = 3
}

/**
 * This constant describes the currently existing boq types, i.e. the main module a boq is used in
 * (to be distinguished from what we also describe as boq type but is more related to the so called boq standard as GAEB, Free or CRB)
 */
export enum BoqMainBoqTypes {
	None        = 0,  // No type given
	Wic         = 1,  // WIC Boq
	Project     = 2,  // Project Boq
	WicGroup    = 3,  // WIC Group Boq
	Package     = 4,  // Package Boq
	Requisition = 5,  // Requisition Boq
	Quote       = 6,  // Quote Boq
	Contract    = 7,  // Contract Boq
	Pes         = 8,  // Pes Boq
	Bid         = 9,  // Bid Boq
	Ord         = 10, // Ord Boq
	Wip         = 11, // Wip Boq
	Bill        = 12  // Bill Boq
}

/** This constant describes the position types in a CRB BoQ */
export enum CrbBoqPositionTypes {
	Closed     = 1, // Closed position     (German: Geschlossene Position)
	Open       = 2, // Open position       (German: Offene Position)
	Repeat     = 3, // Repeat position     (German: Wiederholungsposition)
	Individual = 4  // Individual position (German: Individuelle Position (Reserve))
}

/** This constant describes the document types in a CRB BoQ */
export enum CrbBoqDocumentTypes {
	A = 'A', // WIC      (German: Musterleistungsverzeichnis)
	B = 'B', // Tender   (German: Ausschreibung (Basis für Angebot))
	C = 'C', // Bid      (German: Angebot
	D = 'D', // Contract (German: Vertrag/Nachtrag
	I = 'I'  // QTO      (German: Ausmass)
}

export class BoqItemHelper {

	/**
	 * @ngdoc function
	 * @name isRootType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type root
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isRootType(lineType: number) : boolean {
		return lineType === BoqLineType.Root;
	}

	/**
	 * @ngdoc function
	 * @name isRoot
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given lineType or boqItem represents a root item
	 * @param {lineType | IBoqItemEntity} lineType or boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isRoot(lineType: number) : boolean;
	public static isRoot(boqItem: IBoqItemEntity) : boolean;
	public static isRoot(boqItemOrLineType: IBoqItemEntity | number): boolean {

		let result = false;
		const isRoot = (lineType: number) => {
			return lineType === BoqLineType.Root;
		};

		if(typeof boqItemOrLineType === 'number') {
			result = isRoot(boqItemOrLineType);
		} else if(typeof boqItemOrLineType === 'object') {
			if(!boqItemOrLineType || boqItemOrLineType.BoqLineTypeFk === undefined || boqItemOrLineType.BoqLineTypeFk === null) {
				return false;
			}

			result = isRoot(boqItemOrLineType.BoqLineTypeFk);
		}

		return result;
	}

	/**
	 * @ngdoc function
	 * @name isWicRoot
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Check if the given boqItem is a WIC root element
	 * @param {Object} boqItem to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isWicRoot(boqItem: IBoqItemEntity): boolean {
		if(!boqItem || boqItem.IsWicItem == null) {
			return false;
		}

		return (this.isRoot(boqItem) && boqItem.IsWicItem);
	}

	/**
	 * @ngdoc function
	 * @name isPositionType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type position
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isPositionType(lineType: number) : boolean {
		return lineType === BoqLineType.Position;
	}

	/**
	 * @ngdoc function
	 * @name isItem
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given lineType or boqItem represents an item
	 * @param {lineType | IBoqItemEntity } lineType or boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isItem(lineType: number) : boolean;
	public static isItem(boqItem: IBoqItemEntity) : boolean;
	public static isItem(boqItemOrLineType: IBoqItemEntity | number): boolean {

		let result = false;
		const isItem = (lineType: number) => {
			return lineType === BoqLineType.Position;
		};

		if(typeof boqItemOrLineType === 'number') {
			result = isItem(boqItemOrLineType);
		} else if(typeof boqItemOrLineType === 'object') {
			if(!boqItemOrLineType || boqItemOrLineType.BoqLineTypeFk === undefined || boqItemOrLineType.BoqLineTypeFk === null) {
				return false;
			}

			result = isItem(boqItemOrLineType.BoqLineTypeFk);
		}

		return result;
	}

	/**
	 * @ngdoc function
	 * @name isWicRoot
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Check if the given boqItem is a WIC root element
	 * @param {Object} boqItem to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isWicItem(boqItem: IBoqItemEntity): boolean {
		if(!boqItem || boqItem.IsWicItem == null) {
			return false;
		}

		return (this.isItem(boqItem) && boqItem.IsWicItem);
	}

	/**
	 * @ngdoc function
	 * @name isDivisionType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type division
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isDivisionType(lineType: number) : boolean {

		/* jshint -W074 */ // cyclomatic complexity

		if (!lineType) {
			return false;
		}

		let isDiv = false;

		if (lineType >= BoqLineType.DivisionLevelFirst && lineType <= BoqLineType.DivisionLevelLast) {
			isDiv = true;
		} else {
			isDiv = false;
		}

		return isDiv;
	}

	/**
	 * @ngdoc function
	 * @name isDivision
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a division
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isDivision(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isDivisionType(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isTextElementType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type textElement
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isTextElementType(lineType: number) : boolean {
		return lineType === BoqLineType.TextElement;
	}

	/**
	 * @ngdoc function
	 * @name isTextElement
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a textElement
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isTextElement(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isTextElementType(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isNoteType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type note
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isNoteType(lineType: number) : boolean {
		return lineType === BoqLineType.Note;
	}

	/**
	 * @ngdoc function
	 * @name isNote
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a note
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isNote(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isNoteType(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isSubDescriptionType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type subDescription
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSubDescriptionType(lineType: number) : boolean {
		return lineType === BoqLineType.SubDescription;
	}

	/**
	 * @ngdoc function
	 * @name isSubDescription
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a subDescription
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSubDescription(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isSubDescriptionType(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isDesignDescriptionType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type design description
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isDesignDescriptionType(lineType: number) : boolean {
		return lineType === BoqLineType.DesignDescription;
	}

	/**
	 * @ngdoc function
	 * @name isDesignDescription
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a design description
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isDesignDescription(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isDesignDescriptionType(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isTextElementWithoutReferenceType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given lineType is a text element without reference, i.e.
	 * it's of line type designDescription, note, textElement or subDescription
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isTextElementWithoutReferenceType(lineType: number) : boolean {
		return !!(lineType &&
			(lineType !== null) &&
			(this.isDesignDescriptionType(lineType) ||
				this.isTextElementType(lineType) ||
				this.isNoteType(lineType) ||
				this.isSubDescriptionType(lineType)));
	}

	/**
	 * @ngdoc function
	 * @name isTextElementWithoutReference
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a text element without reference, i.e.
	 * it's of line type designDescription, note, textElement or subDescription
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isTextElementWithoutReference(boqItem : IBoqItemEntity) : boolean {
		return !!(boqItem &&
			(boqItem !== null) &&
			(this.isDesignDescription(boqItem) ||
				this.isTextElement(boqItem) ||
				this.isNote(boqItem) ||
				this.isSubDescription(boqItem)));
	}

	/**
	 * @ngdoc function
	 * @name isLeadDescription
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a lead description
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isLeadDescription(boqItem : IBoqItemEntity) : boolean {
		if(!boqItem || boqItem.IsLeadDescription === null) {
			return false;
		}

		return boqItem.IsLeadDescription as boolean;
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItemType1
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type surchargeItem 1
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItemType1(lineType: number) : boolean {
		return lineType === BoqLineType.SurchargeItem1;
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItem1
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a surchargeItem 1
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItem1(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isSurchargeItemType1(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItemType2
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type surchargeItem 2
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItemType2(lineType: number) : boolean {
		return lineType === BoqLineType.SurchargeItem2;
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItem2
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a surchargeItem 2
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItem2(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isSurchargeItemType2(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItemType3
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type surchargeItem 3
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItemType3(lineType: number) : boolean {
		return lineType === BoqLineType.SurchargeItem3;
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItemType4
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type surchargeItem 4
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItemType4(lineType: number) : boolean {
		return lineType === BoqLineType.SurchargeItem4;
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItem3
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a surchargeItem 3
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItem3(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isSurchargeItemType3(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItem4
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a surchargeItem 4
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItem4(boqItem: IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isSurchargeItemType4(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItemType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type surchargeItem
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItemType(lineType : number) : boolean {
		if(!lineType || lineType !== null)  {
			return false;
		}

		return (lineType === BoqLineType.SurchargeItem1 || lineType === BoqLineType.SurchargeItem2 || lineType === BoqLineType.SurchargeItem3 || lineType === BoqLineType.SurchargeItem4);
	}

	/**
	 * @ngdoc function
	 * @name isSurchargeItem
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given boqItem is a surchargeItem
	 * @param {Object} boqItem that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isSurchargeItem(boqItem : IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return this.isSurchargeItemType(boqItem.BoqLineTypeFk);
	}

	/**
	 * @ngdoc function
	 * @name isDivisionOrRoot
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Check if the given boqItem is a division or root item
	 * @param {Object} boqItem to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isDivisionOrRoot(boqItem : IBoqItemEntity) : boolean {
		if(!boqItem || !boqItem.BoqLineTypeFk || boqItem.BoqLineTypeFk === null) {
			return false;
		}

		return (boqItem.BoqLineTypeFk >= BoqLineType.DivisionLevelFirst && boqItem.BoqLineTypeFk <= BoqLineType.DivisionLevelLast) || this.isRoot(boqItem);
	}
}

export interface IBoqVisitorObject {
	visitBoqItemFn :     (parentItem: IBoqItemEntity | undefined, childItem: IBoqItemEntity, lineType: number, level: number, visitorObject: IBoqVisitorObject) => boolean;
	postVisitBoqItemFn?:  (parentItem: IBoqItemEntity | undefined, childItem: IBoqItemEntity, lineType: number, level: number, visitorObject: IBoqVisitorObject) => boolean;

	// This index signature shall help to be able to access the properties of IBoqVisitorObject via an index like "visitorObject["propertyName"]"
	[key: string]: string | number | boolean | null | undefined | ((parentItem: IBoqItemEntity, childItem: IBoqItemEntity, lineType: number, level: number, visitorObject: IBoqVisitorObject) => boolean);
}

export class BoqItemTreeHelper {

	/**
	 * @ngdoc function
	 * @name isRootType
	 * @function
	 * @methodOf BoqItemHelper
	 * @description Determines if the given line type is of type root
	 * @param {Number} lineType that's to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static flatten(originBoqItems: IBoqItemEntity[]): IBoqItemEntity[] {
		let flattenedBoqItems: IBoqItemEntity[] = [];

		if (Array.isArray(originBoqItems) && originBoqItems.length > 0) {
			flattenedBoqItems = flattenedBoqItems.concat(originBoqItems);
			originBoqItems.forEach(boqItem => {
				flattenedBoqItems = flattenedBoqItems.concat(this.flatten(boqItem.BoqItems ?? []));
			});
		}

		return flattenedBoqItems;
	}

	/**
	 * @ngdoc function
	 * @name isItemWithIT
	 * @function
	 * @methodOf BoqItemDataService
	 * @description Check if the given boqItem is an item with an item total
	 * @param {Object} boqItem to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isItemWithIT(boqItem: IBoqItemEntity) : boolean { // isItemWithItemTotal (backend, later), getParentBoqItem prevents to be part of BoqItemHelper
		if(boqItem &&
			(BoqItemHelper.isItem(boqItem) || BoqItemHelper.isSurchargeItem(boqItem)) &&
			(boqItem.BasItemTypeFk === 0 ||
				boqItem.BasItemTypeFk === BoqMainItemTypes.Standard ||
				boqItem.BasItemTypeFk === BoqMainItemTypes.OptionalWithIT) &&
			(boqItem.BasItemType2Fk === null ||
				boqItem.BasItemType2Fk === BoqMainItemTypes2.Normal ||
				boqItem.BasItemType2Fk === BoqMainItemTypes2.Base ||
				boqItem.BasItemType2Fk === BoqMainItemTypes2.AlternativeAwarded ||
				boqItem.BasItemType2Fk === BoqMainItemTypes2.CrbPrimaryVariant) && !this.isDisabledOrNA(boqItem)
		) {
			return true;
		}

		return false;
	}

	/**
	 * @ngdoc function
	 * @name isDivisionOrRootWithIT
	 * @function
	 * @methodOf BoqItemDataService
	 * @description Check if the given boqItem is a division or root with an item total
	 * @param {Object} boqItem to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isDivisionOrRootWithIT(boqItem: IBoqItemEntity) : boolean { // isDivisionOrRootWithItemTotal (backend, later)
		if (boqItem &&
			BoqItemHelper.isDivisionOrRoot(boqItem) &&
			(boqItem.BasItemType2Fk === null ||
				boqItem.BasItemType2Fk === BoqMainItemTypes2.Normal ||
				boqItem.BasItemType2Fk === BoqMainItemTypes2.Base ||
				boqItem.BasItemType2Fk === BoqMainItemTypes2.AlternativeAwarded) && !this.isDisabledOrNA(boqItem)
		) {
			return true;
		}

		return false;
	}

	/**
	 * @ngdoc function
	 * @name isDisabledOrNA
	 * @function
	 * @methodOf BoqItemDataService
	 * @description Check if the given boqItem is disabled or not applicable.
	 * This check climbs up the parent chain to even check the parents for these properties.
	 * @param {Object} boqItem to be checked
	 * @returns {Boolean} returns result of check
	 */
	public static isDisabledOrNA(boqItem: IBoqItemEntity) : boolean { // isDisabledOrNotApplicable (backend, later)

		if (!boqItem) {
			return false;
		}

		let b: boolean | undefined = boqItem.IsDisabled || boqItem.IsNotApplicable;

		if (!b) {
			let parent = boqItem.BoqItemParent; // Todo-Boq: Only works reliably, if BoqItemParent is provided !!

			while (parent !== null) {
				b = parent?.IsDisabled || parent?.IsNotApplicable;
				if (b) {
					break;
				}

				if(parent) {
					parent = parent.BoqItemParent;
				}
			}
		}

		return b as boolean;
	}

	/**
	 * @ngdoc function
	 * @name visitBoqItemsRecursively
	 * @function
	 * @methodOf BoqItemDataService
	 * @description Visits a complete boq item hierarchy recursively and calls a visit function given by a visitor object that can do specific tasks.
	 * @param {Object} parentItem es entry point of recursion
	 * @param {Object} current child item to be visited
	 * @param {Number} hierarchical level of the child item
	 * @param {Object} visitorObject holding a visitor function that's to be called. The object can gather information when iterating over the hierarchy
	 * @returns {Boolean} indicating if the recursion is successful (in a context that's given by the visitor function) or should be broken
	 */
	public static visitBoqItemsRecursively(parentItem: IBoqItemEntity | undefined, childItem: IBoqItemEntity, level: number, visitorObject: IBoqVisitorObject) : boolean {

		if (childItem === undefined || childItem === null) {
			return false;
		}

		// Determine the child item line type. If it's a division we adapt the line type to the level.
		let lineType = (BoqItemHelper.isDivision(childItem)) ? Math.min(9, level) : childItem.BoqLineTypeFk;

		// Call visit function which is only done when the creation check was successful
		if (visitorObject) {
			if (visitorObject.visitBoqItemFn(parentItem, childItem, lineType ?? -1, level, visitorObject)) {

				// Dig recursively deeper into the boq item hierarchy
				let hasChildren = Object.prototype.hasOwnProperty.call(childItem, 'BoqItems') && (childItem.BoqItems !== null);
				let visitedChild = null;
				let digDeeper = true;
				if (hasChildren && childItem.BoqItems) {
					for (let i = 0; i < childItem.BoqItems.length ?? 0; i++) {
						visitedChild = childItem.BoqItems[i];
						if (visitedChild !== null) {
							if (!this.visitBoqItemsRecursively(childItem, visitedChild, level + 1, visitorObject)) {
								digDeeper = false;
								break;
							}
						}
					}
				}

				if(visitorObject.postVisitBoqItemFn) {
					visitorObject.postVisitBoqItemFn(parentItem, childItem, lineType ?? -1, level, visitorObject);
				}

				return digDeeper;
			}
		} else {
			return false;
		}

		return false;
	}
}