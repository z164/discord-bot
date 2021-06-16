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

export enum themes {
    title = 'title',
    nicknameStyle = 'nicknameStyle',
    error = 'error',
    warning = 'warning',
    log = 'log',
    property = 'property',
    separator = 'separator',
}

export const parse = (string: string, theme: themes): string => {
    // @ts-ignore
    return string[theme];
};

export const separator = parse('----------------------------', themes.separator);

export const title = (titleName: string) => {
    console.log(`[${moment(new Date()).format('H:mm:ss').magenta}][${parse(titleName, themes.title)}]`);
};
