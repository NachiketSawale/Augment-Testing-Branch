import { CompleteIdentification } from '@libs/platform/common';
import { IActivityTmpl2CUGrpEntity } from './entities/activity-tmpl-2cugrp-entity.interface';

export class SchedulingTemplateActivityTmpl2CUGrpComplete implements CompleteIdentification<IActivityTmpl2CUGrpEntity>{

	public Id: number = 0;

	public Datas: IActivityTmpl2CUGrpEntity[] | null = [];


}
