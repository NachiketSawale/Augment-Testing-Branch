/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {
	IMenuItem,
	IMenuItemsList,
	isParentMenuItem
} from '../model/menu-list/interface/index';

import { PlatformModuleManagerService } from '@libs/platform/common';

import { ClassList } from '../model/menu-list/enum/class-list.enum';
import { ItemType } from '../model/menu-list/enum/menulist-item-type.enum';

/**
 * Controls visiblity of menu item on the basis of availabe space
 */
@Directive({
	selector: '[uiCommonCollapsableList]',
})
export class CollapsableListDirective implements AfterViewInit, OnDestroy {
	/**
	 * Menu list
	 */
	@Input() public tools!: IMenuItemsList | undefined;

	/**
	 * Subscription for isResize subject
	 */
	private resizeSubscription$!: Subscription;

	/**
	 * Initializ the new instance, allows subscription to isResize
	 * @param elem   ElementRef of parent 
	 * @param mainview  Service to use after container resize
	 */
	public constructor(public elem: ElementRef, private moduleManagerService: PlatformModuleManagerService) {
		this.resizeSubscription$ = this.moduleManagerService.isResize$.subscribe((resolve: boolean) => {
			if (resolve) {
				this.updateToolsHTML();
			}
		});
	}

	public ngAfterViewInit(): void {
		this.updateToolsHTML();
	}

	/**
	 * This method calls calSize method according to view
	 * @returns {void}
	 */
	public updateToolsHTML(): void {
		const toolbarLength = this.elem.nativeElement.getElementsByClassName('tools');
		if (toolbarLength.length > 0) {
			this.calcSize();
		}
	}

	/**
	 * Calculates size of element
	 * @returns {void}
	 */
	public calcSize(): void {
		if (!this.tools) {
			return;
		}
		const eleW: number[] = [];
		this.filterTypeDivider();

		const titleElem = this.elem.nativeElement.getElementsByClassName(ClassList.title);
		if (titleElem.length > 0) {
			titleElem[0].classList.remove(ClassList.ellipsis);
		}

		const fix = this.elem.nativeElement.getElementsByClassName(ClassList.fix) as HTMLCollection;

		let overFlowSize = 41;
		let i;
		for (i = 0; i < fix.length; i++) {
			if (fix[i].hasChildNodes() && fix[i].getElementsByTagName('ui-common-menu-list-overflow').length > 0) {
				overFlowSize += (fix[i].getElementsByTagName('ui-common-menu-list-overflow')[0] as HTMLElement).offsetWidth;
			} else {
				overFlowSize += (fix[i] as HTMLElement).offsetWidth;
			}
		}

		const maxWidth = this.getElementWidth() - overFlowSize;
		let sumWidth = 0;
		this.checkTitleMarkup(maxWidth);

		this.tools.items?.forEach((tool: IMenuItem) => (tool.hideItem = false));
		const wrappedQueryResult = this.getCollapsableElements();
		const displayedTools = this.tools.items?.filter((item: IMenuItem) => {
			return !item.hideItem;
		});
		const possibleItems = this.checkPossibleElementsInToolbar();

		if (wrappedQueryResult && (eleW.length === 0 || eleW.length !== wrappedQueryResult.length)) {
			let width, w;
			for (let i = 0; i < wrappedQueryResult.length; i++) {
				if (window.getComputedStyle(wrappedQueryResult[i]).width === 'auto' || wrappedQueryResult[i].hasAttribute('hidden')) {
					wrappedQueryResult[i].removeAttribute('hidden');
					w = parseInt(window.getComputedStyle(wrappedQueryResult[i]).width.replace('px', '').trim());
					wrappedQueryResult[i].setAttribute('hidden', 'true');
					width = w;
				} else {
					width = parseInt(window.getComputedStyle(wrappedQueryResult[i]).width.replace('px', '').trim());
				}
				eleW.push(width);
			}
		}

		for (i = 0; i < eleW.length; i++) {
			if (maxWidth >= sumWidth + eleW[i]) {
				sumWidth += eleW[i];
				if (displayedTools && i < displayedTools.length && displayedTools[i] && displayedTools[i].type !== ItemType.OverflowBtn) {
					displayedTools[i].hideItem = false;
				}
			} else {
				break;
			}
		}

		if (possibleItems && typeof displayedTools !== 'undefined') {
			while (i < displayedTools.length) {
				if (displayedTools && i < displayedTools.length && displayedTools[i] && displayedTools[i].type !== ItemType.OverflowBtn) {
					displayedTools[i].hideItem = true;
				}
				i++;
			}
			this.setOverflow();
		}
	}

	/**
	 * sets visibility of overflow items
	 * @returns {void}
	 */
	public setOverflow(): void {
		const hiddenTools: number[] = [];
		const overflowbtn = this.tools?.items?.find((tool: IMenuItem) => {
			if (tool.type === ItemType.OverflowBtn ) {
				return tool;
			} else {
				return undefined;
			}
		});

		this.tools?.items?.forEach((tool: IMenuItem, index: number) => {
			if (tool.hideItem && tool.type !== ItemType.OverflowBtn) {
				hiddenTools.push(index);
			}
		});

		if (hiddenTools.length > 0 && overflowbtn && isParentMenuItem(overflowbtn)) {
			overflowbtn.list.items?.forEach((i: IMenuItem) => {
				i.hideItem = true;
			});
			hiddenTools.forEach((i) => {
				if (overflowbtn?.list?.items) {
					overflowbtn.list.items[i].hideItem = false;
				}
			});
		} else if (overflowbtn && hiddenTools.length === 0 && isParentMenuItem(overflowbtn) && typeof overflowbtn.list.items !== 'undefined' && overflowbtn.list.items.length > 0) {
			overflowbtn.list.items.forEach((item: IMenuItem) => {
				item.hideItem = true;
			});
			overflowbtn.hideItem = true;
		}
	}

	/**
	 * Returns element collapsable class
	 * @returns {HTMLCollection} element collection with collapsable class
	 */
	public getCollapsableElements(): HTMLCollection {
		const collapsable = this.elem.nativeElement.getElementsByClassName(ClassList.collapsable) as HTMLCollection;
		return collapsable;
	}

	/**
	 * checks collapsing of items is possible or not
	 * @returns {boolean} Checks elements having collapsable class are visible or not
	 */
	public checkPossibleElementsInToolbar(): boolean {
		const collapsableElements: HTMLCollection = this.getCollapsableElements();
		let toReturn = true;
		if (collapsableElements.length === 0 || (collapsableElements.length === 1 && collapsableElements[0].classList.contains(ClassList.divider))) {
			toReturn = false;
		}
		return toReturn;
	}

	/**
	 * Applies ellipsis class to title when required
	 * @param {number} maxWidth maximum width of visible element
	 * @returns {void}
	 */
	public checkTitleMarkup(maxWidth: number): void {
		if (maxWidth < 0) {
			const titleElem = this.elem.nativeElement.getElementsByClassName('title')[0];
			if (titleElem) {
				titleElem.classList.add(ClassList.ellipsis);
			}
		}
	}

	/**
	 * Provides width of native element
	 * @returns {number} width of native element
	 */
	public getElementWidth(): number {
		const elem = this.elem.nativeElement as HTMLElement;
		return elem.getBoundingClientRect().width;
	}

	/**
	 * Filters among consecutive dividers
	 * @returns {void}
	 */
	public filterTypeDivider(): void {
		if (typeof this.tools !== 'undefined') {
			this.tools.items = this.tools?.items?.filter((elem: IMenuItem, index: number, self: IMenuItem[]) => {
				if (elem.type as string === ClassList.divider) {
					if (elem.type as string === ClassList.divider && self[index + 1] && self[index + 1].type as string !== ClassList.divider) {
						return elem;
					} else {
						return undefined;
					}
				} else {
					return elem;
				}
			});
		}
	}

	public ngOnDestroy(): void {
		typeof this.resizeSubscription$ !== 'undefined' ? this.resizeSubscription$.unsubscribe() : null;
	}
}
