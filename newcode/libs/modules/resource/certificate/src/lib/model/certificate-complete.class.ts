/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICertificatedPlantEntity } from '@libs/resource/interfaces';
import { ICertificateEntity } from '@libs/resource/interfaces';
import { ICertificateDocumentEntity } from '@libs/resource/interfaces';

import { CompleteIdentification } from '@libs/platform/common';

export class CertificateComplete implements CompleteIdentification<ICertificateEntity>{

 /*
  * CertificateId
  */
  public CertificateId: number | null = 10;

 /*
  * CertificatedPlantsToDelete
  */
  public CertificatedPlantsToDelete: ICertificatedPlantEntity[] | null = [];

 /*
  * CertificatedPlantsToSave
  */
  public CertificatedPlantsToSave: ICertificatedPlantEntity[] | null = [];

 /*
  * Certificates
  */
  public Certificates: ICertificateEntity[] | null = [];

 /*
  * DocumentsToDelete
  */
  public DocumentsToDelete: ICertificateDocumentEntity[] | null = [];

 /*
  * DocumentsToSave
  */
  public DocumentsToSave: ICertificateDocumentEntity[] | null = [];
}
