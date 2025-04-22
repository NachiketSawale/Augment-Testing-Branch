/*
 * Copyright(c) RIB Software GmbH
 */

export interface ISlickCellBox {
	top: number;
	left: number;
	bottom: number;
	right: number;
	height?: number;
	width?: number;
	visible?: boolean;
}

export interface ISlickElementPosition extends ISlickCellBox {
}
