import {Component, OnInit} from '@angular/core';
import {get, set} from 'lodash';
import {EntityContainerBaseComponent} from '@libs/ui/business-base';
import {BasicsTextModulesScope} from '../../model/basics-textmodules-scope';
import {TextFormatTypes} from '../../model/types/text-format.type';

@Component({
	selector: 'basics-textmodules-specification',
	templateUrl: './specification.component.html',
	styleUrl: './specification.component.scss',
})
export class SpecificationComponent<T extends object> extends EntityContainerBaseComponent<T> implements OnInit {
	public scope = new BasicsTextModulesScope();

	private currentSpecification = {
		Content: null,
		Id: 0,
		Version: 0
	};

	private modifiedSpecification = {};

	public constructor() {
		super();
	}

	public ngOnInit() {
		const parentScope = get(this.entitySelection, 'scope');
		if (parentScope){
			set(parentScope, 'textFormatFk' , TextFormatTypes.specification);
			set(parentScope, 'contentField' , 'TextBlob');
			set(parentScope, 'isVariableVisible' , true);
			set(parentScope, 'showTableBtn' , true);
		}
	}

	public getModifiedSpecification() {
		if (this.modifiedSpecification && get(this.modifiedSpecification, 'Id')) {
			return this.modifiedSpecification;
		} else {
			return null;
		}
	}

	public resetModifiedSpecification() {
		this.modifiedSpecification = {};
	}

	private getCurrentSpecification() {
		return this.currentSpecification;
	}

	public setText(value: string) {
		const elem = document.getElementById('wysiwyg-textarea');
		if (elem) {
			elem.innerHTML = value;
		}
	}

	public getText() {
		const parentScope = get(this.entitySelection, 'scope');
		return get(parentScope, 'oldContent');
	}

	private clearSpecification() {
		this.currentSpecification.Content = null;
		this.currentSpecification.Id = 0;
		this.currentSpecification.Version = 0;
	}
}
