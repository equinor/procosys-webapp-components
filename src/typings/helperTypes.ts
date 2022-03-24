export type ChosenPerson = {
    id: number | null;
    name: string;
};

export type PunchFormData = {
    category: string;
    description: string;
    raisedBy: string;
    clearingBy: string;
    dueDate: string;
    type: string;
    sorting: string;
    priority: string;
    estimate: string;
};

export type PunchEndpoints = {
    updateCategory: string;
    updateDescription: string;
    updateRaisedBy: string;
    updateClearingBy: string;
    updateActionByPerson: string;
    updateDueDate: string;
    updateType: string;
    updateSorting: string;
    updatePriority: string;
    updateEstimate: string;
};

export type UpdatePunchData =
    | { CategoryId: number }
    | { Description: string }
    | { RaisedByOrganizationId: number }
    | { ClearingByOrganizationId: number }
    | { PersonId: number | null }
    | { DueDate: string | null }
    | { TypeId: number }
    | { SortingId: number }
    | { PriorityId: number }
    | { Estimate: number | null };
