import { Injectable } from '@angular/core';
import { ILookupContext, UiCommonLookupSimpleDataService } from '@libs/ui/common';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

export interface IBusinessPartnerEvaluationSchemaIconData {
	Id: number;
	Name: string;
	Description: string;
}

@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerEvaluationSchemaIconLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<IBusinessPartnerEvaluationSchemaIconData, TEntity> {
	public constructor() {
		super('schema.icon.processor', {
			uuid: '7bd8aa6de5d54e429791204de3cd7414',
			displayMember: 'Description',
			valueMember: 'Id',
			imageSelector: {
				select(item: IBusinessPartnerEvaluationSchemaIconData, context: ILookupContext<IBusinessPartnerEvaluationSchemaIconData, TEntity>): string {
					if (!item) {
						return '';
					}
					return 'control-icons ico-' + _.get(item, 'Name');
				},
				getIconType() {
					return 'css';
				},
			},
		});
	}

	public override getList(): Observable<IBusinessPartnerEvaluationSchemaIconData[]> {
		return new Observable((observer) => {
			observer.next(this.initIcons());
			observer.complete();
		});
	}

	public getListSync(){
		return this.initIcons();
	}

	protected initIcons() {
		const data = [];
		for (let outerIndex = 1; outerIndex <= 6; outerIndex++) {
			for (let interIndex = 0; interIndex <= 2; interIndex++) {
				data.push({
					Id: data.length + 1,
					Name: 'indicator' + outerIndex + '-' + interIndex,
					Description: ' ',
				});
			}
		}

		for (let outerIndex = 7; outerIndex <= 12; outerIndex++) {
			for (let interIndex = 0; interIndex <= 5; interIndex++) {
				data.push({
					Id: data.length + 1,
					Name: 'indicator' + outerIndex + '-' + interIndex,
					Description: ' ',
				});
			}
		}

		return data;
	}
}
