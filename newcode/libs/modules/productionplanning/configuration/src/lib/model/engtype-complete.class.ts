import { CompleteIdentification } from '@libs/platform/common';
import { IEngTypeEntity } from './entities/eng-type-entity.interface';

export class EngtypeComplete implements CompleteIdentification<IEngTypeEntity> {

	public EngType!: IEngTypeEntity | null;
}
