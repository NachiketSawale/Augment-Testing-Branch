/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { IAccordionConfig, IAccordionOptions } from '../../model/interfaces/accordion-config.interface';
import { AccordionConfigService } from '../../services/accordion-config.service';
import { IAccordionItem } from '../../model/interfaces/accordion-item.interface';

/**
 * Data driven accordion component
 */
@Component({
	selector: 'ui-common-accordion',
	templateUrl: './accordion.component.html',
	styleUrls: ['./accordion.component.scss']
})
export class UiCommonAccordionComponent implements OnInit {
	/**
	 * reference to angular material accordion
	 */
	@ViewChild(MatAccordion)
	public accordion!: MatAccordion;

	/**
	 * accordion data array, {@link IAccordionItem} interface
	 */
	@Input()
	public data?: IAccordionItem[];

	/**
	 * accordion options
	 */
	@Input()
	public options?: IAccordionOptions;
	/**
	 * current config
	 */
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
	 * default constructor
	 * @param defaultConfig
	 */
	public constructor(private defaultConfig: AccordionConfigService) {
	}

	/**
	 * on initializing, lifecycle hook
	 */
	public ngOnInit(): void {
		this.config = {
			...this.defaultConfig,
			...this.options
		};
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
	 * open all panels
	 */
	public openAll() {
		this.accordion.openAll();
	}

	/**
	 * close all panels
	 */
	public closeAll() {
		this.accordion.closeAll();
	}
}
