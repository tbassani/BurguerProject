import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      token: null,
      userId: null,
      error: null,
      loading: false,
    });
  });

  it('should store token upon login', () => {
    expect(
      reducer(
        {
          token: null,
          userId: null,
          error: null,
          loading: false,
        },
        {
          type: actionTypes.AUTH_SUCCESS,
          idToken: 'some-token',
          userId: 'some-user',
        }
      )
    ).toEqual({
      token: 'some-token',
      userId: 'some-user',
      error: null,
      loading: false,
    });
  });
});
