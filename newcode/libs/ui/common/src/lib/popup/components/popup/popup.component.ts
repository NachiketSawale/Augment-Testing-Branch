/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterContentInit, Component, ElementRef, inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivePopup } from '../../model/active-popup';
import { IPopupConfig } from '../../model/interfaces/popup-options.interface';
import { PopupResizeDirectionEnum } from '../../model/resize-direction.enum';
import { ResizeEvent } from '../../model/resize-event';

/**
 * Popup window.
 */
@Component({
	selector: 'ui-common-popup',
	templateUrl: './popup.component.html',
	styleUrls: ['./popup.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UiCommonPopupComponent implements OnInit, AfterContentInit, OnDestroy {
	private unbindAutoClose?: () => void;

	private config: IPopupConfig;

	/**
	 * Popup position
	 */
	public position!: {
		name: 'fixed',
		left: number | undefined,
		top: number | undefined,
		right: number | undefined,
		bottom: number | undefined,
		directions: PopupResizeDirectionEnum[]
	};

	/**
	 * Popup size
	 */
	public size!: {
		width: number | undefined,
		height: number | undefined,
		maxWidth: number,
		maxHeight: number
	};

	/**
	 * Popup index
	 */
	public get zIndex() {
		return 10000 + this.activePopup.level;
	}

	private hostElement = inject(ElementRef);
	private activePopup = inject(ActivePopup);
	private renderer = inject(Renderer2);
	private document = inject(DOCUMENT);

	/**
	 * Constructor
	 */
	public constructor() {
		this.config = this.activePopup.config;

		// open popup according to base point, delay initialization to ngAfterContentInit.
		if (!this.config.basePoint) {
			this.initPosAndSize(this.activePopup.ownerElement.nativeElement);
		}
	}

	public ngOnInit(): void {

	}

	public ngAfterContentInit() {
		if (this.config.basePoint) {
			this.initPosAndSizeByBasePoint(this.config.basePoint);
		}
		this.unbindAutoClose = this.autoClose();
		if (!this.config.showHeader) {
			this.removeHeader();
		}
		if (!this.config.showFooter) {
			this.removeFooter();
		}
		if (this.position.bottom && (this.config.showHeader || this.config.showFooter)) {
			this.reverseHeaderAndFooter();
		}
		this.activePopup.fireOpened();
	}

	public ngOnDestroy() {
		if (this.unbindAutoClose) {
			this.unbindAutoClose();
		}
	}

	private getViewportSize() {
		return {
			width: this.document.documentElement.clientWidth || window.innerWidth,
			height: this.document.documentElement.clientHeight || window.innerHeight
		};
	}

	private initPosAndSize(ownerElement: HTMLElement) {
		const vp = this.getViewportSize();
		const bcr = ownerElement.getBoundingClientRect();

		this.position = {
			name: 'fixed',
			left: undefined,
			top: undefined,
			right: undefined,
			bottom: undefined,
			directions: []
		};

		this.size = {
			width: undefined,
			height: undefined,
			maxWidth: 0,
			maxHeight: 0,
		};

		if (this.config.alignment === 'vertical') {
			if (bcr.top > vp.height / 2) { // align top
				this.position.bottom = vp.height - bcr.top;
				this.size.maxHeight = bcr.top;
			} else {// align bottom
				this.position.top = bcr.bottom;
				this.size.maxHeight = vp.height - bcr.bottom;
			}

			if (bcr.left > vp.width / 2) { // align right
				this.position.right = vp.width - bcr.right;
				this.size.maxWidth = bcr.right;
			} else {// align left
				this.position.left = bcr.left;
				this.size.maxWidth = vp.width - bcr.left;
			}

			if (this.config.hasDefaultWidth) {
				this.size.width = bcr.width;
			}
		} else if (this.config.alignment === 'horizontal') {
			if (bcr.bottom > vp.height / 2) { // align top
				this.position.bottom = vp.height - bcr.bottom;
				this.size.maxHeight = bcr.bottom;
			} else {// align bottom
				this.position.top = bcr.top;
				this.size.maxHeight = vp.height - bcr.top;
			}

			if (bcr.right > vp.width / 2) { // align right
				this.position.right = vp.width - bcr.left;
				this.size.maxWidth = bcr.left;
			} else {// align left
				this.position.left = bcr.right;
				this.size.maxWidth = vp.width - bcr.right;
			}
		} else {
			throw new Error('Popup alignment ${this.activePopup.config?.alignment} is not supported');
		}

		if (this.config.width) {
			this.size.width = this.config.width as number;
		}
		if (this.config.height) {
			this.size.height = this.config.height as number;
		}
		if (this.config.resizable) {
			if (this.position.bottom === undefined) {
				this.position.directions.push(PopupResizeDirectionEnum.south);
			} else {
				this.position.directions.push(PopupResizeDirectionEnum.north);
			}
			if (this.position.right === undefined) {
				this.position.directions.push(PopupResizeDirectionEnum.east);
			} else {
				this.position.directions.push(PopupResizeDirectionEnum.west);
			}
			this.position.directions.push(this.position.directions.join('') as PopupResizeDirectionEnum);
		}
	}

	/**
	 * Is current popup parent of specified popup node.
	 * @param popup
	 * @param node
	 * @private
	 */
	private isParent(popup: ActivePopup, node: Node) {
		if (!popup.component) {
			return false;
		}

		let yes = popup.component.location.nativeElement.contains(node);

		if (!yes && popup.children.length > 0) {
			yes = popup.children.some(e => {
				return this.isParent(e, node);
			});
		}

		return yes;
	}

	private autoClose() {
		// bind events during the capture period in case element stop propagation
		const unlistenMD = this.renderer.listen('document', 'mousedown', e => {
			const ownerElement = this.activePopup.ownerElement.nativeElement;

			if (ownerElement.contains(e.target)) {
				return;
			}
			if (this.hostElement.nativeElement.contains(e.target)) {
				return;
			}
			if (this.activePopup.config && this.activePopup.config.relatedElement && this.activePopup.config.relatedElement.nativeElement.contains(e.target)) {
				return;
			}

			if (!this.isParent(this.activePopup, e.target)) {
				this.activePopup.dismiss(e);
			}
		});
		const unlistenMW = this.renderer.listen('document', 'mousewheel', e => {
			if (this.hostElement.nativeElement.contains(e.target)) {
				return;
			}

			if (!this.isParent(this.activePopup, e.target)) {
				this.activePopup.dismiss(e);
			}
		});
		// end

		const unlisten = this.renderer.listen(this.hostElement.nativeElement, 'mousewheel', e => {
			e.stopPropagation();
		});

		return () => {
			unlistenMD();
			unlistenMW();
			unlisten();
		};
	}

	public pixel(value: number | undefined | null | string): string | undefined | null {
		if (typeof value === 'number') {
			return value + 'px';
		}

		return value;
	}

	private removeHeader() {
		const container = this.hostElement.nativeElement.querySelector('.popup-container');
		this.renderer.removeChild(container, container.firstChild);
	}

	private removeFooter() {
		const container = this.hostElement.nativeElement.querySelector('.popup-container');
		this.renderer.removeChild(container, container.lastChild);
	}

	private reverseHeaderAndFooter() {
		const container = this.hostElement.nativeElement.querySelector('.popup-container');
		const header = this.hostElement.nativeElement.querySelector('.popup-header');
		const content = this.hostElement.nativeElement.querySelector('.popup-content');
		const footer = this.hostElement.nativeElement.querySelector('.popup-footer');

		if (header && this.config.showHeader) {
			this.renderer.appendChild(container, header);
		}
		if (footer && this.config.showFooter) {
			this.renderer.insertBefore(container, footer, content);
		}
	}

	/**
	 * On popup resized.
	 * @param e
	 */
	public onResized(e: ResizeEvent) {
		this.activePopup.fireResized(e);
	}

	private initPosAndSizeByBasePoint(basePoint: { pageX: number, pageY: number }) {
		const body = this.document.body;
		const docLeft = body.scrollLeft - body.clientLeft,
			docTop = body.scrollTop - body.clientTop,
			elementSize = this.resolveSize(),
			elementWidth = elementSize.width,
			elementHeight = elementSize.height;
		const docWidth = body.clientWidth + docLeft,
			docHeight = body.clientHeight + docTop,
			totalWidth = elementWidth + basePoint.pageX,
			totalHeight = elementHeight + basePoint.pageY;
		let left = Math.max(basePoint.pageX - docLeft, 0),
			top = Math.max(basePoint.pageY - docTop, 0);

		if (totalWidth > docWidth) {
			left = left - (totalWidth - docWidth);
		}

		if (totalHeight > docHeight) {
			top = top - (totalHeight - docHeight);
		}

		this.position = {
			name: 'fixed',
			left: left,
			top: top,
			right: undefined,
			bottom: undefined,
			directions: []
		};

		this.size = {
			width: undefined,
			height: undefined,
			maxWidth: 900,
			maxHeight: 900,
		};
	}

	private resolveSize() {
		const menuElement = this.hostElement.nativeElement.querySelector('.popup-container');
		const css = window.getComputedStyle(menuElement);
		let elementWidth = menuElement.scrollWidth,
			elementHeight = menuElement.scrollHeight;

		if (menuElement.offsetWidth > elementWidth) {
			elementWidth = menuElement.offsetWidth;
		}

		if (menuElement.offsetHeight > elementHeight) {
			elementHeight = menuElement.offsetHeight;
		}

		elementHeight += this.parsePixelValue(css.marginTop);
		elementHeight += this.parsePixelValue(css.marginBottom);

		elementWidth += this.parsePixelValue(css.marginLeft);
		elementWidth += this.parsePixelValue(css.marginRight);

		return {
			width: elementWidth,
			height: elementHeight
		};
	}

	private parsePixelValue(pixel: string) {
		if (pixel) {
			return Number.parseFloat(pixel.substring(0, pixel.length - 2));
		}

		return 0;
	}

	/**
	 * Close popup
	 * @param result
	 */
	public close(result?: unknown) {
		this.activePopup.close(result);
	}

	/**
	 * Dismiss popup.
	 * @param reason
	 */
	public dismiss(reason?: unknown) {
		this.activePopup.dismiss();
	}
}