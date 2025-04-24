/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable, inject} from '@angular/core';
import {
    IDataServiceChildRoleOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {DocumentComplete} from '../../model/document-complete.class';
import {IDocumentProjectEntity} from '../../model/entities/document-project-entity.interface';
import { IDocumentRevisionEntity} from '../../model/entities/document-revision-entity.interface';
import {DocumentDataLeafService} from '../../base-document/services/document-data-leaf.service';
import {DocumentProjectDataRootService} from '../services/document-project-data-root.service';
import { PlatformConfigurationService, PlatformPermissionService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';

/**
 * The document project revision data service
 */
@Injectable({
    providedIn: 'root',
})
export class DocumentProjectRevisionDataService extends DocumentDataLeafService<IDocumentRevisionEntity, IDocumentProjectEntity, DocumentComplete> {
	 private http = inject(HttpClient);
	 private configService = inject(PlatformConfigurationService);
	 private readonly revisionDescriptor = '4eaa47c530984b87853c6f2e4e4fc67e';
	 private readonly documentDescriptor = '4eaa47c530984b87853c6f2e4e4fc67e';
    private readonly permissionService = inject(PlatformPermissionService);
	 public override createBtVisible: boolean = false;
	 public override uploadAndCreateDocsBtVisible: boolean = false;
    private static cacheMap: Map<string, DocumentProjectRevisionDataService> = new Map();
    public static getInstance(moduleName: string, parentService: DocumentProjectDataRootService<object>): DocumentProjectRevisionDataService {
        let instance = this.cacheMap.get(moduleName);
        if (!instance) {
            instance = new DocumentProjectRevisionDataService(parentService);
            this.cacheMap.set(moduleName, instance);
        }
        return instance;
    }
    private constructor(protected parentService: DocumentProjectDataRootService<object>) {
        super({
            apiUrl: 'documentsproject/revision/final',
            roleInfo: <IDataServiceChildRoleOptions<IDocumentRevisionEntity, IDocumentProjectEntity, DocumentComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'DocumentRevision',
                parent: parentService
            },
            createInfo: {
                prepareParam: ident => {
                    return {
                        MainItemId: ident.pKey1!
                    };
                }
            },
            readInfo: {
                endPoint: 'list',
                prepareParam: ident => {
                    return {
                        MainItemId: ident.pKey1!
                    };
                }
            }
        });
    }

	 public getParentService(): DocumentProjectDataRootService<object>{
		 return this.parentService;
	 }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerModificationsToParentUpdate(parentUpdate: DocumentComplete, modified: IDocumentRevisionEntity[], deleted: IDocumentRevisionEntity[]): void {
        if (modified && modified.some(() => true)) {
            parentUpdate.DocumentRevisionToSave = modified;
        }

        if (deleted && deleted.some(() => true)) {
            parentUpdate.DocumentRevisionToDelte = deleted;
        }
    }

    public override getSavedEntitiesFromUpdate(complete: DocumentComplete): IDocumentRevisionEntity[] {
        if (complete && complete.DocumentRevisionToSave) {
            return complete.DocumentRevisionToSave;
        }

        return [];
    }
    public override canDownloadFiles(): boolean {
		  const canRead = this.permissionService.hasRead(this.revisionDescriptor);
        return canRead && super.canDownloadFiles();
	 }

	public override canDelete(): boolean {
		const document = this.parentService.getSelectedEntity();
		/**
		 * You can configure the access rights for each document, so you need to check whether you have the permission to delete
		 * If the item is not in the central query module of the document, then it is necessary to check whether one has the delete access right
		 */
		const allowDelete = this.permissionService.hasRead(this.documentDescriptor);
		//In document central query module use the standard access right control, this.parentService.parentDataService == null, then document central query module
		if(document && document.PermissionObjectInfo && this.parentService.getParentService()) {
			if (document && document.IsReadonly || !allowDelete || !document.CanDeleteStatus) {
				return false;
			}
		} else {
			if(document && (document.IsReadonly  || !document.CanDeleteStatus) || !allowDelete){
				return false;
			}
		}
		const currentItem = this.getSelectedEntity();
		return !!currentItem;
	}

	public override delete(entities: IDocumentRevisionEntity[] | IDocumentRevisionEntity): void {
		const selectItems = this.getSelection();
		const ids = selectItems.map((item) => {
			return item.Id;
		});
		this.http.post(this.configService.webApiBaseUrl + 'documentsproject/revision/deleteDocumentRevisions', ids).subscribe(res => {
			this.parentService.refreshSelected ? this.parentService.refreshSelected() : this.parentService.refreshAll();
		});
	}

}