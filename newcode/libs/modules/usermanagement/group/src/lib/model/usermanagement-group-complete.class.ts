import { CompleteIdentification } from '@libs/platform/common';
import { IAccessGroupEntity } from './entities/access-group-entity.interface';

export class UsermanagementGroupComplete implements CompleteIdentification<IAccessGroupEntity>{

	public Id: number = 0;

	public Group: IAccessGroupEntity [] | null = [];

	
}
