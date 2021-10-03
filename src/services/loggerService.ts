import moment from 'moment';

import {THEMES} from '../commands/util/logUtilities';
import ILoggerProperties from '../interfaces/loggerProperties';
import loggerServiceConstants from './constants/loggerServiceConstants';

class LoggerService {
    private readonly properties: ILoggerProperties;

    constructor(properties: ILoggerProperties) {
        this.properties = properties;
    }

    private buildThemeString(
        message: string,
        font: string,
        background: string,
        styles?: string[]
    ): string {
        let stylesString = '';
        if (styles) {
            for (const style of styles) {
                stylesString += style;
            }
        }
        return `${font}${background}${stylesString}${message}${loggerServiceConstants.STYLES.Reset}`;
    }

    styleString(message: string, theme: THEMES): string {
        switch (theme) {
            case THEMES.ERROR:
                return this.buildThemeString(
                    message,
                    loggerServiceConstants.FONTCOLOR.White,
                    loggerServiceConstants.BGCOLOR.BgRed
                );
            case THEMES.LOG:
                return this.buildThemeString(
                    message,
                    loggerServiceConstants.FONTCOLOR.White,
                    loggerServiceConstants.BGCOLOR.BgGreen
                );
            case THEMES.WARNING:
                return this.buildThemeString(
                    message,
                    loggerServiceConstants.FONTCOLOR.Black,
                    loggerServiceConstants.BGCOLOR.BgYellow,
                    [loggerServiceConstants.STYLES.Bright]
                );
            case THEMES.TITLE:
            case THEMES.NICKNAME_STYLE:
                return this.buildThemeString(message, '', '', [
                    loggerServiceConstants.STYLES.Bright,
                    loggerServiceConstants.STYLES.Underscore,
                ]);
            case THEMES.SEPARATOR:
                return this.buildThemeString(message, loggerServiceConstants.FONTCOLOR.Red, '', [
                    loggerServiceConstants.STYLES.Bright,
                ]);
            default:
                break;
        }
    }

    private processTitle(message: string): string {
        if (!this.properties.colors) {
            return `[${moment(new Date()).format('H:mm:ss')}]` + message;
        }
        return (
            '[' +
            this.buildThemeString(
                moment(new Date()).format('H:mm:ss'),
                loggerServiceConstants.FONTCOLOR.Magenta,
                '',
                []
            ) +
            ']' +
            '[' +
            message +
            ']'
        );
    }

    private logWithProperties(message: string, layer: boolean, theme: THEMES): void {
        let styledString = message;
        if (!this.properties.enabled || !layer) {
            return;
        }
        if (!this.properties.colors) {
            console.log(styledString);
            return;
        }
        styledString = this.styleString(styledString, theme);
        if (theme === THEMES.TITLE) {
            styledString = this.processTitle(styledString);
        }
        console.log(styledString);
    }

    log(string: string): void {
        this.logWithProperties(string, this.properties.layers.log, THEMES.LOG);
    }

    warning(string: string): void {
        this.logWithProperties(string, this.properties.layers.warn, THEMES.WARNING);
    }

    error(string: string): void {
        this.logWithProperties(string, this.properties.layers.error, THEMES.ERROR);
    }

    title(string: string): void {
        this.logWithProperties(string, this.properties.layers.title, THEMES.TITLE);
    }

    separator(): void {
        this.logWithProperties(
            '----------------------------',
            this.properties.layers.separator,
            THEMES.SEPARATOR
        );
    }
}

export default new LoggerService({
    enabled: true,
    colors: true,
    layers: {
        log: true,
        warn: true,
        error: true,
        title: true,
        separator: true,
    },
});
