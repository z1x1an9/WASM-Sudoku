import { atom } from 'recoil';
import { OpTypes } from '../constants/OpTypes';
import { IBoardElement } from '../constants/IBoardElement';

export const LastOperationAtom = atom({
  key: 'lastOperation',
  default: {
    'last_ops': OpTypes.NULL,
    'payload': [] as IBoardElement[][],
    'compute_time': 0,
    'last_pos': [] as number[],
  }
});

export const MeasuredOperationAtom = atom({
  key: 'measuredOperation',
  default: {
    'measured_ops': OpTypes.NULL,
    'compute_time': 0,
  }
});