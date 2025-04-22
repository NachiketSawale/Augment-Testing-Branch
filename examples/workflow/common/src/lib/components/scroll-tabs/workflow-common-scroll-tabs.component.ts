/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Translatable } from '@libs/platform/common';

/**
 * Component to selectively show tabs and scroll them horizontally
 */
@Component({
	selector: 'workflow-common-scroll-tabs',
	templateUrl: './workflow-common-scroll-tabs.component.html',
	styleUrls: ['./workflow-common-scroll-tabs.component.scss'],
})
export class WorkflowCommonScrollTabsComponent implements AfterViewInit, OnDestroy {

	/**
	 * List of tabs to display
	 */
	@Input()
	public tabs: { tabName: Translatable }[] = [];

	/**
	 * Initially selected tab index
	 */
	@Input()
	public selectedTabIndex: number = 0;

	/**
	 * Property to disable/enable left arrow.
	 */
	public canScrollLeft = false;

	/**
	 * Property to disable/enable right arrow.
	 */
	public canScrollRight = false;

	/**
	 * Emits when a tab is clicked
	 */
	@Output()
	public tabClick = new EventEmitter<number>();

	@ViewChild('tabsWrapper')
	private tabsWrapper!: ElementRef<HTMLDivElement>;

	private cdr = inject(ChangeDetectorRef);
	private elementRef = inject(ElementRef);
	private resizeObserver!: ResizeObserver;

	/**
	 * Initialize the component after the view is rendered.
	 */
	public ngAfterViewInit() {
		// Ensure the initial tab is selected
		this.selectTab(this.selectedTabIndex);

		const wrapperDiv = this.elementRef.nativeElement.querySelector('.scroll-tabs-content');

		// Initialize ResizeObserver
		this.resizeObserver = new ResizeObserver((entries) => {
			this.cdr.detectChanges(); // Trigger change detection when child content is loaded
		});

		// Observe the wrapper div
		this.resizeObserver.observe(wrapperDiv);

		// Initial arrow state
		this.checkArrows();
	}

	/**
	 * Function to scroll the tabs to the left.
	 */
	public scrollLeft() {
		this.tabsWrapper.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
		this.checkArrows();
		this.tabClick.emit(this.selectedTabIndex - 1);
	}

	/**
	 * Function to scroll the tabs to the right.
	 */
	public scrollRight() {
		this.tabsWrapper.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
		this.checkArrows();
		this.tabClick.emit(this.selectedTabIndex + 1);
	}

	/**
	 * Function to select the tab on click and emit the selected value.
	 * @param index The index of the selected tab.
	 */
	public onTabClick(index: number) {
		this.selectTab(index);
	}

	private selectTab(index: number) {
		this.selectedTabIndex = index;
		const tabElements = this.tabsWrapper.nativeElement.children;
		if (tabElements[index]) {
			(tabElements[index] as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center' });
		}
		this.tabClick.emit(index);
	}

	private checkArrows() {
		const wrapper = this.tabsWrapper.nativeElement;
		this.canScrollLeft = wrapper.scrollLeft > 0;
		this.canScrollRight = wrapper.scrollLeft + wrapper.clientWidth < wrapper.scrollWidth;
	}

	/**
	 * Clean up observables in the component.
	 */
	public ngOnDestroy() {
		// Clean up the observer when the component is destroyed
		this.resizeObserver.disconnect();
	}

}