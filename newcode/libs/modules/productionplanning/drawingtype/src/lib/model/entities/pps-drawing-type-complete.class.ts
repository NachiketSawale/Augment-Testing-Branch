import { CompleteIdentification } from '@libs/platform/common';
import {IPpsDrawingTypeEntity} from './pps-drawing-type-entity.interface';
import  {IPpsDrawingTypeSkillEntity} from './pps-drawing-type-skill-entity.interface';

export class PpsDrawingTypeCompleteEntity implements CompleteIdentification<IPpsDrawingTypeEntity>{
	public MainItemId: number = 0;
	public EngDrawingType?: IPpsDrawingTypeEntity;
	public  EngDrawingTypes?: IPpsDrawingTypeEntity[];
	public  EngDrawingTypeSkillToSave?: IPpsDrawingTypeSkillEntity[];
	public  EngDrawingTypeSkillToDelete?: IPpsDrawingTypeSkillEntity[];
}
