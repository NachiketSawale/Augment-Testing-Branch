/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactPhotoEntity } from '../common';
import { IContactEntity } from './contact-entity.interface';

export interface IImportVCFResponseGenerated {

  /**
   * ContactDto
   */
  ContactDto?: IContactEntity | null;

  /**
   * ContactPhotoToSave
   */
  ContactPhotoToSave?: IContactPhotoEntity[] | null;

  /**
   * FileName
   */
  FileName?: string | null;
}
