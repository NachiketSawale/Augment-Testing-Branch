/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { ControlContextInjectionToken, IControlContext, UiCommonDialogService } from '@libs/ui/common';
import { FORMULA_LIST, FormulaDialogComponent } from '../formula-dialog/formula-dialog.component';

@Component({
	selector: 'constructionsystem-master-property-formula',
	templateUrl: './property-formula.component.html',
	styleUrls: ['./property-formula.component.scss'],
	standalone: true,
	imports: [FormsModule],
})
export class PropertyFormulaComponent<TEntity extends object> {
	private readonly translationService = inject(PlatformTranslateService);
	private readonly dialogSvc = inject(UiCommonDialogService);
	public controlContext = inject(ControlContextInjectionToken) as IControlContext<PropertyType, TEntity>;
	@Input()
	public readonly?: boolean;
	public toolTip?: string;
	public constructor() {
		this.prepareToolTip();
	}
	private prepareToolTip() {
		const arrMessage: string[] = [this.translationService.instant('constructionsystem.master.formulaToolTipTitle').text, this.translationService.instant('constructionsystem.master.formulaToolTipTitle1').text];
		FORMULA_LIST.forEach((item) => {
			arrMessage.push(`    • ${item} `);
		});
		arrMessage.push(this.translationService.instant('constructionsystem.master.formulaToolTipTitle2').text);
		this.toolTip = arrMessage.join('\n');
	}

	public openDialog() {
		this.dialogSvc.show({
			bodyComponent: FormulaDialogComponent,
			headerText: 'cloud.common.informationDialogHeader',
		});
		return;
	}
}
