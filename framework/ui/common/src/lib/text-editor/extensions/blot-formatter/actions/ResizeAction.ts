/*
 * Copyright(c) RIB Software GmbH
 */

import Action from './Action';
import BlotFormatter from '../BlotFormatter';

/**
 * HandleStyle
 */
interface HandleStyle {
	/**
	 * width
	 */
	width?: string;
	/**
	 * height
	 */
	height?: string;
}

/**
 * Image bolt Resize Action
 */
export default class ResizeAction extends Action {
	/**
	 * topLeftHandle
	 */
	public topLeftHandle: HTMLElement;

	/**
	 * topRightHandle
	 */
	public topRightHandle: HTMLElement;
	/**
	 * bottomRightHandle
	 */
	public bottomRightHandle: HTMLElement;
	/**
	 * bottomLeftHandle
	 */
	public bottomLeftHandle: HTMLElement;
	/**
	 * dragHandle
	 */
	public dragHandle: HTMLElement | null | undefined = null;

	/**
	 * dragStartX
	 */
	public dragStartX: number = 0;

	/**
	 * dragCursorStyle
	 */
	public dragCursorStyle: HTMLElement;
	/**
	 * preDragWidth
	 */
	public preDragWidth: number = 0;
	/**
	 * pinchStartDistance
	 */
	public pinchStartDistance: number = 0;
	/**
	 * calculatedAspectRatio
	 */
	public calculatedAspectRatio: number = 0;
	/**
	 * computedAspectRatio
	 */
	public computedAspectRatio: string | undefined = undefined;
	/**
	 * target
	 */
	public target: HTMLElement | null | undefined;
	/**
	 * editorStyle
	 */
	public editorStyle: CSSStyleDeclaration | undefined;
	/**
	 * editorWidth
	 */
	public editorWidth: number = 0;
	/**
	 * useRelativeSize
	 */
	public useRelativeSize: boolean;
	/**
	 * isUnclickable
	 */
	public isUnclickable: boolean = false;

	/**
	 * hasResized
	 */
	public hasResized: boolean = false;

	/**
	 * formattedWidth
	 */
	public formattedWidth: string = '';

	/**
	 * sizeInfoTimerId
	 */
	private sizeInfoTimerId: ReturnType<typeof setTimeout> | null = null;

	/**
	 * isImage
	 */
	private isImage: boolean = false;
	/**
	 * isSVG
	 */
	private isSVG: boolean = false;
	/**
	 * naturalWidth
	 */
	private naturalWidth: number | undefined = undefined;

	public constructor(formatter: BlotFormatter) {
		super(formatter);
		this.topLeftHandle = this.createHandle('top-left', 'nwse-resize');
		this.topRightHandle = this.createHandle('top-right', 'nesw-resize');
		this.bottomRightHandle = this.createHandle('bottom-right', 'nwse-resize');
		this.bottomLeftHandle = this.createHandle('bottom-left', 'nesw-resize');
		this.dragCursorStyle = document.createElement('style');
		this.useRelativeSize = this.formatter.options.resize.useRelativeSize;
	}

	/**
	 * On create the bolt
	 */
	public override onCreate() {
		this.target = this.formatter.currentSpec?.getTargetElement();
		this.isUnclickable = this.formatter.currentSpec?.isUnclickable || false;
		this.isImage = this.target instanceof HTMLImageElement;
		if (this.isImage) {
			this.isSVG = this.isSvgImage();
		}

		this.formatter.overlay.appendChild(this.topLeftHandle);
		this.formatter.overlay.appendChild(this.topRightHandle);
		this.formatter.overlay.appendChild(this.bottomRightHandle);
		this.formatter.overlay.appendChild(this.bottomLeftHandle);
		this.formatter.overlay.addEventListener('mousedown', this.onOverlayMouseDown);
		this.formatter.overlay.addEventListener('mouseup', this.onOverlayMouseUp);
		this.formatter.overlay.addEventListener('touchstart', this.onOverlayTouchStart as EventListener, { passive: false } as EventListenerOptions);
		this.formatter.overlay.addEventListener('touchmove', this.onOverlayTouchMove, { passive: false } as EventListenerOptions);
		this.formatter.overlay.addEventListener('touchend', this.onOverlayTouchEnd, { passive: false } as EventListenerOptions);

		const handleStyle: HandleStyle = this.formatter.options.resize.handleStyle || {};
		this.repositionHandles(handleStyle);
	}

	/**
	 * On Destory bolt
	 */
	public override onDestroy() {
		this.target = null;
		this.isUnclickable = false;
		this.isImage = false;
		this.naturalWidth = undefined;
		this.isSVG = false;
		this.setCursor('');
		this.formatter.overlay.removeChild(this.topLeftHandle);
		this.formatter.overlay.removeChild(this.topRightHandle);
		this.formatter.overlay.removeChild(this.bottomRightHandle);
		this.formatter.overlay.removeChild(this.bottomLeftHandle);
		this.formatter.overlay.removeEventListener('mousedown', this.onOverlayMouseDown);
		this.formatter.overlay.removeEventListener('mouseup', this.onOverlayMouseUp);
		this.formatter.overlay.removeEventListener('touchstart', this.onOverlayTouchStart as EventListener, { passive: false } as EventListenerOptions);
		this.formatter.overlay.removeEventListener('touchmove', this.onOverlayTouchMove as EventListener, { passive: false } as EventListenerOptions);
		this.formatter.overlay.removeEventListener('touchend', this.onOverlayTouchEnd as EventListener, { passive: false } as EventListenerOptions);
		this.formatter.update();
	}

	/**
	 * create resize handles
	 *
	 * @param position string
	 * @param cursor string
	 * @returns HTMLElement
	 */
	public createHandle(position: string, cursor: string): HTMLElement {
		// create resize handles
		const box = document.createElement('div');
		box.classList.add(this.formatter.options.resize.handleClassName);
		box.setAttribute('data-position', position);
		box.style.cursor = cursor;
		if (this.formatter.options.resize.handleStyle) {
			Object.assign(box.style, this.formatter.options.resize.handleStyle);
		}
		box.addEventListener('pointerdown', this.onHandlePointerDown);
		return box;
	}

	/**
	 * position resize handles
	 *
	 * @param handleStyle HandleStyle
	 */
	public repositionHandles(handleStyle?: HandleStyle) {
		// position resize handles
		let handleXOffset = '0px';
		let handleYOffset = '0px';
		if (handleStyle) {
			if (handleStyle.width) {
				handleXOffset = `${-parseFloat(handleStyle.width) / 2}px`;
			}
			if (handleStyle.height) {
				handleYOffset = `${-parseFloat(handleStyle.height) / 2}px`;
			}
		}
		Object.assign(this.topLeftHandle.style, { left: handleXOffset, top: handleYOffset });
		Object.assign(this.topRightHandle.style, { right: handleXOffset, top: handleYOffset });
		Object.assign(this.bottomRightHandle.style, { right: handleXOffset, bottom: handleYOffset });
		Object.assign(this.bottomLeftHandle.style, { left: handleXOffset, bottom: handleYOffset });
	}
	/**
	 * set document cursor to resize arrows on pointer down until pointer up
	 * @param value string
	 */
	public setCursor(value: string) {
		// set document cursor to resize arrows on pointer down until pointer up
		if (document.body) {
			if (value) {
				this.dragCursorStyle.innerHTML = `body, body * { cursor: ${value} !important; }`;
				document.head.appendChild(this.dragCursorStyle);
			} else {
				try {
					// remove cursor style if exists
					document.head.removeChild(this.dragCursorStyle);
				} catch {
					/* empty */
				}
			}
		}
	}

	/**
	 * activate resize mode, show size info
	 * @param activate boolean
	 */
	public resizeMode = (activate: boolean) => {
		if (activate) {
			// activate resize mode, show size info
			this.hasResized = false;
			this.formattedWidth = '';
			if (this.target) {
				// determine resize mode to use (absolute/relative)
				this.useRelativeSize = this.formatter.useRelative(this.target);
				// get inner editor width to calculate % values
				this.editorStyle = getComputedStyle(this.formatter.quill.root);
				this.editorWidth = this.formatter.quill.root.clientWidth - parseFloat(this.editorStyle.paddingLeft) - parseFloat(this.editorStyle.paddingRight);

				const rect = this.target.getBoundingClientRect();
				// prevent division by zero in the case that rect.height is 0 for some reason
				if (rect.height === undefined || rect.height === 0) {
					rect.height = this.target.clientHeight + 1;
				}
				this.preDragWidth = rect.width;
				this.computedAspectRatio = getComputedStyle(this.target).aspectRatio || 'auto';
				this.calculatedAspectRatio = rect.width / rect.height;

				if (this.useRelativeSize) {
					if (this.isUnclickable) {
						// strip height for relative iframe sizing, rely on aspect-ratio instead
						if (this.computedAspectRatio === 'auto') {
							// relative size on iframe requires aspect-ratio to be set - use default from options
							//this.target.style.aspectRatio = this.formatter.options.video.defaultAspectRatio;
							console.warn('No iframe aspect-ratio set. Set an aspect ratio either via custom blot or css.\n' + 'Using temporary aspect ratio default');
						}
					}
				} else {
					if (this.isUnclickable && this.computedAspectRatio !== 'auto') {
						// if aspect-ratio set via blot or css, try to use that ratio for new height instead
						const ratio = this.computedAspectRatio.match(/(\d+)\s*\/\s*(\d+)/);
						if (ratio) {
							try {
								this.calculatedAspectRatio = parseFloat(ratio[1]) / parseFloat(ratio[2]);
							} catch {
								/* empty */
							}
						}
					}
				}
				// get natural width if oversize protection on and resize mode is absolute (not relative) - excludes SVG
				if (this.isImage && !this.useRelativeSize && !this.isSVG && this.formatter.options.resize.imageOversizeProtection) {
					this.naturalWidth = (this.target as HTMLImageElement).naturalWidth;
				}
				// show size info box
				this.showSizeInfo(true, rect.width, rect.height);
			}
		} else {
			if (this.target && this.hasResized) {
				// round dimensions to whole numbers
				const width: string = this.roundDimension(this.formattedWidth);
				this.target.setAttribute('width', width);

				// set --resize-width style attribute and data-relative-size attribute
				if (this.isUnclickable) {
					this.target.style.setProperty('--resize-width', `${width}`);
					this.target.dataset['relativeSize'] = `${this.isRelative}`;
				} else {
					if (this.isAligned && this.target.parentElement) {
						this.target.parentElement.style.setProperty('--resize-width', `${width}`);
						this.target.parentElement.dataset['relativeSize'] = `${this.isRelative}`;
					}
				}
			}
			// clear any cached image natural width
			this.naturalWidth = undefined;

			this.formatter.update();
			// fade out size info box
			this.showSizeInfo(false);
		}
	};

	/**
	 * on Handle Pointer Down Event
	 * @param event PointerEvent
	 */
	public onHandlePointerDown = (event: PointerEvent) => {
		this.resizeMode(true);
		if (event.target instanceof HTMLElement && !!this.target) {
			this.dragHandle = event.target;
			this.setCursor(this.dragHandle.style.cursor);
			this.dragStartX = event.clientX;
			// enable drag behaviour until pointer up event
			document.addEventListener('pointermove', this.onHandleDrag);
			document.addEventListener('pointerup', this.onHandlePointerUp);
		}
	};

	/**
	 * on Handle Drag Event
	 */
	public onHandleDrag = (event: PointerEvent) => {
		// resize target + overlay
		if (this.target) {
			this.hasResized = true;
			const deltaX = event.clientX - this.dragStartX;
			let newWidth: number = 0;
			if (this.dragHandle === this.topLeftHandle || this.dragHandle === this.bottomLeftHandle) {
				newWidth = Math.round(this.preDragWidth - deltaX);
			} else {
				newWidth = Math.round(this.preDragWidth + deltaX);
			}
			// ensure width does not grow beyond editor width or shrink below minimumWidthPx
			newWidth = Math.max(Math.min(newWidth, this.editorWidth), this.formatter.options.resize.minimumWidthPx);
			// resize target + overlay
			this.resizeTarget(newWidth);
		}
	};

	/**
	 * on Handle Pointer Up Event
	 */
	public onHandlePointerUp = () => {
		// disable resize mode, reset cursor, tidy up
		this.setCursor('');
		this.resizeMode(false);
		// remove resize event listeners
		document.removeEventListener('pointermove', this.onHandleDrag);
		document.removeEventListener('pointerup', this.onHandlePointerUp);
	};

	/**
	 * handle resize from pinch gesture
	 * @param event TouchEvent
	 */
	private onOverlayTouchStart = (event: TouchEvent) => {
		if (event.target === this.formatter.overlay) {
			this.resizeMode(true);
			if (!!this.target && event.touches.length === 2) {
				event.preventDefault(); // Prevent default touch behavior like scrolling
				// Calculate the initial distance between two fingers
				this.pinchStartDistance = this.calculateDistance(event.touches[0], event.touches[1]);
				// Get the initial width of the element
				this.preDragWidth = this.target.clientWidth;
			}
		}
	};

	/**
	 * on Overlay Touch Move Event
	 * @param event Touch Event
	 */
	private onOverlayTouchMove = (event: TouchEvent) => {
		if (event.target === this.formatter.overlay) {
			if (!!this.target && event.touches.length === 2 && this.pinchStartDistance !== null && this.preDragWidth !== null) {
				event.preventDefault(); // Prevent default touch behaviour like scrolling
				if (this.target) {
					this.hasResized = true;
					// Calculate the current distance between two fingers
					const currentDistance = this.calculateDistance(event.touches[0], event.touches[1]);
					// Calculate the scale factor & new width
					const scale = currentDistance / this.pinchStartDistance;
					let newWidth: number = Math.round(this.preDragWidth * scale);
					// ensure width does not grow beyond editor width or shrink below 10px
					newWidth = Math.max(Math.min(newWidth, this.editorWidth), 10);
					// resize target + overlay
					this.resizeTarget(newWidth);
				}
			}
		}
	};

	/**
	 * on Overlay Touch End Event
	 * @param event TouchEvent
	 */
	private onOverlayTouchEnd = (event: TouchEvent) => {
		if (event.target === this.formatter.overlay) {
			this.resizeMode(false);
		}
	};

	/**
	 * on Overlay Mouse Down Event
	 * @param event MouseEvent
	 */
	private onOverlayMouseDown = (event: MouseEvent) => {
		if (event.target === this.formatter.overlay) {
			this.resizeMode(true);
		}
	};

	/**
	 * on Overlay Mouse Up Event
	 * @param event MouseEvent
	 */
	private onOverlayMouseUp = (event: MouseEvent) => {
		if (event.target === this.formatter.overlay) {
			this.resizeMode(false);
		}
	};

	/**
	 * set the resize Target
	 * @param newWidth width of element
	 * @param isTextevent check event
	 */
	public resizeTarget(newWidth: number, isTextevent: boolean = false) {
		if (this.target) {
			// if image oversize protection on, limit newWidth
			// this.naturalWidth only has value when target is image and protextion is on (set in resizeMode)
			newWidth = Math.min(this.naturalWidth ?? Infinity, newWidth);
			// update size info display
			const newHeight: number = newWidth / this.calculatedAspectRatio;
			if (!isTextevent) {
				this.updateSizeInfo(newWidth, newHeight);
			}
			// set new dimensions on target
			if (this.formatter.useRelative(this.target)) {
				this.formattedWidth = `${(100 * newWidth) / this.editorWidth}%`;
			} else {
				this.formattedWidth = `${newWidth}px`;
			}
			this.target.setAttribute('width', this.formattedWidth);
			this.target.setAttribute('height', 'auto');

			// update width style property to wrapper if image and has imageAlign format
			// width needed to size wrapper correctly via css
			// set fixed height to unclickable if using absolute size mode and no aspect ratio given
			if (this.isUnclickable) {
				if (!this.useRelativeSize && this.computedAspectRatio === 'auto') {
					this.target.setAttribute('height', `${(newWidth / this.calculatedAspectRatio) | 0}px`);
				}
				this.target.style.setProperty('--resize-width', this.formattedWidth);
			} else if (!this.isUnclickable && this.isAligned && !!this.target.parentElement) {
				this.target.parentElement.style.setProperty('--resize-width', this.formattedWidth);
			}
			// updates overlay position
			this.formatter.update();
		}
	}

	/**
	 * show Size Info of element
	 * @param show hide or shown
	 * @param width width of element
	 * @param height height of element
	 */
	public showSizeInfo(show: boolean, width: number | null = null, height: number | null = null) {
		if (show) {
			this.cancelSizeInfoTimer();
			if (width !== null && height !== null) {
				this.updateSizeInfo(width, height);
			}
			this.formatter.sizeInfo.style.transition = '';
			this.formatter.sizeInfo.style.opacity = '1';
		} else {
			// fade out size info box
			this.closeSizeInfo();
		}
	}
	/**
	 * update Size Info
	 * @param width element width
	 * @param height element height
	 */
	public updateSizeInfo(width: number, height: number) {
		this.formatter.imageResizeForm.updateResizeValue();
	}

	/**
	 * check the isRelative or not
	 */
	public get isRelative(): boolean {
		return this.target?.getAttribute('width')?.endsWith('%') || false;
	}

	/**
	 * check the is Aligned or not
	 */
	public get isAligned(): boolean {
		if (this.target) {
			return this.target.hasAttribute('data-blot-align');
		} else {
			return false;
		}
	}

	/**
	 * on Resize Mode Click Handler
	 * @param event Event
	 */
	public onResizeModeClickHandler: EventListener = (event: Event) => {
		event.stopImmediatePropagation();
		this.swapResizeMode(true);
	};

	/**
	 * set the element swap Resize Mode
	 * @param showInfo is shown or not
	 */
	public swapResizeMode(showInfo: boolean = false) {
		if (this.target) {
			const rect: DOMRect = this.target.getBoundingClientRect();
			this.editorStyle = getComputedStyle(this.formatter.quill.root);
			this.editorWidth = this.formatter.quill.root.clientWidth - parseFloat(this.editorStyle.paddingLeft) - parseFloat(this.editorStyle.paddingRight);
			let newWidth: string;
			if (this.isRelative) {
				newWidth = `${Math.round(rect.width)}px`;
			} else {
				newWidth = `${Math.round((100 * rect.width) / this.editorWidth)}%`;
			}
			this.target.setAttribute('width', `${newWidth}`);
			this.target.setAttribute('height', 'auto');
			if (this.formatter.currentSpec?.isUnclickable) {
				this.target.style.setProperty('--resize-width', `${newWidth}`);
				this.target.dataset['relativeSize'] = `${this.isRelative}`;
			} else {
				if (this.isAligned && this.target.parentElement) {
					this.target.parentElement.style.setProperty('--resize-width', `${newWidth}`);
					this.target.parentElement.dataset['relativeSize'] = `${this.isRelative}`;
				}
			}

			this.formatter.update();
			if (showInfo) {
				this.showSizeInfo(true, rect.width, rect.height);
				this.showSizeInfo(false);
			}
		}
	}

	/**
	 * close Size Info
	 */
	public closeSizeInfo() {
		this.sizeInfoTimerId = setTimeout(() => {
			this.formatter.sizeInfo.style.transition = 'opacity 1s';
			this.formatter.sizeInfo.style.opacity = '0';
		}, 1000);
	}

	/**
	 * cancel Size Info Timer
	 */
	public cancelSizeInfoTimer() {
		if (this.sizeInfoTimerId !== null) {
			clearTimeout(this.sizeInfoTimerId);
			this.sizeInfoTimerId = null;
		}
	}
	/**
	 * calculate Distance
	 * @param touch1 Touch
	 * @param touch2 Touch
	 * @returns number
	 */
	private calculateDistance(touch1: Touch, touch2: Touch): number {
		const dx = touch2.clientX - touch1.clientX;
		const dy = touch2.clientY - touch1.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * round string number with units (prefix and/or suffix)
	 * @param dim string
	 * @returns round string number with units (prefix and/or suffix)
	 */
	private roundDimension(dim: string): string {
		// round string number with units (prefix and/or suffix): '-$34.565c' -> '-$35c', '21.244px' -> '24px'
		return dim.replace(/([^0-9.-]*)(-?[\d.]+)(.*)/, (_, prefix, num, suffix) => `${prefix}${Math.round(Number(num))}${suffix}`);
	}

	/**
	 * This function used for to check svg image or not
	 * @returns is check svg image or not
	 */
	private isSvgImage(): boolean {
		if (this.target instanceof HTMLImageElement) {
			if (this.target.src.startsWith('data:image/')) {
				return this.target.src.includes('image/svg+xml');
			}
			return this.target.src.endsWith('.svg');
		}
		return false;
	}
}
