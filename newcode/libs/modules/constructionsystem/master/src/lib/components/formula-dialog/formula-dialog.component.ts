/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { NgFor } from '@angular/common';

@Component({
	selector: 'constructionsystem-master-formula-dialog',
	templateUrl: './formula-dialog.component.html',
	styleUrls: ['./formula-dialog.component.scss'],
	standalone: true,
	imports: [PlatformCommonModule, NgFor],
})
export class FormulaDialogComponent {
	protected readonly formulaList = FORMULA_LIST;
}

export const FORMULA_LIST: string[] = [
	'count',
	'length',
	'area',
	'height',
	'offset',
	'multiplier',
	'segmentCount',
	'vertexCount',
	'cutoutArea',
	'cutoutLength',
	'areaExcludingCutouts',
	'lengthExcludingCutouts',
	'segmentCountExcludingCutouts',
	'vertexCountExcludingCutouts',
];
