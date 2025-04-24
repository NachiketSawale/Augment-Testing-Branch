
import { Translatable } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { EvaluationBaseService } from '../services/evaluation-base.service';


export interface IEvaluationDataServiceInitializeOptions<PT extends object, MT extends object> {
	parentService: IEntitySelection<PT>;
	adaptorService: EvaluationBaseService<PT, MT>;
}

export interface IEvaluationDataEntityInfoOptions<PT extends object, MT extends object> {
	//containerUuid, gridTitle, excludeColumns need to move to evaluation base, this interface needs to be removed.
	containerUuid?: string;
	gridTitle?: Translatable;
	excludeColumns?: () => string[];

	adaptorService: EvaluationBaseService<PT, MT>;
}