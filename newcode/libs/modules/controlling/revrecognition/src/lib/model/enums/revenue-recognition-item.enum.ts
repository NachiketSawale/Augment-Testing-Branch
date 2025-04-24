/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Controlling Revenue Recognition Item container Item Type
 */
export enum ControllingRevenueRecognitionItemType {
	/**
	 * Group Type
	 */
	GroupType = 0,
	/**
	 * Header Type
	 */
	HeaderType = 1,
	/**
	 * Node Type
	 */
	NodeType = 2,
	/**
	 * Performance Accrual
	 */
	PerformanceAccrual = 3,
	/**
	 * Stock On site
	 */
	StockOnsite = 4,
	/**
	 * Accruals
	 */
	Accruals = 5,
}


export enum ControllingRevenueRecognitionItemStaticType {
	/// <summary>
	///
	/// </summary>
	GroupType = 0,
	/// <summary>
	///
	/// </summary>
	SaleContract = 1,
	/// <summary>
	///
	/// </summary>
	ChangeOrder = 2,
	/// <summary>
	///
	/// </summary>
	Bill = 3,
	/// <summary>
	///
	/// </summary>
	Wip = 4,
	/// <summary>
	///
	/// </summary>
	PerformanceAccrual = 5,
	/// <summary>
	///
	/// </summary>
	ProcurementContract = 6,
	/// <summary>
	///
	/// </summary>
	Invoice = 7,
	/// <summary>
	///
	/// </summary>
	Pes = 8,
	/// <summary>
	///
	/// </summary>
	StocksOnSite = 9,
	/// <summary>
	///
	/// </summary>
	Accruals = 10,
	/// <summary>
	///
	/// </summary>
	ContractConfigHeader = 11,
}



