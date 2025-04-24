import { CompleteIdentification } from '@libs/platform/common';
import { IAccessUsersInGroupEntity } from '@libs/usermanagement/interfaces';

/**
 * Usermanagement User in Group complete class
 */
export class UsermanagementGroupUsersInGroupComplete implements CompleteIdentification<IAccessUsersInGroupEntity>{

	public MainItemId: number = 0;

	public Datas: IAccessUsersInGroupEntity[] | null = [];


}
