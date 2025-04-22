import {inject, Injectable} from '@angular/core';
import {PlatformHttpService} from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonSystemOptionBudgetEditingService {
	private readonly httpService = inject(PlatformHttpService);
	private budgetEditableInPrc: boolean | null = null;

	public async getBudgetEditingInProcurementAsync() {
		const result = await this.httpService.get<number>('basics/common/systemoption/getbudgeteditinginprocurement');
		const isEditable = result !== 0;
		this.setBudgetEditableInPrc(isEditable);
		return Promise.resolve(isEditable);
	}

	public getBudgetEditableInPrc() {
		if (this.budgetEditableInPrc !== null) {
			return this.budgetEditableInPrc;
		}
		throw new Error('run function getBudgetEditingInProcurement() first.');
	}

	private setBudgetEditableInPrc(editable: boolean) {
		this.budgetEditableInPrc = editable;
	}
}