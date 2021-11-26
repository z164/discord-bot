import colors from 'colors';
import moment from 'moment';

colors.setTheme({
    title: ['bold', 'underline'],
    nicknameStyle: ['bold', 'underline'],
    error: ['white', 'bgRed'],
    warning: ['bold', 'black', 'bgYellow'],
    log: ['bgGreen', 'white'],
    property: ['bgGreen', 'white', 'bold'],
    separator: ['bold', 'red'],
});

export enum THEMES {
    TITLE = 'title',
    NICKNAME_STYLE = 'nicknameStyle',
    ERROR = 'error',
    WARNING = 'warning',
    LOG = 'log',
    PROPERTY = 'property',
    SEPARATOR = 'separator',
}

export const parse = (string: string, theme: THEMES): string => {
    // @ts-ignore
    return string[theme];
};

export const separator = parse('----------------------------', THEMES.SEPARATOR);

export const title = (titleName: string) => {
    console.log(
        `[${moment(new Date()).format('H:mm:ss').magenta}][${parse(titleName, THEMES.TITLE)}]`,
    );
};
