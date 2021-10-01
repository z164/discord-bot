export default interface IDBotErrorProperties {
    messageToLog: string;
    messageToSend: string;
    type: DBotErrorType;
}

export type DBotErrorType = 'error' | 'warn';
