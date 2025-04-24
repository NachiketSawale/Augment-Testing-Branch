/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Drawing Print Page Orientation Enum
 */
export enum PrintPageOrientation {
	Landscape = 1,
	Portrait = 2
}

/**
 * Drawing Print Page Size Enum
 */
export enum PrintPageSize {
	Default = 0,
	A0 = 1,
	A1 = 2,
	A2 = 3,
	A3 = 4,
	A4 = 5
}

/**
 * Drawing Print Page Section Enum
 */
export enum PrintPageSection {
	Center = 0,
	Left = 1,
	Right = 2,
	Header = 3,
	Footer = 4
}

export enum PrintPageBtnType {
	Company = 0,
	Project = 1,
	Model = 2,
	User = 3,
	Date = 4,
	Page = 5
}