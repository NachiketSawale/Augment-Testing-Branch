/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, forwardRef, ViewChild } from '@angular/core';
import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { IGridControlContext } from '../../model/grid-control-context.interface';
import { GridComponent, IGridApi, IGridConfiguration } from '../../../grid';
import { IFieldValueChangeInfo } from '../../../model/fields';
import { PropertyType } from '@libs/platform/common';
import { IMenuItemsList } from '../../../model/menu-list/interface';
import { UiCommonModule } from '../../../ui-common.module';

@Component({
	selector: 'ui-form-grid',
	templateUrl: './form-grid.component.html',
	styleUrls: ['./form-grid.component.scss'],
	standalone: true,
	imports: [GridComponent, forwardRef(() => UiCommonModule)],
})
export class FormGridComponent extends DomainControlBaseComponent<[], IGridControlContext> implements AfterViewInit {
	/**
	 * Available grid element reference.
	 */
	@ViewChild('GridElement') private readonly GridElement!: IGridApi<object>;

	/**
	 * Menulist data.
	 */
	public itemsTools!: IMenuItemsList<void>;
	public constructor() {
		super();

		if (!this.controlContext.configuration) {
			throw new Error('grid configuration not available');
		}

		this.height = this.controlContext.height || this.height;
		this.configuration = this.controlContext.configuration;
		this.items = this.controlContext.value ?? [];
	}

	public height: number = 200;

	public configuration!: IGridConfiguration<object>;
	public items: [] = [];

	public valueChanged(items: IFieldValueChangeInfo<object, PropertyType>) {
		let val = items.newValue;
		if (val === null) {
			val = [];
		}
		this.controlContext.value = val as [];
	}

	public ngAfterViewInit(): void {
		if (this.GridElement && this.controlContext.tools) {
			this.itemsTools = this.controlContext.tools(this.GridElement);
		}
	}
}
