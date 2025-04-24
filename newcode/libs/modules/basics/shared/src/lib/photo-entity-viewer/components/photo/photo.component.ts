/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, InjectionToken, Injector} from '@angular/core';
import {EntityContainerBaseComponent} from '@libs/ui/business-base';
import {ItemType, UiCommonMessageBoxService} from '@libs/ui/common';
import {lastValueFrom, Observable, Subscriber} from 'rxjs';
import {IPhotoEntityViewerOption} from '../../model/interfaces/option.interface';
import {IPhotoEntityViewerContext} from '../../model/interfaces/option-context.interface';
import {get, set, extend, isString, isEmpty, isNumber} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {IEntityBase, IEntityIdentification, ServiceLocator} from '@libs/platform/common';
import {IEntityProcessor} from '@libs/platform/data-access';

export const PHOTO_ENTITY_VIEWER_OPTION_TOKEN = new InjectionToken<IPhotoEntityViewerOption>('photo-entity-viewer-option-token');

@Component({
	selector: 'basics-shared-photo-entity-view',
	templateUrl: './photo.component.html',
	styleUrls: ['./photo.component.scss']
})
export class BasicsSharedPhotoEntityViewerComponent<T extends IEntityIdentification & IEntityBase> extends EntityContainerBaseComponent<T> {

	private readonly getParentStatusIsReadonly: () => boolean;
	private readonly http: HttpClient;
	private readonly context: IPhotoEntityViewerContext = {
		injector: inject(Injector),
		create: this.createEntity,
		delete: this.deleteEntity,
		change: this.changeImage,
		canCreate: this.canCreate,
		canDelete: this.canDelete,
		canChange: this.canChange,
		canCommentEdit: this.doCanCommentEdit,
		openFileDialog: this.openFileDialog,
		currentFileInfo: {},
		doImportFile: this.doImportFile,
		component: this
	};
	private readonly maxSize = 4 * 1024 * 1024;

	protected currentIndex: number = 0;
	protected blobContents: string[] = [];
	protected currentCommentText: string | null | undefined = null;
	protected file: {src: string | null} = {src: null};

	protected options: IPhotoEntityViewerOption = {
		isSyncMode: true,
		imageField: 'Blob.Content',
		commentField: 'CommentText',
		isSingle: false,
		hideChangeItem: false,
		hideCreateEntity: false,
		hideDeleteEntity: false,
		hasCommentTextField: false,
		getParentStatusIsReadonly() {
			return false;
		}
	};

	public constructor() {
		super();
		this.getParentStatusIsReadonly = () => false;
		this.http = inject(HttpClient);

		const customOption = inject(PHOTO_ENTITY_VIEWER_OPTION_TOKEN);
		extend(this.options, customOption);
		this.getParentStatusIsReadonly = this.options.getParentStatusIsReadonly || this.getParentStatusIsReadonly;
		this.updateTools();
		this.subscribeSelectionChanged();
		if (!this.options.isSyncMode) {
			this.getFile();
		}
	}

	private subscribeSelectionChanged() {
		if (this.options.isSyncMode) {
			const subscription = this.entitySelection?.selectionChanged$.subscribe(selection => {
				const list = this.entityList?.getList();
				let isIndexChanged = false;
				if (list && list.length > 0) {
					if (selection && selection.length > 0) {
						if (this.options.hasCommentTextField && this.options.commentField) {
							const commentField = this.options.commentField;
							const tempText = get(selection[0], commentField, null);
							if (tempText !== null && tempText !== undefined) {
								this.currentCommentText = tempText as string;
							} else {
								this.currentCommentText = null;
							}
						}
						const index = list.indexOf(selection[0]);
						if (index > -1) {
							this.currentIndex = index;
							isIndexChanged = true;
						}
					} else {
						this.entitySelection?.select(list[0]);
						isIndexChanged = true;
					}
				}

				if (!isIndexChanged) {
					this.currentIndex = 0;
					this.reset();
				} else {
					const selectedEntity = this.entitySelection?.getSelectedEntity();
					if (selectedEntity) {
						const imageField = this.options.imageField as string;
						const content = get(selectedEntity, imageField);
						this.file.src = this.toImage(content || '');
					}
				}
			});
			this.registerFinalizer(() => subscription.unsubscribe());
		} else {
			const subscription = this.entitySelection?.selectionChanged$.subscribe(async () => {
				await this.getFile();
			});
			this.registerFinalizer(() => subscription.unsubscribe());
		}
	}

	protected getBlobContent(): string[] {
		const list = this.entityList?.getList();
		const contents: string[] = [];
		const imageField = this.options.imageField as string;
		list?.forEach(function (item) {
			if (item) {
				const content = get(item, imageField, '') as string;
				contents.push(content);
			}
		});
		this.blobContents = contents;
		return contents;
	}

	protected canCommentEdit() {
		if (this.options.canCommentEdit) {
			return this.options.canCommentEdit(this.context);
		}
		return this.doCanCommentEdit();
	}

	private doCanCommentEdit() {
		return this.entitySelection?.hasSelection() && !(this.options.getParentStatusIsReadonly ? this.options.getParentStatusIsReadonly() : false);
	}

	protected onCommentChange(value: string | null) {
		const selection = this.entitySelection?.getSelection();
		if (selection && selection.length > 0) {
			const current = selection[0];
			const commentField = this.options.commentField as string;
			set(current, commentField, value);
			this.entityModification?.setModified(current);
		}
	}

	protected getCurrentIndex(index: number) {
		this.currentIndex = index;
		const list = this.entityList?.getList();
		if (list && list.length > 0) {
			this.entitySelection.select(list[index]);
		}
	}

	private updateTools() {
		if (this.options.isSyncMode) {
			this.uiAddOns.toolbar.addItems([{
				caption: {key: 'cloud.common.taskBarNewRecord'},
				disabled: () => {
					return this.options.canCreate ? !this.options.canCreate(this.context) : !this.canCreate();
				},
				hideItem: () => {
					return this.options.hideCreateEntity || false;
				},
				iconClass: 'tlb-icons ico-rec-new',
				id: 'create',
				fn: () => {
					this.options.create ? this.options.create(this.context) : this.createEntity();
				},
				sort: 1,
				permission: '#c',
				type: ItemType.Item,
			}, {
				caption: {key: 'cloud.common.taskBarDeleteRecord'},
				disabled: () => {
					return this.options.canDelete ? !this.options.canDelete(this.context) : !this.canDelete();
				},
				hideItem: () => {
					return this.options.hideDeleteEntity || false;
				},
				iconClass: 'tlb-icons ico-rec-delete',
				id: 'delete',
				fn: () => {
					this.options.delete ? this.options.delete(this.context) : this.deleteEntity();
				},
				sort: 2,
				permission: '#d',
				type: ItemType.Item,
			}, {
				id: 'change',
				caption: 'cloud.common.toolbarChangePicture',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-pic-change',
				fn: () => {
					this.options.change ? this.options.change(this.context) : this.changeImage();
				},
				disabled: () => {
					return this.options.canChange ? !this.options.canChange(this.context) : !this.canChange();
				},
				hideItem: () => {
					return this.options.hideChangeItem || false;
				},
				sort: 3,
				permission: '#c',
			}]);
		} else {
			this.uiAddOns.toolbar.addItems([{
				caption: {key: 'cloud.common.taskBarNewRecord'},
				disabled: () => {
					return this.options.canCreate ? !this.options.canCreate(this.context) : !this.canCreate();
				},
				hideItem: () => {
					return this.options.hideCreateEntity || false;
				},
				iconClass: 'tlb-icons ico-rec-new',
				id: 'create',
				fn: () => {
					this.uploadFiles();
				},
				sort: 4,
				permission: '#c',
				type: ItemType.Item,
			}, {
				caption: {key: 'cloud.common.taskBarDeleteRecord'},
				disabled: () => {
					return this.options.canDelete ? !this.options.canDelete(this.context) : !this.canDelete();
				},
				hideItem: () => {
					return this.options.hideDeleteEntity || false;
				},
				iconClass: 'tlb-icons ico-rec-delete',
				id: 'delete',
				fn: async () => {
					await this.deleteFile();
				},
				sort: 5,
				permission: '#d',
				type: ItemType.Item,
			}, ]);
		}

		this.uiAddOns.toolbar.addItems([
			{
				caption: {key: 'platform.formContainer.previous'},
				disabled: () => {
					return this.getSelectedIndex() <= 0;
				},
				hideItem: () => {
					return this.options.isSingle || false;
				},
				iconClass: 'tlb-icons ico-rec-previous',
				id: 'previous',
				fn: () => {
					const list = this.entityList?.getList() || [];
					let index = this.getSelectedIndex();
					this.entitySelection?.select(list[--index]);
				},
				sort: 6,
				permission: '#r',
				type: ItemType.Item,
			}, {
				caption: {key: 'platform.formContainer.next'},
				disabled: () => {
					const list = this.entityList?.getList() || [];
					const index = this.getSelectedIndex();
					return index === -1 || index >= list.length - 1;
				},
				hideItem: () => {
					return this.options.isSingle || false;
				},
				iconClass: 'tlb-icons ico-rec-next',
				id: 'next',
				fn: () => {
					const list = this.entityList?.getList() || [];
					let index = this.getSelectedIndex();
					this.entitySelection?.select(list[++index]);
				},
				sort: 7,
				permission: '#r',
				type: ItemType.Item,
			}
		]);
	}

	protected openFileDialog() {
		this.context.currentFileInfo = {};
		const fileInfo = this.context.currentFileInfo;
		return new Observable((subscriber: Subscriber<[File, string]>) => {
			const fileInputEle = document.createElement('input') as HTMLInputElement;

			const readImage = (e: Event) => {
				const target = e.target as HTMLInputElement;
				const files = target.files as FileList;

				if (files[0].type.indexOf('image') > -1) {
					const selectedFile = files[0];

					if (selectedFile.size > this.maxSize) {
						const msgBox = ServiceLocator.injector.get(UiCommonMessageBoxService);
						msgBox.showMsgBox({
							headerText: 'Info',
							bodyText: 'Photo size is over 4M.',
							iconClass: 'ico-info'
						});
						fileInputEle.removeEventListener('change', readImage);
						return;
					}

					const reader = new FileReader();
					reader.onload = () => {
						const imageBase64Url = reader.result;
						if (imageBase64Url) {
							const blob = imageBase64Url as string;
							fileInfo.file = selectedFile;
							fileInfo.blob = blob;
							subscriber.next([selectedFile, blob]);
						}
						fileInputEle.removeEventListener('change', readImage);
					};

					reader.readAsDataURL(selectedFile);
				} else {
					fileInputEle.removeEventListener('change', readImage);
				}
			};

			if (fileInputEle) {
				fileInputEle.type = 'file';
				fileInputEle.accept = 'image/*';
				fileInputEle.addEventListener('change', readImage);
				fileInputEle.click();
			}
		});
	}

	private async getFile() {
		const selectedMainItem = this.entitySelection?.getSelectedEntity();
		this.file.src = null;
		// this.cancelRequest();
		if (!selectedMainItem || !this.options.blobFieldName) {
			return;
		}
		const blobId = get(selectedMainItem, this.options.blobFieldName);
		if (blobId) {
			// setLoading();
			this.reset();
			const src = await this.doGetFile(blobId);
			if (src) {
				this.file.src = this.toImage(src);
			}
		}

	}

	private async deleteFile() {
		// setLoading();
		// setMessage(deleteMessage, null);
		const selected = this.entitySelection?.getSelectedEntity();
		if (!selected) {
			return;
		}

		await this.doDeleteFile(selected);
		this.reset();
	}

	private uploadFiles() {
		const subscription = this.openFileDialog().subscribe(async data => {
			this.reset();
			// setMessage(uploadMessage, file.name);
			const file = data[0];
			this.reset();
			const result = await this.doImportFile(file);

			if (typeof result === 'object' && result && 'Base64String' in result) {
				this.file.src = result.Base64String;
			}
		});
		this.registerFinalizer(() => subscription.unsubscribe());
	}

	private canCreate() {
		let can = false;
		if (this.entityCreate) {
			can = this.entityCreate?.canCreate();
		}
		if (this.options.isSingle) {
			let selected = this.entitySelection?.getSelectedEntity();
			if (this.options.isSyncMode) {
				if (this.entityList && this.entityList.any()) {
					can = false;
				}
			} else {
				if (!selected && this.options.getSelectedSuperEntity) {
					const temp = this.options.getSelectedSuperEntity();
					if (temp) {
						selected = temp as unknown as T;
					}
				}
				if (!selected || !selected.Version) {
					can = false;
				}
				const blobId = get(selected, this.options.blobFieldName || '', null);
				if (blobId) {
					can = false;
				}
			}
		}
		return can && !this.getParentStatusIsReadonly();
	}

	private canDelete() {
		let can = false;
		if (this.entityDelete) {
			can = this.entityDelete.canDelete();
		}
		return can && !this.getParentStatusIsReadonly();
	}

	private canChange() {
		const selection = this.entitySelection?.getSelection();
		return selection && selection.length > 0 && !this.getParentStatusIsReadonly();
	}

	private createEntity() {
		const imageField = this.options.imageField as string;
		const subscription = this.openFileDialog().subscribe(data => {
			this.entityCreate?.create().then(created => {
				set(created, imageField, this.toBlob(data[1]));
				this.entityModification?.setModified(created);
				this.file.src = this.toImage(data[1]);
			});
		});
		this.registerFinalizer(() => subscription.unsubscribe());
	}

	private deleteEntity() {
		let list = this.entityList?.getList();
		if (list && list.length > 0) {
			this.entityDelete?.delete(list[this.currentIndex]);
			list = this.entityList?.getList();
			if (list && this.currentIndex < list.length) {
				this.entitySelection?.select(list[this.currentIndex]);
			} else {
				this.reset();
				this.currentIndex = 0;
				this.entitySelection?.select(null);
			}
		}
	}

	private changeImage() {
		const imageField = this.options.imageField as string;
		const subscription = this.openFileDialog().subscribe(data => {
			const selection = this.entitySelection?.getSelection();
			if (selection && selection.length > 0) {
				const selected = selection[0];
				set(selected, imageField, this.toBlob(data[1]));
				this.entityModification?.setModified(selected);
				this.file.src = this.toImage(data[1]);
			}
		});
		this.registerFinalizer(() => subscription.unsubscribe());
	}

	private toBlob(image: string): string {
		let blob = '';

		if (isString(image) && image.indexOf('data:') !== -1) {
			blob = image.split(',')[1];
		}

		return blob;
	}

	private getFileId() {
		const selected = this.entitySelection.getSelectedEntity();
		if (selected && this.options.blobFieldName) {
			return get(selected, this.options.blobFieldName, 0) as number;
		}
		return 0;
	}

	private async doImportFile(file: File): Promise<{Base64String: string, BlobId: number | null} | { FileArchiveDocId: number } | null> {

		if (this.options.doImportFile) {
			return await this.options.doImportFile(file, this.context);
		}

		const selected = this.entitySelection.getSelectedEntity();

		if (selected || this.options.standAlone) {
			if (this.options.storeInFileArchive) {
				// get DocId First
				const result = await this.getDocId(file);
				if (result) {
					await this.runImport(file, result.FileArchiveDocId);
				}
				return result;
			} else {
				return await this.runImport(file);
			}
		}
		return Promise.resolve(null);
	}

	private getDocId(file: File) {
		if (!this.options.getDocIdUrl) {
			return Promise.resolve(null);
		}
		return lastValueFrom(this.http.post<{ FileArchiveDocId: number }>(this.options.getDocIdUrl, {
			SectionType: 'TEMP',// OR IMPORT?
			FileName: file.name
		}));
	}

	private async runImport(file: File, fileArchiveDocId?: number) {
		const selected = this.entitySelection.getSelectedEntity();
		if (!this.options.importUrl || !selected) {
			return Promise.resolve(null);
		}

		const formData = new FormData();
		const model = {
			EntityId: this.options.getSuperEntityId ? this.options.getSuperEntityId() : selected ? selected.Id : null
		};
		formData.append('model', JSON.stringify(model));
		formData.append('action', 'upload');
		formData.append('FileArchiveDocId', fileArchiveDocId ? fileArchiveDocId.toString() : '');
		formData.append('file', file);
		const data = await lastValueFrom(this.http.post<{Base64String: string, BlobId: number | null}>(this.options.importUrl, formData));

		const dtoData = get(data, this.options.dtoName || '');
		if (!isEmpty(dtoData)) {
			this.doProcess(dtoData as unknown as T);
			if (!this.options.standAlone) {
				extend(selected, dtoData);
			} else {
				this.entityList?.append(dtoData);
				this.entitySelection?.select(dtoData);
			}
		}
		if (fileArchiveDocId && selected) {
			set(selected, 'FilearchivedocFk', fileArchiveDocId);
			this.entityModification?.setModified(dtoData);
		}

		return data;
	}

	// todo chi: do it later
	private cancelRequest() {
		// // if there is a previous request still running, cancel it, by resolving the inner timeout promise
		// if (self.canceller !== null) {
		// 	self.canceller.resolve();
		// }
	}

	private async doGetFile(id?: number) {
		const fileId =  id || this.getFileId();
		if (this.options.doGetFile) {
			return await this.options.doGetFile(fileId, this.context);
		}

		if (fileId && this.options.getUrl) {
			// self.canceller = $q.defer();
			return await lastValueFrom(this.http.post(this.options.getUrl, {fileId: fileId}, {responseType: 'text'}));
		}
		return Promise.resolve(null);
	}

	private async doDeleteFile(fileEntity: T) {
		if (this.options.doDeleteFile) {
			return await this.options.doDeleteFile(fileEntity, this.context);
		}

		if (this.options.blobFieldName && this.options.deleteUrl) {
			const blobId = get(fileEntity, this.options.blobFieldName);
			if (isNumber(blobId)) {
				const flagBlobs = get(fileEntity, 'FlagBlobs');
				if (flagBlobs !== undefined && flagBlobs === true) {
					const blobFk = get(fileEntity, 'BlobsFk');
					const entity = {BlobsFk: blobFk};
					const fileEntitySaved = await lastValueFrom(this.http.post<IEntityIdentification>(this.options.deleteUrl, entity));
					this.doProcess(fileEntitySaved as unknown as T);
					extend(fileEntity, fileEntitySaved);
				} else {
					const fileEntitySaved = await lastValueFrom(this.http.post<IEntityIdentification>(this.options.deleteUrl, fileEntity));
					this.doProcess(fileEntitySaved as unknown as T);
					extend(fileEntity, fileEntitySaved);
				}
			}
		}
	}

	private reset() {
		this.file.src = null;
		// $scope.info2 = null;
		// $scope.viewContentLoading = false;
		// $scope.tools.update();
	}

	/**
	 *  This function is used for transfer blob data to image content.
	 *
	 * 	@returns {string} return image base64 url
	 */
	private toImage(blob: string): string {
		if (blob.length > 0 && blob.indexOf('base64') === -1) {
			return 'data:image/jpg;base64,' + blob;
		} else {
			return  blob;
		}
	}

	private doProcess(entity: T) {
		if (this.options.processors && this.options.processors.length > 0) {
			this.options.processors.forEach((processor: IEntityProcessor<T>) => {
				processor.process(entity);
			});
		}
	}

	private getSelectedIndex() {
		const selected = this.entitySelection?.getSelectedEntity();
		const list = this.entityList?.getList();
		if (!selected || !list || list.length === 0) {
			return -1;
		}
		return list.indexOf(selected);
	}
}