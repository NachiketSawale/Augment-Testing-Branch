/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntitySelection} from '@libs/platform/data-access';

/**
 * Interface for document services.
 */
export interface IDocumentService<T> extends IEntitySelection<T>{
	/**
	 *  Whether the standard create button is displayed, some special container not need this button, for example: revision container
	 */
	 createBtVisible:boolean;
    /**
     *  upload attachment For Selected document entity button visible option
     */
    uploadForSelectedBtVisible:boolean;
    /**
     *  upload attachment and create new document entity button visible option
     */
    uploadAndCreateDocsBtVisible:boolean;
    /**
     *  download attachment button visible option
     */
    downloadFilesBtVisible:boolean;
    /**
     *  cancel upload files button visible option
     */
    cancelUploadFilesBtVisible:boolean;
    /**
     *  preview document button visible option
     */
    previewBtVisible:boolean;
    /**
	  *  onlineEdit button visible option
	  */
    onlineEditBtVisible:boolean;
    /**
     *  whether the file needs to be unzipped
     */
  // extractZipOrNot:boolean//todo: may not need this option, not put this option in container, setting it in toolbar?
    /**
     * check can upload a file for selected document entity
     */
    canUploadForSelected(): boolean
    /**
     * can upload files and create document entity for each file
     */
    canUploadAndCreateDocs(): boolean
    /**
     * can download files
     */
    canDownloadFiles(): boolean

    /**
     * upload a file for selected document entity
     */
    uploadForSelected():void

    /**
     * upload files and create documents
     */
    uploadAndCreateDocs():void
	 /**
	 * download files
	 */
    downloadFiles():void

	/**
	 * download Pdf file about markup (only pdf type and need use ige viewer)
	 */
	downloadPdf(): void

	/**
	 * can download pdf file about markup
	 */
	canDownloadPdf(): boolean
	 /**
	 * can online edit office document
	 */
	canOnlineEditOfficeDocument() : boolean
	/**
	 * can synchronize document.
	 */
	canSynchronizeDocument() : boolean
	 /**
	 * online edit office document via one-drive.
	 */
	onlineEditOfficeDocument() : void
	 /**
	 * synchronize office document from OneDrive.
	 */
	synchronizeOfficeDocument() : void


}