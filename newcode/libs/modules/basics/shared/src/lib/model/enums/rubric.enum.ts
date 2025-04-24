/*
 * Copyright(c) RIB Software GmbH
 */

export enum Rubric {
	/**
	 * Business Partner
	 */
	BusinessPartner = 1,
	/**
	 * Contact
	 */
	Contact = 2,
	/**
	 * Project
	 */
	Project = 3,
	/**
	 * Bid
	 */
	Bid = 4,
	/**
	 * Order (SalesContract)
	 */
	Order = 5,
	/**
	 * QTO
	 */
	QTO = 6,
	/**
	 * Bill (SalesBilling)
	 */
	Bill = 7,
	/**
	 * WIC
	 */
	WIC = 8,
	/**
	 * Project BoQ
	 */
	ProjectBoQ = 9,
	/**
	 * Customer
	 */
	Customer = 10,
	/**
	 * Supplier
	 */
	Supplier = 11,
	/**
	 * Material
	 */
	Material = 12,
	/**
	 * Payment
	 */
	Payment = 13,
	/**
	 * Change Order
	 */
	ChangeOrder = 14,
	/**
	 * WIP
	 */
	WIP = 17,
	/**
	 * Estimate
	 */
	Estimate = 18,
	/**
	 * Procurement Master
	 */
	ProcurementMaster = 20,
	/**
	 * Ticket System
	 */
	TicketSystem = 22,
	/**
	 * Requisition
	 */
	Requisition = 23,
	/**
	 * RFQs
	 */
	RFQs = 24,
	/**
	 * Quotation
	 */
	Quotation = 25,
	/**
	 * Contract
	 */
	Contract = 26,
	/**
	 * Performance Entry Sheets
	 */
	PerformanceEntrySheets = 27,
	/**
	 * Invoices
	 */
	Invoices = 28,
	/**
	 * Contract Configuration
	 */
	ContractConfiguration = 29,
	/**
	 * Plant Group
	 */
	PlantGroup = 30,
	/**
	 * Package
	 */
	Package = 31,
	/**
	 * Schedulinge
	 */
	Schedulinge = 32,
	/**
	 * Evaluation
	 */
	Evaluation = 33,
	/**
	 * Logistic Dispatching
	 */
	LogisticDispatching = 34,
	/**
	 * Logistic Job
	 */
	LogisticJob = 35,
	/**
	 * Logistic Invoice
	 */
	LogisticInvoice = 36,
	/**
	 * Logistic Job Card
	 */
	LogisticJobCard = 37,
	/**
	 * Information Request
	 */
	InformationRequest = 38,
	/**
	 * RFIs
	 */
	RFIs = 39,
	/**
	 * Documents
	 */
	Documents = 40,
	/**
	 * Project Sales
	 */
	ProjectSales = 41,
	/**
	 * Controlling Units
	 */
	ControllingUnits = 50,
	/**
	 * Construction Systems
	 */
	ConstructionSystems = 60,
	/**
	 * Model
	 */
	Model = 61,
	/**
	 * Estimate Rules
	 */
	EstimateRules = 70,
	/**
	 * Site
	 */
	Site = 71,
	/**
	 * ResourceMaster
	 */
	ResourceMaster = 72,
	/**
	 * Defect Management
	 */
	DefectManagement = 73,
	/**
	 * Mounting
	 */
	Mounting = 74,
	/**
	 * Production Planning
	 */
	ProductionPlanning = 75,
	/**
	 * Transport Planning
	 */
	TransportPlanning = 76,
	/**
	 * Engineering
	 */
	Engineering = 77,
	/**
	 * Estimate LineItem
	 */
	EstimateLineItem = 78,
	/**
	 * Project Rule
	 */
	ProjectRule = 79,
	/**
	 * Clerk
	 */
	Clerk = 80,
	/**
	 * Activity Template Group
	 */
	ActivityTemplateGroup = 81,
	/**
	 * Timekeeping
	 */
	Timekeeping = 82,
	/**
	 * Object Units
	 */
	ObjectUnits = 83,
	/**
	 * Production Unit
	 */
	ProductionUnit = 84,
	/**
	 * Location
	 */
	Location = 85,
	/**
	 * PPS Upstream Item
	 */
	PPSUpstreamItem = 86,
	/**
	 * QTO Formula
	 */
	QTOFormula = 87,
	/**
	 * Installation report
	 */
	Installationreport = 88,
	/**
	 * PPS Product
	 */
	PPSProduct = 89,
	/**
	 * Check List
	 */
	CheckList = 90,
	/**
	 * Check List Template
	 */
	CheckListTemplate = 91,
	/**
	 * Actuals
	 */
	Actuals = 92,
	/**
	 * Timekeeping Employee
	 */
	TimekeepingEmployee = 93,
	/**
	 * Timekeeping Recording
	 */
	TimekeepingRecording = 94,
	/**
	 * Timekeeping Group
	 */
	TimekeepingGroup = 95,
	/**
	 * Timekeeping Time Symbol
	 */
	TimekeepingTimeSymbol = 96,
	/**
	 * Meeting
	 */
	Meeting = 97,
	/**
	 * Resource Requisition
	 */
	ResourceRequisition = 98,
	/**
	 * Resource Reservation
	 */
	ResourceReservation = 99,
	/**
	 * Accounting Journals
	 */
	AccountingJournals = 100,
	/**
	 * Process
	 */
	Process = 101,
	/**
	 * Timekeeping Settlement
	 */
	TimekeepingSettlement = 104,
	/**
	 * Plant Supplier
	 */
	PlantSupplier = 105,
	/**
	 * Procurement Structure
	 */
	ProcurementStructure = 106,
	/**
	 * Time Allocation
	 */
	TimeAllocation = 107,
}


/**
 * ProcurementRubric
 */
export const ProcurementRubric = [Rubric.Requisition, Rubric.RFQs, Rubric.Quotation, Rubric.Contract,
	Rubric.PerformanceEntrySheets, Rubric.Invoices, Rubric.Package, Rubric.ProcurementStructure];

/**
 * SalesRubric
 */
export const SalesRubric = [Rubric.Bid, Rubric.Order, Rubric.Bill, Rubric.WIP];

/**
 * ProjectRubric
 */
export const ProjectRubric = [Rubric.Project];
/**
 * ClerkRubric
 */
export const ClerkRubric = [Rubric.Clerk];