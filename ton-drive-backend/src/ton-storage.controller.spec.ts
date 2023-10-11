import { parseCreateCmdOutput } from './ton-storage.service';

describe('TonStorage', () => {
  describe('parse create cmd out', () => {
    it('should return BagId', () => {
      const out = ` Bag created
BagID = 8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEB2E40666D25DA89291F4930
Index = 0

stdout: Added: Tue Oct 10 16:52:06 2023
-----------------------------------
CreatedFromNest
-----------------------------------
Downloaded: 67KB/67KB (completed)
Dir name:`;

      expect(parseCreateCmdOutput(out)).toBe('8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEB2E40666D25DA89291F4930');
    });
  });
});
