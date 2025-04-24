/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICosParameterEntity } from '@libs/constructionsystem/shared';
import { QuantityQueryEditorService, ContainerFlag, CosDefaultType } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterParameterDataService } from './construction-system-master-parameter-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterQuantityQueryEditorDataService extends QuantityQueryEditorService {
	public readonly parentService = inject(ConstructionSystemMasterParameterDataService);

	private readonly editableTypes = [CosDefaultType.PropertyOrQuantityQuery, CosDefaultType.QuantityQuery, CosDefaultType.QuantityQueryOrProperty];

	public constructor() {
		super(ContainerFlag.cosParameter);
	}

	public parameterSelectionChanged(): void {
		this.languageMenuService.selectedLanguageId = this.languageMenuService.defaultLanguageId;
		this.currentCosMasterParameterQuantityQueryTranslationEntity = null;

		const cosParameterDto = this.parentService.getSelectedEntity() as ICosParameterEntity;
		if (!!cosParameterDto && this.editableTypes.includes(cosParameterDto.CosDefaultTypeFk)) {
			// $scope.cmReadOnly = false; // todo-allen
		} else {
			// $scope.cmReadOnly = 'nocursor'; // todo-allen
			// $scope.cmDocValue = '';
		}

		this.languageMenuService.onLanguageSelectionChanged.next({ languageId: this.languageMenuService.selectedLanguageId, typeFlag: ContainerFlag.cosParameter });

		this.parentService.defaultTypeChanged.subscribe(() => {
			this.defaultTypeChanged();
		});
	}

	private defaultTypeChanged() {
		const headerRecord = this.parentService.getSelectedEntity();

		if (headerRecord && this.editableTypes.includes(headerRecord.CosDefaultTypeFk)) {
			this.setCMEditable();

			if (headerRecord.QuantityQueryInfo?.Description) {
				// self.cm.doc.setValue(headerRecord.QuantityQueryInfo.Description); // todo-allen:
			} else {
				// self.cm.doc.setValue(''); // todo-allen:
			}
		} else {
			if (this.currentCosMasterParameterQuantityQueryTranslationEntity) {
				this.currentCosMasterParameterQuantityQueryTranslationEntity = null;
				this.languageMenuService.selectedLanguageId = this.languageMenuService.defaultLanguageId;

				this.languageMenuService.onLanguageSelectionChanged.next({ languageId: this.languageMenuService.selectedLanguageId, typeFlag: ContainerFlag.cosParameter });
			}
		}

		this.setCMReadOnly();
		// self.cm.doc.setValue(''); // todo-allen:
	}
}
