/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickCellBox } from "./slick-cell-box.interface";

export interface ISlickEditor {
	/** remove all data, events & dom elements created in the constructor */
	destroy(): void;

	/** set the focus on the main input control (if any) */
	focus(): void;

	/** return true if the value(s) being edited by the user has/have been changed */
	isValueChanged(): boolean;

	/**
	 * return the value(s) being edited by the user in a serialized form
	 * can be an arbitrary object
	 * the only restriction is that it must be a simple object that can be passed around even
	 * when the editor itself has been destroyed
	 */
	serializeValue(): any;

	/**
	 * load the value(s) from the data item and update the UI
	 * this method will be called immediately after the editor is initialized
	 * it may also be called by the grid if if the row/cell being edited is updated via grid.updateRow/updateCell
	 */
	loadValue(item: any): void;

	/**
	 * deserialize the value(s) saved to "state" and apply them to the data item
	 * this method may get called after the editor itself has been destroyed
	 * treat it as an equivalent of a Java/C# "static" method - no instance variables should be accessed
	 */
	applyValue(item: any,state:any): void;

	/**
	 * validate user input and return the result along with the validation message, if any
	 * if the input is valid, return {valid:true,msg:null}
	 */
	validate(): { valid: boolean, msg: string | null };

	/*********** OPTIONAL METHODS***********/

	/**
	 * if implemented, this will be called if the cell being edited is scrolled out of the view
	 * implement this is your UI is not appended to the cell itself or if you open any secondary
	 * selector controls (like a calendar for a datepicker input)
	 */
	hide?(): void;

	/**
	 * pretty much the opposite of hide
 	 */
	show?(): void;

	/**
	 * if implemented, this will be called by the grid if any of the cell containers are scrolled
	 * and the absolute position of the edited cell is changed
	 * if your UI is constructed as a child of document BODY, implement this to update the
	 * position of the elements as the position of the cell changes
	 */
	position?(cellBox: ISlickCellBox): any;
}
