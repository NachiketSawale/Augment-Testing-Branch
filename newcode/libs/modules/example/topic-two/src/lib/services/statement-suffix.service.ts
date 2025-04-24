import { Injectable } from '@angular/core';
import { StatementService } from './statement.service';

@Injectable({
	providedIn: 'root'
})
export class StatementSuffixService {

	public constructor(private readonly statementSvc: StatementService) {
	}

	public appendAffirmativeSuffix(msg: string): string {
		return `${msg} ${this.statementSvc.affirmativeStatement}`;
	}

	public appendDoubtfulSuffix(msg: string): string {
		return `${msg} ${this.statementSvc.doubtfulStatement}`;
	}
}
