/*
 * Copyright(c) RIB Software GmbH
 */
export enum ProcurementStockTransactionType {
	MaterialReceipt = 1,
	IncidentalAcquisitionExpense = 2,
	MaterialConsumption = 3,
	Relocation = 4,
	Wastage = 5,
	OutwardMovement = 6,
	InwardMovement = 7,
	ProvisionModification = 8,
	ConsumptionReservation = 9,
	ReceiptDelta = 10,
	InventoryStockedItem = 11,
	InventoryNewItem = 12,
}
