/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import deepmerge from 'deepmerge';
import DefaultOptions, { Options } from './Options';
import Action from './actions/Action';
import BlotSpec from './specs/BlotSpec';
import Image from './blots/Image';

import ImageResizerForm from './actions/image-resizer/image-resizer-form';
import { TextEditorSettingsService } from '../../services/text-editor-settings.service';

const dontMerge = (destination: Array<unknown>, source: Array<unknown>) => source;

/**
 * Blot Formatter
 */
export default class BlotFormatter {
	/**
	 * Quill Object
	 */
	public quill!: Quill;

	/**
	 * Option Object
	 */
	public options: Options;

	/**
	 * current Spec
	 */
	public currentSpec: BlotSpec | null;

	/**
	 * Blot Spec
	 */
	public specs: BlotSpec[];

	/**
	 * overlay element
	 */
	public overlay: HTMLElement;

	/**
	 * image resize form
	 */
	public imageResizeForm: ImageResizerForm;

	/**
	 * Size info element
	 */
	public sizeInfo: HTMLElement;

	/**
	 * Action Objects
	 */
	public actions: Action[];

	/**
	 * startX
	 */
	public startX: number = 0; // touch scroll tracking

	/**
	 * startY
	 */
	public startY: number = 0;

	/**
	 * textEditor Settings Service
	 */
	public textEditorSettingsService?: TextEditorSettingsService;

	public constructor(quill: Quill, options: Partial<Options> = {}) {
		this.quill = quill;
		this.currentSpec = null;
		this.actions = [];
		if (options.textEditorSettingsService) {
			this.textEditorSettingsService = options.textEditorSettingsService;
		}

		// disable Blot Formatter behaviour when editor is read only
		if (quill.options.readOnly) {
			this.options = DefaultOptions;
			this.imageResizeForm = new ImageResizerForm(this);
			this.specs = [];
			this.overlay = document.createElement('div');
			this.sizeInfo = document.createElement('div');
			return;
		}

		// merge custom options with default
		this.options = deepmerge(DefaultOptions, options, { arrayMerge: dontMerge });
		// create overlay & size info plus associated event listeners
		[this.overlay, this.sizeInfo] = this.createOverlay();
		this.addEventListeners();
		// create overlay toolbar
		this.imageResizeForm = new ImageResizerForm(this);
		// define which specs to be formatted, initialise each
		this.specs = this.options.specs.map((SpecClass: new (formatter: BlotFormatter) => BlotSpec) => new SpecClass(this));
		this.specs.forEach((spec) => spec.init());
		// disable native image resizing on firefox
		document.execCommand('enableObjectResizing', false, 'false'); // eslint-disable-line no-undef
		// set position relative on quill container for absolute positioning of overlay & proxies
		this.quill.container.style.position = this.quill.container.style.position || 'relative';
		// register custom blots as per options
		this.registerCustomBlots();
	}

	/**
	 * This function shown the image overlay bolt
	 * @param spec Blot Spec
	 */
	public show(spec: BlotSpec) {
		// clear overlay in case show called while overlay active on other blot
		this.hide();
		this.currentSpec = spec;
		this.currentSpec.setSelection();
		this.setUserSelect('none');
		this.quill.container.appendChild(this.overlay);
		this.repositionOverlay();
		this.createActions(spec);
		this.imageResizeForm.create();
		document.addEventListener('pointerdown', this.onDocumentPointerDown);
	}

	/**
	 * This function used for hide the image overlay bolt
	 */
	public hide() {
		if (this.currentSpec) {
			this.currentSpec.onHide();
			this.currentSpec = null;
			this.quill.container.removeChild(this.overlay);
			document.removeEventListener('pointerdown', this.onDocumentPointerDown);
			this.overlay.style.setProperty('display', 'none');
			this.setUserSelect('');
			this.destroyActions();
			this.imageResizeForm.destroy();
		}
	}

	/**
	 * Update Image Overlay bolt
	 */
	public update() {
		this.repositionOverlay();
	}

	/**
	 * This function to create the action
	 * @param spec Blot Spec
	 */
	public createActions(spec: BlotSpec) {
		this.actions = spec.getActions().map((action: Action) => {
			action.onCreate();
			return action;
		});
	}

	/**
	 * This function is used for destroy Actions
	 */
	public destroyActions() {
		this.actions.forEach((action: Action) => action.onDestroy());
		this.actions = [];
	}

	/**
	 * This function is used for create the image overlay bolt
	 *
	 * @returns  array of html element
	 */
	private createOverlay(): [HTMLElement, HTMLElement] {
		const overlay = document.createElement('div');
		// set up overlay element
		overlay.classList.add(this.options.overlay.className);
		if (this.options.overlay.style) {
			Object.assign(overlay.style, this.options.overlay.style);
		}
		// prevent overlay being selectable
		overlay.style.userSelect = 'none';
		overlay.style.setProperty('-webkit-user-select', 'none');
		overlay.style.setProperty('-moz-user-select', 'none');
		overlay.style.setProperty('-ms-user-select', 'none');

		const sizeInfo = document.createElement('div');
		if (this.options.overlay.sizeInfoStyle) {
			Object.assign(sizeInfo.style, this.options.overlay.sizeInfoStyle);
		}
		overlay.appendChild(sizeInfo);

		return [overlay, sizeInfo];
	}

	/**
	 * This function is used for added the event listener on bolt
	 */
	private addEventListeners(): void {
		// overlay event listeners
		// scroll the quill root on mouse wheel & touch move event
		this.overlay.addEventListener('wheel', this.passWheelEventThrough);
		this.overlay.addEventListener('touchstart', this.onTouchScrollStart, { passive: false });
		this.overlay.addEventListener('touchmove', this.onTouchScrollMove, { passive: false });
		// disable context menu on overlay
		this.overlay.addEventListener('contextmenu', (event) => {
			event.stopPropagation();
			event.preventDefault();
		});

		// quill root event listeners
		// scroll visible overlay if editor is scrollable
		this.repositionOverlay = this.repositionOverlay.bind(this);
		this.quill.root.addEventListener('scroll', this.repositionOverlay);
		// reposition overlay element if editor resized
		new ResizeObserver(() => {
			this.repositionOverlay();
		}).observe(this.quill.root);
		// dismiss overlay if active and click on quill root
		this.quill.root.addEventListener('click', this.onClick);
	}

	/**
	 * This function is used for reposition Overlay
	 */
	public repositionOverlay() {
		if (this.currentSpec) {
			const overlayTarget = this.currentSpec.getOverlayElement();
			if (overlayTarget) {
				const containerRect: DOMRect = this.quill.container.getBoundingClientRect();
				const specRect: DOMRect = overlayTarget.getBoundingClientRect();
				Object.assign(this.overlay.style, {
					display: 'block',
					left: `${specRect.left - containerRect.left - 1 + this.quill.container.scrollLeft}px`,
					top: `${specRect.top - containerRect.top + this.quill.container.scrollTop}px`,
					width: `${specRect.width}px`,
					height: `${specRect.height}px`,
				});
			}
		}
	}

	/**
	 * This function used for set the value on  contenteditable element
	 *
	 * @param value select element attribute value
	 */
	private setUserSelect(value: string) {
		const props: string[] = ['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'];

		props.forEach((prop: string) => {
			// set on contenteditable element and <html>
			this.quill.root.style.setProperty(prop, value);
			if (document.documentElement) {
				document.documentElement.style.setProperty(prop, value);
			}
		});
	}

	/**
	 * This function is used for to set the on Document Pointer Down event
	 * @param event pointer event object
	 */
	private onDocumentPointerDown = (event: PointerEvent) => {
		// if clicked outside of quill editor and not the alt/title modal or iframe proxy image, dismiss overlay
		const target = event.target as HTMLElement;
		if (!(this.quill.root.parentNode?.contains(target) || target.closest('div[data-blot-formatter-modal]') || target.classList.contains('blot-formatter__proxy-image'))) {
			this.hide();
		}
	};

	/**
	 * This function is used for onlick event on editor
	 */
	private onClick = () => {
		this.hide();
	};

	/**
	 * scroll the quill root element when overlay or proxy wheel scrolled
	 *
	 * @param event scroll/ Wheel Event
	 */
	public passWheelEventThrough = (event: WheelEvent) => {
		// scroll the quill root element when overlay or proxy wheel scrolled
		this.quill.root.scrollLeft += event.deltaX;
		this.quill.root.scrollTop += event.deltaY;
	};

	/**
	 * Record the initial touch positions
	 * @param event Touch Event
	 */
	public onTouchScrollStart = (event: TouchEvent) => {
		// Record the initial touch positions
		if (event.touches.length === 1) {
			const touch = event.touches[0];
			this.startX = touch.clientX;
			this.startY = touch.clientY;
		}
	};

	/**
	 * To handled the mouse or touch scroll event
	 *
	 * @param event Touch Event
	 */
	public onTouchScrollMove = (event: TouchEvent) => {
		if (event.touches.length === 1) {
			const touch = event.touches[0];
			const deltaX = this.startX - touch.clientX;
			const deltaY = this.startY - touch.clientY;

			const root = this.quill.root;

			// Check if we can scroll further vertically and horizontally
			const atTop = root.scrollTop === 0;
			const atBottom = root.scrollTop + root.clientHeight === root.scrollHeight;
			const atLeft = root.scrollLeft === 0;
			const atRight = root.scrollLeft + root.clientWidth === root.scrollWidth;

			// Determine if we're scrolling vertically or horizontally
			const isScrollingVertically = Math.abs(deltaY) > Math.abs(deltaX);
			const isScrollingHorizontally = Math.abs(deltaX) > Math.abs(deltaY);

			let preventDefault = false;

			// If scrolling vertically
			if (isScrollingVertically) {
				if (!(atTop && deltaY < 0) && !(atBottom && deltaY > 0)) {
					preventDefault = true; // Prevent default only if we can scroll further
					root.scrollTop += deltaY;
				}
			}

			// If scrolling horizontally
			if (isScrollingHorizontally) {
				if (!(atLeft && deltaX < 0) && !(atRight && deltaX > 0)) {
					preventDefault = true; // Prevent default only if we can scroll further
					root.scrollLeft += deltaX;
				}
			}

			if (preventDefault) {
				event.preventDefault(); // Prevent default scrolling if necessary
			}

			// Update start positions for the next move event
			this.startX = touch.clientX;
			this.startY = touch.clientY;
		}
	};

	/**
	 * TO handled the overlay touch scroll move event
	 * @param event TouchEvent
	 */
	public onOverlayTouchScrollMove = (event: TouchEvent) => {
		this.onTouchScrollMove(event);
		this.repositionOverlay();
	};

	/**
	 * register image bot with title attribute support
	 */
	public registerCustomBlots() {
		// register image bot with title attribute support
		if (this.options.image.registerImageTitleBlot) {
			Quill.register(Image, true);
		}
		// register custom video blot with initial width 100% & aspect ratio from options
	}

	/**
	 * To check the width is not set, use useRelativeSize by default else respect existing type
	 *
	 * @param targetElement HTMLElement
	 * @returns width is set as % rather than px (% of quill root width minus padding)
	 * 			if allowResizeModeChange=false, unknown resized blot will use this if allowResizeModeChange=true,
	 */
	public useRelative(targetElement: HTMLElement): boolean {
		if (!this.options.resize.allowResizeModeChange) {
			// mode change not allowed, always take useRelativeSize value
			return this.options.resize.useRelativeSize;
		} else {
			// if no width set, use useRelativeSize by default else respect existing type
			const width: string | null = targetElement.getAttribute('width');
			if (!width) {
				return this.options.resize.useRelativeSize;
			} else {
				return width.endsWith('%');
			}
		}
	}
}
