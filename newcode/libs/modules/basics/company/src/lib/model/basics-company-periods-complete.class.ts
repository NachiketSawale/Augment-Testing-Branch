import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';

export class BasicsCompanyPeriodsComplete implements CompleteIdentification<ICompanyPeriodEntity>{

	public Id: number = 0;
	/*
 * MainItemId
 */
	public MainItemId?: number | null;

	public Periods?: ICompanyPeriodEntity | null;

	public constructor(e: ICompanyPeriodEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.Periods = e;
		}
	}
}
