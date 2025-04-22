/*
 * Copyright(c) RIB Software GmbH
 */

import BlotSpec from './BlotSpec';
import BlotFormatter from '../BlotFormatter';
import Action from '../actions/Action';

/**
 * Image Blot Spec
 */
export default class ImageSpec extends BlotSpec {
	/**
	 * Image element
	 */
	public img: HTMLElement | null;

	public constructor(formatter: BlotFormatter) {
		super(formatter);
		this.img = null;
	}

	/**
	 * init the element
	 */
	public override init() {
		this.formatter.quill.root.addEventListener('click', this.onClick);
	}

	/**
	 * Get the array of action object
	 *
	 * @returns array of Action
	 */
	public override getActions(): Array<Action> {
		const actions = super.getActions();

		return actions;
	}

	/**
	 * get the target element
	 *
	 * @returns HTMLElement
	 */
	public override getTargetElement(): HTMLElement | null {
		return this.img;
	}

	/**
	 * image reset for hide
	 */
	public override onHide() {
		this.img = null;
	}

	/**
	 * this is handled the on click event
	 * @param event MouseEvent
	 */
	public onClick = (event: MouseEvent) => {
		const el = event.target;
		if (el instanceof HTMLImageElement) {
			this.img = el;
			this.formatter.show(this);
		}
	};
}
