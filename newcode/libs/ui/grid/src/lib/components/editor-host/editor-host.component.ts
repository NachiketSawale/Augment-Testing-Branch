/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FieldType, GridControlContext, GridRowInfo, UiCommonModule } from '@libs/ui/common';

@Component({
	selector: 'ui-grid-editor-host',
	templateUrl: './editor-host.component.html',
	styleUrls: ['./editor-host.component.scss'],
	standalone: true,
	imports: [
		UiCommonModule
	]
})
export class UiGridEditorHostComponent<T extends object> implements OnInit, AfterViewInit {

	private _columnId: string = '';

	@Input() public gridRowInfo: GridRowInfo<T> | undefined;

	public get columnid() {
		return this._columnId;
	}

	@Input()
	public set columnid(columnId: string) {
		this._columnId = columnId;
	}

	@Output()
	public remove: EventEmitter<string> = new EventEmitter<string>();

	/**
	 * Gets and sets the field type for which an appropriate domain control is to be shown.
	 */
	public fieldType: FieldType = FieldType.Text;

	/**
	 * Gets the control context for the domain control to be shown.
	 */
	public controlContext?: GridControlContext<T>;

	public ngOnInit(): void {
		if (this.gridRowInfo) {
			const columnContexts = this.gridRowInfo.controlContexts;
			this.controlContext = columnContexts.get(this.columnid);
			this.fieldType = this.controlContext?.fieldType || FieldType.Text;
		}
	}

	public ngAfterViewInit(): void {

	}
}
