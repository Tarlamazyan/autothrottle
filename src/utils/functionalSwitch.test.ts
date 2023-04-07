import { functionalSwitch } from './functionalSwitch';

describe('functionalSwitch', () => {
  const actions = {
    action1: jest.fn(() => Promise.resolve('result1')),
    action2: jest.fn(() => Promise.resolve('result2')),
  };

  const defaultAction = jest.fn(() => Promise.resolve('defaultResult'));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call and return the result of the correct action based on the key', async () => {
    const result = await functionalSwitch('action1', actions, defaultAction);

    expect(result).toBe('result1');
    expect(actions.action1).toHaveBeenCalledTimes(1);
    expect(actions.action2).toHaveBeenCalledTimes(0);
    expect(defaultAction).toHaveBeenCalledTimes(0);
  });

  it('should call and return the result of the default action if key is not in actions', async () => {
    const result = await functionalSwitch('unknownAction', actions, defaultAction);

    expect(result).toBe('defaultResult');
    expect(actions.action1).toHaveBeenCalledTimes(0);
    expect(actions.action2).toHaveBeenCalledTimes(0);
    expect(defaultAction).toHaveBeenCalledTimes(1);
  });

  it('should return undefined if key is not in actions and no default action is provided', async () => {
    const result = await functionalSwitch('unknownAction', actions);

    expect(result).toBeUndefined();
    expect(actions.action1).toHaveBeenCalledTimes(0);
    expect(actions.action2).toHaveBeenCalledTimes(0);
  });
});
