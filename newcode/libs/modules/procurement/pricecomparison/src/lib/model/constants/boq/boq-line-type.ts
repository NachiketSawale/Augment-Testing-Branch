/*
 * Copyright(c) RIB Software GmbH
 */
// TODO-DRIZZLE: Using the same enum in @libs/boq/main.
export const BoqLineType = {
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
};