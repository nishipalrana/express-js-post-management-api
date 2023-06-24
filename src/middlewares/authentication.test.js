const jwt = require('jsonwebtoken');
const { authenticate } = require('./authentication');

jest.mock('jsonwebtoken');

describe('authenticate middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if Authorization header is missing', async () => {
    req.header.mockReturnValue(null);

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if jwt.verify throws an error', async () => {
    req.header.mockReturnValue('Bearer token');
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.userId and call next if jwt.verify succeeds', async () => {
    req.header.mockReturnValue('Bearer token');
    const decodedToken = { userId: '123' };
    jwt.verify.mockReturnValue(decodedToken);

    await authenticate(req, res, next);

    expect(req.userId).toBe(decodedToken.userId);
    expect(next).toHaveBeenCalled();
  });
});
