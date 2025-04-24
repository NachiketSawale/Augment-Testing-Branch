/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * This constant describes the Estimate Item Info Types
 */
export enum EstimateMainResourceType {
	Disabled = 'estimate.main.itemInfo.disabled', // Disabled Item
	DisabledPrc = 'estimate.main.itemInfo.disabledPrc', // Disabled by Procurement (Resource Container            // Optional Item
	OptionalIT = 'estimate.main.itemInfo.optionalIT', // Optional Item with IT
	Lumpsum = 'estimate.main.itemInfo.lumpSum', // Lumpsum Item
	DayWorkItem = 'estimate.main.itemInfo.dayWorkItem', // DayWork Rate Item (LineItem Container)
	GcItem = 'estimate.main.itemInfo.gcItem', // GC Item
	NoMarkup = 'estimate.main.itemInfo.noMarkup', // No Markup Item (LineItem Container)
	FixedBudget = 'estimate.main.itemInfo.fixedBudget', // Fixed Budget Item
	FixedPrice = 'estimate.main.itemInfo.fixedPrice', // Fixed Price Item (LineItem Container)
	NoLeadQuantity = 'estimate.main.itemInfo.noLeadQuantity', // No Lead Quantity Item (LineItem Container)
	Included = 'estimate.main.itemInfo.included', // Included Quantity Item
	MarkupCost = 'estimate.main.itemInfo.markupCost', // Markup Cost on Resource (Resource Container)
	NoBudget = 'estimate.main.itemInfo.noBudget', // No Budget on Resource Item (Resource Container)
	GenerateByPrc = 'estimate.main.itemInfo.generateByPrc', // Is Generated From Procurement (Resource Container)
}
