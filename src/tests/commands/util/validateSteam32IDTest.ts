import validateSteam32ID from "../../../commands/util/validateSteam32ID";

export default () => {
    it('Should return Steam32ID with type of number on success', () => {
        expect(validateSteam32ID('123562416')).toBe(123562416)
    });
    it('Should return false if ID is not valid', () => {
        expect(validateSteam32ID('notvalid')).toBe(false)
    })
};
