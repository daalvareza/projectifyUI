export interface Report {
    _id: string;
    user: string;
    project: string;
    weekNumber: Number;
    hours: Number;
    year: Number;
    projectName?: string;
    dateRange?: string;
}