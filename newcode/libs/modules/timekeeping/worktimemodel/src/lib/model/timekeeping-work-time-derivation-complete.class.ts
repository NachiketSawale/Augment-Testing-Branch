import { CompleteIdentification } from '@libs/platform/common';
import { IWorkTimeDerivationEntity } from './entities/work-time-derivation-entity.interface';

export class TimekeepingWorkTimeDerivationComplete implements CompleteIdentification<IWorkTimeDerivationEntity>{

	public Id: number = 0;

	public Datas: IWorkTimeDerivationEntity[] | null = [];


}
