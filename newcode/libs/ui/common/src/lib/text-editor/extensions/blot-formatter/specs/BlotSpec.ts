/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import BlotFormatter from '../BlotFormatter';
import Action from '../actions/Action';
import ResizeAction from '../actions/ResizeAction';
import DeleteAction from '../actions/DeleteAction';

/**
 * Bolt
 */
export interface Blot {
	/**
	 * Dom Node
	 */
	domNode: HTMLElement;
	/**
	 * Parrent Bolt
	 */
	parent: Blot | null;

	/**
	 * Next bolt
	 */
	next: Blot | null;

	/**
	 * Previous Bolt
	 */
	prev: Blot | null;

	/**
	 * statics
	 */
	statics: unknown | null;

	/**
	 * format element function
	 *
	 * @param name attribute name
	 * @param value attribute value
	 */
	format(name: string, value: unknown): void | undefined;

	/**
	 * formats selected element
	 */
	formats(): { [key: string]: unknown };

	/**
	 * get the length selected element
	 */
	length(): number;
}

/**
 * BlotSpec
 */
export default abstract class BlotSpec {
	/**
	 * formatter
	 */
	public formatter: BlotFormatter;

	/**
	 * isUnclickable
	 */
	public isUnclickable: boolean = false;

	public constructor(formatter: BlotFormatter) {
		this.formatter = formatter;
	}

	/**
	 * init function of bolt sepc
	 */
	public abstract init(): void;

	/**
	 * Get the Action objects
	 *
	 * @returns array of Action
	 */
	public getActions(): Array<Action> {
		const actions: Array<Action> = [];

		if (this.formatter.options.resize.allowResizing) {
			actions.push(new ResizeAction(this.formatter));
		}
		if (this.formatter.options.delete.allowKeyboardDelete) {
			actions.push(new DeleteAction(this.formatter));
		}
		return actions;
	}

	/**
	 * get Taget Element
	 *
	 * @returns HTMLElement
	 */
	public getTargetElement(): HTMLElement | null {
		return null;
	}

	/**
	 * get Target Blot
	 * @returns Bolt
	 */
	public getTargetBlot(): Blot | null {
		const target = this.getTargetElement();
		if (target) {
			return Quill.find(target) as unknown as Blot | null;
		} else {
			return null;
		}
	}

	/**
	 * get Overlay Element
	 * @returns HTMLElement
	 */
	public getOverlayElement(): HTMLElement | null {
		return this.getTargetElement();
	}

	/**
	 * setSelection on editor section
	 */
	public setSelection(): void {
		this.formatter.quill.setSelection(null);
	}

	public onHide() {}
}
