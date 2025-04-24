/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 *  Basics Characteristic Section
 */

export enum BasicsCharacteristicSection {
	/// <summary>
	/// Section Name = "Project"
	/// Id = 1
	/// </summary>
	Project = 1,

	/// <summary>
	/// BusinessPartner Characteristics
	/// Id = 2
	/// </summary>
	BusinessPartnerCharacteristic = 2,

	/// <summary>
	/// Section Name = "Contact"
	/// Id = 3
	/// </summary>
	Contact = 3,

	/// <summary>
	/// Section Name = "Clerk"
	/// Id = 4
	Clerk = 4,

	/// <summary>
	/// Section Name = "Certificate"
	/// Id = 5
	/// </summary>
	Certificate = 5,

	/// <summary>
	/// Section Name = "Requisition"
	/// Id = 6
	/// </summary>
	Requisition = 6,

	/// <summary>
	/// Section Name = "Quote"
	/// Id = 7
	/// </summary>
	Quote = 7,

	/// <summary>
	/// Section Name = "Contract"
	/// Id = 8
	/// </summary>
	Contract = 8,

	/// <summary>
	/// Section Name = "ProcurementStructure"
	/// Id = 9
	/// </summary>
	ProcurementStructure = 9,

	/// <summary>
	/// Section Name = "CostCodes"
	/// Id = 10
	/// </summary>
	CostCodes = 10,

	/// <summary>
	/// Section Name = "ControllingUnit"
	/// Id = 11
	/// </summary>
	ControllingUnit = 11,

	/// <summary>
	/// Section Name = "Scheduling"
	/// Id = 12
	/// </summary>
	Scheduling = 12,

	/// <summary>
	/// Section Name = "ActivityTemplate"
	/// Id = 13
	/// </summary>
	ActivityTemplate = 13,

	/// <summary>
	/// Section Name = "Company"
	/// Id = 14
	/// </summary>
	Company = 14,

	/// <summary>
	/// Section Name = "MaterialCatalog"
	/// Id = 15
	/// </summary>
	MaterialCatalog = 15,

	/// <summary>
	/// Section Name = "Material"
	/// Id = 16
	/// </summary>
	Material = 16,

	/// <summary>
	/// Section Name = "ProcurementPackage"
	/// Id = 18
	/// </summary>
	ProcurementPackage = 18,

	/// <summary>
	/// Section Name = "RfQ"
	/// Id = 19
	/// </summary>
	RfQ = 19,

	/// <summary>
	/// Section Name = "Procurement Pes"
	/// Id = 20
	/// </summary>
	ProcurementPes = 20,

	/// <summary>
	/// Section Name = "Procurement Invoice"
	/// Id = 21
	/// </summary>
	ProcurementInvoice = 21,

	/// <summary>
	/// Section Name = "Sales Bid"
	/// Id = 23
	/// </summary>
	SalesBid = 23,

	/// <summary>
	/// Section Name = "Sales Contract"
	/// Id = 24
	/// </summary>
	SalesContract = 24,

	/// <summary>
	/// Section Name = "Sales Wip"
	/// Id = 25
	/// </summary>
	SalesWip = 25,

	/// <summary>
	/// Section Name = "Sales Billing"
	/// Id = 26
	/// </summary>
	SalesBilling = 26,

	/// <summary>
	/// Section Name = "Estimate1"
	/// Id = 27
	/// </summary>
	Estimate1 = 27,

	/// <summary>
	/// Section Name = "Estimate2"
	/// Id = 27
	/// </summary>
	Estimate2 = 28,

	/// <summary>
	/// Section Name = "Assembly1"
	/// Id = 29
	/// </summary>
	Assembly1 = 29,

	/// <summary>
	/// Section Name = "Assembly2"
	/// Id = 30
	/// </summary>
	Assembly2 = 30,

	/// <summary>
	/// Section Name = "Procurement Configuration"
	/// Id = 32
	/// </summary>
	ProcurementConfiguration = 32,

	/// <summary>
	/// Section Name = "Estimate Resources"
	/// Id = 33
	/// </summary>
	EstimateResources = 33,

	/// <summary>
	/// Section Name = "Plant Group"
	/// Id = 34
	/// </summary>
	PlantGroup = 34,

	/// <summary>
	/// Section Name = "Equipment Plant"
	/// Id = 35
	/// </summary>
	EquipmentPlant = 35,

	/// <summary>
	/// Section Name = "Plant Component Type "
	/// Id = 35
	/// </summary>
	PlantComponentType = 37,

	/// <summary>
	/// Section Name = "Project Estimate Characteristic"
	/// Id = 38
	/// </summary>
	ProjectEstimateCharacteristic = 38,

	/// <summary>
	/// Section Name = "Timekeeping Employee"
	/// Id = 39
	/// </summary>
	TimekeepingEmployee = 39,

	/// <summary>
	/// Section Name = "Logistic Dispatching"
	/// Id = 20
	/// </summary>
	LogisticDispatching = 41,

	/// <summary>
	/// Section Name = "ProductionPlanning Item" (Characteristics)
	/// Id = 43
	/// </summary>
	PpsItem = 43,

	/// <summary>
	/// Section Name = "productionplanning.header" (Characteristics)
	/// Id = 44
	/// </summary>
	ProductionplanningHeader = 44,

	/// <summary>
	/// Section Name = "Assembly Resources"
	/// Id = 45
	/// </summary>
	AssemblyResources = 45,

	/// <summary>
	/// Section Name = "procurement.contract" the Contract Characteristics2
	/// Id = 46
	/// </summary>
	ContractCharacteristics2 = 46,

	/// <summary>
	/// Procurement Invoice Characteristics2
	/// Id = 47
	/// </summary>
	InvoiceCharacteristics2 = 47,

	/// <summary>
	/// Section Name = "procurement.package" The Procurement Package Characteristics2
	/// Id = 48
	/// </summary>
	PackageCharacteristics2 = 48,

	/// <summary>
	/// Section Name = "Pes (Performance Entry Sheet) Characteristics2"
	/// Id = 49
	/// </summary>
	PesCharacteristics2 = 49,

	/// <summary>
	/// Section Name = "QuoteCharacteristics2"
	/// Id = 50
	/// </summary>
	QuoteCharacteristics2 = 50,

	/// <summary>
	/// Section Name = "procurement.requisition" the Requisition Characteristics2
	/// Id = 51
	/// </summary>
	RequisitionCharacteristics2 = 51,

	/// <summary>
	/// Section RfQCharacteristics2, RfQ (Request for Quotation) Characteristics2
	/// Id = 52
	/// </summary>
	RfQCharacteristics2 = 52,

	/// <summary>
	/// Logistic Activity Characteristics
	/// Id = 53
	/// </summary>
	LogisticActivityCharacteristic = 53,

	/// <summary>
	/// For Procurement Structure Characteristics2
	/// Id = 54
	/// </summary>
	PrcStructureCharacteristics2 = 54,

	/// <summary>
	/// For Procurement Configuration Characteristics2
	/// Id = 55
	/// </summary>
	PrcConfigurationCharacteristics2 = 55,

	/// <summary>
	/// BusinessPartner Characteristics2
	/// Id = 56
	/// </summary>
	BusinessPartnerCharacteristic2 = 56,

	/// <summary>
	///Section Name = "Revenue Recognition"
	/// Id = 57
	/// </summary>
	RevenueRecognitionCharacteristic = 57,

	/// <summary>
	/// Section Name = "productionplanning.producttemplate" (Characteristics)
	/// Id = 61
	/// </summary>
	ProductTempate = 61,

	/// <summary>
	/// Section Name = "productionplanning.producttemplate" (Characteristics 2)
	/// Id = 62
	/// </summary>
	ProductTempate2 = 62,

	/// <summary>
	/// Section Name = "productionplanning.product" (Characteristics)
	/// Id = 63
	/// </summary>
	Product = 63,

	/// <summary>
	/// Section Name = "productionplanning.product" (Characteristics 2)
	/// Id = 64
	/// </summary>
	Product2 = 64,

	/// <summary>
	/// Section Name = "Sales Bid" (Characteristics 2)
	/// Id = 65
	/// </summary>
	SalesBid2 = 65,

	/// <summary>
	/// Section Name = "Sales Contract" (Characteristics 2)
	/// Id = 66
	/// </summary>
	SalesContract2 = 66,

	/// <summary>
	/// Section Name = "Sales Wip" (Characteristics 2)
	/// Id = 67
	/// </summary>
	SalesWip2 = 67,

	/// <summary>
	/// Section Name = "Sales Billing" (Characteristics 2)
	/// Id = 68
	/// </summary>
	SalesBilling2 = 68,

	/// <summary>
	/// Section Name = "ProductionPlanning Item" (Characteristics 2)
	/// Id = 69
	/// </summary>
	PpsItem2 = 69,

	/// <summary>
	/// Section Name = "productionplanning.engineering" (Characteristics)
	/// Id = 70
	/// </summary>
	Engineering = 70,

	/// <summary>
	/// Section Name = "productionplanning.engineering" (Characteristics 2)
	/// Id = 71
	/// </summary>
	Engineering2 = 71,
}
