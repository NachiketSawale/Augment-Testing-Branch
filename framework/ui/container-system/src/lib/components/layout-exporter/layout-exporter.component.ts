/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken } from '@angular/core';
import { IGridConfiguration } from '@libs/ui/common';
import { ILayoutExportItem } from '../../model/layout-export-item.interface';

const LAYOUT_EXPORTER_DATA_TOKEN = new InjectionToken('dlg-layout-exporter-data');

export function getLayoutExporterDialogDataToken(): InjectionToken<IGridConfiguration<ILayoutExportItem>> {
	return LAYOUT_EXPORTER_DATA_TOKEN;
}


/**
 * This component handled the export view operations
 */
@Component({
	selector: 'ui-container-system-layout-exporter',
	templateUrl: './layout-exporter.component.html',
	styleUrls: ['./layout-exporter.component.scss'],
})
export class UiContainerSystemLayoutExporterComponent {

	private readonly dialogData = inject(getLayoutExporterDialogDataToken());

	public get gridConfig() {
		return this.dialogData;
	}
}
