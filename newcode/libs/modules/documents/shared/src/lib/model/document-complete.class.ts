import {CompleteIdentification} from '@libs/platform/common';
import {IDocumentProjectEntity} from './entities/document-project-entity.interface';
import {IDocument2mdlObjectEntity} from './entities/document-2mdl-object-entity.interface';
import {IDocumentRevisionEntity} from './entities/document-revision-entity.interface';
import {IBasicsClerkEntity} from '@libs/basics/shared';



export class DocumentComplete implements CompleteIdentification<IDocumentProjectEntity>{
    //todo: clerk data

/*
 * ClerkDataToDelete
 */
    public ClerkDataToDelete?: IBasicsClerkEntity[] | null;

/*
 * ClerkDataToSave
 */
    public ClerkDataToSave?: IBasicsClerkEntity[] | null;

    /*
     * Document
     */
   public  Document?: IDocumentProjectEntity[] | null;

    /*
     * Document2mdlObjectToDelete
     */
   public Document2mdlObjectToDelete?: IDocument2mdlObjectEntity[] | null;

    /*
     * Document2mdlObjectToSave
     */
    public Document2mdlObjectToSave?: IDocument2mdlObjectEntity[] | null;

    /*
     * DocumentRevisionToDelte
     */
    public DocumentRevisionToDelte?: IDocumentRevisionEntity[] | null;

    /*
     * DocumentRevisionToSave
     */
    public DocumentRevisionToSave?: IDocumentRevisionEntity[] | null;
}