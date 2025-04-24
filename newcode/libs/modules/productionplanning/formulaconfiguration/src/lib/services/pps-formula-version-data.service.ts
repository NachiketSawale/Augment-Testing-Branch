/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject, } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IPpsFormulaEntity, IPpsFormulaVersionEntity, PpsFormulaCompleteEntity, PpsFormulaVersionCompleteEntity } from '../model/models';
import { PpsFormulaDataService } from './pps-formula-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class PpsFormulaVersionDataService extends DataServiceFlatNode<IPpsFormulaVersionEntity, PpsFormulaVersionCompleteEntity, IPpsFormulaEntity, PpsFormulaCompleteEntity> {
    private http = inject(HttpClient);
    private config = inject(PlatformConfigurationService);
    
	public constructor() {
		const options: IDataServiceOptions<IPpsFormulaVersionEntity> = {
			apiUrl: 'productionplanning/formulaconfiguration/formulaversion',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyformula',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsFormulaVersionEntity, IPpsFormulaEntity, PpsFormulaCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'PpsFormulaVersion',
                parent: inject(PpsFormulaDataService)
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsFormulaVersionEntity | null): PpsFormulaVersionCompleteEntity {
		const complete = new PpsFormulaVersionCompleteEntity();

		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PpsFormulaVersion = modified;
		}

		return complete;
	}

    public override getModificationsFromUpdate(complete: PpsFormulaVersionCompleteEntity): IPpsFormulaVersionEntity[] {
		if (complete.PpsFormulaVersion === null) {
			return [];
		}

		return [complete.PpsFormulaVersion!];
	}

    protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				formulaId: parentSelection.Id
			};
		}
		return {
			formulaId: -1
		};
	}

	protected override onLoadSucceeded(loaded: IPpsFormulaVersionEntity[]): IPpsFormulaVersionEntity[] {
		if (loaded) {
			return loaded;
		}
        
        this.createVersionAfterFormulaCreated(loaded);

		return [];
	}

    protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				Pkey1: parentSelection.Id
			};
		}
		throw new Error('please select a formula version first');
	}

    protected override onCreateSucceeded(created: IPpsFormulaVersionEntity): IPpsFormulaVersionEntity {
		return created;
	}

    public changeStatus() {
        return this.http.get(this.config.webApiBaseUrl + this.options.apiUrl + '/changestatus?versionId=' + this.getSelection()[0].Id);
    }

    public copyVersion(version: IPpsFormulaVersionEntity) {
        return this.http.post(this.config.webApiBaseUrl + this.options.apiUrl + '/copyversion', version);
    }

    private createVersionAfterFormulaCreated(result: IPpsFormulaVersionEntity[]) {
        // create a new version if parent item is just created.
        if (result.length === 0) {
            const parent = this.getSelectedParent();
            if (parent && parent.Version === 0) {
                this.create();
            }
        }
    }
}
