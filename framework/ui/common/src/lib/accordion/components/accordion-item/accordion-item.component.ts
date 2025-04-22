/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Injector, Input, OnInit, Output, StaticProvider, Type, ViewEncapsulation } from '@angular/core';
import { IAccordionItem } from '../../model/interfaces/accordion-item.interface';
import { IAccordionConfig } from '../../model/interfaces/accordion-config.interface';
import { AccordionContext } from '../../model/accordion-context';
import { AccordionItemAction } from '../../model/interfaces/accordion-item-action.type';

/**
 * Accordion item component
 */
@Component({
	selector: 'ui-common-accordion-item',
	templateUrl: './accordion-item.component.html',
	styleUrls: ['./accordion-item.component.scss'],
	encapsulation: ViewEncapsulation.None // due to menu list button don't have concrete size by default and no way to set it outside, so I have to set up style in this component by now, maybe delete it after menulist style is fixed
})
export class UiCommonAccordionItemComponent implements OnInit {
	/**
	 * data model
	 */
	@Input()
	public data!: IAccordionItem;

	/**
	 * config from accordion
	 */
	@Input()
	public config!: IAccordionConfig;

	/**
	 * is selected
	 */
	@Output()
	public selected: EventEmitter<IAccordionItem> = new EventEmitter<IAccordionItem>();

	/**
	 * content component
	 */
	public contentComponent!: Type<unknown>;

	/**
	 * sub injector for content component
	 */
	public dataInjector!: Injector;

	/**
	 * action buttons
	 */
	public get actionButtons(): AccordionItemAction[] {
		const actions: AccordionItemAction[] = [];

		if (this.data.actionButtons) {
			this.data.actionButtons.forEach(item => {
				actions.push(item);
			});
		}
		if (this.config.actionButtons) {
			this.config.actionButtons.forEach(item => {
				if (this.isHeader()) {
					if (item.hideOnHeader) {
						return;
					}
				} else {
					if (item.hideOnItem) {
						return;
					}
				}
				actions.push({...item});
			});
		}

		return actions;
	}

	/**
	 * default
	 * @param injector
	 */
	public constructor(private injector: Injector) {
	}

	/**
	 * on item click
	 * @param e
	 */
	public onItemClick(e: MouseEvent) {
		this.selected.emit(this.data);

		if (this.config.onlyExpandByIndicator) {
			e.stopPropagation();
		}
	}

	/**
	 * on initializing
	 */
	public ngOnInit() {
		this.dataInjector = Injector.create({
			parent: this.injector,
			providers: this.createProviders()
		});

		if (this.data.component) {
			this.contentComponent = this.data.component;
		} else {
			this.contentComponent = this.config.itemComponent;
		}
	}

	private createProviders() {
		const defaults: StaticProvider[] = [
			{provide: AccordionContext, useValue: new AccordionContext(this.data, this.config)}
		];
		const items: StaticProvider[] = this.data.providers ?? [];
		const configs: StaticProvider[] = this.config.itemProviders ?? [];

		return defaults.concat(items).concat(configs);
	}

	private isHeader() {
		return this.data.hasChild || (this.data.children && this.data.children.length > 0);
	}
}
