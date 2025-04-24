/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IEntityProcessor } from '@libs/platform/data-access';
import { IDocumentEntityGenerated } from '../model/entities/document-entity-generated.interface';
/**
 * This service is used to process the file size of a document entity.
 */
@Injectable({
	providedIn: 'root',
})
export class DocumentsFileSizeProcessorService<T extends IDocumentEntityGenerated> implements IEntityProcessor<T> {
	private readonly decimalByteUnits = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	/**
	 * Processes the given entity to update the file size representation.
	 * @param {T} entity The entity to process.
	 */
	public process(entity: T): void {
		this.processItem(entity);
	}

	/**
	 * Reverts the file size processing, returning the original entity.
	 * @param {T} entity The entity to process.
	 * returns {T} The original entity.
	 */
	public revertProcess(entity: T): T {
		// Implement the logic for reverting the process on the entity
		return entity;
	}

	/**
	 * Converts the file size in bytes to a human-readable format.
	 * @param {T} item
	 */
	public processItem(item: T): void {
		if (item.FileSizeInByte !== undefined && item.FileSizeInByte !== null) {
			if (item.FileSizeInByte <= 1024) {
				item.FileSize = `${item.FileSizeInByte} ${this.decimalByteUnits[0]}`;
			} else {
				let fileSize = item.FileSizeInByte;
				let i = 0;
				while (fileSize >= 1024 && i < this.decimalByteUnits.length - 1) {
					fileSize /= 1024;
					i++;
				}

				item.FileSize = `${fileSize.toFixed(2)} ${this.decimalByteUnits[i]}`;
			}
		}
	}
}
