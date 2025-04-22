/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { IAccordionItem } from '../../model/interfaces/accordion-item.interface';
import { IAccordionConfig } from '../../model/interfaces/accordion-config.interface';

/**
 * Accordion tree component
 */
@Component({
	selector: 'ui-common-accordion-tree',
	templateUrl: './accordion-tree.component.html',
	styleUrls: ['./accordion-tree.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class UiCommonAccordionTreeComponent implements AfterViewInit {
	/**
	 * data model
	 */
	@Input()
	public data?: IAccordionItem[];

	/**
	 * config object
	 */
	@Input()
	public config!: IAccordionConfig;

	/**
	 * panel opened/expanded
	 */
	@Output()
	public opened: EventEmitter<IAccordionItem> = new EventEmitter<IAccordionItem>();
	/**
	 * panel closed/collapsed
	 */
	@Output()
	public closed: EventEmitter<IAccordionItem> = new EventEmitter<IAccordionItem>();

	/**
	 * accordion item selected
	 */
	@Output()
	public selected: EventEmitter<IAccordionItem> = new EventEmitter<IAccordionItem>();

	/**
	 * default
	 * @param injector
	 * @param hostElement
	 * @param renderer
	 */
	public constructor(private injector: Injector, private hostElement: ElementRef, private renderer: Renderer2) {

	}

	/**
	 * TrackBy function for ngFor directive
	 * @param index
	 * @param item
	 */
	public trackById(index: number, item: IAccordionItem) {
		return item.id;
	}

	/**
	 * ng hook
	 */
	public ngAfterViewInit() {
		this.adjustPanel();
	}

	/**
	 * on panel opened
	 * @param item
	 */
	public onPanelOpened(item: IAccordionItem) {
		this.opened.emit(item);
	}

	/**
	 * on panel closed
	 * @param item
	 */
	public onPanelClosed(item: IAccordionItem) {
		this.closed.emit(item);
	}

	/**
	 * on accordion item clicked
	 * @param item
	 */
	public onItemClick(item: IAccordionItem) {
		this.selected.emit(item);
	}

	/**
	 * has child items or not.
	 * @param item
	 */
	public hasChild(item: IAccordionItem) {
		return item.hasChild || (item.children && item.children.length > 0);
	}

	private adjustPanel() {
		const panelBodies = this.hostElement.nativeElement.querySelectorAll('.mat-expansion-panel-body');

		panelBodies.forEach((panelBody: HTMLElement) => {
			this.renderer.setStyle(panelBody, 'padding-right', '0px');
		});
	}
}
