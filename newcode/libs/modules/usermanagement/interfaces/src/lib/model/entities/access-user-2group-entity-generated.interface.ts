/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IUserEntity } from './user-entity.interface';
export interface IAccessUser2GroupEntityGenerated extends IEntityBase {

	/*
	 * AccessGroupFk
	 */
	AccessGroupFk?: number | null;
	/*
    * Description
	 */
	Description?: string | null;
	/*
	 * Id
	 */
	Id?: string | null;

	/*
	 * IdentityProvider
	 */
	IdentityProvider?: number | null;

	/* FrmIdentityproviderFk
	*/
	FrmIdentityproviderFk?: number | null;

	/*
	 * UserEntity
	 */
	UserEntity?: IUserEntity | null;

	/*
	 * UserFk
	 */
	UserFk?: number | null;

	/*
   * UserGroupFk
   */
	UserGroupFk?: number | null;

	/*
   * UsermanagementGroupFk
   */
	UsermanagementGroupFk?: number | null;
}
