import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicsSharedImportResult } from '../../models/types/basics-shared-import-result.type';
import { PlatformCommonModule } from '@libs/platform/common';

@Component({
	selector: 'basics-shared-print-import-result',
	standalone: true,
	imports: [CommonModule, PlatformCommonModule],
	templateUrl: './print-import-result.component.html',
	styleUrl: './print-import-result.component.scss',
})
export class PrintImportResultComponent {
	private _importResult: BasicsSharedImportResult | null = null;

	@Input()
	public get importResult(): BasicsSharedImportResult | null {
		return this._importResult;
	}

	public set importResult(value: BasicsSharedImportResult) {
		this._importResult = value;
	}

	public get importResultMessageList() {
		if (this._importResult?.ImportResult_Message) {
			return this._importResult.ImportResult_Message.split('</br>');
		}
		return [];
	}
}
