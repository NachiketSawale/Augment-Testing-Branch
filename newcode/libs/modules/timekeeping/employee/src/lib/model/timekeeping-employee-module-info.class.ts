
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TimekeepingEmployeeEntityInfoModel } from './timekeeping-employee-entity-info.model';
import { TimekeepingEmployeeCrewAssignmentModelEntityInfoModel } from './timekeeping-employee-crew-assignment-model-entity-info.model';
import { TimekeepingEmployeeCrewMemberModelEntityInfoModel } from './timekeeping-employee-crew-member-model-entity-info.model';
import { TimekeepingEmployeeCertificateEntityInfo } from './timekeeping-employee-certificate-entity-info.model';
import { TimekeepingEmployeeVacationAccountEntityInfo } from './timekeeping-vacation-account-entity-info.model';
import { TimekeepingEmployeeWorkingTimeAccountVEntityInfo } from './timekeeping-employee-working-time-account-v-entity-info.model';
import { TimekeepingEmployeePlannedAbsenceEntityInfo } from './timekeeping-employee-planned-absence-entity-info.model';
import { TimekeepingEmployeeSkillEntityInfo } from './timekeeping-employee-skill-entity-info.model';
import { TimekeepingEmployeeWorkingTimeModelEntityInfoModel } from './timekeeping-employee-working-time-model-entity-info.model';
import { TimekeepingEmployeeSkillDocumentEntityInfoModel } from './timekeeping-employee-skill-document-entity-info.model';
import { TimekeepingEmployeeDefaultModelEntityInfoModel } from './timekeeping-employee-default-model-entity-info.model';
import { TimekeepingEmployeeCharacteristicEnityInfoModel } from './timekeeping-employee-characteristic-enity-info.model';
import { TimekeepingEmployeeDocumentEntityInfoModel } from './timekeeping-employee-document-entity-info.model';
import { TimekeepingEmployeePictureEntityInfoModel } from './timekeeping-employee-picture-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { TimekeepingEmployeeMapComponent } from '../components/timekeeping-employee-map.component';

/**
 * Exports information about containers that will be rendered by this module.
 */
export class TimekeepingEmployeeModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingEmployeeModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingEmployeeModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingEmployeeModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Initializes the module information of timekeeping employee module
	 */
	private constructor() {
		super();
	}

	// lala

	/**
	 * Returns the internal name of the module
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'timekeeping.employee';
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return [TimekeepingEmployeeEntityInfoModel,TimekeepingEmployeeCrewAssignmentModelEntityInfoModel,TimekeepingEmployeeCrewMemberModelEntityInfoModel,TimekeepingEmployeeCertificateEntityInfo,TimekeepingEmployeeVacationAccountEntityInfo
		,TimekeepingEmployeeWorkingTimeAccountVEntityInfo,TimekeepingEmployeePlannedAbsenceEntityInfo,TimekeepingEmployeeSkillEntityInfo,TimekeepingEmployeeWorkingTimeModelEntityInfoModel
				,TimekeepingEmployeeSkillDocumentEntityInfoModel,TimekeepingEmployeeDefaultModelEntityInfoModel,TimekeepingEmployeeCharacteristicEnityInfoModel, TimekeepingEmployeeDocumentEntityInfoModel, TimekeepingEmployeePictureEntityInfoModel];
	}
	/**
	 * Loads the translation file
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'cloud.common',
			'basics.characteristic',
			'basics.clerk',
			'basics.company',
			'timekeeping.worktimemodel'
		]);
	}
	protected override get translationContainer(): string | undefined {
		return '31f3f1c12e2346b08da6f668c26c9174';
	}
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const baseContainers = [
			...super.containers,
			DrawingContainerDefinition.createPDFViewer({
				uuid: '5f4f0deab3a0426e95ef5832c8cb1dbe',
			}),
			new ContainerDefinition({
				containerType: TimekeepingEmployeeMapComponent,
				uuid: 'a300434e50774f38b70540765e8e53a0',
				title: { key: 'timekeeping.employee.employeeComponent' },
			}),
		];
		return baseContainers;
	}

}
