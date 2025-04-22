/*
 * Copyright(c) RIB Software GmbH
 */

export enum PrcStockTransactionType {
	MaterialReceipt = 1,
	IncidentalAcquisitionExpense = 2,
	MaterialConsumption = 3,
	Relocation = 4,
	Wastage = 5,
	OutwardMovement = 6,
	InwardMovement = 7,
	ProvisionModification = 8,
	ConsumptionReservation = 10,
	ReceiptDelta = 11,
	InventoryStockedItem = 12,
	InventoryNewItem = 13,
}
