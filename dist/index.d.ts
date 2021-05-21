import React from 'react';

type ChecklistProps = {
    checklistId: string;
    plantId: string;
    accessToken: string;
    baseUrl: string;
};

type AsyncCardProps = {
    fetchStatus: AsyncStatus;
    errorMessage: string;
    emptyContentMessage?: string;
    children: JSX.Element;
    cardTitle: string;
};

declare const Checklist: React.FC<ChecklistProps>;
declare const AsyncCard: React.FC<AsyncCardProps>;
export { Checklist, AsyncCard };
