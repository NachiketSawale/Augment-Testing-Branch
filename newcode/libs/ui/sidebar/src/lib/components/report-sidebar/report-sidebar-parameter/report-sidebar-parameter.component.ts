/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FieldType, IFormConfig } from '@libs/ui/common';
import { ISidebarReportAccordionData } from '../../../model/interfaces/report/sidebar-report-accordion-data.interface';

/**
 * Component renders the report parameters and errors.
 */
@Component({
	selector: 'ui-sidebar-report-parameter',
	templateUrl: './report-sidebar-parameter.component.html',
	styleUrls: ['./report-sidebar-parameter.component.scss'],
})
export class UiSidebarReportParameterComponent implements OnChanges {
	/**
	 * Tab title.
	 */
	@Input() public title: string = '';

	/**
	 * Selected Report data.
	 */
	@Input() public report!: ISidebarReportAccordionData;

	/**
	 * Store in document default value.
	 */
	public checkStoreInDocsDefVal!: ISidebarReportAccordionData;

	/**
	 * Control config for Store in document.
	 */
	public readonly checkStoreInDocsOptions: IFormConfig<{ storeInDocsState?: boolean }> = {
		rows: [
			{
				id: 'checkStoreInDocs',
				label: {
					text: 'Store in Documents',
				},
				type: FieldType.Boolean,
				model: 'storeInDocsState',
			},
		],
	};

	/**
	 * Event emitter to toggle the view.
	 */
	@Output() public changeView = new EventEmitter();

	/**
	 * Event emitter to generate the report.
	 */
	@Output() public generate = new EventEmitter<boolean>();

	/**
	 * A callback method that is invoked immediately after the default change detector
	 * has checked data-bound properties if at least one has changed,
	 * and before the view and content children are checked.
	 *
	 * @param {SimpleChanges} change Input bound data.
	 */
	public ngOnChanges(change: SimpleChanges): void {
		if (change['report'].currentValue) {
			this.checkStoreInDocsDefVal = this.report;
		}
	}

	/**
	 * Method emits the event to toggle view.
	 */
	public toggleView(): void {
		this.changeView.emit();
	}

	/**
	 * Method emits the event to generate report.
	 */
	public validateAndExecute(): void {
		this.generate.emit(true);
	}

	public processDialogSection(value: unknown): void {
		//TODO: Functionality to be carried on button click.
	}
}
