import { CompleteIdentification } from '@libs/platform/common';
import { IAccessRole2RoleEntity } from './entities/access-role-2role-entity.interface';

export class UsermanagementRole2RoleComplete implements CompleteIdentification<IAccessRole2RoleEntity>{

	public MainItemId: number = 0;

	public Role: IAccessRole2RoleEntity[] | null = [];

	public EntitiesCount?: number | null;


}
