/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

// import { IModelAnnotationCommentEntity } from './entities/model-annotation-comment-entity.interface';
import { IModelAnnotationCameraEntity } from './entities/model-annotation-camera-entity.interface';
import { IModelAnnotationDocumentEntity } from './entities/model-annotation-document-entity.interface';
import { IModelAnnotationEntity } from './entities/model-annotation-entity.interface';
import { IModelAnnotationMarkerEntity } from './entities/model-annotation-marker-entity.interface';
import { IModelAnnotationObjectLinkEntity } from './entities/model-annotation-object-link-entity.interface';
import { IModelAnnotationReferenceEntity } from './entities/model-annotation-reference-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
// import { IModelAnnotationEntity } from './models';

export class ModelAnnotationComplete implements CompleteIdentification<IModelAnnotationEntity>{

 /*
  * CommentDataToSave
  */
  // public CommentDataToSave?: IModelAnnotationCommentEntity[] | null = [];

 /*
  * Id
  */
  public Id?: number | null = 10;

 /*
  * ModelAnnotationCamerasToDelete
  */
  public ModelAnnotationCamerasToDelete?: IModelAnnotationCameraEntity[] | null = [];

 /*
  * ModelAnnotationCamerasToSave
  */
  public ModelAnnotationCamerasToSave?: IModelAnnotationCameraEntity[] | null = [];

 /*
  * ModelAnnotationDocumentsToDelete
  */
  public ModelAnnotationDocumentsToDelete?: IModelAnnotationDocumentEntity[] | null = [];

 /*
  * ModelAnnotationDocumentsToSave
  */
  public ModelAnnotationDocumentsToSave?: IModelAnnotationDocumentEntity[] | null = [];

 /*
  * ModelAnnotationMarkersToDelete
  */
  public ModelAnnotationMarkersToDelete?: IModelAnnotationMarkerEntity[] | null = [];

 /*
  * ModelAnnotationMarkersToSave
  */
  public ModelAnnotationMarkersToSave?: IModelAnnotationMarkerEntity[] | null = [];

 /*
  * ModelAnnotationObjectLinksToDelete
  */
  public ModelAnnotationObjectLinksToDelete?: IModelAnnotationObjectLinkEntity[] | null = [];

 /*
  * ModelAnnotationObjectLinksToSave
  */
  public ModelAnnotationObjectLinksToSave?: IModelAnnotationObjectLinkEntity[] | null = [];

 /*
  * ModelAnnotationReferencesToDelete
  */
  public ModelAnnotationReferencesToDelete?: IModelAnnotationReferenceEntity[] | null = [];

 /*
  * ModelAnnotationReferencesToSave
  */
  public ModelAnnotationReferencesToSave?: IModelAnnotationReferenceEntity[] | null = [];

 /*
  * ModelAnnotations
  */
  public ModelAnnotations?: IModelAnnotationEntity | null = {
    EffectiveCategoryFk: 0,
    Id: 0,
    ModelFk: 0,
    PriorityFk: 0,
    RawType: 0,
    Sorting: 0,
    StatusFk: 0
  };

 /*
  * ModelViewpointsToDelete
  */
  // public ModelViewpointsToDelete?: IViewpointEntity;

 /*
  * ModelViewpointsToSave
  */
  // public ModelViewpointsToSave?: IViewpointEntity;
}
