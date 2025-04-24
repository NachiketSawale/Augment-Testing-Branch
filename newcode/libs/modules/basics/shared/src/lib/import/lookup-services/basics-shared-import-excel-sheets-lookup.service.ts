import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BasicsSharedImportExcelService } from '../services/basics-shared-import-excel.service';
import { BasicsSharedStringInputLookupService } from '../../lookup-helper/basics-shared-string-input-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedImportExcelSheetsLookupService<T extends object> extends BasicsSharedStringInputLookupService<{ id: number; sheetName: string }> {
	public constructor(private readonly _importService: BasicsSharedImportExcelService<T>) {
		super({
			uuid: 'f1661fdf78688a65b8fcf5c3b695e0ef',
			valueMember: 'sheetName',
			displayMember: 'sheetName',
		});
	}

	public override getList(): Observable<{ id: number; sheetName: string }[]> {
		return this._importService.getExcelSheetNames().pipe(
			map((result) => {
				const sheets: { id: number; sheetName: string }[] = [];
				result.forEach((item, index) => {
					sheets.push({ id: index, sheetName: item });
				});
				return sheets;
			}),
		);
	}
}
