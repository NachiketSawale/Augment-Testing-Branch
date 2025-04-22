import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Translatable } from '@libs/platform/common';

@Component({
	selector: 'ui-common-tabs',
	templateUrl: './ui-common-tabs.component.html',
	styleUrl: './ui-common-tabs.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class UiCommonTabsComponent {
	@ViewChild('scrollViewport')
	private scrollViewport!: CdkVirtualScrollViewport;

	private _items: Translatable[] = [];

	private _mouseOverItem = -1;

	private _cssCanClick = {
		cursor: 'pointer',
	};
	private _cssDisabled = {
		color: '#dcdcdc',
		cursor: 'default',
	};

	private _scrollOffset = 150;

	private _leftBtnCss = {};
	private _rightBtnCss = {};

	@Input()
	public selectedIndex: number = 0;

	@Output()
	public selectedItemChanged: EventEmitter<number> = new EventEmitter();

	@Input()
	public set items(value: Translatable[]) {
		this._items = value;

		// update arrow css when UI or value changed.
		if (this.scrollViewport) {
			setTimeout(() => {
				const leftOffset = this.scrollViewport.measureScrollOffset('left');
				const rightOffset = this.scrollViewport.measureScrollOffset('right');
				if (leftOffset === 0) {
					this._leftBtnCss = this._cssDisabled;
				} else {
					this._leftBtnCss = this._cssCanClick;
				}
				if (rightOffset === 0) {
					this._rightBtnCss = this._cssDisabled;
				} else {
					this._rightBtnCss = this._cssCanClick;
				}
			});
		}
	}

	public get items() {
		return this._items;
	}

	@Input()
	public set scrollOffset(value: number) {
		if (value > 0) {
			this._scrollOffset = value;
		}
	}

	public scrollToLeft() {
		const offset = this.scrollViewport.measureScrollOffset('left');
		this.scrollViewport.scrollToOffset(offset - this._scrollOffset, 'smooth');
	}

	public scrollToRight() {
		const offset = this.scrollViewport.measureScrollOffset('left');
		this.scrollViewport.scrollToOffset(offset + this._scrollOffset, 'smooth');
	}

	public selectItem(index: number) {
		if (index != this.selectedIndex) {
			this.selectedItemChanged.emit(index);
		}
		this.selectedIndex = index;
	}

	public btnCss(btn: 'left' | 'right') {
		if (btn == 'left') {
			return this._leftBtnCss;
		}
		return this._rightBtnCss;
	}

	public itemMouseOver(selectedIndex: number,over:boolean) {
		if(over){
			this._mouseOverItem = selectedIndex;
		}else {
			this._mouseOverItem = -1;
		}
	}

	public get mouseOverItem(){
		return this._mouseOverItem;
	}
}
