/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IViewpointEntity } from '../../model/entities/viewpoint-entity.interface';
import { IModelAnnotationCameraEntity, IModelAnnotationMarkerEntity, IModelAnnotationObjectLinkEntity } from '@libs/model/annotation'; 

export class ViewpointComplete implements CompleteIdentification<IViewpointEntity>{

 /*
  * Id
  */
  public Id?: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;

 /*
  * ModelAnnotationCamerasToDelete
  */
   public ModelAnnotationCamerasToDelete?:IModelAnnotationCameraEntity;

 /*
  * ModelAnnotationCamerasToSave
  */
  public ModelAnnotationCamerasToSave?: IModelAnnotationCameraEntity;

 /*
  * ModelAnnotationMarkersToDelete
  */
  public ModelAnnotationMarkersToDelete?: IModelAnnotationMarkerEntity;

 /*
  * ModelAnnotationMarkersToSave
  */
  public ModelAnnotationMarkersToSave?: IModelAnnotationMarkerEntity;

 /*
  * ModelAnnotationObjectLinksToDelete
  */
  public ModelAnnotationObjectLinksToDelete?: IModelAnnotationObjectLinkEntity;

 /*
  * ModelAnnotationObjectLinksToSave
  */
  public ModelAnnotationObjectLinksToSave?: IModelAnnotationObjectLinkEntity;

 /*
  * ModelViewpoints
  */
   public ModelViewpoints?: IViewpointEntity | null = {
     Code: '',
     Id: 0,
     IsImportant: false,
     ModelFk: 0,
     ViewpointTypeFk: 0,
     NormalizedId: ''
   };
}
