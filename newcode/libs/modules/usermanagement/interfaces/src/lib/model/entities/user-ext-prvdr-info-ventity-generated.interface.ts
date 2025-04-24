/*
 * Copyright(c) RIB Software GmbH
 */

export interface IUserExtPrvdrInfoVEntityGenerated {

  /**
   * BpdId
   */
  bpdId?: number | null;

  /**
   * BpdName1
   */
  bpdName1?: string | null;

  /**
   * BpdName2
   */
  bpdName2?: string | null;

  /**
   * City
   */
  city?: string | null;

  /**
   * Comment
   */
  comment?: string | null;

  /**
   * ContactId
   */
  contactId: number;

  /**
   * Email
   */
  email: string;

  /**
   * FamilyName
   */
  familyName: string;

  /**
   * Id
   */
  id: number;

  /**
   * IdentityProviderName
   */
  identityProviderName?: string | null;

  /**
   * IdentityproviderFk
   */
  identityproviderFk?: number | null;

  /**
   * IsExternal
   */
  isExternal: boolean;

  /**
   * LastLogin
   */
  lastLogin?: string | null;

  /**
   * LogonName
   */
  logonName: string;

  /**
   * PortalUserGroupName
   */
  portalUserGroupName?: string | null;

  /**
   * PortalusergroupFk
   */
  portalusergroupFk?: number | null;

  /**
   * Provider
   */
  provider: string;

  /**
   * ProviderId
   */
  providerId: string;

  /**
   * Setinactivedate
   */
  setinactivedate?: string | null;

  /**
   * State
   */
  state?: number | null;

  /**
   * Street
   */
  street?: string | null;

  /**
   * UserId
   */
  userId: number;

  /**
   * ZipCode
   */
  zipCode?: string | null;
}
