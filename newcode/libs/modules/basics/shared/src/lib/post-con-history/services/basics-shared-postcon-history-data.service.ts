/*
 * Copyright(c) RIB Software GmbH
 */
import {
	CompleteIdentification,
	IEntityIdentification, PlatformPermissionService
} from '@libs/platform/common';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions, IEntitySelection,
	ServiceRole
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { BasicsShareFileDownloadService } from '../../services/basics-shared-file-download.service';
import { IBasicsSharedPostConHistoryEntity } from '../model/entities/basics-shared-postcon-history-entity.interface';
import { IBasicsSharedPostConHistoryPostParam } from '../model/interface/basics-shared-postcon-history-post-param.interface';

export abstract class BasicsSharedPostConHistoryDataService<T extends IBasicsSharedPostConHistoryEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	private readonly downLoadService = inject(BasicsShareFileDownloadService);
	private readonly permissonservice = inject(PlatformPermissionService);
	private readonly permissonid = '4eaa47c530984b87853c6f2e4e4fc67e';
	protected constructor(protected parentService: IEntitySelection<PT>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/common/postconhistory',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcPostconHistory',
				parent: parentService
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		return this.getParentId(this.parentService.getSelectedEntity() as PT);
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		return loaded as unknown as T[];
	}

	public abstract getParentId(parent:PT):IBasicsSharedPostConHistoryPostParam;

	public downloadFiles(){
		const selectedDocuments = this.getSelection();
		if(selectedDocuments.length > 1){
			const docIds = selectedDocuments.map(e=>{
				return e.FileArchiveDocFk;
			}).filter(id => id !== undefined);
			this.downLoadService.download(docIds as number[]);
		}else{
			this.downLoadService.download([selectedDocuments[0].FileArchiveDocFk ?? -1]);
		}
	}

	public canDownloadFiles(){
		const selectedDocument = this.getSelectedEntity();
		if(selectedDocument){
			return (!!selectedDocument.OriginFileName && selectedDocument.DocumentTypeFk !== 1000) && this.permissonservice.hasRead(this.permissonid);
		}
		return false;
	}

	public canPreview(){
		const selectedDocument = this.getSelectedEntity();
		if (selectedDocument) {
			return (!!selectedDocument.OriginFileName && 1000 !== selectedDocument.DocumentTypeFk) && this.permissonservice.hasRead(this.permissonid);
		}
		return false;
	}

}