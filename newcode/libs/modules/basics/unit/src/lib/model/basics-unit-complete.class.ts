import { BasicsUnitEntity } from './basics-unit-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import { BasicsUnitSynonymEntity } from "./basics-unit-synonym-entity.class";

export class BasicsUnitComplete implements CompleteIdentification<BasicsUnitEntity> {
	public MainItemId: number = 0;

	public Uom: BasicsUnitEntity[] | null = [];

	public SynonymToSave: BasicsUnitSynonymEntity[] | null = [];

	public SynonymToDelete: BasicsUnitSynonymEntity[] | null = [];
}
