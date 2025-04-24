import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StatementService {

	public get affirmativeStatement() {
		return 'So say we all.';
	}

	public get doubtfulStatement() {
		return 'I doubt it.';
	}
}
