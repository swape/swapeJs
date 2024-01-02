export interface Config {
    templatesPath: string;
    startNode: string;
    errorPage?: string;
}
export interface SjsObj {
    config: Config;
    routes: Route[];
}
export interface Routes {
    add: (route: Route) => void;
}
export interface Route {
    templateUrl: string;
    path: string;
    controller?: (dynamicValues?: string[]) => void;
    startNode?: string;
    prefetch?: boolean;
}
export interface CachedTemplates {
    [key: string]: string;
}
