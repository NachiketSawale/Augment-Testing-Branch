/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IPopupConfig} from './interfaces/popup-options.interface';
import {Observable, Subject} from 'rxjs';
import {ComponentRef, ElementRef, ViewRef} from '@angular/core';
import {ResizeEvent} from './resize-event';

/**
 * A reference to the currently opened (active) popup returned by the `popupService.open()` method
 *
 * Instances of this class can be injected into your component passed as popup content.
 * So you can `.close()` the popup window from your component.
 */
export class ActivePopup {
	private viewRef!: ViewRef;
	private componentRef!: ComponentRef<unknown>;
	private openedSubject = new Subject<unknown>();
	private closedSubject = new Subject<unknown>();
	private closingSubject = new Subject<{ canClose: boolean, reason?: unknown, result?:unknown }>();
	private resizedSubject = new Subject<ResizeEvent>();

	public level = 0;
	private _parent?: ActivePopup;
	private _children: ActivePopup[] = [];

	public get parent() {
		return this._parent;
	}

	public set parent(value: ActivePopup | undefined) {
		this._parent = value;

		if (this._parent) {
			this.level = this._parent.level + 1;
			this._parent.appendChild(this);
		}
	}

	public get children() {
		return this._children;
	}

	public appendChild(child: ActivePopup) {
		child._parent = this;
		this._children.push(child);
	}

	public removeChild(child: ActivePopup) {
		child._parent = undefined;
		this._children = this._children.filter(e => e !== child);
	}

	public removeAllChildren() {
		this._children.forEach(e => e._parent = undefined);
		this._children = [];
	}

	public get view(): ViewRef {
		return this.viewRef;
	}

	public set view(value: ViewRef) {
		this.viewRef = value;
	}

	public get component(): ComponentRef<unknown> {
		return this.componentRef;
	}

	public set component(value: ComponentRef<unknown>) {
		this.componentRef = value;
		this.viewRef = value.hostView;
	}

	public get opened(): Observable<unknown> {
		return this.openedSubject.asObservable();
	}

	public get closed(): Observable<unknown> {
		return this.closedSubject.asObservable();
	}

	public get closing(): Observable<{ canClose: boolean, reason?: unknown, result?: unknown }> {
		return this.closingSubject.asObservable();
	}

	public get resized(): Observable<ResizeEvent> {
		return this.resizedSubject.asObservable();
	}

	/**
	 * The instance of a component used for the popup content.
	 *
	 * When a `TemplateRef` is used as the content or when the popup is closed, will return `undefined`.
	 */
	private get contentInstance() {
		if (this.componentRef) {
			return this.componentRef.instance;
		}
		return null;
	}

	public constructor(public ownerElement: ElementRef, public config: IPopupConfig) {
		this.level = config.level || 0;
	}

	/**
	 * Fired while popup window is completely opened.
	 * @param result
	 */
	public fireOpened(result?: unknown) {
		this.openedSubject.next(result);
	}

	/**
	 * Fired when popup is resized
	 * @param e
	 */
	public fireResized(e: ResizeEvent) {
		this.resizedSubject.next(e);
	}

	/**
	 * Closes the popup with an optional `result` value.
	 *
	 * The `PopupRef.result` promise will be resolved with the provided value.
	 */
	public close(result?: unknown): void {
		const closingArgs = {
			canClose: true,
			result: result
		};
		this.closingSubject.next(closingArgs);

		if(!closingArgs.canClose) {
			return;
		}

		this.closedSubject.next(result);
		this.destroy();
	}

	/**
	 * Closes the popup with an optional `reason` value.
	 *
	 * The `PopupRef.result` promise will be rejected with the provided value.
	 */
	public dismiss(reason?: unknown): void {
		const closingArgs = {
			canClose: true,
			reason: reason
		};
		this.closingSubject.next(closingArgs);

		if(!closingArgs.canClose) {
			return;
		}

		this.closedSubject.next(reason);
		this.destroy();
	}

	public destroy(): void {
		if (this._parent) {
			this._parent.removeChild(this);
		}
		if (this.componentRef) {
			this.componentRef.destroy();
		} else {
			this.viewRef.destroy();
		}
	}
}