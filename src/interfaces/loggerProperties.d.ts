export default interface ILoggerProperties {
    enabled: boolean;
    colors?: boolean;
    separators?: boolean;
    layers?: ILayers;
}

interface ILayers {
    title: boolean;
    log: boolean;
    warn: boolean;
    error: boolean;
    separator: boolean;
}
