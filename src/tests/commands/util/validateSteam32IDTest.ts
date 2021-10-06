import DBotError from '../../../entities/errors/DBotError';
import steam32IDService from '../../../services/steam32IDService';
import mockMessageFactory from '../../mocks/mockMessageFactory';

const _: undefined = undefined;

export default () => {
    it('Should return Steam32ID with type of number on success', () => {
        const message = mockMessageFactory(_);
        expect(steam32IDService.validateSteam32ID(message, '123562416')).toBe(123562416);
    });
    it('Should throw error if ID is not valid', () => {
        const message = mockMessageFactory(_);
        try {
            steam32IDService.validateSteam32ID(message, 'notvalid');
        } catch (e) {
            if (e instanceof DBotError) {
                expect(e.messageToLog).toBe('Bad ID provided');
                expect(e.messageToSend).toBe('Please provide valid Steam 32ID');
            }
        }
    });
};
