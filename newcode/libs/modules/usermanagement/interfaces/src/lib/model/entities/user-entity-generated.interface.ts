/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IAccessUser2GroupEntity } from './access-user-2group-entity.interface';


export interface IUserEntityGenerated extends IEntityBase {

/*
 * AccessUser2GroupEntities
 */
  AccessUser2GroupEntities?: IAccessUser2GroupEntity[] | null;

/*
 * ConfirmPassword
 */
  ConfirmPassword?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DisabledHint
 */
  DisabledHint?: string | null;

/*
 * DomainSID
 */
  DomainSID?: string | null;

/*
 * Email
 */
  Email?: string | null;

/*
 * ExplicitAccess
 */
  ExplicitAccess?: boolean | null;

/*
 * FailedLogon
 */
  FailedLogon?: number | null;

/*
 * FrmIdentityproviderFk
 */
  FrmIdentityproviderFk?: number | null;

/*
 * FrmUserextproviderEntities
 */
  //FrmUserextproviderEntities?: IUserExtProviderEntity[] | null;

/*
 * GUID
 */
  GUID?: string | null;

/*
 * HasPassword
 */
  HasPassword?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IdentityProviderEntity
 */
  //IdentityProviderEntity?: IIdentityProviderEntity | null;

/*
 * IntegratedAccess
 */
  IntegratedAccess?: boolean | null;

/*
 * IsAnonymized
 */
  IsAnonymized?: boolean | null;

/*
 * IsExternal
 */
  IsExternal?: boolean | null;

/*
 * IsPasswordChangeNeeded
 */
  IsPasswordChangeNeeded?: boolean | null;

/*
 * IsProtected
 */
  IsProtected?: boolean | null;

/*
 * Lastlogin
 */
  Lastlogin?: string | null;

/*
 * LoginAllowedFrom
 */
  LoginAllowedFrom?: string | null;

/*
 * LoginAllowedTo
 */
  LoginAllowedTo?: string | null;

/*
 * LoginBlockedUntil
 */
  LoginBlockedUntil?: string | null;

/*
 * LogonName
 */
  LogonName?: string | null;

/*
 * Name
 */
  Name?: string | null;

/*
 * Password
 */
  Password?: string | null;

/*
 * PasswordExpiration
 */
  PasswordExpiration?: string | null;

/*
 * ProviderUniqueIdentifier
 */
  ProviderUniqueIdentifier?: string | null;

/*
 * Setinactivedate
 */
  Setinactivedate?: string | null;

/*
 * State
 */
  State?: number | null;

/*
 * Symbolname
 */
  Symbolname?: string | null;

/*
 * SynchronizeDate
 */
  SynchronizeDate?: string | null;

  /*
* TimeSymbolGroupFk
*/
	UserGroupFk?: number | null;
}
