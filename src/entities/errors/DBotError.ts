import IDBotErrorProperties, {DBotErrorType} from '../../interfaces/errorProperties';

export default class DBotError extends Error {
    private readonly messageToLog: string;
    private readonly messageToSend?: string;
    private readonly type: DBotErrorType;

    constructor(properties: IDBotErrorProperties) {
        super(properties.messageToLog);
        this.messageToLog = properties.messageToLog;
        this.messageToSend = properties.messageToSend;
        this.type = properties.type;
    }
}
