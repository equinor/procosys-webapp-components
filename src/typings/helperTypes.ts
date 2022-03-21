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
