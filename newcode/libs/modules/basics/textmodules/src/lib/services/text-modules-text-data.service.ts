import {Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {ITextModuleTextEntity} from '../model/entities/textmoduletext-entity.interface';
import {ITextModuleEntity} from '../model/entities/textmodule-entity.interface';
import {TextModuleCompleteEntity} from '../model/entities/textmodulecomplete-entity.class';
import {BasicsTextModulesMainService} from './text-modules-main-data.service';
import {get, find, cloneDeep} from 'lodash';
import {PlatformConfigurationService, ServiceLocator} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {BlobsEntity, IClobsEntity} from '@libs/basics/shared';
import {Observable, map} from 'rxjs';
import {IBasicsCustomizeLanguageEntity} from '@libs/basics/interfaces';
import {BasicsTextModulesScope} from '../model/basics-textmodules-scope';
import {BasicsTextModulesTextControllerService} from './text-modules-text-controller-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsTextModulesTextDataService extends DataServiceFlatLeaf<ITextModuleTextEntity, ITextModuleEntity,
	TextModuleCompleteEntity> {
	public selectedLanguageId = {
		TextBlob: null,
		TextClob: null
	};

	public scope = new BasicsTextModulesScope();

	public basicsTextModulesTextControllerService = new BasicsTextModulesTextControllerService(this.scope, this);

	private languageList = null;
	private http = ServiceLocator.injector.get(HttpClient);
	private configService = ServiceLocator.injector.get(PlatformConfigurationService);

	public constructor(public ParentService: BasicsTextModulesMainService) {
		const options: IDataServiceOptions<ITextModuleTextEntity> = {
			apiUrl: 'basics/textmodules/text',
			readInfo: {
				endPoint: 'getbyparentid',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<ITextModuleTextEntity, ITextModuleEntity, TextModuleCompleteEntity>>{
				itemName: 'TextModuleText',
				role: ServiceRole.Leaf,
				parent: ParentService
			}
		};

		super(options);
	}

	protected override onLoadSucceeded(loaded: object): ITextModuleTextEntity[] {
		this.setList(loaded as ITextModuleTextEntity[]);
		this.basicsTextModulesTextControllerService.itemListChange(this.scope);
		return loaded as ITextModuleTextEntity[];
	}

	public getBlobStringById(blobId: number) {
		const promise = new Promise<BlobsEntity | null>((resolve, reject) => {
			this.http.get<BlobsEntity>(this.configService.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + blobId)
				.subscribe(response => {
					if (response) {
						resolve(response);
					}
					return null;
				});
		});

		return promise;
	}

	public getClobById(clobId: number) {
		const promise = new Promise<IClobsEntity | null>(resolve => {
			this.http.get(this.configService.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + clobId)
				.subscribe(response => {
					if (response) {
						const clobEntity = response as IClobsEntity;
						if (clobEntity.Id === 0) {
							clobEntity.Id = clobId;
							clobEntity.Content = '';
						}
						return resolve(clobEntity);
					}
					return null;
				});
		});
		return promise;
	}

	public getDataByLanguageId(id: number, type?: string) {
		type = type || 'TextBlob';
		const list = this.getList();
		const found = find(list, {LanguageFk: id});
		if (found) {
			if (type === 'TextBlob') {
				if (found.BlobFk) {
					if (!found.TextBlob) {
						return this.getBlobStringById(found.BlobFk)
							.then(blob => {
								if (blob) {
									found.TextBlob = blob;
								} else {
									found.TextBlob = this.createTextObject() as BlobsEntity;
									if (found.TextBlob && found.BlobFk) {
										found.TextBlob.Id = found.BlobFk;
									}
								}
								return found;
							});
					}
				} else if (!found.TextBlob) {
					found.TextBlob = this.createTextObject() as BlobsEntity;
				}
			} else {
				if (found && found.ClobFk) {
					if (!found.TextClob) {
						return this.getClobById(found.ClobFk)
							.then(clob => {
								found.TextClob = clob;
								return found;
							});
					}
				} else if (!found.TextClob) {
					found.TextClob = this.createTextObject() as IClobsEntity;
				}
			}

			return Promise.resolve(found);
		}

		const newData = this.createTempData(id, type);
		this.getList().push(newData as ITextModuleTextEntity);
		return Promise.resolve(newData);
	}

	private createTempData(languageId: number, type: string | null) {
		const parentItem = this.ParentService.getSelection()[0];
		if (!parentItem || !languageId) {
			return {};
		}

		const textModuleFk = parentItem.Id;
		const temp = {
			Id: -languageId,
			LanguageFk: languageId,
			BlobFk: null,
			ClobFk: null,
			Version: 0,
			TextModuleFk: textModuleFk,
			TextBlob: {},
			TextClob: {}
		};

		if (type === 'TextBlob') {
			temp.TextBlob = this.createTextObject();
		} else {
			temp.TextClob = this.createTextObject();
		}

		return temp;
	}

	private createTextObject() {
		return {
			Id: 0,
			Content: '',
			Version: 0
		};
	}

	private updateParentItem(languageId: number) {
		const parentItem = this.ParentService.getSelection()[0];
		if (parentItem && parentItem.LanguageFk === languageId && (parentItem.BlobsFk || parentItem.ClobsFk)) {
			parentItem.BlobsFk = null;
			parentItem.ClobsFk = null;
			this.ParentService.setModified(parentItem);
		}
	}

	private findItemToMerge(item2Merge: ITextModuleTextEntity) {
		return (!item2Merge || !item2Merge.Id) ? undefined : find(this.getList(), {LanguageFk: item2Merge.LanguageFk});
	}

	public getLanguageList(): Observable<IBasicsCustomizeLanguageEntity | null> {
		if (this.languageList) {
			return cloneDeep(this.languageList);
		} else {
			return this.http.get(this.configService.webApiBaseUrl + 'basics/textmodules/text/getlanguagelist')
				.pipe(map((response) => {
					if (response) {
						const data = get(response, 'data');
						if (data) {
							this.languageList = data;
							return cloneDeep(this.languageList);
						}
					}
					return null;
				}));
		}
	}

	public getVariableListByLanguageId(languageId: number) {
		return this.http.get(this.configService.webApiBaseUrl + 'basics/textmodules/text/getvariablelist?languageId=' + languageId)
			.subscribe(function (response) {
				return get(response, 'data');
			});
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		return {
			mainItemId: -1
		};
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		return {
			mainItemId: -1
		};
	}

	protected override onCreateSucceeded(created: object): ITextModuleTextEntity {
		return created as unknown as ITextModuleTextEntity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(complete: TextModuleCompleteEntity): ITextModuleTextEntity[] {
		if (complete && complete.TextModuleTextToSave){
			return complete.TextModuleTextToSave;
		}
		return [];
	}

	public override registerModificationsToParentUpdate(parentUpdate: TextModuleCompleteEntity,
	                                                    modified: ITextModuleTextEntity[],
	                                                    deleted: ITextModuleTextEntity[]) {
		if (modified) {
			parentUpdate.TextModuleTextToSave = modified;
		}
	}
}
