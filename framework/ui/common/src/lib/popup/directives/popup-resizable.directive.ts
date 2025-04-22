import {Directive, ElementRef, Renderer2, AfterContentInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {PopupResizeDirectionEnum} from '../model/resize-direction.enum';
import {ResizeEvent} from '../model/resize-event';

@Directive({
  selector: '[uiCommonPopupResizable]'
})
export class UiCommonPopupResizableDirective implements AfterContentInit, OnDestroy {
	private size = 4;
	private readonly el: HTMLElement;
	private readonly listeners: (() => void)[] = [];

	@Input()
	public uiCommonPopupResizable: PopupResizeDirectionEnum[] = [];

	@Output()
	public resizeStart: EventEmitter<ResizeEvent> = new EventEmitter();

	@Output()
	public resizing: EventEmitter<ResizeEvent> = new EventEmitter();

	@Output()
	public resizeEnd: EventEmitter<ResizeEvent> = new EventEmitter();

	public constructor(private elRef: ElementRef, private renderer: Renderer2) {
		this.el = elRef.nativeElement;
	}

	public ngAfterContentInit() {
		this.uiCommonPopupResizable.forEach(d => {
			switch (d) {
				case PopupResizeDirectionEnum.north:
					this.listeners.push(this.appendNorthDiv());
					break;
				case PopupResizeDirectionEnum.south:
					this.listeners.push(this.appendSouthDiv());
					break;
				case PopupResizeDirectionEnum.west:
					this.listeners.push(this.appendWestDiv());
					break;
				case PopupResizeDirectionEnum.east:
					this.listeners.push(this.appendEastDiv());
					break;
				case PopupResizeDirectionEnum.northEast:
					this.listeners.push(this.appendNorthEastDiv());
					break;
				case PopupResizeDirectionEnum.northWest:
					this.listeners.push(this.appendNorthWestDiv());
					break;
				case PopupResizeDirectionEnum.southEast:
					this.listeners.push(this.appendSouthEastDiv());
					break;
				case PopupResizeDirectionEnum.southWest:
					this.listeners.push(this.appendSouthWestDiv());
					break;
				default:
					throw new Error(`uiCommonResize doesn't recognize ${d} direction`);
			}
		});
	}

	public ngOnDestroy() {
		this.listeners.forEach(e => e());
	}

	private createLineDiv(): HTMLDivElement {
		const div = this.renderer.createElement('div');
		this.renderer.setStyle(div, 'position', 'absolute');
		return div;
	}

	private appendNorthDiv() {
		const div = this.createLineDiv();
		this.renderer.setStyle(div, 'top', '0px');
		this.renderer.setStyle(div, 'cursor', 'n-resize');
		this.renderer.setStyle(div, 'width', '100%');
		this.renderer.setStyle(div, 'height', `${this.size}px`);
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, true, false, PopupResizeDirectionEnum.north);
	}

	private appendSouthDiv() {
		const div = this.createLineDiv();
		this.renderer.setStyle(div, 'bottom', '0px');
		this.renderer.setStyle(div, 'cursor', 's-resize');
		this.renderer.setStyle(div, 'width', '100%');
		this.renderer.setStyle(div, 'height', `${this.size}px`);
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, true, false, PopupResizeDirectionEnum.south);
	}

	private appendWestDiv() {
		const div = this.createLineDiv();
		this.renderer.setStyle(div, 'left', '0px');
		this.renderer.setStyle(div, 'cursor', 'w-resize');
		this.renderer.setStyle(div, 'height', '100%');
		this.renderer.setStyle(div, 'width', `${this.size}px`);
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, false, true, PopupResizeDirectionEnum.west);
	}

	private appendEastDiv() {
		const div = this.createLineDiv();
		this.renderer.setStyle(div, 'right', '0px');
		this.renderer.setStyle(div, 'cursor', 'e-resize');
		this.renderer.setStyle(div, 'height', '100%');
		this.renderer.setStyle(div, 'width', `${this.size}px`);
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, false, true, PopupResizeDirectionEnum.east);
	}

	private resizeDiv(div: HTMLDivElement, height: boolean, width: boolean, direction: PopupResizeDirectionEnum): () => void {
		let mouseMoveListener: (() => void) | null = null;
		let mouseUpListener: (() => void) | null = null;

		const mouseDownListener = this.renderer.listen(div, 'mousedown', (e: MouseEvent) => {
			const size = this.getOriginalSize(this.el);

			this.resizeStart.emit(new ResizeEvent(e, size.width, size.height));

			e.preventDefault();

			mouseMoveListener = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
				if (width) {
					if (direction.includes(PopupResizeDirectionEnum.west)) {
						size.width -= e.movementX;
					} else {
						size.width += e.movementX;
					}
					this.el.style.width = `${size.width}px`;
				}
				if (height) {
					if (direction.includes(PopupResizeDirectionEnum.north)) {
						size.height -= e.movementY;
					} else {
						size.height += e.movementY;
					}
					this.el.style.height = `${size.height}px`;
				}
				this.resizing.emit(new ResizeEvent(e, size.width, size.height));
			});
			mouseUpListener = this.renderer.listen('document', 'mouseup', (e: MouseEvent) => {
				if (mouseMoveListener) {
					mouseMoveListener();
					mouseMoveListener = null;
				}
				if (mouseUpListener) {
					mouseUpListener();
					mouseUpListener = null;
				}
				this.resizeEnd.emit(new ResizeEvent(e, size.width, size.height));
			});
		});

		return () => {
			mouseDownListener();
			if (mouseMoveListener) {
				mouseMoveListener();
				mouseMoveListener = null;
			}
			if (mouseUpListener) {
				mouseUpListener();
				mouseUpListener = null;
			}
		};
	}

	private getOriginalSize(el: HTMLElement) {
		const size = {
			width: el.clientWidth,
			height: el.clientHeight
		};

		const style = getComputedStyle(el);
		if (style.width) {
			size.width = parseFloat(style.width.substring(0, style.width.length - 2));
		}
		if (style.height) {
			size.height = parseFloat(style.height.substring(0, style.height.length - 2));
		}

		return size;
	}

	private createBlockDiv(): HTMLDivElement {
		const div = this.renderer.createElement('div');
		this.renderer.setStyle(div, 'position', 'absolute');
		this.renderer.setStyle(div, 'width', `${this.size}px`);
		this.renderer.setStyle(div, 'height', `${this.size}px`);
		this.renderer.setStyle(div, 'background', 'red');
		return div;
	}

	private appendSouthEastDiv() {
		const div = this.createBlockDiv();
		this.renderer.setStyle(div, 'right', '0px');
		this.renderer.setStyle(div, 'bottom', '0px');
		this.renderer.setStyle(div, 'cursor', 'se-resize');
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, true, true, PopupResizeDirectionEnum.southEast);
	}

	private appendSouthWestDiv() {
		const div = this.createBlockDiv();
		this.renderer.setStyle(div, 'left', '0px');
		this.renderer.setStyle(div, 'bottom', '0px');
		this.renderer.setStyle(div, 'cursor', 'sw-resize');
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, true, true, PopupResizeDirectionEnum.southWest);
	}

	private appendNorthEastDiv() {
		const div = this.createBlockDiv();
		this.renderer.setStyle(div, 'right', '0px');
		this.renderer.setStyle(div, 'top', '0px');
		this.renderer.setStyle(div, 'cursor', 'ne-resize');
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, true, true, PopupResizeDirectionEnum.northEast);
	}

	private appendNorthWestDiv() {
		const div = this.createBlockDiv();
		this.renderer.setStyle(div, 'left', '0px');
		this.renderer.setStyle(div, 'top', '0px');
		this.renderer.setStyle(div, 'cursor', 'nw-resize');
		this.renderer.appendChild(this.el, div);
		return this.resizeDiv(div, true, true, PopupResizeDirectionEnum.northWest);
	}
}
