import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticSundryServiceGroupAccountEntity extends IEntityIdentification, IEntityBase {

	 SundryServiceGroupFk: number;
	 LedgerContextFk: number;
	 ValidFrom?: Date;
	 ValidTo?: Date;
	 AccountTypeFk: number;
	 Account01Fk?: number;
	 Account02Fk?: number;
	 Account03Fk?: number;
	 Account04Fk?: number;
	 Account05Fk?: number;
	 Account06Fk?: number;
	 CommentText: string;
	 NominalDimension0101: string;
	 NominalDimension0102: string;
	 NominalDimension0103: string;
	 Controllinggrpdetail0101Fk: string;
	 Controllinggrpdetail0102Fk: string;
	 Controllinggrpdetail0103Fk: string;
	 NominalDimension0201: string;
	 NominalDimension0202: string;
	 NominalDimension0203: string;
	 Controllinggrpdetail0201Fk: string;
	 Controllinggrpdetail0202Fk: string;
	 Controllinggrpdetail0203Fk: string;
	 NominalDimension0301: string;
	 NominalDimension0302: string;
	 NominalDimension0303: string;
	 Controllinggrpdetail0301Fk: string;
	 Controllinggrpdetail0302Fk: string;
	 Controllinggrpdetail0303Fk: string;
	 NominalDimension0401: string;
	 NominalDimension0402: string;
	 NominalDimension0403: string;
	 Controllinggrpdetail0401Fk: string;
	 Controllinggrpdetail0402Fk: string;
	 Controllinggrpdetail0403Fk: string;
	 NominalDimension0501: string;
	 NominalDimension0502: string;
	 NominalDimension0503: string;
	 Controllinggrpdetail0501Fk: string;
	 Controllinggrpdetail0502Fk: string;
	 Controllinggrpdetail0503Fk: string;
	 NominalDimension0601: string;
	 NominalDimension0602: string;
	 NominalDimension0603: string;
	 Controllinggrpdetail0601Fk: string;
	 Controllinggrpdetail0602Fk: string;
	 Controllinggrpdetail0603Fk: string;
}
