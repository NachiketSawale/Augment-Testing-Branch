import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class WizardCounterService {

	private count: number = 0;

	public callWizard(): number {
		this.count++;
		return this.count;
	}
}
