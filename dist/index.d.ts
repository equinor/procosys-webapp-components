import React from 'react';

type ChecklistProps = {
    checklistId: string;
    plantId: string;
    accessToken: string;
    baseUrl: string;
};

declare const Checklist: React.FC<ChecklistProps>;
export default Checklist;
