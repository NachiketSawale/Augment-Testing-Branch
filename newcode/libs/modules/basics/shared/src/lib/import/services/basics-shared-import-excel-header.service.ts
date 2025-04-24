import { LookupSimpleEntity } from '@libs/ui/common';
import { of } from 'rxjs';
import { BasicsSharedStringInputLookupService } from '../../lookup-helper/basics-shared-string-input-lookup.service';

export class BasicsSharedImportExcelHeaderService extends BasicsSharedStringInputLookupService<LookupSimpleEntity> {
	public constructor() {
		super({
			uuid: 'f1661fdf78688a65b8fcf5c3b695e0ec',
			valueMember: 'desc',
			displayMember: 'desc',
			showClearButton: true,
		});
	}

	private readonly _data: LookupSimpleEntity[] = [{ id: 1, desc: '' }];

	public getList() {
		return of(this._data);
	}

	public getData() {
		return this._data;
	}

	public setList(headers: string[]) {
		//this._data = [{id: '', displayName: ''}]; // not mapped item
		this._data.slice(0);
		for (let i = 0, len = headers.length; i < len; i++) {
			this._data.push({ id: i + 1, desc: headers[i] });
		}
	}

	public getItemByDescription(value: string) {
		if (!this._data || this._data.length === 0) {
			return null;
		}

		let item = null; // default: null
		for (const element of this._data) {
			if (element.desc === value) {
				item = element;
				break;
			}
		}
		return item;
	}
}
