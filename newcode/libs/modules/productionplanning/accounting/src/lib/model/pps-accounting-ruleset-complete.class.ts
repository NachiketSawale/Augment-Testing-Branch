import { CompleteIdentification } from '@libs/platform/common';
import { IResultEntity, IRuleEntity, IRuleSetEntity } from './models';

export class PpsAccountingRuleSetComplete implements CompleteIdentification<IRuleSetEntity>{

	public Id: number = 0;

	public RuleSets: IRuleSetEntity[] | null = [];

	public RulesToSave: IRuleEntity[] | null = [];
	public RulesToDelete: IRuleEntity[] | null = [];

	public ResultsToSave: IResultEntity[] | null = [];
	public ResultsToDelete: IResultEntity[] | null = [];

}
