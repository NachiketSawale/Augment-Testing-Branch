/*
 * Copyright(c) RIB Software GmbH
 */
import { get } from 'lodash';
import {Injectable} from '@angular/core';
import {
	FieldType,
	ILookupContext,
	ILookupSearchRequest,
	ILookupSearchResponse, LookupContext,
	LookupSearchResponse, UiCommonLookupInputComponent,
	UiCommonLookupReadonlyDataService, UiCommonLookupViewService, UiCommonLookupBtn, StandardDialogButtonId,
} from '@libs/ui/common';
import {
	BasicsSharedCharacteristicCodeDialogComponent
} from '../components/characteristic-code-dialog/characteristic-code-dialog.component';
import {  ICharacteristicDataEntity,ICharacteristicEntity } from '@libs/basics/interfaces';
import { Observable } from 'rxjs';
import { IEntityContext, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { BasicsCharacteristicSearchService } from './basics-characteristic-search.service';
import {ICharacteristicCodeLookupViewResult} from '../model/characteristic-code-lookup-view-result.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCharacteristicGroupCodeLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<ICharacteristicEntity, TEntity> {

	private sectionId: number = 1;
	protected basicsCharacteristicSearchService = ServiceLocator.injector.get(BasicsCharacteristicSearchService);
	public constructor() {
		const dialogBtn = new UiCommonLookupBtn('', '', (context?: ILookupContext<ICharacteristicEntity, TEntity>) => {
			this.dialogBtnOnExecute(context);
		});
		dialogBtn.css = {
			class:'control-icons ico-input-lookup'
		};
		super(
			{
				uuid: 'af78a8c028c246f898e8a3922b25f536',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogComponent: BasicsSharedCharacteristicCodeDialogComponent,
				showDialog: false,
				buttons: [dialogBtn], /// the second button,  dialog button
				dialogOptions: {
					headerText: {
						text: 'Code Lookup',
						key: 'basics.characteristic.header.codeLookup'
					},
					resizeable: false,
					//width:'800px',
					//height:'800px',
				},
				gridConfig: {
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'Code', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
							width: 80
						},
						{
							id: 'desc',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
							width: 150
						},
					]
				},

			});
	}

	/**
	 *  click the dialog button callback
	 * @param context
	 * @private
	 */
	private dialogBtnOnExecute(context?: ILookupContext<ICharacteristicEntity, TEntity>) {
		const lookUpContext = context as LookupContext<ICharacteristicEntity, TEntity>;
		if (lookUpContext) {
			const lookupInput = lookUpContext.lookupInput as UiCommonLookupInputComponent<ICharacteristicEntity, TEntity, number>;
			const lookUpViewService = ServiceLocator.injector.get(UiCommonLookupViewService);
			if (lookupInput) {
				lookUpViewService.openDialog(lookUpContext, lookupInput.config)?.then(e => {
					if (e.closingButtonId === StandardDialogButtonId.Ok && e.value && e.value.apply) {
						if(e.value.result){
							lookupInput.apply(e.value.result); ///todo apply dialog value to grid is not ready in framework,will back once ready
						}

						// call callBack to handle multiple selections
						const res = e.value as ICharacteristicCodeLookupViewResult<ICharacteristicEntity>;
						if(res.selectionExceptFirstHandle && res.selectionExceptFirst.length > 0) {
							res.selectionExceptFirstHandle(res.selectionExceptFirst);
						}
					}

				});
			}
		}
	}

	public override getList() {
		return new Observable<ICharacteristicEntity[]>(observer => {
				this.basicsCharacteristicSearchService.getList(this.sectionId).subscribe(res => {
					observer.next(res);
					observer.complete();
				});
			}
		);
	}

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<ICharacteristicEntity>> {
		const sectionId = get(request.additionalParameters, 'sectionId');
		this.sectionId = sectionId ?? 1;

		return new Observable((observer) => {
			ServiceLocator.injector.get(BasicsCharacteristicSearchService).getList(this.sectionId).subscribe(list => {
				observer.next(new LookupSearchResponse(list));
				observer.complete();
			});
		});
	}

	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<ICharacteristicEntity> {
		return new Observable<ICharacteristicEntity>(observer => {
			if(context) {
				const entity = context?.entity as ICharacteristicDataEntity;
				if (entity.CharacteristicEntity == null) {
					this.basicsCharacteristicSearchService.getItemByCharacteristicFk(entity.CharacteristicFk, this.sectionId).subscribe(item => {
						if (item !== null) {
							observer.next(item);
							observer.complete();
						}
					});
				} else {
					observer.next(entity.CharacteristicEntity);
					observer.complete();
				}
			} else {
				observer.next();
				observer.complete();
			}
		});
		//	});
	}
}
