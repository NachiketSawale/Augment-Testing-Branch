/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { BusinesspartnerCertificateCertificateDataService } from '../../services/certificate-data.service';

/**
 * Businesspartner certificate pin borad Entity info model.
 */
export const BP_CERTIFICATE_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'b2167043a37a4512944edaa52986a6c3',
	permission: 'b2167043a37a4512944edaa52986a6c3',
	title: 'businesspartner.certificate.pinboard.certificateCommentTitle',
	commentQualifier: 'businesspartner.certificate.comment',
	commentType: CommentType.Standard,
    parentServiceToken: BusinesspartnerCertificateCertificateDataService
});