type BuildEndpoint = {
    getChecklistAttachments: (plantId: string, checklistId: string) => string;
    getPunchAttachments: (plantId: string, punchItemId: string) => string;
};

const buildEndpoint = (): BuildEndpoint => {
    const getChecklistAttachments = (
        plantId: string,
        checklistId: string
    ): string => {
        return `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=32`;
    };
    const getPunchAttachments = (
        plantId: string,
        punchItemId: string
    ): string => {
        return `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=32`;
    };
    return {
        getChecklistAttachments,
        getPunchAttachments,
    };
};

export default buildEndpoint;
