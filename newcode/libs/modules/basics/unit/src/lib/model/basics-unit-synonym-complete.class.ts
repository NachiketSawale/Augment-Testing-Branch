import { BasicsUnitSynonymEntity } from './basics-unit-synonym-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsUnitSynonymComplete implements CompleteIdentification<BasicsUnitSynonymEntity> {
	public Id: number = 0;

	public Uom: BasicsUnitSynonymEntity[] | null = [];
}
